import * as cheerio from 'cheerio';
// tslint:disable-next-line:no-require-imports no-var-requires
const request = <RequestAPI<RequestPromise, RequestPromiseOptions, RequiredUriUrl>>require('request-promise-native');
import { RequestAPI, RequiredUriUrl } from 'request';
import { RequestPromise, RequestPromiseOptions } from 'request-promise-native';
import { isUndefined } from 'util';

export type FormData = { [key: string]: string };

export async function webscraper(uri: string, form?: FormData): Promise<CheerioStatic> {
  const method = isUndefined(form) ? 'get' : 'post';

  const options = {
    method,
    form,
  };

  return request(uri, options)
    .then((html: string) => cheerio.load(html));
}
