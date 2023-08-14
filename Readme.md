# Bitespeed Customer Identity Tracking App

The Bitespeed Customer Identity Tracking App is a Node.js web service designed to help identify and keep track of customer identities across multiple purchases. It utilizes a relational SQLite database to store customer contact information and establishes primary and secondary contact relationships based on email and phone number associations.

## Features

- Identifies primary and secondary contacts based on shared email or phone number.
- Creates new primary contacts or adds secondary contacts as needed.
- Updates existing primary contacts to secondary if new information is provided.

## Requirements

- Node.js (v18.16.0 or higher)
- SQLite3 (for the in-memory database)

## Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/your-username/bitespeed-customer-app.git
   cd bitespeed-customer-app 
2. Install the required dependencies:

   ```bash
   npm install
3. Start the server:

   ```bash
   npm start 
## Usage

### POST /identify

This endpoint identifies and consolidates customer contact information. It receives JSON data containing either an email or a phone number. Based on the provided data, the app will determine whether the contact is new or existing and create appropriate records in the database.

#### Request
```JSON
  POST /identify
  Content-Type: application/json 
  {
    "email": "customer@example.com",
    "phoneNumber": "1234567890"
  }
  ```

#### Response
```JSON
HTTP/1.1 200 OK
Content-Type: application/json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["customer@example.com"],
    "phoneNumbers": ["1234567890"],
    "secondaryContactIds": []
  }
}
```

## Database Schema

The app utilizes an SQLite database with the following schema for the `Contact` table:

- `id`: Contact's unique identifier.
- `phoneNumber`: Customer's phone number.
- `email`: Customer's email address.
- `linkedId`: ID of another Contact linked to this one.
- `linkPrecedence`: Indicates whether the contact is "primary" or "secondary".
- `createdAt`: Timestamp of contact creation.
- `updatedAt`: Timestamp of last update.
- `deletedAt`: Timestamp of deletion (if applicable).

## Contributing
Contributions are welcome! If you find a bug or have an enhancement in mind, feel free to open an issue or submit a pull request.

## License
This project is licensed under the MIT License.


