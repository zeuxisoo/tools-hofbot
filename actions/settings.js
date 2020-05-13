const { settings } = require("../common");
const {program} = require("commander");

// Main action
async function main(command) {
    settings.show();
}

module.exports = main;
