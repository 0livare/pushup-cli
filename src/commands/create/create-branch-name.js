const chalk = require('chalk')
const {getCurrentBranchName, ticketIdPrefixToNumber} = require('../../util')

async function createBranchName(config) {
  const {ticketId, format, ticketPrefix, initials} = config

  const ticketNumber = ticketIdPrefixToNumber({ticketId, ticketPrefix})
  const localBranchName = await getCurrentBranchName()

  if (format.includes('TICKET') && !ticketNumber) {
    console.log(
      chalk.yellow(
        'warn: Format requires ticket number but one was not provided',
      ),
    )
  }
  if (format.includes('INITIALS') && !initials) {
    console.log(
      chalk.yellow('warn: Format requires initials but none were provided'),
    )
  }

  let branch = format
  branch = replacePlaceholder(branch, 'TICKET', ticketNumber)
  branch = replacePlaceholder(branch, 'BRANCH', localBranchName)
  branch = replacePlaceholder(branch, 'INITIALS', initials)

  return branch
}

function replacePlaceholder(branchName, placeholder, value) {
  const nonAlphaNumeric = '[^a-zA-Z0-9]+'

  return (
    branchName
      // Fill in the placeholder
      // If the value for this placeholder has not been provided, then
      // also remove any dividing (non alpha-numeric) characters that
      // come after the placeholder to avoid a branch name with random
      // dashes or slashes due to missing information.
      .replace(
        new RegExp(`${placeholder}(${nonAlphaNumeric})?`),
        value ? value + '$1' : '',
      )
      // Remove any straggling dividers from the start
      .replace(new RegExp('^' + nonAlphaNumeric), '')
      // Remove any straggling dividers from the end
      .replace(new RegExp(nonAlphaNumeric + '$'), '')
  )
}

module.exports = createBranchName
