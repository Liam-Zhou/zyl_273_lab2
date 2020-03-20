var express = require('express');
var router = express.Router();
let fs = require('fs');
let multer=require('multer');
let Student = require('../../Models/StudentModel')
let Company = require('../../Models/CompanyModel')


var createFolder = function(folder){
    try{
        fs.accessSync(folder); 
    }catch(e){
        fs.mkdirSync(folder);
    }  
};

var uploadFolder = '../front-end/src/img/user/';

createFolder(uploadFolder);

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);
    },
    filename: function (req, file, cb) {
        cb(null, req.body.id);  
    }
});

var upload = multer({ storage: storage })

//about student profile basic part    
router.post('/StudentbasicInfo',upload.single('avatar'),function(req,res){
    let data = req.body;
    let set = {
        $set : {
            'name':data.name,
            'birth':data.dateOfBirth,
            'city':data.city,
            'state':data.state,
            'country':data.country,
            'careerObject':data.carrerObj
            }
    }
    Student.updateOne({_id:data.id},set,(error,result) => {
        if (error) {
            console.log('error',error)
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            })
            res.end("Error Occured");
            return
        }
        if (result) {
            console.log('result basic info',result)
            res.json('success');
        }
        else {
            res.end("no info");
        }
    })
    

})
router.post('/StudentSkillsInfo',function(req,res){
    let data = req.body;
    let set = {
        $set : {'skills':data.skills}
    }
    Student.updateOne({_id:data.id},set,(error,result) => {
        if (error) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            })
            res.end("Error Occured");
            return
        }
        if (result) {
            res.json('success');
        }
        else {
            res.end("no info");
        }
    })
})
router.post('/StudentcontactInfo',function(req,res){
    let data = req.body;
    let set = {
        $set : {'phone':data.phone,'email':data.email}
    }
    Student.updateOne({_id:data.id},set,(error,result) => {
        if (error) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            })
            res.end("Error Occured");
            return
        }
        if (result) {
            res.json('success');
        }
        else {
            res.end("no info");
        }
    })
})
router.get('/getStuBasicInfo',function(req,res){
    let data = req.query;
    let id = data.id;
    let returnField = {
        name:1,
        email:1,
        collegeName:1,
        birth:1,
        city:1,
        state:1,
        country:1,
        skills:1,
        phone:1,
        careerObject:1,
    }
    Student.findOne({ _id: id},returnField, (error, result) => {
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
    }); 
})

// about student profile education part
router.get('/getStuEduInfo',function(req,res){
    let data = req.query;
    let id = data.id;
    let returnField = {
        education:1,
    }
    Student.findOne({ _id: id},returnField, (error, result) => {
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
    }); 
})
router.post('/addStudentEdu',function(req,res){
    let data = req.body;
    let edu = {
        "collegeName" : data.collegeName,
        "location" : data.location,
        "degree" : data.degree,
        "major" : data.major,
        "passingYear" : data.passingyear,
        "cGPA" : data.cgpa
    }
    let set = {
        $addToSet : {'education':edu}
    }
    Student.updateOne({_id:data.id},set,(error,result) => {
        if (error) {
            console.log('error',error)
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            })
            res.end("Error Occured");
            return;
        }
        if (result) {
            res.json('success');
        }
        else {
            res.end("no info");
        }
    })

    
})
router.put('/updateStuEdu',function(req,res){
    let data = req.body;

    let edu = {
        "collegeName" : data.collegename,
        "location" : data.location,
        "degree" : data.degree,
        "major" : data.major,
        "passingYear" : data.passingyear,
        "cGPA" : data.cgpa
    }
    let edu_index = 'education.'+data.index
    let set = {
        $set : {[edu_index]:edu}
    }
    Student.updateOne({_id:data.id},set,(error,result) => {
        if (error) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            })
            res.end("Error Occured");
            return
        }
        if (result) {
            res.json('success');
        }
        else {
            res.end("no info");
        }
    })
   
})
router.post('/deleteStuEdu',function(req,res){
    let data = req.body;
    let set = {
        $pull : {'education':data.edu}
    }
    Student.updateOne({_id:data.id},set,(error,result) => {
        if (error) {
            console.log('error',error)
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            })
            res.end("Error Occured");
            return
        }
        if (result) {
            res.json('success');
        }
        else {
            res.end("no info");
        }
    })
    
})

//about student profile work experience part
router.post('/addStuWork',function(req,res){
    let data = req.body;
    let work_expe = {
        "companyName" : data.companyName,
        "title" : data.title,
        "location" : data.location,
        "startDate" : data.startdate,
        "endDate" : data.enddate,
        "description" : data.des
    }
    let set = {
        $addToSet : {'work_expe':work_expe}
    }
    Student.updateOne({_id:data.id},set,(error,result) => {
        if (error) {
            console.log('error',error)
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            })
            res.end("Error Occured");
            return;
        }
        if (result) {
            res.json('success');
        }
        else {
            res.end("no info");
        }
    })

})
router.get('/getStuWorkInfo',function(req,res){
    let data = req.query;
    let id = data.id;
    let returnField = {
        work_expe:1,
    }
    Student.findOne({ _id: id},returnField, (error, result) => {
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
    }); 
})
router.put('/updateStuWork',function(req,res){
    let data = req.body;

    let work = {
        "companyName" : data.companyname,
        "title" : data.title,
        "location" : data.location,
        "startDate" : data.startdate,
        "endDate" : data.enddate,
        "description" : data.des
    }
    let work_index = 'work_expe.'+data.index
    let set = {
        $set : {[work_index]:work}
    }
    Student.updateOne({_id:data.id},set,(error,result) => {
        if (error) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            })
            res.end("Error Occured");
            return
        }
        if (result) {
            res.json('success');
        }
        else {
            res.end("no info");
        }
    })
   
})
router.post('/deleteStuWork',function(req,res){
    let data = req.body;
    let set = {
        $pull : {'work_expe':data.work_expe}
    }
    Student.updateOne({_id:data.id},set,(error,result) => {
        if (error) {
            console.log('error',error)
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            })
            res.end("Error Occured");
            return
        }
        if (result) {
            res.json('success');
        }
        else {
            res.end("no info");
        }
    })
    
})

//about company basic information
router.get('/getComBasicInfo',function(req,res){
    let data = req.query;
    let id = data.id;
    
    Company.findOne({ _id: id}, (error, result) => {
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
    }); 
    
})

router.put('/updatecomcontact',function(req,res){
    let data = req.body;

    let set = {
        $set : {
            'phone':data.phone,
            'email':data.email
            }
        }
    Company.updateOne({ _id: data.id},set,(error, result) => {
        if (error) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            })
            res.end("Error Occured");
            return
        }
        if (result) {
            res.json('success');
        }
        else {
            res.end("no info");
        }
    }); 
})




module.exports = router