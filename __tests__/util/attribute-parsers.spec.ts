import { LessonType } from '../../src/types';
import { hasGroups, parseHyphenatedRoomId, parseRoomIds, parseWeekIds } from '../../src/util/attribute-parsers';

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
