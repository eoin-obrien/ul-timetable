# ul-timetable

[![Dependencies][dependencies-badge]][dependencies]
[![Dev Dependencies][dev-dependencies-badge]][dev-dependencies]
[![Build Status][travis-badge]][travis-ci]

[![GPL-3.0][license-badge]][LICENSE]
[![Maintainability][maintainability-badge]][maintainability]
[![Coverage][coverage-badge]][coverage]

A webscraper for the University of Limerick's timetable, provided as an npm package.

## Install

```shell
npm install ul-timetable --save
```

## Use

### ES6 (`import`/`export`)

```js
import { studentTimetable } from 'ul-timetable';

const myTimetable = await studentTimetable('12345678');
console.log(myTimetable);
```

### CommonJS (`require()`)

```js
const studentTimetable = require('ul-timetable').studentTimetable;

const myTimetable = await studentTimetable('12345678');
console.log(myTimetable);
```

## API

See [types.ts][types] for more details on the return types of each function.

### `courseTimetable(id: string, year: number): Promise<ICourseTimetable>`

Fetches a course timetable for a given year from [www.timetable.ul.ie/course.asp][course-timetable].

Returns a `Promise`.

### `moduleTimetable(id: string): Promise<IModuleTimetable>`

Fetches a module timetable from [www.timetable.ul.ie/tt_mod.asp][module-timetable].

Returns a `Promise`.

### `roomTimetable(id: string): Promise<IRoomTimetable>`

Fetches a room timetable from [www.timetable.ul.ie/tt_room.asp][student-timetable].

Returns a `Promise`.

### `studentTimetable(id: string): Promise<IStudentTimetable>`

Fetches a student timetable from [www.timetable.ul.ie/tt1.asp][student-timetable].

Returns a `Promise`.

### `moduleExamTimetable(id: string): Promise<IModuleExamTimetable>`

Fetches a module exam timetable from [www.timetable.ul.ie/tt_exam.asp][module-exam-timetable].

Returns a `Promise`.

### `studentExamTimetable(id: string): Promise<IStudentExamTimetable>`

Fetches a student exam timetable from [www.timetable.ul.ie/examstudent.asp][student-exam-timetable].

Returns a `Promise`.

### `moduleDetails(id: string): Promise<IModuleDetails>`

Fetches details on a module from [www.timetable.ul.ie/tt_moduledetails.asp][module-details].

Returns a `Promise`.

### `roomDetails(id: string): Promise<IRoomDetails>`

Fetches details on a room from [www.timetable.ul.ie/Classrooms_Web_Info.xls][room-details].

Returns a `Promise`.

### `weekDates(): Promise<IWeekDate[]>`

Fetches week numbers and dates from [www.timetable.ul.ie/weeks.htm][week-dates].

Returns a `Promise`.

## Scripts

+ `clean` - remove coverage data, Jest cache and transpiled files
+ `build` - transpile TypeScript to ES6
+ `watch` - interactive watch mode to automatically transpile source files
+ `lint` - lint source files and tests
+ `test` - run tests
+ `test:watch` - interactive watch mode to automatically re-run tests

## Development

This project uses the [Conventional Commits][conventional] standard for Git commit messages.
Commits are linted using a hook for `commitlint`, and are also validated by the Travis CI script.

## License

Licensed under the GNU General Public License v3.0. See the [LICENSE][license] file for details.

[dependencies-badge]: https://david-dm.org/eoin-obrien/ul-timetable/status.svg
[dependencies]: https://david-dm.org/eoin-obrien/ul-timetable
[dev-dependencies-badge]: https://david-dm.org/eoin-obrien/ul-timetable/dev-status.svg
[dev-dependencies]: https://david-dm.org/eoin-obrien/ul-timetable?type=dev
[travis-badge]: https://travis-ci.org/eoin-obrien/ul-timetable.svg?branch=master
[travis-ci]: https://travis-ci.org/eoin-obrien/ul-timetable
[license-badge]: https://img.shields.io/github/license/eoin-obrien/ul-timetable.svg
[license]: https://github.com/eoin-obrien/ul-timetable/blob/master/LICENSE
[maintainability-badge]: https://api.codeclimate.com/v1/badges/555faef752375847e10d/maintainability
[maintainability]: https://codeclimate.com/github/eoin-obrien/ul-timetable/maintainability
[coverage-badge]: https://api.codeclimate.com/v1/badges/555faef752375847e10d/test_coverage
[coverage]: https://codeclimate.com/github/eoin-obrien/ul-timetable/test_coverage
[types]: https://github.com/eoin-obrien/ul-timetable/blob/master/src/types.ts
[course-timetable]: https://www.timetable.ul.ie/course.asp
[module-timetable]: https://www.timetable.ul.ie/tt_mod.asp
[room-timetable]: https://www.timetable.ul.ie/tt_room.asp
[student-timetable]: https://www.timetable.ul.ie/tt1.asp
[module-exam-timetable]: https://www.timetable.ul.ie/tt_exam.asp
[student-exam-timetable]: https://www.timetable.ul.ie/examstudent.asp
[module-details]: https://www.timetable.ul.ie/tt_moduledetails.asp
[room-details]: https://timetable.ul.ie/Classrooms_Web_Info.xls
[week-dates]: https://www.timetable.ul.ie/weeks.htm
[conventional]: https://conventionalcommits.org/
