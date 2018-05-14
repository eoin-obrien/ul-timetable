import cheerio from 'cheerio';
import fs from 'fs';

import { weekDates } from '../src';
import { IWeek, parseWeeks } from '../src/api/week-dates';
import { webscraper } from '../src/util/webscraper';

jest.mock('../src/util/webscraper');

const weekDatesURI = 'https://www.timetable.ul.ie/weeks.htm';
const html = fs.readFileSync('__tests__/html/week-dates.html');
const $ = cheerio.load(html.toString());
const weeks: IWeek[] = [
  { startDate: '22 Jan 2018', teachingWeek: '1', timetableWeek: '1' },
  { startDate: '29 Jan 2018', teachingWeek: '2', timetableWeek: '2' },
  { startDate: '05 Feb 2018', teachingWeek: '3', timetableWeek: '3' },
  { startDate: '12 Feb 2018', teachingWeek: '4', timetableWeek: '4' },
  { startDate: '19 Feb 2018', teachingWeek: '5', timetableWeek: '5' },
  { startDate: '26 Feb 2018', teachingWeek: '6', timetableWeek: '6' },
  { startDate: '05 Mar 2018', teachingWeek: '7', timetableWeek: '7' },
  { startDate: '12 Mar 2018', teachingWeek: '8', timetableWeek: '8' },
  { startDate: '19 Mar 2018', teachingWeek: '9', timetableWeek: '9' },
  { startDate: '26 Mar 2018', teachingWeek: 'Easter Week', timetableWeek: '10' },
  { startDate: '02 Apr 2018', teachingWeek: '10', timetableWeek: '11' },
  { startDate: '09 Apr 2018', teachingWeek: '11', timetableWeek: '12' },
  { startDate: '16 Apr 2018', teachingWeek: '12', timetableWeek: '13' },
  { startDate: '23 Apr 2018', teachingWeek: '13', timetableWeek: '14' },
];

(<jest.Mock>webscraper).mockImplementationOnce(async () => $);
(<jest.Mock>webscraper).mockImplementationOnce(async () => { throw new Error(); });

describe('weekDates()', () => {
  it('requests and parses the week dates', async () => {
    await expect(weekDates()).resolves.toEqual(weeks);
    expect(webscraper).toBeCalledWith(weekDatesURI);
  });

  it('throws an error if the request fails', async () => {
    await expect(weekDates()).rejects.toEqual(new Error('failed to fetch week dates from www.timetable.ul.ie.'));
    expect(webscraper).toBeCalledWith(weekDatesURI);
  });
});

describe('parseWeeks()', () => {
  it('parses week data from a webpage', () => {
    expect(parseWeeks($)).toEqual(weeks);
  });
});
