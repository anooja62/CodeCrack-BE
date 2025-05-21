import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  sso_id: string;
  username: string;
  email: string;
  image: string;
  created_at: Date;
  updated_at: Date;
}

const userSchema = new Schema<IUser>(
  {
    sso_id: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { timestamps: false } 
);

userSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
