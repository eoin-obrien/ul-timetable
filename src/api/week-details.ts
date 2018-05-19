import { IWeekDetails } from '../types';
import { parseWeekDetails } from '../util/timetable-parsers';
import { webscraper } from '../util/webscraper';

const weekDatesURI = 'https://www.timetable.ul.ie/weeks.htm';

export async function weekDetails(): Promise<IWeekDetails[]> {
  let $: CheerioStatic;

  // Scrape week details from www.timetable.ul.ie
  try {
    $ = await webscraper(weekDatesURI);
  } catch (err) {
    throw new Error('failed to fetch week details from www.timetable.ul.ie');
  }

  // Return parsed week details
  return parseWeekDetails($);
}
