function errorHandler(err, req, res, next) {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'Internal Server Error';

    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            status: err.statusCode,
            message: err.message,
            stackTrace: err.stack,
            error: err
        });
    } else if (process.env.NODE_ENV === 'production') {
        if (err.isOperational) {
            res.status(err.statusCode).json({
                status: err.statusCode,
                message: err.message,
            })
        } else {
            res.status(500).json({
                status: "500",
                message: 'Server Error'
            })
        };
    }
}
module.exports = errorHandler;