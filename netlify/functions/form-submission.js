// netlify/functions/form-submission.js

// Import required packages
const nodemailer = require("nodemailer");

exports.handler = async (event, context) => {
  // Enhanced logging
  console.log("Form submission function triggered");
  console.log("HTTP Method:", event.httpMethod);
  console.log("Raw event body:", event.body);
  console.log("Headers:", JSON.stringify(event.headers));
  
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
    console.log("Full payload:", JSON.stringify(payload));
    
    // Extract the email from the form submission (explore more paths)
    let email = "";
    
    // Try direct payload access first
    if (payload.email) {
      email = payload.email;
      console.log("Email found directly in payload");
    } 
    // Check payload.data path
    else if (payload.data && payload.data.email) {
      email = payload.data.email;
      console.log("Email found in payload.data");
    }
    // Check payload.payload path
    else if (payload.payload) {
      if (payload.payload.email) {
        email = payload.payload.email;
        console.log("Email found in payload.payload");
      } else if (payload.payload.data && payload.payload.data.email) {
        email = payload.payload.data.email;
        console.log("Email found in payload.payload.data");
      }
    }
    // Check for form-parse structure
    else if (payload.form && payload.form.email) {
      email = payload.form.email;
      console.log("Email found in payload.form");
    }
    
    console.log("Extracted email:", email);
    
    // If no email was found through standard paths, attempt to parse form data
    if (!email) {
      console.log("No email found in standard paths, attempting to parse form data");
      
      // Try to find any property that might contain email
      const allProps = JSON.stringify(payload);
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
      const matches = allProps.match(emailRegex);
      
      if (matches && matches.length > 0) {
        email = matches[0];
        console.log("Email extracted through regex:", email);
      } else {
        console.log("No email address pattern found in payload");
        return {
          statusCode: 200,
          body: JSON.stringify({ message: "No email found in submission" })
        };
      }
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
                color: white !important;
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
              
              <p><b>Note: </b><i>This is a draft of the manuscript, updated on December 20, 2025.</i></p>
              
              <p>Click the button below to download your copy:</p>
              
              <p style="text-align: center;">
                <a href="${process.env.SITE_URL}/The%20Ghosts%20We%20Carry.pdf" style="display: inline-block; background-color: #1a73e8; color: white !important; text-decoration: none; padding: 10px 20px; margin: 20px 0; border-radius: 4px; font-weight: bold;">Download Now</a>
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