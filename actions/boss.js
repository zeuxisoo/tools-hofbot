const FormData = require("form-data");
const cheerio = require("cheerio");
const chalk = require("chalk");
const { client, settings, utils } = require("../common");
const loginAction = require("./login");
const {program} = require("commander");

// Parse response HTML content
function parseBossListInfo(bossListHtml) {
    const $ = cheerio.load(bossListHtml);

    let monsterList = [];

    $("#contents > table > tbody > tr td .carpet_frame").each(function(index, element) {
        const bossLink       = $(this).find(".land a").attr("href");
        const bossName       = $(this).find(".bold.dmg").text();
        const bossLimitLevel = $(this).text();

        const bossId    = bossLink.match(/\?union=(.*)$/)[1];
        const bossLevel = bossLimitLevel.match(/([0-9]+)/)[1];

        monsterList.push({
            id   : bossId,
            name : bossName,
            level: bossLevel,
        });
    });

    return monsterList;
}

// Parse response HTML content
async function fetchBossList() {
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
        settings.show();

        console.log(utils.header("Boss List"));

        await loginAction();

        const bossListHtml = await fetchBossList();
        const bossListInfo = parseBossListInfo(bossListHtml);

        bossListInfo.forEach(function(char) {
            console.log(chalk`{blueBright [Boss]} ID: ${char.id}, Name: ${char.name}, Level: ${char.level}`);
        });
    }else{
        console.log(program.help());
    }
}

module.exports = main;
