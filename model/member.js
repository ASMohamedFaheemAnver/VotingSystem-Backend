const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const memberSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  year: { type: Number, required: true },
  secret: {
    type: String,
    required: true,
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

module.exports = mongoose.model("Member", memberSchema);
