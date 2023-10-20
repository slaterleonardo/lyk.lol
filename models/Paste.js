const mongoose = require("mongoose");

const pasteSchema = new mongoose.Schema({
    _id: {
        type: String,
    },
    text: {
        type: String,
        required: true,
    },
    self_destruct: {
        type: Boolean,
        default: false,
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

module.exports = mongoose.model("Paste", pasteSchema);
