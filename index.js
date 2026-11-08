const app = require('./app')
const config = require('./utils/config') //use .env file
const logger = require('./utils/logger')

// port creation

app.listen(config.PORT, () => { //listen to requests
  logger.info(`Server running on port ${config.PORT}`)
})