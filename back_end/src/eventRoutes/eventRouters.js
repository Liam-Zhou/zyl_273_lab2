var express = require('express');
var router = express.Router();
var qs = require('qs');
var pool = require('../../config/db');

router.post('/addEvent',function(req,res){
    let data = req.body;
    let addSql = 'insert into event (company_id,name,description,time,location,eligibility) values (?,?,?,?,?,?)'
    let args = [];
    let time = data.time;let date = data.date;
    let timestamp = new Date(date+' '+time).getTime();
    args.push(data.id);args.push(data.eventName);args.push(data.des);
    args.push(timestamp);args.push(data.location);args.push(data.eligibility);
    
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

router.get('/getEventList',function(req,res){
    let data = req.query;
    let id = data.id;
    let Ssql = 'select * from event where company_id = ' + Number(id);
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
                let eventInfo = result;
                conn.release();
                res.json(eventInfo);
            }})
        }})
})

router.get('/searchEvent',function(req,res){
    let data = req.query;
    let name = data.name;
    let Ssql
    if(name){
        name = "%"+name+"%"
        Ssql = 'select company.name as companyname, event.id, event.name ,event.description ,event.time ,event.location ,event.eligibility  from company inner join event on event.company_id=company.id  where event.name like ? ORDER BY event.time ';
    }else{
        Ssql = 'select company.name as companyname, event.id, event.name, event.description, event.time, event.location ,event.eligibility from company inner join event on event.company_id=company.id ORDER BY event.time ';
    }
    pool.getConnection(function(err,conn){
        if(err){
            res.json('mysql error');
            return
        }else{
        conn.query(Ssql,name,function(qerr,result){
            if(qerr){
                console.log('[SELECT ERROR] - ',qerr.message);
                conn.release();
                res.json('mysql select error s')
                return
            }else{
                let eventInfo = result;
                conn.release();
                res.json(eventInfo);
            }})
        }})
})

router.get('/getMajor',function(req,res){
    let data = req.query;
    let id = data.id;
    let Ssql = 'select major from education where student_id = ' + Number(id);
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
                let majors = result;
                conn.release();
                res.json(majors);
            }})
        }})
})

router.post('/applyEvent',function(req,res){
    let data = req.body;
    console.log('req.body',req.body)
    let sargs = []
    let Ssql = 'select * from stu_event where student_id =? and event_id=?'
    sargs.push(data.stu_id);sargs.push(data.event_id);

    let addSql = 'insert into stu_event (student_id,event_id) values (?,?)'
    let args = [];
    args.push(data.stu_id);args.push(data.event_id);

    // var mysql      = require('mysql');
    // var connection = mysql.createConnection({
    // host     : 'localhost',
    // user     : 'root',
    // password : 'Aa123456',
    // database : 'handshake'
    // });
    
    // connection.connect();
    // connection.query(Ssql,sargs,function(serr,result){
    //     if(serr){
    //                         console.log('[ADD ERROR] - ',serr.message);
    //                         res.json('mysql select error ')
    //                         return
    //                     }
    //     if(result.length!= 0 ){
    //                                 res.json('you have already applied');
    //                             }
    //   });


    pool.getConnection(function(err,conn){
        if(err){
            res.json('mysql error');
            return
        }else{
            conn.query(Ssql,sargs,function(serr,result){
                if(serr){
                    console.log('[ADD ERROR] - ',serr.message);
                    conn.release();
                    res.json('mysql select error ')
                    return
                }else{
                        if(result.length!= 0 ){
                            conn.release();
                            res.json('you have already applied');
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
                        }
                    }
                })

    }}
    
    )
})

router.get('/getStuList',function(req,res){
    let data = req.query;
    let id = data.id;
    let Ssql = 'select * from stu_event inner join student on stu_event.student_id=student.id where event_id = ' + Number(id);
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
                let ss = result;
                conn.release();
                res.json(ss);
            }})
        }})
})

router.get('/getEventofStu',function(req,res){
    let data = req.query;
    let id = data.stu_id;
    let Ssql = 'select * from stu_event inner join event on stu_event.event_id=event.id where student_id = ' + Number(id);
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
                let es = result;
                conn.release();
                res.json(es);
            }})
        }})
})







module.exports = router