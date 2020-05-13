const FormData = require("form-data");
const cheerio = require("cheerio");
const chalk = require("chalk");
const { client, settings, utils } = require("../common");
const loginAction = require("./login");
const {program} = require("commander");

// Parse response HTML content
function parseMonsterListInfo(monsterListHtml) {
    const $ = cheerio.load(monsterListHtml);

    let monsterList = [];

    $("#contents > div:nth-child(1) > div p a").each(function(index, element) {
        const monsterLink = $(this).attr("href");
        const monsterName = $(this).text();

        const monsterId = monsterLink.match(/\?common=(.*)$/)[1];

        monsterList.push({
            id  : monsterId,
            name: monsterName,
        });
    });

    return monsterList;
}

// Parse response HTML content
async function fetchMonsterList() {
    const response = await client("index.php?hunt", {
        method: "get",
        hooks : {
            beforeRequest: [
                options => {
                    // tricks code to fix the query string normalized `hunt=` to `hunt`
                    // - https://stackoverflow.com/a/4557763
                    options.url.search = options.url.search.replace(/=$/, "");
                }
            ]
        }
    });

    return response.body;
}

// Main action
async function main(command) {
    if (command.list) {
        console.log(utils.header("Monster List"));

        await loginAction();

        const monsterListHtml = await fetchMonsterList();
        const monsterListInfo = parseMonsterListInfo(monsterListHtml);

        monsterListInfo.forEach(function(char) {
            console.log(chalk`{blueBright [Monster]} ID: ${char.id}, Name: ${char.name}`);
        });
    }else{
        console.log(program.help());
    }
}

module.exports = main;
