
'use strict';

const user = require('../models/properties');  
// const user = require('../models/fetchdata');

exports.outboxUser = (url,usertype,publickey,venpublickey,status) => {
    return new Promise((resolve, reject) => {

    const newUser = new user({

        url:url,
       usertype:usertype,
     publickey:publickey,
     venpublickey: venpublickey,
     status:status,
   
    });
    newUser
    .save()
    .then(() => resolve({status: 201, message: 'Stored successfully', status:status}))
            .catch(err => {
    
                    reject({status: 500, message: err});
                })
            });
}