import { ExitDirection } from "../Exit";
import { Item } from "../Item";
import { Scene } from "../Scene";

export const storyTitle = "Corgi Quest";

export default function loadCorgiQuest() {
  const story: Scene[] = [
    new Scene({
      id: "07AB65E0-6F07-4D91-B9E4-1241292ACCB1",
      name: "The Odd Forest",
      description:
        "You're in a forest where the trees have faces, and they're all laughing at you. Your Corgi puppy, Bitey McBiteface, is nowhere to be seen.  A gigantic mushroom sits here, glowing faintly. Bitey is not hiding behind it. You hear something you can't quite make out coming from the north and see a path that winds both north and to the east.",
      prompt: "What do you do?",
      exits: new Map([
        [
          ExitDirection.NORTH,
          {
            direction: ExitDirection.NORTH,
            sceneId: "1433C872-5941-4E58-8CA5-BCBE36005E0D",
          },
        ],
        [
          ExitDirection.EAST,
          {
            direction: ExitDirection.EAST,
            sceneId: "93BED924-2284-4155-9CB1-E4B69AF054D5",
          },
        ],
      ]),
      items: new Map([
        [
          "mushroom",
          new Item({
            id: "mushroom",
            name: "Gigantic Mushroom",
            sceneDescFragment:
              " A gigantic mushroom sits here, glowing faintly.",
            isTakeable: false,
            takenPointValue: 0,
            takenMessage: "",
            isExaminable: true,
            examinePointValue: 10,
            examineMessage:
              "This mushroom seems to be muttering something about taxes.",
            qty: 1,
          }),
        ],
      ]),
    }),
    new Scene({
      id: "1433C872-5941-4E58-8CA5-BCBE36005E0D",
      name: "The Laughing River",
      description:
        "A river flows here, its water giggling as it passes. There’s a small bridge to the north and forest to the south. A talking fish jumps out of the water, giving you stock tips.",
      prompt: "What do you do?",
      exits: new Map([
        [
          ExitDirection.SOUTH,
          {
            direction: ExitDirection.SOUTH,
            sceneId: "07AB65E0-6F07-4D91-B9E4-1241292ACCB1",
          },
        ],
        [
          ExitDirection.NORTH,
          {
            direction: ExitDirection.NORTH,
            sceneId: "8C243AA8-CFB5-42B3-854C-6D13C84EFD45",
          },
        ],
      ]),
      items: new Map([
        [
          "fish",
          new Item({
            id: "fish",
            name: "Talking Fish",
            sceneDescFragment:
              " A talking fish jumps out of the water, giving you stock tips.",
            isTakeable: true,
            takenPointValue: -20,
            takenMessage:
              "You take the talking fish. It protests, but continues to mumble something about FishCoin as you place it gently in your backpack.",
            isExaminable: true,
            examinePointValue: 5,
            examineMessage:
              "The fish has a tiny tie and glasses. It’s quite convincing.",
            qty: 1,
          }),
        ],
      ]),
    }),
    new Scene({
      id: "93BED924-2284-4155-9CB1-E4B69AF054D5",
      name: "The Strange Clearing",
      description:
        "You find yourself in a clearing with odd statues that resemble famous comedians. A hat lies on the ground, looking forlorn. There’s a clearing to the east and forest to the west.",
      prompt: "What do you do?",
      exits: new Map([
        [
          ExitDirection.WEST,
          {
            direction: ExitDirection.WEST,
            sceneId: "07AB65E0-6F07-4D91-B9E4-1241292ACCB1",
          },
        ],
        [
          ExitDirection.EAST,
          {
            direction: ExitDirection.EAST,
            sceneId: "521DED05-4DB0-40D1-97AD-B6F50009D4AB",
          },
        ],
      ]),
      items: new Map([
        [
          "hat",
          new Item({
            id: "hat",
            name: "Comedian's Hat",
            sceneDescFragment: " A hat lies on the ground, looking forlorn.",
            isTakeable: true,
            takenPointValue: 15,
            takenMessage: "You take the hat. It smells funny.",
            isExaminable: true,
            examinePointValue: 5,
            examineMessage: "The hat seems to whisper jokes when you wear it.",
            qty: 1,
          }),
        ],
      ]),
    }),
    new Scene({
      id: "8C243AA8-CFB5-42B3-854C-6D13C84EFD45",
      name: "The Bridge of Snickers",
      description:
        "You stand on a bridge that creaks and giggles with each step. To the north, there’s a spooky cave. You hear a river to the south.",
      prompt: "What do you do?",
      exits: new Map([
        [
          ExitDirection.SOUTH,
          {
            direction: ExitDirection.SOUTH,
            sceneId: "1433C872-5941-4E58-8CA5-BCBE36005E0D",
          },
        ],
        [
          ExitDirection.NORTH,
          {
            direction: ExitDirection.NORTH,
            sceneId: "F62820E1-C129-4414-B322-B27F5CFE1D71",
          },
        ],
      ]),
      items: new Map(),
    }),
    new Scene({
      id: "521DED05-4DB0-40D1-97AD-B6F50009D4AB",
      name: "The Garden of Guffaws",
      description:
        "What is this place? A garden where the flowers giggle and the bushes chuckle. A laughing flower waves in the breeze. You see what looks to be a large fountain to the north.",
      prompt: "What do you do?",
      exits: new Map([
        [
          ExitDirection.WEST,
          {
            direction: ExitDirection.WEST,
            sceneId: "93BED924-2284-4155-9CB1-E4B69AF054D5",
          },
        ],
        [
          ExitDirection.NORTH,
          {
            direction: ExitDirection.NORTH,
            sceneId: "1D9A8A70-B378-49B5-B0B1-8363A03FA24A",
          },
        ],
      ]),
      items: new Map([
        [
          "flower",
          new Item({
            id: "flower",
            name: "Laughing Flower",
            sceneDescFragment: " A laughing flower waves in the breeze.",
            isTakeable: true,
            takenPointValue: -10,
            takenMessage:
              'You take the flower. It giggles for a moment... then nothing. Then suddenly it protests, "Well, fuck!" Then nothing again.',
            isExaminable: true,
            examinePointValue: 5,
            examineMessage: "The flower’s laughter is contagious.",
            qty: 1,
          }),
        ],
      ]),
    }),
    new Scene({
      id: "F62820E1-C129-4414-B322-B27F5CFE1D71",
      name: "The Spooky Cave",
      description:
        "You're in a cave that seems to swallow light. You can't even see the light from where you entered. You think to yourself, \"Who designed this place, ChatGPT?\". It's a fleeting thought. It's impossible to see anything. You did happen to feel yourself kick an object just before you stopped walking. There are echoes of laughter from deep within. Your gut feeling is to turn back.",
      prompt: "What do you do?",
      exits: new Map([
        [
          ExitDirection.SOUTH,
          {
            direction: ExitDirection.SOUTH,
            sceneId: "8C243AA8-CFB5-42B3-854C-6D13C84EFD45",
          },
        ],
        [
          ExitDirection.NORTH,
          {
            direction: ExitDirection.NORTH,
            sceneId: "8ca97259-9d37-4d53-aa71-5958d761df47",
          },
        ],
        [
          ExitDirection.EAST,
          {
            direction: ExitDirection.EAST,
            sceneId: "8ca97259-9d37-4d53-aa71-5958d761df47",
          },
        ],
        [
          ExitDirection.WEST,
          {
            direction: ExitDirection.WEST,
            sceneId: "8ca97259-9d37-4d53-aa71-5958d761df47",
          },
        ],
      ]),
      items: new Map([
        [
          "object",
          new Item({
            id: "object",
            name: "Old Torch",
            sceneDescFragment:
              " You did happen to feel yourself kick an object just before you stopped walking.",
            isTakeable: true,
            takenPointValue: 15,
            takenMessage: "You bend down and pick up the object.",
            isExaminable: true,
            examinePointValue: 10,
            examineMessage:
              "It feels like wood, thick, about three feet in size and has a top that feels like rag and ash. It is cold to the touch and you guess that its been here a long while.",
            qty: 1,
          }),
        ],
      ]),
    }),
    new Scene({
      id: "8ca97259-9d37-4d53-aa71-5958d761df47",
      name: "The Land of the Blind",
      description:
        "Welp! You lost your footing, and unfortunately do not meet ground. As you fall to your doom, your last thoughts are about Bitey. He was always a little smarter than you, he'll be fine.",
      prompt: "GAME OVER",
      exits: new Map(),
      items: new Map(),
    }),
    new Scene({
      id: "1D9A8A70-B378-49B5-B0B1-8363A03FA24A",
      name: "The Laughter Fountain",
      description:
        "You are standing in front of a fountain that sprays water and laughs. There’s a pedestal in the center. Atop the pedestal rests a glowing orb. There's no other path aside from the way you arrived.",
      prompt: "What do you do?",
      exits: new Map([
        [
          ExitDirection.SOUTH,
          {
            direction: ExitDirection.SOUTH,
            sceneId: "521DED05-4DB0-40D1-97AD-B6F50009D4AB",
          },
        ],
        [
          ExitDirection.NORTH,
          {
            direction: ExitDirection.NORTH,
            sceneId: "F4613344-CEE2-4987-A06A-F1B5852811F2",
          },
        ],
      ]),
      items: new Map([
        [
          "orb",
          new Item({
            id: "orb",
            name: "Glowing Orb",
            sceneDescFragment: "Atop the pedestal rests a glowing orb.",
            isTakeable: false,
            takenPointValue: 0,
            takenMessage: "",
            isExaminable: true,
            examinePointValue: 10,
            examineMessage: "The orb pulses with light, laughing softly.",
            qty: 1,
          }),
        ],
      ]),
    }),
    new Scene({
      id: "F4613344-CEE2-4987-A06A-F1B5852811F2",
      name: "The Mirthful Meadow",
      description:
        "You find yourself in a meadow where the grass tickles your ankles and makes you giggle. A giggling leaf flutters in front of you here. You see cliffs off in the distance to the north and a fountain to the south.",
      prompt: "What do you do?",
      exits: new Map([
        [
          ExitDirection.SOUTH,
          {
            direction: ExitDirection.SOUTH,
            sceneId: "1D9A8A70-B378-49B5-B0B1-8363A03FA24A",
          },
        ],
        [
          ExitDirection.NORTH,
          {
            direction: ExitDirection.NORTH,
            sceneId: "3F485378-47BA-4CB8-92FC-FF04433CEDC0",
          },
        ],
      ]),
      items: new Map([
        [
          "leaf",
          new Item({
            id: "leaf",
            name: "Giggling Leaf",
            sceneDescFragment:
              " A giggling leaf flutters in front of you here.",
            isTakeable: true,
            takenPointValue: 15,
            takenMessage: "You take the leaf. It keeps giggling.",
            isExaminable: true,
            examinePointValue: 5,
            examineMessage:
              "The leaf’s laughter is high-pitched and infectious.",
            qty: 1,
          }),
        ],
      ]),
    }),
    new Scene({
      id: "3F485378-47BA-4CB8-92FC-FF04433CEDC0",
      name: "The Chuckling Cliffs",
      description:
        "After a long walk you find yourself currently in the middle of what seems to be a land bridge, with steep cliffs to your left and right. The cliffs echo with chuckles. There’s a large mountian with a cave entrance to the north and a meadow some distance away to the south.",
      prompt: "What do you do?",
      exits: new Map([
        [
          ExitDirection.SOUTH,
          {
            direction: ExitDirection.SOUTH,
            sceneId: "F4613344-CEE2-4987-A06A-F1B5852811F2",
          },
        ],
        [
          ExitDirection.NORTH,
          {
            direction: ExitDirection.NORTH,
            sceneId: "33D19EA9-1322-421C-92C0-8BB7F04C0816",
          },
        ],
        [
          ExitDirection.EAST,
          {
            direction: ExitDirection.EAST,
            sceneId: "5ecb0257-950e-410a-8a9b-70307d9d9c28",
          },
        ],
        [
          ExitDirection.WEST,
          {
            direction: ExitDirection.WEST,
            sceneId: "5ecb0257-950e-410a-8a9b-70307d9d9c28",
          },
        ],
      ]),
      items: new Map(),
    }),
    new Scene({
      id: "5ecb0257-950e-410a-8a9b-70307d9d9c28",
      name: "A Nice View",
      description:
        'So, maybe you thought you could fly? Strange thought to have. You realize that now. While you are in a free-fall descent down the side of the cliff, you think to yourself, "Self, this is kind of a nice view... while it lasts."',
      prompt: "GAME OVER",
      exits: new Map(),
      items: new Map(),
    }),
    new Scene({
      id: "33D19EA9-1322-421C-92C0-8BB7F04C0816",
      name: "The Giggling Grotto",
      description:
        'What a beautiful grotto!. The walls seem to be chanting, "Good boy! Good boy!". In the center, Bitey McBiteface is happily spinning in circles, chasing his own tail. You happen to spot a strange looking, large contraption of some sort to the north. Cliffs can be seen outside the grotto entrance to the south.',
      prompt: "What do you do?",
      exits: new Map([
        [
          ExitDirection.NORTH,
          {
            direction: ExitDirection.NORTH,
            sceneId: "FF8A50CB-D0BA-4C3B-9293-0214743B7154",
          },
        ],
      ]),
      items: new Map([
        [
          "bitey",
          new Item({
            id: "bitey",
            name: "Bitey McBiteface",
            sceneDescFragment:
              " In the center, Bitey McBiteface is happily spinning in circles, chasing his own tail.",
            isTakeable: true,
            takenPointValue: 100,
            takenMessage:
              "Congratulations! You found Bitey McBiteface. You pick him up. He licks your face in joy.",
            isExaminable: true,
            examinePointValue: 10,
            examineMessage: "Bitey looks happy to see you.",
            qty: 1,
          }),
        ],
      ]),
    }),
    new Scene({
      id: "FF8A50CB-D0BA-4C3B-9293-0214743B7154",
      name: "Our Way Out Of Here",
      description:
        'The contraption you spotted seems to be a giant drone. You guess that it can comfortably fit one human and one puppy. You seem to be correct, as you find two seats inside. The seatbelts are labled, "Human" and "Puppy." Bitey licks you in the face, jumps down from your arms and into the drone. Your shocked as Bitey straps himself in and exclaims, "Get in loser. We\'re going on more adventures!"',
      prompt: "Game Over",
      exits: new Map(),
      items: new Map(),
    }),
  ];
  return story;
}
