class customError extends Error {
    constructor(message, statusCode) {
        console.log(message)
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? 'Client Error' : 'Internal Server Error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = customError;