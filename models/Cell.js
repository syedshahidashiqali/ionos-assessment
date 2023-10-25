const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const cellSchema = new Schema(
  {
    labyrinthId: {
      type: Schema.Types.ObjectId,
      ref: "Labyrinth",
      required: true,
    },
    type: {
      type: String,
      enum: ['empty', 'filled'],
      required: true,
    },
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
    isStart: {
      type: Boolean,
      default: false,
    },
    isEnd: {
      type: Boolean,
      default: false,
    },
  }, { timestamps: true }
);

module.exports = mongoose.model("Cell", cellSchema);