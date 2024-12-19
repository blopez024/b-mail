import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

// Check if required environment variables are set
const requiredEnvVars = ['POSTGRES_DB', 'POSTGRES_USER', 'POSTGRES_PASSWORD'];
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    // Throw an error if the environment variable is not set
    throw new Error(`Environment variable ${envVar} is required`);
  }
});

// Create a new pool for connecting to the database server
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

// Select the first row from the dummy table
const selectDummy = async (): Promise<string> => {
  try {
    // Create the query object
    const select = 'SELECT * FROM dummy';
    const query = {
      text: select,
      values: [],
    };

    // Execute the query and return the created date
    const { rows } = await pool.query(query);
    return rows[0]?.created || 'Unknown';
  } catch (error) {
    // Catch any errors and log them
    console.error('Error querying the database:', error);
    throw new Error('Database query failed');
  }
};

export { selectDummy };
