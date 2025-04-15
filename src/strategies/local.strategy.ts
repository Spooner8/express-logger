import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import db from '../services/database';

export const localStrategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await db.user.findUnique({ where: { email: username } });
    if (!user) return done(null, false, { message: 'User not found' });

    const isPasswordValid = user.password && await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return done(null, false, { message: 'Wrong credentials' });

    return done(null, user);
  } catch (err) {
    return done(err);
  }
});