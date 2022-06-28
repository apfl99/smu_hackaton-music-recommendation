// route 모듈화
"use strict";

const express = require("express");
const router = express.Router();
const ctrl = require("./home.ctrl");

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


//POST method
router.post('/login', ctrl.process.login); // 로그인
router.post('/register',ctrl.process.register); // 회원가입




module.exports = router;