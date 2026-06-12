import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './shared/middleware/errorHandler';
import { authRoutes } from './modules/auth/auth.routes';
import { config } from './config';
import { requestLogger } from './shared/middleware/requestLogger';

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    config.FRONTEND_URL,
  ].filter(Boolean) as string[],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-registration-token"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(requestLogger);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Centralized error handling
app.use(errorHandler);

export { app };
