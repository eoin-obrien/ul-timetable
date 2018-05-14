import { roomDetails } from '../src';
import { IRoomDetails } from '../src/api/room-details';
import { buildings, floors } from '../src/util/constants';
import { isValidRoomId } from '../src/util/validators';

jest.mock('../src/util/validators');

describe('roomDetails()', () => {
  const invalidRoomId = '42';

  afterEach(() => {
    (<jest.Mock>isValidRoomId).mockReset();
  });

  it('parses the room details from the room ID', async () => {
    (<jest.Mock>isValidRoomId).mockReturnValue(true);

    // Samples of valid suffixes for room codes
    const suffixes = ['001', '24A', '1', '01'];

    // Test every valid combination of building, floor and suffix
    for (const building of Object.keys(buildings)) {
      for (const floor of floors) {
        for (const suffix of suffixes) {
          const mockRoomDetails: IRoomDetails = {
            id: `${building}${floor}${suffix}`,
            buildingName: buildings[building],
            buildingCode: building,
            floor: floor,
            room: suffix,
          };
          await expect(roomDetails(`${building}${floor}${suffix}`)).resolves.toEqual(mockRoomDetails);
          expect(isValidRoomId).lastCalledWith(`${building}${floor}${suffix}`);
        }
      }
    }
  });

  it('throws an error if the room ID is invalid', async () => {
    (<jest.Mock>isValidRoomId).mockReturnValueOnce(false);

    await expect(roomDetails(invalidRoomId)).rejects.toEqual(new Error(`invalid room ID "${invalidRoomId}"`));
    expect(isValidRoomId).toBeCalledWith(invalidRoomId);
  });
});
