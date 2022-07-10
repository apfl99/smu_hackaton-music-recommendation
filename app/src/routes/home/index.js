// route 모듈화
"use strict";

const express = require("express");
const router = express.Router();
const ctrl = require("./home.ctrl");
const db = require("../../config/db");

const emailsend = require("../../public/js/home/emailsend");

const fs = require('fs'); // js 파일 시스템 모듈을 사용하면 컴퓨터의 파일 시스템으로 작업할 수 있습니다. 

//multer 사용
const multer  = require('multer');
const {request} = require("http");
const upload = multer({ dest: 'uploads/' }) //업로드



//라우팅

//GET method
router.get('/', ctrl.output.root);
router.get('/login', ctrl.output.login); //로그인
router.get('/register', ctrl.output.register); //회원가입
router.get('/search', ctrl.output.search);
router.get('/hometest',ctrl.output.hometest);
router.get('/test',ctrl.output.test);
router.get('/mylist',ctrl.output.mylist);
router.get('/find-id', function(req, res, next){
    res.render("home/find_id");
});
router.get('/find_id', function(req, res, next){
    var name = req.query.name;
    var email = req.query.email;

    console.log(name, email);
    var type = "fail";

    db.query('SELECT * FROM User', async function(err, results, fields){
        if(err){
            console.log(err);
        }
        for(var i=0; i<results.length; i++){
            if(results[i].user_email == email){
                if(results[i].user_name == name){
                    let emailParam = {
                        toEmail: email,     // 수신할 이메일
                        text: '아이디는  "' + results[i].user_id + '"  입니다.'    // 메일 내용
                      };
                      type = "success";
                      emailsend.sendGmail(emailParam);
                    break;
                }
                break;
            }
        }

        if(type == "success")
            res.send("<script>alert('메일로 요청하신 정보가 발송되었습니다.');location.href='/';</script>");
        else
            res.send("<script>alert('잘못된 입력 정보입니다.');location.href='/';</script>");
    });

    
    //res.render("home/home",);
});
router.get('/find-pw', function(req, res, next){
    res.render("home/find_pw");
});
router.get('/find_pw', function(req, res, next){
    var id = req.query.id;
    var email = req.query.email;
    var type = "fail";

    db.query('SELECT * FROM User', async function(err, results, fields){
        if(err){
            console.log(err);
        }
        for(var i=0; i<results.length; i++){
            if(results[i].user_email == email){
                if(results[i].user_id == id){
                    let emailParam = {
                        toEmail: email,     // 수신할 이메일
                        text: '비밀번호는  "' + results[i].user_password + '"  입니다. 로그인 후 비밀번호를 변경해주세요.'    // 메일 내용
                      };
                      type = "success";
                      emailsend.sendGmail(emailParam);
                    break;
                }
                break;
            }
        }

        if(type == "success")
            res.send("<script>alert('메일로 요청하신 정보가 발송되었습니다.');location.href='/';</script>");
        else
            res.send("<script>alert('잘못된 입력 정보입니다.');location.href='/';</script>");
    });

});


//POST method
router.post('/login', ctrl.process.login); // 로그인
router.post('/register',ctrl.process.register); // 회원가입

router.get('/likelist', async function(req, res, next){
    await db.query('SELECT * FROM Song_list where Song_list.like = 1', async function(err, results){
       var send_results = [];
       var j = 0;
       if(err){
           console.log(err);
       }

       // for(var i = 0; i < results.length; i++){
       //     if(results[i].like){
       //         send_results[j] = results[i];
       //         j++ ;
       //     }
       // }

       send_results = results;
       await console.log(send_results);
       console.log("like--------------------------------------------")
       res.render("home/home", {results : send_results});
   });
});
router.get('/lessviewcount', function(req, res, next){
   db.query('SELECT * FROM Song_list', async function(err, results){
       if(err){
           console.log(err);
       }
       var send_results = results;

       send_results = results.sort(function(a,b){
           return b.view_count - a.view_count;
       })

       console.log(send_results);
       console.log("viewcount");
       res.render("home/home", {results : send_results});
   });
});

module.exports = router;