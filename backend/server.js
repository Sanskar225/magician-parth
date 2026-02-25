const dotenv = require('dotenv');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

dotenv.config({ path: './.env' });

const app = require('./src/app');
const { sequelize } = require('./src/config/database');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 5000;

let server;

// Database connection and server start
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');

    // Sync database (in production, use migrations instead)
    // Sync database// Sync database only in development OR if explicitly enabled
if (
  process.env.NODE_ENV === 'development' ||
  process.env.FORCE_SYNC === 'true'
) {
  await sequelize.sync({ alter: true });
  logger.info('Database synced successfully');
}

    // Start server
    server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    });
  } catch (error) {
    logger.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  logger.error(err.stack);
  
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
  
  if (server) {
    server.close(() => {
      logger.info('💥 Process terminated!');
    });
  }
});