'use strict';

const user = require('../models/registerether');
const sendmail = require('sendmail')();

exports.mail = (email,otp) => {

    return new Promise((resolve, reject) => {
        console.log("Entering in to the mailer  function")
        user
        .find({email:email})

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
}
        
        

