const mintBtn = document.querySelector("#mintBtn");

mintBtn.addEventListener("click",mintATBtn);

async function mintATBtn() {

    //프론트 -> 서버
    fetch("/mintATBtn", {
        method: "POST",
    })
    .then((res) => res.json())
    .then((res) => {
        $('#txnfee-message').text('예상 수수료 : ' + res.txnFee + 'Ether');
        $('#txnfeeUSD-message').text('예상 수수료 : ' + '$' + res.txnFee_USD);
    })

    $('#loginModal').modal('show');

}

