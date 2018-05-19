import { IModuleExamTimetable } from '../types';
import { parseModuleExamTimetable } from '../util/timetable-parsers';
import { isValidModuleId } from '../util/validators';
import { webscraper } from '../util/webscraper';

const moduleExamTimetableURI = 'https://www.timetable.ul.ie/mod_exam_res.asp';

export async function moduleExamTimetable(moduleId: string): Promise<IModuleExamTimetable> {
  // Check that the module ID is valid
  if (!isValidModuleId(moduleId)) {
    throw new Error('invalid module ID');
  }

  // Scrape module exam timetable from www.timetable.ul.ie
  let $: CheerioStatic;
  try {
    $ = await webscraper(moduleExamTimetableURI, { T1: moduleId.toUpperCase() });
  } catch (err) {
    throw new Error('failed to fetch module exam timetable from www.timetable.ul.ie');
  }

  // Return parsed module exam timetable
  return parseModuleExamTimetable($);
}
