import { IModuleTimetable } from '../types';
import { parseModuleTimetableLesson, parseTimetable } from '../util/timetable-parsers';
import { isValidModuleId } from '../util/validators';
import { webscraper } from '../util/webscraper';

const moduleTimetableURI = 'https://www.timetable.ul.ie/mod_res.asp';

export async function moduleTimetable(moduleId: string): Promise<IModuleTimetable> {
  // Check that the module ID is valid
  if (!isValidModuleId(moduleId)) {
    throw new Error('invalid module ID');
  }

  // Scrape module timetable from www.timetable.ul.ie
  let $: CheerioStatic;
  try {
    $ = await webscraper(moduleTimetableURI, { T1: moduleId.toUpperCase() });
  } catch (err) {
    throw new Error('failed to fetch module timetable from www.timetable.ul.ie');
  }

  // Return parsed module timetable
  return {
    moduleId: moduleId.toUpperCase(),
    lessons: parseTimetable($, parseModuleTimetableLesson),
  };
}
