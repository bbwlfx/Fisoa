const { code, errorMsg } = require('../code.config');

const serverError = {
  type: code.serverError,
  data: {
    msg: errorMsg.serverError
  }
};

module.exports = serverError;
