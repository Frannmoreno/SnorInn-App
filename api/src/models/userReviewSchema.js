const mongoose = require('mongoose');

const userReviewSchema = mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserAdmin'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserClient'
    },
    reservationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservation'
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'room'
    },
    stars: Number,
    comment: String,

}, { versionKey: false })

module.exports = mongoose.model('userReviewSchema', userReviewSchema)