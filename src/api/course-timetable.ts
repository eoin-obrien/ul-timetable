import { ICourseTimetable } from '../types';
import { parseCourseTimetableLesson, parseTimetable } from '../util/timetable-parsers';
import { isValidCourseId } from '../util/validators';
import { webscraper } from '../util/webscraper';

const courseTimetableURI = 'https://www.timetable.ul.ie/course_res.asp';

export async function courseTimetable(courseId: string, year: number): Promise<ICourseTimetable> {
  // Check that the course ID is valid
  if (!isValidCourseId(courseId)) {
    throw new Error('invalid course ID');
  }

  // Check that the year is valid
  if (!Number.isInteger(year) || year < 1 || year > 4) {
    throw new Error('invalid course year');
  }

  // Scrape course timetable from www.timetable.ul.ie
  let $: CheerioStatic;
  try {
    $ = await webscraper(courseTimetableURI, { T1: courseId, T2: String(year) });
  } catch (err) {
    throw new Error('failed to fetch course timetable from www.timetable.ul.ie');
  }

  // Return parsed course timetable
  return {
    courseId: courseId,
    year: year,
    lessons: parseTimetable($, parseCourseTimetableLesson),
  };
}
