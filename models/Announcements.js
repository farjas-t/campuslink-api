const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema(
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

module.exports = mongoose.model("Notes", notesSchema);
