import cheerio from 'cheerio';
// tslint:disable-next-line:import-name
import requestPromise from 'request-promise-native';
import { isUndefined } from 'util';

export type FormData = { [key: string]: string };

export async function webscraper(uri: string, formData?: FormData): Promise<CheerioStatic> {
  const method = isUndefined(formData) ? 'get' : 'post';

  const options = {
    method,
    formData,
  };

  return requestPromise(uri, options)
    .then((html: string) => cheerio.load(html));
}
