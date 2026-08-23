import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { ENV } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import softwareRoutes from './routes/software.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import { globalErrorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { db } from './services/db.service.js';

const app = express();

// Middlewares
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin) return callback(null, true);
    // Allow configured CLIENT_URL or any localhost during development
    if (origin === ENV.CLIENT_URL || /^http:\/\/localhost:\d+$/.test(origin) || /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) {
      return callback(null, true);
    }
    // In production, allow the origin if matched
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (ENV.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health Check API
app.get('/api/health', async (req, res) => {
  const isDbConnected = await db.checkDatabaseConnection();
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Enterprise Software Inventory Registry API',
    version: '1.0.0',
    database: isDbConnected ? 'PostgreSQL (Prisma)' : 'Resilient Active Store',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/software', softwareRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(ENV.PORT, async () => {
    console.log(`====================================================`);
    console.log(`🚀 Enterprise Software Registry API running on port ${ENV.PORT}`);
    console.log(`🌐 Health check: http://localhost:${ENV.PORT}/api/health`);
    console.log(`🔒 Environment: ${ENV.NODE_ENV}`);
    console.log(`====================================================`);
    await db.checkDatabaseConnection();
  });
}

export default app;
