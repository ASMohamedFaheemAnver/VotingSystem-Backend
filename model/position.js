const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const positionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Position", positionSchema);
