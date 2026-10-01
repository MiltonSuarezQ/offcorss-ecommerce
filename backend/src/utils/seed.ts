import bcrypt from 'bcryptjs';
import { connectDatabase } from '../config/database.js';
import { validateEnv } from '../config/env.js';
import { User } from '../models/User.js';

validateEnv();
await connectDatabase();

const username = 'admin';
const existing = await User.findOne({ username });

if (!existing) {
  await User.create({
    username,
    password: await bcrypt.hash('Admin123*', 12),
    name: 'Administrador',
    lastName: 'OFFCORSS',
    email: 'admin@offcorss.test',
    userType: 'ADMIN',
  });
  console.log('Seed user created: admin / Admin123*');
} else {
  console.log('Seed user already exists');
}

process.exit(0);
