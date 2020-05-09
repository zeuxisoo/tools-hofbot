const loginAction = require("./login");
const attackAction = require("./attack");
const charAction = require("./char");
const monsterAction = require("./monster");
const bossAction = require("./boss");

module.exports = {
    loginAction  : loginAction,
    attackAction : attackAction,
    charAction   : charAction,
    monsterAction: monsterAction,
    bossAction   : bossAction,
}
