// 프런트 단의 기능을 구현
"use strict"
const l_id = document.querySelector("#l_id");
const l_passwd = document.querySelector("#l_password");
const loginBtn = document.querySelector("#login_btn");


loginBtn.addEventListener("click", login);

function login() {
    console.log(l_id.value+" "+l_passwd.value);
    const req = {
        l_id: l_id.value,
        l_passwd: l_passwd.value,
        logined: false
    };
    //프론트 -> 서버
    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req), // 문자열로 바꿔주지만 body-parser를 통해 파싱되므로 객체 형태로 다시 전달받게 됨
    })
    .then((res) => res.json())
    .then((res) => {
        if (res.success) {            
            //로그인 성공시 홈 화면으로
            window.sessionStorage.setItem('isLogined',true);
            window.sessionStorage.setItem('userId',req.l_id);
            location.href='/';
        } else {
            if (res.err) return alert(res.err); // 실제로는 err 값이 알림창으로 나오면 안 됨
            alert(res.msg);
        }
    })
    .catch((err) => {
        console.error(new Error("로그인 중 에러가 발생하였습니다."));
    });
};