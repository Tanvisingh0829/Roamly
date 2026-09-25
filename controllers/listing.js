const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');

module.exports.index = async (req,res)=>{
    const selectedCategory = req.query.category;
    const searchQuery = req.query.search;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;

    let filter = {};
    if (selectedCategory && selectedCategory !== 'All') {
        filter.category = selectedCategory;
    }
    if (searchQuery) {
        filter.$or = [
            { title: { $regex: searchQuery, $options: 'i' } },
            { location: { $regex: searchQuery, $options: 'i' } },
            { country: { $regex: searchQuery, $options: 'i' } }
        ];
    }

    let priceFilter = {};
    if (minPrice && !isNaN(minPrice) && Number(minPrice) >= 0) {
        priceFilter.$gte = Number(minPrice);
    }
    if (maxPrice && !isNaN(maxPrice) && Number(maxPrice) >= 0) {
        priceFilter.$lte = Number(maxPrice);
    }
    if (Object.keys(priceFilter).length > 0) {
        filter.price = priceFilter;
    }

    const allListings = await Listing.find(filter);
    res.render("./listings/index.ejs",{allListings, selectedCategory, searchQuery, minPrice, maxPrice});
};
module.exports.newForm = (req,res)=>{
    // if(!req.isAuthenticated()){
    //     req.flash("error","You Must Be Logged In To Add Listing!");
    //     return res.redirect("/login");
    // }
    res.render("./listings/new.ejs");
}
module.exports.showListing = wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing) {
        req.flash("error","Requested Listing Doesn't Exist!");
        return res.redirect("/listings");
    }
    else res.render("./listings/show.ejs",{listing});
});

module.exports.createListing = wrapAsync(async (req,res,next)=>{
    // try{
    //     // let {title,description,url,price,location,country} = req.body;
    //     let listing = req.body.listing;
    //     let newListing = new Listing(listing);
    //     await newListing.save();
    //     res.redirect("/listings");
    // }
    // catch(err){
    //     next(err);
    // }
    // if(!req.body.listing) throw new ExpressError(400,"Send Valid Data For Listing");
    // let result = listingSchema.validate(req.body);
    // if(result.error) throw new ExpressError(400,result.error);
    let listing = req.body.listing;
    let newListing = new Listing(listing);
    newListing.owner = req.user._id;
    
    if (req.files && req.files.length > 0) {
        newListing.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    }
    await newListing.save();
    req.flash("success","New Listing Created Successfully!")
    res.redirect("/listings");
});

module.exports.editListing = wrapAsync(async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error","Requested Listing Doesn't Exist!");
        return res.redirect("/listings");
    }
    // let existingImageUrl = listing.image.url;
    // existingImageUrl.replace("/upload","/upload/w_200")
    res.render("./listings/edit.ejs",{listing});
});

module.exports.updateListing = wrapAsync(async(req,res)=>{
    let {id} = req.params;
    if(!req.body.listing) throw new ExpressError(400,"Send Valid Data For Listing");
    // let listing = await Listing.findById(id);
    // if(!listing.owner._id.equals(res.locals.currUser._id)){
    //     req.flash("error","You don't have permission to edit!")
    //     return res.redirect(`/listings/${id}`);
    // }
    let listing = await Listing.findById(id);
    
    if (typeof req.files != 'undefined' && req.files.length > 0) {
        let currentImagesCount = listing.images && listing.images.length > 0 ? listing.images.length : (listing.image && listing.image.url ? 1 : 0);
        if (currentImagesCount + req.files.length > 5) {
            req.flash("error", `A listing can have a maximum of 5 images. You are trying to add ${req.files.length} images to your existing ${currentImagesCount} images.`);
            return res.redirect(`/listings/${id}/edit`);
        }
        let newImages = req.files.map(f => ({ url: f.path, filename: f.filename }));
        if (!listing.images) {
            listing.images = [];
        }
        listing.images.push(...newImages);
    }
    
    listing.set({ ...req.body.listing });
    await listing.save();

    req.flash("success","Listing Updated Successfully!")
    res.redirect(`/listings/${id}`);
});

module.exports.deleteListing = wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted Successfully!")
    res.redirect("/listings");
});