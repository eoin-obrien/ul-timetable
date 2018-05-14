import { isValidModuleId } from '../util/validators';
import { webscraper } from '../util/webscraper';

export interface IModuleDetails {
  id: string;
  name: string;
}

const moduleDetailsURI = 'https://www.timetable.ul.ie/tt_moduledetails_res.asp';

const idSelector = 'body > b > table > tbody > tr > td > div > center > table > tbody > tr:nth-child(1) > td:nth-child(2)';
const nameSelector = 'body > b > table > tbody > tr > td > div > center > table > tbody > tr:nth-child(2) > td:nth-child(2)';

export async function moduleDetails(moduleId: string): Promise<IModuleDetails> {
  // Check that the module ID is valid
  if (!isValidModuleId(moduleId)) {
    throw new Error('invalid module ID');
  }

  // Scrape module details from www.timetable.ul.ie
  let $: CheerioStatic;
  try {
    $ = await webscraper(moduleDetailsURI);
  } catch (err) {
    throw new Error('failed to fetch module details from www.timetable.ul.ie');
  }

  // Return parsed module details
  return parseModuleDetails($);
}

export function parseModuleDetails($: CheerioStatic): IModuleDetails {
  return {
    id: $(idSelector).text().trim(),
    name: $(nameSelector).text().trim(),
  };
}
