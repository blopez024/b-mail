import dotenv from 'dotenv';
import { app } from './app';

// Load environment variables from the .env file
dotenv.config();

// Get the port from the environment variables
const PORT = process.env.PORT || 3010;

// Start the server
app.listen(PORT, (err?: Error) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server Running on port ${PORT}`);
  console.log(`API Testing UI: http://localhost:${PORT}/v0/api-docs/`);
});
