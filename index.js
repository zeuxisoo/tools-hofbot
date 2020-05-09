const chalk = require("chalk");
const { program } = require("commander");
const { attackAction, charAction, monsterAction, bossAction } = require("./actions");

// Define command
program
    .version("0.1.0", "-v, --version", "show the version number");

program
    .command("attack")
    .description("start the auto attack action")
    .option("-t, --type <type>", "attack type (monster/boss)", "monster")
    .action(attackAction);

program
    .command("char")
    .description("show the char list")
    .option("-l, --list", "show the char list", false)
    .action(charAction);

program
    .command("monster")
    .description("show the monster list")
    .option("-l, --list", "show the monster list", false)
    .action(monsterAction);

    program
    .command("boss")
    .description("show the bss list")
    .option("-l, --list", "show the bss list", false)
    .action(bossAction);

program.parse();
