# Expense Tracker App - Development Guide

## Project Overview
A full-stack transport expense tracking application built with:
- **Frontend**: React with Vite
- **Backend**: Supabase (PostgreSQL + Auth + API)
- **Deployment**: Vercel (serverless hosting)
- **Purpose**: Log daily transport expenses for two users (user and wife)

## Setup Progress

- [x] Create copilot-instructions.md
- [x] Scaffold frontend (React)
- [x] Set up Supabase integration
- [x] Implement authentication
- [x] Build React components
- [x] Install dependencies
- [x] Create startup tasks
- [x] Update README documentation

## Getting Started

### 1. Supabase Setup
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL script in the README to create the expenses table
3. Copy your project URL and anon key

### 2. Environment Variables
```bash
cd client
cp .env.example .env
# Edit .env with your Supabase credentials
```

### 3. Run Locally
```bash
cd client
npm install
npm run dev
```

### 4. Deploy to Vercel
```bash
cd client
vercel
# Set environment variables in Vercel dashboard
```

## Key Features
- User authentication via Supabase Auth
- Daily expense logging with date, amount, category
- View expense history with monthly filtering
- Expense statistics and summaries
- Row Level Security (RLS) for data protection
- Serverless deployment on Vercel

## Database Schema (Supabase PostgreSQL)
- **expenses** table:
  - id (UUID, primary key)
  - user_id (UUID, references auth.users)
  - date (DATE)
  - amount (DECIMAL)
  - category (TEXT)
  - description (TEXT)
  - created_at (TIMESTAMP)
