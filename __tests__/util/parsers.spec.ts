import { LessonType } from '../../src/types';
import { hasGroups, parseCourseTimetableLesson, parseHyphenatedRoomId, parseModuleTimetableLesson, parseRoomIds, parseRoomTimetableLesson, parseStudentTimetableLesson, parseWeekIds } from '../../src/util/parsers';
import { courseTimetableLesson, moduleTimetableLesson, roomTimetableLesson, studentTimetableLesson, roomTimetableBooking } from '../html/timetable-lessons';

describe('parseWeekDetails()', () => {
  it('parses week details');
});

describe('parseModuleDetails()', () => {
  it('parses module details');
});

describe('parseModuleExamTimetable()', () => {
  it('parses module exam timetables');
});

describe('parseStudentExamTimetable()', () => {
  it('parses student exam timetables');
});

describe('parseTimetable()', () => {
  it('parses timetables using the supplied lesson parser');
});

describe('parseModuleTimetableLesson()', () => {
  it('parses a single lesson from a module timetable', () => {
    const lesson = parseModuleTimetableLesson(moduleTimetableLesson);
    expect(lesson).toEqual({
      fromTime: '09:00',
      toTime: '10:00',
      lessonType: LessonType.TUT,
      group: '3B',
      instructor: 'EATON MALACHY DR',
      roomIds: ['SG19'],
      weekIds: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '11', '12', '13'],
    });
  });
});

describe('parseRoomTimetableLesson()', () => {
  it('parses a single lesson from a room timetable', () => {
    const lesson = parseRoomTimetableLesson(roomTimetableLesson);
    expect(lesson).toEqual({
      fromTime: '11:00',
      toTime: '12:00',
      moduleIds: ['AC4004', 'AC4034'],
      lessonType: LessonType.LEC,
      groups: null,
      size: 201,
      instructor: 'WHELAN JOANNE MS',
      weekIds: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '11', '12', '13'],
    });
  });

  it('parses a single booking from a room timetable', () => {
    const lesson = parseRoomTimetableLesson(roomTimetableBooking);
    expect(lesson).toEqual({
      fromTime: '14:00',
      toTime: '18:00',
      moduleIds: null,
      lessonType: LessonType.RMBKG,
      size: 0,
      groups: null,
      instructor: null,
      weekIds: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '11', '12', '13', '14'],
    });
  });
});

describe('parseCourseTimetableLesson()', () => {
  it('parses a single lesson from a course timetable', () => {
    const lesson = parseCourseTimetableLesson(courseTimetableLesson);
    expect(lesson).toEqual({
      fromTime: '12:00',
      toTime: '13:00',
      moduleId: 'EE4013',
      lessonType: LessonType.LEC,
      group: null,
      instructor: 'MURPHY KEVIN DR',
      roomIds: ['FG042'],
      weekIds: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '11', '12', '13'],
    });
  });
});

describe('parseStudentTimetableLesson()', () => {
  it('parses a single lesson from a student timetable', () => {
    const lesson = parseStudentTimetableLesson(studentTimetableLesson);
    expect(lesson).toEqual({
      fromTime: '15:00',
      toTime: '17:00',
      moduleId: 'CS4076',
      lessonType: LessonType.LAB,
      group: '2A',
      roomIds: ['CS3005B'],
      weekIds: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '11', '12', '13'],
    });
  });
});

describe('parseHyphenatedRoomId()', () => {
  it('expands a room ID range to an array of room IDs', () => {
    expect(parseHyphenatedRoomId('A211-4')).toEqual(['A211', 'A212', 'A213', 'A214']);
  });

  it('trims spaces from input', () => {
    expect(parseHyphenatedRoomId('   A211-4 ')).toEqual(['A211', 'A212', 'A213', 'A214']);
  });

  it('capitalizes output', () => {
    expect(parseHyphenatedRoomId('a211-4')).toEqual(['A211', 'A212', 'A213', 'A214']);
  });
});

describe('parseRoomIds()', () => {
  it('expands an array of room IDs and room ID ranges', () => {
    expect(parseRoomIds('CSG001 C1049-51')).toEqual(['CSG001', 'C1049', 'C1050', 'C1051']);
  });

  it('trims spaces from input', () => {
    expect(parseRoomIds(' CSG001   C1049-51   ')).toEqual(['CSG001', 'C1049', 'C1050', 'C1051']);
  });

  it('capitalizes output', () => {
    expect(parseRoomIds('csg001 c1049-51')).toEqual(['CSG001', 'C1049', 'C1050', 'C1051']);
  });
});

describe('parseWeekIds()', () => {
  it('expands an array of week IDs and week ID ranges', () => {
    expect(parseWeekIds('1-5,11,12-13')).toEqual(['1', '2', '3', '4', '5', '11', '12', '13']);
  });

  it('trims spaces from input', () => {
    expect(parseWeekIds('  1-5,11,12-13     ')).toEqual(['1', '2', '3', '4', '5', '11', '12', '13']);
  });
});

describe('hasGroups()', () => {
  it('returns true for labs', () => {
    expect(hasGroups(LessonType.LAB)).toBe(true);
  });

  it('returns true for tutorials', () => {
    expect(hasGroups(LessonType.TUT)).toBe(true);
  });

  it('returns false for lectures', () => {
    expect(hasGroups(LessonType.LEC)).toBe(false);
  });

  it('returns false for room bookings', () => {
    expect(hasGroups(LessonType.RMBKG)).toBe(false);
  });
});
