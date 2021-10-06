//dependencies
const User = require("../models/People");
const bcrypt = require("bcrypt");
const { unlink } = require("fs");
const path = require("path");
const Conversation = require("../models/Conversation");

// get users details
async function getUsers(req, res, next) {
  try {
    const users = await User.find();

    res.render("users", {
      users: users,
    });
  } catch (err) {
    next(err);
  }
}

async function addUser(req, res, next) {
  let newUser;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  if (req.files && req.files.length > 0) {
    newUser = new User({
      ...req.body,
      password: hashedPassword,
      avatar: req.files[0].filename,
    });
  } else {
    newUser = new User({
      ...req.body,
      password: hashedPassword,
    });
  }

  try {
    const result = await newUser.save();
    res.status(200).json({
      message: "User Added Successfully!",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknown Error Occurs!",
        },
      },
    });
  }
}

async function deleteUser(req, res, next) {
  try {
    
    if(!req.params.id == "610f98467f6cdbc624ff57b3"){
      const user = await User.findOneAndDelete({
        _id: req.params.id,
      });  
    }

    if (user.avatar) {
      unlink(
        path.join(__dirname, `../public/uploads/avatars/${user.avatar}`),
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }

    const conversation = await Conversation.deleteMany({
      $or: [{ "creator.id": user._id }, { "participant.id": user._id }],
    });

    res.status(200).json({
      message: "User Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Could not delete the user",
        },
      },
    });
  }
}

// export
module.exports = {
  getUsers,
  addUser,
  deleteUser,
};
