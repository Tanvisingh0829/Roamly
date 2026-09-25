const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
    .then(()=>{
        console.log("Connection Successful! to the Database")
    })
    .catch((err)=>{
        console.log(err);
    });

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/roamly');
}

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:'6a9d967c8023e2a0516f82b0'}))
    await Listing.insertMany(initData.data);
    console.log("Data Initialized");
}

initDB();