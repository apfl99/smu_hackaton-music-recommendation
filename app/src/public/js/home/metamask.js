// Web3가 브라우저에 주입되었는지 확인(Mist/MetaMask)
if (typeof web3 !== 'undefined') {
    // Mist/MetaMask의 프로바이더 사용
    web3 = new Web3(web3.currentProvider);
    document.getElementById("metamask_address_output").innerHTML = "계정정보를 불러오는 중...";
} else {
    // 사용자가 Metamask를 설치하지 않은 경우에 대해 처리
    // 사용자들에게 Metamask를 설치하라는 등의 메세지를 보여줄 것
    document.getElementById("metamask_address_output").innerHTML = "메타마스크를 설치해주세요.";
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

let userAccount;    // 사용자가 사용 중 이라고 브라우저가 인식하는 계정

let currentAccount;

let checkAccountChange = setInterval(async function() {
        // 계정이 바뀌었는지 확인
        currentAccount = await web3.eth.getAccounts().then(function(array) { return array[0] });
        // 현재 유저가 들고있는 계정(currentAccount)가 브라우저가 인식하는 계정(userAccount)와 다르다면
        if (currentAccount !== userAccount) {
            // 계정을 업데이트 해준다
            userAccount = currentAccount;
            // 새 계정에 대한 UI로 업데이트하기 위한 함수 호출 및 메시지 알림
            document.getElementById("metamask_address_output").innerHTML = '  ' + userAccount;
            //메타마스크 계정별 확인 링크 "https://ropsten.etherscan.io/address/" + userAccount + "#tokentxnsErc721"
            const linkEtherScanBtn = document.getElementById("linkEtherScan");
            linkEtherScanBtn.addEventListener("click",function popup(){
                let options = "toolbar=no,scrollbars=no,resizable=yes,status=no,menubar=no,width=1200, height=800, top=0,left=0";

                window.open("https://ropsten.etherscan.io/address/" + userAccount + "#tokentxnsErc721", options);
              },false);
            //메타마스크 계정 잔액
            let wei = await web3.eth.getBalance(userAccount);
            let balance = web3.utils.fromWei(wei, 'ether');
            document.getElementById("metamask_balance_output").innerHTML = balance  + 'ETH';
        
            const req = {
                metaAccount: userAccount,
            }

            document.getElementById("metamask_tokenNum_output").innerHTML = 'NFT 정보를 가져오는중 ...';
            //현재 접속 중인 metamask 계정정보를 담고 C to S
            fetch("/NFT",{
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(req), // 문자열로 바꿔주지만 body-parser를 통해 파싱되므로 객체 형태로 다시 전달받게 됨
            })
            .then((res) => res.json())
            .then((res) => {
                document.getElementById("metamask_tokenNum_output").innerHTML = res.TokenNum + ' NFTS';

                //Tokens 뷰 정의
                var tokens = $('#Tokens');

                if(res.TokenNum > 0){ // 보유 토큰이 있을 경우
                    $('#Tokens *').remove();
                    var template = $('#TokensTemplate');

                    //template rendering
                    for(i=0;i<res.TokenNum;i++){
                        setBasicTemplate(template, res.token_info[i].token_infos.ArtName, res.token_info[i].token_infos.ArtLink);
                        tokens.append(template.html());
                    }
                } else {
                    $('#Tokens *').remove();
                    var template = $('#NoTokensTemplate');
                    template.find('.content-box-title').text("현재 보유한 토큰이 없습니다.");
                    tokens.append(template.html());
                }
             
            })
            .catch((err) => {
                console.error(new Error("에러가 발생하였습니다."));
            });
            
            return userAccount;
        }
}, 1000);     // 1초 마다 계정 확인



function setBasicTemplate(template, ArtName, ArtLink) {  
    template.find('img').attr('src', ArtLink);
    template.find('.content-box-title').text(ArtName);
}







