"use strict";

// 모듈
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const home = require("./src/routes/home");
const multer = require('multer');

// 뷰 셋팅
app.set("views", "./src/views");
app.set("view engine", "ejs");


// 미들웨어(라우팅 정보 index.js) 등록
app.use(express.static(`${__dirname}/src/public`));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/", home);

module.exports = app;
