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
        console.log('Google OAuth Profile:', {
          id: profile.id,
          displayName: profile.displayName,
          emails: profile.emails
        });

        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;

        if (!email) {
          console.error('Google account email not found');
          return done(new Error("Google account email not found"), false);
        }

        // Check if the user already exists in our database
        const existingUser = await prisma.login.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            isAdmin: true,
            congregationNumber: true
          }
        });

        if (existingUser) {
          console.log('Existing user found:', { id: existingUser.id, email: existingUser.email, isAdmin: existingUser.isAdmin });
          // If user exists, pass them along. This is a login.
          return done(null, existingUser as any);
        } else {
          console.log('New user detected, passing to registration:', { email, name });
          // If user does not exist, this is a new registration.
          // Pass the profile info to the next step.
          return done(null, { email, name, isNewUser: true } as any);
        }
      } catch (error) {
        console.error('Error in Google OAuth strategy:', error);
        return done(error, false);
      }
    }
  )
);
