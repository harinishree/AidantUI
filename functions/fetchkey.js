const user = require('../models/registerether'); 

exports.fetchkey = (url,usertype) => {

    return new Promise((resolve, reject) => {
        console.log("Entering in to the function")


        const newUser = new user({   
            
            url:url
        });
        newUser
        .save()
        console.log("newuser finished");
        user.find({
           "usertype":usertype
        })
            
            .then(users => {
                console.log("users", users)
               
                resolve({
                    status: 201,
                    usr: users
                })

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