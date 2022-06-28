"use strict"

const { response } = require("express");
const UserStorage = require("./UserStorage");

class User {
    constructor(body,ipfsResultVal) {
        this.body = body;
        this.ipfsVal = ipfsResultVal;
    }

    async login(req) {
        const body = this.body;

        try {
            const user = await UserStorage.getUserInfo(body.id);

            if (user) {
                if (user.userId == body.id && user.password == body.passwd) {
                    return { success: true };
                }
    
                return { success: false, msg: "비밀번호가 틀렸습니다." };
            }
    
            return { success: false, msg: "존재하지 않는 아이디입니다." };
        } catch (err) {
            return { success: false, err };
        }

    }

    async register() {
        try {
            const client = this.body;
            const response = await UserStorage.save(client);
            return response;
        } catch(err) {
            return { success: false, msg:"DB 에러"};
        }
    }
}
module.exports = User;  