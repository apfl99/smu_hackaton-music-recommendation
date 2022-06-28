async function mintAT() {
    const pk = $('#input-password').val();

    //작품 아이디 가져오기
    const searchParams = new URLSearchParams(location.search);
    var artId;



    for (const param of searchParams) {
        artId = param[1];
    }

    const req = {
        artId: artId,
        pk: pk,
    }
    


    //프론트 -> 서버
    fetch("/mintAT", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req), // 문자열로 바꿔주지만 body-parser를 통해 파싱되므로 객체 형태로 다시 전달받게 됨
    })
    .then((res) => res.json())
    .then((res) => {
        if (res.success) {
            $('#loginModal').modal('hide');
            alert('NFT 발행 성공');
            window.open("https://ropsten.etherscan.io/tx/" + res.msg);
        } else {
            $('#loginModal').modal('hide');
            alert(res.msg);
        }
    })
    .catch((err) => {
        $('#loginModal').modal('hide');
        alert("서버 오류가 발생하였습니다.");
    });

}

async function getAccount() {
    if (typeof window.ethereum !== 'undefined') {
        // connects to MetaMask
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        return accounts[0];
      } else {
        alert('metamask 로그인이 필요합니다.');
      }
}