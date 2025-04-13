# Customization Guide

This guide provides instructions on how to customize your portfolio website to reflect your personal information and style.

## Changing Personal Information

### Basic Information

1. Open the `index.html` file
2. Update the following sections:
   - Header: Your name and title
   - About section: Your professional summary
   - Skills section: Your technical and soft skills
   - Education: Your educational background
   - Experience: Your work history
   - Projects & Certifications: Your accomplishments
   - Contact: Your contact information

### Profile Picture

1. Create or select a professional headshot or portrait photo
2. Place your image in the `assets/images/` directory
3. Either:
   - Rename your image to `profile-placeholder.jpg`, or
   - Update the image path in the `index.html` file by editing the `src` attribute of the profile image tag

### CV/Resume

1. Save your CV/resume as a PDF file
2. Place the PDF in the `assets/cv/` directory
3. Either:
   - Rename your file to `cristian-trifan-cv.pdf`, or
   - Update the link path in the `index.html` file by editing the href attribute of the CV download link

### Social Links

1. In the `index.html` file, locate the footer section
2. Update the social media links with your personal profiles
3. Add or remove social media icons as needed

## Styling Customization

### Colors

1. Open the `css/style.css` file
2. At the top, find the `:root` section with CSS variables
3. Modify the color variables to match your preferred color scheme:
   ```css
   :root {
       --primary-color: #0f0;        /* Main accent color */
       --primary-dark: #080;         /* Darker shade of accent color */
       --secondary-color: #00ffff;   /* Secondary accent color */
       --dark-bg: #121212;           /* Main background color */
       --darker-bg: #0a0a0a;         /* Darker background color */
       --terminal-bg: rgba(0, 0, 0, 0.85); /* Terminal background */
       --terminal-border: #32e82a;   /* Terminal border color */
       --text-color: #f0f0f0;        /* Main text color */
   }
   ```

### Fonts

1. If you want to change the fonts:
   - Visit Google Fonts (https://fonts.google.com/) and select your preferred fonts
   - Update the font import in the `<head>` section of `index.html`
   - Update the font variables in `css/style.css`:
   ```css
   :root {
       --font-mono: 'Share Tech Mono', monospace;
       --font-main: 'Source Code Pro', monospace;
   }
   ```

## Animation Customization

### Matrix Rain Effect

1. Open the `js/script.js` file
2. Find the `MatrixRain` class
3. Adjust parameters like:
   - `fontSize` - size of the characters
   - `opacity` - visibility of the effect
   - `chars` - the characters used in the animation

### Section Animations

1. In `css/style.css`, find the section animation styles
2. Modify the transition properties to adjust timing and effects

## Adding Projects

To add a new project or certification:

1. Copy an existing project card in the `index.html` file
2. Update the content with your project details
3. Choose an appropriate icon from Font Awesome

## Custom Favicon

1. Create a 16x16 or 32x32 pixel favicon.ico file
2. Replace the placeholder `favicon.ico` file with your custom one

## Need More Help?

For more advanced customizations, refer to:
- HTML structure in `index.html`
- CSS styling in `css/style.css`
- JavaScript functions in `js/script.js` 