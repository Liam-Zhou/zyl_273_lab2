var mysql=require("mysql");
var config = require('./basicConfig')

var pool = mysql.createPool({
    host     : 'localhost',     
    user     : 'root',              
    password : 'Aa123456',       
    port: '3306',                   
    database: 'handshake' 
});

module.exports=pool;