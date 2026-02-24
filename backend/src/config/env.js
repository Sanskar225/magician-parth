const logger = require('../utils/logger');

const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
  'JWT_SECRET',
  'JWT_EXPIRE'
];

// Check required environment variables
const checkEnv = () => {
  const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missingVars.length > 0) {
    logger.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
  }

  // Validate NODE_ENV
  const validEnvs = ['development', 'production', 'test'];
  if (!validEnvs.includes(process.env.NODE_ENV)) {
    logger.error(`NODE_ENV must be one of: ${validEnvs.join(', ')}`);
    process.exit(1);
  }

  logger.info('Environment variables validated successfully');
};

// Export configuration
module.exports = {
  checkEnv,
  env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT),
  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === 'true'
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE
  },
  email: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.EMAIL_FROM
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD
  },
  upload: {
    path: process.env.UPLOAD_PATH,
    maxSize: parseInt(process.env.MAX_FILE_SIZE)
  },
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || []
  },
  rateLimit: {
    window: parseInt(process.env.RATE_LIMIT_WINDOW),
    max: parseInt(process.env.RATE_LIMIT_MAX)
  }
};