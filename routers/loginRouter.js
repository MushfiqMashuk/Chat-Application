// external imports
const express = require("express");

// internal imports
const { getLogin, login, logout } = require("../controller/loginController");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
const {
  validateLogin,
  validateLoginHandler,
} = require("../middlewares/login/loginValidator");
const { loggedInUserCheck } = require("../middlewares/common/checkLogin");

const router = express.Router();
const page_title = "Login";

// login page
router.get("/", decorateHtmlResponse(page_title), loggedInUserCheck, getLogin);

// user login
router.post(
  "/",
  decorateHtmlResponse(page_title),
  validateLogin,
  validateLoginHandler,
  login
);

// user logout
router.delete("/", logout);

// export
module.exports = router;
