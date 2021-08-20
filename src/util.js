const emoji = require('node-emoji')

function error(string) {
  const x = emoji.get('x')
  console.log(`${x} ${string}\n`)
  process.exit(1)
}

function warn(string) {
  console.log(`${emoji.get('warning')} ${string}\n`)
}

module.exports = {error, warn}
