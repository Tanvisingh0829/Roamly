const User = require("../models/user.js");
const wrapAsync = require('../utils/wrapAsync.js');

module.exports.renderSignup = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup = wrapAsync(async(req,res,next)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({username,email});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err) return next(err);
            req.flash("success","Registered Successfully! Welcome to Roamly!");
            res.redirect("/listings");
        });
    }
    catch (e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
});

module.exports.renderLogin = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login = async (req,res)=>{
    req.flash("success","Welcome Back To Roamly!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err) return next(err);
        req.flash("success","You Are Logged Out!");
        res.redirect("/listings");
    });
};