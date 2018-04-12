'use strict';

const user = require('../models/registerether');

exports.newLogin = (otp) =>

    new Promise((resolve, reject) => {

 

        user.find({
                "otp": otp
            })
            .then(newusers => {
                console.log("newusers",newusers);
                const dbotp = newusers[0].otp;
                console.log("otp123....>>",dbotp);
                //console.log(dbpin + "   " + users[0].password)

                if (String(otp) === String(dbotp)) {
                    console.log("Entering in to the if loop");
                    resolve({
                        status: 200,
                        message:"OTP verified",
                    
                    });

                } else {
                    console.log("Entering in to the else loop");
                    reject({
                        status: 402,
                        message: ' email or password wrong!'
                    });
                }
            })

            .catch(err => reject({
                status: 401,
                message: 'OTP does not exist'
            }));


    });