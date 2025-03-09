# Salud Restaurant Website

A modern, responsive website for Salud Italian Restaurant built with Next.js and TailwindCSS.

## Features

- Modern, responsive design
- Online reservation system with email notifications
- Interactive menu with categories
- Photo gallery
- Contact information and location
- Mobile-friendly navigation

## Tech Stack

- Next.js 14
- TailwindCSS
- TypeScript
- Framer Motion
- Nodemailer

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env.local` file with required environment variables
4. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Required environment variables:
- `EMAIL_USER`: Gmail address for sending notifications
- `EMAIL_PASS`: Gmail app password
- `EMAIL_RECIPIENT`: Email address to receive notifications

## Deployment

The website is deployed on Vercel with automatic deployments from the main branch.

## Project Structure

```
salud/
├── app/
│   ├── components/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Gallery.tsx
│   │   ├── ReservationForm.tsx
│   │   └── Contact.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── public/
│   └── images/
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## Customization

1. Update the restaurant information in the components
2. Add your own images to the public/images directory
3. Modify the color scheme in tailwind.config.js
4. Add your Google Maps API key for the map integration

## Built With

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Hero Icons](https://heroicons.com/)
