const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authentication');
const checkTestUser = require('../middleware/testuser');
const rateLimit = require('express-rate-limit');

const {login, register, updateUser} = require('../controllers/auth');
const apiRateLimiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	limit: 3, // Limit each IP to 3 requests per `window` (here, per 5 minutes).
    messsage:{msg:'Too many requests from this IP, please try again after 5 mins'},
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
});

router.post('/register', apiRateLimiter, register);
router.post('/login', apiRateLimiter, login);
router.patch('/updateUser', authenticateUser, checkTestUser, updateUser)
module.exports = router;