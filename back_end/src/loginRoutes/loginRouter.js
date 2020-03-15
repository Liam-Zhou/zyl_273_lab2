var express = require('express');
var router = express.Router();
var qs = require('qs');
var pool = require('../../config/db');
let md5 = require('md5-node');
let Student = require('../../Models/StudentModel')
// console.log('admin test2 zyl yilinzhou',md5('admin'),md5('test2'),md5('zyl'))
    // console.log('as google',md5('as'),md5('google'))

router.post('/',function(req,res){
    let data = req.body;
    //let email = data.email;
    //let password = md5(data.password);
    //let password = data.password;
    let role = data.role;
    if(role =='student'){
        Student.findOne({ email: data.email, password: data.password }, (error, user) => {
            if (error) {
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                })
                res.end("Error Occured");
            }
            if (user) {
                res.cookie('cookie', user.username, { maxAge: 900000, httpOnly: false, path: '/' });
                let s = {
                    role:'student',
                    id:user._id,
                    name:user.name,
                    email:user.email
                }
                req.session.user = s;
                res.json(s);
            }
            else {
                res.writeHead(401, {
                    'Content-Type': 'text/plain'
                })
                res.end("Invalid Credentials");
            }
        });    
    }else{
        
    }

    // let arg = [];arg.push(email);arg.push(password);
    // let sql = 'select * from '+role+' where email = ? and password = ?'
    // pool.getConnection(function(err,conn){
    //     if(err){
    //         res.json('mysql error');
    //         return
    //     }else{
    //      conn.query(sql,arg,function(qerr,result){
    //         if(qerr){
    //             console.log('[SELECT ERROR] - ',qerr.message);
    //             conn.release();
    //             res.json('mysql error')
    //             return
    //         }
    //         if(result.length == 0){
    //             conn.release();
    //             res.json('noinfo')
    //         }else{
    //             conn.release();
    //             let data = result[0];
    //             res.cookie('cookie',"user",{maxAge: 9000000, httpOnly: false, path : '/'});
    //             let user = {
    //                 role: role,
    //                 id: data.id,
    //                 name: data.name,
    //                 email: data.email
    //             }
    //             req.session.user = user;
    //             res.json(user);
    //         }
            
    //      });
    //     }
    //    });

    
})
router.get('/',function(req,res){
    console.log(req.query)
})

module.exports = router