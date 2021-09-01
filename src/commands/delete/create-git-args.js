const chalk = require('chalk')
const inquirer = require('inquirer')
const {error} = require('../../util')
const findBranchNames = require('./find-branch-names')

async function createGitArgs(config) {
  const remoteBranchNames = await findBranchNames(config)

  if (!remoteBranchNames.length) {
    let errorMsg = config.ticketId
      ? `No branch matching ticket ${chalk.yellow(
          config.ticketId,
        )} could be found`
      : 'No matching remote branch could be found, did you forget to supply a ticket?'

    error(errorMsg)
    process.exit(0)
  }

  if (remoteBranchNames.length > 1) {
    // We found multiple possible matches
    const quitOption = 'Actually, nevermind'
    const {chosenBranch} = await inquirer.prompt([
      {
        name: 'chosenBranch',
        type: 'list',
        message: `Which branch would you like to delete?\n`,
        choices: [...remoteBranchNames, quitOption],
      },
    ])

    if (chosenBranch === quitOption) {
      process.exit(0)
    }

    remoteBranchNames[0] = chosenBranch
  }

  return ['push', config.gitRemote, `:${remoteBranchNames[0]}`]
}

module.exports = createGitArgs
