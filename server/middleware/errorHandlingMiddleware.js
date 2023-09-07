const APIError = require('../error/ApiError.js')


const errorHandlingMiddleware = (error, req, res, next) => {
  if (error instanceof APIError) {
    return res.status(error.status).json({message: error.message});
  }
  return res.status(500).json({message: 'Unknown Error'})
}

module.exports = errorHandlingMiddleware;
