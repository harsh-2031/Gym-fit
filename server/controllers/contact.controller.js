const nodemailer = require("nodemailer");

// @desc    Send a message from the contact form
// @route   POST /api/contact
// @access  Public
const sendContactMessage = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Please fill out all fields." });
  }

  // Create a transporter object using your Gmail account
  // IMPORTANT: Use an "App Password" from Google, not your regular password.
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your email from .env file
      pass: process.env.EMAIL_PASS, // Your App Password from .env file
    },
  });

  // Email options
  const mailOptions = {
    from: `"${name}" <${email}>`, // Sender's name and email
    to: process.env.EMAIL_USER, // The email where you want to receive messages
    subject: `New Contact Form Message from ${name}`,
    text: `You have received a new message from:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .json({ message: "Failed to send message. Please try again later." });
  }
};

module.exports = { sendContactMessage };
