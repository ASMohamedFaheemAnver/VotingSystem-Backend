const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const positionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
});

positionSchema.pre("save", async function (next) {
  const position = this;
  if (position.title.length < 5) {
    next(new Error("position should be atleast 5 charecters."));
  }
  next();
});

module.exports = mongoose.model("Position", positionSchema);
