import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Search for .env in current working dir, server dir, or project root
const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'server', '.env'),
  path.resolve(__dirname, '..', '..', '.env'),
  path.resolve(__dirname, '..', '..', '..', '.env'),
];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  JWT_SECRET: process.env.JWT_SECRET || 'enterprise_super_secret_jwt_key_2026_secure',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@enterprise.internal',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'Admin@123456',
  ADMIN_NAME: process.env.ADMIN_NAME || 'Enterprise System Administrator',
};
