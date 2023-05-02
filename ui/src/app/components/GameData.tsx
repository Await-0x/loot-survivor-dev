export type Dict<T> = { [key: number]: T };
export type DictString<T> = { [key: string]: T };

export class GameData {
  CONTRACTS: DictString<string>;
  BEASTS: Dict<string>;
  ITEMS: Dict<string>;
  RACES: Dict<string>;
  ORDERS: Dict<string>;
  STATS: Dict<string>;
  OBSTACLES: Dict<string>;
  DISCOVERY_TYPES: Dict<string>;
  ITEM_DISCOVERY_TYPES: Dict<string>;
  ITEM_TYPES: Dict<string>;
  MATERIALS: Dict<string>;
  ITEM_NAME_PREFIXES: Dict<string>;
  ITEM_NAME_SUFFIXES: Dict<string>;
  ITEM_SUFFIXES: Dict<string>;
  STATUS: Dict<string>;
  SLOTS: Dict<string>;
  BEAST_IMAGES: DictString<string>;

  constructor() {
    this.CONTRACTS = {
      goerliAdventurer:
        "0x035d755a23ec72df90819f584d9a1849bbc21fa77f96d25e03f1736883895248",
      goerliBeast:
        "0x000f4dbfe5d15792aa91025e42ee1d74c22bdeb1eef0b9bc19a37216377290c1",
      goerliLoot:
        "0x065669e15c8f1a7f17b7062e4eb1b709b922b931b93c59577f1848a85c30ab1f",
      devnetAdventurer:
        "0x005160ffc8910638190fbe80296932ce90be9091f622b30b299ed81c7be7d359",
      devnetBeast:
        "0x061533cb6f21d230aeef9ac2aecf0c70679d1d50d9d61f11bd6a6113cf3d7d85",
      devnetLoot:
        "0x040583a9197a52f289a5f6f03981ace0b3dfcc7496137fa292ec67796be22766",
    };

    this.BEASTS = {
      1: "Pheonix",
      2: "Griffin",
      3: "Minotaur",
      4: "Basilisk",
      5: "Gnome",
      6: "Wraith",
      7: "Ghoul",
      8: "Goblin",
      9: "Skeleton",
      10: "Golem",
      11: "Giant",
      12: "Yeti",
      13: "Orc",
      14: "Beserker",
      15: "Ogre",
      16: "Dragon",
      17: "Vampire",
      18: "Werewolf",
      19: "Spider",
      20: "Rat",
    };

    this.ITEMS = {
      1: "Pendant",
      2: "Necklace",
      3: "Amulet",
      4: "Silver Ring",
      5: "Bronze Ring",
      6: "Platinum Ring",
      7: "Titanium Ring",
      8: "Gold Ring",
      9: "Ghost Wand",
      10: "Grave Wand",
      11: "Bone Wand",
      12: "Wand",
      13: "Grimoire",
      14: "Chronicle",
      15: "Tome",
      16: "Book",
      17: "Divine Robe",
      18: "Silk Robe",
      19: "Linen Robe",
      20: "Robe",
      21: "Shirt",
      22: "Crown",
      23: "Divine Hood",
      24: "Silk Hood",
      25: "Linen Hood",
      26: "Hood",
      27: "Brightsilk Sash",
      28: "Silk Sash",
      29: "Wool Sash",
      30: "Linen Sash",
      31: "Sash",
      32: "Divine Slippers",
      33: "Silk Slippers",
      34: "Wool Shoes",
      35: "Linen Shoes",
      36: "Shoes",
      37: "Divine Gloves",
      38: "Silk Gloves",
      39: "Wool Gloves",
      40: "Linen Gloves",
      41: "Gloves",
      42: "Katana",
      43: "Falchion",
      44: "Scimitar",
      45: "Long Sword",
      46: "Short Sword",
      47: "Demon Husk",
      48: "Dragonskin Armor",
      49: "Studded Leather Armor",
      50: "Hard Leather Armor",
      51: "Leather Armor",
      52: "Demon Crown",
      53: "Dragons Crown",
      54: "War Cap",
      55: "Leather Cap",
      56: "Cap",
      57: "Demonhide Belt",
      58: "Dragonskin Belt",
      59: "Studded Leather Belt",
      60: "Hard Leather Belt",
      61: "Leather Belt",
      62: "Demonhide Boots",
      63: "Dragonskin Boots",
      64: "Studded Leather Boots",
      65: "Hard Leather Boots",
      66: "Leather Boots",
      67: "Demons Hands",
      68: "Dragonskin Gloves",
      69: "Studded Leather Gloves",
      70: "Hard Leather Gloves",
      71: "Leather Gloves",
      72: "Warhammer",
      73: "Quarterstaff",
      74: "Maul",
      75: "Mace",
      76: "Club",
      77: "Holy Chestplate",
      78: "Ornate Chestplate",
      79: "Plate Mail",
      80: "Chain Mail",
      81: "Ring Mail",
      82: "Ancient Helm",
      83: "Ornate Helm",
      84: "Great Helm",
      85: "Full Helm",
      86: "Helm",
      87: "Ornate Belt",
      88: "War Belt",
      89: "Plated Belt",
      90: "Mesh Belt",
      91: "Heavy Belt",
      92: "Holy Greaves",
      93: "Ornate Greaves",
      94: "Greaves",
      95: "Chain Boots",
      96: "Heavy Boots",
      97: "Holy Gauntlets",
      98: "Ornate Gauntlets",
      99: "Gauntlets",
      100: "Chain Gloves",
      101: "Heavy Gloves",
    };

    this.RACES = {
      1: "Elf",
      2: "Fox",
      3: "Giant",
      4: "Human",
      5: "Orc",
      6: "Demon",
      7: "Goblin",
      8: "Fish",
      9: "Cat",
      10: "Frog",
    };

    this.ORDERS = {
      1: "Power",
      2: "Giants",
      3: "Titans",
      4: "Skill",
      5: "Perfection",
      6: "Brilliance",
      7: "Enlightenment",
      8: "Protection",
      9: "Twins",
      10: "Reflection",
      11: "Detection",
      12: "Fox",
      13: "Vitriol",
      14: "Fury",
      15: "Rage",
      16: "Anger",
    };

    this.STATS = {
      2: "Strength",
      3: "Dexterity",
      4: "Vitality",
      5: "Intelligence",
      6: "Wisdom",
      7: "Charisma",
      8: "Luck",
    };

    this.OBSTACLES = {
      1: "Demonic Alter",
      2: "Curse",
      3: "Hex",
      4: "Magic Lock",
      5: "Dark Mist",
      6: "Collapsing Ceiling",
      7: "Crushing Walls",
      8: "Rockslide",
      9: "Tumbling Boulders",
      10: "Swinging Logs",
      11: "Pendulum Blades",
      12: "Flame Jet",
      13: "Poision Dart",
      14: "Spiked Pit",
      15: "Hidden Arrow",
    };

    this.DISCOVERY_TYPES = {
      0: "Nothing",
      1: "Beast",
      2: "Obstacle",
      3: "Item",
      4: "Adventurer",
    };

    this.ITEM_DISCOVERY_TYPES = {
      0: "Gold",
      1: "Loot",
      2: "Health",
    };

    this.ITEM_TYPES = {
      0: "Generic",
      100: "Generic Weapon",
      101: "Bludgeon Weapon",
      102: "Blade Weapon",
      103: "Magic Weapon",
      200: "Generic Armor",
      201: "Metal Armor",
      202: "Hide Armor",
      203: "Cloth Armor",
      300: "Ring Jewelry",
      400: "Necklace Jewelry",
    };

    this.MATERIALS = {
      0: "Generic",
      1000: "Generic Metal",
      1001: "Ancient Metal",
      1002: "Holy Metal",
      1003: "Ornate Metal",
      1004: "Gold Metal",
      1005: "Silver Metal",
      1006: "Bronze Metal",
      1007: "Platinum Metal",
      1008: "Titanium Metal",
      1009: "Steel Metal",
      2000: "Generic Cloth",
      2001: "Royal Cloth",
      2002: "Divine Cloth",
      2003: "Brightsilk Cloth",
      2004: "Silk Cloth",
      2005: "Wool Cloth",
      2006: "Linen Cloth",
      3000: "Generic Biotic",
      3100: "Demon Generic Biotic",
      3101: "Demon Blood Biotic",
      3102: "Demon Bones Biotic",
      3103: "Demon Brain Biotic",
      3104: "Demon Eyes Biotic",
      3105: "Demon Hide Biotic",
      3106: "Demon Flesh Biotic",
      3107: "Demon Hair Biotic",
      3108: "Demon Heart Biotic",
      3109: "Demon Entrails Biotic",
      3110: "Demon Hands Biotic",
      3111: "Demon Feet Biotic",
      3200: "Dragon Generic Biotic",
      3201: "Dragon Blood Biotic",
      3202: "Dragon Bones Biotic",
      3203: "Dragon Brain Biotic",
      3204: "Dragon Eyes Biotic",
      3205: "Dragon Skin Biotic",
      3206: "Dragon Flesh Biotic",
      3207: "Dragon Hair Biotic",
      3208: "Dragon Heart Biotic",
      3209: "Dragon Entrails Biotic",
      3210: "Dragon Hands Biotic",
      3211: "Dragon Feet Biotic",
      3300: "Animal Generic Biotic",
      3301: "Animal Blood Biotic",
      3302: "Animal Bones Biotic",
      3303: "Animal Brain Biotic",
      3304: "Animal Eyes Biotic",
      3305: "Animal Hide Biotic",
      3306: "Animal Flesh Biotic",
      3307: "Animal Hair Biotic",
      3308: "Animal Heart Biotic",
      3309: "Animal Entrails Biotic",
      3310: "Animal Hands Biotic",
      3311: "Animal Feet Biotic",
      3400: "Human Generic Biotic",
      3401: "Human Blood Biotic",
      3402: "Human Bones Biotic",
      3403: "Human Brain Biotic",
      3404: "Human Eyes Biotic",
      3405: "Human Hide Biotic",
      3406: "Human Flesh Biotic",
      3407: "Human Hair Biotic",
      3408: "Human Heart Biotic",
      3409: "Human Entrails Biotic",
      3410: "Human Hands Biotic",
      3411: "Human Feet Biotic",
      4000: "Generic Paper",
      4001: "Magical Paper",
      5000: "Generic Wood",
      5100: "Generic Hardwood",
      5101: "Walnut Hardwood",
      5102: "Mahogany Hardwood",
      5103: "Maple Hardwood",
      5104: "Oak Hardwood",
      5105: "Rosewood Hardwood",
      5106: "Cherry Hardwood",
      5107: "Balsa Hardwood",
      5108: "Birch Hardwood",
      5109: "Holly Hardwood",
      5200: "Generic Softwood",
      5201: "Cedar Softwood",
      5202: "Pine Softwood",
      5203: "Fir Softwood",
      5204: "Hemlock Softwood",
      5205: "Spruce Softwood",
      5206: "Elder Softwood",
      5207: "Yew Softwood",
    };

    this.ITEM_NAME_PREFIXES = {
      1: "Agony ",
      2: "Apocalypse ",
      3: "Armageddon ",
      4: "Beast ",
      5: "Behemoth ",
      6: "Blight ",
      7: "Blood ",
      8: "Bramble ",
      9: "Brimstone ",
      10: "Brood ",
      11: "Carrion ",
      12: "Cataclysm ",
      13: "Chimeric ",
      14: "Corpse ",
      15: "Corruption ",
      16: "Damnation ",
      17: "Death ",
      18: "Demon ",
      19: "Dire ",
      20: "Dragon ",
      21: "Dread ",
      22: "Doom ",
      23: "Dusk ",
      24: "Eagle ",
      25: "Empyrean ",
      26: "Fate ",
      27: "Foe ",
      28: "Gale ",
      29: "Ghoul ",
      30: "Gloom ",
      31: "Glyph ",
      32: "Golem ",
      33: "Grim ",
      34: "Hate ",
      35: "Havoc ",
      36: "Honour ",
      37: "Horror ",
      38: "Hypnotic ",
      39: "Kraken ",
      40: "Loath ",
      41: "Maelstrom ",
      42: "Mind ",
      43: "Miracle ",
      44: "Morbid ",
      45: "Oblivion ",
      46: "Onslaught ",
      47: "Pain ",
      48: "Pandemonium ",
      49: "Phoenix ",
      50: "Plague ",
      51: "Rage ",
      52: "Rapture ",
      53: "Rune ",
      54: "Skull ",
      55: "Sol ",
      56: "Soul ",
      57: "Sorrow ",
      58: "Spirit ",
      59: "Storm ",
      60: "Tempest ",
      61: "Torment ",
      62: "Vengeance ",
      63: "Victory ",
      64: "Viper ",
      65: "Vortex ",
      66: "Woe ",
      67: "Wrath ",
      68: "Lights ",
      69: "Shimmering ",
    };

    this.ITEM_NAME_SUFFIXES = {
      1: "Bane ",
      2: "Root ",
      3: "Bite ",
      4: "Song ",
      5: "Roar ",
      6: "Grasp ",
      7: "Instrument ",
      8: "Glow ",
      9: "Bender ",
      10: "Shadow ",
      11: "Whisper ",
      12: "Shout ",
      13: "Growl ",
      14: "Tear ",
      15: "Peak ",
      16: "Form ",
      17: "Sun ",
      18: "Moon ",
    };

    this.ITEM_SUFFIXES = {
      1: "Of Power",
      2: "Of Giant",
      3: "Of Titans",
      4: "Of Skill",
      5: "Of Perfection",
      6: "Of Brilliance",
      7: "Of Enlightenment",
      8: "Of Protection",
      9: "Of Anger",
      10: "Of Rage",
      11: "Of Fury",
      12: "Of Vitriol",
      13: "Of The Fox",
      14: "Of Detection",
      15: "Of Reflection",
      16: "Of The Twins",
    };

    this.STATUS = { 0: "Closed", 1: "Open" };

    this.SLOTS = {
      1: "Weapon",
      2: "Chest",
      3: "Head",
      4: "Waist",
      5: "Foot",
      6: "Hand",
      7: "Neck",
      8: "Ring",
    };

    this.BEAST_IMAGES = {
      Phoenix: "/beasts/phoenix.png",
      Griffin: "/beasts/griffin.png",
      Minotaur: "/beasts/minotaur.png",
      Basilisk: "/beasts/basilisk.png",
      Gnome: "//beastsgnome.png",
      Wraith: "/beasts/wraith.png",
      Ghoul: "/beasts/ghoul.png",
      Goblin: "/beasts/goblin.png",
      Skeleton: "/beasts/skeleton.png",
      Golem: "/beasts/golem.png",
      Giant: "/beasts/giant.png",
      Yeti: "/beasts/yeti.png",
      Orc: "/beasts/orc.png",
      Berserker: "/beasts/berserker.png",
      Ogre: "/beasts/ogre.png",
      Dragon: "/beasts/dragon.png",
      Vampire: "/beasts/vampire.png",
      Werewolf: "/beasts/werewolf.png",
      Spider: "/beasts/spider.png",
      Rat: "/beasts/rat.png",
    };
  }
}

const gameData = new GameData();
