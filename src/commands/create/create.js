const createGitArgs = require('./create-git-args')
const {executeGitCommand} = require('../../util')
const {getConfig} = require('../../config')
const deleteCommand = require('../delete')

async function create(ticketIdArg, options, commander) {
  // Oop - we're not actually creating a branch here, we're deleting one.
  // This is useful when the user runs `pushup` without a command, which
  // receives `create` as the default command.
  if (options.delete) {
    deleteCommand(ticketIdArg, options, commander)
    return
  }

  const {
    ticketId: ticketIdOption,
    format,
    ticketPrefix,
    gitRemote,
    unknownOptions,
  } = await getConfig(options, commander)

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
