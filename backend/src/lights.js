const chalk = require('chalk');

exports.turnOnGreen = async () => {
  console.log(chalk.green('Green') + ' light is turned ' + chalk.green('ON'))
}

exports.turnOffGreen = async () => {
  console.log(chalk.green('Green') + ' light is turned ' + chalk.red('OFF'))
}

exports.turnOnRed = async () => {
  console.log(chalk.red('Red') + ' light is turned ' + chalk.green('ON'))
}

exports.turnOffRed = async () => {
  console.log(chalk.red('Red') + ' light is turned ' + chalk.red('OFF'))
}