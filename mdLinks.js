const fs = require('fs');
const path = require('path');
const axios = require('axios');

function getLinks(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const regex = /\[(.+?)\]\((http[s]?:\/\/[^\s]+)\)/g;
        const links = [];
        let match;

        while ((match = regex.exec(data)) !== null) {
          links.push({
            href: match[2],
            text: match[1],
            file: file
          });
        }

        resolve(links);
      }
    });
  });
}

function isDirectory(dirPath) {
  const stats = fs.lstatSync(dirPath);
  return stats.isDirectory();
}

function getFilesInDirectory(dirPath) {
  return fs.readdirSync(dirPath);
}

function filterMarkdownFiles(files) {
  return files.filter((file) => path.extname(file) === '.md');
}

function processDirectory(dirPath, options) {
  const files = getFilesInDirectory(dirPath);
  const markdownFiles = filterMarkdownFiles(files);
  const promises = markdownFiles.map((file) => {
    const fullPath = path.join(dirPath, file);
    return mdLinks(fullPath, options);
  });

  return Promise.all(promises)
    .then((results) => [].concat(...results));
}

function isMarkdownFile(filePath) {
  return path.extname(filePath) === '.md';
}

function processMarkdownFile(filePath, options) {
  return getLinks(filePath)
    .then((links) => {
      if (options.validate) {
        const linkPromises = links.map((link) => {
          return axios.get(link.href)
            .then((response) => {
              link.status = response.status;
              link.ok = response.statusText;
              return link;
            })
            .catch((error) => {
              link.status = error.response ? error.response.status : '404';
              link.ok = 'fail';
              return link;
            });
        });

        return Promise.all(linkPromises)
          .then((results) => results);
      } else {
        return links;
      }
    });
}

function mdLinks(filePath, options = {}) {
  const absolutePath = path.resolve(filePath);

  if (isDirectory(absolutePath)) {
    return processDirectory(absolutePath, options);
  } else if (isMarkdownFile(absolutePath)) {
    return processMarkdownFile(absolutePath, options);
  } else {
    return Promise.resolve([]);
  }
}

function statsLinks(links) {
  const total = links.length;
  const uniqueLinks = new Set(links.map((link) => link.href));
  const unique = uniqueLinks.size;
  const broken = links.filter((link) => link.ok === 'fail').length;

  return { total, unique, broken };
}

module.exports = { mdLinks, statsLinks };
