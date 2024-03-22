const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    paper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Paper",
    },
    content: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    datetime: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chat", chatSchema);
