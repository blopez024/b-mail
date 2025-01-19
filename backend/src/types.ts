// Define the Mail interface
interface Mail {
    from: {
        name: string;
        email: string;
    };
    to: {
        name: string;
        email: string;
    };
    subject: string;
    sent: string;
    received: string;
    content: string;
}

// Define the EmailInfo interface
interface EmailInfo {
    id: number;
    'from-name': string;
    'from-email': string;
    'to-name': string;
    'to-email': string;
    subject: string;
    sent: string;
    received: string;
}

// Define the MailboxEmails interface
interface MailboxEmails {
    name: string;
    mail: EmailInfo[];
}

export { Mail, EmailInfo, MailboxEmails };
