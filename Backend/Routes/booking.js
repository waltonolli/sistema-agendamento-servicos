const express = require('express');
const router = express.Router();
const { createBooking, getBookings, cancelBooking } = require('../Controllers/bookingController');
const authMiddleware = require('../Middleware/authMiddleware');

router.post('/', authMiddleware, createBooking);
router.get('/', authMiddleware, getBookings);
router.delete('/:id', authMiddleware, cancelBooking);

module.exports = router;
