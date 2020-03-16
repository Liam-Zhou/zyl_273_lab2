const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var companySchema = new Schema({
    "name":{type: String},
    "password":{type: String, required: true},
    "email":{type: String, required: true},
    "location" : {type: String},
    "description" : {type: String},
    "phone" : {type: String},
},
{
    collection:'company'
},
{
    versionKey: false
});

const companyModel = mongoose.model('company', companySchema);
module.exports = companyModel;