// ERROR HANDLER
class CustomError extends Error{
    constructor(error_code, error_message, context) {
        super(error_message);
        this.code = error_code
        this.context = context
    }
}

const ErrorHandler = (err, req, res, next) => {
    console.log(`err`, err)
    let code = err.code || 500;
    let message = err.message || 'Internal Server Error'
    if (err.name === 'ValidationError'){
        code = 400
    }
    res.status(code).json({
        error_message: message,
        error_code: code,
    })
};

module.exports = {
    ErrorHandler,
    CustomError,
}