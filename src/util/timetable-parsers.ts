import * as he from 'he';
import * as moment from 'moment-timezone';

import {
  Day,
  ICourseTimetableLesson,
  IModuleDetails,
  IModuleExamTimetable,
  IModuleTimetableLesson,
  IRoomTimetableLesson,
  IStudentTimetableLesson,
  ITimetableLesson,
  ITimetableLessons,
  IWeekDate,
  LessonType,
} from '../types';
import { hasGroups, parseRoomIds, parseWeekIds } from './attribute-parsers';

const timezone = 'Europe/Dublin';
const examDateFormat = 'DD-MMM-YY HH:mm';
const weekDateFormat = 'DD MMM YYYY';

export function parseWeekDates($: CheerioStatic): IWeekDate[] {
  const weekSelector = 'body > table > tbody > tr:not(:first-child)';
  const startDateSelector = 'td:nth-child(1)';
  const teachingWeekSelector = 'td:nth-child(2)';
  const timetableWeekSelector = 'td:nth-child(3)';

  const weeks: IWeekDate[] = [];

  $(weekSelector).each((_: number, row: CheerioElement) => {
    weeks.push({
      id: $(timetableWeekSelector, row).text(),
      name: $(teachingWeekSelector, row).text(),
      startDate: moment.tz($(startDateSelector, row).text(), weekDateFormat, timezone).toDate(),
    });
  });

  return weeks;
}

export function parseModuleDetails($: CheerioStatic): IModuleDetails {
  const idSelector = 'body > b > table > tbody > tr > td > div > center > table > tbody > tr:nth-child(1) > td:nth-child(2)';
  const nameSelector = 'body > b > table > tbody > tr > td > div > center > table > tbody > tr:nth-child(2) > td:nth-child(2)';

  return {
    id: $(idSelector).text().trim(),
    name: he.decode($(nameSelector).text().trim()),
  };
}

export function parseModuleExamTimetable($: CheerioStatic): IModuleExamTimetable {
  const moduleIdSelector = 'body > b > table > tbody > tr > td > div > center > table > tbody > tr:nth-child(1) > td:nth-child(2)';
  const roomIdSelector = 'body > b > table > tbody > tr > td > div > center > table > tbody > tr:nth-child(6) > td:nth-child(2)';
  const dateSelector = 'body > b > table > tbody > tr > td > div > center > table > tbody > tr:nth-child(3) > td:nth-child(2)';
  const timeSelector = 'body > b > table > tbody > tr > td > div > center > table > tbody > tr:nth-child(7) > td:nth-child(2)';
  const infoSelector = 'body > b > table > tbody > tr > td > div > center > table > tbody > tr:nth-child(8) > td:nth-child(2)';

  const date = `${$(dateSelector).text().trim()} ${$(timeSelector).text().trim()}`;

  return {
    moduleId: $(moduleIdSelector).text().trim(),
    roomIds: parseRoomIds($(roomIdSelector).text()),
    date: moment.tz(date, examDateFormat, timezone).toDate(),
    info: $(infoSelector).text().trim(),
  };
}

export function parseStudentExamTimetable($: CheerioStatic): IModuleExamTimetable[] {
  const moduleTimetableSelector = 'body > b > table > tbody > tr > td > div > center > table > tbody';
  const moduleIdSelector = 'tr:nth-child(1) > td:nth-child(2)';
  const roomIdSelector = 'tr:nth-child(6) > td:nth-child(2)';
  const dateSelector = 'tr:nth-child(3) > td:nth-child(2)';
  const timeSelector = 'tr:nth-child(7) > td:nth-child(2)';
  const infoSelector = 'tr:nth-child(8) > td:nth-child(2)';

  const moduleExamTimetables: IModuleExamTimetable[] = [];

  $(moduleTimetableSelector).each((_: number, moduleTimetable: CheerioElement) => {
    const date = `${$(dateSelector, moduleTimetable).text().trim()} ${$(timeSelector, moduleTimetable).text().trim()}`;

    moduleExamTimetables.push({
      moduleId: $(moduleIdSelector, moduleTimetable).text().trim(),
      roomIds: parseRoomIds($(roomIdSelector, moduleTimetable).text()),
      date: moment.tz(date, examDateFormat, timezone).toDate(),
      info: $(infoSelector, moduleTimetable).text().trim(),
    });
  });

  return moduleExamTimetables;
}

export function parseTimetable<T extends ITimetableLesson>($: CheerioStatic, parseLesson: (parts: string[]) => T): ITimetableLessons<T> {
  const daySelector = 'body > div > table > tbody > tr:nth-child(2) > td';
  const lessonSelector = 'p:not(:last-child) > font > b';
  const lessonSplitRegex = /\s*(?:<font>.*?<\/font>|<br>)+\s*/g;

  const lessons: ITimetableLessons<T> = {
    [Day.Monday]: [],
    [Day.Tuesday]: [],
    [Day.Wednesday]: [],
    [Day.Thursday]: [],
    [Day.Friday]: [],
    [Day.Saturday]: [],
  };

  $(daySelector).each((day: Day, timetableDay: CheerioElement) => {
    $(lessonSelector, timetableDay).each((_: number, lesson: CheerioElement) => {
      const lessonParts = $(lesson).html().split(lessonSplitRegex);
      lessons[day].push(parseLesson(lessonParts));
    });
  });

  return lessons;
}

export function parseModuleTimetableLesson(lessonParts: string[]): IModuleTimetableLesson {
  const lessonType = <LessonType>LessonType[lessonParts[2]];

  return {
    fromTime: lessonParts[0],
    toTime: lessonParts[1],
    lessonType: lessonType,
    group: hasGroups(lessonType) ? lessonParts[3] : null,
    instructor: lessonParts[4] !== '&#xA0;' ? he.decode(lessonParts[4]) : null,
    roomIds: parseRoomIds(lessonParts[5]),
    weekIds: parseWeekIds(lessonParts[6]),
  };
}

export function parseRoomTimetableLesson(lessonParts: string[]): IRoomTimetableLesson {
  const lessonType = <LessonType>LessonType[lessonParts[3]];

  return {
    fromTime: lessonParts[0],
    toTime: lessonParts[1],
    moduleIds: lessonParts[2] !== '&#xA0;' ? lessonParts[2].split(/\s+/g) : null,
    lessonType: lessonType,
    groups: hasGroups(lessonType) ? lessonParts[4].split(/\s+/g) : null,
    size: Number(lessonParts[5].slice(7)),
    instructor: lessonParts[6] !== '&#xA0;' ? he.decode(lessonParts[6]) : null,
    weekIds: parseWeekIds(lessonParts[7]),
  };
}

export function parseCourseTimetableLesson(lessonParts: string[]): ICourseTimetableLesson {
  const lessonType = <LessonType>LessonType[lessonParts[3]];

  return {
    fromTime: lessonParts[0],
    toTime: lessonParts[1],
    moduleId: lessonParts[2],
    lessonType: lessonType,
    group: hasGroups(lessonType) ? lessonParts[4] : null,
    instructor: lessonParts[5]  !== '&#xA0;' ? he.decode(lessonParts[5]) : null,
    roomIds: parseRoomIds(lessonParts[6]),
    weekIds: parseWeekIds(lessonParts[7]),
  };
}

export function parseStudentTimetableLesson(lessonParts: string[]): IStudentTimetableLesson {
  const lessonType = <LessonType>LessonType[lessonParts[3]];

  return {
    fromTime: lessonParts[0],
    toTime: lessonParts[1],
    moduleId: lessonParts[2],
    lessonType: lessonType,
    group: hasGroups(lessonType) ? lessonParts[4] : null,
    roomIds: parseRoomIds(lessonParts[5]),
    weekIds: parseWeekIds(lessonParts[6]),
  };
}
