/* test start */
const RightBtn = document.querySelector("#right_btn");

RightBtn.addEventListener("click", function(){
    console.log("right");
    $("#one").css({"background":"url(/img/slide3.jpg)"});
    $("#two").css({"background":"url(/img/slide2.jpg)"});
    $("#three").css({"background":"url(/img/slide1.jpg)"});
});

const LeftBtn = document.querySelector("#left_btn");
LeftBtn.addEventListener("click",function(){
    $("#one").css({"background":"url(/img/slide2.jpg)"});
    $("#two").css({"background":"url(/img/slide3.jpg)"});
    $("#three").css({"background":"url(/img/slide1.jpg)"});
});
/* test end */