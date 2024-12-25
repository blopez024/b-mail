import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import swaggerUi from 'swagger-ui-express';
import * as OpenApiValidator from 'express-openapi-validator';
import cors from 'cors';
import helmet from 'helmet';
import {
  getMailbox, // getByID, postMail, moveMail,
} from './mail';

// Custom error interface
interface CustomError extends Error {
  status?: number;
  errors?: unknown[];
}

// Create a new Express application
const app = express();

// Security middleware
app.use(helmet());

// Enable CORS
app.use(cors());

// Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Load the API specification
const apiSpec = path.join(__dirname, '../api/openapi.yaml');
const apidoc = yaml.load(fs.readFileSync(apiSpec, 'utf8')) as Record<
  string,
  unknown
>;

// Serve the API documentation
app.use('/v0/api-docs', swaggerUi.serve, swaggerUi.setup(apidoc));

// OpenAPI validation middleware
app.use(
  OpenApiValidator.middleware({
    apiSpec,
    validateRequests: true,
    validateResponses: true,
  }),
);

// Route for the mail endpoints
app.get('/v0/mail', getMailbox);
// app.get('/v0/mail/:id', getByID);
// app.post('/v0/mail', postMail);
// app.put('/v0/mail/:id', moveMail);

// Error handling middleware
app.use((err: CustomError, req: Request, res: Response) => {
  console.error(err); // Log the error
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors || [],
    status: err.status || 500,
  });
});

export { app };
