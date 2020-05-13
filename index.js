const { program } = require("commander");
const {
    attackAction,
    charAction, monsterAction, bossAction,
    timeTreeAction,
    settingsAction
} = require("./actions");

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
    .description("make the char action")
    .option("-l, --list", "show the char list", false)
    .action(charAction);

program
    .command("monster")
    .description("make the monster action")
    .option("-l, --list", "show the monster list", false)
    .action(monsterAction);

program
    .command("boss")
    .description("make the bss action")
    .option("-l, --list", "show the bss list", false)
    .action(bossAction);

program
    .command("timetree")
    .description("watering time tree")
    .action(timeTreeAction)

program
    .command("settings")
    .description("show the settings")
    .action(settingsAction)

program.parse();
