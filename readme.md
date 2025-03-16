# Book Landing Page

A minimal, sleek website for promoting and distributing a book manuscript. This landing page allows visitors to access a draft of the manuscript by submitting their email address.

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

## Netlify Form Settings

After deployment, configure your form settings in the Netlify dashboard:

1. Go to Forms → Form Notifications to set up email notifications
2. The success redirect page is already configured in the form's `action` attribute and the `netlify.toml` file
3. To customize the download link in the success page:
   - Update the href in the download button in `success.html`
   - You can link directly to your manuscript file or to a file stored in Netlify or another service

### Handling Form Submissions
Form submissions will automatically appear in your Netlify dashboard under the "Forms" section. You can:
- View all submissions
- Export them as CSV
- Set up email notifications
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
