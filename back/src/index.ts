import connectDB from '#config/db.js';
import { env } from '#config/index.js';
import authRouter from '#routes/auth.routes.js';
import productRouter from '#routes/product.routes.js';
import consumptionRouter from '#routes/consumption.routes.js';
import statisticsRouter from '#routes/statistics.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

const app: Express = express();

const PORT = env.PORT;

app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cookieParser());
app.use(express.json());

// Routers
app.use('/api/auth', authRouter);
app.use('/api/products', productRouter)
app.use('/api/consumptions', consumptionRouter)
app.use('/api', statisticsRouter)
const server = app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('SIGINT: Shutting down server...');
  server.close();
  process.exit();
});
process.on('SIGTERM', () => {
  console.log('SIGTERM: Shutting down server...');
  server.close();
  process.exit();
});
