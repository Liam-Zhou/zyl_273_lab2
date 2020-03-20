var express = require('express');
var router = express.Router();
var pool = require('../../config/db');
let Student = require('../../Models/StudentModel')

router.get('/studentList',function(req,res){
    let data = req.query;
    let name = data.name;
    let skill = data.skill;
    let major = data.major;
    let query = {
        
    }


    if(!name&&!major&&!skill){
    }
    if(name&&!major&&!skill){
        query = {
            $or:[{'name':name},{'education.collegeName':name}]
        }
    }
    if(!name&&major&&!skill){
        query = {
            'education.major':major
        }
    }
    if(!name&&!major&&skill){
        skill = new RegExp(skill, 'i');
        query = {
            skills:skill
        }
    }
    if(!name&&major&&skill){
        skill = new RegExp(skill, 'i');
        query = {
            skills:skill,
            'education.major':major
        }
    }
    if(name&&major&&!skill){
        query = {
            'education.major':major,
            $or:[{'name':name},{'education.collegeName':name}]
        }
    }
    if(name&&!major&&skill){
        skill = new RegExp(skill, 'i');
        query = {
            skills:skill,
            $or:[{'name':name},{'education.collegeName':name}]
        }
    }
    if(name&&major&&skill){
        skill = new RegExp(skill, 'i');
        query = {
            skills:skill,
            'education.major':major,
            $or:[{'name':name},{'education.collegeName':name}]
        }
    }
    Student.find(query,(error,result)=>{
        if (error) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            })
            res.end("Error Occured");
            return
        }
        if (result) {
            res.json(result);
        }
        else {
            res.end("no info");
        }
    })

    })

// function uniq(array){
//         let temp = []; 
//         let isuniq = 1;
//         for(let i = 0; i < array.length; i++){
//             for(let j = 0; j < temp.length; j++){
//                 if(temp[j].id == array[i].id){
//                     isuniq = 0;
//                 }
//             }
//             if(isuniq == 1){
//                 temp.push(array[i]);
//             }
//             isuniq=1;
//         }
//         return temp;
//     }
module.exports = router