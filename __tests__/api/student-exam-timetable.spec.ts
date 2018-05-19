import cheerio from 'cheerio';

import { studentExamTimetable } from '../../src';
import { IStudentExamTimetable } from '../../src/types';
import { parseStudentExamTimetable } from '../../src/util/timetable-parsers';
import { isValidStudentId } from '../../src/util/validators';
import { webscraper } from '../../src/util/webscraper';

jest.mock('../../src/util/timetable-parsers');
jest.mock('../../src/util/validators');
jest.mock('../../src/util/webscraper');

const studentExamTimetableURI = 'https://www.timetable.ul.ie/stud_exam_res.asp';
const $ = cheerio.load('');
const mockStudentExamTimetable: IStudentExamTimetable = {
  studentId: '12345678',
  modules: [{
    moduleId: 'CS4006',
    roomIds: ['EGO10'],
    date: new Date('2018-05-05T15:00:00.000Z'),
    info: '',
  }],
};

describe('studentExamTimetable()', () => {
  const studentId = '12345678';
  const invalidStudentId = 'apples';

  afterEach(() => {
    (<jest.Mock>webscraper).mockReset();
    (<jest.Mock>isValidStudentId).mockReset();
    (<jest.Mock>parseStudentExamTimetable).mockReset();
  });

  it('requests and parses the student exam timetable', async () => {
    (<jest.Mock>isValidStudentId).mockImplementationOnce(() => true);
    (<jest.Mock>webscraper).mockImplementationOnce(async () => $);
    (<jest.Mock>parseStudentExamTimetable).mockImplementationOnce(() => mockStudentExamTimetable.modules);

    await expect(studentExamTimetable(studentId)).resolves.toEqual(mockStudentExamTimetable);
    expect(isValidStudentId).toBeCalledWith(studentId);
    expect(webscraper).toBeCalledWith(studentExamTimetableURI, { T1: studentId });
    expect(parseStudentExamTimetable).toBeCalledWith($);
  });

  it('throws an error if the student ID is invalid', async () => {
    (<jest.Mock>isValidStudentId).mockImplementationOnce(() => false);

    await expect(studentExamTimetable(invalidStudentId)).rejects
      .toEqual(new Error('invalid student ID'));
    expect(isValidStudentId).toBeCalledWith(invalidStudentId);
    expect(webscraper).not.toBeCalled();
    expect(parseStudentExamTimetable).not.toBeCalled();
  });

  it('throws an error if the request fails', async () => {
    (<jest.Mock>isValidStudentId).mockImplementationOnce(() => true);
    (<jest.Mock>webscraper).mockImplementationOnce(async () => { throw new Error(); });

    await expect(studentExamTimetable(studentId)).rejects
      .toEqual(new Error('failed to fetch student exam timetable from www.timetable.ul.ie'));
    expect(isValidStudentId).toBeCalledWith(studentId);
    expect(webscraper).toBeCalledWith(studentExamTimetableURI, { T1: studentId });
    expect(parseStudentExamTimetable).not.toBeCalled();
  });
});
