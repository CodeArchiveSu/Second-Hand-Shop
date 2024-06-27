import jwt from "jsonwebtoken";

export const generateToken = (userID) => {
  const payload = {
    sub: userID,
  };
  const secretOrPrivateKey = "this is secret password";

  const signOptions = {
    expiresIn: "2d",
  };
  const token = jwt.sign(payload, secretOrPrivateKey, signOptions);
  return token;
};
