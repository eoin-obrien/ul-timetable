import { buildings, floors } from '../util/constants';
import { isValidRoomId } from '../util/validators';

export interface IRoomDetails {
  id: string;
  buildingName: string;
  buildingCode: string;
  floor: string;
  room: string;
}

export async function roomDetails(roomId: string): Promise<IRoomDetails> {
  if (!isValidRoomId(roomId)) {
    throw new Error(`invalid room ID "${roomId}"`);
  }

  const roomIdRegex = new RegExp(`^(${Object.keys(buildings).join('|')})(${floors.join('|')})([0-9]+[A-Z]?)$`);
  const roomIdParts = roomIdRegex.exec(roomId.toUpperCase());

  return {
    id: roomId,
    buildingName: buildings[roomIdParts[1]],
    buildingCode: roomIdParts[1],
    floor: roomIdParts[2],
    room: roomIdParts[3],
  };
}
