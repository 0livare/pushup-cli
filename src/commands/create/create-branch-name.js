const {getCurrentBranchName, ticketIdPrefixToNumber} = require('../../util')

async function createBranchName({ticketId, format, ticketPrefix}) {
  const ticketNumber = ticketIdPrefixToNumber({ticketId, ticketPrefix})
  const localBranchName = await getCurrentBranchName()

  let remoteBranchName = format
    .replace('TICKET', ticketNumber || '')
    .replace('BRANCH', localBranchName || '')

  // In the case when the format expects information that has not been
  // provided(e.g. a ticket number), the branch name could end up with
  // a straggling dividing character at the beginning or end which
  // would always be undesirable.
  //
  // These conditionals strip off those extra characters if they exist.
  remoteBranchName = remoteBranchName.replace(/^[^a-zA-Z0-9]+/, '')
  remoteBranchName = remoteBranchName.replace(/[^a-zA-Z0-9]+$/, '')
  return remoteBranchName
}

module.exports = createBranchName
