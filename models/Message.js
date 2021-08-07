const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    text: String,

    attachments: [
      {
        type: String,
      },
    ],

    sender: {
      id: mongoose.Types.ObjectId,
      name: String,
      avatar: String,
    },

    receiver: {
      id: mongoose.Types.ObjectId,
      name: String,
      avatar: String,
    },

    date_time: {
      type: Date,
      default: Date.now,
    },

    conversation_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// export the schema
const Message = new mongoose.model("message", messageSchema);
module.exports = Message;
