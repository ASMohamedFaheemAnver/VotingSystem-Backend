import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const Schema = mongoose.Schema;

const developerSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  is_first_poll_enabled: {
    type: Boolean,
    default: false,
  },
  is_second_poll_enabled: {
    type: Boolean,
    default: false,
  },
});

developerSchema.pre("save", async function (next) {
  const developer = this;
  if (developer.password.length < 8) {
    next(new Error("password should be atleast 8 charecters."));
  }
  this.password = await bcrypt.hash(developer.password, 10);
  next();
});

module.exports = mongoose.model("Developer", developerSchema);
