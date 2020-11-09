import mongoose from "mongoose";

const Schema = mongoose.Schema;

const positionSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  eligible_year: {
    type: Number,
    required: true,
  },
  eligible_gender: {
    type: String,
    required: true,
  },
});

positionSchema.pre("save", async function (next) {
  const position = this;
  if (position.title.length < 5) {
    return next(new Error("position should be atleast 5 charecters."));
  }
  next();
});

module.exports = mongoose.model("Position", positionSchema);
