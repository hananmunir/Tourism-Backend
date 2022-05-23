import mongoose from "mongoose";
import bycrpt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      minLength: [7, "Name too Short"],
      maxLength: [50, "Name too Long"],
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
      minLength: [7, "email too Short"],
      maxLength: [50, "email too Long"],
    },
    password: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
    },
   
    role: {
      type: String,
      default: "User",
    },
  },
  { timestamps: true }
);
userSchema.methods.encryptPass = async function () {
 
  // hash password
  let salt = await bycrpt.genSalt(10);
  this.password = await bycrpt.hash(this.password, salt);
};
const user = mongoose.model("user", userSchema);
export default user;
