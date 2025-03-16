# The Ghosts We Carry - Landing Page

A minimal, sleek website for promoting and distributing "The Ghosts We Carry" manuscript. This landing page allows visitors to access a draft of the manuscript by submitting their email address.

## Features

- Clean, responsive design with blue and yellow accent colors
- Email collection form with validation
- Netlify form integration with spam protection
- Mobile-friendly layout

## Technologies Used

- HTML5
- CSS3 (with custom styling)
- Vanilla JavaScript
- Google Fonts (Playfair Display, Merriweather, Montserrat)

## Deployment

This site is designed to be deployed on Netlify for easy form handling. Follow these steps to deploy:

1. Create a Netlify account if you don't have one (https://app.netlify.com/signup)
2. Push this repository to GitHub, GitLab, or Bitbucket
3. Log in to Netlify and click "New site from Git"
4. Connect your repository and deploy
5. Forms will automatically be set up based on the HTML markup

## Netlify Form Settings & Auto-Response

This site includes automatic email responses to form submissions. Here's how it works:

1. When someone submits the form, they'll be redirected to the success page
2. A Netlify Function will automatically send them an email with the download link
3. You'll also receive a notification about the submission

### Setting Up the Auto-Response Email

To configure the email sending:

1. In your Netlify dashboard, go to **Site settings → Environment variables**
2. Add the following environment variables:
   - `EMAIL_HOST` (e.g., smtp.gmail.com)
   - `EMAIL_PORT` (e.g., 587)
   - `EMAIL_SECURE` (true or false)
   - `EMAIL_USER` (your email address)
   - `EMAIL_PASS` (your email app password)
   - `SITE_URL` (your Netlify site URL)

### For Gmail Users:
You'll need to create an "App Password":
1. Go to your Google Account → Security
2. Enable 2-Step Verification if not already enabled
3. Go to App passwords
4. Create a new app password for "Netlify"
5. Use that password for the `EMAIL_PASS` environment variable

### Testing the Auto-Response
After setting up:
1. Submit the form with your own email address
2. Check that you receive both the notification and the auto-response
3. Verify the download link in the email works correctly

### Handling Form Submissions
Form submissions will automatically appear in your Netlify dashboard under the "Forms" section. You can:
- View all submissions
- Export them as CSV
- Set up additional email notifications
- Connect to Zapier or other services for additional integrations

## Customization

- Update the book title, subtitle, and excerpt with your content
- Replace placeholder text and links in the navigation
- Add your manuscript file for download
- Update the author information in the footer

## Local Development

To run this site locally:

1. Clone the repository
2. Open `index.html` in your web browser
3. For form testing, use Netlify CLI:
   ```
   npm install netlify-cli -g
   netlify dev
   ```

## File Structure

- `index.html` - Main HTML file containing the page structure
- `success.html` - Thank you page displayed after form submission
- `styles.css` - CSS styles for the site
- `script.js` - JavaScript for form validation and interaction
- `favicon.svg` - Vector favicon (book icon)
- `favicon.png` - Fallback PNG favicon for older browsers
- `netlify.toml` - Netlify configuration for form handling and redirects
- `README.md` - Documentation (this file)
- `.gitignore` - Git ignore file

## License

MIT

## Credits

- Fonts: Google Fonts (Playfair Display, Merriweather, Montserrat)
- Developer: [Steve Bogucki](https://www.linkedin.com/in/sbogucki12/)
