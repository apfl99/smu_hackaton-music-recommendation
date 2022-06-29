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

const request_req = require('request');
const { response } = require("express");

//라우팅
//GET method
router.get('/', ctrl.output.root);
router.get('/login', ctrl.output.login); //로그인
router.get('/register', ctrl.output.register); //회원가입
router.get('/find_id', function(req, res, next){
    var name = req.query.name;
    var email = req.query.email;
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

module.exports = router;