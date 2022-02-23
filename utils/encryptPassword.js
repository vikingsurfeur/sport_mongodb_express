const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encodeBase64 = require("crypto-js/enc-base64");

const encryptPassword = (password) => {
    const token = uid2(32);
    const salt = uid2(32);

    const hash = SHA256(`${password}${salt}`).toString(encodeBase64);

    return { token, salt, hash };
};

module.exports = encryptPassword;
