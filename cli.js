const { mdLinks, statsLinks } = require('./mdLinks');

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
      console.log('Total links:', linkStats.total);
      console.log('Unique links:', linkStats.unique);
      console.log('Broken links:', linkStats.broken);
    } else if (options.validate) {
      results.forEach((link) => {
        console.log('File:', link.file);
        console.log('Text:', link.text);
        console.log('Link:', link.href);
        console.log('Status HTTP:', link.status);
        console.log('OK:', link.ok);
        console.log('--------------');
      });
    } else if (options.stats) {
      console.log('Total links:', results.length);
      const uniqueLinks = new Set(results.map((link) => link.href));
      console.log('Unique links:', uniqueLinks.size);
    } else {
      results.forEach((link) => {
        console.log('File:', link.file);
        console.log('Text:', link.text);
        console.log('Link:', link.href);
        console.log('--------------');
      });
    }
  })
  .catch((error) => {
    console.error(error);
  });
