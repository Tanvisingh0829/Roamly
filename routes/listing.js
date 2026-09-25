const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require("../models/listing.js")
const {isLoggedIn,isOwner,validateListing} = require('../middlewares.js');
const listingController = require("../controllers/listing.js");
const ExpressError = require('../utils/ExpressError.js');
const multer = require('multer');
const {storage} = require('../cloudConfig.js');

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new ExpressError(400, "Only JPEG, JPG, PNG, and WEBP formats are allowed!"));
        }
    }
});

const uploadImages = (req, res, next) => {
    const uploadMiddleware = upload.array('listing[images]', 5);
    uploadMiddleware(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                return next(new ExpressError(400, "Maximum 5 images allowed per listing!"));
            }
            if (err.code === 'LIMIT_FILE_SIZE') {
                return next(new ExpressError(400, "Image size should not exceed 5MB!"));
            }
            return next(new ExpressError(400, err.message));
        } else if (err) {
            return next(err);
        }
        next();
    });
};

router.get("/new",isLoggedIn,listingController.newForm);

router.route('/')
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,uploadImages,validateListing,listingController.createListing);                                                                        

router.route('/:id')
    .get(listingController.showListing)
    .put(isLoggedIn,isOwner,uploadImages,validateListing,listingController.updateListing)
    .delete(isLoggedIn,isOwner,listingController.deleteListing);

// // Index Route
// router.get("/",wrapAsync(listingController.index));

// New Route

// // Show Route
// router.get("/:id",listingController.showListing);

// // Create Route
// router.post("/",isLoggedIn,validateListing,listingController.createListing);

// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,listingController.editListing);

// // Update Route
// router.put("/:id",isLoggedIn,isOwner,validateListing,listingController.updateListing);

// // Delete Route
// router.delete("/:id",isLoggedIn,isOwner,listingController.deleteListing);

module.exports = router;