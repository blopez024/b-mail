import { Pool } from 'pg';
import dotenv from 'dotenv';
import { Mail, EmailInfo, MailboxEmails } from './types';

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
  user: process.env.POSTGRES_USER,
  host: 'localhost',
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

/**
 * Check if a mailbox exists in the mail table
 * @param {string} mailboxName - The mailbox to check
 * @returns {Promise<boolean>} True if the mailbox exists, false otherwise
 */
const mailboxExists = async (mailboxName: string): Promise<boolean> => {
  const query = 'SELECT mailbox FROM mail WHERE mailbox = $1';
  const { rows } = await pool.query(query, [mailboxName]);
  return rows.length > 0;
};

/**
 * Build the query object for selecting mail from the mail table
 * @param {string?} mailbox - The mailbox to filter by
 * @returns {text: string, values: (string | undefined)[]} The query object
 */
const buildSelectMailQuery = (mailbox?: string) => {
  // Create the query object
  let select = 'SELECT id, mailbox, mail FROM mail';
  // Add the mailbox as a parameter if it is provided
  const values: (string | undefined)[] = [];

  // Add the mailbox filter if provided
  if (mailbox) {
    select += ' WHERE mailbox = $1';
    values.push(mailbox);
  }

  // Return the query object
  return { text: select, values };
};

// Function to group emails by mailbox name
/**
 * Group emails by mailbox name
 * @param {Array<{ id: number, mailbox: string, mail: Mail }>} rows - The rows to group
 * @returns {Record<string, EmailInfo[]>} An object with mailbox names as keys
 * and EmailInfo arrays as values
 */
const groupEmailsByMailbox = (
  rows: { id: number; mailbox: string; mail: Mail }[],
): Record<string, EmailInfo[]> => rows.reduce((acc, row) => {
  // Create an EmailInfo object from the row
  const emailInfo: EmailInfo = {
    id: row.id,
    'from-name': row.mail.from.name,
    'from-email': row.mail.from.email,
    'to-name': row.mail.to.name,
    'to-email': row.mail.to.email,
    subject: row.mail.subject,
    sent: row.mail.sent,
    received: row.mail.received,
  };

  // Add the email to the mailbox
  acc[row.mailbox] = acc[row.mailbox] || [];
  acc[row.mailbox].push(emailInfo);

  // Return the accumulator
  return acc;
}, {} as Record<string, EmailInfo[]>);

/**
 * Select all mail from the mail table with an optional mailbox filter
 * @param {string?} mailbox
 * @returns {Promise<MailboxEmails[]>} An array of MailboxEmails objects
 */
const selectAllMail = async (mailbox?: string): Promise<MailboxEmails[]> => {
  try {
    // Create the query object
    const query = buildSelectMailQuery(mailbox);

    // Execute the query and return the mail
    const {
      rows,
    }: {
      rows: { id: number; mailbox: string; mail: Mail }[];
    } = await pool.query(query);

    // Group the emails by mailbox
    const emailsByMailbox = groupEmailsByMailbox(rows);

    // Convert the emails by mailbox object to an array
    const emails: MailboxEmails[] = Object.entries(emailsByMailbox).map(
      ([name, mail]) => ({
        name,
        mail,
      }),
    );

    // Return the emails if any were found
    if (emails.length === 0) {
      return []; // No emails found
    }
    return emails;
  } catch (error) {
    // Catch any errors and log them
    console.error('Error querying the database:', error);
    throw new Error('Database query failed');
  }
};

export { mailboxExists, selectAllMail };
