'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const registerpageSchema = mongoose.Schema({
    companyname:String,
    firstname: String,
    lastname: String, 
    phonenumber : Number,
    email : {
        type: String,
        unique: true
    },
    otp: Number,
    userObject: Object,
    password: String,
    retypepassword: String,
    usertype:  String,
    encodedMail: String,
    status: Array,
    count: Number,
    publickey: String,
    privatekey: String,
    url: String
    
    
     
});


mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/digitalId', { useMongoClient: true });


    mongoose.connect('mongodb://harini:Harini!96@ds119406.mlab.com:19406/mortgage', {
    useMongoClient: true
});



module.exports = mongoose.model('registerether', registerpageSchema);