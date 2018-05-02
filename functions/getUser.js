'use strict';

const user = require('../models/registerether');

exports.getUser = (email,phonenumber,otp) => {

    return new Promise((resolve, reject) => {
        console.log("Entering in to the getuser function")

        user
            .find({email:email,phonenumber:phonenumber})
            
            .then(users => {
                console.log("Entering in to teh then function");
                console.log("users",users);
                    resolve({
                        status: 200,
                        message : "Email sent successfully"
                    });
                })
                 .catch(err => {
    
                    reject({
                        status: 401,
                        message: 'Invalid Credentials !'
                    });
                
            })
        });
};