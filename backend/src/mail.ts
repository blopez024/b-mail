import { Request, Response } from 'express';
import { selectAllMail, mailboxExists } from './db';

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

// const getByID = async (req: Request, res: Response): Promise<void> => { };
// const postMail = async (req: Request, res: Response): Promise<void> => { };
// const moveMail = async (req: Request, res: Response): Promise<void> => { };

export {
  getMailbox, // getByID, postMail, moveMail,
};
