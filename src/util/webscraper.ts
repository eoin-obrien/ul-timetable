import cheerio from 'cheerio';
// tslint:disable-next-line:import-name
import requestPromise from 'request-promise-native';
import { isUndefined } from 'util';

export type FormData = { [key: string]: string };

export async function webscraper(uri: string, form?: FormData): Promise<CheerioStatic> {
  const method = isUndefined(form) ? 'get' : 'post';

  const options = {
    method,
    form,
  };

  return requestPromise(uri, options)
    .then((html: string) => cheerio.load(html));
}
