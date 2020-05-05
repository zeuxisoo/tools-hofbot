const chalk = require("chalk");

function header(text) {
    return chalk`{black.bgWhite ${text}}\n--------`;
}

module.exports = {
    header: header
}
