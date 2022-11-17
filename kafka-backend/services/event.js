let Student = require('../Models/StudentModel')
let eventModel = require('../Models/EventModel')


function handle_request(msg, callback){
    console.log('"Inside event kafka backend"',msg);
    switch(msg.route){
        case 'addEvent': addEvent(msg.data,callback);break;
        case 'getEventList': getEventList(msg.data,callback);break;
        case 'searchEvent': searchEvent(msg.data,callback);break;
        case 'getMajor': getMajor(msg.data,callback);break;
        case 'applyEvent': applyEvent(msg.data,callback);break;
        case 'getStuList': getStuList(msg.data,callback);break;
        case 'getEventofStu': getEventofStu(msg.data,callback);break;
        
        
    }
};

let addEvent = (data,callback)=>{
    eventModel.insertMany(data,(error,result)=>{
        if (error) {
            callback(null,"Error Occured"); 
        }
        if (result) {
            callback(null,"success");
        }
        else {
            callback(null,"no event list");
        }
    })
}
let getEventList = (data,callback)=>{
    let id = data.id;
    let skip = data.skip;
    eventModel.countDocuments({'company_id':id},(error,result)=>{
        if (error) {
            callback(null,"Error Occured"); 
        }
        if (result) {
            eventModel.find({'company_id':id}).skip(skip).limit(10).exec((error1,result1)=>{
                if (error1) {
                    callback(null,"Error Occured"); 
                }
                if (result1) {
                    let returnData = {
                        count : result,
                        eventList : result1
                    }
                    callback(null,returnData);
                }
                else {
                    callback(null,"no event list");
                }
            })
        }
        else {
            callback(null,"no event list");
        }
    })
}
let searchEvent = (data,callback)=>{
    let name = data.name;
    let currentPage = data.currentPage;
    let match = {
        $match:{}
    }
    if(name){
        name = new RegExp(name, 'i');
        match = {
            $match:{
                eventName:name
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

    let skip = 0;
    if(currentPage){
         skip = (currentPage - 1) * 10;
    }

    eventModel.aggregate([match,lookup],(error,result)=>{
        
        if (error) {
            callback(null,"Error Occured"); 
        }
        if (result) {
            let count = result.length;
            console.log("match,lookup,skip  ",match,lookup,skip)
            eventModel.aggregate([match,lookup]).sort({"time":1}).skip(skip).limit(10).exec((err,result1)=>{
                if (error) {
                    callback(null,"Error Occured"); 
                }
                if (result1) {
                    let backData = {
                        eventList:result1,
                        count:count
                    }
                    callback(null,backData);
                }else{
                    callback(null,"no event list");
                }
            })
            
        }
        else {
            callback(null,"no event list");
        }
    })
}
let getMajor = (data,callback)=>{
    let id = data.id;
    let returnfield = data.returnfield
    Student.find({'_id':id},returnfield,(error,result)=>{
        if (error) {
            callback(null,"Error Occured"); 
        }
        if (result) {
            callback(null,result);
        }
        else {
            callback(null,"no education list");
        }
    })
}
let applyEvent = (data,callback)=>{
    let find={
        '_id':data.event_id,
        'stu_list.stu_id':data.stu_id
    }
    eventModel.find(find,(error,result)=>{
        if (error) {
            callback(null,"Error Occured"); 
        }
        if (result) {
            console.log('result',result)
            if(result.length==0){
                let set ={
                    $addToSet : {
                        'stu_list':{
                            'stu_id':data.stu_id
                    }}
                }
                eventModel.updateOne({'_id':data.event_id},set,(error1,result1)=>{
                    if (error1) {
                        callback(null,"Error Occured"); 
                    }
                    if (result1) {
                        callback(null,"success");
                    }
                })
            }else{
                callback(null,"you have already applied");
            }
        }
        else {
            callback(null,"no job list");
        }

    })
}
let getStuList = (data,callback)=>{
    let id = data
    eventModel.findOne({'_id':id},{'stu_list':1,'_id':0},(error,result)=>{
        if (error) {
            callback(null,"Error Occured"); 
        }
        if (result) {
            let stu_list = result.stu_list
            let ids = [];
            stu_list.map((stu)=>{
                ids.push(stu.stu_id)
            })
            let returnfield = {
                '_id':1,
                'name':1,
                'email':1
            }
            Student.find({'_id':{$all: ids}},returnfield,(error1,result1)=>{
                if (error1) {
                    callback(null,"Error Occured"); 
                }
                if(result1){
                    callback(null,result1);
                }else{
                    callback(null,"no student");
                }
            })
        }
        else {
            callback(null,"no student");
        }
    })
}
let getEventofStu = (data,callback)=>{
    let find = {
        'stu_list.stu_id' : data
    }
    eventModel.find(find,(error,result)=>{
        if (error) {
            callback(null,"Error Occured");
        }
        if (result) {
            callback(null,result);
        }
        else {
            callback(null,"no job list");
        }
    })
}
exports.handle_request = handle_request;