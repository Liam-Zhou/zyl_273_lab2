const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var studentSchema = new Schema({
    name:{type: String},
    password:{type: String, required: true},
    email:{type: String, required: true},
    collegeName:{type: String},
    birth:{type: String},
    city:{type: String},
    state:{type: String},
    country:{type: String},
    skills:{type: String},
    phone:{type: String},
    careerObject:{type: String},
    education:{type: Array},
    work_expe:{type: Array},


},
{
    collection:'student'
},
{
    versionKey: false
});

const studentModel = mongoose.model('student', studentSchema);
module.exports = studentModel;