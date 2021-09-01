const os = require('os')
const {cosmiconfigSync} = require('cosmiconfig')
const chalk = require('chalk')
const {resolveHomePath} = require('./util')

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

  const cosmicExplorer = cosmiconfigSync('pushup')
  const cosmicConfigSearchResult = cosmicExplorer.search()

  if (!cosmicConfigSearchResult?.config) {
    console.log(chalk.gray(`No config found`))
    return {...defaultOptions, ticketId: cliOptions.ticket, unknownOptions}
  }

  console.log(
    chalk.gray(`Using config from ${cosmicConfigSearchResult.filepath}`),
  )

  const {projects, ...configFile} = cosmicConfigSearchResult.config

  // If a project specific config was found, also search for a config
  // in the home directory to fill in missing values (like initials)
  let homeConfig = {}
  if (cosmicConfigSearchResult.filepath !== os.homedir()) {
    const homeDirSearchResult = cosmicExplorer.search(os.homedir())
    homeConfig = homeDirSearchResult?.config

    if (homeConfig && Object.keys(homeConfig).length) {
      console.log(chalk.gray(`Also using config from home directory as backup`))
    }
  }

  // Resolve "~" in paths for all projects
  const resolvedProjects = Object.entries(projects ?? {}).reduce(
    (accum, [projectPath, config]) => {
      accum[resolveHomePath(projectPath)] = config
      return accum
    },
    {},
  )

  const currentProjectPath = Object.keys(resolvedProjects).find(projectPath =>
    process.cwd().includes(projectPath),
  )

  return {
    ...defaultOptions,
    ...homeConfig,
    ...(configFile ?? {}),
    ...(resolvedProjects[currentProjectPath] ?? {}),
    ...cliOptions,
    ticketId: cliOptions.ticket,
    unknownOptions,
  }
}

module.exports = {getConfig, defaultOptions}
