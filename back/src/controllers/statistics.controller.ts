import { Consumption } from '#models/consumption.model.js';
import { Statistics } from '#models/statistics.model.js';
import { Request, Response } from 'express-serve-static-core';

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

const THRESHOLD_SUGAR = 50; // grams
const THRESHOLD_CAFFEINE = 400; // mg
const THRESHOLD_CALORIES = 2000; // kcal

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
