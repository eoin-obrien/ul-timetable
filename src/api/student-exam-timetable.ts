import { IStudentExamTimetable } from '../types';
import { parseStudentExamTimetable } from '../util/timetable-parsers';
import { isValidStudentId } from '../util/validators';
import { webscraper } from '../util/webscraper';

const studentExamTimetableURI = 'https://www.timetable.ul.ie/stud_exam_res.asp';

export async function studentExamTimetable(studentId: string): Promise<IStudentExamTimetable> {
  // Check that the student ID is valid
  if (!isValidStudentId(studentId)) {
    throw new Error('invalid student ID');
  }

  // Scrape student exam timetable from www.timetable.ul.ie
  let $: CheerioStatic;
  try {
    $ = await webscraper(studentExamTimetableURI, { T1: studentId.toUpperCase() });
  } catch (err) {
    throw new Error('failed to fetch student exam timetable from www.timetable.ul.ie');
  }

  // Return parsed student exam timetable
  return {
    studentId: studentId.toUpperCase(),
    modules: parseStudentExamTimetable($),
  };
}
