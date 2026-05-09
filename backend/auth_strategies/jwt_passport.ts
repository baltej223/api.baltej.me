import { Strategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import passport from "passport";
import { User } from "../db/database.js";

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "gbtw4hukfvhjksbfcjvkwbjq32knravewdqnlJEKCHVBFEIDNJFKV",
};

passport.use(
  new Strategy(opts, async (payload, done) => {
    console.log(payload);

    try {
      const reqUser = await User.find({ _id: payload.uid }).exec();

      if (reqUser.length > 0) {
        console.log("user accepted");
        return done(null, reqUser[0]);
      } else {
        console.log("user rejected", payload.uid);
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;
