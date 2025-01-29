import jwt from "jsonwebtoken";

export const generateToken = (email, res) => {
  const token = jwt.sign({ email }, process.env.JWTSECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, 
    httpOnly: true,
    sameSite: "strict", 
    secure: "development",
  });

  return token;
};