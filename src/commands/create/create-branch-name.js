const execa = require('execa')
const {warn} = require('../../util')

async function createBranchName({ticketId, format, ticketPrefix}) {
  const ticketIdContainsPrefix = ticketId && ticketId.match(/^[a-zA-Z]/)
  if (!ticketIdContainsPrefix && !ticketPrefix) {
    warn('No ticket prefix was found, only the ticket ID will be used')
  }

  const ticketNumber = ticketIdContainsPrefix
    ? ticketId
    : ticketPrefix && ticketId
    ? `${ticketPrefix}${ticketId}`
    : ticketId
    ? ticketId
    : ''

  const {stdout: localBranchName} = await execa('git', [
    'branch',
    '--show-current',
  ])

  let remoteBranchName = format
    .replace('TICKET', ticketNumber || '')
    .replace('BRANCH', localBranchName || '')

  // In the case when the format expects information that has not been
  // provided(e.g. a ticket number), the branch name could end up with
  // a straggling dividing character at the beginning or end which
  // would always be undesirable.
  //
  // These conditionals strip off those extra characters if they exist.
  const branchStartsWithDivider = remoteBranchName.match(/^[^a-zA-Z0-9]/)
  const branchEndsWithDivider = remoteBranchName.match(/[^a-zA-Z0-9]$/)

  if (branchStartsWithDivider) {
    remoteBranchName = remoteBranchName.slice(1)
  }
  if (branchEndsWithDivider) {
    remoteBranchName = remoteBranchName.slice(0, -1)
  }

  return remoteBranchName
}

module.exports = createBranchName
