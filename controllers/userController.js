const AppError = require('../utils/appError')
const User = require('./../models/userModel')
const APIFeatures = require('./../utils/apiFeatures')
const catchAsync = require('./../utils/catchAsync')
const factory = require('./handlerFactory')


const filterObj = (obj, ...allowFields) => {
    const newObj = {}
    Object.keys(obj).forEach(el => {
        if (allowFields.includes(el)) newObj[el] = obj[el]
    })
    return newObj
}

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id
    next()
}


exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not update password', 401))
    }
    // 2) Filtered out unwanted
    const filterBody = filterObj(req.body, 'name', 'email')
    // 3) Update user document
    const updateUser = await User.findByIdAndUpdate(req.user.id, filterBody)

    res.status(200).json({
        status: 'success',
        data: {
            updateUser
        }
    })
})

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false })
    res.status(204).json({
        status: "success",
        data: null
    })
})


exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined! Please use/signup instead'
    })
}
exports.getAllUsers = factory.getAll(User)
exports.getUser = factory.getOne(User)
// Do not update pass with this!
exports.updateUser = factory.updateOne(User)
exports.deleteUser = factory.deleteOne(User)