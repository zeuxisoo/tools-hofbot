const { program } = require("commander");
const { attackAction } = require("./actions");

program
    .version("0.1.0", "-v, --version", "show the version number");

program
    .command("attack")
    .action(attackAction);

program.parse()
