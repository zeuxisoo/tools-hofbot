const FormData = require("form-data");
const cheerio = require("cheerio");
const chalk = require("chalk");
const { client, settings, utils } = require("../common");
const loginAction = require("./login");
const {program} = require("commander");

// Parse response HTML content
function parseCharListInfo(loginHtml) {
    const $ = cheerio.load(loginHtml);

    let charList = [];

    $("#contents > table > tbody > tr > td").each(function(index, element) {
        const charLink = $(this).find("div > div > a").attr("href");
        const charText = $(this).find("div").text();

        const charId = charLink.match(/([0-9]+)/)[1];
        const [, name, level, job] = charText.match(/([a-zA-Z0-9]+)(?:\*?)Lv.([0-9]+)\s*(.*)/);

        charList.push({
            id   : charId,
            name : name,
            level: level,
            job  : job
        });
    });

    return charList;
}

// Parse response HTML content
async function fetchCharList() {
    const response = await client("index.php", {
        method: "get",
    });

    return response.body;
}

// Main action
async function main(command) {
    if (command.list) {
        settings.show();

        console.log(utils.header("Char List"));

        await loginAction();

        const charListHtml = await fetchCharList();
        const charListInfo = parseCharListInfo(charListHtml);

        charListInfo.forEach(function(char) {
            console.log(chalk`{blueBright [Char]} ID: ${char.id}, Name: ${char.name}, Level: ${char.level}, Job: ${char.job}`);
        });
    }else{
        console.log(program.help());
    }
}

module.exports = main;
