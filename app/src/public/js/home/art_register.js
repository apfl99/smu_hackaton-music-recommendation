// 프런트 단의 기능을 구현
"use strict"
const formBtn = document.getElementById("art_register_form");

formBtn.addEventListener("submit",art_register);

function art_register(e) {
        
        e.preventDefault();

        const files = document.getElementById('files');
        const artName = document.getElementById('artName');
        const artCategory = document.getElementById('artCategory');
        const artDescription = document.getElementById('artDescription');


        // 미입력 체크
        if(checkValue(files.files[0])){
            $('#files-message').text('');
        } else {
            $('#files-message').text('파일을 업로드해주세요.');
        }
        if(checkValue(artName.value)){
            $('#artName-message').text('');
        } else {
            $('#artName-message').text('작품명을 입력해주세요.');
        }
        if(checkValue(artDescription.value)) {
            $('#artDescription-message').text('');
        } else {
            $('#artDescription-message').text('작품 설명을 입력해주세요.');
        }

        const checkResult = (checkValue(files.files[0]) && checkValue(artName.value) && checkValue(artDescription.value) && fileCheck_size(files.files[0]) && fileCheck_ext_a());

        if(checkResult) {
            //폼 데이터 처리
            const formData = new FormData();

            
            formData.append("artName",artName.value);
            formData.append("artCategory",artCategory.value);
            formData.append("artDescription",artDescription.value);
            formData.append("files", files.files[0]);
            formData.append("userId",window.sessionStorage.getItem('userId'));
            
            //프론트 -> 서버(form 형식)
            fetch("/artRegister", {
                    method: 'POST',
                    body: formData,
            })
            .then((res) => res.json())
            .then((res) => {
                if (res.success) {
                    alert('작품 업로드 성공');
                    location.href='/mypage';
                } else {
                    alert(res.msg);
                }
            })
            .catch((err) => {
                console.error("작품 업로드 중 에러가 발생하였습니다.");
            });
        }

};
  
function checkValue(value) {
    var valueCheck = value;
    if( !valueCheck ){
        return false;
    }else{
        return true;
    }
}

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
function fileCheck_ext_a() {
    
    var ext = $("input[name='files']").val().split('.').pop().toLowerCase();
    
    if($.inArray(ext, ['gif','png','jpg','jpeg','svg']) == -1) {
        alert(ext);
        return false;
    } else {
        return true;
    }
}