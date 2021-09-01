const chalk = require('chalk')
const inquirer = require('inquirer')
const createGitArgs = require('./create-git-args')
const {executeGitCommand} = require('../../util')
const {getConfig} = require('../../config')

async function deleteBranch(ticketIdArg, options, commander) {
  const config = await getConfig(options, commander)
  const {ticketId: ticketIdOption, unknownOptions} = config

  const gitArgs = await createGitArgs({
    ...config,
    ticketId: ticketIdOption ?? ticketIdArg,
  })

  const {confirmation} = await inquirer.prompt([
    {
      name: 'confirmation',
      type: 'confirm',
      message: `Delete remote branch ${chalk.yellow(gitArgs[2].slice(1))}?\n`,
    },
  ])

  if (!confirmation) process.exit(0)

  await executeGitCommand([...gitArgs, ...unknownOptions])
}

module.exports = deleteBranch
