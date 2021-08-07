// external imports
const express = require("express");

// internal imports
const {
  getUsers,
  addUser,
  deleteUser,
} = require("../controller/usersController");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
const avatarUpload = require("../middlewares/users/avatarUpload");
const {
  validateUsers,
  userValidatorHandler,
} = require("../middlewares/users/userValidator");
const {
  checkLogin,
  authenticateRole,
} = require("../middlewares/common/checkLogin");

const router = express.Router();

// Users page
router.get(
  "/",
  decorateHtmlResponse("Users"),
  checkLogin,
  authenticateRole(["admin"]),
  getUsers
);

// add user
router.post(
  "/",
  checkLogin,
  authenticateRole(["admin"]),
  avatarUpload,
  validateUsers,
  userValidatorHandler,
  addUser
);

router.delete("/:id", checkLogin, authenticateRole(["admin"]), deleteUser);

// export
module.exports = router;
