var express = require('express');
var router = express.Router();
let qs = require('qs');
let fs = require('fs');
var pool = require('../../config/db');
let md5 = require('md5-node')


router.post('/',function(req,res){
    let data = req.body;
    let name = data.name;
    let email = data.emailId;
    let password = md5(data.password);
    let role = data.role;
    let location = data.location;
    let collegeName = data.collegeName;

    let sql = 'select * from '+role+' where email = ?'
    pool.getConnection(function(err,conn){
        if(err){
            res.json('mysql error');
            return
        }else{
         conn.query(sql,email,function(qerr,result){
            if(qerr){
                console.log('[SELECT ERROR] - ',qerr.message);
                conn.release();
                res.json('mysql select error')
                return
            }
            if(result.length != 0){
                res.json('email exist')
                return
            }else{//ready to insert
                let arg = [];
                let addSql = '';
                if(role == 'student'){
                    arg.push(name);arg.push(password);arg.push(email);arg.push(collegeName);
                    addSql = 'INSERT INTO student(name,password,email,collegeName) VALUES(?,?,?,?)';
                }else{
                    arg.push(name);arg.push(password);arg.push(email);arg.push(location);
                    addSql = 'INSERT INTO company(name,password,email,location) VALUES(?,?,?,?)';
                }
                conn.query(addSql,arg,function(qerr1,result1){
                    if(qerr1){
                        console.log('qerr1',qerr1)
                        res.json('mysql insert error')
                    }else{
                        copy(result1.insertId,role);
                        res.json('success')
                    }
                })
            }
        })
        }
})})

function copy(id,role){
    let dst = '';
    if(role == 'student'){
        dst = '../front-end/src/img/user/'+id
    }
    if(role == 'company'){
        dst = '../front-end/src/img/Cuser/'+id
    }
    
    let src = '../front-end/src/img/default.jpeg';

    fs.writeFileSync(dst, fs.readFileSync(src));
}
module.exports = router