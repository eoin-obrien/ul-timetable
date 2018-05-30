import { IRoomDetails } from '../types';
import { buildings, floors } from '../util/constants';
import { isValidRoomId } from '../util/validators';

export async function roomDetails(roomId: string): Promise<IRoomDetails> {
  if (!isValidRoomId(roomId)) {
    throw new Error(`invalid room ID "${roomId}"`);
  }

  const roomIdRegex = new RegExp(`^(${Object.keys(buildings).join('|')})(${floors.join('|')})([0-9]+[A-Z]?)$`);
  const roomIdParts = roomIdRegex.exec(roomId.toUpperCase()) as RegExpExecArray;

  return {
    id: roomId.toUpperCase(),
    buildingName: buildings[roomIdParts[1]],
    building: roomIdParts[1],
    floor: roomIdParts[2],
    room: roomIdParts[3],
  };
}
