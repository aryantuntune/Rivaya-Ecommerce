const express = require('express');
const {
    getActiveBanner,
    getAllBanners,
    createBanner,
    updateBanner,
    deleteBanner
} = require('../controllers/bannerController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/active', getActiveBanner);

router
    .route('/')
    .get(protect, authorize('admin'), getAllBanners)
    .post(protect, authorize('admin'), createBanner);

router
    .route('/:id')
    .put(protect, authorize('admin'), updateBanner)
    .delete(protect, authorize('admin'), deleteBanner);

module.exports = router;
