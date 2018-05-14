export function isValidCourseId(courseId: string): boolean {
  const courseIdRegex = /^[A-Z]{2}[0-9]{3}$/i;

  return courseIdRegex.test(courseId);
}

export function isValidModuleId(moduleId: string): boolean {
  const moduleIdRegex = /^[A-Z]{2}[0-9]{4}$/i;

  return moduleIdRegex.test(moduleId);
}

export function isValidRoomId(roomId: string): boolean {
  const roomIdRegex = /^(?:S|KB|CS|GL|F|ER|LC|L|SR|P|HS|A|B|C|D|E|AD|IW|GEMS)[BGMO0123][0-9]+[A-Z]?$/i;

  return roomIdRegex.test(roomId);
}

export function isValidStudentId(studentId: string): boolean {
  const studentIdRegex = /^[0-9]{7,8}$/;

  return studentIdRegex.test(studentId);
}
