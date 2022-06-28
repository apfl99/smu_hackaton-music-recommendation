"use strict";

const db = require("../config/db");

class UserStorage {
    static getUserInfo(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM NFT.login_designer WHERE userId = ?;";
            db.query(query, [id], (err,data) => {
                if(err) reject(`${err}`);
                resolve(data[0]);
            });
        });
    };


    static async save(userInfo) {
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO NFT.login_designer(login_designer.userId,login_designer.username,login_designer.password,login_designer.major,login_designer.birth) VALUES(?, ?, ?, ?, ?);";
            db.query(query, [userInfo.email,userInfo.username,userInfo.passwd,userInfo.major,userInfo.birth], (err) => {
                if(err) reject(`${err}`);
                resolve({success: true});
            });
        });
    };

    static async art_save(artInfo,ipfsVal) {
        return new Promise((resolve, reject) => {
            const query2 = "INSERT INTO NFT.art(art.art_name, art.author_id, art.ipfs_link, art.art_explain, art.art_category, art.ipfs_cid) VALUES(?, ?, ?, ?, ?, ?);";
            db.query(query2, [artInfo.artName, artInfo.userId, ipfsVal.ipfsUrl, artInfo.artDescription, artInfo.artCategory, ipfsVal.ipfsCid], (err) => {
                if(err) reject(`${err}`);
                resolve({success: true});
            });
        });
    };


    static async art_save1(artInfo1,ipfsVal) {
        try {
            var query = "update NFT.login_designer set ";
            var query1;
            var query2;
            var query3;
            var query4;
            var query5 =  "where userId =" + "'"+  artInfo1.userId+"'" + ";";

            var num = 0;

            // 1.작가 프로필 사진 공백일때,
            if(ipfsVal.ipfsUrl == undefined ){
            query1 = ""; 
            } 
            else {
                query1= "login_designer.ipfs_link2 ="+"'"+ipfsVal.ipfsUrl+"'"+",";
                num++;
            }
    
            // 2. 작가 생년월일 공백일 때, 
            if(artInfo1.birth == ''){
            query2 = "";    
            }
            else {
                query2 = "login_designer.birth ="+"'"+artInfo1.birth+"'"+",";
                num++;
            }
    
            // 3. 작가 전공 공백일 때, 
            if(artInfo1.major == "전체"){
            query3 ="";
            }
            else{
                query3 = "login_designer.major ="+"'"+artInfo1.major+"'"+",";
                num++;
            } 
    
            // 4. 작가 하고 싶은 말 공백일 때, 
            if(artInfo1.comment == undefined){
            query4 ="";
            }
            else{
                query4 = "login_designer.comment ="+"'"+artInfo1.comment+"'"+" ";
            }
            
            
            if(',' )
            
                
            query += query1;
            query += query2;
            query += query3;
            query += query4;
            query += query5;
           // console.log(query);
            
            var count = 18;
            var id_len = artInfo1.userId.length;
            var sum = count + id_len;
            var index = query.length - sum

            const arr = [...query];
            
            arr[index] = ' ';
            var new_query = arr.join('');
          //  console.log(new_query);

        

            


        }catch (err){
            console.log(err);
        }
        
       //-----------------------------------f-------------------------------------------------------------------------------------------//
        //개인정보수정 아이디 넘기기 위해 수정한 코드 
        return new Promise((resolve, reject) => {
            db.query(new_query, (err) => {
                if(err) { 
                reject(`${err}`);
                resolve({success: true});
                } else{
                    const query = "SELECT NFT.login_designer.username FROM NFT.login_designer WHERE userId = ?;";
                    db.query(query,[artInfo1.userId], (err,data) => {
                        if(err){
                        reject(`${err}`);
                        } else {
                            resolve({success: true, data:data[0]});
                        }
                    })
                }

            });
        });
    };

    static authorPortfolio_nft(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM NFT.login_designer WHERE userId = ?;";
            db.query(query, [id], (err,data) => {
                if(err) reject(`${err}`);
                resolve(data[0]);
            });
        });
    };

    static async record_save(recordInfo) {
        return new Promise((resolve, reject) => {
            const query3 = "INSERT INTO NFT.author_record(author_record.author_id_r, author_record.record_host, author_record.record_subject, author_record.record_date, author_record.record_result) VALUES(?, ?, ?, ?, ?);";
            db.query(query3, [recordInfo.userId,recordInfo.host,recordInfo.subject,recordInfo.date_p,recordInfo.result], (err) => {
                if(err) reject(`${err}`);
                resolve({success: true});
            });
        });
    };

}  


module.exports = UserStorage;