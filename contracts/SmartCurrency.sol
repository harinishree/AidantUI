pragma solidity ^0.4.6;
contract SmartCurrency {
  
 // This is a Type
 struct DocumentStruct{
   // Not possible to pass strings between contracts at this time
     bytes32 url;
     bytes32 Key;
//  string sndKey;
  }
   
 // This is a namespace where we will store docs of Type DocumentStruct
  mapping(bytes32 => DocumentStruct) public documentStructs;
 // Set values in storage

 function StoreDocument( bytes32 sndKey, bytes32 url, bytes32 Key) public returns (bool success) {
//  documentStructs[pubKey].url  = url;
  
  documentStructs[sndKey].url = url;
    documentStructs[sndKey].Key = Key;
 return true;
 }
 
 function getUrl(bytes32 recKey) public constant returns (bytes32){
     return documentStructs[recKey].url;

 }
 
 
}