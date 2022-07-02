// 컨트롤러 모듈화
"use strict";

const User = require("../../models/User");

const fs = require('fs'); // js 파일 시스템 모듈을 사용하면 컴퓨터의 파일 시스템으로 작업할 수 있습니다. 

//multer 사용
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' }) //업로드

//DB
const db = require("../../config/db");
const { request } = require("http");


const request_req = require('request');
const { response } = require("express");

const output = {
    root : (req,res) => {
        res.render('home/home');
    },
    login : (req,res) => {
        res.render("home/login");
    },
    register : (req,res) => {
        res.render("home/register");
    },
};


const process = {
    login : async (req,res) => {
        const user = new User(req.body);
        const response = await user.login(req);
        return res.json(response);
    },
    register : async (req,res) => {
        console.log("home ctrl - register");
        const user = new User(req.body);
        const response = await user.register();
        return res.json(response);
    },

};









module.exports = {
    output,
    process,
};