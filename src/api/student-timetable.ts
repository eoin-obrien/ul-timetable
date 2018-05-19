import { IStudentTimetable } from '../types';
import { parseStudentTimetableLesson, parseTimetable } from '../util/timetable-parsers';
import { isValidStudentId } from '../util/validators';
import { webscraper } from '../util/webscraper';

const studentTimetableURI = 'https://www.timetable.ul.ie/tt2.asp';

export async function studentTimetable(studentId: string): Promise<IStudentTimetable> {
  // Check that the student ID is valid
  if (!isValidStudentId(studentId)) {
    throw new Error('invalid student ID');
  }

  // Scrape student timetable from www.timetable.ul.ie
  let $: CheerioStatic;
  try {
    $ = await webscraper(studentTimetableURI, { T1: studentId.toUpperCase() });
  } catch (err) {
    throw new Error('failed to fetch student timetable from www.timetable.ul.ie');
  }

  // Return parsed student timetable
  return {
    studentId: studentId.toUpperCase(),
    lessons: parseTimetable($, parseStudentTimetableLesson),
  };
}
