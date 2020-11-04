import mongoose from "mongoose";
import Member from "./member";
import Position from "./position";
import Developer from "./developer";

const Schema = mongoose.Schema;

const voteSchema = new Schema({
  position: { type: Schema.Types.ObjectId, ref: "Position" },
  from: { type: Schema.Types.ObjectId, ref: "Member" },
  to: { type: Schema.Types.ObjectId, ref: "Member" },
  meta: { type: String, required: true },
});

voteSchema.pre("save", async function (next) {
  const vote = this;
  if (vote.from.toString() === vote.to.toString()) {
    return next(new Error("can't vote to same person."));
  }
  const position = await Position.findById(vote.position);
  if (!position) {
    return next(new Error("position doesn't eixst."));
  }

  const voter = await Member.findById(vote.from).populate("admin");
  const reciver = await Member.findById(vote.to);
  if (
    voter.admin.is_first_poll_enabled &&
    !voter.admin.is_second_poll_enabled
  ) {
    // console.log(voter.first_poll.votes);
    this.meta = "first";
    voter.first_poll.votes.push(this);
    reciver.first_poll.received_votes.push(this);
    await voter.save();
    await reciver.save();
  } else if (
    !voter.admin.is_first_poll_enabled &&
    voter.admin.is_second_poll_enabled &&
    reciver.is_eligible
  ) {
    this.meta = "second";
    voter.second_poll.votes.push(this);
    reciver.second_poll.received_votes.push(this);
    await voter.save();
    await reciver.save();
  } else {
    return next(new Error("conflict in first poll and second poll."));
  }
});

voteSchema.pre("findOne", async function (next) {
  const query = this.getFilter();
  const admin = await Developer.findOne();
  if (admin.is_first_poll_enabled && !admin.is_second_poll_enabled) {
    query.meta = "first";
    this.setQuery(query);
  } else if (!admin.is_first_poll_enabled && admin.is_second_poll_enabled) {
    query.meta = "second";
    this.setQuery(query);
  }
});

module.exports = mongoose.model("Vote", voteSchema);
