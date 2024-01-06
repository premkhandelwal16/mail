const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const message = {
    from: process.env.EMAIL_USER,
    to: formData.emailId,
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