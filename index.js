const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const cors = require('cors');
require('dotenv').config();

const OAuth2 = google.auth.OAuth2;

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        console.log(err);
        reject("Failed to create access token :(");
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_USER,
      accessToken,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN
    }
  });

  return transporter;
};


// POST route for form submission
app.post('/submitform', async (req, res) => {
  const formData = req.body;

  try {
    await sendEmail(formData);
    res.status(200).json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to submit form' });
  }
});

// Function to send email
async function sendEmail(formData) {
  const transporter = await createTransporter();

  const message = {
    from: formData.emailId,
    to: process.env.EMAIL_USER,
    subject: 'Collaboration Form Submission',
    text: JSON.stringify(formData, null, 2),
  };

  await transporter.sendMail(message);
  console.log('Email sent');
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});