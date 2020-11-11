import mongoose from "mongoose";
import Developer from "./developer";

const Schema = mongoose.Schema;

const memberSchema = new Schema({
  name: { type: String, required: true },
  year: { type: Number, required: true },
  gender: { type: String, required: true },
  eligible_for: [{ type: Schema.Types.ObjectId, ref: "Position" }],
  admin: { type: Schema.Types.ObjectId, ref: "Developer" },
  secret: {
    type: String,
    required: true,
    unique: true,
  },
  first_poll: {
    is_voted: { type: Boolean, default: false },
    votes: [{ type: Schema.Types.ObjectId, ref: "Vote" }],
    received_votes: [{ type: Schema.Types.ObjectId, ref: "Vote" }],
  },
  second_poll: {
    is_voted: { type: Boolean, default: false },
    votes: [{ type: Schema.Types.ObjectId, ref: "Vote" }],
    received_votes: [{ type: Schema.Types.ObjectId, ref: "Vote" }],
  },
});

memberSchema.pre("save", async function (next) {
  const member = this;
  const developer = await Developer.findById(member.admin);
  if (!developer) {
    return next(new Error("Admin doesn't exist."));
  }

  // const currentYear = new Date().getFullYear();
  // console.log(
  //   member.year > 0 && member.year <= 4 && member.secret.length === 10
  // );
  console.log({
    secret: member.secret,
    secret_length: member.secret.length,
    currentYear: member.year,
  });
  if (
    // member.year >= currentYear - 4 &&
    // member.year < currentYear &&
    member.year > 0 &&
    member.year <= 4 &&
    member.secret.length === 10
  ) {
    return next();
  } else {
    return next(new Error("your secret length not enough or year is invalid."));
  }
});

module.exports = mongoose.model("Member", memberSchema);
