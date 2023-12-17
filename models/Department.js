const mongoose = require("mongoose");

//Department Detailes
const deptSchema = new mongoose.Schema({
  deptname: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Department", deptSchema);
