import passport from 'passport';
import { localStrategy } from '../strategies/local.strategy';
import { jwtStrategy } from '../strategies/jwt.strategy';
import { googleStrategy } from '../strategies/google.strategy';

passport.use(localStrategy);
passport.use(jwtStrategy);
passport.use(googleStrategy);

export default passport;