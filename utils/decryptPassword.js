const SHA256 = require("crypto-js/sha256");
const encodeBase64 = require("crypto-js/enc-base64");

const decryptPassword = ({ salt, hash, token }, password) => {
    const toCompareHash = SHA256(`${password}${salt}`).toString(encodeBase64);

    if (toCompareHash === hash) {
        return { token };
    }

    return "Invalid Password";
};

module.exports = decryptPassword;
