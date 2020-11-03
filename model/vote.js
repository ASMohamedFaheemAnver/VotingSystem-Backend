const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const voteSchema = new Schema({
  position: { type: Schema.Types.ObjectId, ref: "Position" },
  from: { type: Schema.Types.ObjectId, ref: "Member" },
  to: { type: Schema.Types.ObjectId, ref: "Member" },
});

module.exports = mongoose.model("Vote", voteSchema);
