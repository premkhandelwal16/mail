const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;


app.use(function (req, res, next) {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    next();
  });
// Middleware
app.use(cors({
  origin: 'https://premkhandelwal.github.io', // Add your front-end domain
  methods: 'POST',
  credentials: true,
}));
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
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
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
