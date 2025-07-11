// require mongoose
const mongoose=require("mongoose")

// define schema 
const Schema=mongoose.Schema


// user schema 
const userSchema=new Schema({
    name:{type:String},
    email:{type:String,unique:true},
    password:{type:String(hashed)},
    role:{type:String,enum:["donor","volunteer","NGO","Beneficiary"],required:true},
    address:{type:String},
    

},{timestamps:true})
// Donation schema
const donationSchema=new Schema({
    donorId:{type:Schema.Types.ObjectId,ref:"User",required:true},
    type:{type:String,enum:["food","clothes ","medicine","money"],required:true},
    amount:{type:Number,required:true},
    date:{type:Date,default:Date.now},
    status:{type:String,enum:["pending","accepted","rejected"],default:"pending"},
    
},{timestamps:true})
// Request Schema
const requestSchema=new Schema({
    beneficiaryId:{type:Schema.Types.ObjectId,ref:"User",required:true},
    type:{type:String,enum:["food","clothes ","medicine","money"],required:true},
    amount:{type:Number,required:true},
    date:{type:Date,default:Date.now},
    status:{type:String,enum:["pending","accepted","rejected"],default:"pending"},
},{timestamps:true})
// volunteer opportunities schema
const volunteerOpportunitySchema=new Schema({
    NGOId:{type:Schema.Types.ObjectId,ref:"User",required:true},
    type:{type:String,enum:["food","clothes ","medicine","money"],required:true},
    amount:{type:Number,required:true},
    date:{type:Date,default:Date.now},
    status:{type:String,enum:["pending","accepted","rejected"],default:"pending"},
},{timestamps:true})