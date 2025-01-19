import { Request, Response } from 'express';
import { selectAllMail, mailboxExists, selectMailByID } from './db';

/**
 * Get all mail from the mailbox
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */
const getMailbox = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get the mailbox from the query parameters
    const mailboxName = req.query.mailbox as string;

    // Check if mailbox is not null
    if (mailboxName) {
      // Check if the mailbox exists
      const exists = await mailboxExists(mailboxName);
      // If the mailbox does not exist, return a 404 response
      if (!exists) {
        console.log(`Mailbox [${mailboxName}] does not exist.`);
        res.status(404).send();
        return;
      }
    }

    // Get all mail from the mailbox
    const mail = await selectAllMail(mailboxName);
    res.status(200).json(mail);
  } catch (error) {
    // Log the error
    console.error('Error getting mail:', error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

/**
 * Get mail by ID
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */
const getByID = async (req: Request, res: Response): Promise<void> => {
  // Define a regular expression to validate UUIDs
  // https://stackoverflow.com/questions/7905929/how-to-test-valid-uuid-guid
  const VALID_UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  try {
    // Get the mail ID from the request parameters
    const { id } = req.params;
    // Check if the mail ID is a valid UUID
    const validMailID = id.match(VALID_UUID_REGEX)?.length === 1;

    // If the mail ID is not a valid UUID, return a 404 response
    if (!validMailID) {
      console.log(`Mail ID [${id}] is not a valid UUID.`);
      res.status(404).send();
      return;
    }
    // Get the mail by ID
    const mail = await selectMailByID(id);
    res.status(200).json(mail);
  } catch (error) {
    // Log the error
    console.error('Error getting mail by ID:', error);
    res.status(404).send();
  }
};
// const postMail = async (req: Request, res: Response): Promise<void> => { };
// const moveMail = async (req: Request, res: Response): Promise<void> => { };

export {
  getMailbox, getByID, // postMail, moveMail,
};
