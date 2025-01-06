/* A function that takes in a request, response, data, and a code. It then returns a response with the code, data, and success. */
exports.successResponse = (req, res, data, code = 200) =>
  res.send({
    code,
    data,
    success: true,
  });
/* A function that takes in a request, response, data, and a code. It then returns a response with the code, data, and success. */
exports.successResponseWithMessage = (req, res, data, message, code = 200) =>
  res.send({
    code,
    data,
    message,
    success: true,
  });
/* A function that takes in a request, response, errorMessage, code, and error. It then returns a response with the code, errorMessage, error, data, and
  success. */
exports.errorResponse = (
  req,
  res,
  errorMessage = "Something went wrong",
  code = 500,
  error = {}
) =>
  res.status(code).json({
    code,
    errorMessage,
    error,
    data: null,
    success: false,
  });

/* A function that takes in a request, response, errorMessage, code, and error. It then returns a response with the code, errorMessage, error, data, and
  success. */
exports.unauthorizedResponse = (
  req,
  res,
  errorMessage = "Something went wrong",
  code = 401,
  error = {}
) =>
  res.status(code).json({
    code,
    errorMessage,
    error,
    data: null,
    success: false,
  });

/* A function that takes in a request, response, errorMessage, code, and error. It then returns a response with the code, errorMessage, error, data, and
  success. */
exports.notFoundResponse = (
  req,
  res,
  errorMessage = "Something went wrong",
  code = 404,
  error = {}
) =>
  res.status(code).json({
    code,
    errorMessage,
    error,
    data: null,
    success: false,
  });
