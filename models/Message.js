const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    sender: {
      type: String,
    },
    text: {
      type: String,
    },
    createdAt: {type: Date, default: new Date()}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
