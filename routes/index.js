var express = require('express');
var router = express.Router();
var usr=require('../db/dbConnect');
var url = require('url');

var homeTitle = "读经签到"

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
      res.send('ok')
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
                    res.redirect('/login');
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
        res.redirect('/login');
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
            console.log("getOthersLog")
            usr.getBibleLogFun(client, 0, function (err, rows) {
                  if(err) throw err;

                  for (var i in rows) {
                      console.log('Post Titles: ', rows[i].name, rows[i].log);
                  }
                  res.send(rows);
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
              if(err) throw err;

            //  res.send('注册成功');
              res.redirect('/login');
        });
    });

module.exports = router;
