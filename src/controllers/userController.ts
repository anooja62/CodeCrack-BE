import { Request, Response } from "express";
import Joi from "joi";
import { loginUser } from "../services/userService";

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  sso_id: Joi.string().required(),
  username: Joi.string().required(),
  image: Joi.string().uri().required(),
});

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
      if (error) {
        res.status(400).json({ error: error.details.map((err) => err.message) });
        return;
      }
  
      const { email, sso_id, username, image } = value;
  
      // Correct destructuring here
      const { user, token } = await loginUser(email, sso_id, username, image);
  
      res.status(200).json({ message: "Login successful", token, user });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };
  
