var gearIndex = 0;
var qualityIndex = 0;
var carryingIndex = 0;
var allQualityHolders = []; // Weapons Equipments etc...

const WeaponTypes = {
    Natural: 0,
    Blade: 1,
    MaceHammer: 2,
    Axe: 3,
    Polearm: 4,
    Shield: 5,
    Thrown: 6,
    Sling: 7,
    Crossbow: 8,
    Gun: 9,
    Bow: 10
}
const WeaponSizes = {
    Light: 0,
    OneHand: 1,
    TwoHand: 2
}
const ArmorTypes = {
    None: 0,
    VeryLight: 1,
    Light: 2,
    Medium: 3,
    MediumHeavy: 4,
    Heavy: 5,
    VeryHeavy: 6
}
const QualityTypes = {
    Custom: [(x) => { }, () => { }],
    // Main
    HP: [(x) => { mainChar.stats.addMaxHP(x, "Gear"); }, (x) => { mainChar.stats.reduceMaxHP(x, "Gear"); }],
    Stamina: [(x) => { mainChar.stats.addMaxStamina(x, "Gear"); }, (x) => { mainChar.stats.reduceMaxStamina(x, "Gear"); }],
    Mana: [(x) => { mainChar.stats.addMaxMana(x, "Gear"); }, (x) => { mainChar.stats.reduceMaxMana(x, "Gear"); }],
    Accuracy: [(x) => { mainChar.stats.addAccuracy(x, "Gear"); }, (x) => { mainChar.stats.reduceAccuracy(x, "Gear"); }],
    Parry: [(x) => { mainChar.stats.addParry(x, "Gear"); }, (x) => { mainChar.stats.reduceParry(x, "Gear"); }],
    Damage: [(x) => { mainChar.stats.addDamage(x, "Gear"); }, (x) => { mainChar.stats.reduceDamage(x, "Gear"); }],

    // Attributes
    Strength: [(x) => { mainChar.stats.addStrength(x, "Gear"); }, (x) => { mainChar.stats.reduceStrength(x, "Gear"); }],
    Agility: [(x) => { mainChar.stats.addAgility(x, "Gear"); }, (x) => { mainChar.stats.reduceAgility(x, "Gear"); }],
    Intelligence: [(x) => { mainChar.stats.addIntelligence(x, "Gear"); }, (x) => { mainChar.stats.reduceIntelligence(x, "Gear"); }],
    Discipline: [(x) => { mainChar.stats.addDiscipline(x, "Gear"); }, (x) => { mainChar.stats.reduceDiscipline(x, "Gear"); }],
    Conviction: [(x) => { mainChar.stats.addConviction(x, "Gear"); }, (x) => { mainChar.stats.reduceConviction(x, "Gear"); }],
    Attunement: [(x) => { mainChar.stats.addAttunement(x, "Gear"); }, (x) => { mainChar.stats.reduceAttunement(x, "Gear"); }],
    Constitution: [(x) => { mainChar.stats.addConstitution(x, "Gear"); }, (x) => { mainChar.stats.reduceConstitution(x, "Gear"); }],

    // Major
    Reflex: [(x) => { VSDefs.Reflex.addPointsModifier(x, "Gear"); }, (x) => { VSDefs.Reflex.reducePointsModifier(x, "Gear"); }],
    Compulsions: [(x) => { VSDefs.Compulsions.addPointsModifier(x, "Gear"); }, (x) => { VSDefs.Compulsions.reducePointsModifier(x, "Gear"); }],
    Shapeshift: [(x) => { VSDefs.Shapechange.addPointsModifier(x, "Gear"); }, (x) => { VSDefs.Shapechange.reducePointsModifier(x, "Gear"); }],
    Emotions: [(x) => { VSDefs.Emotions.addPointsModifier(x, "Gear"); }, (x) => { VSDefs.Emotions.reducePointsModifier(x, "Gear"); }],
    Balance: [(x) => { VSDefs.Balance.addPointsModifier(x, "Gear"); }, (x) => { VSDefs.Balance.reducePointsModifier(x, "Gear"); }],

    // Magics
    Magic: [(x) => { AddedDefenses.Magic.addPointsModifier(x, "Gear"); }, (x) => { AddedDefenses.Magic.reducePointsModifier(x, "Gear"); }],
    Arcane: [(x) => { AddedDefenses.Arcane.addPointsModifier(x, "Gear"); }, (x) => { AddedDefenses.addPointsModifier.reducePointsModifier(x, "Gear"); }],
    Divine: [(x) => { AddedDefenses.Divine.addPointsModifier(x, "Gear"); }, (x) => { AddedDefenses.Divine.reducePointsModifier(x, "Gear"); }],
    Primal: [(x) => { AddedDefenses.Primal.addPointsModifier(x, "Gear"); }, (x) => { AddedDefenses.Primal.reducePointsModifier(x, "Gear"); }],
    Blood: [(x) => { AddedDefenses.Blood.addPointsModifier(x, "Gear"); }, (x) => { AddedDefenses.Blood.reducePointsModifier(x, "Gear"); }],
    Gem: [(x) => { AddedDefenses.Gem.addPointsModifier(x, "Gear"); }, (x) => { AddedDefenses.Gem.reducePointsModifier(x, "Gear"); }],
    Witchcraft: [(x) => { AddedDefenses.Witchcraft.addPointsModifier(x, "Gear"); }, (x) => { AddedDefenses.Witchcraft.reducePointsModifier(x, "Gear"); }],

    Technology: [(x) => { AddedDefenses.Technology.addPointsModifier(x, "Gear"); }, (x) => { AddedDefenses.Technology.reducePointsModifier(x, "Gear"); }],
    Nature: [(x) => { AddedDefenses.Nature.addPointsModifier(x, "Gear"); }, (x) => { AddedDefenses.Technology.reducePointsModifier(x, "Gear"); }],

    // Objects
    // Object Group
    Blades: [(x) => { AddedDefenses.Blades.addPointsModifier(x, "Gear"); }, (x) => { AddedDefenses.Blades.reducePointsModifier(x, "Gear"); }],
    Axes: [(x) => { AddedDefenses.Axe.addPointsModifier(x, "Gear"); }, (x) => { AddedDefenses.Axe.reducePointsModifier(x, "Gear"); }],
    MacesHammers: [(x) => { AddedDefenses.MaceHammer.addPointsModifier(x, "Gear"); }, (x) => { AddedDefenses.MaceHammer.reducePointsModifier(x, "Gear"); }],
    Polearms: [(x) => { AddedDefenses.Polearms.addPointsModifier(x, "Gear"); }, (x) => { AddedDefenses.Polearms.reducePointsModifier(x, "Gear"); }],
    Bows: [(x) => { AddedDefenses.Bows.addPointsModifier(x, "Gear"); }, (x) => { AddedDefenses.Bows.reducePointsModifier(x, "Gear"); }],
    Guns: [(x) => { AddedDefenses.Guns.addPointsModifier(x, "Gear"); }, (x) => { AddedDefenses.Guns.reducePointsModifier(x, "Gear"); }],
    Crossbows: [(x) => { AddedDefenses.Crossbows.addPointsModifier(x, "Gear"); }, (x) => { AddedDefenses.Crossbows.reducePointsModifier(x, "Gear"); }],

    Metal: [(x) => { AddedDefenses.Metal.addPointsModifier(x, "Gear"); }, (x) => { AddedDefenses.Metal.reducePointsModifier(x, "Gear"); }],
    Stone: [(x) => { AddedDefenses.Stone.addPointsModifier(x, "Gear"); }, (x) => { AddedDefenses.Stone.reducePointsModifier(x, "Gear"); }],
    Bone: [(x) => { AddedDefenses.Bone.addPointsModifier(x, "Gear"); }, (x) => { AddedDefenses.Bone.reducePointsModifier(x, "Gear"); }],

    // Creatures
    Creatures: [],

    // Alignments
    // Specific
    LawfulGood: [(x) => { AddedDefenses.LawfulGood.addPointsModifier(x, "Gear"); }, (x) => { AddedDefenses.LawfulGood.reducePointsModifier(x, "Gear"); }],
    ChaoticGood: [(x) => { AddedDefenses.ChaoticGood.addPointsModifier(x, "Gear"); }, (x) => { AddedDefenses.ChaoticGood.reducePointsModifier(x, "Gear"); }],
    NeutralGood: [(x) => { AddedDefenses.NeutralGood.addPointsModifier(x, "Gear"); }, (x) => { AddedDefenses.NeutralGood.reducePointsModifier(x, "Gear"); }],
    LawfulNeutral: [(x) => { AddedDefenses.LawfulNeutral.addPointsModifier(x, "Gear"); }, (x) => { AddedDefenses.LawfulNeutral.reducePointsModifier(x, "Gear"); }],
    TrueNeutral: [(x) => { AddedDefenses.TrueNeutral.addPointsModifier(x, "Gear"); }, (x) => { AddedDefenses.TrueNeutral.reducePointsModifier(x, "Gear"); }],
    ChaoticNeutral: [(x) => { AddedDefenses.ChaoticNeutral.addPointsModifier(x, "Gear"); }, (x) => { AddedDefenses.ChaoticNeutral.reducePointsModifier(x, "Gear"); }],
    NeutralEvil: [(x) => { AddedDefenses.NeutralEvil.addPointsModifier(x, "Gear"); }, (x) => { AddedDefenses.NeutralEvil.reducePointsModifier(x, "Gear"); }],
    LawfulEvil: [(x) => { AddedDefenses.LawfulEvil.addPointsModifier(x, "Gear"); }, (x) => { AddedDefenses.LawfulEvil.reducePointsModifier(x, "Gear"); }],
    ChaoticEvil: [(x) => { AddedDefenses.ChaoticEvil.addPointsModifier(x, "Gear"); }, (x) => { AddedDefenses.ChaoticEvil.reducePointsModifier(x, "Gear"); }],

    // Type Group
    Lawful: [(x) => { AddedDefenses.Lawful.addPointsModifier(x, "Gear"); }, (x) => { AddedDefenses.Lawful.reducePointsModifier(x, "Gear"); }],
    Chaotic: [(x) => { AddedDefenses.Chaotic.addPointsModifier(x, "Gear"); }, (x) => { AddedDefenses.Chaotic.reducePointsModifier(x, "Gear"); }],
    Good: [(x) => { AddedDefenses.Good.addPointsModifier(x, "Gear"); }, (x) => { AddedDefenses.Good.reducePointsModifier(x, "Gear"); }],
    Evil: [(x) => { AddedDefenses.Evil.addPointsModifier(x, "Gear"); }, (x) => { AddedDefenses.Evil.reducePointsModifier(x, "Gear"); }],
    Neutral: [(x) => { AddedDefenses.Neutral.addPointsModifier(x, "Gear"); }, (x) => { AddedDefenses.Neutral.reducePointsModifier(x, "Gear"); }],

    Luck: [(x) => { AddedDefenses.Luck.addPointsModifier(x, "Gear"); }, (x) => { AddedDefenses.Luck.reducePointsModifier(x, "Gear"); }],
    Illusion: [(x) => { AddedDefenses.Illusion.addPointsModifier(x, "Gear"); }, (x) => { AddedDefenses.Illusion.reducePointsModifier(x, "Gear"); }],

    // Vs Environment
    Spot: [(x) => { VSEnvironments.Spot.addPointsModifier(x, "Gear"); }, (x) => { VSEnvironments.Spot.reducePointsModifier(x, "Gear"); }],
    Listen: [(x) => { VSEnvironments.Listen.addPointsModifier(x, "Gear"); }, (x) => { VSEnvironments.Listen.reducePointsModifier(x, "Gear"); }],
    Scent: [(x) => { VSEnvironments.Scent.addPointsModifier(x, "Gear"); }, (x) => { VSEnvironments.Scent.reducePointsModifier(x, "Gear"); }],
    EnvHot: [(x) => { VSEnvironments.EnvHot.addPointsModifier(x, "Gear"); }, (x) => { VSEnvironments.EnvHot.reducePointsModifier(x, "Gear"); }],
    EnvCold: [(x) => { VSEnvironments.EnvCold.addPointsModifier(x, "Gear"); }, (x) => { VSEnvironments.EnvCold.reducePointsModifier(x, "Gear"); }],
    Breathe: [(x) => { VSEnvironments.Breathe.addPointsModifier(x, "Gear"); }, (x) => { VSEnvironments.Breathe.reducePointsModifier(x, "Gear"); }],
    Surprise: [(x) => { VSEnvironments.Surprise.addPointsModifier(x, "Gear"); }, (x) => { VSEnvironments.Surprise.reducePointsModifier(x, "Gear"); }],
    Traps: [(x) => { VSEnvironments.Traps.addPointsModifier(x, "Gear"); }, (x) => { VSEnvironments.Traps.reducePointsModifier(x, "Gear"); }],

    // Damage Reductions
    Physical: [(x) => { DamageTypes.Physical.addPointsModifier(x, "Gear"); }, (x) => { DamageTypes.Physical.reducePointsModifier(x, "Gear"); }],
    Blunt: [(x) => { DamageTypes.Blunt.addPointsModifier(x, "Gear"); }, (x) => { DamageTypes.Blunt.reducePointsModifier(x, "Gear"); }],
    Slashing: [(x) => { DamageTypes.Slashing.addPointsModifier(x, "Gear"); }, (x) => { DamageTypes.Slashing.reducePointsModifier(x, "Gear"); }],
    Piercing: [(x) => { DamageTypes.Piercing.addPointsModifier(x, "Gear"); }, (x) => { DamageTypes.Piercing.reducePointsModifier(x, "Gear"); }],
    Fire: [(x) => { DamageTypes.Fire.addPointsModifier(x, "Gear"); }, (x) => { DamageTypes.Fire.reducePointsModifier(x, "Gear"); }],
    Cold: [(x) => { DamageTypes.Cold.addPointsModifier(x, "Gear"); }, (x) => { DamageTypes.Cold.reducePointsModifier(x, "Gear"); }],
    Acid: [(x) => { DamageTypes.Acid.addPointsModifier(x, "Gear"); }, (x) => { DamageTypes.Acid.reducePointsModifier(x, "Gear"); }],
    Lightning: [(x) => { DamageTypes.Lightning.addPointsModifier(x, "Gear"); }, (x) => { DamageTypes.Lightning.reducePointsModifier(x, "Gear"); }],
    PosEnergy: [(x) => { DamageTypes.PosEnergy.addPointsModifier(x, "Gear"); }, (x) => { DamageTypes.PosEnergy.reducePointsModifier(x, "Gear"); }],
    NegEnergy: [(x) => { DamageTypes.NegEnergy.addPointsModifier(x, "Gear"); }, (x) => { DamageTypes.NegEnergy.reducePointsModifier(x, "Gear"); }],
    Sonic: [(x) => { DamageTypes.Sonic.addPointsModifier(x, "Gear"); }, (x) => { DamageTypes.Sonic.reducePointsModifier(x, "Gear"); }],
    Radiation: [(x) => { DamageTypes.Radiation.addPointsModifier(x, "Gear"); }, (x) => { DamageTypes.Radiation.reducePointsModifier(x, "Gear"); }],

    // Movement
    Ground: [(x) => { mainChar.stats.movements.ground.slowDown(-x, "Gear"); }, (x) => { mainChar.stats.movements.ground.slowDown(x, "Gear"); }],
    Swim: [(x) => { mainChar.stats.movements.swim.slowDown(-x, "Gear"); }, (x) => { mainChar.stats.movements.swim.slowDown(x, "Gear"); }],
    Climb: [(x) => { mainChar.stats.movements.climb.slowDown(-x, "Gear"); }, (x) => { mainChar.stats.movements.climb.slowDown(x, "Gear"); }],
    Jump: [(x) => { mainChar.stats.movements.jump.slowDown(-x, "Gear"); }, (x) => { mainChar.stats.movements.jump.slowDown(x, "Gear"); }],
    Burrow: [(x) => { mainChar.stats.movements.burrow.slowDown(-x, "Gear"); }, (x) => { mainChar.stats.movements.burrow.slowDown(x, "Gear"); }],
    MovementFlight: [(x) => { mainChar.stats.movements.flight.slowDown(-x, "Gear"); }, (x) => { mainChar.stats.movements.flight.slowDown(x, "Gear"); }],

    // Skills
    // Crafting
    Alchemy: [(x) => { mainChar.stats.craftingSkills.Alchemy.addPoints(x, "Gear"); }, (x) => { mainChar.stats.craftingSkills.Alchemy.reducePoints(x, "Gear"); }],
    Brews: [(x) => { mainChar.stats.craftingSkills.Brews.addPoints(x, "Gear"); }, (x) => { mainChar.stats.craftingSkills.Brews.reducePoints(x, "Gear"); }],
    OilsAndBalms: [(x) => { mainChar.stats.craftingSkills.OilsAndBalms.addPoints(x, "Gear"); }, (x) => { mainChar.stats.craftingSkills.OilsAndBalms.reducePoints(x, "Gear"); }],
    Toxins: [(x) => { mainChar.stats.craftingSkills.Toxins.addPoints(x, "Gear"); }, (x) => { mainChar.stats.craftingSkills.Toxins.reducePoints(x, "Gear"); }],
    Homunculi: [(x) => { mainChar.stats.craftingSkills.Homunculi.addPoints(x, "Gear"); }, (x) => { mainChar.stats.craftingSkills.Homunculi.reducePoints(x, "Gear"); }],
    Explosives: [(x) => { mainChar.stats.craftingSkills.Explosives.addPoints(x, "Gear"); }, (x) => { mainChar.stats.craftingSkills.Explosives.reducePoints(x, "Gear"); }],
    Transmogrify: [(x) => { mainChar.stats.craftingSkills.Transmogrify.addPoints(x, "Gear"); }, (x) => { mainChar.stats.craftingSkills.Transmogrify.reducePoints(x, "Gear"); }],
    Blacksmith: [(x) => { mainChar.stats.craftingSkills.Blacksmith.addPoints(x, "Gear"); }, (x) => { mainChar.stats.craftingSkills.Blacksmith.reducePoints(x, "Gear"); }],
    Armorsmith: [(x) => { mainChar.stats.craftingSkills.Armorsmith.addPoints(x, "Gear"); }, (x) => { mainChar.stats.craftingSkills.Armorsmith.reducePoints(x, "Gear"); }],
    Weaponsmith: [(x) => { mainChar.stats.craftingSkills.Weaponsmith.addPoints(x, "Gear"); }, (x) => { mainChar.stats.craftingSkills.Weaponsmith.reducePoints(x, "Gear"); }],
    Carpentry: [(x) => { mainChar.stats.craftingSkills.Carpentry.addPoints(x, "Gear"); }, (x) => { mainChar.stats.craftingSkills.Carpentry.reducePoints(x, "Gear"); }],
    Fletchery: [(x) => { mainChar.stats.craftingSkills.Fletchery.addPoints(x, "Gear"); }, (x) => { mainChar.stats.craftingSkills.Fletchery.reducePoints(x, "Gear"); }],
    Leatherwork: [(x) => { mainChar.stats.craftingSkills.Leatherwork.addPoints(x, "Gear"); }, (x) => { mainChar.stats.craftingSkills.Leatherwork.reducePoints(x, "Gear"); }],
    Tailor: [(x) => { mainChar.stats.craftingSkills.Tailor.addPoints(x, "Gear"); }, (x) => { mainChar.stats.craftingSkills.Tailor.reducePoints(x, "Gear"); }],
    Trapmaking: [(x) => { mainChar.stats.craftingSkills.Trapmaking.addPoints(x, "Gear"); }, (x) => { mainChar.stats.craftingSkills.Trapmaking.reducePoints(x, "Gear"); }],
    Engineering: [(x) => { mainChar.stats.craftingSkills.Engineering.addPoints(x, "Gear"); }, (x) => { mainChar.stats.craftingSkills.Engineering.reducePoints(x, "Gear"); }],

    // Perform
    Acting: [(x) => { mainChar.stats.performSkills.Acting.addPoints(x, "Gear"); }, (x) => { mainChar.stats.performSkills.Acting.reducePoints(x, "Gear"); }],
    EscapeArtist: [(x) => { mainChar.stats.performSkills.EscapeArtist.addPoints(x, "Gear"); }, (x) => { mainChar.stats.performSkills.EscapeArtist.reducePoints(x, "Gear"); }],
    SleightOfHand: [(x) => { mainChar.stats.performSkills.SleightOfHand.addPoints(x, "Gear"); }, (x) => { mainChar.stats.performSkills.SleightOfHand.reducePoints(x, "Gear"); }],

    // The Rest
    Hide: [(x) => { mainChar.stats.skills.Hide.addPoints(x, "Gear"); }, (x) => { mainChar.stats.skills.Hide.reducePoints(x, "Gear"); }],
    MoveSilently: [(x) => { mainChar.stats.skills.MoveSilently.addPoints(x, "Gear"); }, (x) => { mainChar.stats.skills.MoveSilently.reducePoints(x, "Gear"); }],
    Disguise: [(x) => { mainChar.stats.skills.Disguise.addPoints(x, "Gear"); }, (x) => { mainChar.stats.skills.Disguise.reducePoints(x, "Gear"); }],
    Medicine: [(x) => { mainChar.stats.skills.Medicine.addPoints(x, "Gear"); }, (x) => { mainChar.stats.skills.Medicine.reducePoints(x, "Gear"); }],
    Survival: [(x) => { mainChar.stats.skills.Survival.addPoints(x, "Gear"); }, (x) => { mainChar.stats.skills.Survival.reducePoints(x, "Gear"); }],
    Track: [(x) => { mainChar.stats.skills.Track.addPoints(x, "Gear"); }, (x) => { mainChar.stats.skills.Track.reducePoints(x, "Gear"); }],
    Flight: [(x) => { mainChar.stats.skills.Flight.addPoints(x, "Gear"); }, (x) => { mainChar.stats.skills.Flight.reducePoints(x, "Gear"); }],
    Insight: [(x) => { mainChar.stats.skills.Insight.addPoints(x, "Gear"); }, (x) => { mainChar.stats.skills.Insight.reducePoints(x, "Gear"); }],
    Bluff: [(x) => { mainChar.stats.skills.Bluff.addPoints(x, "Gear"); }, (x) => { mainChar.stats.skills.Bluff.reducePoints(x, "Gear"); }],
    Diplomacy: [(x) => { mainChar.stats.skills.Diplomacy.addPoints(x, "Gear"); }, (x) => { mainChar.stats.skills.Diplomacy.reducePoints(x, "Gear"); }],
    Intimidate: [(x) => { mainChar.stats.skills.Intimidate.addPoints(x, "Gear"); }, (x) => { mainChar.stats.skills.Intimidate.reducePoints(x, "Gear"); }],
    PickLock: [(x) => { mainChar.stats.skills.PickLock.addPoints(x, "Gear"); }, (x) => { mainChar.stats.skills.PickLock.reducePoints(x, "Gear"); }],
    PickPocket: [(x) => { mainChar.stats.skills.PickPocket.addPoints(x, "Gear"); }, (x) => { mainChar.stats.skills.PickPocket.reducePoints(x, "Gear"); }],

    // Other
    CarryCapacity: [(x) => { mainChar.stats.addCarryCapacity(x, "Gear"); }, (x) => { mainChar.stats.reduceCarryCapacity(x, "Gear"); }],
    QckStp: [(x) => { mainChar.stats.addQuickStep(x, "Gear"); }, (x) => { mainChar.stats.reduceQuickStep(x, "Gear"); }],
    OTAs: [(x) => { mainChar.stats.addOTAs(x, "Gear"); }, (x) => { mainChar.stats.reduceOTAs(x, "Gear"); }]
}

function getGearQualityByName(str) {
    if (str == "Hit Points") return QualityTypes.HP;
    else if (str == "Stamina") return QualityTypes.Stamina;
    else if (str == "Mana") return QualityTypes.Mana;
    else if (str == "Accuracy") return QualityTypes.Accuracy;
    else if (str == "Parry") return QualityTypes.Parry;
    else if (str == "Damage") return QualityTypes.Damage;
    else if (str == "Technology") return QualityTypes.Technology;
    else if (str == "Nature") return QualityTypes.Nature;
    else if (str == "Strength") return QualityTypes.Strength;
    else if (str == "Agility") return QualityTypes.Agility;
    else if (str == "Intelligence") return QualityTypes.Intelligence;
    else if (str == "Discipline") return QualityTypes.Discipline;
    else if (str == "Conviction") return QualityTypes.Conviction;
    else if (str == "Attunement") return QualityTypes.Attunement;
    else if (str == "Constitution") return QualityTypes.Constitution;
    else if (str == "Luck") return QualityTypes.Luck;
    else if (str == "Spot") return QualityTypes.Spot;
    else if (str == "Listen") return QualityTypes.Listen;
    else if (str == "Scent") return QualityTypes.Scent;
    else if (str == "Environment Hot") return QualityTypes.EnvHot;
    else if (str == "Environment Cold") return QualityTypes.EnvCold;
    else if (str == "Breathe") return QualityTypes.Breathe;
    else if (str == "Surprise") return QualityTypes.Surprise;
    else if (str == "Traps") return QualityTypes.Traps;
    else if (str == "Physical") return QualityTypes.Physical;
    else if (str == "Blunt") return QualityTypes.Blunt;
    else if (str == "Slashing") return QualityTypes.Slashing;
    else if (str == "Piercing") return QualityTypes.Piercing;
    else if (str == "Fire") return QualityTypes.Fire;
    else if (str == "Cold") return QualityTypes.Cold;
    else if (str == "Acid") return QualityTypes.Acid;
    else if (str == "Lightning") return QualityTypes.Lightning;
    else if (str == "Pos. Energy") return QualityTypes.PosEnergy;
    else if (str == "Neg. Energy") return QualityTypes.NegEnergy;
    else if (str == "Sonic") return QualityTypes.Sonic;
    else if (str == "Radiation") return QualityTypes.Radiation;
    else if (str == "Reflex") return QualityTypes.Reflex;
    else if (str == "Compulsions") return QualityTypes.Compulsions;
    else if (str == "Shapeshift") return QualityTypes.Shapeshift;
    else if (str == "Emotions") return QualityTypes.Emotions;
    else if (str == "Balance") return QualityTypes.Balance;
    else if (str == "Magic") return QualityTypes.Magic;
    else if (str == "Arcane") return QualityTypes.Arcane;
    else if (str == "Divine") return QualityTypes.Divine;
    else if (str == "Primal") return QualityTypes.Primal;
    else if (str == "Blood") return QualityTypes.Blood;
    else if (str == "Gem") return QualityTypes.Gem;
    else if (str == "Witchcraft") return QualityTypes.Witchcraft;
    else if (str == "Metal") return QualityTypes.Metal;
    else if (str == "Stone") return QualityTypes.Stone;
    else if (str == "Bone") return QualityTypes.Bone;
    else if (str == "Blades") return QualityTypes.Blades;
    else if (str == "Axes") return QualityTypes.Axes;
    else if (str == "Maces/Hammers") return QualityTypes.MacesHammers;
    else if (str == "Polearms") return QualityTypes.Polearms;
    else if (str == "Bows") return QualityTypes.Bows;
    else if (str == "Guns") return QualityTypes.Guns;
    else if (str == "Crossbows") return QualityTypes.Crossbows;
    else if (str == "Add Creature") alert("I dont know what to do with Add Creature on gear.js line 225!");
    else if (str == "Lawful Good") return QualityTypes.LawfulGood;
    else if (str == "Chaotic Good") return QualityTypes.ChaoticGood;
    else if (str == "Neutral Good") return QualityTypes.NeutralGood;
    else if (str == "Lawful Neutral") return QualityTypes.LawfulNeutral;
    else if (str == "True Neutral") return QualityTypes.TrueNeutral;
    else if (str == "Chaotic Neutral") return QualityTypes.ChaoticNeutral;
    else if (str == "Neutral Evil") return QualityTypes.NeutralEvil;
    else if (str == "Lawful Evil") return QualityTypes.LawfulEvil;
    else if (str == "Chaotic Evil") return QualityTypes.ChaoticEvil;
    else if (str == "Lawful") return QualityTypes.Lawful;
    else if (str == "Chaotic") return QualityTypes.Chaotic;
    else if (str == "Good") return QualityTypes.Good;
    else if (str == "Evil") return QualityTypes.Evil;
    else if (str == "Neutral") return QualityTypes.Neutral;
    else if (str == "Ground") return QualityTypes.Ground;
    else if (str == "Swim") return QualityTypes.Swim;
    else if (str == "Climb") return QualityTypes.Climb;
    else if (str == "Jump") return QualityTypes.Jump;
    else if (str == "Burrow") return QualityTypes.Burrow;
    else if (str == "Movement Flight") return QualityTypes.MovementFlight;
    else if (str == "Alchemy") return QualityTypes.Alchemy;
    else if (str == "Brews") return QualityTypes.Brews;
    else if (str == "Oils and Balms") return QualityTypes.OilsAndBalms;
    else if (str == "Toxins") return QualityTypes.Toxins;
    else if (str == "Homunculi") return QualityTypes.Homunculi;
    else if (str == "Explosives") return QualityTypes.Explosives;
    else if (str == "Transmogrify") return QualityTypes.Transmogrify;
    else if (str == "Blacksmith") return QualityTypes.Blacksmith;
    else if (str == "Armorsmith") return QualityTypes.Armorsmith;
    else if (str == "Weaponsmith") return QualityTypes.Weaponsmith;
    else if (str == "Carpentry") return QualityTypes.Carpentry;
    else if (str == "Fletchery") return QualityTypes.Fletchery;
    else if (str == "Leatherwork") return QualityTypes.Leatherwork;
    else if (str == "Tailor") return QualityTypes.Tailor;
    else if (str == "Trapmaking") return QualityTypes.Trapmaking;
    else if (str == "Engineering") return QualityTypes.Engineering;
    else if (str == "Acting") return QualityTypes.Acting;
    else if (str == "Escape Artist") return QualityTypes.EscapeArtist;
    else if (str == "Sleight of Hand") return QualityTypes.SleightOfHand;

    else if (str == "Hide") return QualityTypes.Hide;
    else if (str == "Move Silently") return QualityTypes.MoveSilently;
    else if (str == "Disguise") return QualityTypes.Disguise;
    else if (str == "Medicine") return QualityTypes.Medicine;
    else if (str == "Survival") return QualityTypes.Survival;
    else if (str == "Track") return QualityTypes.Track;
    else if (str == "Flight") return QualityTypes.Flight;
    else if (str == "Insight") return QualityTypes.Insight;
    else if (str == "Bluff") return QualityTypes.Bluff;
    else if (str == "Diplomacy") return QualityTypes.Diplomacy;
    else if (str == "Intimidate") return QualityTypes.Intimidate;
    else if (str == "Pick Lock") return QualityTypes.PickLock;
    else if (str == "Pick Pocket") return QualityTypes.PickPocket;

    else if (str == "Carry Capacity") return QualityTypes.CarryCapacity;
    else if (str == "QuickSteps") return QualityTypes.QckStp;
    else if (str == "OTAs") return QualityTypes.OTAs;
}
function newGearQuality(choice, val, equipment, choiceName, isLoaded = false) {
    return new Quality(val, choice[0], choice[1], equipment, choiceName, isLoaded);
}

function findEquipmentBasedOnQualityID(x) {
    for (let i = 0; i < allQualityHolders.length; ++i) {
        if (allQualityHolders[i].id == x) {
            return allQualityHolders[i];
        }
    }
}

class Quality {
    constructor(value, onAdded, onRemoved, equipment, choiceName, isLoaded = false) {
        this.id = ++qualityIndex;
        this.name = choiceName;
        this.value = value;
        this.equipmentID = equipment.id;
        this.onAdded = onAdded;
        this.onRemoved = onRemoved;
        this.selectedIndexArray = [];

        if (!isLoaded) this.onAdded(this.value);
    }

    getEquipment() {
        return findEquipmentBasedOnQualityID(this.equipmentID);
    }

    changeValue(newValue) {
        this.onRemoved(this.value);
        this.onAdded(newValue);
        this.value = newValue;
    }
    remove() {
        this.onRemoved(this.value);
    }
}
class Weapon {
    constructor() {
        this.id = ++gearIndex;
        this.isEquipped = true;
        this.name = "Unnamed";
        this.type = WeaponTypes.Axe;
        this.size = WeaponSizes.Light;
        this.tier = 0;
        this.accProf = 0;
        this.parryProf = 0;
        this.critChance = 0;
        this.critDamage = 0;
        this.damage = 0;
        this.range = 0;
        this.damageType = "";
        this.qualities = [];
        allQualityHolders.push(this);
    }

    onRemove() {
        for (let i = 0; i < this.qualities.length; ++i) {
            this.qualities[i].remove();
        }

        this.qualities = [];

        for (let i = 0; i < allQualityHolders.length; ++i) {
            if (allQualityHolders[i].id == this.id) {
                allQualityHolders.splice(i, 1);
                return;
            }
        }
    }
    addQuality(qual) { this.qualities.push(qual); }
    removeQuality(qual) { for (let i = 0; i < this.qualities.length; ++i) { if (this.qualities[i].id == qual.id) { this.qualities[i].remove(); this.qualities.splice(i, 1); return; } } }
    changeQuality(oldQual, newQual) {
        this.removeQuality(oldQual);
        this.addQuality(newQual);
    }

    getAccProf() {
        return this.accProf - (this.accProf * mainChar.gear.accProfPercentModifier_LeftHand / 100);
    }
    getParryProf() {
        return this.parryProf - (this.parryProf * mainChar.gear.accProfPercentModifier_LeftHand / 100);
    }
}
class Equipment {
    constructor() {
        this.id = ++gearIndex;
        this.name = "";

        this.qualities = [];
        this.specialQuality = "";
        // Armor Specific
        this.cpForDamageReductions = 0;
        this.weight = 0;
        this.type = ArmorTypes.None;
        allQualityHolders.push(this);
    }

    onRemove() {
        for (let i = 0; i < this.qualities.length; ++i) {
            this.qualities[i].remove();
        }

        this.qualities = [];

        for (let i = 0; i < allQualityHolders.length; ++i) {
            if (allQualityHolders[i].id == this.id) {
                allQualityHolders.splice(i, 1);
                return;
            }
        }
    }

    addQuality(qual) { this.qualities.push(qual); }
    removeQuality(qual) { for (let i = 0; i < this.qualities.length; ++i) { if (this.qualities[i].id == qual.id) { this.qualities[i].remove(); this.qualities.splice(i, 1); return; } } }
    changeQuality(oldQual, newQual) {
        this.removeQuality(oldQual);
        this.addQuality(newQual);
    }

    setCPForDamageReductions(newCP) {
        let oldCP = this.cpForDamageReductions;
        let diff = newCP - oldCP;
        this.cpForDamageReductions = newCP;

        DamageTypes.Physical.addPointsModifier(diff);
        DamageTypes.NegEnergy.addPointsModifier(diff);
        DamageTypes.PosEnergy.addPointsModifier(diff);
        DamageTypes.Fire.addPointsModifier(diff);
        DamageTypes.Cold.addPointsModifier(diff);
        DamageTypes.Lightning.addPointsModifier(diff);
        DamageTypes.Acid.addPointsModifier(diff);
        DamageTypes.Sonic.addPointsModifier(diff);
        DamageTypes.Radiation.addPointsModifier(diff);
    }
}
class Carrying {
    constructor() {
        this.index = ++carryingIndex;
        this.name = "";
        this.weight = 0;
    }
}

class Gear {
    constructor() {
        this.totalWeight = 0;
        this.weapons = [];
        this.equipments = {
            armor: new Equipment(),
            head: new Equipment(),
            waist: new Equipment(),
            eyes: new Equipment(),
            neck: new Equipment(),
            back: new Equipment(),
            arms: new Equipment(),
            hands: new Equipment(),
            feet: new Equipment(),
            undergarment: new Equipment(),
            ring1: new Equipment(),
            ring2: new Equipment(),
            floating1: new Equipment(),
            floating2: new Equipment(),
            floating3: new Equipment()
        };
        this.addedEquipments = [];
        this.carryings = [];

        this.accProfPercentModifier_LeftHand = 0;
        this.parryProfPercentModifier_LeftHand = 0;
        this.accProfPercentModifier_RightHand = 0;
        this.parryProfPercentModifier_RightHand = 0;
    }

    removeCarrying(index) {
        for (let i = 0; i < this.carryings.length; ++i)
            if (this.carryings[i].index == index) {
                this.carryings.splice(i, 1); return;
            }
    }
    newCarrying() {
        let carry = new Carrying();
        this.carryings.push(carry);
        return carry;
    }
    getMainHandAndOffHand() {
        let mainHand = null;
        let offHand = null;

        for (let i = 0; i < this.weapons.length; ++i) {
            if (this.weapons[i].isEquipped) {
                if (mainHand == null) {
                    mainHand = this.weapons[i];
                    continue;
                }
                if (offHand == null) {
                    offHand = this.weapons[i];
                    break;
                }
            }
        }

        return [mainHand, offHand];
    }
    getArmorStatPenalty() {
        if (this.equipments.armor.type == ArmorTypes.VeryLight) return -4;
        else if (this.equipments.armor.type == ArmorTypes.Light) return -5;
        else if (this.equipments.armor.type == ArmorTypes.Medium) return -6;
        else if (this.equipments.armor.type == ArmorTypes.MediumHeavy) return -8;
        else if (this.equipments.armor.type == ArmorTypes.Heavy) return -9;
        else if (this.equipments.armor.type == ArmorTypes.VeryHeavy) return -10;
        return 0;
    }
    getArmorMaxManaPenalty() { // These should be negative when using.
        if (this.equipments.armor.type == ArmorTypes.Light) return 10;
        else if (this.equipments.armor.type == ArmorTypes.Medium) return 15;
        else if (this.equipments.armor.type == ArmorTypes.MediumHeavy) return 20;
        else if (this.equipments.armor.type == ArmorTypes.Heavy) return 25;
        else if (this.equipments.armor.type == ArmorTypes.VeryHeavy) return 30;
        return 0; // VeryLight and None
    }
    getArmorMovementPenalty() { // These should be negative when using.
        if (this.equipments.armor.type == ArmorTypes.Light) return 10;
        else if (this.equipments.armor.type == ArmorTypes.Medium) return 20;
        else if (this.equipments.armor.type == ArmorTypes.MediumHeavy) return 25;
        else if (this.equipments.armor.type == ArmorTypes.Heavy) return 30;
        else if (this.equipments.armor.type == ArmorTypes.VeryHeavy) return 35;
        return 0; // VeryLight and None
    }
    getCritAndCritDamage() {
        let crit = 0;
        let critDam = 0;

        for (let i = 0; i < this.weapons.length; ++i) {
            crit += this.weapons[i].critChance;
            critDam += this.weapons[i].critDamage;
        }

        if (this.weapons.length != 0) {
            crit /= this.weapons.length;
            critDam /= this.weapons.length;
        }

        return crit + "%/" + critDam + "%";
    }
    getWeaponRange() {
        let range = 0;

        for (let i = 0; i < this.weapons.length; ++i) {
            range += this.weapons[i].range;
        }

        if (this.weapons.length != 0) range /= this.weapons.length;

        return formatNumber(range);
    }
    getWeaponAccuracy() {
        let averageWeaponAccuracy = 0;
        for (let i = 0; i < this.weapons.length; ++i)
            averageWeaponAccuracy += this.weapons[i].accProf;
        if (this.weapons.length != 0) averageWeaponAccuracy /= this.weapons.length;

        return averageWeaponAccuracy + mainChar.stats.getAccuracy();
    }
    getWeaponDamage() {
        let tier = 0; // need average
        let wepDamage = 0; // need average
        let strMultiplier = 0;
        let dmgMultiplier = 0;

        for (let i = 0; i < this.weapons.length; ++i) {
            tier += this.weapons[i].tier;
            wepDamage += this.weapons[i].damage;
        }

        if (this.weapons.length != 0) tier /= this.weapons.length;
        if (this.weapons.length != 0) wepDamage /= this.weapons.length;

        let hands = this.getMainHandAndOffHand();
        let mainHand = hands[0];
        let offHand = hands[1];

        if (mainHand && offHand) {
            if (mainHand.size == WeaponSizes.Light && offHand.size == WeaponSizes.Light) {
                dmgMultiplier = 0.75;
                strMultiplier = 0.75;
            }
            else if (mainHand.size == WeaponSizes.OneHand && offHand.size == WeaponSizes.Light) {
                dmgMultiplier = 1;
                strMultiplier = 1;
            }
            else if (mainHand.size == WeaponSizes.Light && offHand.size == WeaponSizes.OneHand) {
                dmgMultiplier = 1;
                strMultiplier = 1;
            }
            else if (mainHand.size == WeaponSizes.OneHand && offHand.size == WeaponSizes.OneHand) {
                dmgMultiplier = 1.1;
                strMultiplier = 1;
            }
        }
        else if (mainHand) {
            if (mainHand.size == WeaponSizes.Light) {
                dmgMultiplier = 0.65;
                strMultiplier = 1;
            }
            else if (mainHand.size == WeaponSizes.OneHand) {
                dmgMultiplier = 1;
                strMultiplier = 1.5;
            }
            else if (mainHand.size == WeaponSizes.TwoHand) {
                dmgMultiplier = 1.5;
                strMultiplier = 1.5;
            }
        }

        let dmgModifier = 0;
        if (this.type == WeaponTypes.Natural) {
            let bodySize = mainChar.stats.getSize();
            let bodySizeModifier = (bodySize == Size.Fine ? -3 : (bodySize == Size.Diminutive ? -2 : (bodySize == Size.Tiny ? -1 : (bodySize == Size.Small ? 0 : (bodySize == Size.Medium ? 0 : (
                bodySize == Size.Large ? 2 : (bodySize == Size.Huge ? 4 : (bodySize == Size.Gargantuan ? 6 : (bodySize == Size.Colossal ? 8 : 0)))
            ))))));

            dmgModifier = bodySizeModifier;
        }

        return (tier + 3.5) * (wepDamage / 100) * dmgMultiplier + ((mainChar.stats.getDamageBase() + mainChar.cpStats.getDamage() + mainChar.stats.damageGearModifier) * strMultiplier) + dmgModifier;
    }
    getWeaponApAP() {
        let attacksPerAP = "0/0";
        let hands = this.getMainHandAndOffHand();
        let mainHand = hands[0];
        let offHand = hands[1];

        if (mainHand && offHand) {
            if (mainHand.size == WeaponSizes.Light && offHand.size == WeaponSizes.Light) return "2/3";
            else if (mainHand.size == WeaponSizes.OneHand && offHand.size == WeaponSizes.Light) return "1/2";
            else if (mainHand.size == WeaponSizes.Light && offHand.size == WeaponSizes.OneHand) return "1/2";
            else if (mainHand.size == WeaponSizes.OneHand && offHand.size == WeaponSizes.OneHand) return "1/2";
        }
        else if (mainHand) {
            if (mainHand.size == WeaponSizes.Light) return "1/2";
            else if (mainHand.size == WeaponSizes.OneHand) return "1/3";
            else if (mainHand.size == WeaponSizes.TwoHand) return "1/3";
        }

        return attacksPerAP;
    }
    getWeaponDodge() {
        let averageWeaponParry = 0;
        for (let i = 0; i < this.weapons.length; ++i)
            averageWeaponParry += this.weapons[i].parryProf;
        if (this.weapons.length != 0) averageWeaponParry /= this.weapons.length;

        return averageWeaponParry + VSDefs.Reflex.getPoints() + mainChar.stats.dodgeModifier;
    }
    getWeapons() {
        let hands = this.getMainHandAndOffHand();
        let _mainHand = hands[0];
        let _offHand = hands[1];

        let mainHand = _mainHand ? _mainHand.name: "";
        let offHand = _offHand ? _offHand.name: "";

        let finalText = mainHand != "" ? (offHand != "" ? mainHand + ", " + offHand : mainHand) : "Unarmed";
        return finalText;
    }
    newWeapon() {
        var wep = new Weapon();
        this.weapons.push(wep);

        return wep;
    }
    removeWeapon(id) {
        for (let i = 0; i < this.weapons.length; ++i) {
            if (this.weapons[i].id == id) {
                this.weapons[i].onRemove();
                this.weapons.splice(i, 1);
                break;
            }
        }
    }
    newEquipment() {
        var eq = new Equipment();
        this.addedEquipments.push(eq);

        return eq;
    }
    removeEquipment(id) {
        for (let i = 0; i < this.addedEquipments.length; ++i) {
            if (this.addedEquipments[i].id == id) {
                this.addedEquipments[i].onRemove();
                this.addedEquipments.splice(i, 1);
                break;
            }
        }
    }
    getTotalWeight() {
        let _totalWeight = this.equipments.armor.weight;
        for (let i = 0; i < mainChar.gear.carryings.length; ++i) {
            _totalWeight += mainChar.gear.carryings[i].weight;
        }

        return this.totalWeight + _totalWeight;
    }
}