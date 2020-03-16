const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var eventSchema = new Schema({

    "company_id" : {type: mongoose.ObjectId, required: true},
    "eventName" : {type: String},
    "time" : {type: Number},
    "description" : {type: String},
    "location" : {type: String},
    "eligibility" : {type: String},
    "stu_list" : {type: Array}

},
{
    collection:'event'
},
{
    versionKey: false
});

const eventModel = mongoose.model('event', eventSchema);
module.exports = eventModel;