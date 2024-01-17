const mongoose = require("mongoose");

const announceSchema = new mongoose.Schema(
  {
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
);

module.exports = mongoose.model("Announce", announceSchema);
