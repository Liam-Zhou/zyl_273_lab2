var express = require('express');
var router = express.Router();
let md5 = require('md5-node');
let Student = require('../../Models/StudentModel')
let Company = require('../../Models/CompanyModel')
// console.log('admin test2 zyl yilinzhou',md5('admin'),md5('test2'),md5('zyl'))
    // console.log('as google',md5('as'),md5('google'))

router.post('/',function(req,res){
    let data = req.body;
    //let email = data.email;
    //let password = md5(data.password);
    //let password = data.password;
    let role = data.role;
    let model;
    if(role =='student'){
        model = Student
    }else{
        model = Company
    }
        model.findOne({ email: data.email, password: data.password },{_id:1,name:1,email:1}, (error, user) => {
            if (error) {
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                })
                res.end("Error Occured");
            }
            if (user) {
                res.cookie('cookie', user.username, { maxAge: 900000, httpOnly: false, path: '/' });
                let s = {
                    role:role,
                    id:user._id,
                    name:user.name,
                    email:user.email
                }
                req.session.user = s;
                res.json(s);
            }
            else {
                res.end("Invalid Credentials");
            }
        }); 
})
router.get('/',function(req,res){
    console.log(req.query)
})

module.exports = router