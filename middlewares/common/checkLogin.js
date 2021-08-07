// external imports
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const checkLogin = function (req, res, next) {
  const cookies =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

  if (cookies) {
    try {
      const token = cookies[process.env.COOKIE_NAME];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // if client req for API response. The user info can be accessible from the next middleware
      req.user = decoded;

      // if client req for html response
      if (res.locals.html) {
        res.locals.loggedInUser = decoded;
      }
      next();
    } catch (err) {
      if (res.locals.html) {
        res.redirect("/");
      } else {
        res.status(500).json({
          errors: {
            common: {
              msg: "Authentication Failure!",
            },
          },
        });
      }
    }
  } else {
    if (res.locals.html) {
      res.redirect("/");
    } else {
      res.status(401).json({
        error: "Authentication Failure!",
      });
    }
  }
};

function loggedInUserCheck(req, res, next) {
  const cookies =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

  if (!cookies) {
    next();
  } else {
    res.redirect("/inbox");
  }
}

function authenticateRole(role) {
  return function (req, res, next) {
    if (req.user.role && role.includes(req.user.role)) {
      next();
    } else {
      if (res.locals.html) {
        next(createError(401, "You are not authorized to access this page!"));
      } else {
        res.status(401).json({
          errors: {
            common: {
              msg: "You are not authorized!",
            },
          },
        });
      }
    }
  };
}

// export
module.exports = {
  checkLogin,
  loggedInUserCheck,
  authenticateRole,
};
