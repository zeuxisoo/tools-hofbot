const FormData = require("form-data");
const cheerio = require("cheerio");
const chalk = require("chalk");
const { client, settings, utils } = require("../common");
const loginAction = require("./login");

// Parse response HTML content
function parseTimeTreeInfo(timeTreeHtml) {
    const $ = cheerio.load(timeTreeHtml);

    const status = $("#status").text();

    const [,users] = status.match(/農戶:\s([a-zA-Z0-9,\s]+)*\[澆水\]/);

    return users.split(", ");
}

// Parse response HTML content
async function wateringTimeTree() {
    const response = await client("index.php?menu=timeTree&sk=water", {
        method: "post",
    });

    return response.body;
}

// Main action
async function main() {
    settings.show();

    console.log(utils.header("Time tree List"));

    await loginAction();

    const timeTreeHtml = await wateringTimeTree();
    const timeTreeInfo = parseTimeTreeInfo(timeTreeHtml);

    timeTreeInfo.forEach(function(char) {
        console.log(chalk`{blueBright [TimeTree]} Id: ${char}`);
    });
}

module.exports = main;
