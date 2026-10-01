import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { signToken } from '../utils/auth.js';

export async function login(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body as { username?: string; password?: string };

  if (!username || !password) {
    res.status(400).json({ message: 'Username and password are required' });
    return;
  }

  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  res.json({
    token: signToken({ userId: user.id, username: user.username }),
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      userType: user.userType,
      createDate: user.createDate,
    },
  });
}
