const execa = require('execa')
const inquirer = require('inquirer')
const chalk = require('chalk')

const {determineTicketNumber, error} = require('../../util')
const createBranchName = require('../create/create-branch-name')

async function findBranchName({ticketId, format, ticketPrefix}) {
  const ticketNumber = determineTicketNumber({ticketId, ticketPrefix})
  const {stdout: branchOutput} = await execa('git', ['branch', '-r'])

  if (!ticketId) {
    // If no ticket ID has been provided, then we should
    // delete the same branch that would have been
    // created via the create command for the format
    // they have specified and the local branch they
    // have checked out.

    return createBranchName({ticketId, format, ticketPrefix})
  }

  // Git prints remote branch prefixed with the remote
  // e.g. origin/foobar
  const remoteBranches = branchOutput
    .split('\n')
    .map(remoteBranch => remoteBranch.substring(remoteBranch.indexOf('/') + 1))

  const exactMatch = remoteBranches.find(branch =>
    branch.includes(ticketNumber),
  )
  if (exactMatch) return exactMatch

  const partialMatches = remoteBranches.filter(branch =>
    branch.includes(ticketId),
  )

  // We couldn't find any branches
  if (!partialMatches.length) {
    error(`No branch matching ticket ${chalk.yellow(ticketId)} could be found`)
    return null
  }

  const quitOption = 'Actually, nevermind'
  const {chosenBranch} = await inquirer.prompt([
    {
      name: 'chosenBranch',
      type: 'list',
      message: `An exact match for ticket ${chalk.yellow(
        ticketNumber,
      )} couldn't be found.\n  Please choose which branch you would like to delete.\n`,
      choices: [...partialMatches, quitOption],
    },
  ])

  return chosenBranch === quitOption ? null : chosenBranch
}

module.exports = findBranchName