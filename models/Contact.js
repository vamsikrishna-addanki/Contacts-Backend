const sqlite3 = require('sqlite3').verbose();

const Contact = new sqlite3.Database('db.sqlite'); 
Contact.serialize(() => {
  Contact.run(`
  CREATE TABLE IF NOT EXISTS Contact (
    id INTEGER PRIMARY KEY,
    phoneNumber TEXT,
    email TEXT,
    linkedId INTEGER,
    linkPrecedence TEXT,
    createdAt DATETIME,
    updatedAt DATETIME,
    deletedAt DATETIME
  )
  `);
});

module.exports = Contact;


