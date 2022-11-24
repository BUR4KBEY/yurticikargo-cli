import chalk from 'chalk';
import MESSAGES from './messages.js';

export function logMessage(header, message) {
    console.log(`${chalk.blueBright.bold(header)} ${chalk.green(message)}`);
}

export function logError(error) {
    const header = chalk.red.bold(MESSAGES.ERROR);
    const getMessage = message => chalk.yellow(message);

    if (error instanceof Error) {
        console.log(`${header} ${getMessage(error.message)}`);
    } else if (typeof error === 'string') {
        console.log(`${header} ${getMessage(error)}`);
    } else {
        console.log(`${header} ${getMessage('An error occurred.')}`);
        console.log(error);
    }
}
