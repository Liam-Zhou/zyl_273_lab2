var express = require('express');
var router = express.Router();
let fs = require('fs');
let multer=require('multer');
const mongoose = require('mongoose');
let jobModel = require('../../Models/JobModel')
let Student = require('../../Models/StudentModel')
let Company = require('../../Models/CompanyModel')

var createFolder = function(folder){
    try{
        fs.accessSync(folder); 
    }catch(e){
        fs.mkdirSync(folder);
    }  
};

var uploadFolder = '../front-end/src/img/Cuser/';

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


var FcreateFolder = function(folder){
    try{
        fs.accessSync(folder); 
    }catch(e){
        fs.mkdirSync(folder);
    }  
};

var FuploadFolder = '../front-end/src/files/';

FcreateFolder(FuploadFolder);

var Fstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, FuploadFolder);
    },
    filename: function (req, file, cb) {
        cb(null, req.body.stu_id+'-'+req.body.job_id);  
    }
});

var Fupload = multer({ storage: Fstorage })


//company profile basic data,picture
router.post('/updatecombasic',upload.single('avatar'),function(req,res){
    let data = req.body;

    let set = {
        $set : {
            'name':data.name,
            'location':data.location,
            'description':data.des
            }
    }
    Company.updateOne({_id:data.id},set,(error,result)=>{
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


router.post('/addJob',function(req,res){
    let data = req.body;

    let job = {
        company_id:data.id,
        jobTitle:data.title,
        postingDate:data.postingDate,
        deadline:data.deadline,
        location:data.location,
        salary:data.salay,
        description:data.description,
        category:data.category
    }
    jobModel.insertMany(job,(error,result)=>{
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

router.get('/getJobList',function(req,res){
    let data = req.query;
    let id = data.id;
    jobModel.find({ company_id: id}, (error, result) => {
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

router.get('/searchJob',function(req,res){
    let data = req.query;
    let name = data.name;
    let location = data.location;
    let category = data.category;
    let match = {
        $match:{}
    }
    if(name&&location&&category){
        name = new RegExp(name, 'i');
        match = {
            $match:{
                $or:[{'jobTitle':name},{'companyinfo.name':name}],
                'location':location,
                'category':category
            }
        }
    }
    if(name&&!location&&!category){
        name = new RegExp(name, 'i');
        match = {
            $match:{
                $or:[{'jobTitle':name},{'companyinfo.name':name}]
            }
        }
    }
    if(!name&&location&&!category){
        match = {
            $match:{
                'location':location
            }
        }
    }
    if(!name&&!location&&category){
        match = {
            $match:{
                'category':category
            }
        }
    }
    if(!name&&location&&category){
        match = {
            $match:{
                'location':location,
                'category':category
            }
        }
    }
    if(name&&location&&!category){
        name = new RegExp(name, 'i');
        match = {
            $match:{
                $or:[{'jobTitle':name},{'companyinfo.name':name}],
                'location':location
            }
        }
    }
    if(name&&!location&&category){
        name = new RegExp(name, 'i');
        match = {
            $match:{
                $or:[{'jobTitle':name},{'companyinfo.name':name}],
                'category':category
            }
        }
    }
    if(!name&&!location&&!category){
    }

    let lookup = {
        $lookup:
          {
            from: "company",
            localField: "company_id",
            foreignField: "_id",
            as: "companyinfo"
          }
     };
    jobModel.aggregate([lookup,match],(error, joblist)=>{
        if (error) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            })
            res.end("Error Occured");
        }
        if (joblist) {
            res.json(joblist);
        }
        else {
            res.end("no job list");
        }

    })

})
router.post('/applyJob',Fupload.single('file'),function(req,res){
    let data = req.body;
    let today = new Date()
    let year = today.getFullYear();
    let month = today.getMonth()+1;
    let day = today.getDate();
    today = year+'-'+month+'-'+day;

    jobModel.find({_id: data.job_id},{'stu_list':1}, (error, result) => {
        if (error) {
            console.log('error',error)
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            })
            res.end("Error Occured");
            return
        }
        if (result) {
            let flag = false
            if(result[0].stu_list.length !== 0){
                result[0].stu_list.map((stu)=>{
                    if(stu.student_id == data.stu_id){
                        flag = true;
                    }
                })
            }
            if(flag){
                res.end('you have already applied,file will be updated');
            }else{
                let stu = {
                    "student_id" : data.stu_id,
                    "status" : 'pending',
                    "applied_date" : today,
                }
                let set = {
                    $addToSet : {'stu_list':stu}
                }
                jobModel.updateOne({_id: data.job_id},set,(error2,result2) => {
                    if (error2) {
                        res.writeHead(500, {
                            'Content-Type': 'text/plain'
                        })
                        res.end("Error Occured");
                        return;
                    }
                    if (result2) {
                        res.json('success');
                    }
                    else {
                        res.end("no info");
                    }
                })
            }
        }
        else {
            res.end("no info");
        }
    });


})

router.get('/getStuList',function(req,res){
    let data = req.query;
    let id = data.id;

    jobModel.find({ _id: id},{'_id':0,'stu_list':1},(error, result) => {
        if (error) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            })
            res.end("Error Occured");
            return
        }
        if (result) {
            let stu_list = result[0].stu_list;
            let stu_ids = [];
            stu_list.map((stu)=>{
                stu_ids.push(stu.student_id)
            })
            let returnfield = {
                '_id':1,
                'name':1,
                'email':1
            }
            Student.find({'_id':{$all: stu_ids}},returnfield,(error, stulist)=>{
                if (error) {
                    console.log('error',error)
                    res.writeHead(500, {
                        'Content-Type': 'text/plain'
                    })
                    res.end("Error Occured");
                    return
                }
                if(stulist){
                    let returnlist = [];
                    let new_stu_list = {};
                    stu_list.map((stu)=>{
                        new_stu_list[stu.student_id] = {
                            'status':stu.status,
                            'applied_date':stu.applied_date
                        }
                    })

                    stulist.map((s)=>{
                        returnlist.push({
                            student_id:s._id,
                            name:s.name,
                            email:s.email,
                            status:new_stu_list[s._id].status,
                            applied_date:new_stu_list[s._id].applied_date
                        })
                    })
                    res.json(returnlist)
                }

            })

        }
        else {
            res.end("no info");
        }
    });
})

router.put('/changeStatus',function(req,res){
    let data = req.body;

    let stu = 'stu_list.'+data.index+'.status'
    let set = {
        $set : {[stu]:data.status}
    }
    jobModel.updateOne({'_id': data.job_id},set,(error,result) => {
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

router.get('/searchJobByStatus',function(req,res){
    let data = req.query;
    let stu_id = data.stu_id;
    let status = data.status;
    let match = {
        $match:{
            'stu_list.student_id':mongoose.Types.ObjectId(stu_id)
        }
    }

    if(status){
        match = {
            $match:{
                "stu_list.student_id":mongoose.Types.ObjectId(stu_id),
                "stu_list.status" : status
            }
        }
    }
    let lookup = {
        $lookup:
          {
            from: "company",
            localField: "company_id",
            foreignField: "_id",
            as: "companyinfo"
          }
     };
    jobModel.aggregate([match,lookup],(error, joblist)=>{
        if (error) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            })
            res.end("Error Occured");
        }
        if (joblist) {
            joblist.map((job)=>{
                job.name = job.companyinfo[0].name;
                for(let i = 0 ; i < job.stu_list.length;i++){
                    if(job.stu_list[i].student_id == stu_id){
                        job.status = job.stu_list[i].status;
                        job.applied_date = job.stu_list[i].applied_date;
                        continue;
                    }
                }
            })
            res.json(joblist);
        }
        else {
            res.end("no job list");
        }

    })
    
})






module.exports = router