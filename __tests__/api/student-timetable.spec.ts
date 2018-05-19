import cheerio from 'cheerio';

import { studentTimetable } from '../../src';
import { Day, IStudentTimetable } from '../../src/types';
import { parseStudentTimetableLesson, parseTimetable } from '../../src/util/timetable-parsers';
import { isValidStudentId } from '../../src/util/validators';
import { webscraper } from '../../src/util/webscraper';

jest.mock('../../src/util/timetable-parsers');
jest.mock('../../src/util/validators');
jest.mock('../../src/util/webscraper');

const studentTimetableURI = 'https://www.timetable.ul.ie/tt2.asp';
const $ = cheerio.load('');
const mockStudentTimetable: IStudentTimetable = {
  studentId: '12345678',
  lessons: {
    [Day.Monday]: [],
    [Day.Tuesday]: [],
    [Day.Wednesday]: [],
    [Day.Thursday]: [],
    [Day.Friday]: [],
    [Day.Saturday]: [],
  },
};

describe('studentTimetable()', () => {
  const studentId = '12345678';
  const invalidStudentId = 'apples';

  afterEach(() => {
    (<jest.Mock>webscraper).mockReset();
    (<jest.Mock>isValidStudentId).mockReset();
    (<jest.Mock>parseTimetable).mockReset();
  });

  it('requests and parses the student timetable', async () => {
    (<jest.Mock>isValidStudentId).mockImplementationOnce(() => true);
    (<jest.Mock>webscraper).mockImplementationOnce(async () => $);
    (<jest.Mock>parseTimetable).mockImplementationOnce(() => mockStudentTimetable.lessons);

    await expect(studentTimetable(studentId)).resolves.toEqual(mockStudentTimetable);
    expect(isValidStudentId).toBeCalledWith(studentId);
    expect(webscraper).toBeCalledWith(studentTimetableURI, { T1: studentId });
    expect(parseTimetable).toBeCalledWith($, parseStudentTimetableLesson);
  });

  it('throws an error if the student ID is invalid', async () => {
    (<jest.Mock>isValidStudentId).mockImplementationOnce(() => false);

    await expect(studentTimetable(invalidStudentId)).rejects
      .toEqual(new Error('invalid student ID'));
    expect(isValidStudentId).toBeCalledWith(invalidStudentId);
    expect(webscraper).not.toBeCalled();
    expect(parseTimetable).not.toBeCalled();
  });

  it('throws an error if the request fails', async () => {
    (<jest.Mock>isValidStudentId).mockImplementationOnce(() => true);
    (<jest.Mock>webscraper).mockImplementationOnce(async () => { throw new Error(); });

    await expect(studentTimetable(studentId)).rejects
      .toEqual(new Error('failed to fetch student timetable from www.timetable.ul.ie'));
    expect(isValidStudentId).toBeCalledWith(studentId);
    expect(webscraper).toBeCalledWith(studentTimetableURI, { T1: studentId });
    expect(parseTimetable).not.toBeCalled();
  });
});
