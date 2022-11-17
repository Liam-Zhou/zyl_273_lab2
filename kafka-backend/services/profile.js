let Student = require('../Models/StudentModel')
let Company = require('../Models/CompanyModel')
let jobModel = require('../Models/JobModel')
const mongoose = require('mongoose');


function handle_request(msg, callback){
    console.log('"Inside job kafka backend"',msg);
    switch(msg.route){
        case 'updatecombasic': updatecombasic(msg.data,callback);break;
        case 'updatecomcontact': updatecomcontact(msg.data,callback);break;
        case 'getComBasicInfo': getComBasicInfo(msg.data,callback);break;
        case 'getStuInfo': getStuInfo(msg.data,callback);break;
        case 'StudentUpdateOne': StudentUpdateOne(msg.data,callback);break;
    
    }
}
let updatecombasic = (data,callback)=>{
    let id = data.id;
    let set = data.set;
    Company.updateOne({_id:id},set,(error,result)=>{
        if (error) {
            callback(null,"Error Occured");
        }
        if (result) {
            callback(null,"success");
        }
        else {
            callback(null,"no info");
        }
    })
    
}
let updatecomcontact = (data,callback)=>{
    let id = data.id;
    let set = data.set;
    Company.updateOne({ _id: id},set,(error, result) => {
        if (error) {
            callback(null,"Error Occured");
        }
        if (result) {
            callback(null,"success");
        }
        else {
            callback(null,"no info");
        }
    }); 
}
let getComBasicInfo = (data,callback)=>{
    Company.findOne({ _id: data}, (error, result) => {
        if (error) {
            callback(null,"Error Occured");
        }
        if (result) {
            callback(null,result);
        }
        else {
            callback(null,"no info");
        }
    }); 
}

let getStuInfo = (data,callback)=>{
    let returnField = data.returnField;
    let id = data.id
    Student.findOne({ _id: id},returnField, (error, result) => {
        if (error) {
            callback(null,"Error Occured");
        }
        if (result) {
            callback(null,result);
        }
        else {
            callback(null,"no info");
        }
    }); 
} 

let StudentUpdateOne = (data,callback)=>{
    let id = data.id;
    let set = data.set;
    Student.updateOne({_id:id},set,(error,result) => {
        if (error) {
            callback(null,"Error Occured");
        }
        if (result) {
            callback(null,"success");
        }
        else {
            callback(null,"no info");
        }
    })
    
} 

exports.handle_request = handle_request;