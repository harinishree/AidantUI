var web3 = require('web3')
var web3SocketProvider = new web3.providers.HttpProvider('http://localhost:8545');
const web3Obj = new web3(web3SocketProvider);
var contract = require("../node_modules/truffle-contract");
const smartcurrency_artifacts = require('../build/contracts/SmartCurrency.json')
var SmartCurrency = contract(smartcurrency_artifacts);




// change provider

var accounts;
// var account;
var account;


//  window.App = {
   
    // start: function() {
     

        // Bootstrap the MetaCoin abstraction for Use.
        //MetaCoin.setProvider(web3.currentProvider);
        // SmartCurrency.setProvider(web3.currentProvider);
        // // SmartCurrencyE.setProvider(web3.currentProvider);
       
        // // Get the initial account balance so it can be displayed.
        // web3.eth.getAccounts(function(err, accs) {
        //     if (err != null) {
        //         alert("There was an error fetching your accounts.");
        //         return;
        //     }

        //     if (accs.length == 0) {
        //         alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        //         return;
        //     }
          
        //     accounts = accs;
        //     account=accounts[0];
        //     console.log(account);
        //     // web3.eth.defaultAccount = web3.eth.accounts[0]

           
           
        
        //     // self.accountStatus();
        // });

   

 module.exports.filereader = (URL,sndKey,url,usertype,Key) => new Promise((resolve, reject) => {   
   
    var globalVariable={
        files: [URL,sndKey,url,usertype,Key]
     };
  
        console.log("entering into the web3.js fnc");
        console.log("files.......,",url)
        
    SmartCurrency.setProvider(web3SocketProvider);
        // SmartCurrencyE.setProvider(web3.currentProvider);
       
        // Get the initial account balance so it can be displayed.
        // async function getAccounts() {
        //     let accounts = await web3Obj.eth.getAccounts();
        //  }
        web3Obj.eth.getAccounts(function(err, accs) {
            if (err != null) {
                alert("There was an error fetching your accounts.");
                return;
            }

            if (accs.length == 0) {
                alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
                return;
            }
          
            accounts = accs;
            account=accounts[0];
            console.log(account);
            // web3.eth.defaultAccount = web3.eth.accounts[0]

           
           
        
            // self.accountStatus();
        });

    
        var rapid;
        console.log("manoj")
        SmartCurrency.deployed().then(function(instance) {
            console.log("entering into solidity",Key)
            console.log("entering into solidity",sndKey)
            console.log("entering into solidity",url)
            // console.log("entering into solidity",pubKey)
            rapid = instance;
        //   var url = "QmQyr151jHbMyZSbrsfPoAG5SeYcW5RvvMTzNvvCg5C5Ef"
          
            return rapid.StoreDocument(sndKey.toString(), url,Key.toString(),{
                from: account
                
            });
           
       }) .then(() => resolve({
           status: 201,
          message: "Transaction Complete"
       
    //  })).catch(err => {

    //         reject({
    //             status: 401,
    //             message: 'Invalid Credentials !'
    //         });
        
    })).then(() => resolve({
        status: 201,
        message: 'loan  approved Sucessfully !'
    }))

    .catch(err => {

        if (err.code == 11000) {

            reject({
                status: 409,
                message: ' loan closed !'
            });

        } else {
            console.log("error occurred" + err);

            reject({
                status: 500,
                message: 'Internal Server Error !'
            });
        }
    });

 })



