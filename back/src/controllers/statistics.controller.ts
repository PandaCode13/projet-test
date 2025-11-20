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
      { $match: { time: { $gte: todayStart, $lte: todayEnd } } },
      { $lookup: { from: "products", localField: "product", foreignField: "_id", as: "product" } },
      { $unwind: "$product" },
      {
        $group: {
          _id: { $hour: "$time" },
          caffeine: { $sum: { $multiply: ["$product.caffeine", "$quantity"] } }
        }
      },
      { $sort: { "_id": 1 } },
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
      { $match: { time: { $gte: last30 } } },
      { $lookup: { from: "products", localField: "product", foreignField: "_id", as: "product" } },
      { $unwind: "$product" },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$time" } },
          totalSugar: { $sum: { $multiply: ["$product.sugar", "$quantity"] } },
          totalCaffeine: { $sum: { $multiply: ["$product.caffeine", "$quantity"] } },
          totalCalories: { $sum: { $multiply: ["$product.calories", "$quantity"] } }
        }
      },
      {
        $match: {
          $or: [
            { totalSugar: { $gt: THRESHOLD_SUGAR } },
            { totalCaffeine: { $gt: THRESHOLD_CAFFEINE } },
            { totalCalories: { $gt: THRESHOLD_CALORIES } }
          ]
        }
      },
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
export const getAnalytics = async (_req: Request, res: Response) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    // 1️⃣ Get all consumptions for the last 30 days with product and user info
    const consumptions = await Consumption.aggregate([
      { $match: { time: { $gte: thirtyDaysAgo } } },
      { $lookup: { from: "products", localField: "product", foreignField: "_id", as: "product" } },
      { $unwind: "$product" },

      // 3️⃣ Project fields needed
      {
        $project: {
          productId: "$product._id",
          productName: "$product.name",
          contributorId: 1,
          sugar: { $multiply: ["$product.sugar", "$quantity"] },
          caffeine: { $multiply: ["$product.caffeine", "$quantity"] },
          calories: { $multiply: ["$product.calories", "$quantity"] },
          date: { $dateToString: { format: "%Y-%m-%d", date: "$time" } }
        }
      },

      // 3️⃣ Facet to compute multiple metrics in parallel
      {
        $facet: {
          // Top 10 consumed products by count
          topProducts: [
            { $group: { _id: "$productId", name: { $first: "$productName" }, count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
          ],

          // Top products by sugar, caffeine, calories
          topNutrients: [
            {
              $group: {
                _id: "$productId",
                name: { $first: "$productName" },
                totalSugar: { $sum: "$sugar" },
                totalCaffeine: { $sum: "$caffeine" },
                totalCalories: { $sum: "$calories" }
              }
            },
            {
              $group: {
                _id: null,
                products: {
                  $push: {
                    name: "$name",
                    sugar: "$totalSugar",
                    caffeine: "$totalCaffeine",
                    calories: "$totalCalories"
                  }
                }
              }
            },
            {
              $project: {
                _id: 0,
                totalSugar: { $sum: "$products.sugar" },
                totalCaffeine: { $sum: "$products.caffeine" },
                totalCalories: { $sum: "$products.calories" },
                products: 1
              }
            },
            {
              $project: {
                topSugar: {
                  $slice: [
                    {
                      $map: {
                        input: { $sortArray: { input: "$products", sortBy: { sugar: -1 } } },
                        as: "p",
                        in: {
                          name: "$$p.name",
                          value: "$$p.sugar",
                          percentage: {
                            $cond: [
                              { $eq: ["$totalSugar", 0] },
                              0,
                              { $multiply: [{ $divide: ["$$p.sugar", "$totalSugar"] }, 100] }
                            ]
                          }
                        }
                      }
                    },
                    4
                  ]
                },

                remainingSugarPercentage: {
                  $let: {
                    vars: {
                      topFour: {
                        $slice: [
                          {
                            $sortArray: { input: "$products", sortBy: { sugar: -1 } }
                          },
                          4
                        ]
                      }
                    },
                    in: {
                      $cond: [
                        { $eq: ["$totalSugar", 0] },
                        0,
                        {
                          $multiply: [
                            {
                              $divide: [
                                {
                                  $subtract: [
                                    "$totalSugar",
                                    { $sum: "$$topFour.sugar" }
                                  ]
                                },
                                "$totalSugar"
                              ]
                            },
                            100
                          ]
                        }
                      ]
                    }
                  }
                },
                topCaffeine: {
                  $slice: [
                    {
                      $map: {
                        input: { $sortArray: { input: "$products", sortBy: { caffeine: -1 } } },
                        as: "p",
                        in: {
                          name: "$$p.name",
                          value: "$$p.caffeine",
                          percentage: {
                            $cond: [
                              { $eq: ["$totalCaffeine", 0] },
                              0,
                              { $multiply: [{ $divide: ["$$p.caffeine", "$totalCaffeine"] }, 100] }
                            ]
                          }
                        }
                      }
                    },
                    4
                  ]
                },

                remainingCaffeinePercentage: {
                  $let: {
                    vars: {
                      topFour: {
                        $slice: [
                          {
                            $sortArray: { input: "$products", sortBy: { caffeine: -1 } }
                          },
                          4
                        ]
                      }
                    },
                    in: {
                      $cond: [
                        { $eq: ["$totalCaffeine", 0] },
                        0,
                        {
                          $multiply: [
                            {
                              $divide: [
                                {
                                  $subtract: [
                                    "$totalCaffeine",
                                    { $sum: "$$topFour.caffeine" }
                                  ]
                                },
                                "$totalCaffeine"
                              ]
                            },
                            100
                          ]
                        }
                      ]
                    }
                  }
                },
                topCalories: {
                  $slice: [
                    {
                      $map: {
                        input: { $sortArray: { input: "$products", sortBy: { calories: -1 } } },
                        as: "p",
                        in: {
                          name: "$$p.name",
                          value: "$$p.calories",
                          percentage: {
                            $cond: [
                              { $eq: ["$totalCalories", 0] },
                              0,
                              { $multiply: [{ $divide: ["$$p.calories", "$totalCalories"] }, 100] }
                            ]
                          }
                        }
                      }
                    },
                    4
                  ]
                },

                remainingCaloriesPercentage: {
                  $let: {
                    vars: {
                      topFour: {
                        $slice: [
                          {
                            $sortArray: { input: "$products", sortBy: { calories: -1 } }
                          },
                          4
                        ]
                      }
                    },
                    in: {
                      $cond: [
                        { $eq: ["$totalCalories", 0] },
                        0,
                        {
                          $multiply: [
                            {
                              $divide: [
                                {
                                  $subtract: [
                                    "$totalCalories",
                                    { $sum: "$$topFour.calories" }
                                  ]
                                },
                                "$totalCalories"
                              ]
                            },
                            100
                          ]
                        }
                      ]
                    }
                  }
                }
              }
            }
          ],

          // Top contributors by total intake
          topContributors: [
            { $lookup: { from: "users", localField: "contributorId", foreignField: "_id", as: "user" } },
            { $unwind: "$user" },
            {
              $group: {
                _id: "$contributorId",
                firstName: { $first: "$user.firstName" },
                lastName: { $first: "$user.lastName" },
                totalContributions: { $sum: 1 }
              }
            },
            {
              $project: {
                _id: 1,
                name: { $concat: ["$firstName", " ", "$lastName"] },
                totalContributions: 1
              }
            },
            { $sort: { totalContributions: -1 } },
            { $limit: 10 }
          ],

          // Daily summary averages
          dailySummary: [
            { $group: { _id: "$date", dailySugar: { $sum: "$sugar" }, dailyCaffeine: { $sum: "$caffeine" } } },
            {
              $group: {
                _id: null,
                avgSugar: { $avg: "$dailySugar" },
                avgCaffeine: { $avg: "$dailyCaffeine" },
              }
            }
          ],

          // Days exceeding thresholds
          exceededDays: [
            { $group: { _id: "$date", totalSugar: { $sum: "$sugar" }, totalCaffeine: { $sum: "$caffeine" }, totalCalories: { $sum: "$calories" } } },
            {
              $match: {
                $or: [
                  { totalSugar: { $gt: THRESHOLD_SUGAR } },
                  { totalCaffeine: { $gt: THRESHOLD_CAFFEINE } },
                  { totalCalories: { $gt: THRESHOLD_CALORIES } }
                ]
              }
            },
            { $count: "numExceededDays" }
          ],

          // Overall trend (compare first 15 days vs last 15 days)
          trend: [
            { $group: { _id: "$date", dailySugar: { $sum: "$sugar" }, dailyCaffeine: { $sum: "$caffeine" } } },
            { $sort: { _id: 1 } },
            {
              $group: {
                _id: null,
                dates: { $push: "$_id" },
                sugarValues: { $push: "$dailySugar" },
                caffeineValues: { $push: "$dailyCaffeine" }
              }
            },
            {
              $project: {
                sugarFirstHalf: { $slice: ["$sugarValues", 0, 15] },
                sugarSecondHalf: { $slice: ["$sugarValues", 15, 15] },
                caffeineFirstHalf: { $slice: ["$caffeineValues", 0, 15] },
                caffeineSecondHalf: { $slice: ["$caffeineValues", 15, 15] }
              }
            },
            {
              $project: {
                sugarTrend: { $cond: [{ $gt: [{ $avg: "$sugarSecondHalf" }, { $avg: "$sugarFirstHalf" }] }, "increasing", "decreasing"] },
                caffeineTrend: { $cond: [{ $gt: [{ $avg: "$caffeineSecondHalf" }, { $avg: "$caffeineFirstHalf" }] }, "increasing", "decreasing"] }
              }
            }
          ]
        }
      }
    ]);

    return res.status(200).json(consumptions[0]);
  } catch (error) {
    console.error('Error fetching analytics data: ', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

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
