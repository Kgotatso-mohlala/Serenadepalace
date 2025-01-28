const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const path = require('path');
const ejs = require('ejs');

const transporter = nodemailer.createTransport({
  service: 'gmail',  
  auth: {
    user: process.env.YOUR_EMAIL,
    pass: process.env.YOUR_PASS,
  },
});

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send("All fields are required.");
  }

  const contactAdminTemplate = path.join(__dirname, '../views/emails/contactAdminTemplate.ejs');
  const contactClientTemplate = path.join(__dirname, '../views/emails/contactClientTemplate.ejs');

  try {

    const adminMailOptions = {
      from: email,
      to: 'nelsonmohlala617@gmail.com', 
      subject: 'New Contact Form Submission',
      html: await ejs.renderFile(contactAdminTemplate, { name, email, message }),
    };

    
    const clientMailOptions = {
      from: process.env.YOUR_EMAIL,
      to: email,  // Send confirmation to the client
      subject: 'Thank You for Contacting Us',
      html: await ejs.renderFile(contactClientTemplate, { name, message }),
    };

    
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(clientMailOptions),
    ]);
    res.json({ success: true, message: 'Message sent successfully' });

  } catch (error) {
    console.error("Error sending emails:", error);
    res.status(500).send("Error sending message");
  }
});

module.exports = router;