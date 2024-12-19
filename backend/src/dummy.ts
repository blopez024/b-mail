import { Request, Response } from 'express';
import { selectDummy } from './db';

// Get the created date from the dummy table
const get = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get the created date
    const createdDate = await selectDummy();
    // Send the response
    res.status(200).json({
      message: `Welcome to b-mail @ ${new Date().toString()} [ Database created ${createdDate} ]`,
    });
  } catch (error) {
    // Log the error
    console.error('Error getting the created date:', error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

export { get };
