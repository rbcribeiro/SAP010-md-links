const path = require('path');
const { mdLinks, statsLinks } = require('../mdLinks');

describe('mdLinks', () => {
    it('should reject with an error message when an invalid path is provided', () => {
      const invalidPath = '/path/to/invalid/file.txt';
      return mdLinks(invalidPath)
        .catch((error) => {
          expect(error).toBe('O caminho fornecido não é um diretório nem um arquivo Markdown.');
        });
    });

  it('should process the directory and return links', () => {
    return mdLinks('./')
      .then((result) => {
        const expected = [
          {
            href: 'https://www.youtube.com/watch?v=J3gZH5w6eBo',
            text: 'Youtube',
            file: path.resolve('./links.md'),
          },
          {
            href: 'https://github.com/workshopper/learnyounode',
            text: 'Github',
            file: path.resolve('./links.md'),
          },
          {
            href: 'https://github.com/workshopper/learnyounode',
            text: 'Github2',
            file: path.resolve('./links.md'),
          },
          {
            href: 'http://www.fboob.com/',
            text: 'broken',
            file: path.resolve('./links.md'),
          },
          {
            href: 'http://www.fboob.com/',
            text: 'broken',
            file: path.resolve('./links.md'),
          },
          {
            href: 'https://docs.pipz.com/central-de-ajuda/learning-center/guia-basico-de-markdown#open',
            text:  'Markdown',
            file: path.resolve('./README.md'),
          },
          {
            href: 'https://img.shields.io/badge/-Github-000?style=flat-square&logo=Github&logoColor=white&link)](https://github.com/rbcribeiro',
            text: '![Github',
            file: path.resolve('./README.md'),
          },
          {
            href: 'https://img.shields.io/badge/-LinkedIn-blue?style=flat-square&logo=Linkedin&logoColor=white&link)](https://www.linkedin.com/in/rbcribeiro',
            text: '![Linkedin',
            file: path.resolve('./README.md'),
          },
        ];
        expect(result).toEqual(expected);
      });
  });

  it('should process the Markdown file and return links', () => {
    return mdLinks('./links.md')
      .then((result) => {
        const expected = [
          {
            href: 'https://www.youtube.com/watch?v=J3gZH5w6eBo',
            text: 'Youtube',
            file: path.resolve('./links.md'),
          },
          {
            href: 'https://github.com/workshopper/learnyounode',
            text: 'Github',
            file: path.resolve('./links.md'),
          },
          {
            href: 'https://github.com/workshopper/learnyounode',
            text: 'Github2',
            file: path.resolve('./links.md'),
          },
          {
            href: 'http://www.fboob.com/',
            text: 'broken',
            file: path.resolve('./links.md'),
          },
          {
            href: 'http://www.fboob.com/',
            text: 'broken',
            file: path.resolve('./links.md'),
          },
        ];
        expect(result).toEqual(expected);
      });
  });
});

describe('statsLinks', () => {
  it('should return statistics with both valid and broken links', () => {
    const links = [
      {
        href: 'https://www.youtube.com/watch?v=J3gZH5w6eBo',
        text: 'Youtube',
        file: 'C:\\Users\\Renata\\Desktop\\projetos_laboratoria\\SAP010-md-links\\links.md',
        status: 200,
        ok: 'OK',
      },
      {
        href: 'https://github.com/workshopper/learnyounode',
        text: 'Github',
        file: 'C:\\Users\\Renata\\Desktop\\projetos_laboratoria\\SAP010-md-links\\links.md',
        status: 200,
        ok: 'OK',
      },
      {
        href: 'https://github.com/workshopper/learnyounode',
        text: 'Github2',
        file: 'C:\\Users\\Renata\\Desktop\\projetos_laboratoria\\SAP010-md-links\\links.md',
        status: 200,
        ok: 'OK',
      },
      {
        href: 'http://www.testeteste.com/',
        text: 'broken2',
        file: 'C:\\Users\\Renata\\Desktop\\projetos_laboratoria\\SAP010-md-links\\links.md',
        status: 404,
        ok: 'fail',
      },
      {
        href: 'http://www.testeteste.com/',
        text: 'broken2',
        file: 'C:\\Users\\Renata\\Desktop\\projetos_laboratoria\\SAP010-md-links\\links.md',
        status: 404,
        ok: 'fail',
      },
    ];
    const result = statsLinks(links);
    const expected = { total: 5, unique: 3, broken: 2 };
    expect(result).toEqual(expected);
  });
});
