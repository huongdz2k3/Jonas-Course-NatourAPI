const express = require('express')
const fs = require('fs')
const app = express()
const morgan = require('morgan')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const reviewRouter = require('./routes/reviewRoutes')


const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSantitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')

// global middleware
// Security HTTP headers
app.use(helmet()) // put begining first middleware
app.use(morgan('dev'))

// Limit req from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000, // limit time
    message: 'Too many reqs from this IP, pls try again in an hour '
})
app.use('/api', limiter) // use this middleware with this begin '/api'

// Data sanitization against NoSQL query injection
app.use(mongoSantitize())
// Data sanitization  against XSS 
app.use(xss())
// Prevent parameter pollution
app.use(hpp({
    whitelist: [
        'duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', "difficulty", "price"
    ]
}))
// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })) // > 10kb not accept
// Serving static files
app.use(express.static(`${__dirname}/public`))


// Route hander
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)

//strat server

// Error Handling Middleware
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})
app.use(globalErrorHandler)

module.exports = app
