import { Consumption } from '#models/consumption.model.js';
import { Statistics } from '#models/statistics.model.js';
import { endOfDay, startOfDay } from '#utils/date.js';
import { Request, Response } from 'express-serve-static-core';
const THRESHOLD_SUGAR = 50; // grams
const THRESHOLD_CAFFEINE = 4; // g
const THRESHOLD_CALORIES = 2000; // kcal
export const dashboardStatistics = async (_req: Request, res: Response) => {
  try {
    const latestStats = await Statistics.find().sort({ date: -1 });
    // get Last 7 days sugar consumption
    // const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const last7DaysSugar = await Consumption.aggregate([
      { $match: { time: { $gte: sevenDaysAgo } } },

      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },

      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$time" } },
          totalSugar: { $sum: { $multiply: ["$product.sugar", "$quantity"] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    // get Caffeine by time (today)
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const caffeineEvolution = await Consumption.aggregate([
      // 1️⃣ Filter only today's consumptions
      { $match: { time: { $gte: todayStart, $lte: todayEnd } } },

      // 2️⃣ Join product data
      { $lookup: { from: "products", localField: "product", foreignField: "_id", as: "product" } },
      { $unwind: "$product" },

      // 3️⃣ Group by hour of day
      {
        $group: {
          _id: { $hour: "$time" },
          caffeine: { $sum: { $multiply: ["$product.caffeine", "$quantity"] } }
        }
      },

      // 4️⃣ Sort by hour ascending
      { $sort: { "_id": 1 } },

      // 5️⃣ Compute cumulative sum using $setWindowFields
      {
        $setWindowFields: {
          sortBy: { "_id": 1 },
          output: {
            cumulativeCaffeine: {
              $sum: "$caffeine",
              window: {
                documents: ["unbounded", "current"]
              }
            }
          }
        }
      },

      // 6️⃣ Project final fields
      {
        $project: {
          _id: 0,
          hour: "$_id",
          cumulativeCaffeine: 1
        }
      }
    ]);
    // get Avg sugar/day (last 30 days)
    const last30 = new Date();
    last30.setDate(last30.getDate() - 30);

    const avgSugar = await Consumption.aggregate([
      { $match: { time: { $gte: last30 } } },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$time" } },
          sugar: { $sum: { $multiply: ["$product.sugar", "$quantity"] } }
        }
      },
      {
        $group: {
          _id: null,
          avgDailySugar: { $avg: "$sugar" }
        }
      }
    ]);
    // get Avg caffeine/day (last 30 days)
    const avgCaffeine = await Consumption.aggregate([
      { $match: { time: { $gte: last30 } } },

      { $lookup: { from: "products", localField: "product", foreignField: "_id", as: "product" } },
      { $unwind: "$product" },

      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$time" } },
          caffeine: { $sum: { $multiply: ["$product.caffeine", "$quantity"] } }
        }
      },
      {
        $group: {
          _id: null,
          avgDailyCaffeine: { $avg: "$caffeine" }
        }
      }
    ]);
    // get Most consumed product (last 30 days)
    const mostConsumed = await Consumption.aggregate([
      { $match: { time: { $gte: last30 } } },

      {
        $group: {
          _id: "$product",
          count: { $sum: "$quantity" }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 1 },

      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" }
    ]);
    // get Top sugar contributor (product with most sugar)
    const topSugarProduct = await Consumption.aggregate([
      { $match: { time: { $gte: last30 } } },

      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },

      {
        $group: {
          _id: "$product._id",
          name: { $first: "$product.name" },
          totalSugar: { $sum: { $multiply: ["$product.sugar", "$quantity"] } }
        }
      },
      { $sort: { totalSugar: -1 } },
      { $limit: 1 }
    ]);
    // get Alert history (dates when limits were exceeded)
    const alertHistory = await Consumption.aggregate([
      // 1️⃣ Filter last 30 days
      { $match: { time: { $gte: last30 } } },

      // 2️⃣ Join product data
      { $lookup: { from: "products", localField: "product", foreignField: "_id", as: "product" } },
      { $unwind: "$product" },

      // 3️⃣ Group by day, sum sugar, caffeine, calories
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$time" } },
          totalSugar: { $sum: { $multiply: ["$product.sugar", "$quantity"] } },
          totalCaffeine: { $sum: { $multiply: ["$product.caffeine", "$quantity"] } },
          totalCalories: { $sum: { $multiply: ["$product.calories", "$quantity"] } }
        }
      },

      // 4️⃣ Keep only days exceeding any threshold
      {
        $match: {
          $or: [
            { totalSugar: { $gt: THRESHOLD_SUGAR } },
            { totalCaffeine: { $gt: THRESHOLD_CAFFEINE } },
            { totalCalories: { $gt: THRESHOLD_CALORIES } }
          ]
        }
      },

      // 5️⃣ Project only date and exceeded nutrients
      {
        $project: {
          _id: 0,
          date: "$_id",
          exceeded: {
            $setUnion: [
              { $cond: [{ $gt: ["$totalSugar", THRESHOLD_SUGAR] }, ["sugar"], []] },
              { $cond: [{ $gt: ["$totalCaffeine", THRESHOLD_CAFFEINE] }, ["caffeine"], []] },
              { $cond: [{ $gt: ["$totalCalories", THRESHOLD_CALORIES] }, ["calories"], []] }
            ]
          }
        }
      },
      { $limit: 8 },
      // 6️⃣ Sort by date ascending
      { $sort: { date: -1 } }
    ]);

    return res.status(200).json({
      latestStats: latestStats[0] || null,
      sugarByDay: last7DaysSugar,
      caffeineEvolution,
      avgDailySugar: avgSugar[0]?.avgDailySugar || 0,
      avgDailyCaffeine: avgCaffeine[0]?.avgDailyCaffeine || 0,
      mostConsumedProduct: mostConsumed[0]?.product || null,
      topSugarProduct: topSugarProduct[0] || null,
      alertHistory
    });
  } catch (error) {
    console.error('Error fetching dashboard statistics: ', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export const getStatistics = async (req: Request, res: Response) => {
  try {
    const { limit } = req.query;
    const statistics = await Statistics.find()
      .sort({ date: -1 })
      .limit(limit ? parseInt(limit as string) : 7);

    return res.status(200).json(statistics);
  } catch (error) {
    console.error('Error fetching statistics: ', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const averageStatistics = async (_req: Request, res: Response) => {
  try {
    const result = await Statistics.aggregate([
      {
        $group: {
          _id: null,
          avgSugar: { $avg: '$totalSugar' },
          avgCaffeine: { $avg: '$totalCaffeine' },
          avgCalories: { $avg: '$totalCalories' },
          avgConsumptions: { $avg: '$totalConsumptions' }
        }
      }
    ]);

    const averages = result[0] || {
      avgSugar: 0,
      avgCaffeine: 0,
      avgCalories: 0,
      avgConsumptions: 0
    };
    return res.status(200).json(averages);
  } catch (error) {
    console.error('Error fetching average statistics: ', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



export const getExceedingDaysCount = async (_req: Request, res: Response) => {
  try {
    const count = await Statistics.countDocuments({
      $or: [
        { totalSugar: { $gt: THRESHOLD_SUGAR } },
        { totalCaffeine: { $gt: THRESHOLD_CAFFEINE } },
        { totalCalories: { $gt: THRESHOLD_CALORIES } }
      ]
    });

    return res.status(200).json({ exceedingDaysCount: count });
  } catch (error) {
    console.error('Error fetching exceeding days count: ', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMostActiveContributor = async (_req: Request, res: Response) => {
  try {
    const result = await Consumption.aggregate([
      {
        $group: {
          _id: '$contributorId',
          consumptionCount: { $sum: 1 }
        }
      },
      { $sort: { consumptionCount: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'contributor'
        }
      },
      { $unwind: '$contributor' }
    ]);
    if (result.length === 0) {
      return res.status(404).json({ message: 'No consumption data found' });
    }
    const mostActiveContributor = {
      contributorId: result[0]._id,
      name: result[0].contributor.name,
      consumptionCount: result[0].consumptionCount
    };
    return res.status(200).json(mostActiveContributor);
  } catch (error) {
    console.error('Error fetching most active contributor: ', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
