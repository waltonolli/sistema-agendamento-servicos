const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
  getBookingSummary,
  setBookingStatus,
  getProviders,
} = require('../Controllers/bookingController');
const authMiddleware = require('../Middleware/authMiddleware');

router.post('/', authMiddleware, createBooking);
router.get('/summary', authMiddleware, getBookingSummary);
router.get('/providers', authMiddleware, getProviders);
router.get('/', authMiddleware, getBookings);
router.get('/:id', authMiddleware, getBookingById);
router.put('/:id', authMiddleware, updateBooking);
router.put('/:id/status', authMiddleware, setBookingStatus);
router.delete('/:id', authMiddleware, cancelBooking);

module.exports = router;
