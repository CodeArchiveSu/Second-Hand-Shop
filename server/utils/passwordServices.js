import bcrypt from "bcrypt";

export const encryptPassword = async (password) => {
  const saltRounds = 10;

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.log("erorr hashing password:", error);
    return null;
  }
};

export const verifyPassword = async (plainPassword, hashedPassword) => {
  const isPasswordCorrect = await bcrypt.compare(plainPassword, hashedPassword);
  return isPasswordCorrect;
};
