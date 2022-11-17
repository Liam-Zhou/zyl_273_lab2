let Student = require('../Models/StudentModel')
let jobModel = require('../Models/JobModel')
const mongoose = require('mongoose');


function handle_request(msg, callback){
    console.log('"Inside job kafka backend"',msg);
    switch(msg.route){
        case 'searchJob': searchJob(msg.data,callback);break;
        case 'searchJobByStatus': searchJobByStatus(msg.data,callback);break;
        case 'applyJob': applyJob(msg.data,callback);break;
        case 'getJobList': getJobList(msg.data,callback);break;
        case 'changeStatus': changeStatus(msg.data,callback);break;
        case 'getStuList': getStuList(msg.data,callback);break;
        case 'addJob': addJob(msg.data,callback);break;
    }
};
let searchJob = (data,callback)=>{
    let currentPage = data.currentPage;
    let lookup = data.lookup;
    let match = data.match;
    let sort = data.sort;


    let name = match.name;
    let location = match.location;
    let category = match.category;
    
    match = {
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

    let skip = 0;
    if(currentPage){
         skip = (currentPage - 1) * 10;
    }
        //first time to load page and fetch all the count 
        jobModel.aggregate([lookup,match],(error,result)=>{
            if (error) {
                callback(null,"Error Occured");
            }
            if (result) {
                
                result = result.length;
                    jobModel.aggregate([lookup,match]).sort(sort).skip(skip).limit(10).exec((error1, result1) => {
                        if (error1) {
                            callback(null,"Error Occured");
                        }
                        if (result1) {
                            let returnData = {
                                jobList : result1,
                                count : result
                            }
                            callback(null,returnData);
                        }
                        else {
                            callback(null,"no info");
                        }
                    });
            }
            else {
                callback(null,"no info");
            }
        
    })
}
let searchJobByStatus = (data,callback)=>{
    let currentPage = data.currentPage;
    let lookup = data.lookup;
    let match = data.match;

    let status = match.status;
    let stu_id = match.stu_id;
    
    match = {
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

    jobModel.aggregate([match,lookup],(error, joblist)=>{
        if (error) {
            callback(null,"Error Occured");
        }
        if (joblist) {
            let count = joblist.length;
            let skip = 0;
            if(currentPage){
                 skip = (currentPage - 1) * 10;
            }
            jobModel.aggregate([match,lookup]).skip(skip).limit(10).exec((error1, result)=>{
                if (error1) {
                    callback(null,"Error Occured");
                }
                if(result){
                    result.map((job)=>{
                        job.name = job.companyinfo[0].name;
                        for(let i = 0 ; i < job.stu_list.length;i++){
                            if(job.stu_list[i].student_id == stu_id){
                                job.status = job.stu_list[i].status;
                                job.applied_date = job.stu_list[i].applied_date;
                                continue;
                            }
                        }
                    })
                    let returnData = {
                        count : count,
                        jobList : result
                    }
                    callback(null,returnData);
                }

            })
        }
        else {
            callback(null,"no job list");
        }

    })
}
let applyJob = (data,callback)=>{
    let today = new Date()
    let year = today.getFullYear();
    let month = today.getMonth()+1;
    let day = today.getDate();
    today = year+'-'+month+'-'+day;

    jobModel.find({_id: data.job_id},{'stu_list':1}, (error, result) => {
        if (error) {
            callback(null,"Error Occured");
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
                callback(null,'you have already applied,file will be updated'); 
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
                        callback(null,"Error Occured");
                    }
                    if (result2) {
                        callback(null,'success'); 
                    }
                    else {
                        callback(null,"no info");
                    }
                })
            }
        }
        else {
            callback(null,"no info");
        }
    });
}
let getJobList = (data,callback)=>{
    let id = data.id
    let skip = data.skip
    //first time to load page and fetch all the count 
    jobModel.countDocuments({company_id: id},(error,result)=>{
        if (error) {
            callback(null,"Error Occured");
        }
        if (result) {
                jobModel.find({ company_id: id}).skip(skip).limit(10).exec((error1, result1) => {
                    if (error1) {
                        callback(null,"Error Occured");
                    }
                    if (result1) {
                        let returnData = {
                            jobList : result1,
                            count : result
                        }
                        callback(null,returnData);
                    }
                    else {
                        callback(null,"no info");
                    }
                });
        }
        else {
            callback(null,"no info");
        }

    })
}
let changeStatus = (data,callback)=>{
    let stu = 'stu_list.'+data.index+'.status'
    let set = {
        $set : {[stu]:data.status}
    }
    jobModel.updateOne({'_id': data.job_id},set,(error,result) => {
        if (error) {
            callback(null,"Error Occured");
        }
        if (result) {
            callback(null,'success');
        }
        else {
            callback(null,'no info');
        }
    })

}
let getStuList = (data,callback)=>{
    let id = data.id

    jobModel.find({ _id: id},{'_id':0,'stu_list':1},(error, result) => {
        if (error) {
            callback(null,"Error Occured");
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
                    callback(null,"Error Occured");
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
                    callback(null,returnlist);
                }

            })

        }
        else {
            callback(null,"no info");
        }
    });
}
let addJob = (data,callback)=>{
    let job = data
    jobModel.insertMany(job,(error,result)=>{
        if (error) {
            callback(null,"Error Occured");
        }
        if (result) {
            callback(null,"success");
        }
        else {
            callback(null,"no info");
        }
    })
}
exports.handle_request = handle_request;