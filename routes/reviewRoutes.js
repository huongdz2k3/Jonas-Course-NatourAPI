const express = require('express')
const router = express.Router({ mergeParams: true })

const reviewController = require('./../controllers/reviewController')
const authController = require('./../controllers/authController')

router.use(authController.protect) // add feature need to be login

router.route('/')
    .get(reviewController.getAllReviews)
    .post(authController.restrictTo('user'),
        reviewController.setTourUserIds,
        reviewController.createReview)

router.route('/:id')
    .delete(reviewController.deleteReview)
    .patch(authController.restrictTo('user', 'admin'), reviewController.updateReview)
    .get(authController.restrictTo('user', 'admin'), reviewController.getReview)
module.exports = router