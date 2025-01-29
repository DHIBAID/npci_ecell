// app.js
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const authRouter = require('./routes/auth');
const rewardsRouter = require('./routes/rewards');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Universal Rewards API',
      version: '1.0.0',
      description: 'API for managing universal reward points',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Development server' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/rewards', rewardsRouter);

// Error handler
app.use(errorHandler);

module.exports = app;
