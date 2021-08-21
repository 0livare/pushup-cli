const createGitArgs = require('./create-git-args')
const {executeGitCommand} = require('../../util')
const {getConfig} = require('../../config')

async function create(ticketIdArg, options, commander) {
  const {
    ticketId: ticketIdOption,
    format,
    ticketPrefix,
    gitRemote,
    unknownOptions,
  } = getConfig(options, commander)

  const ticketId = ticketIdOption ?? ticketIdArg

  const gitArgs = await createGitArgs({
    ticketId,
    format,
    ticketPrefix,
    gitRemote,
  })
  await executeGitCommand([...gitArgs, ...unknownOptions])
}

module.exports = create
