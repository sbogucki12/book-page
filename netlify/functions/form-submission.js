// Import Netlify's handler helper
const { builder } = require("@netlify/functions");
const nodemailer = require("nodemailer");

async function handler(event) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
      headers: {
        "Location": "/success.html" // Redirect anyway
      }
    };
  }

  try {
    // Variable to store email
    let email = "";
    
    // Determine if this is a direct form submission or a webhook notification
    const contentType = event.headers['content-type'] || '';
    
    if (contentType.includes('application/x-www-form-urlencoded')) {
      // This is a direct form submission - parse form data
      const params = new URLSearchParams(event.body);
      email = params.get('email');
      console.log("Direct form submission with email:", email);
    } else {
      // This is a webhook notification - parse JSON
      try {
        const payload = JSON.parse(event.body);
        
        // Handle different payload structures
        if (payload.data && payload.data.email) {
          email = payload.data.email;
        } else if (payload.data && payload.data.data && payload.data.data.email) {
          email = payload.data.data.email;
        } else if (payload.payload && payload.payload.data && payload.payload.data.email) {
          email = payload.payload.data.email;
        }
        
        console.log("Webhook notification with email:", email);
      } catch (parseError) {
        console.error("Error parsing JSON payload:", parseError);
      }
    }
    
    // Skip email sending if no email is provided, but still redirect
    if (!email) {
      console.log("No email provided, redirecting anyway");
      return {
        statusCode: 303, // Redirect status code
        headers: {
          "Location": "/success.html"
        },
        body: "Redirecting..."
      };
    }

    // Try to send the email
    try {
      // Configure email transport
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        secure: process.env.EMAIL_SECURE === "true",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      console.log("Email transport configured");

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
      
      console.log("Email sent successfully to:", email);
    } catch (emailError) {
      // Log the error but continue to redirect
      console.error("Error sending email:", emailError);
    }

    // Always redirect to success page, even if email sending fails
    return {
      statusCode: 303, // Redirect status code
      headers: {
        "Location": "/success.html"
      },
      body: "Redirecting..."
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    
    // Still redirect to success page even on error
    return {
      statusCode: 303, // Redirect status code
      headers: {
        "Location": "/success.html"
      },
      body: "Redirecting..."
    };
  }
}

// Use the builder to handle different versions of the function
exports.handler = builder(handler);