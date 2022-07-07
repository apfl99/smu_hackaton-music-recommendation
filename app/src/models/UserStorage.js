"use strict";

const db = require("../config/db");

class UserStorage {
    static getUserInfo(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM User WHERE user_id = ?;";
            db.query(query, [id], (err,data) => {
                if(err) reject(`${err}`);
                resolve(data[0]);
            });
        });
    };


    static async save(userInfo) {
        return new Promise((resolve, reject) => {
            console.log("UserStorage - register");
            const query = "INSERT INTO User(user_id,user_password,user_name,user_email,user_number) VALUES(?, ?, ?, ?, ?);";
            db.query(query, [userInfo.id,userInfo.passwd,userInfo.username,userInfo.email,userInfo.number], (err) => {
                if(err) reject(`${err}`);
                resolve({success: true});
            });
        });
    };


}  


module.exports = UserStorage;