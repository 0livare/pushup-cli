const {cosmiconfigSync} = require('cosmiconfig')
const {getCwd, resolveHomePath} = require('./util')

const defaultOptions = {
  ticketPrefix: '',
  gitRemote: 'origin',
  format: 'TICKET-BRANCH',
  ticketUrl: '',
  initials: '',
}

/**
 * Determine the correct config by combining commander options,
 * the applicable config file, and the defaults.
 */
async function getConfig(cliOptions, commander) {
  // Commander.args contains positional arguments and
  // any unknown options because they're not interpreted
  // as options
  const unknownOptions = commander?.args.filter(arg => arg.startsWith('-'))

  const cosmicConfigSearchResult = cosmiconfigSync('pushup').search()
  if (!cosmicConfigSearchResult) return {...defaultOptions, unknownOptions}

  const {config} = cosmicConfigSearchResult

  // Resolve "~" in paths for all projects
  const projects = Object.entries(config?.projects ?? {}).reduce(
    (accum, [projectPath, config]) => {
      accum[resolveHomePath(projectPath)] = config
      return accum
    },
    {},
  )

  const cwd = await getCwd()
  const currentProjectPath = Object.keys(projects).find(projectPath =>
    cwd.includes(projectPath),
  )

  return {
    ...defaultOptions,
    ...(config ?? {}),
    ...(projects[currentProjectPath] ?? {}),
    ...cliOptions,
    ticketId: cliOptions.ticket,
    unknownOptions,
  }
}

module.exports = {getConfig, defaultOptions}
