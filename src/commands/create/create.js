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

  const config = await getConfig(options, commander)
  const {ticketId: ticketIdOption, unknownOptions} = config

  const gitArgs = await createGitArgs({
    ...config,
    ticketId: ticketIdOption ?? ticketIdArg,
  })
  await executeGitCommand([...gitArgs, ...unknownOptions])
}

module.exports = create
