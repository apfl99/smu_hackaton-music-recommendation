// 프런트 단의 기능을 구현
"use strict"
const form1 = document.getElementById("personal_info_modification");

form1.addEventListener("submit",personal_info);

function personal_info(e) {

        e.preventDefault();

        const filed = document.getElementById('filed');
        const birth = document.getElementById('birth');
        const major = document.getElementById('major');
        const personalDescription = document.getElementById('personalDescription');
        
        const checkResult = (fileCheck_ext_p() && fileCheck_size(filed.files[0]));


        if(checkResult) {
            //폼 데이터 처리
            const formData = new FormData();

            formData.append("filed", filed.files[0]);
            formData.append("birth",birth.value);
            formData.append("major",major.value);
            formData.append("personalDescription",personalDescription.value);
            formData.append("userId",window.sessionStorage.getItem('userId'));
            
            //프론트 -> 서버(form 형식)
            fetch("/personalinfoModification", {
                    method: 'POST',
                    body: formData,
            })
            .then((res) => res.json())
            .then((res) => {
                if (res.success) {
                    alert('개인 정보 수정 완료');
                    location.href='/author_portfolio_nft?user='+res.data.username;
                } else {
                    alert(res.msg);
                }
            })
            .catch((err) => {
                console.error("정보 수정 중 에러가 발생하였습니다.");
            });
        }

};
  

//파일 용량 체크
function fileCheck_size(file) {

    var maxSize = 100 * 1024 * 1024;
    if(file.size > maxSize){
        alert('파일 용량이 너무 큽니다.');
        return false;
    } else {
        return true;
    }
}

//파일 확장자 체크
function fileCheck_ext_p() {
    
    var ext = $("input[name='filed']").val().split('.').pop().toLowerCase();
    if($.inArray(ext, ['png','jpg','jpeg','svg']) == -1) {
        alert("등록 할수 없는 확장자입니다.");
        return false;
    } else {
        return true;
    }
}

function checkValue(value) {
    var valueCheck = value;
    if( !valueCheck ){
        return false;
    }else{
        return true;
    }
}