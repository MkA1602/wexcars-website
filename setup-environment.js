#!/usr/bin/env node

/**
 * WexCars Environment Setup Script
 * Run with: node setup-environment.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupEnvironment() {
  console.log('🚗 WexCars Environment Setup');
  console.log('================================\n');
  
  console.log('Please provide your Supabase project details:');
  console.log('(You can find these in your Supabase dashboard → Settings → API)\n');

  const supabaseUrl = await question('Enter your Supabase Project URL: ');
  const supabaseAnonKey = await question('Enter your Supabase Anon Key: ');
  const supabaseServiceKey = await question('Enter your Supabase Service Role Key: ');
  
  const appUrl = await question('Enter your app URL (default: http://localhost:3000): ') || 'http://localhost:3000';

  const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}
SUPABASE_SERVICE_ROLE_KEY=${supabaseServiceKey}

# Application Configuration  
NEXT_PUBLIC_APP_URL=${appUrl}

# Generated on: ${new Date().toISOString()}
`;

  const envPath = path.join(process.cwd(), '.env.local');
  
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ Environment variables saved to .env.local');
    console.log('\n🚀 Next steps:');
    console.log('1. Run the SQL setup script in your Supabase SQL editor');
    console.log('2. Configure authentication settings in Supabase dashboard');
    console.log('3. Start your development server with: npm run dev');
    console.log('\n📖 See SUPABASE_SETUP_GUIDE.md for detailed instructions');
  } catch (error) {
    console.error('\n❌ Error saving environment file:', error.message);
    console.log('\n📝 Please create .env.local manually with the following content:');
    console.log('\n' + envContent);
  }

  rl.close();
}

function validateUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function validateKey(key) {
  return key && key.length > 50 && key.startsWith('eyJ');
}

// Check if .env.local already exists
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists!');
  question('Do you want to overwrite it? (y/N): ').then(answer => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      setupEnvironment();
    } else {
      console.log('Setup cancelled.');
      rl.close();
    }
  });
} else {
  setupEnvironment();
} 