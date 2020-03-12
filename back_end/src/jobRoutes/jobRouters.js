var express = require('express');
var router = express.Router();
let qs = require('qs');
let fs = require('fs');
var pool = require('../../config/db');
let multer=require('multer');


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



router.post('/updatecombasic',upload.single('avatar'),function(req,res){
    let data = req.body;
    let updateSql = 'update company SET name=?,location=?,description=? WHERE id=?'
    let args = [];
    args.push(data.name);args.push(data.location);
    args.push(data.des);args.push(data.id);

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

router.post('/addJob',function(req,res){
    let data = req.body;
    let addSql = 'insert into job (company_id,jobTitle,postingDate,deadline,location,salary,description,category) values (?,?,?,?,?,?,?,?)'
    let args = [];
    args.push(data.id);args.push(data.title);
    args.push(data.postingDate);args.push(data.deadline);
    args.push(data.location);args.push(data.salay);
    args.push(data.description);args.push(data.category);

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
                }
            })

})

router.get('/getJobList',function(req,res){
    let data = req.query;
    let id = data.id;
    let Ssql = 'select * from job where company_id = ' + Number(id);
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
                let jobInfo = result;
                conn.release();
                res.json(jobInfo);
            }})
        }})
})

router.get('/searchJob',function(req,res){
    let data = req.query;
    let name = data.name;
    let location = data.location;
    let category = data.category;
    let Ssql = ''
    let args = []
    if(name&&location&&category){
        name = '%'+name+'%';
        Ssql = 'select * from company  inner join job on job.company_id=company.id where (jobTitle like ? or name like ?) and location = ? and category = ? ';
        args.push(name);args.push(name);args.push(location);args.push(category);
    }
    if(name&&!location&&!category){
        name = '%'+name+'%';
        Ssql = 'select * from company inner join job on job.company_id=company.id where (jobTitle like ? or name like?) ';
        args.push(name);args.push(name);
    }
    if(!name&&location&&!category){
        Ssql = 'select * from company inner join job on job.company_id=company.id where location = ? ';
        args.push(location);
    }
    if(!name&&!location&&category){
        Ssql = 'select * from company inner join job on job.company_id=company.id where category = ? ';
        args.push(category);
    }
    if(!name&&location&&category){
        Ssql = 'select * from company  inner join job on job.company_id=company.id where location = ? and category = ?';
        args.push(location);args.push(category);
    }
    if(name&&location&&!category){
        name = '%'+name+'%';
        Ssql = 'select * from company inner join job on job.company_id=company.id where (jobTitle like ? or name like ?) and location = ?';
        args.push(name);args.push(name);args.push(location);
    }
    if(name&&!location&&category){
        name = '%'+name+'%';
        Ssql = 'select * from company  inner join job on job.company_id=company.id where (jobTitle like ? or name like ?) and category = ?';
        args.push(name);args.push(name);args.push(category);
    }
    if(!name&&!location&&!category){
        Ssql = 'select * from  company inner join job on job.company_id=company.id';
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
                    let jobList = result;
                    conn.release();
                    res.json(jobList);
                
                
            }})
        }})
})
router.post('/applyJob',Fupload.single('file'),function(req,res){
    let data = req.body;
    let today = new Date()
    let year = today.getFullYear();
    let month = today.getMonth();
    let day = today.getDate();
    today = year+'-'+month+'-'+day;

    let Sargs = []
    Ssql = 'select * from stu_job where student_id=? and job_id=?'
    Sargs.push(data.stu_id);Sargs.push(data.job_id);

    
    let addSql = 'insert into stu_job (student_id,job_id,status,applied_date) values (?,?,?,?)'
    let args = [];
    args.push(data.stu_id);args.push(data.job_id);
    args.push("pending");args.push(today);

    pool.getConnection(function(err,conn){
        if(err){
            res.json('mysql error');
            return
        }else{
            conn.query(Ssql,Sargs,function(serr,result){
                if(serr){
                    console.log('[ADD ERROR] - ',serr.message);
                    conn.release();
                    res.json('mysql select error ')
                    return
                }else{
                        if(result.length!= 0 ){
                            conn.release();
                            res.json('you have already applied,file will be updated');
                        }else{
                            conn.query(addSql,args,function(qerr,result){
                                if(qerr){
                                    console.log('[ADD ERROR] - ',qerr.message);
                                    conn.release();
                                    res.json('mysql select error ')
                                    return
                                }else{
                                            conn.release();
                                            res.json('success');
                                    }
                                })
                        }
                            
                    }
            }
            )
            
            }})
})

router.get('/getStuList',function(req,res){
    let data = req.query;
    let id = data.id;
    let Ssql = 'select * from stu_job inner join student on stu_job.student_id=student.id where job_id = ' + Number(id);
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
                let jobInfo = result;
                conn.release();
                res.json(jobInfo);
            }})
        }})
})

router.put('/changeStatus',function(req,res){
    let data = req.body;
    let updateSql = 'update stu_job SET status=? where student_id=? and job_id=?'
    let args = [];
    args.push(data.status);args.push(data.stu_id);
    args.push(data.job_id);

    pool.getConnection(function(err,conn){
        if(err){
            res.json('mysql error');
            return
        }else{
            conn.query(updateSql,args,function(qerr,result){
                if(qerr){
                    console.log('[ADD ERROR] - ',qerr.message);
                    conn.release();
                    res.json('mysql select error ')
                    return
                }else{
                            conn.release();
                            res.json('success');
                    }
                })
            }})
})

router.get('/searchJobByStatus',function(req,res){
    let data = req.query;
    let stu_id = data.stu_id;
    let status = data.status;
    let Ssql;
    let args =[];
    args.push(stu_id)
    if(status){
        Ssql = 'select * from stu_job inner join job on stu_job.job_id=job.id inner join company on job.company_id = company.id where student_id = ? and status = ?' ;
        args.push(status);
    }else{
        Ssql = 'select * from stu_job inner join job on stu_job.job_id=job.id inner join company on job.company_id = company.id where student_id = ?';
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
                let jobInfo = result;
                conn.release();
                res.json(jobInfo);
            }})
        }})
})






module.exports = router