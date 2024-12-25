import { Request, Response } from 'express';
import { selectAllMail, mailboxExists } from './db';

/**
 * Get all mail from the mail table
 * @param {Request} req
 * @param {Response} res
 */
const getMailbox = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get the mailbox from the query parameters
    const mailbox = req.query.mailbox as string;
    const mail = await selectAllMail(mailbox);

    if (!mailboxExists(mailbox)) {
      res.status(404).send();
    }

    res.status(200).json(mail);
  } catch (error) {
    // Log the error
    console.error('Error getting mail:', error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

const getByID = async (req: Request, res: Response): Promise<void> => { };
const postMail = async (req: Request, res: Response): Promise<void> => { };
const moveMail = async (req: Request, res: Response): Promise<void> => { };

export {
  getMailbox, getByID, postMail, moveMail,
};
