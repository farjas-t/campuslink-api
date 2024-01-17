const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
    },
    datetime: {
      type: String,
      required: true,
    },
  },
);

module.exports = mongoose.model("Notes", notesSchema);
