const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const port = 4000;
const cors = require('cors');
require('dotenv').config();

app.options('*', cors());
// Middleware to parse JSON and URL-encoded bodies


const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors({
    credentials: true,
    preflightContinue: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH' , 'DELETE', 'OPTIONS'],
    origin: true,
    optionSuccessStatus:200
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware to parse JSON and URL-encoded bodies

// POST endpoint to handle form data
app.post('/submitform', async (req, res) => {
  const formData = req.body;

  try {
    // Send email with the form data
    await sendEmail(formData);
    res.status(200).json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to submit form' });
  }
});

// Function to send email
async function sendEmail(formData) {
  // Create a transporter using Gmail's SMTP settings
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'prem.dkhandelwal@gmail.com', // Replace with your Gmail email address
      pass: process.env.PASSWORD, // Replace with your Gmail password or app-specific password
    },
  });

  // Create the email message
  const message = {
    from: 'prem.dkhandelwal@gmail.com',
    to: formData.emailId, // Replace with the recipient's email address
    subject: 'Collaboration Form Submission',
    text: JSON.stringify(formData, null, 2),
  };

  // Send the email
  await transporter.sendMail(message);
  console.log('Email sent');
}


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
