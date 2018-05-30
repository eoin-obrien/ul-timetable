import { LessonType } from '../../src';
import {
  parseGroup,
  parseGroups,
  parseHyphenatedRoomId,
  parseInstructor,
  parseLessonType,
  parseModuleIds,
  parseRoomIds,
  parseWeekIds,
} from '../../src/util/attribute-parsers';

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
    expect(parseWeekIds('  1,5,11,12,13     ')).toEqual(['1', '5', '11', '12', '13']);
  });
});

describe('parseGroup()', () => {
  it('parses groups', () => {
    expect(parseGroup('3A')).toBe('3A');
  });

  it('returns null for the empty string', () => {
    expect(parseGroup('')).toBe(null);
  });

  it('returns null for &nbsp;', () => {
    expect(parseGroup('&#xA0;')).toBe(null);
  });
});

describe('parseGroups()', () => {
  it('parses single groups', () => {
    expect(parseGroups('3A')).toEqual(['3A']);
  });

  it('parses multiple groups', () => {
    expect(parseGroups('3A 2B')).toEqual(['3A', '2B']);
  });

  it('returns null for the empty string', () => {
    expect(parseGroups('')).toBe(null);
  });

  it('returns null for &nbsp;', () => {
    expect(parseGroups('&#xA0;')).toBe(null);
  });
});

describe('parseInstructor()', () => {
  it('parses instructors', () => {
    expect(parseInstructor('MURPHY JOHN DR')).toBe('MURPHY JOHN DR');
  });

  it('returns null for the empty string', () => {
    expect(parseInstructor('')).toBe(null);
  });

  it('returns null for &nbsp;', () => {
    expect(parseInstructor('&#xA0;')).toBe(null);
  });
});

describe('parseModuleIds()', () => {
  it('parses single module IDs', () => {
    expect(parseModuleIds('CS4004')).toEqual(['CS4004']);
  });

  it('parses multiple module IDs', () => {
    expect(parseModuleIds('CS4004 CS4416')).toEqual(['CS4004', 'CS4416']);
  });

  it('returns null for the empty string', () => {
    expect(parseModuleIds('')).toBe(null);
  });

  it('returns null for &nbsp;', () => {
    expect(parseModuleIds('&#xA0;')).toBe(null);
  });
});

describe('parseLessonType()', () => {
  it('parses labs', () => {
    expect(parseLessonType('LAB')).toBe(LessonType.LAB);
  });

  it('parses tutorials', () => {
    expect(parseLessonType('TUT')).toBe(LessonType.TUT);
  });

  it('parses lectures', () => {
    expect(parseLessonType('LEC')).toBe(LessonType.LEC);
  });

  it('parses room bookings', () => {
    expect(parseLessonType('RMBKG')).toBe(LessonType.RMBKG);
  });
});
