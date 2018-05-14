export const buildings: { [key: string]: string } = {
  S: 'Schuman Building',
  KB: 'Kemmy Business School',
  CS: 'Computer Science Building',
  GL: 'Glucksman Library',
  F: 'Foundation Building',
  ER: 'Engineering Research Building',
  LC: 'Languages Building',
  L: 'Lonsdale Building',
  SR: 'Schrödinger Building',
  P: 'PESS Building',
  HS: 'Health Sciences Building',
  A: 'Main Building Block A',
  B: 'Main Building Block B',
  C: 'Main Building Block C',
  D: 'Main Building Block D',
  E: 'Main Building Block E',
  AD: 'Analog Devices Building',
  IW: 'Irish World Academy Building',
  GEMS: 'Medical School',
};

export const floors = ['B', 'G', 'M', 'O', '0', '1', '2', '3'];

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
