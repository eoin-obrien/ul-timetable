import * as cheerio from 'cheerio';
// tslint:disable-next-line:no-require-imports no-var-requires
const request = <RequestAPI<RequestPromise, RequestPromiseOptions, RequiredUriUrl> | jest.Mock>require('request-promise-native');

import { RequestAPI, RequiredUriUrl } from 'request';
import { RequestPromise, RequestPromiseOptions } from 'request-promise-native';
import { webscraper } from '../../src/util/webscraper';

jest.mock('cheerio');
jest.mock('request-promise-native');

const mockWebpage = '<!DOCTYPE html><html></html>';
const mockCheerioStatic = {};

describe('webscraper()', () => {
  const uri = 'https://example.com';

  afterEach(() => {
    (<jest.Mock>cheerio.load).mockReset();
    (<jest.Mock>request).mockReset();
  });

  it('makes a GET request and returns the response as a cheerio object', async () => {
    (<jest.Mock>cheerio.load).mockImplementation(() => mockCheerioStatic);
    (<jest.Mock>request).mockImplementation(async () => mockWebpage);

    await expect(webscraper(uri)).resolves.toBe(mockCheerioStatic);
    expect(request).lastCalledWith(uri, { method: 'get' });
    expect(cheerio.load).lastCalledWith(mockWebpage);
  });

  it('makes a POST request with form data and returns the response a cheerio object', async () => {
    (<jest.Mock>cheerio.load).mockImplementation(() => mockCheerioStatic);
    (<jest.Mock>request).mockImplementation(async () => mockWebpage);

    const form = { field: 'value' };
    await expect(webscraper(uri, form)).resolves.toBe(mockCheerioStatic);
    expect(request).lastCalledWith(uri, { method: 'post', form });
    expect(cheerio.load).lastCalledWith(mockWebpage);
  });

  it('throws an error if the request fails', async () => {
    (<jest.Mock>cheerio.load).mockImplementation(() => mockCheerioStatic);
    (<jest.Mock>request).mockImplementation(async () => {
      throw new Error();
    });

    await expect(webscraper(uri)).rejects.toBeInstanceOf(Error);
    expect(request).lastCalledWith(uri, { method: 'get' });
  });

  it('throws an error if cheerio fails to parse the webpage', async () => {
    (<jest.Mock>cheerio.load).mockImplementation(() => {
      throw new Error();
    });
    (<jest.Mock>request).mockImplementation(async () => mockWebpage);

    await expect(webscraper(uri)).rejects.toBeInstanceOf(Error);
    expect(request).lastCalledWith(uri, { method: 'get' });
    expect(cheerio.load).lastCalledWith(mockWebpage);
  });
});
