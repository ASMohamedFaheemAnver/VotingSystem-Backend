const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const memberSchema = new Schema({
  year: { type: Number, required: true },
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
  this.is;
  const currentYear = new Date().getFullYear();
  console.log({ secret: member.secret, currentYear: currentYear });
  if (
    member.year > currentYear - 4 &&
    member.year < currentYear &&
    member.secret.length === 10
  ) {
    next();
  } else {
    next(new Error("your secret length not enough or year is invalid."));
  }
});

module.exports = mongoose.model("Member", memberSchema);
