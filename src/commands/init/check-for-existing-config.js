const {cosmiconfigSync} = require('cosmiconfig')
const inquirer = require('inquirer')
const chalk = require('chalk')
const {textEntryPoint} = require('./propt-user')

async function checkForExistingConfig() {
  const cosmicConfig = cosmiconfigSync('pushup')
  const cosmicSearchResults = cosmicConfig.search()

  if (!cosmicSearchResults) return

  const configLocation = chalk.gray(cosmicSearchResults.filepath)
  const {createNewFile} = await inquirer.prompt([
    {
      name: 'createNewFile',
      type: 'confirm',
      message: [
        `A config file already exists, do you wish to continue?`,
        '  ' + configLocation,
        textEntryPoint,
      ].join('\n'),
    },
  ])

  if (!createNewFile) process.exit(0)
}

module.exports = checkForExistingConfig
