const emoji = require('node-emoji')
const execa = require('execa')
const chalk = require('chalk')

function error(string) {
  const x = emoji.get('x')
  console.log(`${x} ${string}\n`)
  process.exit(1)
}

function warn(string) {
  console.log(`${emoji.get('warning')} ${string}\n`)
}

async function executeGitCommand(gitArgs) {
  try {
    console.log(chalk.gray(`$ git ${gitArgs.join(' ')}`))
    await execa('git', gitArgs, {stdio: 'inherit'})
  } catch (e) {
    // Do nothing here, git's error message will be displayed
  }
}

module.exports = {error, warn, executeGitCommand}
