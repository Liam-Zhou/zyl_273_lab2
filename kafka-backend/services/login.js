let Student = require('../Models/StudentModel')
let Company = require('../Models/CompanyModel')
let messageModel = require('../Models/MessageModel')


//login signup student and message use the same topic because they are way too less than other topics
function handle_request(msg, callback){
    console.log('"Inside login kafka backend"',msg);
    switch(msg.route){
        case 'postLogin': postLogin(msg.data,callback);break;
        case 'postSignup': postSignup(msg.data,callback);break;
        case 'passportVal': passportVal(msg.data,callback);break;
        
        case 'studentList': studentList(msg.data,callback);break;

        case 'messageByUserId': messageByUserId(msg.data,callback);break;
        case 'sendContent': sendContent(msg.data,callback);break;
        case 'startMess': startMess(msg.data,callback);break;
        
        
        
    }
};

let postLogin = async (data,callback)=>{
    let role = data.role
    let model;
    if(role =='student'){
        model = Student
    }else{
        model = Company
    }
    let result = await model.findOne({ email: data.email, password: data.password },{_id:1,name:1,email:1})
    console.log('postLogin mongo result',result)
    callback(null,result);
    console.log("after callback");
}

let postSignup = async (data,callback) => {
    let role = data.role
    let model;
    if(role =='student'){
        model = Student
    }else{
        model = Company
    }
    model.find({email:data.email},(error,result)=>{
        if (error) {
            callback(null,"Error Occured");
        }
        console.log('postSignup mongo result',result)
        if (result.length == 0 ) {
            model.insertMany(data,(error1,result1)=>{
                if (error1) {
                    callback(null,"Error Occured");
                }
                if (result1) {
                    console.log('mongo result1',result1)
                    //copy(result1[0]._id,role);
                    callback(null,result1);
                }
                else {
                    callback(null,"no job list");
                }
            })
        }
        else {
            callback(null,"email exist");
            return
        }
    })
}

let passportVal = (data,callback) => {
    let role = data.role
    let model;
    if(role =='student'){
        model = Student
    }else{
        model = Company
    }

    model.findById(data.user_id, (err, results) => {
        if (err) {
            return callback(null, err);
        }
        if (results) {
            console.log('passportVal get user successfully')
            callback(null, results);
        }
        else {
            callback(null, false);
        }
    });
}

let studentList = (data,callback) => {
    let name = data.name;
    let skill = data.skill;
    let major = data.major;
    let currentPage = data.currentPage;
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
    let skip = 0;
    if(currentPage){
         skip = (currentPage - 1) * 10;
    }

    Student.countDocuments(query,(error,result)=>{
        if (error) {
            callback(null,"Error Occured");
        }
        if(result){

            Student.find(query,{name:1,skills:1,education:1}).skip(skip).limit(10).exec((error1,result1)=>{
                if (error1) {
                    callback(null,"Error Occured");
                }
                if (result1) {
                    let returnData = {
                        stuList:result1,
                        count:result
                    }
                    callback(null,returnData);
                }
                else {
                    callback(null,"no info");
                }
            })
        }
        else {
            callback(null,"no info");
        }
    })
     
}

let messageByUserId =  (data,callback) => {
    let query = {
        '$or' : [
            {user_id1:data},
            {user_id2:data}
        ]
    }
    messageModel.find(query).sort({'messageList.time':1}).exec(async (err,results)=>{
        if (err) {
            return callback(null, err);
        }
        if (results) {
            if(results.length == 0){
                callback(null,[]);
            }
            let messList = []
            for(let i = 0;i < results.length;i++){
                let res = results[i]
                let mess = {

                }
                let friendId;
                let friendName;
                let time = res.messageList[0].time;
                let month = new Date(time).getMonth()+1;
                month = changeMonth(month);
                let day = new Date(time).getDate();
                time = month + ' ' + day

                if(res.user_id1 == data){
                    friendId = res.user_id2
                }else{
                    friendId = res.user_id1
                }
                let studentRes = await Student.findById(friendId,{name:1,_id:0});
                //console.log('studentResstudentResstudentResstudentResstudentRes',studentRes)
                if(studentRes){
                    friendName = studentRes.name;
                    mess = {
                       _id:res._id,
                       friendName:friendName,
                       friendId:friendId,
                       messageList:res.messageList,
                       time:time
                   }
                   messList.push(mess);
                   if(i==results.length-1){
                        callback(null,messList)
                   }
                   
                }else{
                    let comRes = await Company.findById(friendId,{name:1,_id:0});
                    friendName = comRes.name;
                    mess = {
                       _id:res._id,
                       friendName:friendName,
                       friendId:friendId,
                       messageList:res.messageList,
                       time:time
                   }
                   messList.push(mess);
                   if(i==results.length-1){
                    callback(null,messList)
                    }
                }
            }  
        }
        else {
            callback(null, false);
        }
    })
}
 
let sendContent = (data,callback) => {
    let userId = data.userId;
    let id = data.id;
    let messContent = data.messContent;

    let set = {
        '$addToSet': {'messageList':{
            user_id:userId,
            content:messContent,
            time:new Date().getTime()
        }}
    }
    messageModel.updateOne({'_id':id},set,(err,result)=>{
        if (err) {
            return callback(null, err);
        }
        if(result){
            
            messageModel.findById(id,{messageList:1},(err1,result1)=>{
                if (err1) {
                    return callback(null, err1);
                }
                if(result1){
                    return callback(null, result1);
                }
            })
        }
    })

} 

let startMess = (data,callback) => {
    let userId = data.userId;
    let this_stu_id = data.this_stu_id;
    let mess = data.mess;
    let insertData = {
        user_id1:userId,
        user_id2:this_stu_id,
        messageList:[{
            user_id:userId,
            content:mess,
            time:new Date().getTime()
        }]
    }
    messageModel.insertMany(insertData,(error,result)=>{
        if (error) {
            return callback(null, error);
        }
        if(result){
            callback(null,'success')
        }
    })

}




let changeMonth = (mon)=>{
    switch(mon){
        case 1 : return 'Jan';
        case 2 : return 'Feb';
        case 3 : return 'Mar';
        case 4 : return 'Apr';
        case 5 : return 'May';
        case 6 : return 'June';
        case 7 : return 'July';
        case 8 : return 'Auguste';
        case 9 : return 'Sept';
        case 10 : return 'Oct';
        case 11 : return 'Nov';
        case 12 : return 'Dec';
    }
}

 


exports.handle_request = handle_request;