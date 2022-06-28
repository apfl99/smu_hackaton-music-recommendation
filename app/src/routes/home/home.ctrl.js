// 컨트롤러 모듈화
"use strict";

const User = require("../../models/User");

const fs = require('fs'); // js 파일 시스템 모듈을 사용하면 컴퓨터의 파일 시스템으로 작업할 수 있습니다. 

//multer 사용
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' }) //업로드

//DB
const db = require("../../config/db");
const { request } = require("http");


const request_req = require('request');
const { response } = require("express");

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









module.exports = {
    output,
    process,
};