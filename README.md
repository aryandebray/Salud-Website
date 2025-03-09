# Salud Restaurant Website

A modern, elegant website for Salud Italian Restaurant built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Responsive design
- Modern UI with animations
- Online reservation system
- Photo gallery
- Contact information
- Restaurant menu (coming soon)

## Prerequisites

- Node.js 18.x or later
- npm or yarn

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add your environment variables:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

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