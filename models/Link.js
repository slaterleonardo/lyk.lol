const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
  _id: {
        type: String,
      },
  original_link: {
    type: String,
    required: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
},
  {
    versionKey: false,
  },
);

module.exports = mongoose.model("Link", linkSchema);
