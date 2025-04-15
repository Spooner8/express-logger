import { Strategy as GoogleStrategy, type Profile } from 'passport-google-oauth20';
import db from '../services/database';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'your-google-client-id';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret';
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback';

export const googleStrategy = new GoogleStrategy(
    {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
    },
    async (_accessToken: string, _refreshToken: string, profile: Profile, done) => {
        try {
            const defaultRole = await db.role.findUnique({
                where: { isDefault: true },
                select: { id: true },
            });
        
            if (!defaultRole) {
                throw new Error('Default role not found');
            }

            const email = profile.emails && profile.emails[0]?.value;
            if (!email) {
                return done(new Error('No email found'), false);
            }

            const user = await db.user.findUnique({
                where: { googleId: profile.id },
            });

            if (user) {
                return done(null, user);
            } else {
                const newUser = await db.user.create({
                    data: {
                        googleId: profile.id,
                        email,
                        roleId: defaultRole.id,
                        firstName: profile.name?.givenName || '',
                        lastName: profile.name?.familyName || '',
                    },
                });
                return done(null, newUser);
            }
        } catch (err) {
            return done(err, false);
        }
    }
);