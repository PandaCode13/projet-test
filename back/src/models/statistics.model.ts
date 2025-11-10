import { model, Schema } from 'mongoose';

export interface IStatistics {
  date: Date;
  totalConsumptions: number;
  totalSugar: number;
  totalCaffeine: number;
  totalCalories: number;
}

const statisticsSchema = new Schema<IStatistics>(
  {
    date: { type: Date, required: true, unique: true },
    totalConsumptions: { type: Number, required: true, default: 0 },
    totalSugar: { type: Number, required: true, default: 0 },
    totalCaffeine: { type: Number, required: true, default: 0 },
    totalCalories: { type: Number, required: true, default: 0 }
  },
  { timestamps: true }
);

export const Statistics = model('Statistics', statisticsSchema);
