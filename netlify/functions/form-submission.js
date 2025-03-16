// Import Netlify's handler helper
const { builder } = require("@netlify/functions");
const nodemailer = require("nodemailer");

async function handler(event) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }

  try {
    // Parse the incoming payload
    const payload = JSON.parse(event.body);
    
    // Make sure it's a form submission event
    if (payload.event !== "submission-created") {
      return {
        statusCode: 400,
        body: "Wrong event type"
      };
    }

    // Extract form data
    const { email } = payload.data.data;
    
    // Skip if no email is provided
    if (!email) {
      return {
        statusCode: 400,
        body: "No email provided"
      };
    }

    // Configure email transport (use environment variables in production)
    // You'll need to set these in your Netlify environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Send the auto-response email
    await transporter.sendMail({
      from: `"BOGOODSKI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Download of 'The Ghosts We Carry'",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
              }
              .header {
                background-color: #1a73e8;
                color: white;
                padding: 20px;
                text-align: center;
              }
              .content {
                padding: 20px;
              }
              .button {
                display: inline-block;
                background-color: #1a73e8;
                color: white;
                text-decoration: none;
                padding: 10px 20px;
                margin: 20px 0;
                border-radius: 4px;
                font-weight: bold;
              }
              .footer {
                margin-top: 30px;
                font-size: 12px;
                color: #666;
                border-top: 1px solid #eee;
                padding-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Thank You!</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              
              <p>Thank you for your interest in "The Ghosts We Carry". Your download is ready!</p>
              
              <p>Click the button below to download your copy:</p>
              
              <p>
                <a href="${process.env.SITE_URL}/The%20Ghosts%20We%20Carry.pdf" class="button">Download Now</a>
              </p>
              
              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              
              <p>${process.env.SITE_URL}/The%20Ghosts%20We%20Carry.pdf</p>
              
              <p>I hope you enjoy the book and would love to hear your thoughts after reading it!</p>
              
              <p>Best regards,<br>BOGOODSKI</p>
            </div>
            <div class="footer">
              <p>You received this email because you submitted a form at ${process.env.SITE_URL}</p>
              <p>Your email will not be shared with third parties.</p>
            </div>
          </body>
        </html>
      `
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Auto-response email sent" })
    };
  } catch (error) {
    console.error("Error sending auto-response email:", error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error sending auto-response email" })
    };
  }
}

// Use the builder to handle different versions of the function
exports.handler = builder(handler);