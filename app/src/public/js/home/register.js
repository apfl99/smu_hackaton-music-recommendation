// 프런트 단의 기능을 구현
"use strict"

const id = document.querySelector("#id");
const passwd = document.querySelector("#password");
const confirmPasswd = document.querySelector("#re-password");
const username = document.querySelector("#username");
const email = document.querySelector("#email");
const number = document.querySelector("#number");
const registerBtn = document.querySelector("#register_btn");

registerBtn.addEventListener("click",register);

function register() {

    checkUseridFormat(id.value);
    checkPasswordFormat(passwd.value);
    checkUsernameFormat(username.value);
    checkEmailFormat(email.value);
    checkNumber(number.value);
    checkRePasswordFormat(passwd.value, confirmPasswd.value);


    var checkResult = (checkUseridFormat(id.value) && checkPasswordFormat(passwd.value) && checkUsernameFormat(username.value) && checkEmailFormat(email.value) && checkRePasswordFormat(passwd.value, confirmPasswd.value) && checkNumber(number.value));
    

    if (checkResult) {
        const req = {
            id: id.value,
            email: email.value,
            username : username.value,
            passwd : passwd.value,
            number : number.value,
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

//id check
function checkUseridFormat(id) {
  var isTrue;

  if (id.length >= 2 && id.length < 20) {
    $('#userid-message').text(''); 
    isTrue = true;
  } else {
    $('#userid-message').text('2자 이상, 20자 미만으로 작성해주세요.');
    isTrue = false;
  }

  return Boolean(isTrue);
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

  
function checkNumber(value) {
  var valueCheck = value;
  if( !valueCheck ){
      $('#phone-message').text('전화번호를 입력해주세요'); //수정
      return false;
  }else{
      $('#phone-message').text('');
      return true;
  }
}