const Size = {
    Fine: 0,
    Diminutive: 1,
    Tiny: 2,
    Small: 3,
    Medium: 4,
    Large: 5,
    Huge: 6,
    Gargantuan: 7,
    Colossal: 8
}
const BodyType = {
    Biped: 0,
    Triped: 1,
    Quadruped: 2,
    FiveLegs: 3,
    Slithers: 4,
    Rolls: 5
}
const Encumbrance = {
    Light: 0,
    Medium: 1,
    Heavy: 2,
    Encumbered: 3,
    OverEncumbered: 4
}


class Stats {
    constructor(level = 1) {
        // Initial Stats
        this.level = level;
        this.xp = Table_GetXP(this.level);

        this.cp = this.getMaxCP();
        this.maxCP = 0;
        this.cpModifier = 0;

        this.size = Size.Medium;
        this.bodyType = BodyType.Biped;

        addTrainingPoints("Body Size", 0, this.getBodySizeCPCost(), false).isSwappable = false; // BodySize Quality Initialization for Details Page
        addTrainingPoints("Body Type", 0, this.getBodyTypeCPCost(), false).isSwappable = false; // BodyType Quality Initialization for Details Page

        // Attributes
        this.strength = 0;
        this.agility = 0;
        this.discipline = 0;
        this.intelligence = 0;
        this.conviction = 0;
        this.attunement = 0;
        this.constitution = 0;

        this.strengthGearModifier = 0;
        this.agilityGearModifier = 0;
        this.disciplineGearModifier = 0;
        this.intelligenceGearModifier = 0;
        this.convictionGearModifier = 0;
        this.attunementGearModifier = 0;
        this.constitutionGearModifier = 0;

        // Attributes Modifiers
        this.strengthModifier = 0;
        this.agilityModifier = 0;
        this.disciplineModifier = 0;
        this.intelligenceModifier = 0;
        this.convictionModifier = 0;
        this.attunementModifier = 0;
        this.constitutionModifier = 0;

        // Main Stats
        this.hp = 0;
        this.mana = 0;
        this.stamina = 0;
        this.accuracy = 0;
        this.parry = 0;
        this.damage = 0;
        this.dodge = 0;

        // Main Stats Modifiers
        this.hpModifier = 0;
        this.manaModifier = 0;
        this.staminaModifier = 0;
        this.accuracyModifier = 0;
        this.parryModifier = 0;
        this.damageModifier = 0;
        this.dodgeModifier = 0;
        this.maxHPModifier = 0;
        this.maxManaModifier = 0;
        this.maxStaminaModifier = 0;

        // Movement
        this.movements = {
            ground: new Movement(() => { return 30 + (mainChar.stats.getAgility() / 7) * 5; },
                () => { return (6 + mainChar.stats.getLevel() / 3) * 5; },
                9 / 5, null, "Ground"),
            swim: new Movement(() => { return 15 + ((mainChar.stats.getStrength() + mainChar.stats.getAgility()) / 7) * 5; },
                () => { return (12 + mainChar.stats.getLevel() / 3) * 5; },
                8 / 5, null, "Swim"),
            climb: new Movement(() => { return 10 + ((mainChar.stats.getStrength() + mainChar.stats.getAgility()) / 6) * 5; },
                () => { return (6 + mainChar.stats.getLevel() / 3) * 5; },
                6 / 5, null, "Climb"),
            jump: new Movement(() => { return 5 + (mainChar.stats.getStrength() / 6) * 5; },
                () => { return (5 + mainChar.stats.getLevel() / 2) * 5; },
                6 / 5, null, "Jump"),
            burrow: new Movement(() => { return 0; },
                () => { return (6 + mainChar.stats.getLevel() / 2) * 5; },
                20, [5, 6 / 5], "Burrow"),
            flight: new Movement(() => { return 0; },
                () => { return (10 + mainChar.stats.getLevel() * 2) * 10; },
                40, [10, 3 / 5], "Flight")
        }

        // Skills
        this.craftingSkills = {
            Alchemy: new craftingSkills(() => {
                return (mainChar.stats.getDiscipline() / 2 + mainChar.stats.getIntelligence() + mainChar.stats.getConviction()) / 3;
            }, 4, "Alchemy", false, false, (x) => {
                DamageTypes.Acid.addCapModifier(1 * x);
                VSDefs.Toxic.addCapModifier(1 * x);
                VSDefs.Concentration.addCapModifier(1 * x);
                VSDefs.Destruction.addCapModifier(1 * x);
            }, (x) => {
                DamageTypes.Acid.reduceCapModifier(1 * x);
                VSDefs.Toxic.reduceCapModifier(1 * x);
                VSDefs.Concentration.reduceCapModifier(1 * x);
                VSDefs.Destruction.reduceCapModifier(1 * x);
            }),
            Brews: new craftingSkills(() => {
                return (mainChar.stats.getDiscipline() / 2 + mainChar.stats.getIntelligence() + mainChar.stats.getConviction()) / 3;
            }, 1.5, "Brews", false, false, (x) => {
                VSDefs.Concentration.addCapModifier(1 * x);
                VSDefs.Compulsions.addCapModifier(1 * x);

                // Senses
                VSEnvironments.Spot.addCapModifier(1 * x);
                VSEnvironments.Listen.addCapModifier(1 * x);
                VSEnvironments.Scent.addCapModifier(1 * x);
            }, (x) => {
                VSDefs.Concentration.reduceCapModifier(1 * x);
                VSDefs.Compulsions.reduceCapModifier(1 * x);

                // Senses
                VSEnvironments.Spot.reduceCapModifier(1 * x);
                VSEnvironments.Listen.reduceCapModifier(1 * x);
                VSEnvironments.Scent.reduceCapModifier(1 * x);
            }),
            OilsAndBalms: new craftingSkills(() => {
                return (mainChar.stats.getDiscipline() / 2 + mainChar.stats.getIntelligence() + mainChar.stats.getConviction()) / 3;
            }, 1.5, "Oils and Balms", false, false, (x) => {
                VSDefs.Concentration.addCapModifier(1 * x);
                VSDefs.Compulsions.addCapModifier(1 * x);

                // Senses
                VSEnvironments.Spot.addCapModifier(1 * x);
                VSEnvironments.Listen.addCapModifier(1 * x);
                VSEnvironments.Scent.addCapModifier(1 * x);
            }, (x) => {
                VSDefs.Concentration.reduceCapModifier(1 * x);
                VSDefs.Compulsions.reduceCapModifier(1 * x);

                // Senses
                VSEnvironments.Spot.reduceCapModifier(1 * x);
                VSEnvironments.Listen.reduceCapModifier(1 * x);
                VSEnvironments.Scent.reduceCapModifier(1 * x);
            }),
            Toxins: new craftingSkills(() => {
                return (mainChar.stats.getDiscipline() / 2 + mainChar.stats.getIntelligence() + mainChar.stats.getConviction()) / 3;
            }, 1.5, "Toxins", false, false, (x) => {
                VSDefs.Concentration.addCapModifier(1 * x);
                VSDefs.Compulsions.addCapModifier(1 * x);

                // Senses
                VSEnvironments.Spot.addCapModifier(1 * x);
                VSEnvironments.Listen.addCapModifier(1 * x);
                VSEnvironments.Scent.addCapModifier(1 * x);
            }, (x) => {
                VSDefs.Concentration.reduceCapModifier(1 * x);
                VSDefs.Compulsions.reduceCapModifier(1 * x);

                // Senses
                VSEnvironments.Spot.reduceCapModifier(1 * x);
                VSEnvironments.Listen.reduceCapModifier(1 * x);
                VSEnvironments.Scent.reduceCapModifier(1 * x);
            }),
            Homunculi: new craftingSkills(() => {
                return (mainChar.stats.getDiscipline() / 2 + mainChar.stats.getIntelligence() + mainChar.stats.getConviction()) / 3;
            }, 1.5, "Homunculi", false, false, (x) => {
                VSDefs.Concentration.addCapModifier(1 * x);
                VSDefs.Compulsions.addCapModifier(1 * x);

                // Senses
                VSEnvironments.Spot.addCapModifier(1 * x);
                VSEnvironments.Listen.addCapModifier(1 * x);
                VSEnvironments.Scent.addCapModifier(1 * x);
            }, (x) => {
                VSDefs.Concentration.reduceCapModifier(1 * x);
                VSDefs.Compulsions.reduceCapModifier(1 * x);

                // Senses
                VSEnvironments.Spot.reduceCapModifier(1 * x);
                VSEnvironments.Listen.reduceCapModifier(1 * x);
                VSEnvironments.Scent.reduceCapModifier(1 * x);
            }),
            Explosives: new craftingSkills(() => {
                return (mainChar.stats.getDiscipline() / 2 + mainChar.stats.getIntelligence() + mainChar.stats.getConviction()) / 3;
            }, 1.5, "Explosives", false, false, (x) => {
                VSDefs.Concentration.addCapModifier(1 * x);
                VSDefs.Compulsions.addCapModifier(1 * x);

                // Senses
                VSEnvironments.Spot.addCapModifier(1 * x);
                VSEnvironments.Listen.addCapModifier(1 * x);
                VSEnvironments.Scent.addCapModifier(1 * x);
            }, (x) => {
                VSDefs.Concentration.reduceCapModifier(1 * x);
                VSDefs.Compulsions.reduceCapModifier(1 * x);

                // Senses
                VSEnvironments.Spot.reduceCapModifier(1 * x);
                VSEnvironments.Listen.reduceCapModifier(1 * x);
                VSEnvironments.Scent.reduceCapModifier(1 * x);
            }),
            Transmogrify: new craftingSkills(() => {
                return (mainChar.stats.getDiscipline() / 2 + mainChar.stats.getIntelligence() + mainChar.stats.getConviction()) / 3;
            }, 1.5, "Transmogrify", false, false, (x) => {
                VSDefs.Concentration.addCapModifier(1 * x);
                VSDefs.Compulsions.addCapModifier(1 * x);

                // Senses
                VSEnvironments.Spot.addCapModifier(1 * x);
                VSEnvironments.Listen.addCapModifier(1 * x);
                VSEnvironments.Scent.addCapModifier(1 * x);
            }, (x) => {
                VSDefs.Concentration.reduceCapModifier(1 * x);
                VSDefs.Compulsions.reduceCapModifier(1 * x);

                // Senses
                VSEnvironments.Spot.reduceCapModifier(1 * x);
                VSEnvironments.Listen.reduceCapModifier(1 * x);
                VSEnvironments.Scent.reduceCapModifier(1 * x);
            }),
            Blacksmith: new craftingSkills(() => {
                return (mainChar.stats.getStrength() / 2 + mainChar.stats.getDiscipline() / 2 + mainChar.stats.getIntelligence() + mainChar.stats.getConviction()) / 3;
            }, 1.5, "Blacksmith", false, false, (x) => {
                DamageTypes.Fire.addCapModifier(1 * x);
                VSDefs.Grip.addCapModifier(1 * x);
                VSDefs.Destruction.addCapModifier(1 * x);
                mainChar.cpStats.addAccuracyCap(2 * x);
            }, (x) => {
                DamageTypes.Fire.reduceCapModifier(1 * x);
                VSDefs.Grip.reduceCapModifier(1 * x);
                VSDefs.Destruction.reduceCapModifier(1 * x);
                mainChar.cpStats.reduceAccuracyCap(2 * x);
            }),
            Armorsmith: new craftingSkills(() => {
                return (mainChar.stats.getStrength() / 2 + mainChar.stats.getDiscipline() / 2 + mainChar.stats.getIntelligence() + mainChar.stats.getConviction()) / 3;
            }, 1.5, "Armorsmith", false, false, (x) => {
                VSDefs.Concentration.addCapModifier(1 * x);
                VSDefs.Compulsions.addCapModifier(1 * x);

                // Senses
                VSEnvironments.Spot.addCapModifier(1 * x);
                VSEnvironments.Listen.addCapModifier(1 * x);
                VSEnvironments.Scent.addCapModifier(1 * x);
            }, (x) => {
                VSDefs.Concentration.reduceCapModifier(1 * x);
                VSDefs.Compulsions.reduceCapModifier(1 * x);

                // Senses
                VSEnvironments.Spot.reduceCapModifier(1 * x);
                VSEnvironments.Listen.reduceCapModifier(1 * x);
                VSEnvironments.Scent.reduceCapModifier(1 * x);
            }),
            Weaponsmith: new craftingSkills(() => {
                return (mainChar.stats.getStrength() / 2 + mainChar.stats.getDiscipline() / 2 + mainChar.stats.getIntelligence() + mainChar.stats.getConviction()) / 3;
            }, 1.5, "Weaponsmith", false, false, (x) => {
                VSDefs.Concentration.addCapModifier(1 * x);
                VSDefs.Compulsions.addCapModifier(1 * x);

                // Senses
                VSEnvironments.Spot.addCapModifier(1 * x);
                VSEnvironments.Listen.addCapModifier(1 * x);
                VSEnvironments.Scent.addCapModifier(1 * x);
            }, (x) => {
                VSDefs.Concentration.reduceCapModifier(1 * x);
                VSDefs.Compulsions.reduceCapModifier(1 * x);

                // Senses
                VSEnvironments.Spot.reduceCapModifier(1 * x);
                VSEnvironments.Listen.reduceCapModifier(1 * x);
                VSEnvironments.Scent.reduceCapModifier(1 * x);
            }),
            Carpentry: new craftingSkills(() => {
                let str = mainChar.stats.getStrength();
                let agi = mainChar.stats.getAgility() / 2;
                let disc = mainChar.stats.getDiscipline();
                let conv = mainChar.stats.getConviction();
                let intel = mainChar.stats.getIntelligence();

                return ((str > agi ? str : agi) + disc / 2 + intel + conv) / 3;
            }, 1.5, "Carpentry", false, false, (x) => {
                VSDefs.Balance.addCapModifier(1 * x);
                VSDefs.Shapechange.addCapModifier(1 * x);
                mainChar.cpStats.addAccuracyCap(2 * x);
                VSEnvironments.Spot.addCapModifier(1 * x);
            }, (x) => {
                VSDefs.Balance.reduceCapModifier(1 * x);
                VSDefs.Shapechange.reduceCapModifier(1 * x);
                mainChar.cpStats.reduceAccuracyCap(2 * x);
                VSEnvironments.Spot.reduceCapModifier(1 * x);
            }),
            Fletchery: new craftingSkills(() => {
                let str = mainChar.stats.getStrength();
                let agi = mainChar.stats.getAgility() / 2;
                let disc = mainChar.stats.getDiscipline();
                let conv = mainChar.stats.getConviction();
                let intel = mainChar.stats.getIntelligence();

                return ((str > agi ? str : agi) + disc / 2 + intel + conv) / 3;
            }, 1.5, "Fletchery", false, false, (x) => {
                VSDefs.Concentration.addCapModifier(1 * x);
                VSDefs.Compulsions.addCapModifier(1 * x);

                // Senses
                VSEnvironments.Spot.addCapModifier(1 * x);
                VSEnvironments.Listen.addCapModifier(1 * x);
                VSEnvironments.Scent.addCapModifier(1 * x);
            }, (x) => {
                VSDefs.Concentration.reduceCapModifier(1 * x);
                VSDefs.Compulsions.reduceCapModifier(1 * x);

                // Senses
                VSEnvironments.Spot.reduceCapModifier(1 * x);
                VSEnvironments.Listen.reduceCapModifier(1 * x);
                VSEnvironments.Scent.reduceCapModifier(1 * x);
            }),
            Leatherwork: new craftingSkills(() => {
                let str = mainChar.stats.getStrength();
                let agi = mainChar.stats.getAgility() / 2;
                let disc = mainChar.stats.getDiscipline();
                let conv = mainChar.stats.getConviction();
                let intel = mainChar.stats.getIntelligence();

                return ((str > agi ? str : agi) + disc / 2 + intel + conv) / 3;
            }, 1.5, "Leatherwork", false, false, (x) => {
                VSDefs.Reflex.addCapModifier(2 * x);
                VSDefs.Shapechange.addCapModifier(1 * x);
                VSDefs.Destruction.addCapModifier(1 * x);
            }, (x) => {
                VSDefs.Reflex.reduceCapModifier(2 * x);
                VSDefs.Shapechange.reduceCapModifier(1 * x);
                VSDefs.Destruction.reduceCapModifier(1 * x);
            }),
            Tailor: new craftingSkills(() => {
                let agi = mainChar.stats.getAgility();
                let disc = mainChar.stats.getDiscipline();
                let conv = mainChar.stats.getConviction();
                let intel = mainChar.stats.getIntelligence();

                return (agi / 2 + disc / 2 + intel + conv) / 3;
            }, 1.5, "Tailor", false, false, (x) => {
                VSDefs.Shapechange.addCapModifier(1 * x);
                VSDefs.Reflex.addCapModifier(2 * x);
                VSDefs.Destruction.addCapModifier(1 * x);
            }, (x) => {
                VSDefs.Shapechange.reduceCapModifier(1 * x);
                VSDefs.Reflex.reduceCapModifier(2 * x);
                VSDefs.Destruction.reduceCapModifier(1 * x);
            }),
            Trapmaking: new craftingSkills(() => {
                let agi = mainChar.stats.getAgility();
                let disc = mainChar.stats.getDiscipline();
                let conv = mainChar.stats.getConviction();
                let intel = mainChar.stats.getIntelligence();

                return (agi / 2 + disc / 2 + intel + conv) / 3;
            }, 1.5, "Trapmaking", false, false, (x) => {
                VSEnvironments.Traps.addCapModifier(2 * x);
                VSDefs.Reflex.addCapModifier(2 * x);
            }, (x) => {
                VSEnvironments.Traps.reduceCapModifier(2 * x);
                VSDefs.Reflex.reduceCapModifier(2 * x);
            }),
            Engineering: new craftingSkills(() => {
                let disc = mainChar.stats.getDiscipline();
                let conv = mainChar.stats.getConviction();
                let intel = mainChar.stats.getIntelligence();

                return (disc / 2 + intel + conv) / 3;
            }, 1.5, "Engineering", false, false, (x) => {
                DamageTypes.Fire.addCapModifier(1 * x);
                VSDefs.Destruction.addCapModifier(1 * x);
                VSDefs.Concentration.addCapModifier(1 * x);
                DamageTypes.Lightning.addCapModifier(1 * x);
            }, (x) => {
                DamageTypes.Fire.reduceCapModifier(1 * x);
                VSDefs.Destruction.reduceCapModifier(1 * x);
                VSDefs.Concentration.reduceCapModifier(1 * x);
                DamageTypes.Lightning.reduceCapModifier(1 * x);
            })
        }
        this.performSkills = {
            Acting: new performSkills(() => {
                let disc = mainChar.stats.getDiscipline();
                let conv = mainChar.stats.getConviction();
                let intel = mainChar.stats.getIntelligence();

                return ((disc + (intel / 2) + (conv / 2))) / 3;
            }, "Acting", false, false, (x) => {
                VSDefs.Concentration.addCapModifier(1 * x);
                VSDefs.Reflex.addCapModifier(1 * x);
            }, (x) => {
                VSDefs.Concentration.reduceCapModifier(1 * x);
                VSDefs.Reflex.reduceCapModifier(1 * x);
            }),
            EscapeArtist: new performSkills(() => {
                let agi = mainChar.stats.getAgility() / 2;
                let disc = mainChar.stats.getDiscipline();

                return (disc + agi / 2) / 3;
            }, "Escape Artist", false, false, (x) => {
                VSDefs.Concentration.addCapModifier(1 * x);
                VSDefs.Reflex.addCapModifier(1 * x);
            }, (x) => {
                VSDefs.Concentration.reduceCapModifier(1 * x);
                VSDefs.Reflex.reduceCapModifier(1 * x);
            }),
            SleightOfHand: new performSkills(() => {
                let agi = mainChar.stats.getAgility() / 2;
                let disc = mainChar.stats.getDiscipline();

                return (disc + agi / 2) / 3;
            }, "Sleight of Hand", false, false, (x) => {
                VSDefs.Concentration.addCapModifier(1 * x);
                VSDefs.Reflex.addCapModifier(1 * x);
            }, (x) => {
                VSDefs.Concentration.reduceCapModifier(1 * x);
                VSDefs.Reflex.reduceCapModifier(1 * x);
            })
        }
        this.skills = {
            Hide: new Skill(() => {
                let agi = mainChar.stats.getAgility() / 2;
                let disc = mainChar.stats.getDiscipline();


                return (agi + disc) / 3;
            }, 2.5, "Hide", (x) => {
                VSDefs.Balance.addCapModifier(1 * x);
                VSDefs.Reflex.addCapModifier(1 * x);
            }, (x) => {
                VSDefs.Balance.reduceCapModifier(1 * x);
                VSDefs.Reflex.reduceCapModifier(1 * x);
            }),
            MoveSilently: new Skill(() => {
                let agi = mainChar.stats.getAgility() / 2;
                let disc = mainChar.stats.getDiscipline();

                return (agi + disc) / 3;
            }, 2, "Move Silently", (x) => {
                VSDefs.Balance.addCapModifier(1 * x);
                VSDefs.Reflex.addCapModifier(1 * x);
            }, (x) => {
                VSDefs.Balance.reduceCapModifier(1 * x);
                VSDefs.Reflex.reduceCapModifier(1 * x);
            }),
            Disguise: new Skill(() => {
                let disc = mainChar.stats.getDiscipline();
                let conv = mainChar.stats.getConviction();
                let intel = mainChar.stats.getIntelligence();

                return (disc + intel / 2 + conv / 2) / 3;
            }, 1.5, "Disguise", (x) => {
                VSDefs.Compulsions.addCapModifier(1 * x);
                VSDefs.Emotions.addCapModifier(1 * x);
                VSDefs.Scry.addCapModifier(1 * x);
            }, (x) => {
                VSDefs.Compulsions.reduceCapModifier(1 * x);
                VSDefs.Emotions.reduceCapModifier(1 * x);
                VSDefs.Scry.reduceCapModifier(1 * x);
            }),
            Medicine: new Skill(() => {
                let disc = mainChar.stats.getDiscipline();
                let conv = mainChar.stats.getConviction();
                let intel = mainChar.stats.getIntelligence();
                let att = mainChar.stats.getAttunement();

                return (disc / 2 + intel + conv + att / 2) / 3;
            }, 2, "Medicine", (x) => {
                VSDefs.Toxic.addCapModifier(1 * x);
                VSDefs.Destruction.addCapModifier(1 * x);
                VSDefs.Emotions.addCapModifier(1 * x);
            }, (x) => {
                VSDefs.Toxic.reduceCapModifier(1 * x);
                VSDefs.Destruction.reduceCapModifier(1 * x);
                VSDefs.Emotions.reduceCapModifier(1 * x);
            }),
            Survival: new Skill(() => {
                let disc = mainChar.stats.getDiscipline();
                let conv = mainChar.stats.getConviction();
                let intel = mainChar.stats.getIntelligence();
                let att = mainChar.stats.getAttunement();

                return (disc + intel + conv + att) / 4;
            }, 2, "Survival", (x) => {
                VSEnvironments.EnvHot.addCapModifier(1 * x);
                VSEnvironments.EnvCold.addCapModifier(1 * x);

                // Senses
                VSEnvironments.Spot.addCapModifier(1 * x);
                VSEnvironments.Listen.addCapModifier(1 * x);
                VSEnvironments.Scent.addCapModifier(1 * x);
            }, (x) => {
                VSEnvironments.EnvHot.reduceCapModifier(1 * x);
                VSEnvironments.EnvCold.reduceCapModifier(1 * x);

                // Senses
                VSEnvironments.Spot.reduceCapModifier(1 * x);
                VSEnvironments.Listen.reduceCapModifier(1 * x);
                VSEnvironments.Scent.reduceCapModifier(1 * x);
            }),
            Track: new Skill(() => {
                let conv = mainChar.stats.getConviction();
                let intel = mainChar.stats.getIntelligence();
                let att = mainChar.stats.getAttunement();

                return (intel + conv + att) / 3;
            }, 1, "Track", (x) => {
                // Senses
                VSEnvironments.Spot.addCapModifier(1 * x);
                VSEnvironments.Listen.addCapModifier(1 * x);
                VSEnvironments.Scent.addCapModifier(1 * x);
            }, (x) => {
                // Senses
                VSEnvironments.Spot.reduceCapModifier(1 * x);
                VSEnvironments.Listen.reduceCapModifier(1 * x);
                VSEnvironments.Scent.reduceCapModifier(1 * x);
            }),
            Flight: new Skill(() => { return 0; }, 1.5, "Flight", (x) => {
                VSDefs.Concentration.addCapModifier(1 * x);
                VSDefs.Compulsions.addCapModifier(1 * x);

                // Senses
                VSEnvironments.Spot.addCapModifier(1 * x);
                VSEnvironments.Listen.addCapModifier(1 * x);
                VSEnvironments.Scent.addCapModifier(1 * x);
            }, (x) => {
                VSDefs.Concentration.reduceCapModifier(1 * x);
                VSDefs.Compulsions.reduceCapModifier(1 * x);

                // Senses
                VSEnvironments.Spot.reduceCapModifier(1 * x);
                VSEnvironments.Listen.reduceCapModifier(1 * x);
                VSEnvironments.Scent.reduceCapModifier(1 * x);
            }),
            Insight: new Skill(() => {
                let conv = mainChar.stats.getConviction();
                let intel = mainChar.stats.getIntelligence();
                let att = mainChar.stats.getAttunement();

                return (intel + conv + att) / 4;
            }, 2.5, "Insight", (x) => {
                VSDefs.Compulsions.addCapModifier(1 * x);
                VSEnvironments.Listen.addCapModifier(1 * x);
                VSEnvironments.Spot.addCapModifier(1 * x);
            }, (x) => {
                VSDefs.Compulsions.reduceCapModifier(1 * x);
                VSEnvironments.Listen.reduceCapModifier(1 * x);
                VSEnvironments.Spot.reduceCapModifier(1 * x);
            }),
            Bluff: new Skill(() => {
                let conv = mainChar.stats.getConviction();
                let intel = mainChar.stats.getIntelligence();
                let att = mainChar.stats.getAttunement();

                return (intel + conv + att) / 4;
            }, 2.5, "Bluff", (x) => {
                VSEnvironments.Spot.addCapModifier(1 * x);
                VSEnvironments.Listen.addCapModifier(1 * x);
                VSDefs.Emotions.addCapModifier(1 * x);
            }, (x) => {
                VSEnvironments.Spot.reduceCapModifier(1 * x);
                VSEnvironments.Listen.reduceCapModifier(1 * x);
                VSDefs.Emotions.reduceCapModifier(1 * x);
            }),
            Diplomacy: new Skill(() => {
                let conv = mainChar.stats.getConviction();
                let intel = mainChar.stats.getIntelligence();
                let att = mainChar.stats.getAttunement();

                return (intel + conv + att) / 4;
            }, 2.5, "Diplomacy", (x) => {
                VSEnvironments.Spot.addCapModifier(1 * x);
                VSEnvironments.Listen.addCapModifier(1 * x);
                VSDefs.Emotions.addCapModifier(1 * x);
            }, (x) => {
                VSEnvironments.Spot.reduceCapModifier(1 * x);
                VSEnvironments.Listen.reduceCapModifier(1 * x);
                VSDefs.Emotions.reduceCapModifier(1 * x);
            }),
            Intimidate: new Skill(() => {
                let conv = mainChar.stats.getConviction();
                let intel = mainChar.stats.getIntelligence();
                let att = mainChar.stats.getAttunement();

                return (intel + conv + att) / 4;
            }, 2.5, "Intimidate", (x) => {
                VSEnvironments.Spot.addCapModifier(1 * x);
                VSEnvironments.Listen.addCapModifier(1 * x);
                VSDefs.Emotions.addCapModifier(1 * x);
            }, (x) => {
                VSEnvironments.Spot.reduceCapModifier(1 * x);
                VSEnvironments.Listen.reduceCapModifier(1 * x);
                VSDefs.Emotions.reduceCapModifier(1 * x);
            }),
            PickLock: new Skill(() => {
                let agi = mainChar.stats.getAgility() / 2;
                let disc = mainChar.stats.getDiscipline();

                return (agi + disc) / 3;
            }, 1.5, "Pick Lock", (x) => {
                VSDefs.Concentration.addCapModifier(1 * x);
                VSDefs.Restraint.addCapModifier(1 * x);
                VSEnvironments.Listen.addCapModifier(1 * x);
            }, (x) => {
                VSDefs.Concentration.reduceCapModifier(1 * x);
                VSDefs.Restraint.reduceCapModifier(1 * x);
                VSEnvironments.Listen.reduceCapModifier(1 * x);
            }),
            PickPocket: new Skill(() => {
                let agi = mainChar.stats.getAgility() / 2;
                let disc = mainChar.stats.getDiscipline();
                let att = mainChar.stats.getAttunement();

                return (agi + (disc + att) / 2) / 3;
            }, 1.5, "Pick Pocket", (x) => {
                VSDefs.Concentration.addCapModifier(1 * x);
                VSDefs.Reflex.addCapModifier(1 * x);
            }, (x) => {
                VSDefs.Concentration.reduceCapModifier(1 * x);
                VSDefs.Reflex.reduceCapModifier(1 * x);
            })
        }

        // ETC
        this.ap = 6;
        this.apModifier = 0;
        this.encumbranceLevel = 0;
        this.dive = 0;
        this.spaceLength = 5;
        this.spaceWidth = 5;
        addTrainingPoints("Perimeter", 0, -this.getPerimeter(), false).isSwappable = false; // Perimeter Quality Initialization for Details Page
        this.carryCapacity = 0;
        this.carryCapacityModifier = 0;
        this.quickStep = 5;
        this.quickStepModifier = 0;
        this.OTAs = 1; // Off Turn Actions, AoO Attacks of Oppurtunity
        this.OTAsModifier = 0;

        // Gear Modifiers
        this.maxHPGearModifier = 0;
        this.maxStaminaGearModifier = 0;
        this.maxManaGearModifier = 0;
        this.accuracyGearModifier = 0;
        this.parryGearModifier = 0;
        this.damageGearModifier = 0;
        this.carryCapacityGearModifier = 0;
        this.quickStepGearModifier = 0;
        this.OTAsGearModifier = 0;

        // Breathe Counter
        this.breathe = 0;
    }

    getBodySizeCPCost() {
        let bodySize = this.getSize();
        let bodySizeModifier = (bodySize == Size.Fine ? 8 : (bodySize == Size.Diminutive ? 8 : (bodySize == Size.Tiny ? 7 : (bodySize == Size.Small ? 13 : (bodySize == Size.Medium ? 0 : (
            bodySize == Size.Large ? 90 : (bodySize == Size.Huge ? 181 : (bodySize == Size.Gargantuan ? 235 : (bodySize == Size.Colossal ? 323 : 0)))))))));

        return bodySizeModifier;
    }
    getBodyTypeCPCost() {
        let bodyType = this.getBodyType();
        let bodyTypeModifier = (bodyType == BodyType.Triped ? 18 : (bodyType == BodyType.Quadruped ? 32 : (bodyType == BodyType.FiveLegs ? 38 :
            (bodyType == BodyType.Slithers ? 38 : (bodyType == BodyType.Rolls ? 31 : 0)))));

        return bodyTypeModifier;
    }
    setBreathe(x) {
        this.breathe = x;
    }
    reduceBreathe(x) {
        this.breathe -= x;
    }
    getBreathe() {
        return this.breathe;
    }
    getCarryCapacityGearModifier() { return this.carryCapacityGearModifier; }
    getQuickStepGearModifier() { return this.quickStepGearModifier; }
    getOTAsGearModifier() { return this.OTAsGearModifier; }
    // ETC
    reduceCarryCapacity(x, src = null) { this.carryCapacityModifier -= x; if (src == "Gear") { this.carryCapacityGearModifier -= x; } }
    addCarryCapacity(x, src = null) { this.carryCapacityModifier += x; if (src == "Gear") { this.carryCapacityGearModifier += x; } }
    reduceQuickStep(x, src = null) { this.quickStepModifier -= x; if (src == "Gear") { this.quickStepGearModifier -= x; } }
    addQuickStep(x, src = null) { this.quickStepModifier += x; if (src == "Gear") { this.quickStepGearModifier += x; } }
    reduceOTAs(x, src = null) { this.OTAsModifier -= x; if (src == "Gear") { this.OTAsGearModifier -= x; } }
    addOTAs(x, src = null) { this.OTAsModifier += x; if (src == "Gear") { this.OTAsGearModifier += x; } }

    // Attributes
    getStrength() {
        let bodySize = this.getSize();
        let bodySizeModifier = (bodySize == Size.Fine ? -6 : (bodySize == Size.Diminutive ? -5 : (bodySize == Size.Tiny ? -4 : (bodySize == Size.Small ? -2 : (bodySize == Size.Medium ? 0 : (
            bodySize == Size.Large ? 4 : (bodySize == Size.Huge ? 8 : (bodySize == Size.Gargantuan ? 12 : (bodySize == Size.Colossal ? 16 : 0)))))))));
        let cpBought = mainChar.cpStats.strengthCount;

        return this.strength + bodySizeModifier + this.strengthModifier + cpBought;
    }
    getAgility() {
        let bodySize = this.getSize();
        let bodySizeModifier = (bodySize == Size.Fine ? 4 : (bodySize == Size.Diminutive ? 3 : (bodySize == Size.Tiny ? 2 : (bodySize == Size.Small ? 1 : (bodySize == Size.Medium ? 0 : (
            bodySize == Size.Large ? -2 : (bodySize == Size.Huge ? -4 : (bodySize == Size.Gargantuan ? -6 : (bodySize == Size.Colossal ? -8 : 0)))))))));
        let cpBought = mainChar.cpStats.agilityCount;

        return this.agility + bodySizeModifier + this.agilityModifier + cpBought;
    }
    getConstitution() {
        let bodySize = this.getSize();
        let bodySizeModifier = (bodySize == Size.Fine ? -3 : (bodySize == Size.Diminutive ? -2 : (bodySize == Size.Tiny ? -1 : (bodySize == Size.Small ? 0 : (bodySize == Size.Medium ? 0 : (
            bodySize == Size.Large ? 2 : (bodySize == Size.Huge ? 4 : (bodySize == Size.Gargantuan ? 6 : (bodySize == Size.Colossal ? 8 : 0)))))))));
        let cpBought = mainChar.cpStats.constitutionCount;

        return this.constitution + bodySizeModifier + this.constitutionModifier + cpBought;
    }
    getDiscipline() { return this.discipline + this.disciplineModifier + mainChar.cpStats.disciplineCount; }
    getIntelligence() { return this.intelligence + this.intelligenceModifier + mainChar.cpStats.intelligenceCount; }
    getConviction() { return this.conviction + this.convictionModifier + mainChar.cpStats.convictionCount; }
    getAttunement() { return this.attunement + this.attunementModifier + mainChar.cpStats.attunementCount; }

    reduceStrength(x, src) { this.strengthModifier -= x; if (src == "Gear") { this.strengthGearModifier -= x; } }
    addStrength(x, src) { this.strengthModifier += x; if (src == "Gear") { this.strengthGearModifier += x; } }
    reduceAgility(x, src) { this.agilityModifier -= x; if (src == "Gear") { this.agilityGearModifier -= x; } }
    addAgility(x, src) { this.agilityModifier += x; if (src == "Gear") { this.agilityGearModifier += x; } }
    reduceConstitution(x, src) { this.constitutionModifier -= x; if (src == "Gear") { this.constitutionGearModifier -= x; } }
    addConstitution(x, src) { this.constitutionModifier += x; if (src == "Gear") { this.constitutionGearModifier += x; } }
    reduceDiscipline(x, src) { this.disciplineModifier -= x; if (src == "Gear") { this.disciplineGearModifier -= x; } }
    addDiscipline(x, src) { this.disciplineModifier += x; if (src == "Gear") { this.disciplineGearModifier += x; } }
    reduceIntelligence(x, src) { this.intelligenceModifier -= x; if (src == "Gear") { this.intelligenceGearModifier -= x; } }
    addIntelligence(x, src) { this.intelligenceModifier += x; if (src == "Gear") { this.intelligenceGearModifier += x; } }
    reduceConviction(x, src) { this.convictionModifier -= x; if (src == "Gear") { this.convictionGearModifier -= x; } }
    addConviction(x, src) { this.convictionModifier += x; if (src == "Gear") { this.convictionGearModifier += x; } }
    reduceAttunement(x, src) { this.attunementModifier -= x; if (src == "Gear") { this.attunementGearModifier -= x; } }
    addAttunement(x, src) { this.attunementModifier += x; if (src == "Gear") { this.attunementGearModifier += x; } }

    // Skills
    getHide() { return this.skills.Hide.getPoints(); }
    getMoveSilently() { return this.skills.MoveSilently.getPoints(); }
    getDisguise() { return this.skills.Disguise.getPoints(); }
    getMedicine() { return this.skills.Medicine.getPoints(); }
    getSurvival() { return this.skills.Survival.getPoints(); }
    getTrack() { return this.skills.Track.getPoints(); }
    getFlight() { return this.skills.Flight.getPoints(); }
    getInsight() { return this.skills.Insight.getPoints(); }
    getBluff() { return this.skills.Bluff.getPoints(); }
    getDiplomacy() { return this.skills.Diplomacy.getPoints(); }
    getIntimidate() { return this.skills.Intimidate.getPoints(); }
    getPickLock() { return this.skills.PickLock.getPoints(); }
    getPickPocket() { return this.skills.PickPocket.getPoints(); }

    // Perform Skills
    getActing() { return this.performSkills.Acting.getPoints(); }
    getEscapeArtist() { return this.performSkills.EscapeArtist.getPoints(); }
    getSleightOfHand() { return this.performSkills.SleightOfHand.getPoints(); }

    // Crafting Skills
    getAlchemy() { return this.craftingSkills.Alchemy.getPoints(); }
    getBrews() { return this.craftingSkills.Brews.getPoints(); }
    getOilsAndBalms() { return this.craftingSkills.OilsAndBalms.getPoints(); }
    getToxins() { return this.craftingSkills.Toxinx.getPoints(); }
    getHomunculi() { return this.craftingSkills.Homunculi.getPoints(); }
    getExplosives() { return this.craftingSkills.Explosives.getPoints(); }
    getTransmogrify() { return this.craftingSkills.Transmogrify.getPoints(); }
    getBlacksmith() { return this.craftingSkills.Blacksmith.getPoints(); }
    getArmorsmith() { return this.craftingSkills.Armorsmith.getPoints(); }
    getWeaponsmith() { return this.craftingSkills.Weaponsmith.getPoints(); }
    getCarpentry() { return this.craftingSkills.Carpentry.getPoints(); }
    getFletchery() { return this.craftingSkills.Fletchery.getPoints(); }
    getLeatherwork() { return this.craftingSkills.Leatherwork.getPoints(); }
    getTailor() { return this.craftingSkills.Tailor.getPoints(); }
    getTrapmaking() { return this.craftingSkills.Trapmaking.getPoints(); }
    getEngineering() { return this.craftingSkills.Engineering.getPoints(); }

    getAP() { return this.ap + this.apModifier; }
    setAP(x) { this.ap = x; }
    reduceAP(x) { this.apModifier -= x; }
    addAP(x) { this.apModifier += x; }
    getInitiative() { return (VSEnvironments.Spot.getPoints() + VSEnvironments.Listen.getPoints() + VSEnvironments.Scent.getPoints()) / 2 + VSDefs.Reflex.getPoints() / 2 + VSEnvironments.Surprise.getPoints(); }
    setEncumbrance(val) {
        this.encumbranceLevel = val;
    }
    getEncumbrance() {
        let totalWeight = mainChar.gear.getTotalWeight();
        let thresholds = Table_GetCarryCapacity(this.carryCapacity);
        let maxLight = thresholds[0];
        let maxMedium = thresholds[1];
        let maxHeavy = thresholds[2];

        if (totalWeight <= maxLight) return Encumbrance.Light;
        else if (totalWeight <= maxMedium) return Encumbrance.Medium;
        else if (totalWeight <= maxHeavy) return Encumbrance.Heavy;
        else if (totalWeight <= maxHeavy * 1.5) return Encumbrance.Encumbered;
        else return Encumbrance.OverEncumbered;
    }
    getEncumbranceTooltip() {
        let encumb = this.getEncumbranceText();
        let str = "Current Encumbrance Level: " + encumb + "<br><br>" +
            "Penalties: ";
        if (encumb == "Light") str += "None";
        else if (encumb == "Medium") str += "-20% All Movements, -2 Affected Stats";
        else if (encumb == "Heavy") str += "-40% All Movements, -4 Affected Stats";
        else if (encumb == "Encumbered") str += "-60% All Movements, -8 Affected Stats";
        else if (encumb == "Over Encumbered") str += "-100% All Movements, -12 Affected Stats";

        return str;
    }
    getEncumbranceText() {
        let val = this.getEncumbrance();
        if (val == 0) return "Light";
        else if (val == 1) return "Medium";
        else if (val == 2) return "Heavy";
        else if (val == 3) return "Encumbered";
        else if (val == 4) return "Over Encumbered";
    }
    getCP() {
        let bodyType = this.getBodyType();
        let bodyTypeModifier = (bodyType == BodyType.Triped ? 18 : (bodyType == BodyType.Quadruped ? 32 : (bodyType == BodyType.FiveLegs ? 38 :
            (bodyType == BodyType.Slithers ? 38 : (bodyType == BodyType.Rolls ? 31 : 0)))));
        let bodySize = this.getSize();
        let bodySizeModifier = (bodySize == Size.Fine ? 8 : (bodySize == Size.Diminutive ? 8 : (bodySize == Size.Tiny ? 7 : (bodySize == Size.Small ? 13 : (bodySize == Size.Medium ? 0 : (
            bodySize == Size.Large ? 90 : (bodySize == Size.Huge ? 181 : (bodySize == Size.Gargantuan ? 235 : (bodySize == Size.Colossal ? 323 : 0)))))))));
        let perimeterModifier = this.getPerimeter();

        return this.cp +
            this.cpModifier -
            bodySizeModifier -
            bodyTypeModifier +
            perimeterModifier;
    }
    reduceCP(x) { this.cpModifier -= x; }
    addCP(x) { this.cpModifier += x; }
    getMaxCP() { return 75 + this.getLevel() * 75; }
    getSize() { return this.size; }
    getSizeName() {
        let size = this.size;
        if (size == 0) return "Fine";
        else if (size == 1) return "Diminutive";
        else if (size == 2) return "Tiny";
        else if (size == 3) return "Small";
        else if (size == 4) return "Medium";
        else if (size == 5) return "Large";
        else if (size == 6) return "Huge";
        else if (size == 7) return "Gargantuan";
        else if (size == 8) return "Colossal";
    }
    setSize(newStat) {
        this.size = newStat;
        addTrainingPoints("Body Size", 0, this.getBodySizeCPCost(), false);
    }
    getBodyType() { return this.bodyType; }
    getBodyTypeName() {
        let curBodyType = this.bodyType;
        if (curBodyType == 0) return "Biped";
        else if (curBodyType == 1) return "Triped";
        else if (curBodyType == 2) return "Quadruped";
        else if (curBodyType == 3) return "5+ Legs";
        else if (curBodyType == 4) return "Slithers";
        else if (curBodyType == 5) return "Rolls";
    }
    setBodyType(newStat) {
         this.bodyType = newStat; 
         addTrainingPoints("Body Type", 0, this.getBodyTypeCPCost(), false);
    }

    getLevel() { return this.level; }
    setLevel(newStat) {
        this.level = newStat;
        this.xp = Table_GetXP(this.level);
        this.cp = this.getMaxCP();
    }
    getXP() { return this.xp; }
    setXP(x) {
        this.xp = x;
        this.level = Table_GetLevel(this.xp);
        this.cp = this.getMaxCP();
    }
    setHP(newStat) { this.hp = clampStat(newStat, this.getMaxHP()); if (this.hp < 0) { alert("You Died!"); this.hp = 0; } }
    setMana(newStat) { this.mana = clampStat(newStat, this.getMana()); if (this.mana < 0) { this.mana = 0; } }
    setStamina(newStat) { this.stamina = clampStat(newStat, this.getStamina()); if (this.stamina < 0) { this.stamina = 0; } }

    reduceMaxHP(x, src = null) { this.maxHPModifier -= x; if (src == "Gear") { this.maxHPGearModifier -= x; } }
    addMaxHP(x, src = null) { this.maxHPModifier += x; if (src == "Gear") { this.maxHPGearModifier += x; } }
    reduceMaxStamina(x, src = null) { this.maxStaminaModifier -= x; if (src == "Gear") { this.maxStaminaGearModifier -= x; } }
    addMaxStamina(x, src = null) { this.maxStaminaModifier += x; if (src == "Gear") { this.maxStaminaGearModifier += x; } }
    reduceMaxMana(x, src = null) { this.maxManaModifier -= x; if (src == "Gear") { this.maxManaGearModifier -= x; } }
    addMaxMana(x, src = null) { this.maxManaModifier += x; if (src == "Gear") { this.maxManaGearModifier += x; } }

    reduceHP(x) { this.hpModifier -= x; }
    addHP(x) { this.hpModifier += x; }
    reduceMana(x) { this.manaModifier -= x; }
    addMana(x) { this.manaModifier += x; }
    reduceStamina(x) { this.staminaModifier -= x; }
    addStamina(x) { this.staminaModifier += x; }
    getHP() { return this.hp + this.hpModifier; }
    getMana() { return this.mana + this.manaModifier; }
    getStamina() { return this.stamina + this.staminaModifier; }
    regainStamina(x = 1) { if (this.getStamina() < this.getMaxStamina()) this.stamina += x; }

    getMaxHPBase() {
        return 20 + (this.getConstitution() * 3);
    }
    getMaxStaminaBase() {
        return 5 + ((this.getConstitution() + (this.getStrength() + this.getAgility() + this.getDiscipline()) / 2)) / 4;
    }
    getMaxManaBase() {
        return 5 + (this.getIntelligence() + this.getConviction() + this.getAttunement()) * 2 + this.getDiscipline();
    }
    getMaxHP() {
        let amountOfMaxHPsBought = mainChar.cpStats.maxHPCount;
        let base = this.getMaxHPBase();
        return base + amountOfMaxHPsBought + this.maxHPModifier;
    }
    getMaxMana() {
        let amountOfMaxManasBought = mainChar.cpStats.maxManaCount;
        let armorModifier = mainChar.gear.getArmorMaxManaPenalty();

        let base = this.getMaxManaBase();
        return (base - (base * (armorModifier / 100))) + amountOfMaxManasBought + this.maxManaModifier;
    }
    getMaxStamina() {
        let amountOfMaxStaminasBought = mainChar.cpStats.maxStaminaCount;
        let base = this.getMaxStaminaBase();
        return base + amountOfMaxStaminasBought + this.maxStaminaModifier;
    }

    // Main Stats
    reduceAccuracy(x, src = null) { this.accuracyModifier -= x; if (src == "Gear") { this.accuracyGearModifier -= x; } }
    addAccuracy(x, src = null) { this.accuracyModifier += x; if (src == "Gear") { this.accuracyGearModifier += x; } }
    reduceDodge(x) { this.dodgeModifier -= x; }
    addDodge(x) { this.dodgeModifier += x; }
    reduceDamage(x, src = null) { this.damageModifier -= x; if (src == "Gear") { this.damageGearModifier -= x; } }
    addDamage(x, src = null) { this.damageModifier += x; if (src == "Gear") { this.damageGearModifier += x; } }
    reduceParry(x, src = null) { this.parryModifier -= x; if (src == "Gear") { this.parryGearModifier -= x; } }
    addParry(x, src = null) { this.parryModifier += x; if (src == "Gear") { this.parryGearModifier += x; } }

    getAccuracyBase() {
        return (this.getAgility() + this.getDiscipline()) / 3;
    }
    getParryBase() {
        return 0;
    }
    getDamageBase() {
        return this.getStrength() / 7;
    }
    getAccuracy() {
        let theAmountOfAccuracyBought = mainChar.cpStats.accuracyCount;
        this.accuracy = this.getAccuracyBase();
        return this.accuracy + theAmountOfAccuracyBought + this.accuracyModifier - (this.encumbranceLevel == 0 ? 0 : (this.encumbranceLevel == 1 ? 2 : (this.encumbranceLevel == 2 ? 4 : (this.encumbranceLevel == 3 ? 8 : (this.encumbranceLevel == 4 ? 12 : 0)))));
    }
    getParry() {
        let theAmountOfParrysBought = mainChar.cpStats.parryCount;
        return this.parry + this.parryModifier + theAmountOfParrysBought;
    }
    getDamage() {
        let theAmountOfDamageBought = mainChar.cpStats.damageCount;
        this.damage = this.getDamageBase();
        return this.damage + this.damageModifier + theAmountOfDamageBought;
    }
    getDodge() {
        return this.dodge + this.dodgeModifier;
    }

    getCarryCapacityBase() {
        let bodyType = this.getBodyType();
        let bodyTypeModifier = (bodyType == BodyType.Triped ? 2 : (bodyType == BodyType.Quadruped ? 4 : (bodyType == BodyType.FiveLegs ? 4 : (bodyType == BodyType.Slithers ? 4 : (bodyType == BodyType.Rolls ? 2 : 0)))));

        return this.getStrength() + bodyTypeModifier + (this.carryCapacityModifier - this.carryCapacityGearModifier);
    }
    getCarryCapacity() {
        let cpCount = mainChar.cpStats.carryCapacityCount;

        return this.getCarryCapacityBase() + cpCount + this.getCarryCapacityGearModifier();
    }
    getOTAsBase() {
        return this.OTAs + (this.OTAsModifier - this.OTAsGearModifier);
    }
    getOTAs() {
        let cpCount = mainChar.cpStats.OTAsCount;
        return this.getOTAsBase() + cpCount + this.getOTAsGearModifier();
    }
    setOTAs(newStat) { let oldValue = this.OTAs; let diff = newStat - oldValue; this.OTAs = newStat; this.reduceCP(diff * mainChar.cpStats.OTAs); }
    getQuickStepBase() {
        let bodySize = this.getSize();
        let bodySizeModifier = (bodySize == Size.Fine ? -5 : (bodySize == Size.Diminutive ? -2.5 : (bodySize == Size.Tiny ? 0 : (bodySize == Size.Small ? 0 : (bodySize == Size.Medium ? 0 : (
            bodySize == Size.Large ? 5 : (bodySize == Size.Huge ? 10 : (bodySize == Size.Gargantuan ? 15 : (bodySize == Size.Colossal ? 20 : 0)))
        ))))));

        return this.quickStep + bodySizeModifier + (this.quickStepModifier - this.quickStepGearModifier);
    }
    getQuickStep() {
        let cpCount = mainChar.cpStats.quickStepCount;

        return this.getQuickStepBase() + cpCount + this.getQuickStepGearModifier();
    }
    setQuickStep(newStat) {
        this.addCP(mainChar.cpStats.quickStep(this.quickStep));
        this.quickStep = newStat;
        this.reduceCP(mainChar.cpStats.quickStep(newStat));
    }
    getDive() {
        this.dive = 10 + this.movements.jump.getSpeed() / 2;

        let bodySize = this.getSize();
        let bodySizeModifier = (bodySize == Size.Fine ? -5 : (bodySize == Size.Diminutive ? -2.5 : (bodySize == Size.Tiny ? 0 : (bodySize == Size.Small ? 0 : (bodySize == Size.Medium ? 0 : (
            bodySize == Size.Large ? 5 : (bodySize == Size.Huge ? 10 : (bodySize == Size.Gargantuan ? 15 : (bodySize == Size.Colossal ? 20 : 0)))
        ))))));
        return this.dive + bodySizeModifier;
    }
    setDive(newStat) { this.dive = newStat; }

    getSpaceLength() { return this.spaceLength; }
    getSpaceWidth() { return this.spaceWidth; }
    getPerimeter() {
        return ((this.getSpaceWidth() * 2 + this.getSpaceLength() * 2) / 5) - 4;
    }
    setSpaceLength(newStat) {
        this.spaceLength = newStat;
        addTrainingPoints("Perimeter", 0, -this.getPerimeter(), false);
    }
    setSpaceWidth(newStat) {
        this.spaceWidth = newStat;
        addTrainingPoints("Perimeter", 0, -this.getPerimeter(), false);
    }

    turnEnded() {
        this.ap = 6;
        this.regainStamina();
        this.movements.ground.turnEnded();
        this.movements.climb.turnEnded();
        this.movements.jump.turnEnded();
        this.movements.swim.turnEnded();
        this.movements.burrow.turnEnded();
        this.movements.flight.turnEnded();
    }
}

class CPStats {
    constructor(stats) {
        this.stats = stats;

        this.carryCapacity = 1.5;
        this.carryCapacityCount = 0;
        this.carryCapacityCap = 0;

        this.OTAs = 10;
        this.OTAsCount = 0;
        this.OTAsCap = 10;

        this.quickStep = 8 / 5;//(amount) => { return (amount - 5) / 5 * 8; };
        this.quickStepCount = 0;
        this.quickStepCap = 15;

        // Main Stats
        this.strength = 10;
        this.strengthCount = 0;
        this.strengthCap = 500;

        this.agility = 10;
        this.agilityCount = 0;
        this.agilityCap = 500;

        this.discipline = 10;
        this.disciplineCount = 0;
        this.disciplineCap = 500;

        this.intelligence = 10;
        this.intelligenceCount = 0;
        this.intelligenceCap = 500;

        this.conviction = 10;
        this.convictionCount = 0;
        this.convictionCap = 500;

        this.attunement = 10;
        this.attunementCount = 0;
        this.attunementCap = 500;

        this.constitution = 10;
        this.constitutionCount = 0;
        this.constitutionCap = 500;

        this.maxHP = 1;
        this.maxHPCount = 0;
        this.maxHPCap = 20 + this.stats.level * 5;
        this.maxHPCapUpgrade = 0;

        this.maxMana = 0.75;
        this.maxManaCount = 0;
        this.maxManaCap = 25 + this.stats.level * 6;
        this.maxManaCapUpgrade = 0;

        this.maxStamina = 5;
        this.maxStaminaCount = 0;
        this.maxStaminaCap = 5 + this.stats.level;
        this.maxStaminaCapUpgrade = 0;

        this.accuracy = 4;
        this.accuracyCount = 0;
        this.accuracyCap = 0;
        this.accuracyCapUpgrade = 0;

        this.parry = 4.5;
        this.parryCount = 0;
        this.parryCap = 0;
        this.parryCapUpgrade = 0;

        this.damage = 12;
        this.damageCount = 0;
        this.damageCap = this.stats.level / 5;
        this.damageCapUpgrade = 0;
    }
    getCarryCapacityCap() {
        let _cap = 4 + (mainChar.stats.getLevel() / 2) + (mainChar.stats.getDiscipline() + mainChar.stats.getConstitution()) / 2;
        if (_cap > this.getMaxModifier()) _cap = this.getMaxModifier();
        return _cap;
    }
    getQckStpCap() {
        let _cap = 15;
        if (_cap > this.getMaxModifier()) _cap = this.getMaxModifier();
        return _cap;
    }
    getOTAsCap() {
        let _cap = 4;
        if (_cap > this.getMaxModifier()) _cap = this.getMaxModifier();
        return _cap;
    }
    getCarryCapacityCount() { return this.carryCapacityCount; }
    getQckStpCount() { return this.quickStepCount; }
    getOTAsCount() { return this.OTAsCount; }

    setOTAsBought(x) {
        if (x > this.getOTAsCap()) x = this.getOTAsCap();
        if (x < -this.getOTAsCap()) x = -this.getOTAsCap();
        if (x > this.getMaxModifier()) x = this.getMaxModifier();
        if (x < -this.getMaxModifier()) x = -this.getMaxModifier();
        x = Math.round(x);

        // Training
        let cpCost = this.OTAs; //1
        let oldVal = this.OTAsCount; // 2

        this.stats.addCP(this.OTAsCount * this.OTAs);
        this.OTAsCount = x;
        this.stats.reduceCP(this.OTAsCount * this.OTAs);

        // Training-AfterNewValue
        let newVal = this.OTAsCount; // 3
        let diff = newVal - oldVal;
        addTrainingPoints("OTAs", diff, cpCost, true); // 4
    }
    setCarryCapacityBought(x) {
        if (x > this.getCarryCapacityCap()) x = this.getCarryCapacityCap();
        if (x < -this.getCarryCapacityCap()) x = -this.getCarryCapacityCap();
        if (x > this.getMaxModifier()) x = this.getMaxModifier();
        if (x < -this.getMaxModifier()) x = -this.getMaxModifier();
        x = Math.round(x);

        // Training
        let cpCost = this.carryCapacity; //1
        let oldVal = this.carryCapacityCount; // 2

        this.stats.addCP(this.carryCapacityCount * this.carryCapacity);
        this.carryCapacityCount = x;
        this.stats.reduceCP(this.carryCapacityCount * this.carryCapacity);

        // Training-AfterNewValue
        let newVal = this.carryCapacityCount; // 3
        let diff = newVal - oldVal;
        addTrainingPoints("Carry Capacity", diff, cpCost, true); // 4
    }
    setQckStpBought(x) {
        if (x > this.getQckStpCap()) x = this.getQckStpCap();
        if (x < -this.getQckStpCap()) x = -this.getQckStpCap();
        if (x > this.getMaxModifier()) x = this.getMaxModifier();
        if (x < -this.getMaxModifier()) x = -this.getMaxModifier();
        x = Math.round(x);

        // Training
        let cpCost = this.quickStep; //1
        let oldVal = this.quickStepCount; // 2

        this.stats.addCP(this.quickStepCount * this.quickStep);
        this.quickStepCount = x;
        this.stats.reduceCP(this.quickStepCount * this.quickStep);

        // Training-AfterNewValue
        let newVal = this.quickStepCount; // 3
        let diff = newVal - oldVal;
        addTrainingPoints("Quick Steps", diff, cpCost, true); // 4
    }

    getStrength() { return this.strengthCount; }
    getAgility() { return this.agilityCount; }
    getIntelligence() { return this.intelligenceCount; }
    getAttunement() { return this.attunementCount; }
    getConviction() { return this.convictionCount; }
    getConstitution() { return this.constitutionCount; }
    getDiscipline() { return this.disciplineCount; }

    getMaxHP() { return this.maxHPCount; }
    getMaxMana() { return this.maxManaCount; }
    getMaxStamina() { return this.maxStaminaCount; }
    getAccuracy() { return this.accuracyCount; }
    getParry() { return this.parryCount; }
    getDamage() { return this.damageCount; }


    reduceAccuracyCap(x) { this.accuracyCapUpgrade -= x; }
    addAccuracyCap(x) { this.accuracyCapUpgrade += x; }
    reduceDamageCap(x) { this.damageCapUpgrade -= x; }
    addDamageCap(x) { this.damageCapUpgrade += x; }
    reduceParryCap(x) { this.parryCapUpgrade -= x; }
    addParryCap(x) { this.parryCapUpgrade += x; }

    addCapModifierHP(x) { this.maxHPCapUpgrade += x; }
    reduceCapModifierHP(x) { this.maxHPCapUpgrade -= x; }
    getMaxHPCap() {
        this.maxHPCap = 20 + this.stats.level * 5 + this.maxHPCapUpgrade;
        if (this.maxHPCap > this.getMaxModifier())
            this.maxHPCap = this.getMaxModifier();
        return this.maxHPCap;
    }
    getMaxManaCap() {
        this.maxManaCap = 25 + this.stats.level * 6 + this.maxManaCapUpgrade;
        if (this.maxManaCap > this.getMaxModifier())
            this.maxManaCap = this.getMaxModifier();
        return this.maxManaCap;
    }
    getMaxStaminaCap() {
        this.maxStaminaCap = 5 + this.stats.level + this.maxStaminaCapUpgrade;
        if (this.maxStaminaCap > this.getMaxModifier())
            this.maxStaminaCap = this.getMaxModifier();
        return this.maxStaminaCap;
    }
    getAccuracyCap() {
        this.accuracyCap = 2 + this.stats.level / 2 + (this.stats.getStrength() + this.stats.getIntelligence() + this.stats.getConviction() + this.stats.getAttunement()) / 3 + this.accuracyCapUpgrade;
        if (this.accuracyCap > this.getMaxModifier())
            this.accuracyCap = this.getMaxModifier();
        return this.accuracyCap;
    }
    getParryCap() {
        this.parryCap = 2 + this.stats.level / 2 + (this.stats.getStrength() + this.stats.getIntelligence() + this.stats.getConviction() + this.stats.getAttunement()) / 3 + this.parryCapUpgrade;
        if (this.parryCap > this.getMaxModifier())
            this.parryCap = this.getMaxModifier();
        return this.parryCap;
    }
    getDamageCap() {
        this.damageCap = this.stats.level / 5 + this.damageCapUpgrade;
        if (this.damageCap > this.getMaxModifier())
            this.damageCap = this.getMaxModifier();
        return this.damageCap;
    }
    setMaxHPBought(x) {
        if (x > this.getMaxModifier()) x = this.getMaxModifier();
        if (x < -this.getMaxModifier()) x = -this.getMaxModifier();
        if (x > this.getMaxHPCap()) x = this.getMaxHPCap();
        if (x < -this.getMaxHPCap()) x = -this.getMaxHPCap();
        x = Math.round(x);

        this.stats.addCP(this.maxHPCount * this.maxHP);
        this.maxHPCount = x;
        this.stats.reduceCP(this.maxHPCount * this.maxHP);
    }
    setMaxManaBought(x) {
        if (x > this.getMaxModifier()) x = this.getMaxModifier();
        if (x < -this.getMaxModifier()) x = -this.getMaxModifier();
        if (x > this.getMaxManaCap()) x = this.getMaxManaCap();
        if (x < -this.getMaxManaCap()) x = -this.getMaxManaCap();
        x = Math.round(x);

        this.stats.addCP(this.maxManaCount * this.maxMana);
        this.maxManaCount = x;
        this.stats.reduceCP(this.maxManaCount * this.maxMana);
    }
    setMaxStaminaBought(x) {
        if (x > this.getMaxModifier()) x = this.getMaxModifier();
        if (x < -this.getMaxModifier()) x = -this.getMaxModifier();
        if (x > this.getMaxStaminaCap()) x = this.getMaxStaminaCap();
        if (x < -this.getMaxStaminaCap()) x = -this.getMaxStaminaCap();
        x = Math.round(x);

        this.stats.addCP(this.maxStaminaCount * this.maxStamina);
        this.maxStaminaCount = x;
        this.stats.reduceCP(this.maxStaminaCount * this.maxStamina);
    }
    setAccuracyBought(x) {
        if (x > this.getMaxModifier()) x = this.getMaxModifier();
        if (x < -this.getMaxModifier()) x = -this.getMaxModifier();
        if (x > this.getAccuracyCap()) x = this.getAccuracyCap();
        if (x < -this.getAccuracyCap()) x = -this.getAccuracyCap();
        x = Math.round(x);

        this.stats.addCP(this.accuracyCount * this.accuracy);
        this.accuracyCount = x;
        this.stats.reduceCP(this.accuracyCount * this.accuracy);
    }
    setParryBought(x) {
        if (x > this.getMaxModifier()) x = this.getMaxModifier();
        if (x < -this.getMaxModifier()) x = -this.getMaxModifier();
        if (x > this.getParryCap()) x = this.getParryCap();
        if (x < -this.getParryCap()) x = -this.getParryCap();
        x = Math.round(x);

        this.stats.addCP(this.parryCount * this.parry);
        this.parryCount = x;
        this.stats.reduceCP(this.parryCount * this.parry);
    }
    setDamageBought(x) {
        if (x > this.getMaxModifier()) x = this.getMaxModifier();
        if (x < -this.getMaxModifier()) x = -this.getMaxModifier();
        if (x > this.getDamageCap()) x = this.getDamageCap();
        if (x < -this.getDamageCap()) x = -this.getDamageCap();
        x = Math.round(x);

        this.stats.addCP(this.damageCount * this.damage);
        this.damageCount = x;
        this.stats.reduceCP(this.damageCount * this.damage);
    }

    setStrBought(x) {
        if (x > this.getMaxModifier()) x = this.getMaxModifier();
        if (x < -this.getMaxModifier()) x = -this.getMaxModifier();
        x = Math.round(x);

        this.stats.addCP(this.strengthCount * this.strength);
        this.strengthCount = x;
        this.stats.reduceCP(this.strengthCount * this.strength);
    }
    setAgiBought(x) {
        if (x > this.getMaxModifier()) x = this.getMaxModifier();
        if (x < -this.getMaxModifier()) x = -this.getMaxModifier();
        x = Math.round(x);

        this.stats.addCP(this.agilityCount * this.agility);
        this.agilityCount = x;
        this.stats.reduceCP(this.agilityCount * this.agility);
    }
    setIntBought(x) {
        if (x > this.getMaxModifier()) x = this.getMaxModifier();
        if (x < -this.getMaxModifier()) x = -this.getMaxModifier();
        x = Math.round(x);

        this.stats.addCP(this.intelligenceCount * this.intelligence);
        this.intelligenceCount = x;
        this.stats.reduceCP(this.intelligenceCount * this.intelligence);
    }
    setDiscBought(x) {
        if (x > this.getMaxModifier()) x = this.getMaxModifier();
        if (x < -this.getMaxModifier()) x = -this.getMaxModifier();
        x = Math.round(x);

        this.stats.addCP(this.disciplineCount * this.discipline);
        this.disciplineCount = x;
        this.stats.reduceCP(this.disciplineCount * this.discipline);
    }
    setConBought(x) {
        if (x > this.getMaxModifier()) x = this.getMaxModifier();
        if (x < -this.getMaxModifier()) x = -this.getMaxModifier();
        x = Math.round(x);

        this.stats.addCP(this.constitutionCount * this.constitution);
        this.constitutionCount = x;
        this.stats.reduceCP(this.constitutionCount * this.constitution);
    }
    setConvBought(x) {
        if (x > this.getMaxModifier()) x = this.getMaxModifier();
        if (x < -this.getMaxModifier()) x = -this.getMaxModifier();
        x = Math.round(x);

        this.stats.addCP(this.convictionCount * this.conviction);
        this.convictionCount = x;
        this.stats.reduceCP(this.convictionCount * this.conviction);
    }
    setAttBought(x) {
        if (x > this.getMaxModifier()) x = this.getMaxModifier();
        if (x < -this.getMaxModifier()) x = -this.getMaxModifier();
        x = Math.round(x);

        this.stats.addCP(this.attunementCount * this.attunement);
        this.attunementCount = x;
        this.stats.reduceCP(this.attunementCount * this.attunement);
    }

    getMaxModifier() { return this.stats.getLevel() + 8; }
}

function clampStat(newStat, maxStat) {
    return (newStat > maxStat ? maxStat : newStat);
}