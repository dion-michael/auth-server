function handleError(err, req, res, next) {
    console.log(err);
    console.error(JSON.stringify(err, null, 2), 'from error handler');
    let { code, message } = err;
    let errors = err;
    let status = 'error';
    if (!code) code = 500;
    if (err.name === 'ValidationError') {
        code = 400;
        errors = err.errors;
        status = err.name;
    }
    if (!message) message = 'internal server error';
    res.status(code).json({
        status,
        code,
        message,
        errors,
    });
}

class ErrorHandler extends Error {
    constructor(code, message) {
        super();
        this.code = code;
        this.message = message;
    }
}

module.exports = {
    ErrorHandler,
    handleError,
};
