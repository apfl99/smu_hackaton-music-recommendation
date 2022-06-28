// 프런트 단의 기능을 구현
"use strict"

const email = document.querySelector("#email");
const username = document.querySelector("#username");
const passwd = document.querySelector("#password");
const confirmPasswd = document.querySelector("#re-password");
const registerBtn = document.querySelector("#register_btn");
const major = document.getElementById('major');
const birth = document.getElementById('birth');

registerBtn.addEventListener("click",register);

function register() {
    checkEmailFormat(email.value);
    checkUsernameFormat(username.value);
    checkPasswordFormat(passwd.value);
    checkRePasswordFormat(passwd.value, confirmPasswd.value);
    checkCheckBox();

    var checkResult = (checkEmailFormat(email.value) && checkUsernameFormat(username.value) && checkPasswordFormat(passwd.value) && checkRePasswordFormat(passwd.value, confirmPasswd.value) && checkCheckBox() && checkBirth(birth.value));


    if (checkResult) {
        const req = {
            email: email.value,
            username : username.value,
            passwd : passwd.value,
            major : major.value,
            birth : birth.value,
        };

        //프론트 -> 서버
        fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req), // 문자열로 바꿔주지만 body-parser를 통해 파싱되므로 객체 형태로 다시 전달받게 됨
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.success) {
                alert('회원가입 성공');
                location.href = "/login";
            } else {
                alert(res.msg);
            }
        })
        .catch((err) => {
            console.error("회원가입 중 에러가 발생하였습니다.");
        });
    }
};

//email check
function checkEmailFormat(email) {
    var mailformat = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
    var isTrue;
  
    if (mailformat.test(email)) {
      $('#email-message').text('');
      isTrue = true;
    } else {
      $('#email-message').text('올바른 이메일 형식이 아닙니다.');
      isTrue = false;
    }
  
    return Boolean(isTrue);
};

 //username check
 function checkUsernameFormat(username) {
    var isTrue;
  
    if (username.length >= 2 && username.length < 20) {
      $('#username-message').text('');
      isTrue = true;
    } else {
      $('#username-message').text('2자 이상, 20자 미만으로 작성해주세요.');
      isTrue = false;
    }
  
    return Boolean(isTrue);
  };

  //password check
function checkPasswordFormat(password) {
    var pwformat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    var isTrue;
  
    if (pwformat.test(password)) {
      $('#password-message').text('');
      isTrue = true;
    } else {
      $('#password-message').text('비밀번호는 소문자, 대문자, 숫자 및 특수 문자를 포함하는 8~15자 입니다.');
      isTrue = false;
    }
  
    return Boolean(isTrue);
  };

  //repassword check
function checkRePasswordFormat(password, re_password) {
    var isTrue;
  
    if (password === re_password) {
      $('#repassword-message').text('');
      isTrue = true;
    } else {
      $('#repassword-message').text('비밀번호가 일치하지 않습니다.');
      isTrue = false;
    }
  
    return Boolean(isTrue);
};

function checkCheckBox(check) {
    var checked = $('#checkBox').is(':checked');
    if(!checked) {
        alert('개인 정보 수집 동의를 해주세요');
    }
    return Boolean(checked);
};
  
function checkBirth(value) {
  var valueCheck = value;
  if( !valueCheck ){
      $('#birth-message').text('생년월일을 입력해주세요');
      return false;
  }else{
      $('#birth-message').text('');
      return true;
  }
}