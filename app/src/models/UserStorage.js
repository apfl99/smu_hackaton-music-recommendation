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


}  


module.exports = UserStorage;