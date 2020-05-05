const { program } = require("commander");
const { loginAction, attackAction } = require("./actions");

// Define command
program
    .version("0.1.0", "-v, --version", "show the version number");

program
    .command("attack")
    .action(attackAction);

// Login first before execute command
loginAction().then(() => program.parse());
