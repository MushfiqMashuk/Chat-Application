const mongoose = require("mongoose");

const conversationSchema = mongoose.Schema(
  {
    creator: {
      id: mongoose.Types.ObjectId,
      name: String,
      avatar: String,
    },

    participant: {
      id: mongoose.Types.ObjectId,
      name: String,
      avatar: String,
    },

    last_updated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// export the schema
const Conversation = new mongoose.model("conversation", conversationSchema);
module.exports = Conversation;
