import * as cheerio from 'cheerio';

import { roomTimetable } from '../../src';
import { Day, IRoomTimetable } from '../../src/types';
import { parseRoomTimetableLesson, parseTimetable } from '../../src/util/timetable-parsers';
import { isValidRoomId } from '../../src/util/validators';
import { webscraper } from '../../src/util/webscraper';

jest.mock('../../src/util/timetable-parsers');
jest.mock('../../src/util/validators');
jest.mock('../../src/util/webscraper');

const roomTimetableURI = 'https://www.timetable.ul.ie/room_res.asp';
const $ = cheerio.load('');
const mockRoomTimetable: IRoomTimetable = {
  roomId: 'CSG001',
  lessons: {
    [Day.Monday]: [],
    [Day.Tuesday]: [],
    [Day.Wednesday]: [],
    [Day.Thursday]: [],
    [Day.Friday]: [],
    [Day.Saturday]: [],
  },
};

describe('roomTimetable()', () => {
  const roomId = 'CSG001';
  const invalidRoomId = 'apples';

  afterEach(() => {
    (<jest.Mock>webscraper).mockReset();
    (<jest.Mock>isValidRoomId).mockReset();
    (<jest.Mock>parseTimetable).mockReset();
  });

  it('requests and parses the room timetable', async () => {
    (<jest.Mock>isValidRoomId).mockImplementationOnce(() => true);
    (<jest.Mock>webscraper).mockImplementationOnce(async () => $);
    (<jest.Mock>parseTimetable).mockImplementationOnce(() => mockRoomTimetable.lessons);

    await expect(roomTimetable(roomId)).resolves.toEqual(mockRoomTimetable);
    expect(isValidRoomId).toBeCalledWith(roomId);
    expect(webscraper).toBeCalledWith(roomTimetableURI, { T1: roomId });
    expect(parseTimetable).toBeCalledWith($, parseRoomTimetableLesson);
  });

  it('throws an error if the room ID is invalid', async () => {
    (<jest.Mock>isValidRoomId).mockImplementationOnce(() => false);

    await expect(roomTimetable(invalidRoomId)).rejects
      .toEqual(new Error('invalid room ID'));
    expect(isValidRoomId).toBeCalledWith(invalidRoomId);
    expect(webscraper).not.toBeCalled();
    expect(parseTimetable).not.toBeCalled();
  });

  it('throws an error if the request fails', async () => {
    (<jest.Mock>isValidRoomId).mockImplementationOnce(() => true);
    (<jest.Mock>webscraper).mockImplementationOnce(async () => { throw new Error(); });

    await expect(roomTimetable(roomId)).rejects
      .toEqual(new Error('failed to fetch room timetable from www.timetable.ul.ie'));
    expect(isValidRoomId).toBeCalledWith(roomId);
    expect(webscraper).toBeCalledWith(roomTimetableURI, { T1: roomId });
    expect(parseTimetable).not.toBeCalled();
  });
});
