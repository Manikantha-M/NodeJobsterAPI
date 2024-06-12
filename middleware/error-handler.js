const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {

  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg:err.message || 'Something went wrong, try again later'
  }
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }
  if(err.code && err.code == 11000){
    customError.msg = `Duplicate User Registration: ${err.keyValue.email}`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  if(err.name == 'CastError'){
    customError.msg = `No item found with id: ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }
  return res.status(customError.statusCode).json({ msg: customError.msg });
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
}

module.exports = errorHandlerMiddleware
