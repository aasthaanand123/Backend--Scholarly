const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    first: String,
    last: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  percentage10th: Number,
  percentage12th: Number,
  percentageUg: Number,
  ugDegree: String,
  intendedDegree: String,
});

module.exports = mongoose.model("user", userSchema);
