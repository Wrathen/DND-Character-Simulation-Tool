var AddedDefensesArray = [];
var DamageTypesArray = [];
var VSEnvironmentArray = [];
var VSDefsArray = [];

class addedDefense {
    constructor(points, cpCost, cap, magicNumber, name = "", yCalculatorFunc = null) {
        this.points = points;
        this.pointsModifier = 0;
        this.gearPointsModifier = 0;
        this.cpCost = cpCost;
        this.cpCostModifier = 0;
        this.cap = cap;
        this.capModifier = 0;
        this.cpCount = 0;
        this.magicNumber = magicNumber;
        this.name = name;
        this.yCalculatorFunc = yCalculatorFunc;

        this.checkBoxIsOn = false;

        AddedDefensesArray.push(this);
    }

    getCPCount() { return this.cpCount; }
    setCPCount(x) {
        if (x > this.getCap()) x = this.getCap();
        if (x < -this.getCap()) x = -this.getCap();
        if (x > mainChar.cpStats.getMaxModifier()) x = mainChar.cpStats.getMaxModifier();
        if (x < -mainChar.cpStats.getMaxModifier()) x = -mainChar.cpStats.getMaxModifier();
        x = Math.round(x);

        // Training
        let cpCost = this.cpCost; //1
        let oldVal = this.getCPCount(); // 2

        mainChar.stats.addCP(this.getCPCount() * this.getCPCost());
        this.cpCount = x;
        mainChar.stats.reduceCP(this.getCPCount() * this.getCPCost());

        // Training-AfterNewValue
        let newVal = this.getCPCount(); // 3
        let diff = newVal - oldVal;
        addTrainingPoints(this.name, diff, cpCost, true); // 4
    }

    getPointsTotalForStatsPage() { return this.points + this.getCPCount() + this.getGearModifier(); }
    getGearModifier() { return this.gearPointsModifier; }
    getPointsBase() { return this.points; }
    getPoints() { return this.points + this.pointsModifier + this.getCPCount(); }
    getCPCost() { return this.cpCost + this.cpCostModifier; }
    getCap() {
        let _cap = (this.yCalculatorFunc ? (this.yCalculatorFunc(mainChar.stats.getLevel())) : this.cap) + this.capModifier;
        if (_cap > mainChar.cpStats.getMaxModifier()) _cap = mainChar.cpStats.getMaxModifier();
        return _cap;
    }
    getMagicNumber() { return this.magicNumber; }
    getName() { return this.name; }

    setPoints(newStat) { this.points = newStat; }
    setCPCost(newStat) { this.cpCost = newStat; }
    setCap(newStat) { this.cap = newStat; }
    setMagicNumber(newStat) { this.magicNumber = newStat; }
    setName(newStat) { this.name = newStat; }

    reducePointsModifier(x, src = null) { this.pointsModifier -= x; if (src == "Gear") { this.gearPointsModifier -= x; } }
    addPointsModifier(x, src = null) { this.pointsModifier += x; if (src == "Gear") { this.gearPointsModifier += x; } }

    reduceCpCostModifier(x) { this.cpCostModifier -= x; }
    addCpCostModifier(x) { this.cpCostModifier += x; }

    reduceCapModifier(x) { this.capModifier -= x; }
    addCapModifier(x) { this.capModifier += x; }
}
class damageType {
    constructor(points, cpCost, cap, magicNumber, name = "") {
        this.points = points;
        this.pointsModifier = 0;
        this.gearPointsModifier = 0;
        this.cpCost = cpCost;
        this.cpCostModifier = 0;
        this.cap = cap;
        this.capModifier = 0;
        this.cpCount = 0;
        this.magicNumber = magicNumber;
        this.name = name;

        this.checkBoxIsOn = false;
        DamageTypesArray.push(this);
    }

    getPointsTotalForStatsPage() { return this.points + this.getCPCount() + this.getGearModifier(); }
    getCPCount() { return this.cpCount; }
    setCPCount(x) {
        if (x > this.getCap()) x = this.getCap();
        if (x < -this.getCap()) x = -this.getCap();
        if (x > mainChar.cpStats.getMaxModifier()) x = mainChar.cpStats.getMaxModifier();
        if (x < -mainChar.cpStats.getMaxModifier()) x = -mainChar.cpStats.getMaxModifier();
        x = Math.round(x);

        // Training
        let cpCost = this.cpCost; //1
        let oldVal = this.getCPCount(); // 2

        mainChar.stats.addCP(this.getCPCount() * this.getCPCost());
        this.cpCount = x;
        mainChar.stats.reduceCP(this.getCPCount() * this.getCPCost());

        // Training-AfterNewValue
        let newVal = this.getCPCount(); // 3
        let diff = newVal - oldVal;
        addTrainingPoints(this.name, diff, cpCost, true); // 4
    }

    getGearModifier() { return this.gearPointsModifier; }
    getName() { return this.name; }
    getPointsBase() { return this.points; } // We can this way Include Points base + conditionsmodifier
    getPoints() { return this.points + this.pointsModifier + this.getCPCount(); }
    getCPCost() { return this.cpCost + this.cpCostModifier; }
    getCap() {
        let _cap = this.cap() + this.capModifier;
        if (_cap > mainChar.cpStats.getMaxModifier()) _cap = mainChar.cpStats.getMaxModifier();
        return _cap;
    }
    getMagicNumber() { return this.magicNumber; }

    setPoints(newStat) { this.points = newStat; }
    setCPCost(newStat) { this.cpCost = newStat; }
    setMagicNumber(newStat) { this.magicNumber = newStat; }

    reducePointsModifier(x, src = null) { this.pointsModifier -= x; if (src == "Gear") { this.gearPointsModifier -= x; } }
    addPointsModifier(x, src = null) { this.pointsModifier += x; if (src == "Gear") { this.gearPointsModifier += x; } }

    reduceCpCostModifier(x) { this.cpCostModifier -= x; }
    addCpCostModifier(x) { this.cpCostModifier += x; }

    reduceCapModifier(x) { this.capModifier -= x; }
    addCapModifier(x) { this.capModifier += x; }

    getPercentage() {
        if (this.name == "Physical") {
            return Table_GetDamageReduction(getWeirdNumber(this, mainChar.stats.getMaxHP()));
        }
        else if (this.name == "Blunt" || this.name == "Slashing" || this.name == "Piercing") {
            let PhysicalDRValue = getWeirdNumber(DamageTypes.Physical, mainChar.stats.getMaxHP());
            let thisDRValue = getWeirdNumber(this, mainChar.stats.getMaxHP());
            return Table_GetDamageReduction(PhysicalDRValue + thisDRValue);
        }

        // Other DamageTypes
        let DRVal = 0;
        let TotalPoints = this.getPoints();
        let ArmorModifier = mainChar.gear.equipments.armor.cpForDamageReductions;
        let ArmorReducedPoints = TotalPoints - ArmorModifier;
        DRVal = ((ArmorReducedPoints * this.getCPCost()) + ArmorModifier) * (this.getMagicNumber()/mainChar.stats.getMaxHP());
        return Table_GetDamageReduction(DRVal);
    }
}
class vsEnvironment {
    constructor(points, cpCost, cap, name) {
        this.points = points;
        this.pointsModifier = 0;
        this.gearPointsModifier = 0;
        this.cpCost = cpCost;
        this.cpCostModifier = 0;
        this.cap = cap;
        this.capModifier = 0;
        this.cpCount = 0;
        this.name = name;

        VSEnvironmentArray.push(this);
    }
    getPointsTotalForStatsPage() { return this.points() + this.getCPCount() + this.getGearModifier(); }
    getCPCount() { return this.cpCount; }
    setCPCount(x) {
        if (x > this.getCap()) x = this.getCap();
        if (x < -this.getCap()) x = -this.getCap();
        if (x > mainChar.cpStats.getMaxModifier()) x = mainChar.cpStats.getMaxModifier();
        if (x < -mainChar.cpStats.getMaxModifier()) x = -mainChar.cpStats.getMaxModifier();
        x = Math.round(x);

        // Training
        let cpCost = this.cpCost; //1
        let oldVal = this.getCPCount(); // 2

        mainChar.stats.addCP(this.getCPCount() * this.getCPCost());
        this.cpCount = x;
        mainChar.stats.reduceCP(this.getCPCount() * this.getCPCost());

        // Training-AfterNewValue
        let newVal = this.getCPCount(); // 3
        let diff = newVal - oldVal;
        addTrainingPoints(this.name, diff, cpCost, true); // 4
    }

    getGearModifier() { return this.gearPointsModifier; }
    getPointsBase() { return this.points(); } // We can this way Include Points base + conditionsmodifier
    getPoints() { return this.points() + this.pointsModifier + this.getCPCount(); }
    getCPCost() { return this.cpCost + this.cpCostModifier; }
    getCap() {
        let _cap = this.cap() + this.capModifier;
        if (_cap > mainChar.cpStats.getMaxModifier()) _cap = mainChar.cpStats.getMaxModifier();
        return _cap;
    }

    setCPCost(newStat) { this.cpCost = newStat; }

    reducePointsModifier(x, src = null) { this.pointsModifier -= x; if (src == "Gear") { this.gearPointsModifier -= x; } }
    addPointsModifier(x, src = null) { this.pointsModifier += x; if (src == "Gear") { this.gearPointsModifier += x; } }

    reduceCpCostModifier(x) { this.cpCostModifier -= x; }
    addCpCostModifier(x) { this.cpCostModifier += x; }

    reduceCapModifier(x) { this.capModifier -= x; }
    addCapModifier(x) { this.capModifier += x; }
}
class vsDefs {
    constructor(points, cpCost, cap, name) {
        this.points = points;
        this.pointsModifier = 0;
        this.gearPointsModifier = 0;
        this.cpCost = cpCost;
        this.cpCostModifier = 0;
        this.cap = cap;
        this.capModifier = 0;
        this.cpCount = 0;
        this.name = name;

        VSDefsArray.push(this);
    }

    getCPCount() { return this.cpCount; }
    setCPCount(x) {
        if (x > this.getCap()) x = this.getCap();
        if (x < -this.getCap()) x = -this.getCap();
        if (x > mainChar.cpStats.getMaxModifier()) x = mainChar.cpStats.getMaxModifier();
        if (x < -mainChar.cpStats.getMaxModifier()) x = -mainChar.cpStats.getMaxModifier();
        x = Math.round(x);

        // Training
        let cpCost = this.cpCost; //1
        let oldVal = this.getCPCount(); // 2

        mainChar.stats.addCP(this.getCPCount() * this.getCPCost());
        this.cpCount = x;
        mainChar.stats.reduceCP(this.getCPCount() * this.getCPCost());

        // Training-AfterNewValue
        let newVal = this.getCPCount(); // 3
        let diff = newVal - oldVal;
        addTrainingPoints(this.name, diff, cpCost, true); // 4
    }

    getPointsTotalForStatsPage() { return this.points() + this.getCPCount() + this.getGearModifier(); }
    getGearModifier() { return this.gearPointsModifier; }
    getPointsBase() { return this.points(); } // We can this way Include Points base + conditionsmodifier
    getPoints() {
        let allModifiers = 0;

        if (this.name == "Reflex") {
            let bodySize = mainChar.stats.getSize();
            let bodySizeModifier = (bodySize == Size.Fine ? 8 : (bodySize == Size.Diminutive ? 6 : (bodySize == Size.Tiny ? 4 : (bodySize == Size.Small ? 2 : (bodySize == Size.Medium ? 0 : (
                bodySize == Size.Large ? -2 : (bodySize == Size.Huge ? -4 : (bodySize == Size.Gargantuan ? -8 : (bodySize == Size.Colossal ? -16 : 0)))))))));
            let encumbranceLevel = mainChar.stats.getEncumbrance();
            let encumbranceModifier = (encumbranceLevel == 0 ? 0 : (encumbranceLevel == 1 ? 2 : (encumbranceLevel == 2 ? 4 : (encumbranceLevel == 3 ? 8 : (encumbranceLevel == 4 ? 12 : 0)))));
            let armorModifier = mainChar.gear.getArmorStatPenalty();

            allModifiers = bodySizeModifier - encumbranceModifier + armorModifier;
        }
        else if (this.name == "Balance") {
            let bodyType = mainChar.stats.getBodyType();
            let bodyTypeModifier = (bodyType == BodyType.Triped ? 2 : (bodyType == BodyType.Quadruped ? 4 : (bodyType == BodyType.FiveLegs ? 6 : (bodyType == BodyType.Slithers ? 6 : (bodyType == BodyType.Rolls ? 4 : 0)))));
            let encumbranceLevel = mainChar.stats.getEncumbrance();
            let encumbranceModifier = (encumbranceLevel == 0 ? 0 : (encumbranceLevel == 1 ? 2 : (encumbranceLevel == 2 ? 4 : (encumbranceLevel == 3 ? 8 : (encumbranceLevel == 4 ? 12 : 0)))));
            
            allModifiers = bodyTypeModifier - encumbranceModifier;
        }
        else if (this.name == "Hold Position") {
            let bodyType = mainChar.stats.getBodyType();
            let bodyTypeModifier = (bodyType == BodyType.Triped ? 2 : (bodyType == BodyType.Quadruped ? 4 : (bodyType == BodyType.FiveLegs ? 6 : (bodyType == BodyType.Slithers ? 6 : (bodyType == BodyType.Rolls ? 4 : 0)))));
            let bodySize = mainChar.stats.getSize();
            let bodySizeModifier = (bodySize == Size.Fine ? -8 : (bodySize == Size.Diminutive ? -6 : (bodySize == Size.Tiny ? -4 : (bodySize == Size.Small ? -2 : (bodySize == Size.Medium ? 0 : (
                bodySize == Size.Large ? 4 : (bodySize == Size.Huge ? 8 : (bodySize == Size.Gargantuan ? 12 : (bodySize == Size.Colossal ? 16 : 0)))))))));
            let encumbranceLevel = mainChar.stats.getEncumbrance();
            let encumbranceModifier = (encumbranceLevel == 0 ? 0 : (encumbranceLevel == 1 ? 2 : (encumbranceLevel == 2 ? 4 : (encumbranceLevel == 3 ? 8 : (encumbranceLevel == 4 ? 12 : 0)))));
            
            allModifiers = bodyTypeModifier + bodySizeModifier - encumbranceModifier;
        }
        else if (this.name == "Restraint") {
            let encumbranceLevel = mainChar.stats.getEncumbrance();
            let encumbranceModifier = (encumbranceLevel == 0 ? 0 : (encumbranceLevel == 1 ? 2 : (encumbranceLevel == 2 ? 4 : (encumbranceLevel == 3 ? 8 : (encumbranceLevel == 4 ? 12 : 0)))));
            
            allModifiers = -encumbranceModifier;
        }

        return this.points() + this.pointsModifier + this.getCPCount() + allModifiers;
    }
    getCPCost() { return this.cpCost + this.cpCostModifier; }
    getCap() {
        let _cap = this.cap() + this.capModifier;
        if (_cap > mainChar.cpStats.getMaxModifier()) _cap = mainChar.cpStats.getMaxModifier();
        return _cap;
    }

    setCPCost(newStat) { this.cpCost = newStat; }

    reducePointsModifier(x, src = null) { this.pointsModifier -= x; if (src == "Gear") { this.gearPointsModifier -= x; } }
    addPointsModifier(x, src = null) { this.pointsModifier += x; if (src == "Gear") { this.gearPointsModifier += x; } }

    reduceCpCostModifier(x) { this.cpCostModifier -= x; }
    addCpCostModifier(x) { this.cpCostModifier += x; }

    reduceCapModifier(x) { this.capModifier -= x; }
    addCapModifier(x) { this.capModifier += x; }
}

function getWeirdNumber(_addedDefense, maxHP) {
    return (_addedDefense.getPoints() * _addedDefense.getCPCost()) * (_addedDefense.getMagicNumber() / maxHP);
}

const AddedDefenses = {
    Magic: new addedDefense(0, 4, 0, 18.75, "Magic"),
    Arcane: new addedDefense(0, 3, 0, 25, "Arcane"),
    Divine: new addedDefense(0, 3, 0, 25, "Divine"),
    Primal: new addedDefense(0, 3, 0, 25, "Primal"),
    Blood: new addedDefense(0, 3, 0, 18.75, "Blood"),
    Gem: new addedDefense(0, 3, 0, 18.75, "Gem"),
    Witchcraft: new addedDefense(0, 3, 0, 18.75, "Witchcraft"),
    Psionics: new addedDefense(0, 4, 0, 25, "Psionics"),
    Technology: new addedDefense(0, 4, 0, 25, "Tech."),
    Nature: new addedDefense(0, 4, 0, 25, "Nature"),
    Luck: new addedDefense(0, 4, 0, 0, "Luck"), // ????????????????
    Illusion: new addedDefense(0, 1.5, 0, 0, "Illusion", (lvl) => { return 2 + lvl / 2; }),

    Blades: new addedDefense(0, 1.5, 0, 37.5, "Blades"),
    Axe: new addedDefense(0, 1.5, 0, 37.5, "Axe"),
    MaceHammer: new addedDefense(0, 1.5, 0, 37.5, "Mace/Ham."),
    Polearms: new addedDefense(0, 1.5, 0, 37.5, "Polearms"),
    Bows: new addedDefense(0, 1.5, 0, 37.5, "Bows"),
    Guns: new addedDefense(0, 1.5, 0, 37.5, "Guns"),
    Crossbows: new addedDefense(0, 1.5, 0, 37.5, "Crossbows"),

    Metal: new addedDefense(0, 1.5, 0, 37.5, "Metal"),
    Stone: new addedDefense(0, 1, 0, 50, "Stone"),
    Bone: new addedDefense(0, 1, 0, 50, "Bone"),

    Creatures: [],

    LawfulGood: new addedDefense(0, 1, 0, 50, "Lawful G."),
    ChaoticGood: new addedDefense(0, 1, 0, 50, "Chaotic G."),
    NeutralGood: new addedDefense(0, 1, 0, 50, "Neutral G."),
    LawfulNeutral: new addedDefense(0, 1, 0, 50, "Lawful N."),
    TrueNeutral: new addedDefense(0, 1, 0, 50, "True N."),
    ChaoticNeutral: new addedDefense(0, 1, 0, 50, "Chaotic N."),
    NeutralEvil: new addedDefense(0, 1, 0, 50, "Neutral E."),
    LawfulEvil: new addedDefense(0, 1, 0, 50, "Lawful E."),
    ChaoticEvil: new addedDefense(0, 1, 0, 50, "Chaotic E"),

    Lawful: new addedDefense(0, 2.5, 0, 30, "Lawful"),
    Chaotic: new addedDefense(0, 2.5, 0, 30, "Chaotic"),
    Good: new addedDefense(0, 2.5, 0, 30, "Good"),
    Evil: new addedDefense(0, 2.5, 0, 30, "Evil"),
    Neutral: new addedDefense(0, 2.5, 0, 30, "Neutral")
}
const DamageTypes = {
    Physical: new damageType(0, 1, () => { return mainChar.stats.getConstitution(); }, 16.666, "Physical"),
    Blunt: new damageType(0, 1, () => { return 0; }, 50, "Blunt"),
    Slashing: new damageType(0, 1, () => { return 0; }, 50, "Slashing"),
    Piercing: new damageType(0, 1, () => { return 0; }, 50, "Piercing"),
    NegEnergy: new damageType(0, 2, () => { return mainChar.stats.getConviction() / 2; }, 37.5, "Neg. Energy"),
    PosEnergy: new damageType(0, 2, () => { return mainChar.stats.getConviction() / 2; }, 37.5, "Pos. Energy"),
    Fire: new damageType(0, 2.5, () => { return (mainChar.stats.getConstitution() + mainChar.stats.getAttunement()) / 2; }, 30, "Fire"),
    Cold: new damageType(0, 2.5, () => { return (mainChar.stats.getConstitution() + mainChar.stats.getAttunement()) / 2; }, 30, "Cold"),
    Lightning: new damageType(0, 1.5, () => { return (mainChar.stats.getConstitution() + mainChar.stats.getAttunement()) / 2; }, 50, "Lightning"),
    Acid: new damageType(0, 1.5, () => { return (mainChar.stats.getConstitution() + mainChar.stats.getAttunement()) / 2; }, 50, "Acid"),
    Sonic: new damageType(0, 1.5, () => { return (mainChar.stats.getConstitution() + mainChar.stats.getAttunement()) / 2; }, 50, "Sonic"),
    Radiation: new damageType(0, 1.5, () => { return mainChar.stats.getIntelligence() / 2; }, 50, "Radiation")
}
const VSEnvironments = {
    Spot: new vsEnvironment(() => { return (mainChar.stats.getAttunement() + mainChar.stats.getDiscipline() / 2 + mainChar.stats.getIntelligence() / 2) / 2; }, 2.5, () => { return 4 + mainChar.stats.getLevel() / 2; }, "Spot"),
    Listen: new vsEnvironment(() => { return (mainChar.stats.getAttunement() + mainChar.stats.getDiscipline() / 2 + mainChar.stats.getConviction() / 2) / 2; }, 2, () => { return 4 + mainChar.stats.getLevel() / 2; }, "Listen"),
    Scent: new vsEnvironment(() => { return (mainChar.stats.getAttunement() + mainChar.stats.getDiscipline() / 2) / 2; }, 1.5, () => { return 4 + mainChar.stats.getLevel() / 2; }, "Scent"),
    Traps: new vsEnvironment(() => { return 0; }, 2, () => { return 0; }, "Traps"),
    EnvHot: new vsEnvironment(() => { return (mainChar.stats.getDiscipline() / 2 + mainChar.stats.getAttunement() / 2 + mainChar.stats.getConstitution()) / 2; }, 1, () => { return 8 + mainChar.stats.getLevel() / 1.5; }, "Environment Hot"),
    EnvCold: new vsEnvironment(() => { return (mainChar.stats.getDiscipline() / 2 + mainChar.stats.getAttunement() / 2 + mainChar.stats.getConstitution()) / 2; }, 1, () => { return 8 + mainChar.stats.getLevel() / 1.5; }, "Environment Cold"),
    Breathe: new vsEnvironment(() => { return mainChar.stats.getConstitution() / 2; }, 1, () => { return 8 + mainChar.stats.getLevel() / 1.5; }, "Breathe"),
    Surprise: new vsEnvironment(() => { return 0; }, 2, () => { return 8 + mainChar.stats.getLevel(); }, "Surprise")
}
const VSDefs = {
    Reflex: new vsDefs(() => {
        return (mainChar.stats.getAgility() + mainChar.stats.getDiscipline() / 2 + mainChar.stats.getAttunement() / 2) / 3;
    }, 5, () => { return 4 + mainChar.stats.getLevel() + (mainChar.stats.getIntelligence() + mainChar.stats.getConviction()) / 4; }, "Reflex"),
    Shapechange: new vsDefs(() => { return (mainChar.stats.getConstitution() + mainChar.stats.getDiscipline() / 2 + mainChar.stats.getAttunement() / 2) / 2; }, 2, () => { return 4 + mainChar.stats.getLevel() / 2; }, "Shapechange"),
    Balance: new vsDefs(() => {
        return (mainChar.stats.getAgility() + mainChar.stats.getDiscipline() / 2 + mainChar.stats.getAttunement() / 2) / 2;
    }, 1.5, () => { return 4 + mainChar.stats.getLevel() / 2; }, "Balance"),
    Toxic: new vsDefs(() => { return (mainChar.stats.getStrength() + mainChar.stats.getConstitution()) / 2; }, 2, () => { return 4 + mainChar.stats.getLevel() / 2; }, "Toxic"),
    Destruction: new vsDefs(() => { return (mainChar.stats.getConstitution() + mainChar.stats.getConviction()) / 2; }, 2, () => { return 4 + mainChar.stats.getLevel() / 2; }, "Destruction"),
    HoldPos: new vsDefs(() => {
        return (mainChar.stats.getStrength() + mainChar.stats.getDiscipline()) / 2;
    }, 1.5, () => { return 4 + mainChar.stats.getLevel() / 2 + mainChar.stats.getIntelligence() / 3; }, "Hold Position"),
    Compulsions: new vsDefs(() => { return (mainChar.stats.getIntelligence() + mainChar.stats.getConviction() + mainChar.stats.getDiscipline() / 2) / 2; }, 2, () => { return 4 + mainChar.stats.getLevel() / 2; }, "Compulsions"),
    Emotions: new vsDefs(() => { return (mainChar.stats.getIntelligence() + mainChar.stats.getConviction() + mainChar.stats.getDiscipline() / 2) / 2; }, 2, () => { return 4 + mainChar.stats.getLevel() / 2; }, "Emotions"),
    Concentration: new vsDefs(() => { return (mainChar.stats.getDiscipline() + mainChar.stats.getConstitution()) / 2; }, 2, () => { return 4 + mainChar.stats.getLevel() / 2; }, "Concentration"),
    Scry: new vsDefs(() => { return (mainChar.stats.getIntelligence() + mainChar.stats.getAttunement() + mainChar.stats.getDiscipline() / 2) / 2; }, 2, () => { return 4 + mainChar.stats.getLevel() / 2; }, "Scry"),
    Grip: new vsDefs(() => { return (mainChar.stats.getStrength() + mainChar.stats.getConviction()) / 2; }, 1.5, () => { return 6 + mainChar.stats.getLevel() / 1.5; }, "Grip"),
    Restraint: new vsDefs(() => {
        return (mainChar.stats.getStrength() + mainChar.stats.getIntelligence()) / 2;
    }, 1.5, () => { return 4 + mainChar.stats.getLevel() / 2 + mainChar.stats.getConviction() / 3; }, "Restraint")
}

function getDamageTypeByName(_str) {
    for (let i = 0; i < DamageTypesArray.length; ++i)
        if (DamageTypesArray[i].getName() == _str)
            return DamageTypesArray[i];
}