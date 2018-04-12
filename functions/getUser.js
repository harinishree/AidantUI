'use strict';

const user = require('../models/registerether');

exports.getUser = (email,phonenumber,otp) => {

    return new Promise((resolve, reject) => {
        console.log("Entering in to the getuser function")

        user
            .find({email:email,phonenumber:phonenumber}).then((users) => {

            console.log("harini123...",users);
            console.log("email123...>>>",email);

            resolve({status: 201, usr: users})

        })
            .catch(err => {

                if (err.code == 11000) {

                    return reject({
                        status: 409,
                        message: 'cant fetch !'
                    });

                } else {
                    console.log("error occurred" + err);

                    return reject({
                        status: 500,
                        message: 'Internal Server Error !'
                    });
                }
            })
    })
};