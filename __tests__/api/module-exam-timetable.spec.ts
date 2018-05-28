import * as cheerio from 'cheerio';

import { IModuleExamTimetable, moduleExamTimetable } from '../../src';
import { parseModuleExamTimetable } from '../../src/util/timetable-parsers';
import { isValidModuleId } from '../../src/util/validators';
import { webscraper } from '../../src/util/webscraper';

jest.mock('../../src/util/timetable-parsers');
jest.mock('../../src/util/validators');
jest.mock('../../src/util/webscraper');

const moduleExamTimetableURI = 'https://www.timetable.ul.ie/mod_exam_res.asp';
const $ = cheerio.load('');
const mockModuleExamTimetable: IModuleExamTimetable = {
  moduleId: 'CS4006',
  roomIds: ['EGO10'],
  date: new Date('2018-05-05T15:00:00.000Z'),
  info: '',
};

describe('moduleExamTimetable()', () => {
  const moduleId = 'CS4006';
  const invalidModuleId = 'apples';

  afterEach(() => {
    (<jest.Mock>webscraper).mockReset();
    (<jest.Mock>isValidModuleId).mockReset();
    (<jest.Mock>parseModuleExamTimetable).mockReset();
  });

  it('requests and parses the module exam timetable', async () => {
    (<jest.Mock>isValidModuleId).mockImplementationOnce(() => true);
    (<jest.Mock>webscraper).mockImplementationOnce(async () => $);
    (<jest.Mock>parseModuleExamTimetable).mockImplementationOnce(() => mockModuleExamTimetable);

    await expect(moduleExamTimetable(moduleId)).resolves.toEqual(mockModuleExamTimetable);
    expect(isValidModuleId).toBeCalledWith(moduleId);
    expect(webscraper).toBeCalledWith(moduleExamTimetableURI, { T1: moduleId });
    expect(parseModuleExamTimetable).toBeCalledWith($);
  });

  it('throws an error if the module ID is invalid', async () => {
    (<jest.Mock>isValidModuleId).mockImplementationOnce(() => false);

    await expect(moduleExamTimetable(invalidModuleId)).rejects
      .toEqual(new Error('invalid module ID'));
    expect(isValidModuleId).toBeCalledWith(invalidModuleId);
    expect(webscraper).not.toBeCalled();
    expect(parseModuleExamTimetable).not.toBeCalled();
  });

  it('throws an error if the request fails', async () => {
    (<jest.Mock>isValidModuleId).mockImplementationOnce(() => true);
    (<jest.Mock>webscraper).mockImplementationOnce(async () => { throw new Error(); });

    await expect(moduleExamTimetable(moduleId)).rejects
      .toEqual(new Error('failed to fetch module exam timetable from www.timetable.ul.ie'));
    expect(isValidModuleId).toBeCalledWith(moduleId);
    expect(webscraper).toBeCalledWith(moduleExamTimetableURI, { T1: moduleId });
    expect(parseModuleExamTimetable).not.toBeCalled();
  });
});
