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


//POST method
router.post('/login', ctrl.process.login);
router.post('/register',ctrl.process.register);
router.post('/artRegister',upload.single("files"),ctrl.process.artRegister);
router.post('/personalinfoModification',upload.single("filed"),ctrl.process.personalinfoModification);
router.post('/author_portfolio_nft',ctrl.process.authorPortfolio_nft);
router.post('/mintAT', ctrl.process.mintAT);
router.post('/recordRegister', ctrl.process.recordRegister);
router.post('/NFT',ctrl.process.NFT);
router.post('/authors',ctrl.process.author);
router.post('/mintATBtn',ctrl.process.mintATBtn);




module.exports = router;