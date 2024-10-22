import chalk from 'chalk'

function log (...args: any) {
  console.log(chalk.cyan('[tiny]', ...args))
}

log.error = (...args: any) => {
  console.log(chalk.red('[tiny]', ...args))
}

log.warn = (...args: any) => {
  console.log(chalk.yellow('[tiny]', ...args))
}

export default log