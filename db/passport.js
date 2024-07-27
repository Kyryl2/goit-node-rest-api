import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import User from "../schemas/user.js";
import dotenv from "dotenv";

dotenv.config();
const secret = process.env.JWT_SECRET;

const params = {
  secretOrKey: secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

passport.use(
  new JwtStrategy(params, async (payload, done) => {
    try {
      const user = await User.findById(payload.id);
      if (!user) {
        return done(null, false, { message: "User not found" });
      }
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  })
);

export default passport;
