const { mdLinks, statsLinks } = require('./mdLinks');
const chalk = require('chalk');


const path = process.argv[2];
const options = {
  validate: process.argv.includes('--validate'),
  stats: process.argv.includes('--stats'),
  validateStats: process.argv.includes('--validate') && process.argv.includes('--stats'),
};

mdLinks(path, options)
  .then((results) => {
    if (options.validateStats) {
      const linkStats = statsLinks(results);
      console.log(chalk.greenBright.bold('Total links:', chalk.bold(linkStats.total)));
      console.log(chalk.greenBright.bold('Unique links:', chalk.bold(linkStats.unique)));
      console.log(chalk.greenBright.bold('Broken links:', chalk.red.bold(linkStats.broken)));
    } else if (options.validate) {
      results.forEach((link) => {
        console.log(chalk.greenBright.bold('File:', link.file));
        console.log(chalk.greenBright.bold('Text:', link.text));
        console.log(chalk.greenBright.bold('Link:', link.href));
        console.log(chalk.greenBright.bold('Status HTTP:'), (link.status));
        console.log(chalk.yellow.bold('OK:', link.ok));
        console.log(chalk.magenta.bold('________________________________________________________________________________________'));
      });
    } else if (options.stats) {
      console.log(chalk.greenBright.bold('Total links:', results.length));

      const uniqueLinks = new Set(results.map((link) => link.href));

      console.log(chalk.greenBright.bold('Unique links:', uniqueLinks.size));
    } else {
      results.forEach((link) => {
        console.log(chalk.greenBright.bold('File:', link.file));
        console.log(chalk.greenBright.bold('Text:', link.text));
        console.log(chalk.greenBright.bold('Link:', link.href));
        console.log(chalk.magenta.bold('________________________________________________________________________________________'));
      });
    }
  })
  .catch((error) => {
    console.error(error);
  });
