import { buildings, floors } from '../../src/util/constants';
import { isValidCourseId, isValidModuleId, isValidRoomId, isValidStudentId } from '../../src/util/validators';

describe('isValidCourseId()', () => {
  it('accepts course IDs with two letters followed by three digits', () => {
    expect(isValidCourseId('LM051')).toBe(true);
  });

  it('accepts lowercase course IDs', () => {
    expect(isValidCourseId('lm051')).toBe(true);
  });

  it('rejects course IDs with fewer than two letters', () => {
    expect(isValidCourseId('L051')).toBe(false);
  });

  it('rejects course IDs with more than two letters', () => {
    expect(isValidCourseId('LMA051')).toBe(false);
  });

  it('rejects course IDs with fewer than three digits', () => {
    expect(isValidCourseId('LM05')).toBe(false);
  });

  it('rejects course IDs with more than three digits', () => {
    expect(isValidCourseId('LM0511')).toBe(false);
  });
});

describe('isValidModuleId()', () => {
  it('accepts module IDs with two letters followed by four digits', () => {
    expect(isValidModuleId('CS4006')).toBe(true);
  });

  it('accepts lowercase module IDs', () => {
    expect(isValidModuleId('cs4006')).toBe(true);
  });

  it('rejects module IDs with fewer than two letters', () => {
    expect(isValidModuleId('C4006')).toBe(false);
  });

  it('rejects module IDs with more than two letters', () => {
    expect(isValidModuleId('CSS4006')).toBe(false);
  });

  it('rejects module IDs with fewer than four digits', () => {
    expect(isValidModuleId('CS400')).toBe(false);
  });

  it('rejects module IDs with more than four digits', () => {
    expect(isValidModuleId('CS40066')).toBe(false);
  });
});

describe('isValidRoomId()', () => {
  it('accepts valid building codes and floors suffixed by digits and an optional letter', () => {
    // Samples of valid suffixes for room codes
    const suffixes = ['001', '24A', '1', '01'];

    // Test every valid combination of building, floor and suffix
    for (const building of Object.keys(buildings)) {
      for (const floor of floors) {
        for (const suffix of suffixes) {
          expect(isValidRoomId(`${building}${floor}${suffix}`));
        }
      }
    }
  });

  it('accepts lowercase room IDs', () => {
    expect(isValidRoomId('csg001a')).toBe(true);
  });

  it('rejects invalid building codes', () => {
    expect(isValidModuleId('XXG001')).toBe(false);
  });

  it('rejects invalid floors', () => {
    expect(isValidModuleId('CSX001')).toBe(false);
  });

  it('rejects invalid suffixes', () => {
    expect(isValidModuleId('CSG001XX')).toBe(false);
    expect(isValidModuleId('CSGX')).toBe(false);
  });
});

describe('isValidStudentId()', () => {
  it('accepts seven-digit student IDs', () => {
    expect(isValidStudentId('1234567')).toBe(true);
  });

  it('accepts eight-digit student IDs', () => {
    expect(isValidStudentId('12345678')).toBe(true);
  });

  it('rejects student IDs with fewer than seven digits', () => {
    expect(isValidStudentId('123456')).toBe(false);
  });

  it('rejects student IDs with more than eight digits', () => {
    expect(isValidStudentId('123456789')).toBe(false);
  });

  it('rejects student IDs with non-numeric characters', () => {
    expect(isValidStudentId('1234567A')).toBe(false);
  });
});
