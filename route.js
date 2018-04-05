var cors = require('cors');
var mongoose = require('mongoose');
var Promises = require('promise');
var cloudinary = require('cloudinary').v2;
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var path = require('path');
const Nexmo = require('nexmo');
const verifyemail = require('./functions/emailverification');
const verifyphone = require('./functions/phoneverification');
const getotp = require('./functions/getotp');
const nodemailer = require('nodemailer');
const User = require('./functions/getUser');
const registerUser = require('./functions/registerUser');
const login = require('./functions/login');
const fetchkey = require('./functions/fetchkey');
const filereader = require('./functions/filereader');
const getStatus = require('./functions/getStatus');
var fs =require('fs');



const nexmo = new Nexmo({
    apiKey: 'be214ba0',
    apiSecret: 'F0WCG2adz2udXrCB'
});



 module.exports = router => {

router.post('/registerUser', cors(), (req, res) => { 
    console.log("UI",req.body);

    const companyname = req.body.companyname;
    console.log(companyname);
    const firstname = req.body.fname;
    console.log(firstname);
    const lastname = req.body.lname;
    console.log(lastname);
    const email = req.body.email;
    console.log(email); 
    const password = req.body.pass;
    console.log(password);
    const retypepassword = req.body.repass;
    console.log(retypepassword);
    const usertype = req.body.usertype;
    console.log(usertype);
    const userObject = req.body.userObject;
    console.log( "phone",userObject);
    // const publickey = req.body.publickey;
    // console.log( "phone",publickey);
    // const privatekey = req.body.privatekey;
    // console.log( "phone",privatekey);
    var phonetosend = userObject.phone;
    var otp = "";
    var possible = "0123456789";
    for (var i = 0; i < 4; i++)
        otp += possible.charAt(Math.floor(Math.random() * possible.length));
    console.log("otp" + otp);
     var encodedMail = new Buffer(req.body.email).toString('base64');
    
    if (!firstname || !lastname || !userObject || !email || !password || !retypepassword || !usertype) {
        res.status(400)
            .json({
                message: 'Invalid Request !'
            });

    } else {

        registerUser.registerUser(companyname,firstname, lastname, userObject,email,password, retypepassword,usertype,encodedMail)
            .then(result => {
                console.log("results harini", result);
                // var link = "https://" + remoteHost + "/email/verify?mail=" + encodedMail + "&email=" + email;
                var transporter = nodemailer.createTransport("SMTP", {
                    host: 'smtp.ipage.com',
                    port: 587,
                    secure: true,
                    auth: {
                        user: "rahul.desai@rapidqube.com",
                        pass: "Rpqb@12345"
                    }
                });
                                   
                                    var mailOptions = {
                                        transport: transporter,
                                        from: 'rahul.desai@rapidqube.com',
                                        to: email,
                                        subject: 'Register Invitation',
                                         html:  "Registered Successfully "

                                    };
                                    transporter.sendMail(mailOptions, (error, info) => {
                                        if (error) {}
                                    });
                                    // nexmo
                                    // .message
                                    // .sendSms('919842653746', phonetosend, otptosend, {
                                    //     type: 'unicode'
                                    // }, (err, responseData) => {
                                    //     if (responseData) {
                                    //         console.log(responseData)
                                    //     }
                                    // });
              
   
                    // res.status(result.status).json({
                    //     message: result.message,
                    //     ind: true
                    // })
                    res.send({
                        "message": "user has been registered successfully",
                        "status": true,


                    });

                })
    
                .catch(err => res.status(err.status).json({
                    message: err.message
                }).json({
                    status: err.status
                }));
            }
        });

router.post('/login', cors(), (req, res) => {
    console.log("entering login function in functions ");
    const emailid = req.body.email;
    console.log(emailid);
    const passwordid = req.body.password;
    console.log(passwordid);
   
   
    login
        .loginUser(emailid, passwordid)
        .then(result => {  
            console.log("resultharini",result); 
            console.log("result ===>>>",result.users.usertype)
            


            res.send({
                "message": "Login Successful",
                "status": true,
                "usertype":result.users.usertype,
               "publicKey": result.users.publickey,
                "PrivateKey":result.users.privatekey
            });
        })
        .catch(err => res.status(err.status).json({
            message: err.message
        }).json({
            status: err.status
        }));

}); 

// router.post('/fetchkey', cors(), (req, res) => {

//     console.log(req.body);
//     var url = req.body.url;
//     console.log("url",url);
   
//     var usertype = req.body.usertype;
//     console.log(req.body.usertype);
//     fetchkey
//         .fetchkey(url,usertype)
//         .then(function(result) {
//             console.log(result)

//             res.send({
//                 status: result.status,
//                 message: result.usr
//             });
//         })
//         .catch(err => res.status(err.status).json({
//             message: err.message
//         }));


// }); 


router.get("/email/verify", cors(), (req, res, next) => {
    var status;
    var querymail = req.query.mail;
    var email = req.query.email;
    console.log("URL: " + querymail);
    console.log("email: " + email);
    User
        .getUser(email)
        .then(result => {
            var minutes1 = new Date(result.usr[0]._doc.created_at).getMinutes();
            console.log("minutes1" + minutes1);
            var minutes2 = new Date().getMinutes();
            console.log("minutes2" + minutes2);
            var diffinminutes = minutes2 - minutes1;
            if (diffinminutes > 10) {
                deleteuser
                    .deleteuser(email)
                    .then(result => {
                        res.send({
                            status: 201,
                            message: 'your email link has been expired please register again'
                        });
                    })
                    .catch(err => res.status(err.status).json({
                        message: err.message
                    }));

            } else {
                verifyemail
                    .emailverification(querymail)
                    .then(result => {
                        var status = result.usr.status
                        if (status.length == 2) {
                            res.send({
                                "status": true,
                                "message": "registration successful"
                            });
                        } else {

                            res.send({
                                "status": false,
                                "message": "please verify mobile no too"
                            });
                        }

                    })
                    .catch(err => res.status(err.status).json({
                        message: err.message
                    }));
            }
        });
});
router.post("/user/phoneverification", cors(), (req, res) => {
    console.log(req.body);
    const email = req.body.email;
    const phone = req.body.phone;
    var otp = req.body.otp;
    console.log(otp);
    console.log(phone);
    User
        .getUser(email)
        .then(result => {
            var minutes1 = new Date(result.usr[0]._doc.created_at).getMinutes();
            console.log("minutes1" + minutes1);
            var minutes2 = new Date().getMinutes();
            console.log("minutes2" + minutes2);
            var diffinminutes = minutes2 - minutes1;
            if (diffinminutes > 10) {
                res.send({
                    status: 201,
                    message: 'your otp has been expired please request new one'
                });
            } else {
                verifyphone
                    .phoneverification(otp, phone, userinfo)
                    .then(result => {
                        var status = result.usr.status
                        if (result.status === 202) {
                            res
                                .status(result.status)
                                .json({
                                    message: result.message
                                });
                        } else if (status.length == 2) {
                            res
                                .status(result.status)
                                .json({
                                    message: "registration successful",
                                    status: true
                                })
                        } else {

                            if (result.status === 404) {
                                res
                                    .status(result.status)
                                    .json({
                                        message: result.message
                                    });
                            } else {
                                res
                                    .status(200)
                                    .json({
                                        message: "please verify emailid too",
                                        status: false
                                    });

                            }
                        }

                    })
                    .catch(err => res.status(err.status).json({
                        message: err.message
                    }));
            }
        })
        .catch(err => res.status(err.status).json({
            message: err.message
        }));
});


router.post('/filereader', cors(), (req,res) => {
    console.log("UI",req.body);
    const URL = req.body.url;
    console.log(URL);
    var usertype = req.body.usertype;
    console.log(usertype);
    // const pubKey = req.body.pubKey;
    // console.log(pubKey);
    const Key = req.body.Key;
    console.log(Key);
        // perform operation e.g. GET request http.get() etc.
       
      
        // cron.schedule('*/2 * * * *', function(){
         
          
        fs.readdir(req.body.url, (err, files) => {
            // sha256(req.body.URL);
            // fs.stat(req.body.URL, (err, stats)=> { 
            //     if(err){
            //       //doing what I call "early return" pattern or basically "blacklisting"
            //       //we stop errors at this block and prevent further execution of code
              
            //       //in here, do something like check what error was returned
            //       switch(err.code){
            //         case 'ENOENT':
            //           console.log(req.body.URL + ' does not exist');
            //           break;
            //       }
            //       //of course you should not proceed so you should return
            //       return;
            //     }
              
            //     //back there, we handled the error and blocked execution
            //     //beyond this line, we assume there's no error and proceed
              
            //     if (stats.isDirectory()) {
            //       console.log(req.body.URL + ": is a directory");
            //     } else {
            //       console.log(stats);
            //     }
            //   });
          files.forEach(file => {
              if(file)
            console.log("data",file);
            var file = file;
      
                     
// var file = sha256.create();
// file.update(req.body.URL);
// file.hex();
// console.log("encrypted",file)
            
        console.log(file)
        if (!URL ||!Key || !file || !usertype ) {
        res
            .status(400)
            .json({
                message: 'Invalid Request !'
            });
        }
            else {
                filereader
                    .filereader(URL,Key,file,usertype)
                    .then(result => {
        
                        res.send({
                            "message": "Transaction complete",
                            "status": true,
        
                         
        
                        });
        
        
                    })
                    .catch(err => res.status(err.status).json({
                        message: err.message
                    }).json({
                        status: err.status
                       
                    }));
            }
         });
        
      
       })
        
     }); 
    //  console.log('running a task every two minutes');
    // });
    router.post('/getAck', cors(), (req,res) => {
       var Key = req.body.Key;
       console.log(Key);
        var ack = req.body.ack
        console.log(ack);
        if (!ack) {
            res
                .status(400)
                .json({
                    message: 'Invalid Request !'
                });
            }
                else {
    
                    getAck
                        .getAck(Key,ack)
                        .then(function(result) {
            
                            res.send({
                                "message": result.message,
                                "status": true,
            
                             
            
                            });
            
            
                        })
                        .catch(err => res.status(err.status).json({
                            message: err.message
                        }).json({
                            status: err.status
                           
                        }));
                }
             });
    
    
    router.post('/getStatus', cors(), (req,res) => {
        var self = this;
        var key = req.body.Key;
        console.log(key)
        if (!key) {
            res
                .status(400)
                .json({
                    message: 'Invalid Request !'
                });
            }
                else {
    
                    getStatus
                        .getStatus(key)
                        .then(function(result) {
            
                            res.send({
                                "message": result.message,
                                "status": true,
            
                             
            
                            });
            
            
                        })
                        .catch(err => res.status(err.status).json({
                            message: err.message
                        }).json({
                            status: err.status
                           
                        }));
                }
             });

    }
