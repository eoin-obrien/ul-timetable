export enum Day {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}

export type DayKeys = keyof typeof Day;

export enum LessonType {
  LAB,
  LEC,
  TUT,
  RMBKG,
}

export interface IModuleExamTimetable {
  moduleId: string;
  roomIds: string[];
  date: string;
  time: string;
  info: string;
}

export interface IStudentExamTimetable {
  studentId: string;
  modules: IModuleExamTimetable[];
}

export interface ITimetableLesson {
  fromTime: string;
  toTime: string;
  lessonType: LessonType;
  weekIds: string[];
}

export interface IStudentTimetableLesson extends ITimetableLesson {
  moduleId: string;
  roomIds: string[];
  group: string | null;
}

export interface ICourseTimetableLesson extends ITimetableLesson {
  moduleId: string;
  roomIds: string[];
  group: string | null;
  instructor: string;
}

export interface IModuleTimetableLesson extends ITimetableLesson {
  roomIds: string[];
  group: string | null;
  instructor: string;
}

export interface IRoomTimetableLesson extends ITimetableLesson {
  moduleIds: string[];
  groups: string[] | null;
  size: number;
  instructor: string;
}

export interface ITimetableLessons<T extends ITimetableLesson> {
  [Day.Monday]: T[];
  [Day.Tuesday]: T[];
  [Day.Wednesday]: T[];
  [Day.Thursday]: T[];
  [Day.Friday]: T[];
  [Day.Saturday]: T[];
}

export interface IStudentTimetable {
  studentId: string;
  lessons: ITimetableLessons<IStudentTimetableLesson>;
}

export interface ICourseTimetable {
  courseId: string;
  lessons: ITimetableLessons<ICourseTimetableLesson>;
}

export interface IModuleTimetable {
  moduleId: string;
  lessons: ITimetableLessons<IModuleTimetableLesson>;
}

export interface IRoomTimetable {
  roomId: string;
  lessons: ITimetableLessons<IRoomTimetableLesson>;
}

export interface IModuleDetails {
  id: string;
  name: string;
}

export interface IRoomDetails {
  id: string;
  buildingName: string;
  building: string;
  floor: string;
  room: string;
}

export interface IWeekDetails {
  id: string;
  name: string;
  startDate: string;
}
