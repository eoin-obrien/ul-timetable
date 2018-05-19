import { webscraper } from '../../src/util/webscraper';

const cheerio = <CheerioAPI>require.requireMock('cheerio');
const rpn = require.requireMock('request-promise-native');

jest.mock('cheerio');
jest.mock('request-promise-native');

const mockWebpage = '<!DOCTYPE html><html></html>';
const mockCheerioStatic = {};

describe('webscraper()', () => {
  const uri = 'https://example.com';

  afterEach(() => {
    (<jest.Mock>cheerio.load).mockReset();
    (<jest.Mock>rpn).mockReset();
  });

  it('makes a GET request and returns the response as a cheerio object', async () => {
    (<jest.Mock>cheerio.load).mockImplementation(() => mockCheerioStatic);
    (<jest.Mock>rpn).mockImplementation(async () => mockWebpage);

    await expect(webscraper(uri)).resolves.toBe(mockCheerioStatic);
    expect(rpn).lastCalledWith(uri, { method: 'get' });
    expect(cheerio.load).lastCalledWith(mockWebpage);
  });

  it('makes a POST request with form data and returns the response a cheerio object', async () => {
    (<jest.Mock>cheerio.load).mockImplementation(() => mockCheerioStatic);
    (<jest.Mock>rpn).mockImplementation(async () => mockWebpage);

    const form = { field: 'value' };
    await expect(webscraper(uri, form)).resolves.toBe(mockCheerioStatic);
    expect(rpn).lastCalledWith(uri, { method: 'post', form });
    expect(cheerio.load).lastCalledWith(mockWebpage);
  });

  it('throws an error if the request fails', async () => {
    (<jest.Mock>cheerio.load).mockImplementation(() => mockCheerioStatic);
    (<jest.Mock>rpn).mockImplementation(async () => {
      throw new Error();
    });

    await expect(webscraper(uri)).rejects.toBeInstanceOf(Error);
    expect(rpn).lastCalledWith(uri, { method: 'get' });
  });

  it('throws an error if cheerio fails to parse the webpage', async () => {
    (<jest.Mock>cheerio.load).mockImplementation(() => {
      throw new Error();
    });
    (<jest.Mock>rpn).mockImplementation(async () => mockWebpage);

    await expect(webscraper(uri)).rejects.toBeInstanceOf(Error);
    expect(rpn).lastCalledWith(uri, { method: 'get' });
    expect(cheerio.load).lastCalledWith(mockWebpage);
  });
});
