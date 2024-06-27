import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import userModel from "../models/userModel.js";

const JWTOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  //   secretOrKey: process.env.MYSECRET,
  secretOrKey: "this is secret password",
};

const passportStrategy = new JwtStrategy(JWTOptions, async function (
  jwt_payload,
  done
) {
  try {
    const user = await userModel.findOne({ _id: jwt_payload.sub });
    if (user) {
      return done(null, user);
    }
    if (!user) {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
});

export default passportStrategy;
