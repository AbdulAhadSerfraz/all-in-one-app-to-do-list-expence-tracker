# HabitSync: All-in-One App (To-Do List, Expense Tracker, Habit & Wellness Dashboard)

HabitSync is a modern, full-stack productivity and wellness web application built with Next.js, React, TypeScript, and Tailwind CSS. It helps you manage your daily tasks, track expenses, monitor habits, and visualize your mood, sleep, and calorie trends—all in one place.

## Features

- **User Authentication**: Secure sign up, sign in, and profile management.
- **Dashboard**: Overview of your tasks, expenses, sleep, and calories.
- **Tasks**: Kanban board for task management by status and priority, analytics, and calendar view.
- **Expenses**: Add, view, and analyze your daily expenses.
- **Habits & Wellness**: Track mood, sleep, and calories with visual trends.
- **Calendar Integration**: Visualize tasks on a calendar.
- **Responsive UI**: Beautiful, mobile-friendly design using Tailwind CSS.

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **State Management**: React Context API
- **Database**: Supabase (PostgreSQL)
- **Drag & Drop**: @dnd-kit for Kanban boards
- **Charts**: recharts

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
   cd "all in one app to do list expence tracker"
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env.local` and fill in your Supabase credentials and other secrets.

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Setup
- The app uses Supabase for authentication and data storage.
- See `prisma/schema.prisma` and `supabase/schema.sql` for database structure.

## Project Structure

- `app/` — Next.js app directory (pages, layouts, API routes)
- `components/` — Reusable UI and feature components
- `contexts/` — React context providers for auth and profile
- `lib/` — Utility functions and service logic
- `public/` — Static assets
- `prisma/` — Prisma schema and local database
- `supabase/` — Supabase SQL schema

## Scripts
- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm start` — Start production server

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

**Made with ❤️ by Abdul Ahad Serfraz**
