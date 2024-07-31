import Exit, { ExitDirection } from "../Exit";
import { Item } from "../Item";
import { Scene } from "../Scene";

export const storyName = "Demo";

export const story: Scene[] = [
  new Scene({
    id: "36489ebf-498d-4cf5-8b17-33e1a568c1d2",
    name: "Stranger in a Strange Land",
    description:
      "You find yourself standing in the middle of a strange room. A portal, glowing neon green, can be seen to the east. Another portal, glowing neon red, can be seen to the west. There is a strange looking gun on the ground neear your feet.",
    exits: new Map([
      [
        ExitDirection.EAST,
        new Exit({
          direction: ExitDirection.EAST,
          sceneId: "586fcbcd-694b-437f-8cd9-5a8a11f54793",
        }),
      ],
      [
        ExitDirection.WEST,
        new Exit({
          direction: ExitDirection.WEST,
          sceneId: "f5e683b7-bf4a-47b3-b4ff-00e5339d590d",
        }),
      ],
    ]),
    items: new Map([
      [
        "gun",
        new Item({
          id: crypto.randomUUID(),
          name: "Ray Gun",
          sceneDescFragment:
            " There is a strange looking gun on the ground neear your feet.",
          isTakeable: true,
          takenPointValue: 25,
          isExaminable: true,
          takenMessage: "You take the gun.",
          examinePointValue: 5,
          examineMessage: "It seems to be a 1950's retro-style ray gun.",
        }),
      ],
    ]),
  }),
  new Scene({
    id: "586fcbcd-694b-437f-8cd9-5a8a11f54793",
    name: "Green Means Go",
    description:
      "As you step into the green portal, you're skin begins to tingle and then there is a brilliant flash of light. ",
    exits: new Map(),
    items: new Map(),
  }),
  new Scene({
    id: "f5e683b7-bf4a-47b3-b4ff-00e5339d590d",
    name: "Red Means Dead",
    description:
      "You immediately realize this was a huge mistake. As your skin begins to peel and your muscle and bone tear apart, your final thought is that, luckily, this will be the last mistake you'll ever make.",
    prompt: "Game Over",
    exits: new Map(),
    items: new Map(),
  }),
];
