import { IRoomTimetable } from '../types';
import { parseRoomTimetableLesson, parseTimetable } from '../util/timetable-parsers';
import { isValidRoomId } from '../util/validators';
import { webscraper } from '../util/webscraper';

const roomTimetableURI = 'https://www.timetable.ul.ie/room_res.asp';

export async function roomTimetable(roomId: string): Promise<IRoomTimetable> {
  // Check that the room ID is valid
  if (!isValidRoomId(roomId)) {
    throw new Error('invalid room ID');
  }

  // Scrape room timetable from www.timetable.ul.ie
  let $: CheerioStatic;
  try {
    $ = await webscraper(roomTimetableURI, { T1: roomId.toUpperCase() });
  } catch (err) {
    throw new Error('failed to fetch room timetable from www.timetable.ul.ie');
  }

  // Return parsed room timetable
  return {
    roomId: roomId.toUpperCase(),
    lessons: parseTimetable($, parseRoomTimetableLesson),
  };
}
