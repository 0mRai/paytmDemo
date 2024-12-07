// import mongoose from "mongoose";
const mongoose= require("mongoose");
const { number } = require("zod");

mongoose.connect('mongodb+srv://OmRai:Omrai78677@cluster1.adnkooh.mongodb.net/');

const userSchema=mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String
});

const accountSchema=mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,  //reference to user model similar to foreign key
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
})

const Account = mongoose.model('Account', accountSchema);
const User=mongoose.model('User', userSchema);

module.exports={
    User,
    Account    
}