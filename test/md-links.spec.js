const { mdLinks, statsLinks } = require('../mdLinks');

// Teste para a função mdLinks
describe('mdLinks', () => {
  it('should return an array of links with href, text, and file properties', async () => {
    const result = await mdLinks('./links.md');
    const expected = [
      {
        href: 'https://www.youtube.com/watch?v=J3gZH5w6eBo',
        text: 'Youtube',
        file: 'C:\\Users\\Renata\\Desktop\\projetos_laboratoria\\SAP010-md-links\\links.md',
      },
      {
        href: 'https://github.com/workshopper/learnyounode',
        text: 'Github',
        file: 'C:\\Users\\Renata\\Desktop\\projetos_laboratoria\\SAP010-md-links\\links.md',
      },
      {
        href: 'https://github.com/workshopper/learnyounode',
        text: 'Github2',
        file: 'C:\\Users\\Renata\\Desktop\\projetos_laboratoria\\SAP010-md-links\\links.md',
      },
      {
        href: 'http://www.fboob.com/',
        text: 'broken',
        file: 'C:\\Users\\Renata\\Desktop\\projetos_laboratoria\\SAP010-md-links\\links.md',
      },
      {
        href: 'http://www.fboob.com/',
        text: 'broken',
        file: 'C:\\Users\\Renata\\Desktop\\projetos_laboratoria\\SAP010-md-links\\links.md',
      },
    ];
    expect(result).toEqual(expected);
  });

  // Teste para a função mdLinks com a opção --validate
  it('should return an array of links with href, text, file, status, and ok properties when using --validate', async () => {
    const result = await mdLinks('./links.md', { validate: true });
    // Verifique se os links retornados têm as propriedades href, text, file, status e ok
    result.forEach((link) => {
      expect(link).toHaveProperty('href');
      expect(link).toHaveProperty('text');
      expect(link).toHaveProperty('file');
      expect(link).toHaveProperty('status');
      expect(link).toHaveProperty('ok');
    });
  });
});

// Teste para a função statsLinks
describe('statsLinks', () => {
  it('should return informations about total and unique links when its --stats', () => {
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
