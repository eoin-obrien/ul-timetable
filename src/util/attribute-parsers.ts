import * as he from 'he';
import { isNull } from 'util';
import { LessonType } from '../types';

const nbspEscape = '&#xA0;';

export function parseHyphenatedRoomId(hyphenatedRoomId: string): string[] {
  // Split the ID on the hyphen and get the constant prefix of the range
  const parts = hyphenatedRoomId.toUpperCase().trim().split('-');
  const prefix = parts[0].slice(0, parts[0].length - parts[1].length);

  // Get the first and last numbers in the ID range
  const startNum = Number(parts[0].slice(prefix.length));
  const endNum = Number(parts[1]);

  // Construct an array of room IDs encompassed by the range
  const roomIds: string[] = [];
  for (let suffix = startNum; suffix <= endNum; suffix += 1) {
    roomIds.push(`${prefix}${suffix}`);
  }

  return roomIds;
}

export function parseRoomIds(roomIdString: string): string[] {
  // Split on whitespace
  const splitIds = roomIdString.toUpperCase().trim().split(/\s+/g);

  // Expand IDs where necessary
  const roomIds: string[] = [];
  for (const id of splitIds) {
    if (id.includes('-')) {
      roomIds.push(...parseHyphenatedRoomId(id));
    } else {
      roomIds.push(id);
    }
  }

  return roomIds;
}

export function parseWeekIds(weekIdString: string): string[] {
  // Returns a range of numbers as an array
  const range = (start: number, length: number) => [...Array(length).keys()].map((x: number) => String(x + start));

  // Expands an array of IDs and ID ranges into an array of IDs
  const expandRanges = (acc: string[], curr: string) => {
    // Expand hyphenated ID ranges
    if (curr.includes('-')) {
      const parts = curr.split('-');
      const start = Math.min(Number(parts[0]), Number(parts[1]));
      const length = Math.abs(Number(parts[0]) - Number(parts[1])) + 1;

      return acc.concat(range(start, length));
    }
    // Don't change single IDs
    acc.push(curr);

    return acc;
  };

  // Remove prefix and split into single weeks and ranges
  const weeks = weekIdString.slice(weekIdString.indexOf(':') + 1).trim().split(',');

  // Expand ranges
  return weeks.reduce(expandRanges, []);
}

export function parseGroup(group: string): string | null {
  if (isNull(group) || group === '' || group === nbspEscape) {
    return null;
  }

  return group;
}

export function parseGroups(groups: string): string[] | null {
  if (isNull(groups) || groups === '' || groups === nbspEscape) {
    return null;
  }

  return groups.split(/\s+/g);
}

export function parseModuleIds(moduleIds: string): string[] | null {
  if (isNull(moduleIds) || moduleIds === '' || moduleIds === nbspEscape) {
    return null;
  }

  return moduleIds.split(/\s+/g);
}

export function parseInstructor(instructor: string): string | null {
  if (isNull(instructor) || instructor === '' || instructor === nbspEscape) {
    return null;
  }

  return he.decode(instructor);
}

export function parseLessonType(lessonType: string): LessonType {
  switch (lessonType) {
    case 'LAB': return LessonType.LAB;
    case 'LEC': return LessonType.LEC;
    case 'TUT': return LessonType.TUT;
    default: return LessonType.RMBKG;
  }
}
