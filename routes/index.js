var express = require('express');
var router = express.Router();
var app     = express();
var mysql = require('mysql');
var session = require('express-session');
// create a connection with mysql
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "nodelogin"
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'login' });
});
router.post('/login', function(req, res, next) {
  var email=req.body.email;
  var password=req.body.password;
  if(email  && password){
  var sql="select * from users Where email=? and password=?";
  con.query(sql,[email,password],function(error,results,fields){
    if(results.length>0)
    {
      console.log("Login successfully!");
      req.session.email=req.body.email;
      res.redirect('/userhome');
    }
    else
    {
      res.render('login',{msg:"Invalid email & password"});
    }
  });
  }
  else{
    res.send("Please Enter email and password!");
  }
});
router.get('/logout',function(req,res){
req.session.destroy(function(){
 console.log("user logged out");
 res.redirect('/');
});
});
router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'signup' });
});
router.post('/signup', function(req, res, next) {
   var email=req.body.email;
   var password=req.body.password;
   var name=req.body.name;
   var regno=req.body.regno;
   var sql="insert into users(email,password,name,regno) values('"+email+"','"+password+"','"+name+"','"+regno+"')";
   con.query(sql,function(err,result){
    if(err) throw err;
    console.log("Data insert sucessfully!");
    res.render('login',{msg:'Register sucessfully'});
   });
});
router.get('/userhome',function(req,res,next){
  if(req.session.email){
    res.render('userhome',{title:'userhome'});
  }
  else{
  res.redirect('/');
  }

});
module.exports = router;
