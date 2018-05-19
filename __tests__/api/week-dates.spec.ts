import cheerio from 'cheerio';

import { weekDates } from '../../src';
import { parseWeekDates } from '../../src/util/timetable-parsers';
import { webscraper } from '../../src/util/webscraper';

jest.mock('../../src/util/timetable-parsers');
jest.mock('../../src/util/webscraper');

const weekDatesURI = 'https://www.timetable.ul.ie/weeks.htm';

const $ = cheerio.load('');
const mockWeekDates = [];

describe('weekDates()', () => {
  afterEach(() => {
    (<jest.Mock>webscraper).mockReset();
    (<jest.Mock>parseWeekDates).mockReset();
  });

  it('requests and parses the week dates', async () => {
    (<jest.Mock>webscraper).mockImplementationOnce(async () => $);
    (<jest.Mock>parseWeekDates).mockImplementationOnce(() => mockWeekDates);
    await expect(weekDates()).resolves.toBe(mockWeekDates);
    expect(webscraper).toBeCalledWith(weekDatesURI);
    expect(parseWeekDates).toBeCalledWith($);
  });

  it('throws an error if the request fails', async () => {
    (<jest.Mock>webscraper).mockImplementationOnce(async () => { throw new Error(); });
    await expect(weekDates()).rejects.toEqual(new Error('failed to fetch week details from www.timetable.ul.ie'));
    expect(webscraper).toBeCalledWith(weekDatesURI);
    expect(parseWeekDates).not.toBeCalled();
  });
});
