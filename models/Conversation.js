const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    name: {type: String, required: false},
    members: {
      type: Array,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
