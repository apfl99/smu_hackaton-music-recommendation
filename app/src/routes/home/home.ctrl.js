// 컨트롤러 모듈화
"use strict";

const User = require("../../models/User");

const fs = require('fs'); // js 파일 시스템 모듈을 사용하면 컴퓨터의 파일 시스템으로 작업할 수 있습니다. 
//multer 사용
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' }) //업로드

//ipfs-api 사용
var ipfsAPI = require('ipfs-api');
const { path } = require('express/lib/application');

// connect to ipfs daemon API server
var ipfs = ipfsAPI('infura-ipfs.io', '5001', {protocol: 'https'}) // leaving out the arguments will default to these values

//DB
const db = require("../../config/db");
const { request } = require("http");

//web3
const Web3  = require('web3');

//Ropsten 네트워크 연결
var web3 = new Web3(new Web3.providers.WebsocketProvider('wss://ropsten.infura.io/ws/v3/7bcf9e3b735344dd932e2fc3e464e56b'));

//컨트랙 정보 읽어오기
var DEPLOYED_ABI = JSON.parse(fs.readFileSync('deployedABI', 'utf8'));
var DEPLOYED_ADDRESS = fs.readFileSync('deployedAddress', 'utf8').replace(/\n|\r/g, "");
const atContract = new web3.eth.Contract(DEPLOYED_ABI,DEPLOYED_ADDRESS);

const Tx = require('ethereumjs-tx').Transaction;

const request_req = require('request');
const { response } = require("express");

const ethPrice = require('eth-price');
 
const { convert } = require('exchange-rates-api');

const output = {
    root : (req,res) => {
        res.render('home/home');
    },
    login : (req,res) => {
        res.render("home/login");
    },
    register : (req,res) => {
        res.render("home/register");
    },
    artDetail : (req,res) => {
        const likeId = req.query.likeId;
        const viewId = req.query.viewId;
        var artId = 0;

        if(likeId == undefined){
            const viewId1 = parseInt(viewId);
            view_count(viewId1,res);
            artId = viewId1;
        } else {
            const likeId1 = parseInt(likeId);
            view_count(likeId1,res);
            like_count(likeId1);
            artId = likeId1;
        }

        // 뷰
        const query2 = "SELECT art.*, login_designer.username FROM art LEFT JOIN login_designer ON art.author_id = login_designer.userId where art.art_id=?;";
        db.query(query2, [artId], (err,rows) => {
            if(err) {
                console.error("query error" + err);
                res.status(500).send("Internal Sever Error");
            } else {
                const query3 = "SELECT art.*, login_designer.username FROM art LEFT JOIN login_designer ON art.author_id = login_designer.userId where author_id=?;";
                db.query(query3, [rows[0].author_id], (err,data) => {
                    if(err){
                        console.error("query error" + err);
                        res.status(500).send("Internal Sever Error");
                    } else {
                        res.render("home/art_detail",{row : rows[0], data : data});
                    }
                })   
            }
        })
    },
    art : (req,res) => {
        //좋아요 함수
         const likeId = req.query.likeId;
         like_count(likeId);

        //정렬 쿼리문 정의
        const major_select = req.query.major_select;
        const art_select = req.query.art_select;
        const query = art_sorting(major_select,art_select);

        db.query(query,(err,rows) => {
            if(err) {
                console.error("query error" + err);
                res.status(500).send("Internal Sever Error");
            } else {
                res.render("home/art",{rows: rows});
            }
        })
    },    
    authorPortfolio : (req,res) => {
        const UserName = req.query.user; 
        
        // 뷰
        const query = "SELECT art.*, login_designer.* FROM art RIGHT JOIN login_designer ON art.author_id = login_designer.userId where login_designer.username=? ORDER BY art.like DESC;";
        db.query(query, [UserName], (err,rows) => {
            if(err) {
                console.error("query error" + err);
                res.status(500).send("Internal Server Error");
            } else {
                const query1 = "select author_record.*, login_designer.* FROM author_record RIGHT JOIN login_designer ON author_record.author_id_r = login_designer.userId where login_designer.username=?;"
                db.query(query1, [UserName], (err,datas) => {
                    if(err) {
                        console.error("query error" + err);
                        res.status(500).send("Internal Server Error");
                    }
                    else {
                        const query2 = "SELECT art.*, login_designer.* FROM art LEFT JOIN login_designer ON art.author_id = login_designer.userId where login_designer.username= ? AND art.isNFT=1;";
                        db.query(query2, [UserName], (err,nfts) => {
                            // 전체 조회수
                            var view_sum = 0;
                            for(let row of rows) {
                                view_sum += row.view_count;
                            }
                            //NFT 조회수
                            var view_sum_nft = 0;
                            for(let nft of nfts) {
                                view_sum_nft += nft.view_count;
                            }

                            res.render("home/author_portfolio",{rows : rows, view_sum: view_sum, datas: datas, nfts: nfts, view_sum_nft: view_sum_nft});
                        })
                    }
                })
            }
        })
    },
    authorPortfolio_nft: async (req,res) => {
        const UserName = req.query.user; 
        
        // 뷰
        const query = "SELECT art.*, login_designer.* FROM art RIGHT JOIN login_designer ON art.author_id = login_designer.userId where login_designer.username=? ORDER BY art.like DESC;";
        db.query(query, [UserName], (err,rows) => {
            if(err) {
                console.error("query error" + err);
                res.status(500).send("Internal Server Error");
            } else {
                const query1 = "select author_record.*, login_designer.* FROM author_record RIGHT JOIN login_designer ON author_record.author_id_r = login_designer.userId where login_designer.username=?;"
                db.query(query1, [UserName], (err,datas) => {
                    if(err) {
                        console.error("query error" + err);
                        res.status(500).send("Internal Server Error");
                    }
                    else {
                        const query2 = "SELECT art.*, login_designer.* FROM art LEFT JOIN login_designer ON art.author_id = login_designer.userId where login_designer.username= ? AND art.isNFT=1;";
                        db.query(query2, [UserName], (err,nfts) => {
                            // 전체 조회수
                            var view_sum = 0;
                            for(let row of rows) {
                                view_sum += row.view_count;
                            }
                            //NFT 조회수
                            var view_sum_nft = 0;
                            for(let nft of nfts) {
                                view_sum_nft += nft.view_count;
                            }

                            res.render("home/author_portfolio_nft",{rows : rows, view_sum: view_sum, datas: datas, nfts: nfts, view_sum_nft: view_sum_nft});
                        })
                    }
                })
            }
        })
    },
    //db에서 작가 전공에 해당하는게 맞으면 해당 전공의 ipfs2, username가져오기
    author : (req,res) => {
        const UserName = req.query.user; 
        // 뷰
        const query5 = "SELECT login_designer.username, login_designer.ipfs_link2, login_designer.major FROM NFT.login_designer ORDER BY login_designer.birth ASC;";
        db.query(query5, (err,rows) => {
            if(err) {
                console.error("query error" + err);
                res.status(500).send("Internal Server Error");
            } else {
                res.render("home/authors",{rows : rows});
            }
        })
    },   
    myPage : (req,res) => {
        res.render("home/mypage");
    },    
    errPage : (req,res) => {
        res.render("home/404");
    },    
    generateNFT : (req,res) => {
        const likeId = req.query.likeId;
        const viewId = req.query.viewId;
        var artId = 0;

        if(likeId == undefined){
            const viewId1 = parseInt(viewId);
            view_count(viewId1,res);
            artId = viewId1;
        } else {
            const likeId1 = parseInt(likeId);
            view_count(likeId1,res);
            like_count(likeId1);
            artId = likeId1;
        }

        // 뷰
        const query2 = "SELECT art.*, login_designer.username FROM art LEFT JOIN login_designer ON art.author_id = login_designer.userId where art.art_id=?;";
        db.query(query2, [artId], (err,rows) => {
            if(err) {
                console.error("query error" + err);
                res.status(500).send("Internal Sever Error");
            } else {
                const query3 = "SELECT art.*, login_designer.username FROM art LEFT JOIN login_designer ON art.author_id = login_designer.userId where author_id=?;";
                db.query(query3, [rows[0].author_id], (err,data) => {
                    if(err){
                        console.error("query error" + err);
                        res.status(500).send("Internal Sever Error");
                    } else {
                        res.render("home/generateNFT",{row : rows[0], data : data});
                    }
                })   
            }
        })
    },    
    NFT : async (req,res) => {
        res.render("home/NFT");
    }
};


const process = {

    login : async (req,res) => {
        const user = new User(req.body);
        const response = await user.login(req);
        return res.json(response);
    },
    register : async (req,res) => {
        const user = new User(req.body);
        const response = await user.register();
        return res.json(response);
    },
    artRegister : async (req,res) => { 

        // 파일 ipfs 등록 및 CID, ipfsLink 반환
        var data = new Buffer(fs.readFileSync(req.file.path));

        //IPFS
        var ipfsVal = await ipfs.add(data);

        //ipfs link generate
        var url = 'https://infura-ipfs.io/ipfs/';
        url += (ipfsVal[0].hash);
        url += '?filename=';
        url += (req.file.originalname);
        var ipfsUrl =  encodeURI(url);


        //넘겨줄 ipfs값들(url,cid)
        var ipfsResultVal = {
            ipfsCid: ipfsVal[0].hash,
            ipfsUrl: ipfsUrl
        }

        //DB
        const user = new User(req.body,ipfsResultVal);
        const response = await user.art_register();
        return res.json(response);
        
    },

    personalinfoModification : async (req,res) => { 
        if(req.file != undefined) {
            // 파일 ipfs 등록 및 CID, ipfsLink 반환
            var data = new Buffer(fs.readFileSync(req.file.path));

            //IPFS
            var ipfsVal = await ipfs.add(data);

            //ipfs link generate
            var url = 'https://infura-ipfs.io/ipfs/';
            url += (ipfsVal[0].hash);
            url += '?filename=';
            url += (req.file.originalname);
            var ipfsUrl =  encodeURI(url);
            

            //넘겨줄 ipfs값들(url,cid)
            var ipfsResultVal = {
                ipfsCid: ipfsVal[0].hash,
                ipfsUrl: ipfsUrl
            }
        } else {
            //넘겨줄 ipfs값들(url,cid)
            var ipfsResultVal = {
                ipfsCid: undefined,
                ipfsUrl: undefined
            }
        }



      //DB
        const user = new User(req.body,ipfsResultVal);
        const response = await user.personal_info();
        return res.json(response);
        
    },

    authorPortfolio_nft: async (req,res) => { 
    //DB
      const user = new User(req.body.LoginId);
      const response = await user.author_portfolio_nft();
      return res.json(response);
    },
    mintAT: async (req,res) => { 

        const artId = req.body.artId; // 해당 작품 ID
        const pk = req.body.pk; // 사용자 입력 비밀키

        // 해당 작품 DB 조회
        const query = "SELECT * FROM NFT.art WHERE art_id = ?;";
        await db.query(query, [artId],  async (err,data) => {
            if(err) {
                console.error("query error" + err);
                res.status(500).send("Internal Sever Error");
            } else {
                // NFT 발행 요청
                var response = await mintAT_data(data[0],pk);
                if(response.success) {
                    //NFT 발행 완료시 토큰 여부 저장
                    const query1 = 'update NFT.art set isNFT = 1 where art_id = ?;';
                    db.query(query1, [artId],  async (err) => {
                        if(err){
                            console.error("query error" + err);
                            res.status(500).send("Internal Sever Error");
                        }
                        else {
                            return res.json(response);
                        }
                    })
                } else {
                    return res.json(response);
                }
            }
        });
        
    },
    recordRegister: async (req,res) => {
        const body = req.body;

        //DB
        const user = new User(body);
        const response = await user.record_register();
        return res.json(response);
    },
    NFT: async (req,res) => {
        const response = await generate_NFT_info(req.body.metaAccount);
        return res.json(response);
    },
    author : async (req,res) => { 

        // 파일 ipfs 등록 및 CID, ipfsLink 반환
        var data = new Buffer(fs.readFileSync(req.file.path));

        //IPFS
        var ipfsVal = await ipfs.add(data);

        //ipfs link generate
        var url = 'https://infura-ipfs.io/ipfs/';
        url += (ipfsVal[0].hash);
        url += '?filename=';
        url += (req.file.originalname);
        var ipfsUrl =  encodeURI(url);
        

        //넘겨줄 ipfs값들(url,cid)
        var ipfsResultVal = {
            ipfsCid: ipfsVal[0].hash,
            ipfsUrl: ipfsUrl
        }

      //DB
        const user = new User(req.body,ipfsResultVal);
        const response = await user.author();
        return res.json(response);
        
    },
    mintATBtn : async (req,res) => { 

        //현재 네트워크의 gasPrice 가져오기
        var gasPrice = await web3.eth.getGasPrice(function(error, result) {  
            return result;
        });
        
        //예상 수수료 계산
        var gasPrice1 = parseInt(gasPrice);
        var gasLimit1 = parseInt(316892); //해당 트랜잭션에 대한 gasLimit(고정: 데이터 용량 일정)
        var txnFee = gasLimit1 * gasPrice1;
        var txnFee1 = web3.utils.fromWei(txnFee.toString(),'ether');

        //수수료 ETH -> $
        const etherPrice = await ethPrice('usd');
        var testString = etherPrice.toString();	
        var regex = /[^0-9]/g;				
        var result = testString.replace(regex, "");
        var result1 = Number(result.substring(0,4));

        var txnFee2 = Number(txnFee1);
        var txnFee_usd = result1 * txnFee2; 
        var txnFee_usd1 = txnFee_usd.toFixed(2);

        // 예상 수수료 Return
        var response = {txnFee : txnFee1, txnFee_USD : txnFee_usd1};
        return res.json(response);
        

    }

};

// 좋아요 DB 적용 함수
function like_count(likeId) {
    if(likeId == undefined) {
    } else {
        const like_query = "UPDATE NFT.art SET art.like = art.like+1 where art_id=?;"
        db.query(like_query,[likeId],(err,rows)=> {
            if(err){
               console.error("query error" + err);
               res.status(500).send("Internal Sever Error");
            }
        })
    }
}

//정렬 쿼리문 정의 함수
function art_sorting(major_select,art_select) {

         //정렬
         var query="SELECT art.*, login_designer.* FROM art LEFT JOIN login_designer ON art.author_id = login_designer.userId ";
         var query1="";
         var query2="";
 
         //정렬에 따라 sql문 정의
         if(art_select === "가장 많이 본 작품"){
             query2 = "ORDER BY art.view_count DESC;";
         } else if(art_select === "인기있는 작품") {
             query2 = "ORDER BY art.like DESC;";
         } else if(art_select === "최근 작품") {
             query2 = "ORDER BY date_1 DESC;";
         }  else if(art_select === "NFT 작품") {
            query2 = "AND art.isNFT = 1;";
        } else {
             query2 = "ORDER BY art.art_id DESC;";
         }
 
         if(major_select === "커뮤니케이션디자인전공") {
             query1="where login_designer.major = '커뮤니케이션디자인전공' ";
         } else if(major_select === "텍스타일디자인전공") {
             query1="where login_designer.major = '텍스타일디자인전공' ";
         } else if(major_select === "세라믹디자인전공") {
             query1="where login_designer.major = '세라믹디자인전공' ";
         } else if(major_select === "AR·VR미디어디자인전공") {
             query1="where login_designer.major = 'AR·VR미디어디자인전공' ";
         } else if(major_select === "패션디자인전공") {
             query1="where login_designer.major = '패션디자인전공' ";
         } else if(major_select === "인더스트리얼디자인전공") {
             query1="where login_designer.major = '인더스트리얼디자인전공' ";
         } else if(major_select === "영화영상전공") {
             query1="where login_designer.major = '영화영상전공' ";
         } else if(major_select === "연극전공") {
             query1="where login_designer.major = '연극전공' ";
         } else if(major_select === "무대미술전공") {
             query1="where login_designer.major = '무대미술전공' ";
         } else if(major_select === "사진영상미디어전공") {
             query1="where login_designer.major = '사진영상미디어전공' ";
         } else if(major_select === "디지털만화영상전공") {
             query1="where login_designer.major = '디지털만화영상전공' ";
         } else if(major_select === "문화예술경영전공") {
             query1="where login_designer.major = '문화예술경영전공' ";
         } else if(major_select === "디지털콘텐츠전공") {
             query1="where login_designer.major = '디지털콘텐츠전공' ";
         } else { //전공 전체일때
            if(art_select === "NFT 작품") {
                query2 = "where art.isNFT = 1;";
            }
         }
 
         //SQL문 완성
         query += query1;
         query += query2;
         return query;
}

function view_count(art_id, res) {
    const view_query = "UPDATE NFT.art SET view_count = view_count +1 where art_id=?;"
        db.query(view_query,[art_id],(err,rows)=> {
            if(err){
               console.error("query error" + err);
               res.status(500).send("Internal Sever Error");
            }
        })
}

//유효성 검사
async function mintAT_data(data,privateKey) {
    var artName = data.art_name;
    var author = data.author_id;
    var CID = data.ipfs_cid;
    var Link = data.ipfs_link;
    var Date = data.date_1;
    var privateKey = privateKey;

    var res = await mintAT_NFT(artName,author,CID,Date,Link,privateKey);
    return res;
}

async function mintAT_NFT(ArtName,Author,CID,Date,Link,privateKey) {

    var result = await isTokenAlreadyCreated(CID);
    if(result){
        //이미 발행된 토큰
        return { success: false, msg:"이미 발행된 토큰입니다."};
    }else {
        
        //발행 계정 정보 address, privateKey, signTransaction, sign, encrypt
        var Account_info;
        try{
            Account_info = await web3.eth.accounts.privateKeyToAccount(privateKey);
        } catch {
            return { success: false, msg:"유효하지 않은 계정입니다."};
        }
        
        //SignTX를 위한 Buffer형태로 변환
        const privateKey_B = Buffer.from(privateKey,'hex');

        //트랜잭션 서명 전에 해당 계정의 잔고가 얼마있는지 조회
        var balance = await web3.eth.getBalance(Account_info.address);
        

        //현재 네트워크의 gasPrice 가져오기
        var gasPrice = await web3.eth.getGasPrice(function(error, result) {  
            return result;
        });
        console.log('gasprice : '+ gasPrice);
        
        
        
        if(parseInt(balance) < parseInt(gasPrice)) { 
            return { success: false, msg:"계정 잔고 부족"};
        } else {
            //컨트랙에서 넌스값 구하기
            const accountNonce = '0x' + (await web3.eth.getTransactionCount(Account_info.address)).toString(16); 
        
            //GAS비 절약을 위한 해쉬화
             const metaData = getERC721MetadataSchema(CID,ArtName,Link);
            //ipfs에 파일 업로드 후 해쉬 값을 저장 -> 해쉬 값을 통해 용량 및 가스비 절감
            var res = await ipfs.add(Buffer.from(JSON.stringify(metaData))); 

            //트랜잭션 서명 및 보내기    
            const rawTx =
            {
                nonce: accountNonce,
                from: Account_info.address,
                to: DEPLOYED_ADDRESS, 
                gasPrice: web3.utils.toHex(gasPrice),
                gasLimit: 500000, // 해당 트랜잭션에 대한 gaslimit 316892
                value: '0x0',
                // 컨트랙 함수 실행
                data: atContract.methods.mintAT(Account_info.address,CID,ArtName, 
                    Author, Date, "https://infura-ipfs.io/ipfs/"+res[0].hash).encodeABI()
            };
            
            // 블록체인 네트워크 지정
            const tx = new Tx(rawTx, { 'chain': 'ropsten' });
            tx.sign(privateKey_B);
            
            var serializedTx = '0x' + tx.serialize().toString('hex');

            var txHash;

            try {
                // 서명 및 전송
                await web3.eth.sendSignedTransaction(serializedTx.toString('hex'), function (err, hash) {
                    txHash = hash;
                }).on('receipt', console.log);
                return { success: true, msg: txHash};
            } catch {
                return { success: false, msg: 'NFT 발행 실패'};
            }
            
        }
    }

    



}

function getERC721MetadataSchema(CID,ArtName,Link) {
    return {
      "title": "AT Metadata",
      "type": "object",
      "properties": {
          "name": {
              "type": "string",
              "description": CID
          },
          "description": {
              "type": "string",
              "description": ArtName
          },
          "image": {
              "type": "string",
              "description": Link
          }
      }
    }
  }



async function generate_NFT_info(address) {

    //현재 계정의 토큰 개수 리턴
    var balance = parseInt(await getBalanceOf(address));
    var index_array = Array.from(Array(balance).keys());

    //토큰 정보 저장
    var token_infos_array = [];

    if (balance === 0) {
      return {TokenNum: balance};
    } else {
      
      for await (let index of index_array) {
        var token_infos = {};
         // 토큰 정보 저장
         var tokenId = await getTokenOfOwnerByIndex(address, index); // 토큰 ID 반환
         var tokenUri = await getTokenUri(tokenId); // 토큰 URI 반환
         var at = await getAT(tokenId); // 토큰 정보(작가, 발행일, 작품명) 반환 from ArtToken.sol
         var metadata = await getMetadata(tokenUri); // metadata 반환
         token_infos.ArtName = metadata.properties.description.description;
         token_infos.ArtLink = metadata.properties.image.description;
         token_infos_array.push({token_infos});
      }
    }
    return {TokenNum: balance, token_info: token_infos_array};
}

//토큰이 이미 발행되었는지 여부 확인
async function isTokenAlreadyCreated(CID) {
    return await atContract.methods.isTokenAlreadyCreated(CID).call(); //from ArtToken.sol
}

//계정 보유 토큰 수 확인
async function getBalanceOf(address) {
    return await atContract.methods.balanceOf(address).call(); //from ERC721
}

//해당 토큰의 ID 반환
async function getTokenOfOwnerByIndex (address, index) {
    return await atContract.methods.tokenOfOwnerByIndex(address, index).call(); //from ERC721Enumerable.sol
}

//IPFS LINK 반환(JSON)
async function getTokenUri (tokenId) {
    return await atContract.methods.tokenURI(tokenId).call(); // from ERC721Metadata.sol
}

// 작성자, 발행일, link등 정보 반환
async function getAT (tokenId) {
    return await atContract.methods.getAT(tokenId).call(); // from ArtToken.sol
}

//IPFS_link로 json 파일 가져옴
async function getMetadata (tokenUri) {
    let options = {json: true};

    return new Promise((resolve) => {
        request_req(tokenUri, options, async (error, res, body)  => {
            if (error) {
                resolve(error);
            };
        
            if (!error && res.statusCode == 200) {
                resolve(body);
            };
        });
    })
}











module.exports = {
    output,
    process,
};