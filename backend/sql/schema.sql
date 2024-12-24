-- Dummy table --
DROP TABLE IF EXISTS dummy;
CREATE TABLE dummy(created TIMESTAMP WITH TIME ZONE);

-- Your database schema goes here --
DROP TABLE IF EXISTS mail;
CREATE TABLE mail(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- mail id
    mailbox VARCHAR(32) NOT NULL,                   -- mailbox name
    mail jsonb                                      -- mail content
);