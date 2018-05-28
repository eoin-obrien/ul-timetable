import * as cheerio from 'cheerio';

import { courseTimetable, Day, ICourseTimetable } from '../../src';
import { parseCourseTimetableLesson, parseTimetable } from '../../src/util/timetable-parsers';
import { isValidCourseId } from '../../src/util/validators';
import { webscraper } from '../../src/util/webscraper';

jest.mock('../../src/util/timetable-parsers');
jest.mock('../../src/util/validators');
jest.mock('../../src/util/webscraper');

const courseTimetableURI = 'https://www.timetable.ul.ie/course_res.asp';
const $ = cheerio.load('');
const mockCourseTimetable: ICourseTimetable = {
  courseId: 'LM051',
  year: 2,
  lessons: {
    [Day.Monday]: [],
    [Day.Tuesday]: [],
    [Day.Wednesday]: [],
    [Day.Thursday]: [],
    [Day.Friday]: [],
    [Day.Saturday]: [],
  },
};

describe('courseTimetable()', () => {
  const courseId = 'LM051';
  const invalidCourseId = 'apples';
  const courseYear = 2;
  const invalidCourseYear = 4.5;

  afterEach(() => {
    (<jest.Mock>webscraper).mockReset();
    (<jest.Mock>isValidCourseId).mockReset();
    (<jest.Mock>parseTimetable).mockReset();
  });

  it('requests and parses the course timetable', async () => {
    (<jest.Mock>isValidCourseId).mockImplementationOnce(() => true);
    (<jest.Mock>webscraper).mockImplementationOnce(async () => $);
    (<jest.Mock>parseTimetable).mockImplementationOnce(() => mockCourseTimetable.lessons);

    await expect(courseTimetable(courseId, courseYear)).resolves.toEqual(mockCourseTimetable);
    expect(isValidCourseId).toBeCalledWith(courseId);
    expect(webscraper).toBeCalledWith(courseTimetableURI, { T1: courseId, T2: String(courseYear) });
    expect(parseTimetable).toBeCalledWith($, parseCourseTimetableLesson);
  });

  it('throws an error if the course ID is invalid', async () => {
    (<jest.Mock>isValidCourseId).mockImplementationOnce(() => false);

    await expect(courseTimetable(invalidCourseId, courseYear)).rejects
      .toEqual(new Error('invalid course ID'));
    expect(isValidCourseId).toBeCalledWith(invalidCourseId);
    expect(webscraper).not.toBeCalled();
    expect(parseTimetable).not.toBeCalled();
  });

  it('throws an error if the year is invalid', async () => {
    (<jest.Mock>isValidCourseId).mockImplementationOnce(() => true);

    await expect(courseTimetable(courseId, invalidCourseYear)).rejects
      .toEqual(new Error('invalid course year'));
    expect(isValidCourseId).toBeCalledWith(courseId);
    expect(webscraper).not.toBeCalled();
    expect(parseTimetable).not.toBeCalled();
  });

  it('throws an error if the request fails', async () => {
    (<jest.Mock>isValidCourseId).mockImplementationOnce(() => true);
    (<jest.Mock>webscraper).mockImplementationOnce(async () => { throw new Error(); });

    await expect(courseTimetable(courseId, courseYear)).rejects
      .toEqual(new Error('failed to fetch course timetable from www.timetable.ul.ie'));
    expect(isValidCourseId).toBeCalledWith(courseId);
    expect(webscraper).toBeCalledWith(courseTimetableURI, { T1: courseId, T2: String(courseYear) });
    expect(parseTimetable).not.toBeCalled();
  });
});
