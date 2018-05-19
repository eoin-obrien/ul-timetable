import cheerio from 'cheerio';

import { moduleTimetable } from '../../src';
import { Day, IModuleTimetable } from '../../src/types';
import { parseModuleTimetableLesson, parseTimetable } from '../../src/util/timetable-parsers';
import { isValidModuleId } from '../../src/util/validators';
import { webscraper } from '../../src/util/webscraper';

jest.mock('../../src/util/timetable-parsers');
jest.mock('../../src/util/validators');
jest.mock('../../src/util/webscraper');

const moduleTimetableURI = 'https://www.timetable.ul.ie/mod_res.asp';
const $ = cheerio.load('');
const mockModuleTimetable: IModuleTimetable = {
  moduleId: 'CS4006',
  lessons: {
    [Day.Monday]: [],
    [Day.Tuesday]: [],
    [Day.Wednesday]: [],
    [Day.Thursday]: [],
    [Day.Friday]: [],
    [Day.Saturday]: [],
  },
};

describe('moduleTimetable()', () => {
  const moduleId = 'CS4006';
  const invalidModuleId = 'apples';

  afterEach(() => {
    (<jest.Mock>webscraper).mockReset();
    (<jest.Mock>isValidModuleId).mockReset();
    (<jest.Mock>parseTimetable).mockReset();
  });

  it('requests and parses the module timetable', async () => {
    (<jest.Mock>isValidModuleId).mockImplementationOnce(() => true);
    (<jest.Mock>webscraper).mockImplementationOnce(async () => $);
    (<jest.Mock>parseTimetable).mockImplementationOnce(() => mockModuleTimetable.lessons);

    await expect(moduleTimetable(moduleId)).resolves.toEqual(mockModuleTimetable);
    expect(isValidModuleId).toBeCalledWith(moduleId);
    expect(webscraper).toBeCalledWith(moduleTimetableURI, { T1: moduleId });
    expect(parseTimetable).toBeCalledWith($, parseModuleTimetableLesson);
  });

  it('throws an error if the module ID is invalid', async () => {
    (<jest.Mock>isValidModuleId).mockImplementationOnce(() => false);

    await expect(moduleTimetable(invalidModuleId)).rejects
      .toEqual(new Error('invalid module ID'));
    expect(isValidModuleId).toBeCalledWith(invalidModuleId);
    expect(webscraper).not.toBeCalled();
    expect(parseTimetable).not.toBeCalled();
  });

  it('throws an error if the request fails', async () => {
    (<jest.Mock>isValidModuleId).mockImplementationOnce(() => true);
    (<jest.Mock>webscraper).mockImplementationOnce(async () => { throw new Error(); });

    await expect(moduleTimetable(moduleId)).rejects
      .toEqual(new Error('failed to fetch module timetable from www.timetable.ul.ie'));
    expect(isValidModuleId).toBeCalledWith(moduleId);
    expect(webscraper).toBeCalledWith(moduleTimetableURI, { T1: moduleId });
    expect(parseTimetable).not.toBeCalled();
  });
});
