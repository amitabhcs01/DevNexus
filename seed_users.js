const fs = require('fs');
const path = require('path');

// Read .env file from project root
const envPath = path.join(__dirname, '.env');
console.log('Reading .env from:', envPath);

if (!fs.existsSync(envPath)) {
  console.error('.env file not found!');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim();
    env[key] = value;
  }
});

const supabaseUrl = env['VITE_SUPABASE_URL'];
const supabaseAnonKey = env['VITE_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing from .env!');
  process.exit(1);
}

console.log('Supabase URL:', supabaseUrl);

const users = [
  {
    email: 'admin@devnexus.local',
    password: 'AdminPasswordSecure123!',
    metadata: { role: 'admin' }
  },
  {
    email: 'client@devnexus.local',
    password: 'ClientPasswordSecure123!',
    metadata: {
      role: 'client',
      companyName: 'Nexus Capital',
      corporateTitle: 'Managing Partner',
      projectBudget: '150000'
    }
  },
  {
    email: 'developer@devnexus.local',
    password: 'DeveloperPasswordSecure123!',
    metadata: {
      role: 'developer',
      fullName: 'Alex Rivers',
      keySkills: 'React, WebRTC, Node.js',
      experienceLevel: 'senior',
      portfolioLink: 'https://github.com/alexrivers'
    }
  }
];

async function seed() {
  for (const user of users) {
    console.log(`\nSigning up user: ${user.email}...`);
    try {
      const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'apikey': supabaseAnonKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: user.email,
          password: user.password,
          data: user.metadata
        })
      });

      const result = await response.json();
      if (!response.ok) {
        console.error(`Error signing up ${user.email}:`, result.msg || result.message || JSON.stringify(result));
      } else {
        console.log(`Success! User created:`, result.user ? result.user.id : JSON.stringify(result));
      }
    } catch (error) {
      console.error(`Network error signing up ${user.email}:`, error.message);
    }
  }
}

seed();
