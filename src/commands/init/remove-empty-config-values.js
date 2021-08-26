function removeEmptyConfigValues(configObj) {
  Object.entries(configObj).forEach(([key, value]) => {
    if (!value) delete configObj[key]
  })
}
module.exports = removeEmptyConfigValues
