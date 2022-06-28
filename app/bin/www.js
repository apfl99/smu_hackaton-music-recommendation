"use strict";

// 서버 가동 모듈화
const app = require("../app");
const PORT = process.env.PORT || 3000;

// 서버 설정(express)
app.listen(PORT, () => {
    console.log("서버 가동")
});