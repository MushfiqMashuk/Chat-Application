// External dependencies
const createError = require("http-errors");

// Internal dependencies
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/People");
const escape = require("../utilities/escape");

// get inbox details
async function getInbox(req, res, next) {
  try {
    const conversations = await Conversation.find({
      $or: [
        { "creator.id": req.user.userid },
        { "participant.id": req.user.userid },
      ],
    });

    res.locals.data = conversations;
    res.render("inbox");
  } catch (err) {
    next(err);
  }
}

// search user functionality for creating a conversation

async function searchUser(req, res, next) {
  const user = req.body.user;
  const searchQuery = user.replace("+88", "");

  // user can search by name, email or mobile

  const mobile_search_regex = new RegExp("^" + escape("+88" + searchQuery));
  const email_search_regex = new RegExp("^" + escape(searchQuery) + "$", "i");
  const name_search_regex = new RegExp(escape(searchQuery), "i");

  try {
    if (searchQuery !== "") {
      const users = await User.find(
        {
          $or: [
            { name: name_search_regex },
            { email: email_search_regex },
            { mobile: mobile_search_regex },
          ],
        },
        "name avatar"
      );

      res.json(users);
    } else {
      throw createError("You Must Provide Something Valid to Search!");
    }
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
}

async function addConversation(req, res, next) {
  try {
    const newConversation = new Conversation({
      creator: {
        id: req.user.userid,
        name: req.user.username,
        avatar: req.user.avatar || null,
      },

      participant: {
        name: req.body.participant,
        id: req.body.id,
        avatar: req.body.avatar || null,
      },
    });

    const result = await newConversation.save();

    res.status(200).json({
      message: "Conversation was added successfully!",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
}

async function getMessages(req, res, next) {
  try {
    const messages = await Message.find({
      conversation_id: req.params.conversation_id,
    }).sort("-createdAt");

    const { participant } = await Conversation.findById(
      req.params.conversation_id
    );

    res.status(200).json({
      data: {
        messages: messages,
        participant,
      },
      user: req.user.userid,
      conversation_id: req.params.conversation_id,
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknows error occured!",
        },
      },
    });
  }
}

// send a new message
async function sendMessage(req, res, next) {
  if (req.body.message || (req.files && req.files.length > 0)) {
    try {
      // preparing the files
      let attachments = null;

      if (req.files && req.files.length > 0) {
        attachments = [];

        req.files.forEach((file) => {
          attachments.push(file.filename);
        });
      }

      const newMessage = new Message({
        text: req.body.message,
        attachments: attachments,

        sender: {
          id: req.user.userid,
          name: req.user.username,
          avatar: req.user.avatar || null,
        },

        receiver: {
          id: req.body.receiverId,
          name: req.body.receiverName,
          avatar: req.body.avatar || null,
        },

        conversation_id: req.body.conversationId,
      });

      const result = await newMessage.save();

      // emit socket event
      global.io.emit("new-message", {
        message: {
          conversation_id: req.body.conversationId,
          sender: {
            id: req.user.userid,
            name: req.user.username,
            avatar: req.user.avatar || null,
          },
          message: req.body.message,
          attachments: attachments,
          date_time: result.date_time,
        },
      });

      res.status(200).json({
        message: "Success",
        data: result,
      });
    } catch (err) {
      res.status(500).json({
        errors: {
          common: {
            msg: err.message,
          },
        },
      });
    }
  } else {
    res.status(500).json({
      errors: {
        common: "message text or attachment is required!",
      },
    });
  }
}

// export
module.exports = {
  getInbox,
  searchUser,
  addConversation,
  getMessages,
  sendMessage,
};
