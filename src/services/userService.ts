import User, { IUser } from "../models/User";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";


dotenv.config();

interface LoginUserResponse {
    user: IUser;
    token: string;
  }
  

const generateToken = (user: IUser | any): string => {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
  
    const userId = typeof user._id === "object" ? user._id.toString() : user._id;
  
    return jwt.sign(
      { id: userId, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
  };
  



export const loginUser = async (
  email: string,
  sso_id: string,
  username: string,
  image: string
): Promise<LoginUserResponse> => {
  let user = await User.findOne({ email });

  if (!user) {
   

    user = new User({ sso_id, username, email, image });
    await user.save();
  } else {
    if (user.sso_id !== sso_id) {
      throw new Error("Failed to login: Invalid SSO ID");
    }
  }

  const token = generateToken(user as IUser);

  return { user: user.toObject(), token };

};
