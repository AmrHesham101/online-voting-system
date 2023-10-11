const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const voterSchema = new mongoose.Schema(
  {
    nationalId: { type: String },
    rating: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);
const topicSchema = new Schema({
  title: { type: String, require: true },
  description: { type: String, require: true },
  rating: { type: Number, default: 0 },
  startDate: { type: Date, require: true },
  endDate: { type: Date, require: true },
  voters: [voterSchema],
});

module.exports = mongoose.model("Topic", topicSchema);
