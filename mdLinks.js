const fs = require('fs');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');

// Lê um arquivo e busca por links no formato Markdown
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
            file: file,
          });
        }

        resolve(links);
      }
    });
  });
}
// Verifica se o path é um diretório / Obtém os arquivos em um diretório / Filtra apenas os arquivos MD
function getMarkdownFiles(dirPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, files) => {
      if (err) {
        reject(err);
      } else {
        const markdownFiles = files.filter((file) => path.extname(file) === '.md');
        resolve(markdownFiles);
      }
    });
  });
}

// Processa um diretório, buscando e processando arquivos Markdown
function processDirectory(dirPath, options) {
  return getMarkdownFiles(dirPath).then((markdownFiles) => {
    const promises = markdownFiles.map((file) => {
      const fullPath = path.join(dirPath, file);
      return mdLinks(fullPath, options);
    });

    return Promise.all(promises).then((results) => [].concat(...results));
  });
}

// Verifica se o caminho é um arquivo MD / Processa um arquivo MD, buscando e validando os links
function processMarkdownFile(filePath, options) {
  return getLinks(filePath).then((links) => {
    if (options.validate) {
      const linkPromises = links.map((link) => {
        return axios.get(link.href)
          .then((response) => {
            link.status = response.status;
            link.ok = response.status === 200 ? 'OK' : 'fail';
            return link;
          })
          .catch(() => {
            link.status = 404;
            link.ok = 'fail';
            return link;
          });
      });

      return Promise.all(linkPromises).then((validatedLinks) => {
        return validatedLinks;
      });
    } else {
      return links;
    }
  });
}


// Função principal: Recebe o caminho e opções, processa diretório ou arquivo e retorna os links
function mdLinks(filePath, options = {}) {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath) || (!fs.lstatSync(absolutePath).isDirectory() && path.extname(absolutePath) !== '.md')) {
    return Promise.reject('O caminho fornecido não é um diretório nem um arquivo Markdown.');
  }

  if (fs.lstatSync(absolutePath).isDirectory()) {
    return processDirectory(absolutePath, options);
  }

  if (path.extname(absolutePath) === '.md') {
    return processMarkdownFile(absolutePath, options);
  }
}

function statsLinks(links) {
  const total = links.length;
  const uniqueLinks = new Set(links.map((link) => link.href));
  const unique = uniqueLinks.size;
  const broken = links.filter((link) => link.ok === 'fail').length;

  return { total, unique, broken };
}

module.exports = { mdLinks, statsLinks, processMarkdownFile };
