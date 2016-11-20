const express = require('express');
const router = express.Router();

const usr=require('../db/dbConnect');
const url = require('url');
const heorkuDbUrl = 'postgresql-rigid-68995';
const pg = require('pg');
const path = require('path');
const connectionString = process.env.heorkuDbUrl || 'postgres://localhost:5432/biblereading';


var homeTitle = "读经签到"

router.get('/pg', function(req, res) {
   console.log("Hello World");

   pg.connect(connectionString, (err, client, done) => {
   // Handle connection errors
   if(err) {
     done();
     console.log(err);
     return res.status(500).json({success: false, data: err});
   }
   // SQL Query > Insert Data

  });

});

/* GET home page. */
router.get('/', function(req, res) {
   console.log("Hello World");

    if(req.cookies.islogin){
        req.session.islogin=req.cookies.islogin;
    }
    if(req.session.islogin){
      res.locals.islogin=req.session.islogin;
    }

    if(req.cookies.islogin){
        console.log("render home");
        res.render('home', { title: homeTitle, user: res.locals.islogin });
    }else{
        console.log("render login");
        res.render('login', { title: homeTitle, user: res.locals.islogin });
   }
});


router.route('/login')
    .get(function(req, res) {
      res.redirect('/');
    })
    .post(function(req, res) {
        client=usr.connect();
        result=null;
        usr.selectFun(client,req.body.username, function (result) {
            if(result[0]===undefined){
                res.send('没有该用户');
            }else{
                if(result[0].password===req.body.password){
                    console.log("find user");
                    req.session.islogin=req.body.username;
                    res.locals.islogin=req.session.islogin;
                    res.cookie('islogin',res.locals.islogin,{maxAge:60000});
                    res.redirect('/home');
                }else
                {
                   console.log("no user");
                    res.redirect('/');
                }
            }
        });
    });

router.get('/logout', function(req, res) {
    res.clearCookie('islogin');
    req.session.destroy();
    res.redirect('/');
});

router.route('/home')
  .get(function(req, res) {
    if(req.session.islogin){
        res.locals.islogin=req.session.islogin;
    }
    if(req.cookies.islogin){
        req.session.islogin=req.cookies.islogin;
    }

    if(req.cookies.islogin){
        console.log("render home");
        res.render('home', { title: homeTitle, user: res.locals.islogin });
    }else{
        res.redirect('/');
    }
  })
  .post(function(req,res) {
        res.send("no action")
  });


router.route('/insertBibleLog')
    .get(function(req, res) {
    var url_parts = url.parse(req.url, true);
    var theLog = url_parts.query.log;
    var userName = req.session.islogin;

     usr.insertBibleLogFun(client, userName, theLog, function (err) {
          if(err) throw err;
          res.send("Insert successfully!")
    });
    })
    .post(function(req,res) {
      res.send("no post")
    });

router.route('/getOthersLog')
    .get(function(req,res){
            client = usr.connect();
            usr.queryBibleLogFun(client, function (err, rows) {
                  if(err) throw err;
                  res.json(rows);
      });
  });

  router.route('/getMyLog')
      .get(function(req,res){
              client = usr.connect();
              var userName = req.session.islogin;
              usr.queryMyBibleLogFun(client, userName, function (err, rows) {
                    if(err) throw err;
                    res.json(rows);
        });
    });

router.route('/reg')
    .get(function(req,res){
        res.render('reg',{title:'注册'});
    })
    .post(function(req,res) {
        client = usr.connect();
        console.log("get register poster")
        usr.insertFun(client,req.body.username, req.body.password2, function (err) {
              if(err) res.send('该用户名已经存在，请返回重新注册');;

            //  res.send('注册成功');
              res.redirect('/');
        });
    });

module.exports = router;
