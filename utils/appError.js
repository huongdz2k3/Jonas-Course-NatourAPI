class AppError extends Error {
    constructor(message, statusCode) {
        super(message) // call parent constructor

        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
        this.isOperational = true

        Error.captureStackTrace(this, this.constructor)
        // moi lan chay this.constructor la class nay chay 
    }
}

module.exports = AppError