import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import prisma from '../db';
import dotenv from 'dotenv';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;

        if (!email) {
          return done(new Error("Google account email not found"), false);
        }

        // Check if the user already exists in our database
        const existingUser = await prisma.login.findUnique({
          where: { email },
        });

        if (existingUser) {
          // If user exists, pass them along. This is a login.
          return done(null, { user: existingUser, isNewUser: false });
        } else {
          // If user does not exist, this is a new registration.
          // Pass the profile info to the next step.
          return done(null, { user: { email, name }, isNewUser: true });
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);
