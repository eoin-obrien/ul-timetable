import { webscraper } from '../util/webscraper';

export interface IWeek {
  startDate: string;
  teachingWeek: string;
  timetableWeek: string;
}

const weekDatesURI = 'https://www.timetable.ul.ie/weeks.htm';

const weekSelector = 'body > table > tbody > tr';
const startDateSelector = 'td:nth-child(1)';
const teachingWeekSelector = 'td:nth-child(2)';
const timetableWeekSelector = 'td:nth-child(3)';

export async function weekDates(): Promise<IWeek[]> {
  let $: CheerioStatic;

  // Scrape week dates from www.timetable.ul.ie
  try {
    $ = await webscraper(weekDatesURI);
  } catch (err) {
    throw new Error('failed to fetch week dates from www.timetable.ul.ie');
  }

  // Return parsed week data
  return parseWeeks($);
}

export function parseWeeks($: CheerioStatic): IWeek[] {
  const weeks: IWeek[] = [];

  $(weekSelector)
    .slice(1)
    .each((_: number, row: CheerioElement) => {
      weeks.push({
        timetableWeek: $(timetableWeekSelector, row).text(),
        teachingWeek: $(teachingWeekSelector, row).text(),
        startDate: $(startDateSelector, row).text(),
      });
    });

  return weeks;
}
