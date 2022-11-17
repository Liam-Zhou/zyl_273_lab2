const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var jobSchema = new Schema({

    "company_id" : {type: mongoose.ObjectId, required: true},
    "jobTitle" : {type: String},
    "postingDate" : {type: String},
    "deadline" : {type: String},
    "location" : {type: String},
    "salary" : {type: Number},
    "description" : {type: String},
    "category" : {type: String},
    "stu_list" : {type: Array}
},
{
    collection:'job'
},
{
    versionKey: false
});

const jobModel = mongoose.model('job', jobSchema);
module.exports = jobModel;