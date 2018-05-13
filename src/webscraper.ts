import cheerio from 'cheerio';
// tslint:disable-next-line:import-name
import requestPromise from 'request-promise-native';

export type FormData = { [key: string]: string };

export async function webscraper(uri: string, method: string, formData?: FormData): Promise<CheerioStatic> {
  const options = {
    method,
    formData,
  };

  return requestPromise(uri, options)
    .then((html: string) => cheerio.load(html));
}
