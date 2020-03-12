var express = require('express');
var router = express.Router();
var qs = require('qs');
var pool = require('../../config/db');

router.get('/studentList',function(req,res){
    let data = req.query;
    let name = data.name;
    let skill = data.skill;
    let major = data.major;
    let Ssql = '';
    let args = [];
    if(!name&&!major&&!skill){
        Ssql = 'select * from student'
    }
    if(name&&!major&&!skill){
        Ssql = 'select * from student where (name = ? or collegeName = ?)'
        args.push(name);args.push(name);
    }
    if(!name&&major&&!skill){
        Ssql = 'select * from education inner join student on student.id = education.student_id where major = ?'
        args.push(major);
    }
    if(!name&&!major&&skill){
        skill = '%'+skill+'%';
        Ssql = 'select * from student where skills like ?'
        args.push(skill);
    }
    if(!name&&major&&skill){
        skill = '%'+skill+'%';
        Ssql = 'select * from education  inner join student on student.id = education.student_id where major = ? and skills like ?'
        args.push(major);args.push(skill);
    }
    if(name&&major&&!skill){
        Ssql = 'select * from education  inner join student on student.id = education.student_id where major = ? and (name = ? or collegeName = ?)'
        args.push(major);args.push(name);args.push(name);
    }
    if(name&&!major&&skill){
        skill = '%'+skill+'%';
        Ssql = 'select * from student where  skills like ? and (name = ? or collegeName = ?)'
        args.push(skill);args.push(name);args.push(name);
    }
    if(name&&major&&skill){
        skill = '%'+skill+'%';
        Ssql = 'select * from education inner join student where (name = ? or collegeName = ?) and major = ? and skills like ?'
        args.push(name);args.push(name);args.push(major);args.push(skill);
    }

    pool.getConnection(function(err,conn){
        if(err){
            res.json('mysql error');
            return
        }else{
        conn.query(Ssql,args,function(qerr,result){
            if(qerr){
                console.log('[SELECT ERROR] - ',qerr.message);
                conn.release();
                res.json('mysql select error s')
                return
            }else{
                let stuList = result;
                stuList = uniq(stuList);
                conn.release();
                res.json(stuList);
            }})
        }})

    })

function uniq(array){
        let temp = []; 
        let isuniq = 1;
        for(let i = 0; i < array.length; i++){
            for(let j = 0; j < temp.length; j++){
                if(temp[j].id == array[i].id){
                    isuniq = 0;
                }
            }
            if(isuniq == 1){
                temp.push(array[i]);
            }
            isuniq=1;
        }
        return temp;
    }
module.exports = router