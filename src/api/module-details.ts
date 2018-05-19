import { IModuleDetails } from '../types';
import { parseModuleDetails } from '../util/timetable-parsers';
import { isValidModuleId } from '../util/validators';
import { webscraper } from '../util/webscraper';

const moduleDetailsURI = 'https://www.timetable.ul.ie/tt_moduledetails_res.asp';

export async function moduleDetails(moduleId: string): Promise<IModuleDetails> {
  // Check that the module ID is valid
  if (!isValidModuleId(moduleId)) {
    throw new Error('invalid module ID');
  }

  // Scrape module details from www.timetable.ul.ie
  let $: CheerioStatic;
  try {
    $ = await webscraper(moduleDetailsURI, { T1: moduleId });
  } catch (err) {
    throw new Error('failed to fetch module details from www.timetable.ul.ie');
  }

  // Return parsed module details
  return parseModuleDetails($);
}
