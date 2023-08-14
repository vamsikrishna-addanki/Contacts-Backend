const express = require('express');
const db = require('./models/Contact');

const app = express();
app.use(express.json());

app.post('/identify', (req, res) => {
  const { email, phoneNumber } = req.body;

  // Find primary contact based on email or phoneNumber
  const primaryQuery = `
    SELECT id, phoneNumber, email, linkPrecedence, linkedId
    FROM Contact
    WHERE phoneNumber = ? OR email = ?
    ORDER BY createdAt ASC
    LIMIT 1
  `;

  db.get(primaryQuery, [phoneNumber, email], (err, primaryContact) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'An error occurred' });
      return;
    }

    if (!primaryContact) {
      // No existing contact found, create a new primary contact
      const insertPrimaryQuery = `
        INSERT INTO Contact (phoneNumber, email, linkPrecedence, createdAt, updatedAt)
        VALUES (?, ?, 'primary', datetime('now'), datetime('now'))
      `;

      db.run(insertPrimaryQuery, [phoneNumber, email], function (err) {
        if (err) {
          console.error(err.message);
          res.status(500).json({ error: 'An error occurred' });
          return;
        }

        const consolidatedContact = {
          primaryContactId: this.lastID,
          emails: email ? [email] : [],
          phoneNumbers: phoneNumber ? [phoneNumber] : [],
          secondaryContactIds: []
        };

        res.status(200).json({ contact: consolidatedContact });
      });
    } else {
      // Existing contact found, check if email or phoneNumber needs linking
      const linkedId = primaryContact.linkedId || primaryContact.id;

      // Create a new secondary contact linked to the primary contact
      const insertSecondaryQuery = `
        INSERT INTO Contact (phoneNumber, email, linkedId, linkPrecedence, createdAt, updatedAt)
        VALUES (?, ?, ?, 'secondary', datetime('now'), datetime('now'))
      `;

      db.run(insertSecondaryQuery, [phoneNumber, email, linkedId], function (err) {
        if (err) {
          console.error(err.message);
          res.status(500).json({ error: 'An error occurred' });
          return;
        }

        const consolidatedContact = {
          primaryContactId: linkedId,
          emails: [primaryContact.email, email].filter(Boolean),
          phoneNumbers: [primaryContact.phoneNumber, phoneNumber].filter(Boolean),
          secondaryContactIds: [this.lastID]
        };

        // Check if the existing primary contact needs to be updated to secondary
        if (primaryContact.linkPrecedence === 'primary' && (primaryContact.email !== email || primaryContact.phoneNumber !== phoneNumber)) {
          const updatePrimaryToSecondaryQuery = `
            UPDATE Contact
            SET linkPrecedence = 'secondary', updatedAt = datetime('now')
            WHERE id = ?
          `;

          db.run(updatePrimaryToSecondaryQuery, [primaryContact.id], function (err) {
            if (err) {
              console.error(err.message);
              res.status(500).json({ error: 'An error occurred' });
              return;
            }

            consolidatedContact.primaryContactId = primaryContact.id;
            res.status(200).json({ contact: consolidatedContact });
          });
        } else {
          res.status(200).json({ contact: consolidatedContact });
        }
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});