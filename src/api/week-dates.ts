import { IWeekDate } from '../types';
import { parseWeekDates } from '../util/timetable-parsers';
import { webscraper } from '../util/webscraper';

const weekDatesURI = 'https://www.timetable.ul.ie/weeks.htm';

export async function weekDates(): Promise<IWeekDate[]> {
  let $: CheerioStatic;

  // Scrape week details from www.timetable.ul.ie
  try {
    $ = await webscraper(weekDatesURI);
  } catch (err) {
    throw new Error('failed to fetch week details from www.timetable.ul.ie');
  }

  // Return parsed week details
  return parseWeekDates($);
}
