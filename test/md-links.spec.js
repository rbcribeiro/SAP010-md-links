const path = require('path');
const { mdLinks, statsLinks } = require('../mdLinks');

describe('mdLinks', () => {
  it('should handle invalid path', async () => {
    const result = await mdLinks('./invalid-path.md');
    expect(result).toEqual([]);
  });

  it('should process the directory and return links', async () => {
    const result = await mdLinks('./');
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

  it('should process the Markdown file and return links', async () => {
    const result = await mdLinks('./links.md');
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
