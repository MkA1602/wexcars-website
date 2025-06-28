# WexCars - Luxury Car Showcase Platform 🚗

A modern, responsive web application for showcasing luxury vehicles with full authentication and user management capabilities.

## ✨ Features

### 🔐 Authentication & User Management
- **User Registration** - Create new accounts with email verification
- **Secure Login** - JWT-based authentication with Supabase
- **Password Reset** - Forgot password functionality
- **User Profiles** - Manage personal information and preferences
- **Dashboard Access** - Protected routes for authenticated users

### 🚗 Car Management
- **Add Cars** - Upload and manage luxury vehicle listings
- **Car Gallery** - Beautiful showcase of vehicles with detailed specifications
- **Image Upload** - Support for multiple car images
- **Search & Filter** - Find cars by brand, category, price, etc.
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile

### 🎨 Modern UI/UX
- **Tailwind CSS** - Beautiful, consistent styling
- **Radix UI Components** - Accessible, high-quality components
- **Dark Mode Support** - Theme switching capability
- **Mobile-First Design** - Optimized for all screen sizes
- **Loading States** - Smooth user experience with proper feedback

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- A Supabase account (free at [supabase.com](https://supabase.com))
- Git installed

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd wexcars
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup

#### Option A: Automated Setup (Recommended)
```bash
node setup-environment.js
```
Follow the prompts to enter your Supabase credentials.

#### Option B: Manual Setup
1. Create `.env.local` file in the project root
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set Up Supabase Database
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and run the contents of `supabase-setup.sql`

### 5. Configure Authentication
1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Set **Site URL**: `http://localhost:3000`
3. Add **Redirect URL**: `http://localhost:3000/auth/callback`

### 6. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see your application! 🎉

## 📖 Detailed Setup Guide

For comprehensive setup instructions, see [`SUPABASE_SETUP_GUIDE.md`](./SUPABASE_SETUP_GUIDE.md)

## 🏗️ Project Structure

```
wexcars/
├── app/                    # Next.js 13+ App Router
│   ├── auth/              # Authentication pages
│   │   ├── login/         # Login page
│   │   ├── register/      # Registration page
│   │   ├── callback/      # Auth callback handler
│   │   └── reset-password/# Password reset
│   ├── dashboard/         # Protected dashboard area
│   └── api/              # API routes
├── components/            # Reusable React components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   └── ui/              # UI component library
├── contexts/             # React Context providers
│   └── auth-context.tsx  # Authentication context
├── lib/                  # Utility libraries
│   ├── supabase/         # Supabase client configuration
│   └── database.types.ts # TypeScript database types
├── styles/               # Global styles
└── public/              # Static assets
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Setup helpers
node setup-environment.js  # Interactive environment setup
```

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Update Supabase settings with production URLs
4. Deploy!

### Other Platforms
1. Build the project: `npm run build`
2. Set environment variables in your hosting platform
3. Update Supabase authentication settings
4. Deploy the `out` directory (if using static export) or run `npm start`

## 🔒 Security Features

- **Row Level Security (RLS)** - Database-level access control
- **JWT Authentication** - Secure token-based authentication
- **Protected Routes** - Middleware-based route protection
- **Input Validation** - Form validation and sanitization
- **CSRF Protection** - Built-in Next.js security features

## 🛠️ Built With

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Authentication**: [Supabase Auth](https://supabase.com/auth)
- **Database**: [Supabase PostgreSQL](https://supabase.com/database)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 🧪 Demo Mode

The application includes a demo mode that works without Supabase configuration:
- Shows sample data and functionality
- Perfect for testing and development
- Automatically activates when environment variables aren't set

## 🐛 Troubleshooting

### Common Issues

**"Supabase not configured" message**
- Ensure all environment variables are set correctly
- Restart your development server after adding `.env.local`
- Check that your Supabase URL and keys are valid

**Registration/Login not working**
- Verify your Supabase project is active
- Check that email confirmation is properly configured
- Ensure callback URLs are set correctly in Supabase

**Database errors**
- Confirm the SQL setup script ran successfully
- Check that Row Level Security policies are enabled
- Verify table permissions are correct

For more detailed troubleshooting, see the [Setup Guide](./SUPABASE_SETUP_GUIDE.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Open a pull request

## 📞 Support

If you encounter any issues or have questions:

1. Check the [troubleshooting section](#-troubleshooting)
2. Review the [detailed setup guide](./SUPABASE_SETUP_GUIDE.md)
3. Open an issue on GitHub
4. Check browser console for error messages

---

**Happy coding! 🚗✨**

*Built with ❤️ for the luxury car enthusiast community* 