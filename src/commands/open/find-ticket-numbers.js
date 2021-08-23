const {
  getCurrentRemoteTrackingBranch,
  ticketIdPrefixToNumber,
} = require('../../util')
const parseTicketsFromBranch = require('./parse-tickets-from-branch')

/**
 * Search through the CLI options and the name of the remote tracking
 * branch of the currently checked out git branch to try and find a
 * ticket number with the given prefix.
 * @returns {string[]} Any ticket numbers that could be located
 * from a given source.  Only ticket numbers from a single source
 * (the CLI inputs or the branch name) will be returned, and
 * preference is given to ticket numbers from any source that
 * include the passed ticket prefix.
 */
async function findTicketNumbers({ticketId, ticketPrefix}) {
  const ticketNumberFromInputs = ticketIdPrefixToNumber({
    ticketId,
    ticketPrefix,
  })
  const ticketNumbersFromBranch = parseTicketsFromBranch({
    ticketPrefix,
    branch: await getCurrentRemoteTrackingBranch(),
  })

  if (ticketPrefix) {
    // The presence of a ticket prefix option indicates that the
    // URL must have a ticket prefix
    return ticketNumberFromInputs.includes(ticketPrefix)
      ? [ticketNumberFromInputs]
      : ticketNumbersFromBranch.some(ticket => ticket.includes(ticketPrefix))
      ? ticketNumbersFromBranch
      : null
  }

  return ticketNumberFromInputs
    ? [ticketNumberFromInputs]
    : ticketNumbersFromBranch
}

module.exports = findTicketNumbers
