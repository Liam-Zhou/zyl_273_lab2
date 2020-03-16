var express = require('express');
var router = express.Router();
var pool = require('../../config/db');
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

    let updateSql = 'update student SET name=?,birth=?,city=?,state=?,country=?,careerObject=? WHERE id=?'
    let args = [];
    args.push(data.name);args.push(data.dateOfBirth);
    args.push(data.city);args.push(data.state);
    args.push(data.country);args.push(data.carrerObj);args.push(data.id);

    pool.getConnection(function(err,conn){
        if(err){
            res.json('mysql error');
            return
        }else{
        conn.query(updateSql,args,function(qerr,result){
            if(qerr){
                console.log('[UPDATE ERROR] - ',qerr.message);
                conn.release();
                res.json('mysql update error ')
                return
            }else{
                conn.release();
                res.json('success');
            }
        });
    }})
})
router.post('/StudentSkillsInfo',function(req,res){
    let data = req.body;
    let updateSql = 'update student SET skills=? WHERE id=?'
    let args = [];
    args.push(data.skills);args.push(data.id);

    pool.getConnection(function(err,conn){
        if(err){
            res.json('mysql error');
            return
        }else{
        conn.query(updateSql,args,function(qerr,result){
            if(qerr){
                console.log('[UPDATE ERROR] - ',qerr.message);
                conn.release();
                res.json('mysql update error skill')
                return
            }else{
                conn.release();
                res.json('success');
            }
        });
    }})
})
router.post('/StudentcontactInfo',function(req,res){
    let data = req.body;
    let updateSql = 'update student SET phone=?, email=? WHERE id=?'
    let args = [];
    args.push(data.phone);args.push(data.email);args.push(data.id);

    pool.getConnection(function(err,conn){
        if(err){
            res.json('mysql error');
            return
        }else{
        conn.query(updateSql,args,function(qerr,result){
            if(qerr){
                console.log('[UPDATE ERROR] - ',qerr.message);
                conn.release();
                res.json('mysql update error')
                return
            }else{
                conn.release();
                res.json('success');
            }
        });
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
        }
        if (result) {
            console.log('result',result)
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
    let Ssql = 'select * from education where student_id = ' + Number(id);
    pool.getConnection(function(err,conn){
        if(err){
            res.json('mysql error');
            return
        }else{
        conn.query(Ssql,function(qerr,result){
            if(qerr){
                console.log('[SELECT ERROR] - ',qerr.message);
                conn.release();
                res.json('mysql select error s')
                return
            }else{
                let basicInfo = result;
                conn.release();
                res.json(basicInfo);
            }
})}})
})
router.post('/addStudentEdu',function(req,res){
    let data = req.body;
    let addSql = 'insert into education (student_id,collegeName,location,degree,major,passingYear,cGPA) values (?,?,?,?,?,?,?)'
    let args = [];
    args.push(data.id);args.push(data.collegeName);
    args.push(data.location);args.push(data.degree);
    args.push(data.major);args.push(data.passingyear);args.push(data.cgpa);

    pool.getConnection(function(err,conn){
        if(err){
            res.json('mysql error');
            return
        }else{
        conn.query(addSql,args,function(qerr,result){
            if(qerr){
                console.log('[ADD ERROR] - ',qerr.message);
                conn.release();
                res.json('mysql update error ')
                return
            }else{
                conn.release();
                res.json('success');
            }
        });
    }})
})
router.put('/updateStuEdu',function(req,res){
    let data = req.body;
    let updateSql = 'update education SET collegeName=?,location=?,degree=?,major=?,passingYear=?,cGPA=? WHERE id=?'
    let args = [];
    args.push(data.collegename);args.push(data.location);args.push(data.degree);
    args.push(data.major);args.push(data.passingyear);
    args.push(data.cgpa);args.push(data.eduid);

    pool.getConnection(function(err,conn){
        if(err){
            res.json('mysql error');
            return
        }else{
        conn.query(updateSql,args,function(qerr,result){
            if(qerr){
                console.log('[UPDATE ERROR] - ',qerr.message);
                conn.release();
                res.json('mysql update error ')
                return
            }else{
                conn.release();
                res.json('success');
            }
        });
    }})
})
router.delete('/deleteStuEdu',function(req,res){
    let dSql = 'delete from education where id=?;'
    let edu_id = req.query.id;
    edu_id = Number(edu_id)

    pool.getConnection(function(err,conn){
        if(err){
            res.json('mysql error');
            return
        }else{
            conn.query(dSql,edu_id,function(qerr,result){
                if(qerr){
                    console.log('[DELETE ERROR] - ',qerr.message);
                    conn.release();
                    res.json('mysql delete error ')
                    return
                }else{
                    conn.release();
                    res.json('success');
                }
            });
        }})
})

//about student profile work experience part
router.post('/addStuWork',function(req,res){
    let data = req.body;
    let addSql = 'insert into work_experience (student_id,companyName,title,location,startDate,endDate,description) values (?,?,?,?,?,?,?)'
    let args = [];
    args.push(data.id);args.push(data.companyName);
    args.push(data.title);args.push(data.location);
    args.push(data.startdate);args.push(data.enddate);args.push(data.des);

    pool.getConnection(function(err,conn){
        if(err){
            res.json('mysql error');
            return
        }else{
        conn.query(addSql,args,function(qerr,result){
            if(qerr){
                console.log('[ADD ERROR] - ',qerr.message);
                conn.release();
                res.json('mysql add error ')
                return
            }else{
                conn.release();
                res.json('success');
            }
        });
    }})
})
router.get('/getStuWorkInfo',function(req,res){
    let data = req.query;
    let id = data.id;
    let Ssql = 'select * from work_experience where student_id = ' + Number(id);
    pool.getConnection(function(err,conn){
        if(err){
            res.json('mysql error');
            return
        }else{
        conn.query(Ssql,function(qerr,result){
            if(qerr){
                console.log('[SELECT ERROR] - ',qerr.message);
                conn.release();
                res.json('mysql select error')
                return
            }else{
                let basicInfo = result;
                conn.release();
                res.json(basicInfo);
            }
})}})
})
router.put('/updateStuWork',function(req,res){
    let data = req.body;
    let updateSql = 'update work_experience SET companyName=?,location=?,title=?,startDate=?,endDate=?,description=? WHERE id=?'
    let args = [];
    args.push(data.companyname);args.push(data.location);args.push(data.title);
    args.push(data.startdate);args.push(data.enddate);
    args.push(data.des);args.push(data.workid);

    pool.getConnection(function(err,conn){
        if(err){
            res.json('mysql error');
            return
        }else{
        conn.query(updateSql,args,function(qerr,result){
            if(qerr){
                console.log('[UPDATE ERROR] - ',qerr.message);
                conn.release();
                res.json('mysql update error ')
                return
            }else{
                conn.release();
                res.json('success');
            }
        });
    }})
})
router.delete('/deleteStuWork',function(req,res){
    let dSql = 'delete from work_experience where id=?;'
    let work_id = req.query.id;
    work_id = Number(work_id)

    pool.getConnection(function(err,conn){
        if(err){
            res.json('mysql error');
            return
        }else{
            conn.query(dSql,work_id,function(qerr,result){
                if(qerr){
                    console.log('[DELETE ERROR] - ',qerr.message);
                    conn.release();
                    res.json('mysql delete error ')
                    return
                }else{
                    conn.release();
                    res.json('success');
                }
            });
        }})
})

//about company basic information
router.get('/getComBasicInfo',function(req,res){
    let data = req.query;
    let id = data.id;
    let Ssql = 'select * from company where id = ' + Number(id);
    pool.getConnection(function(err,conn){
        if(err){
            res.json('mysql error');
            return
        }else{
        conn.query(Ssql,function(qerr,result){
            if(qerr){
                console.log('[SELECT ERROR] - ',qerr.message);
                conn.release();
                res.json('mysql select error s')
                return
            }else{
                let basicInfo = result[0];
                conn.release();
                res.json(basicInfo);
            }
})}})
})

router.put('/updatecomcontact',function(req,res){
    let data = req.body;
    let updateSql = 'update company SET phone=?,email=? WHERE id=?'
    let args = [];
    args.push(data.phone);args.push(data.email);args.push(data.id);

    pool.getConnection(function(err,conn){
        if(err){
            res.json('mysql error');
            return
        }else{
        conn.query(updateSql,args,function(qerr,result){
            if(qerr){
                console.log('[UPDATE ERROR] - ',qerr.message);
                conn.release();
                res.json('mysql update error ')
                return
            }else{
                conn.release();
                res.json('success');
            }
        });
    }})
})




module.exports = router