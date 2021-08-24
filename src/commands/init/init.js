const path = require('path')
const fs = require('fs')
const os = require('os')
const {cosmiconfigSync} = require('cosmiconfig')
const inquirer = require('inquirer')
const chalk = require('chalk')
const execa = require('execa')
const emoji = require('node-emoji')
const {error} = require('../../util')

const textEntryPoint = chalk.blue('--> ')

async function init(options) {
  await checkForExistingConfig()

  const {stdout: gitRemotesRaw} = await execa('git', ['remote'])
  const gitRemotes = gitRemotesRaw.split('\n')
  const {stdout: cwd} = await execa('pwd')

  const {fileLocation, format, ticketPrefix, gitRemote, ticketUrl} =
    await promptUser({
      gitRemotes,
      cwd,
      options,
    })

  const finalConfigValues = {
    format: options.format || format,
    ticketPrefix: options.ticketPrefix || ticketPrefix,
    gitRemote: options.gitRemote || gitRemote,
    ticketUrl: options.ticketUrl || ticketUrl,
  }

  // Remove any undefined values from config
  Object.entries(finalConfigValues).forEach(([key, value]) => {
    if (!value) delete finalConfigValues[key]
  })

  if (!Object.keys(finalConfigValues).length) {
    error('No valid config values were supplied, not creating a config')
    process.exit(0)
  }

  const configFilePath = path.resolve(fileLocation, '.pushuprc.json')
  fs.writeFileSync(configFilePath, JSON.stringify(finalConfigValues, null, 2))

  console.log(
    emoji.get('white_check_mark') +
      ' ' +
      chalk.green(`Successfully wrote ${configFilePath}`),
  )
}

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

async function promptUser({gitRemotes, cwd, options}) {
  // prettier-ignore
  return await inquirer.prompt([
    {
      name: 'fileLocation',
      type: 'list',
      message: `Where do you want to put your config file?`,
      choices: [
        {name: `This directory (${cwd})`, value: cwd},
        {name: 'Your home directory', value: os.homedir()}
      ],
    },
    {
      name: 'format',
      type: 'input',
      message: [
        `What do you want the format of your remote branches to be?`,
        chalk.gray('  Use TICKET as a placeholder for your ticket number (optional)'),
        chalk.gray('  Use BRANCH as a placeholder for your local branch name (optional)'),
        textEntryPoint,
      ].join('\n'),
      when: !options.format,
    },
    {
      name: 'ticketPrefix',
      type: 'input',
      message: [
        'What is the prefix on your ticket numbers?', 
        chalk.gray('  Be sure to include a dash or other divider if it exists'), 
        textEntryPoint,
      ].join('\n'),
      when(answers) {
        if (options.ticketPrefix) return false

        const {format} = answers
        return format.includes('TICKET')
      },
    },
    {
      name: 'gitRemote',
      type: 'list',
      message: 'Which git remote should branches be pushed to by default?',
      choices: gitRemotes,
      when: gitRemotes.length > 1 && !options.gitRemote,
    },
    {
      name: 'ticketUrl',
      type: 'input',
      message: [
        `What is the URL of a ticket in your ticketing system?`,
        chalk.gray('  Use TICKET as a placeholder for the ticket number'),
        textEntryPoint,
      ].join('\n'),
      when: !options.ticketUrl,
      validate(enteredTicketUrl) {
        if (enteredTicketUrl && !enteredTicketUrl.includes('TICKET')) {
          return 'Your ticket URL must include "TICKET" as a placeholder for the ticket number'
        }
        if (enteredTicketUrl && !enteredTicketUrl.startsWith('http://')) {
          return 'Your ticket URL must start with "http://"'
        }

        return true
      }
    },
  ])
}

module.exports = init
