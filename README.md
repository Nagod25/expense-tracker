# Expense Tracker - Full Stack App

A simple web application for logging daily transport expenses. Built with React (frontend), Supabase (backend/database), and deployed on Vercel.

## Features

- 👤 User authentication (support for two users: you and your wife)
- 💰 Log daily transport expenses with date, amount, and category
- 📊 View expense history with monthly filtering
- 📈 Calculate total and average expenses
- 🏷️ Categorize expenses (bus, train, taxi, car, bike, other)
- ☁️ Serverless architecture with Supabase
- 🚀 Deployed on Vercel

## Project Structure

```
expense-tracker/
├── client/             # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── services/   # Supabase client & API functions
│   │   └── styles/     # CSS files
│   ├── .env.example    # Environment variables template
│   └── package.json
├── .github/            # Documentation
│   └── copilot-instructions.md
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Supabase account (free tier available)
- Vercel account (for deployment)

### 1. Set up Supabase

1. **Create a Supabase project:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the database to be set up

2. **Create the expenses table:**
   - Go to the SQL Editor in your Supabase dashboard
   - Run this SQL to create the expenses table:

   ```sql
   CREATE TABLE expenses (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     date DATE NOT NULL,
     amount DECIMAL(10,2) NOT NULL,
     category TEXT DEFAULT 'car',
     description TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

   -- Create policy to allow users to only access their own expenses
   CREATE POLICY "Users can only access their own expenses" ON expenses
     FOR ALL USING (auth.uid() = user_id);
   ```

3. **Get your Supabase credentials:**
   - Go to Settings > API in your Supabase dashboard
   - Copy the "Project URL" and "anon public" key

### 2. Configure Environment Variables

1. **Create environment file:**
   ```bash
   cd client
   cp .env.example .env
   ```

2. **Update `.env` with your Supabase credentials:**
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 3. Install Dependencies & Run Locally

```bash
cd client
npm install
npm run dev
```

The app will run on `http://localhost:5173`

### 4. Deploy to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   cd client
   vercel
   ```

3. **Set environment variables in Vercel:**
   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings > Environment Variables
   - Add the same variables from your `.env` file

## Usage

1. Open the deployed app or `http://localhost:5173`
2. Create an account or login
3. On the dashboard, use the form to log daily expenses
4. Select date, amount, category, and optional description
5. View all expenses in the history table below
6. Filter by month/year to see specific periods
7. See total and average expenses for the selected period

## Technologies Used

### Frontend
- React 18
- Vite
- Supabase Client
- CSS3

### Backend & Database
- Supabase (PostgreSQL + Auth + API)
- Row Level Security (RLS) for data protection

### Deployment
- Vercel (serverless hosting)

## Supabase Features Used

- **Authentication:** User registration and login
- **Database:** PostgreSQL with automatic API generation
- **Row Level Security:** Ensures users can only access their own data
- **Real-time:** Automatic UI updates (built-in with Supabase client)

## Security

- All data access is protected by Supabase's Row Level Security
- Users can only access their own expense records
- Authentication is handled securely by Supabase
- No sensitive data is stored in the frontend

## Next Steps

1. Deploy to Vercel with your Supabase credentials
2. Test user registration and login
3. Start logging expenses
4. Customize the UI styling if needed
5. Add features like expense categories or reporting

## Project Links

- GitHub: https://github.com/your-username/your-repo

## License

MIT
