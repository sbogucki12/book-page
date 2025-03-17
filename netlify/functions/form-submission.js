// Import required packages
const nodemailer = require("nodemailer");

exports.handler = async (event, context) => {
  // Log that function was triggered
  console.log("Form submission function triggered");
  console.log("HTTP Method:", event.httpMethod);
  
  // Only process POST requests
  if (event.httpMethod !== "POST") {
    console.log("Not a POST request, ignoring");
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "This endpoint only accepts POST requests" })
    };
  }

  try {
    // Parse the payload
    const payload = JSON.parse(event.body);
    console.log("Received payload type:", payload.event);
    
    // Log submission data for debugging (without showing full details)
    console.log("Payload structure:", Object.keys(payload));
    if (payload.payload) console.log("Inner payload structure:", Object.keys(payload.payload));
    
    // Extract the email from the form submission
    let email = "";
    
    // Netlify webhook format changed over time, so check multiple paths
    if (payload.payload && payload.payload.email) {
      email = payload.payload.email;
    } else if (payload.payload && payload.payload.data && payload.payload.data.email) {
      email = payload.payload.data.email;
    } else if (payload.data && payload.data.email) {
      email = payload.data.email;
    } else if (payload.email) {
      email = payload.email;
    }
    
    console.log("Extracted email:", email);
    
    // If no email was found, log and exit
    if (!email) {
      console.log("No email found in submission data");
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "No email found in submission" })
      };
    }
    
    // Log environment variable presence (not values)
    console.log("Environment variables check:");
    console.log("EMAIL_HOST present:", !!process.env.EMAIL_HOST);
    console.log("EMAIL_PORT present:", !!process.env.EMAIL_PORT);
    console.log("EMAIL_SECURE value:", process.env.EMAIL_SECURE);
    console.log("EMAIL_USER present:", !!process.env.EMAIL_USER);
    console.log("EMAIL_PASS present:", !!process.env.EMAIL_PASS);
    console.log("SITE_URL value:", process.env.SITE_URL);
    
    // Set up email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    console.log("Transporter created");
    
    // Create email content
    const mailOptions = {
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
              
              <p style="text-align: center;">
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
    };
    
    console.log("Attempting to send email...");

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    
    console.log("Email sent successfully!");
    console.log("Message ID:", info.messageId);
    
    // Return success
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Auto-response email sent successfully" })
    };
    
  } catch (error) {
    console.error("Error in form-submission function:", error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: "Error sending auto-response email",
        error: error.message
      })
    };
  }
};