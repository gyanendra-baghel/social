export const responseHandler = (req, res, next) => {
  res.sendResponse = (statusCode, data = null, message = "", errors = null) => {
    if (!statusCode) {
      throw new Error("statusCode not provided.");
    }

    const success = statusCode < 400;
    // console.log({ success, message, data, errors });
    res.status(statusCode).json({ success, message, data, errors });
  };
  next();
};
