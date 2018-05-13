import { webscraper } from '../src/webscraper';

const cheerio = <CheerioAPI>require.requireMock('cheerio');
const rpn = require.requireMock('request-promise-native');

jest.mock('cheerio');
jest.mock('request-promise-native');

const mockWebpage = '<!DOCTYPE html><html></html>';
const mockCheerioStatic = {};

(<jest.Mock>cheerio.load).mockImplementation(() => mockCheerioStatic);
(<jest.Mock>rpn).mockImplementation(async () => mockWebpage);

describe('webscraper()', () => {
  const uri = 'https://example.com';

  it('makes a GET request and returns the response as a cheerio object', async () => {
    const method = 'get';
    const scrapedPage = await webscraper(uri, method);
    expect(rpn).toBeCalledWith(uri, { method });
    expect(cheerio.load).toBeCalledWith(mockWebpage);
    expect(scrapedPage).toBe(mockCheerioStatic);
  });

  it('makes a POST request with form data and returns the response a cheerio object', async () => {
    const method = 'post';
    const formData = { field: 'value' };
    const scrapedPage = await webscraper(uri, method, formData);
    expect(rpn).toBeCalledWith(uri, { method, formData });
    expect(cheerio.load).toBeCalledWith(mockWebpage);
    expect(scrapedPage).toBe(mockCheerioStatic);
  });
});
