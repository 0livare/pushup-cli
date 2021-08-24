/**
 * Search through a branch name for possible ticket numbers.
 * If the passed prefix can be found, only ticket numbers including
 * that prefix will be returned.  If no instance of the prefix was found,
 * any number will be considered a possible ticket number and returned.
 * @returns {string[]} An array of strings of the possible ticket
 * matches or null if no possible matches were found
 */
function parseTicketsFromBranch({ticketPrefix, branch}) {
  if (!branch) return []

  const ticketsWithPrefixes = branch.match(
    new RegExp(`(${ticketPrefix}\\d+)`, 'g'),
  )

  if (ticketsWithPrefixes) return ticketsWithPrefixes

  const ticketsWithLoneNumbers = branch.match(/\d+/g)
  return ticketsWithLoneNumbers ? ticketsWithLoneNumbers : []
}

module.exports = parseTicketsFromBranch
