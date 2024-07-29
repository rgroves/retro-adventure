export enum ExitDirection {
  EAST = "east",
  NORTH = "north",
  SOUTH = "south",
  WEST = "west",
}

interface IExit {
  direction: ExitDirection;
  sceneId: string;
}

export default class Exit {
  public direction: ExitDirection;
  public sceneId: string;

  constructor({ direction, sceneId }: IExit) {
    this.direction = direction;
    this.sceneId = sceneId;
  }
}
