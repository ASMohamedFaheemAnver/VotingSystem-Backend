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
});

developerSchema.pre("save", async function (next) {
  const developer = this;
  console.log(this.$msg);
  if (developer.password.length < 8) {
    next(new Error("password should be atleast 8 charecters."));
  }
  this.password = await bcrypt.hash(developer.password, 10);
  next();
});

/*
developerSchema.post("findOne", function (doc, next) {
  console.log(doc);
  next();
});

developerSchema.pre("findOne", async function (next) {
  const condition = this.getFilter();
  this.setQuery({
    ...condition,
    password: await bcrypt.hash(condition.password, 10),
  });
  console.log(this.getFilter());
  next();
});
*/

module.exports = mongoose.model("Developer", developerSchema);
