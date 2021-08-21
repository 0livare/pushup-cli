const {cosmiconfigSync} = require('cosmiconfig')

const defaultConfig = {
  ticketPrefix: '',
  gitRemote: 'origin',
  format: 'TICKET-BRANCH',
}

/**
 * Determine the correct config by combining commander options,
 * the applicable config file, and the defaults.
 */
function getConfig(options, commander) {
  const explorer = cosmiconfigSync('pushup')
  let {config} = explorer.search()

  config = {
    ...defaultConfig,
    ...config,
  }

  const ticketId = options.ticket
  const format = options.format ?? config.format
  const ticketPrefix = options.ticketPrefix ?? config.ticketPrefix
  const gitRemote = options.gitRemote ?? config.gitRemote

  // Commander.args contains positional arguments and
  // any unknown options because they're not interpreted
  // as options
  const unknownOptions = commander.args.filter(arg => arg.startsWith('-'))

  return {ticketId, format, ticketPrefix, gitRemote, unknownOptions}
}

module.exports = {getConfig}
