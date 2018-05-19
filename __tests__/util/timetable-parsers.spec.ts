import cheerio from 'cheerio';

import { Day, IModuleDetails, IModuleExamTimetable, IWeekDetails, LessonType } from '../../src/types';
import {
  parseCourseTimetableLesson,
  parseModuleDetails,
  parseModuleExamTimetable,
  parseModuleTimetableLesson,
  parseRoomTimetableLesson,
  parseStudentExamTimetable,
  parseStudentTimetableLesson,
  parseTimetable,
  parseWeekDetails,
} from '../../src/util/timetable-parsers';
import {
  courseTimetableLesson,
  moduleTimetableLesson,
  roomTimetableBooking,
  roomTimetableLesson,
  studentTimetableLesson,
} from '../html/timetable-lessons';
import {
  courseTimetable,
  moduleDetails,
  moduleExamTimetable,
  moduleTimetable,
  roomTimetable,
  studentExamTimetable,
  studentTimetable,
  weekDates,
} from '../html/timetables';

describe('parseWeekDetails()', () => {
  const $ = cheerio.load(weekDates);
  const mockWeeks: IWeekDetails[] = [
    { startDate: '22 Jan 2018', name: '1', id: '1' },
    { startDate: '29 Jan 2018', name: '2', id: '2' },
    { startDate: '05 Feb 2018', name: '3', id: '3' },
    { startDate: '12 Feb 2018', name: '4', id: '4' },
    { startDate: '19 Feb 2018', name: '5', id: '5' },
    { startDate: '26 Feb 2018', name: '6', id: '6' },
    { startDate: '05 Mar 2018', name: '7', id: '7' },
    { startDate: '12 Mar 2018', name: '8', id: '8' },
    { startDate: '19 Mar 2018', name: '9', id: '9' },
    { startDate: '26 Mar 2018', name: 'Easter Week', id: '10' },
    { startDate: '02 Apr 2018', name: '10', id: '11' },
    { startDate: '09 Apr 2018', name: '11', id: '12' },
    { startDate: '16 Apr 2018', name: '12', id: '13' },
    { startDate: '23 Apr 2018', name: '13', id: '14' },
  ];

  it('parses week details', () => {
    expect(parseWeekDetails($)).toEqual(mockWeeks);
  });
});

describe('parseModuleDetails()', () => {
  const $ = cheerio.load(moduleDetails);
  const mockModuleDetails: IModuleDetails = {
    id: 'CS4006',
    name: 'INTELLIGENT SYSTEMS',
  };

  it('parses module details', () => {
    expect(parseModuleDetails($)).toEqual(mockModuleDetails);
  });
});

describe('parseModuleExamTimetable()', () => {
  const $ = cheerio.load(moduleExamTimetable);
  const mockModuleExamTimetable: IModuleExamTimetable = {
    moduleId: 'CS4006',
    roomIds: ['EGO10'],
    date: new Date('2018-05-05T15:00:00.000Z'),
    info: '',
  };

  it('parses module exam timetables', () => {
    expect(parseModuleExamTimetable($)).toEqual(mockModuleExamTimetable);
  });
});

describe('parseStudentExamTimetable()', () => {
  const $ = cheerio.load(studentExamTimetable);
  const mockStudentExamTimetable: IModuleExamTimetable[] = [{
    date: new Date('2018-05-02T11:30:00.000Z'),
    info: '',
    moduleId: 'CS4115',
    roomIds: ['PG053'],
  }, {
    date: new Date('2018-05-05T15:00:00.000Z'),
    info: '',
    moduleId: 'CS4006',
    roomIds: ['EGO10'],
  }, {
    date: new Date('2018-05-09T08:00:00.000Z'),
    info: '',
    moduleId: 'CS4076',
    roomIds: ['PG053'],
  }, {
    date: new Date('2018-05-11T15:00:00.000Z'),
    info: '',
    moduleId: 'CS4187',
    roomIds: ['C1058', 'C1059', 'C1060', 'C1061', 'C1062'],
  }];

  it('parses student exam timetables', () => {
    expect(parseStudentExamTimetable($)).toEqual(mockStudentExamTimetable);
  });
});

describe('parseTimetable()', () => {
  it('parses course timetables using the supplied lesson parser', () => {
    const $ = cheerio.load(courseTimetable);
    const mockParse = jest.fn(() => ({}));
    expect(parseTimetable($, mockParse)).toEqual({
      [Day.Monday]: [{}, {}, {}, {}, {}, {}, {}, {}],
      [Day.Tuesday]: [{}, {}, {}, {}, {}, {}, {}],
      [Day.Wednesday]: [{}, {}, {}, {}, {}, {}, {}, {}],
      [Day.Thursday]: [{}, {}, {}, {}, {}, {}, {}],
      [Day.Friday]: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [Day.Saturday]: [],
    });
    const lessons = [
      ['09:00', '10:00', 'CS4416', 'LEC', '&#xA0;', 'NIKOLOV NIKOLA DR', 'CSG001', 'Wks:1-9,11-13\n      '],
      ['10:00', '11:00', 'CS4416', 'TUT', '3C', 'NIKOLOV NIKOLA DR', 'CSG025', 'Wks:1-9,11-13\n      '],
      ['10:00', '12:00', 'CS4084', 'LAB', '2C', 'BOTTERWECK GOETZ DR', 'CS2044', 'Wks:1-9,11-13\n      '],
      ['11:00', '12:00', 'EE4013', 'LAB', '2B', 'MURPHY KEVIN DR', 'B2005', 'Wks:1-9,11-13\n      '],
      ['12:00', '13:00', 'CS4004', 'LEC', '&#xA0;', 'POWER NORAH DR', 'D1050', 'Wks:1-9,11-13\n      '],
      ['13:00', '14:00', 'CS4014', 'LEC', '&#xA0;', 'RYAN CONOR PROFESSOR', 'S205', 'Wks:1-5\n      '],
      ['15:00', '16:00', 'CS4014', 'LAB', '2A', 'RYAN CONOR PROFESSOR', 'CS2044', 'Wks:1-5\n      '],
      ['17:00', '18:00', 'EE4013', 'LEC', '&#xA0;', 'MURPHY KEVIN DR', 'C1063', 'Wks:1-9,11-13\n      '],
      ['09:00', '11:00', 'CS4084', 'LAB', '2B', 'BOTTERWECK GOETZ DR', 'CS2044', 'Wks:1-9,11-13\n      '],
      ['11:00', '12:00', 'CS4416', 'LAB', '2A', 'NIKOLOV NIKOLA DR', 'CS2044', 'Wks:1-9,11-13\n      '],
      ['12:00', '13:00', 'CS4416', 'LAB', '2C', 'NIKOLOV NIKOLA DR', 'CS2044', 'Wks:1-9,11-13\n      '],
      ['13:00', '14:00', 'CS4416', 'LAB', '2E', 'NIKOLOV NIKOLA DR', 'CS2044', 'Wks:1-9,11-13\n      '],
      ['14:00', '15:00', 'CS4416', 'LAB', '2D', 'NIKOLOV NIKOLA DR', 'CS2044', 'Wks:1-9,11-13\n      '],
      ['15:00', '16:00', 'CS4084', 'TUT', '3B', 'BOTTERWECK GOETZ DR', 'SG18', 'Wks:1-9,11-13\n      '],
      ['16:00', '17:00', 'CS4084', 'LEC', '&#xA0;', 'BOTTERWECK GOETZ DR', 'KBG12', 'Wks:1-9,11-13\n      '],
      ['09:00', '10:00', 'EE4013', 'LAB', '2A', 'MURPHY KEVIN DR', 'B2005', 'Wks:1-9,11-13\n      '],
      ['09:00', '10:00', 'CS4004', 'LAB', '2B', 'POWER NORAH DR', 'CS1044', 'Wks:1-9,11-13\n      '],
      ['09:00', '10:00', 'CS4416', 'LAB', '2B', 'NIKOLOV NIKOLA DR', 'CS2044', 'Wks:1-9,11-13\n      '],
      ['10:00', '11:00', 'CS4416', 'TUT', '3B', 'NIKOLOV NIKOLA DR', 'SG19', 'Wks:1-9,11-13\n      '],
      ['11:00', '12:00', 'CS4416', 'TUT', '3A', 'NIKOLOV NIKOLA DR', 'SG16', 'Wks:1-9,11-13\n      '],
      ['12:00', '13:00', 'CS4004', 'LAB', '2D', 'POWER NORAH DR', 'CS1044', 'Wks:1-9,11-13\n      '],
      ['13:00', '14:00', 'CS4416', 'TUT', '3D', 'NIKOLOV NIKOLA DR', 'CSG025', 'Wks:1-9,11-13\n      '],
      ['14:00', '15:00', 'CS4416', 'LEC', '&#xA0;', 'NIKOLOV NIKOLA DR', 'FB028', 'Wks:1-9,11-13\n      '],
      ['09:00', '10:00', 'CS4416', 'TUT', '3E', 'NIKOLOV NIKOLA DR', 'S116', 'Wks:1-9,11-13\n      '],
      ['10:00', '11:00', 'CS4004', 'LAB', '2A', 'POWER NORAH DR', 'CS1044', 'Wks:1-9,11-13\n      '],
      ['10:00', '11:00', 'CS4084', 'TUT', '3C', 'BOTTERWECK GOETZ DR', 'SG19', 'Wks:1-9,11-13\n      '],
      ['12:00', '13:00', 'EE4013', 'LAB', '2C', 'MURPHY KEVIN DR', 'B2005', 'Wks:1-9,11-13\n      '],
      ['13:00', '14:00', 'CS4004', 'LEC', '&#xA0;', 'POWER NORAH DR', 'CSG001', 'Wks:1-9,11-13\n      '],
      ['14:00', '15:00', 'CS4014', 'LEC', '&#xA0;', 'RYAN CONOR PROFESSOR', 'S206', 'Wks:1-5\n      '],
      ['15:00', '17:00', 'CS4084', 'LAB', '2A', 'BOTTERWECK GOETZ DR', 'CS2044', 'Wks:1-9,11-13\n      '],
      ['09:00', '10:00', 'CS4084', 'TUT', '3A', 'BOTTERWECK GOETZ DR', 'S114', 'Wks:1-9,11-13\n      '],
      ['09:00', '10:00', 'CS4004', 'TUT', '3B', 'POWER NORAH DR', 'SG19', 'Wks:1-9,11-13\n      '],
      ['10:00', '11:00', 'CS4004', 'TUT', '3C', 'POWER NORAH DR', 'SG19', 'Wks:1-9,11-13\n      '],
      ['11:00', '12:00', 'CS4084', 'LEC', '&#xA0;', 'BOTTERWECK GOETZ DR', 'C1063', 'Wks:1-9,11-13\n      '],
      ['11:00', '12:00', 'CS4004', 'TUT', '3A', 'POWER NORAH DR', 'SG19', 'Wks:1-9,11-13\n      '],
      ['12:00', '13:00', 'EE4013', 'LEC', '&#xA0;', 'MURPHY KEVIN DR', 'FG042', 'Wks:1-9,11-13\n      '],
      ['14:00', '15:00', 'CS4014', 'LEC', '&#xA0;', 'RYAN CONOR PROFESSOR', 'S205', 'Wks:1-5\n      '],
      ['15:00', '16:00', 'CS4004', 'TUT', '3D', 'POWER NORAH DR', 'SG19', 'Wks:1-9,11-13\n      '],
      ['16:00', '17:00', 'CS4004', 'LAB', '2C', 'POWER NORAH DR', 'CS1044', 'Wks:1-9,11-13\n      '],
    ];
    for (const lesson of lessons) {
      expect(mockParse).toBeCalledWith(lesson);
    }
  });

  it('parses module timetables using the supplied lesson parser', () => {
    const $ = cheerio.load(moduleTimetable);
    const mockParse = jest.fn(() => ({}));
    expect(parseTimetable($, mockParse)).toEqual({
      [Day.Monday]: [{}, {}],
      [Day.Tuesday]: [{}, {}],
      [Day.Wednesday]: [],
      [Day.Thursday]: [{}],
      [Day.Friday]: [{}],
      [Day.Saturday]: [],
    });
    const lessons = [
      ['09:00', '10:00', 'TUT', '3A', 'EATON MALACHY DR', 'SG19', 'Wks:1-9,11-13\n      '],
      ['11:00', '12:00', 'LEC', '&#xA0;', 'EATON MALACHY DR', 'KBG13', 'Wks:1-9,11-13\n      '],
      ['09:00', '10:00', 'TUT', '3B', 'EATON MALACHY DR', 'SG19', 'Wks:1-9,11-13\n      '],
      ['10:00', '11:00', 'LAB', '2A', 'EATON MALACHY DR', 'CS3005B', 'Wks:1-9,11-13\n      '],
      ['12:00', '13:00', 'LEC', '&#xA0;', 'EATON MALACHY DR', 'KBG13', 'Wks:1-9,11-13\n      '],
      ['09:00', '10:00', 'LAB', '2B', 'EATON MALACHY DR', 'CS3005B', 'Wks:1-9,11-13\n      '],
    ];
    for (const lesson of lessons) {
      expect(mockParse).toBeCalledWith(lesson);
    }
  });

  it('parses room timetables using the supplied lesson parser', () => {
    const $ = cheerio.load(roomTimetable);
    const mockParse = jest.fn(() => ({}));
    expect(parseTimetable($, mockParse)).toEqual({
      [Day.Monday]: [{}, {}, {}, {}, {}, {}, {}, {}],
      [Day.Tuesday]: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
      [Day.Wednesday]: [{}, {}, {}, {}, {}, {}, {}],
      [Day.Thursday]: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
      [Day.Friday]: [{}, {}, {}, {}, {}, {}, {}],
      [Day.Saturday]: [],
    });
    const lessons = [
      ['09:00', '10:00', 'CS4416', 'LEC', '', 'Size - 141', 'NIKOLOV NIKOLA DR', 'Wks:1-9,11-13\n      '],
      ['10:00', '11:00', 'PS4052', 'LEC', '', 'Size - 93', 'O&apos;BRIEN SANDRA MS', 'Wks:1-2,4-5,8-9,11\n      '],
      ['11:00', '12:00', 'RM4002 RM4006', 'TUT', '3A 3A', 'Size - 189', 'RIEDER MARIA MS', 'Wks:7,9,11\n      '],
      ['12:00', '13:00', 'MK4025', 'LEC', '', 'Size - 135', 'PATTERSON MAURICE DR', 'Wks:1-9,11-13\n      '],
      ['13:00', '14:00', 'MA4402', 'LEC', '', 'Size - 116', 'GABURRO ROMINA DR', 'Wks:3-9,11-13\n      '],
      ['13:00', '14:00', 'MA4402', 'LEC', '', 'Size - 116', 'HEALY PATRICK DR GABURRO ROMINA DR', 'Wks:1-2\n      '],
      ['14:00', '16:00', 'AC4214', 'LEC', '', 'Size - 160', 'BREATHNACH MAIREAD', 'Wks:1-9,11-13\n      '],
      ['17:00', '18:00', 'TX4407', 'LEC', '', 'Size - 125', 'MCCARTHY BRENDAN MR', 'Wks:1-9,11-13\n      '],
      ['09:00', '11:00', 'NS6038', 'LEC', '', 'Size - 164', 'GRAHAM MARGARET DR MESKELL PAULINE MS', 'Wks:1-2,4,7,11,13\n      '],
      ['09:00', '12:00', '&#xA0;', 'RMBKG', '', 'Size - 0', '&#xA0;', 'Wks:16\n      '],
      ['09:00', '11:00', 'NS6038', 'LEC', '1A', 'Size - 50', 'GRAHAM MARGARET DR MESKELL PAULINE MS', 'Wks:3,5-6,8-9,12\n      '],
      ['11:00', '12:00', 'AC4004 AC4034', 'LEC', '', 'Size - 201', 'WHELAN JOANNE MS', 'Wks:1-9,11-13\n      '],
      ['12:00', '15:00', '&#xA0;', 'RMBKG', '', 'Size - 0', '&#xA0;', 'Wks:16\n      '],
      ['12:00', '13:00', 'TX4407', 'LEC', '', 'Size - 125', 'MCCARTHY BRENDAN MR', 'Wks:1-9,11-13\n      '],
      ['14:00', '15:00', 'CS4076', 'LEC', '', 'Size - 50', 'EXTON CHRIS DR', 'Wks:1-9,11-13\n      '],
      ['15:00', '18:00', '&#xA0;', 'RMBKG', '', 'Size - 0', '&#xA0;', 'Wks:16\n      '],
      ['15:00', '16:00', 'CS4222 CS5052', 'LEC', '', 'Size - 152', 'MC ELLIGOTT ANNETTE MS', 'Wks:1-9,11-13\n      '],
      ['16:00', '17:00', 'CS4049', 'LEC', '', 'Size - 35', 'MCCARTHY LEON MR', 'Wks:1-9,11-13\n      '],
      ['17:00', '18:00', 'AC4024', 'LEC', '', 'Size - 209', 'REGAN KATHLEEN', 'Wks:1-9,11-13\n      '],
      ['18:00', '19:00', '&#xA0;', 'RMBKG', '', 'Size - 0', '&#xA0;', 'Wks:9\n      '],
      ['09:00', '10:00', 'MK4008', 'LEC', '', 'Size - 71', 'REIDY SEAN MR', 'Wks:1-9,11-13\n      '],
      ['10:00', '11:00', 'CS4005', 'LEC', '', 'Size - 64', 'O&apos;CONNOR NEIL MR', 'Wks:1-9,11-13\n      '],
      ['11:00', '12:00', 'EC4014', 'LEC', '', 'Size - 185', 'FLANNERY DARRAGH DR', 'Wks:1-9,11-13\n      '],
      ['12:00', '15:00', '&#xA0;', 'RMBKG', '', 'Size - 0', '&#xA0;', 'Wks:16\n      '],
      ['12:00', '14:00', 'CS4457', 'LEC', '', 'Size - 146', 'DE WILLE TABEA', 'Wks:1-9,11-13\n      '],
      ['14:00', '18:00', '&#xA0;', 'RMBKG', '', 'Size - 0', '&#xA0;', 'Wks:1-9,11-14\n      '],
      ['15:00', '18:00', '&#xA0;', 'RMBKG', '', 'Size - 0', '&#xA0;', 'Wks:16\n      '],
      ['09:00', '10:00', '&#xA0;', 'RMBKG', '', 'Size - 65', '&#xA0;', 'Wks:3-9,11-13\n      '],
      ['09:00', '12:00', '&#xA0;', 'RMBKG', '', 'Size - 0', '&#xA0;', 'Wks:14-16\n      '],
      ['10:00', '11:00', '&#xA0;', 'RMBKG', '', 'Size - 0', '&#xA0;', 'Wks:3\n      '],
      ['11:00', '12:00', 'AC4034 AC4004', 'LEC', '', 'Size - 201', 'WHELAN JOANNE MS', 'Wks:1-9,11-13\n      '],
      ['12:00', '13:00', 'MU4136', 'LEC', '', 'Size - 118', 'ANO1HUM', 'Wks:5,11\n      '],
      ['12:00', '13:00', 'MU4136', 'LEC', '', 'Size - 118', 'KEEGAN NIALL DR', 'Wks:1,6,12\n      '],
      ['12:00', '13:00', 'MU4136', 'LEC', '', 'Size - 118', 'NI BHRIAIN ORFHLAITH DR.', 'Wks:2,7,13\n      '],
      ['12:00', '15:00', '&#xA0;', 'RMBKG', '', 'Size - 0', '&#xA0;', 'Wks:14-16\n      '],
      ['12:00', '13:00', 'MU4136', 'LEC', '', 'Size - 118', 'MELIN MATS DR', 'Wks:4,9\n      '],
      ['12:00', '13:00', 'MU4136', 'LEC', '', 'Size - 118', 'DOWNEY JEAN MS', 'Wks:3,8\n      '],
      ['13:00', '14:00', 'CS4004', 'LEC', '', 'Size - 109', 'POWER NORAH DR', 'Wks:1-9,11-13\n      '],
      ['14:00', '15:00', 'CS4911', 'LEC', '', 'Size - 86', 'FITZGERALD BRIAN PROFESSOR', 'Wks:1-9,11-13\n      '],
      ['15:00', '18:00', '&#xA0;', 'RMBKG', '', 'Size - 0', '&#xA0;', 'Wks:14-16\n      '],
      ['15:00', '16:00', 'CS5052 CS4222', 'LEC', '', 'Size - 152', 'MC ELLIGOTT ANNETTE MS', 'Wks:1-9,11-13\n      '],
      ['16:00', '17:00', '&#xA0;', 'RMBKG', '', 'Size - 0', '&#xA0;', 'Wks:1\n      '],
      ['17:00', '18:00', 'MA4402', 'LEC', '', 'Size - 116', 'GABURRO ROMINA DR', 'Wks:3-9,11-13\n      '],
      ['18:00', '20:00', '&#xA0;', 'RMBKG', '', 'Size - 0', '&#xA0;', 'Wks:1\n      '],
      ['09:00', '11:00', 'LA4122', 'LEC', '', 'Size - 167', 'BURNS NORAH MS', 'Wks:1-9,11-13\n      '],
      ['09:00', '12:00', '&#xA0;', 'RMBKG', '', 'Size - 0', '&#xA0;', 'Wks:14-16\n      '],
      ['11:00', '13:00', 'AC4418', 'LEC', '', 'Size - 156', 'REGAN KATHLEEN', 'Wks:1-9,11-13\n      '],
      ['12:00', '15:00', '&#xA0;', 'RMBKG', '', 'Size - 0', '&#xA0;', 'Wks:14-16\n      '],
      ['13:00', '14:00', 'CS4040', 'LEC', '', 'Size - 31', 'MCCARTHY LEON MR', 'Wks:1-9,11-13\n      '],
      ['14:00', '15:00', 'AC4024', 'LEC', '', 'Size - 209', 'REGAN KATHLEEN', 'Wks:1-9,11-13\n      '],
      ['15:00', '16:00', 'MS4122', 'LEC', '', 'Size - 69', 'GABURRO ROMINA DR', 'Wks:1-9,11-13\n      '],
    ];
    for (const lesson of lessons) {
      expect(mockParse).toBeCalledWith(lesson);
    }
  });

  it('parses student timetables using the supplied lesson parser', () => {
    const $ = cheerio.load(studentTimetable);
    const mockParse = jest.fn(() => ({}));
    expect(parseTimetable($, mockParse)).toEqual({
      [Day.Monday]: [{}, {}, {}, {}],
      [Day.Tuesday]: [{}, {}],
      [Day.Wednesday]: [{}],
      [Day.Thursday]: [{}, {}, {}, {}, {}],
      [Day.Friday]: [{}, {}, {}, {}],
      [Day.Saturday]: [],
    });
    const lessons = [
      ['09:00', '10:00', 'CS4006', 'TUT', '3A', 'SG19', 'Wks:1-9,11-13\n      '],
      ['11:00', '12:00', 'CS4006', 'LEC', '&#xA0;', 'KBG13', 'Wks:1-9,11-13\n      '],
      ['15:00', '17:00', 'CS4076', 'LAB', '2A', 'CS3005B', 'Wks:1-9,11-13\n      '],
      ['17:00', '18:00', 'CS4115', 'LEC', '&#xA0;', 'KBG13', 'Wks:1-9,11-13\n      '],
      ['10:00', '11:00', 'CS4006', 'LAB', '2A', 'CS3005B', 'Wks:1-9,11-13\n      '],
      ['14:00', '15:00', 'CS4076', 'LEC', '&#xA0;', 'CSG001', 'Wks:1-9,11-13\n      '],
      ['12:00', '14:00', 'CS4457', 'LEC', '&#xA0;', 'CSG001', 'Wks:1-9,11-13\n      '],
      ['09:00', '11:00', 'CS4187', 'LEC', '&#xA0;', 'SG16', 'Wks:1-9,11-13\n      '],
      ['12:00', '13:00', 'CS4006', 'LEC', '&#xA0;', 'KBG13', 'Wks:1-9,11-13\n      '],
      ['13:00', '14:00', 'CS4115', 'LEC', '&#xA0;', 'KBG13', 'Wks:1-9,11-13\n      '],
      ['14:00', '16:00', 'CS4187', 'TUT', '3A', 'KB119', 'Wks:1-9,11-13\n      '],
      ['16:00', '17:00', 'CS4457', 'TUT', '3A', 'S115', 'Wks:2-9,11-13\n      '],
      ['10:00', '12:00', 'CS4187', 'TUT', '3A', 'SG20', 'Wks:1-9,11-13\n      '],
      ['12:00', '13:00', 'CS4076', 'LEC', '&#xA0;', 'KBG14', 'Wks:1-9,11-13\n      '],
      ['14:00', '15:00', 'CS4115', 'LEC', '&#xA0;', 'KBG10', 'Wks:1-9,11-13\n      '],
      ['16:00', '17:00', 'CS4115', 'LAB', '2B', 'CS3005B', 'Wks:1-9,11-13\n      '],
    ];
    for (const lesson of lessons) {
      expect(mockParse).toBeCalledWith(lesson);
    }
  });
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
      instructor: 'O\'BRIEN JOANNE MS',
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
