'use strict';

const user = require('../models/registerether');
// const user = require('../models/fetchdata');

exports.loginUser = (email, password,usertype) =>

    new Promise((resolve, reject) => {

        console.log("Entering into login fun");
        console.log(email);
        user.find({
                "email": email ,
            
            })
            .then(users => {
                const dbpin = users[0].password;
                console.log(users[0].password)
                console.log(users[0]._id)
                console.log(dbpin + "   " + users[0].password)

                if (String(password) === String(dbpin)) {

                    resolve({
                        status: 200,
                        users: users[0]
                    });

                } else {

                    reject({
                        status: 401,
                        message: 'Invalid Credentials !'
                    });
                }
            })


    });