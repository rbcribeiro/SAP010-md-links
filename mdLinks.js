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

// Verifica se o caminho é um diretório
// Obtém a lista de arquivos em um diretório
// Filtra apenas os arquivos Markdown da lista de arquivos
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

// Verifica se o caminho é um arquivo Markdown
// Processa um arquivo Markdown, buscando e validando os links
function processMarkdownFile(filePath, options) {
    return getLinks(filePath).then((links) => {
      if (options.validate) {
        const linkPromises = links.map((link) => {
          return axios.get(link.href)
            .then((response) => {
              link.status = response.status;
              link.ok = response.statusText;
              return link;
            })
            .catch(() => {
              link.status = 404;
              link.ok = 'fail';
              return link;
            });
        });
  
        return Promise.all(linkPromises);
      } else {
        return links;
      }
    });
  }

// Função principal: Recebe o caminho e opções, processa diretório ou arquivo e retorna os links
function mdLinks(filePath, options = {}) {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    console.log(chalk.red.bold('O caminho fornecido não é válido.'));
    return Promise.resolve([]);
  }

  if (fs.lstatSync(absolutePath).isDirectory()) {
    return processDirectory(absolutePath, options);
  } else if (path.extname(absolutePath) === '.md') {
    return processMarkdownFile(absolutePath, options);
  } else {
    console.log(chalk.red.bold('O caminho fornecido não é um diretório nem um arquivo Markdown.'));
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
