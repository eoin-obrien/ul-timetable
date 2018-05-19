import cheerio from 'cheerio';

import { weekDetails } from '../../src';
import { parseWeekDetails } from '../../src/util/timetable-parsers';
import { webscraper } from '../../src/util/webscraper';

jest.mock('../../src/util/timetable-parsers');
jest.mock('../../src/util/webscraper');

const weekDatesURI = 'https://www.timetable.ul.ie/weeks.htm';

const $ = cheerio.load('');
const mockWeekDetails = [];

describe('weekDetails()', () => {
  afterEach(() => {
    (<jest.Mock>webscraper).mockReset();
    (<jest.Mock>parseWeekDetails).mockReset();
  });

  it('requests and parses the week dates', async () => {
    (<jest.Mock>webscraper).mockImplementationOnce(async () => $);
    (<jest.Mock>parseWeekDetails).mockImplementationOnce(() => mockWeekDetails);
    await expect(weekDetails()).resolves.toBe(mockWeekDetails);
    expect(webscraper).toBeCalledWith(weekDatesURI);
    expect(parseWeekDetails).toBeCalledWith($);
  });

  it('throws an error if the request fails', async () => {
    (<jest.Mock>webscraper).mockImplementationOnce(async () => { throw new Error(); });
    await expect(weekDetails()).rejects.toEqual(new Error('failed to fetch week details from www.timetable.ul.ie'));
    expect(webscraper).toBeCalledWith(weekDatesURI);
    expect(parseWeekDetails).not.toBeCalled();
  });
});
