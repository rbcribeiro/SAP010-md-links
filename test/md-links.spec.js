const MockAdapter = require('axios-mock-adapter');
const path = require('path');
const { mdLinks, statsLinks, processDirectory, processMarkdownFile } = require('../mdLinks');
const axios = require('axios');
const chalk = require('chalk');

const expectedDirectory = [
  {
    href: 'https://github.com/workshopper/learnyounode',
    text: 'Github1',
    file: path.resolve('C:\\Users\\Renata\\Desktop\\projetos_laboratoria\\SAP010-md-links\\links.md'),
  },
  {
    href: 'https://github.com/workshopper/learnyounode',
    text: 'Github2',
    file: path.resolve('C:\\Users\\Renata\\Desktop\\projetos_laboratoria\\SAP010-md-links\\links.md'),
  },
  {
    href: 'http://w.testebrokenn.com/',
    text: 'broken',
    file: path.resolve('C:\\Users\\Renata\\Desktop\\projetos_laboratoria\\SAP010-md-links\\links.md'),
  },
  {
    href: 'https://docs.pipz.com/central-de-ajuda/learning-center/guia-basico-de-markdown#open',
    text: 'Markdown',
    file: path.resolve('C:\\Users\\Renata\\Desktop\\projetos_laboratoria\\SAP010-md-links\\README.md'),
  },
  {
    href: 'https://img.shields.io/badge/-Github-000?style=flat-square&logo=Github&logoColor=white&link)](https://github.com/rbcribeiro',
    text: '![Github',
    file: path.resolve('C:\\Users\\Renata\\Desktop\\projetos_laboratoria\\SAP010-md-links\\README.md'),
  },
  {
    href: 'https://img.shields.io/badge/-LinkedIn-blue?style=flat-square&logo=Linkedin&logoColor=white&link)](https://www.linkedin.com/in/rbcribeiro',
    text: '![Linkedin',
    file: path.resolve('C:\\Users\\Renata\\Desktop\\projetos_laboratoria\\SAP010-md-links\\README.md'),
  },
];
const expectedFile = [
  {
    href: 'https://github.com/workshopper/learnyounode',
    text: 'Github1',
    file: path.resolve('C:\\Users\\Renata\\Desktop\\projetos_laboratoria\\SAP010-md-links\\links.md'),
  },
  {
    href: 'https://github.com/workshopper/learnyounode',
    text: 'Github2',
    file: path.resolve('C:\\Users\\Renata\\Desktop\\projetos_laboratoria\\SAP010-md-links\\links.md'),
  },
  {
    href: 'http://w.testebrokenn.com/',
    text: 'broken',
    file: path.resolve('C:\\Users\\Renata\\Desktop\\projetos_laboratoria\\SAP010-md-links\\links.md'),
  },
];

const links = [
  {
    href: 'https://github.com/workshopper/learnyounode',
    text: 'Github1',
    file: './links.md',
    status: 200,
    ok: 'OK',
  },
  {
    href: 'https://github.com/workshopper/learnyounode',
    text: 'Github2',
    file: './links.md',
    status: 200,
    ok: 'OK',
  },
  {
    href: 'http://w.testebrokenn.com/',
    text: 'broken',
    file: './links.md',
    status: 404,
    ok: 'fail',
  },
];

describe('mdLinks', () => {
  it('should reject with an error message when an invalid path is provided', () => {
    const invalidPath = '/path/to/invalid/file.txt';
    return mdLinks(invalidPath)
      .catch((error) => {
        expect(error).toBe(chalk.red.bold('O caminho fornecido não é um diretório nem um arquivo Markdown.'));
      });
  });

  it('should process the directory and return links', () => {
    return mdLinks('./')
      .then((result) => {
        expect(result).toEqual(expectedDirectory);
      });
  });

  it('should process the Markdown file and return links', () => {
    return mdLinks('./links.md')
      .then((result) => {
        expect(result).toEqual(expectedFile);
      });
  });
});

describe('statsLinks', () => {
  it('should return statistics with both valid and broken links', () => {
    const result = statsLinks(links);
    const expectedStats = { total: 3, unique: 2, broken: 1 };
    expect(result).toEqual(expectedStats);
  });
});

describe('processMarkdownFile', () => {
  it('should validate links if "validate" option is true', () => {
    const mock = new MockAdapter(axios);
    links.forEach(({ href, text, file, status, ok }) => {
      mock.onGet(href).reply((config) => {
        if (config.url === href) {
          return [status, { data: { text, file }, status, statusText: ok }];
        } else {
          return [404, { status: 404, statusText: 'Not Found' }];
        }
      });
    });
               
    const options = { validate: true };
  
    return processMarkdownFile('./links.md', options)
      .then((validatedLinks) => {
        expect(validatedLinks).toEqual(links);
      });
  });

  it('should reject with an error when processing an invalid Markdown file', () => {
    const invalidFilePath = '/path/to/invalid/file.md';
    return processMarkdownFile(invalidFilePath, {})
      .catch((error) => {
        expect(error).toBeDefined(); // Verifica se um erro foi gerado
      });
  });
})

describe('processDirectory', () => {
  it('should reject with an error when processing a directory with invalid files', () => {
    const invalidDirPath = '/path/to/invalid/directory';
    return processDirectory(invalidDirPath, {})
      .catch((error) => {
        expect(error).toBeDefined(); // Verifica se um erro foi gerado
      });
  });
});
