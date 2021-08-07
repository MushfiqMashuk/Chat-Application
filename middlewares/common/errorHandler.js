const createError = require("http-errors");

// 404 not found handler
function notFoundHandler(req, res, next) {
  next(createError(404, "Requested Content Not Found"));
}

// error handler
function errorHandler(err, req, res, next) {
  res.locals.error =
    process.env.NODE_ENV === "development" ? err : { message: err.message };

  res.status(err.status || 500);

  if (res.locals.html) {
    // html response
    res.render("error", {
      title: "Page Not Found",
    });
  } else {
    // json response
    console.log(res.locals.error);
    res.json(res.locals.error);
  }
}

// export
module.exports = {
  notFoundHandler,
  errorHandler,
};
