const mongoose = require("mongoose") ; 
const initData = require("./data.js") ; 
const Listing = require("../models/listing.js") ; 

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/rentrove');
}

main().then((res)=>{
    console.log("Connection Build")
})
.catch((err)=>{
    console.log(err) ; 
})

const initDB = async ()=>{
    await Listing.deleteMany({}) ; 
    initData.data = initData.data.map((obj)=> ({...obj ,owner : "688861092649b5eb95804b78"}))
    await Listing.insertMany(initData.data)
    console.log("Data was initialized")  ;
}

initDB() ; 