const {cosmiconfigSync} = require('cosmiconfig')
const createGitArgs = require('./create-git-args')

const {executeGitCommand} = require('../../util')

const defaultConfig = {
  ticketPrefix: '',
  divider: '-',
  gitRemote: 'origin',
  format: 'TICKET-BRANCH',
}

async function create(ticketId, options, commander) {
  const explorer = cosmiconfigSync('pushup')
  let {config} = explorer.search()

  config = {
    ...defaultConfig,
    ...config,
  }

  ticketId = options.ticket ?? ticketId
  const format = options.format ?? config.format
  const ticketPrefix = options.ticketPrefix ?? config.ticketPrefix
  const gitRemote = options.gitRemote ?? config.gitRemote

  // Commander.args contains positional arguments and
  // any unknown options because they're not interpreted
  // as options
  const unknownOptions = commander.args.filter(arg => arg.startsWith('-'))

  const gitArgs = createGitArgs({ticketId, format, ticketPrefix, gitRemote})
  await executeGitCommand([...gitArgs, ...unknownOptions])
}

module.exports = create
