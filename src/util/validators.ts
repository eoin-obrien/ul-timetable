import { buildings, floors } from './constants';

const courseIdRegex = /^[A-Z]{2}[0-9]{3}$/i;
const moduleIdRegex = /^[A-Z]{2}[0-9]{4}$/i;
const roomIdRegex = new RegExp(`^(?:${Object.keys(buildings).join('|')})(?:${floors.join('|')})[0-9]+[A-Z]?$`, 'i');
const studentIdRegex = /^[0-9]{7,8}$/;

export function isValidCourseId(courseId: string): boolean {
  return courseIdRegex.test(courseId);
}

export function isValidModuleId(moduleId: string): boolean {
  return moduleIdRegex.test(moduleId);
}

export function isValidRoomId(roomId: string): boolean {
  return roomIdRegex.test(roomId);
}

export function isValidStudentId(studentId: string): boolean {
  return studentIdRegex.test(studentId);
}
