allSkills = [];
allCraftingSkills = [];
allCustomCraftingSkills = [];
allPerformSkills = [];
allCustomPerformSkills = [];
allKnowledgeSkills = [];
allKnowledgeSkillsModifier = 0;
globalSkillIndex = 0;

class Skill {
    constructor(base, cpMultiplier, name = "", effect = null, removalEffect = null) {
        this.id = ++globalSkillIndex;
        this.name = name;
        this.base = base;
        this.baseModifier = 0;
        this.gearPointsModifier = 0;
        this.cpCount = 0;
        this.cpMultiplier = cpMultiplier;
        this.capModifier = 0;
        this.isCustom = false;
        this.skillType = 0; // Rest
        this.effect = effect;
        this.removalEffect = removalEffect;

        this.rank = 0;
        allSkills.push(this);
    }

    getGearModifier() { return this.gearPointsModifier; }
    getRank() { this.rank = Math.floor((this.cpCount * this.cpMultiplier) / 5); return this.rank; }
    setRank(x) {
        if (this.removalEffect) this.removalEffect(x);
        if (this.effect) this.effect(x);
    }
    addPointsModifier(x, src = null) { this.addPoints(x, src); }
    reducePointsModifier(x, src = null) { this.reducePoints(x, src); }
    reducePoints(x, src = null) { this.baseModifier -= x; if (src == "Gear") { this.gearPointsModifier -= x; } }
    getCap() { return this.capModifier; }
    addCap(x) { this.capModifier += x; }
    reduceCap(x) { this.capModifier -= x; }
    addPoints(x, src = null) { this.baseModifier += x; if (src == "Gear") { this.gearPointsModifier += x; } }
    getPointsTotalForStatsPage() { return this.getPointsBase() + this.getCPCount() + this.getGearModifier(); }
    getPointsBase() { return this.base(); }
    getPoints() {
        let AllModifiers = 0;

        if (this.name == "Hide") {
            let bodySize = mainChar.stats.getSize();
            let bodySizeModifier = (bodySize == Size.Fine ? 16 : (bodySize == Size.Diminutive ? 12 : (bodySize == Size.Tiny ? 8 : (bodySize == Size.Small ? 4 : (bodySize == Size.Medium ? 0 : (
                bodySize == Size.Large ? -4 : (bodySize == Size.Huge ? -8 : (bodySize == Size.Gargantuan ? -12 : (bodySize == Size.Colossal ? -16 : 0)))))))));
            let encumbranceLevel = mainChar.stats.getEncumbrance();
            AllModifiers = bodySizeModifier - (encumbranceLevel == 0 ? 0 : (encumbranceLevel == 1 ? 2 : (encumbranceLevel == 2 ? 4 : (encumbranceLevel == 3 ? 8 : (encumbranceLevel == 4 ? 12 : 0)))));
        }
        else if (this.name == "Move Silently") {
            let bodySize = mainChar.stats.getSize();
            let bodySizeModifier = (bodySize == Size.Fine ? 8 : (bodySize == Size.Diminutive ? 6 : (bodySize == Size.Tiny ? 4 : (bodySize == Size.Small ? 2 : (bodySize == Size.Medium ? 0 : (
                bodySize == Size.Large ? -2 : (bodySize == Size.Huge ? -4 : (bodySize == Size.Gargantuan ? -6 : (bodySize == Size.Colossal ? -8 : 0)))))))));

            let encumbranceLevel = mainChar.stats.getEncumbrance();
            let armorModifier = mainChar.gear.getArmorStatPenalty();
            AllModifiers = bodySizeModifier + armorModifier - (encumbranceLevel == 0 ? 0 : (encumbranceLevel == 1 ? 2 : (encumbranceLevel == 2 ? 4 : (encumbranceLevel == 3 ? 8 : (encumbranceLevel == 4 ? 12 : 0)))));
        }
        else if (this.name == "Disguise" || this.name == "Medicine" || this.name == "Survival"
            || this.name == "Track" || this.name == "Pick Lock") {
            let encumbranceLevel = mainChar.stats.getEncumbrance();
            AllModifiers = -(encumbranceLevel == 0 ? 0 : (encumbranceLevel == 1 ? 2 : (encumbranceLevel == 2 ? 4 : (encumbranceLevel == 3 ? 8 : (encumbranceLevel == 4 ? 12 : 0)))));
        }
        else if (this.name == "Pick Pocket") {
            let encumbranceLevel = mainChar.stats.getEncumbrance();
            let armorModifier = mainChar.gear.getArmorStatPenalty();
            AllModifiers = -(encumbranceLevel == 0 ? 0 : (encumbranceLevel == 1 ? 2 : (encumbranceLevel == 2 ? 4 : (encumbranceLevel == 3 ? 8 : (encumbranceLevel == 4 ? 12 : 0))))) + armorModifier;
        }

        return this.base() + this.baseModifier + this.getCPCount() + AllModifiers;
    }
    getCPCount() { return this.cpCount; }
    setCPCount(x) { // How many we bought.
        let maxModifier = mainChar.cpStats.getMaxModifier();
        if (x > maxModifier) x = maxModifier;
        if (x < -maxModifier) x = -maxModifier;
        x = Math.round(x);

        let oldRank = this.rank;

        if (oldRank != this.getRank())
            this.setRank(this.rank);

        // Training
        let cpCost = this.cpMultiplier; //1
        let oldVal = this.getCPCount(); // 2

        mainChar.stats.addCP(this.cpCount * this.cpMultiplier);
        this.cpCount = x;
        mainChar.stats.reduceCP(this.cpCount * this.cpMultiplier);

        // Training-AfterNewValue
        let newVal = this.getCPCount(); // 3
        let diff = newVal - oldVal;
        addTrainingPoints(this.name, diff, cpCost, true); // 4
    }
}
class craftingSkills {
    constructor(base, cpMultiplier, name = "", isCustom = false, isAddedToList = false, effect = null, removalEffect = null, isStrBasedCustom = false, isAgiBasedCustom = false) {
        this.id = ++globalSkillIndex;
        this.base = base;
        this.baseModifier = 0;
        this.gearPointsModifier = 0;
        this.cpCount = 0;
        this.cpMultiplier = cpMultiplier;
        this.name = name;
        this.capModifier = 0;
        this.isCustom = isCustom;
        this.isAddedToList = isCustom ? true : isAddedToList;
        this.skillType = 1; // Crafting
        this.effect = effect;
        this.removalEffect = removalEffect;
        this.isStrBasedCustom = isStrBasedCustom;
        this.isAgiBasedCustom = isAgiBasedCustom;

        this.rank = 0;
        allCraftingSkills.push(this);
        if (isCustom) allCustomCraftingSkills.push(this);
    }

    getPointsTotalForStatsPage() { return this.getPointsBase() + this.getCPCount() + this.getGearModifier(); }
    getPointsBase() { return this.base(); }

    getCap() { return this.capModifier; }
    addCap(x) { this.capModifier += x; }
    reduceCap(x) { this.capModifier -= x; }

    addPointsModifier(x, src = null) { this.addPoints(x, src); }
    reducePointsModifier(x, src = null) { this.reducePoints(x, src); }

    getGearModifier() { return this.gearPointsModifier + mainChar.gear.getArmorStatPenalty(); }
    getRank() { this.rank = Math.floor((this.cpCount * this.cpMultiplier) / 5); return this.rank; }
    setRank(x) {
        if (this.removalEffect) this.removalEffect(x);
        if (this.effect) this.effect(x);
    }
    reducePoints(x, src = null) { this.baseModifier -= x; if (src == "Gear") { this.gearPointsModifier -= x; } }
    addPoints(x, src = null) { this.baseModifier += x; if (src == "Gear") { this.gearPointsModifier += x; } }
    getPoints() {
        let armorModifier = mainChar.gear.getArmorStatPenalty();

        return this.base() + this.baseModifier + armorModifier + this.getCPCount();
    }
    getCPCount() { return this.cpCount; }
    setCPCount(x) { // How many we bought.
        let maxModifier = mainChar.cpStats.getMaxModifier();
        if (x > maxModifier) x = maxModifier;
        if (x < -maxModifier) x = -maxModifier;
        x = Math.round(x);

        let oldRank = this.rank;

        if (oldRank != this.getRank())
            this.setRank(this.rank);

        // Training
        let cpCost = this.cpMultiplier; //1
        let oldVal = this.getCPCount(); // 2

        mainChar.stats.addCP(this.cpCount * this.cpMultiplier);
        this.cpCount = x;
        mainChar.stats.reduceCP(this.cpCount * this.cpMultiplier);

        // Training-AfterNewValue
        let newVal = this.getCPCount(); // 3
        let diff = newVal - oldVal;
        addTrainingPoints(this.name, diff, cpCost, true); // 4
    }
    isAddedCraftingSkill() { return name != ""; }
}
class performSkills {
    constructor(base, name = "", isCustom = false, isAddedToList = false, effect = null, removalEffect = null) {
        this.id = ++globalSkillIndex;
        this.base = base;
        this.baseModifier = 0;
        this.gearPointsModifier = 0;
        this.cpCount = 0;
        this.cpMultiplier = 1.5;
        this.name = name;
        this.capModifier = 0;
        this.isCustom = isCustom;
        this.isAddedToList = isCustom ? true : isAddedToList;
        this.skillType = 2; // Perform
        this.effect = effect;
        this.removalEffect = removalEffect;

        this.rank = 0;
        allPerformSkills.push(this);
        if (isCustom) allCustomPerformSkills.push(this);
    }

    addPointsModifier(x, src = null) { this.addPoints(x, src); }
    reducePointsModifier(x, src = null) { this.reducePoints(x, src); }

    getCap() { return this.capModifier; }
    addCap(x) { this.capModifier += x; }
    reduceCap(x) { this.capModifier -= x; }

    getGearModifier() { return this.gearPointsModifier + mainChar.gear.getArmorStatPenalty(); }
    getRank() { this.rank = Math.floor((this.cpCount * this.cpMultiplier) / 5); return this.rank; }
    setRank(x) {
        if (this.removalEffect) this.removalEffect(x);
        if (this.effect) this.effect(x);
    }
    reducePoints(x, src = null) { this.baseModifier -= x; if (src == "Gear") { this.gearPointsModifier -= x; } }
    addPoints(x, src = null) { this.baseModifier += x; if (src == "Gear") { this.gearPointsModifier += x; } }
    getPointsTotalForStatsPage() { return this.getPointsBase() + this.getCPCount() + this.getGearModifier(); }
    getPointsBase() { return this.base(); }
    getPoints() {
        let armorModifier = mainChar.gear.getArmorStatPenalty();
        let AllModifiers = 0;

        if (this.name == "Escape Artist") {
            let encumbranceLevel = mainChar.stats.getEncumbrance();
            AllModifiers = -(encumbranceLevel == 0 ? 0 : (encumbranceLevel == 1 ? 2 : (encumbranceLevel == 2 ? 4 : (encumbranceLevel == 3 ? 8 : (encumbranceLevel == 4 ? 12 : 0)))));
        }

        return this.base() + this.baseModifier + AllModifiers + armorModifier + this.getCPCount();
    }
    getCPCount() { return this.cpCount; }
    setCPCount(x) { // How many we bought.
        let maxModifier = mainChar.cpStats.getMaxModifier();
        if (x > maxModifier) x = maxModifier;
        if (x < -maxModifier) x = -maxModifier;
        x = Math.round(x);

        let oldRank = this.rank;

        if (oldRank != this.getRank())
            this.setRank(this.rank);

        // Training
        let cpCost = this.cpMultiplier; //1
        let oldVal = this.getCPCount(); // 2

        mainChar.stats.addCP(this.cpCount * this.cpMultiplier);
        this.cpCount = x;
        mainChar.stats.reduceCP(this.cpCount * this.cpMultiplier);

        // Training-AfterNewValue
        let newVal = this.getCPCount(); // 3
        let diff = newVal - oldVal;
        addTrainingPoints(this.name, diff, cpCost, true); // 4
    }
    isAddedPerformSkill() { return name != ""; }
}
class knowledgeSkills {
    constructor(name = "", effect = null, removalEffect = null) {
        this.id = ++globalSkillIndex;
        this.base = () => {
            let intel = mainChar.stats.getIntelligence();
            let conv = mainChar.stats.getConviction();

            return (intel + conv) / 5;
        };
        this.baseModifier = 0;
        this.gearPointsModifier = 0;
        this.cpCount = 0;
        this.cpMultiplier = 1;
        this.name = name;
        this.capModifier = 0;

        this.isCustom = true;
        this.isAddedToList = true;
        this.skillType = 3; // Knowledge
        this.effect = effect;
        this.removalEffect = removalEffect;

        this.rank = 0;
        allKnowledgeSkills.push(this);
    }

    addPointsModifier(x, src = null) { this.addPoints(x, src); }
    reducePointsModifier(x, src = null) { this.reducePoints(x, src); }

    getCap() { return this.capModifier; }
    addCap(x) { this.capModifier += x; }
    reduceCap(x) { this.capModifier -= x; }

    getGearModifier() { return this.gearPointsModifier; }
    getRank() { this.rank = Math.floor((this.cpCount * this.cpMultiplier) / 5); return this.rank; }
    setRank(x) {
        if (this.removalEffect) this.removalEffect(x);
        if (this.effect) this.effect(x);
    }
    reducePoints(x, src = null) { this.baseModifier -= x; if (src == "Gear") { this.gearPointsModifier -= x; } }
    addPoints(x, src = null) { this.baseModifier += x; if (src == "Gear") { this.gearPointsModifier += x; } }
    getPointsTotalForStatsPage() { return this.getPointsBase() + this.getCPCount() + this.getGearModifier(); }
    getPointsBase() { return this.base(); }
    getPoints() { return this.base() + this.baseModifier + allKnowledgeSkillsModifier + this.getCPCount(); }
    getCPCount() { return this.cpCount; }
    setCPCount(x) { // How many we bought.
        let maxModifier = mainChar.cpStats.getMaxModifier();
        if (x > maxModifier) x = maxModifier;
        if (x < -maxModifier) x = -maxModifier;
        x = Math.round(x);

        let oldRank = this.rank;

        if (oldRank != this.getRank())
            this.setRank(this.rank);

        // Training
        let cpCost = this.cpMultiplier; //1
        let oldVal = this.getCPCount(); // 2

        mainChar.stats.addCP(this.cpCount * this.cpMultiplier);
        this.cpCount = x;
        mainChar.stats.reduceCP(this.cpCount * this.cpMultiplier);

        // Training-AfterNewValue
        let newVal = this.getCPCount(); // 3
        let diff = newVal - oldVal;
        addTrainingPoints(this.name, diff, cpCost, true); // 4
    }
    isAddedKnowledgeSkill() { return name != ""; }
}

function addCraftedSkill(name, str, agi) {
    let base;
    if (str) base = () => {
        let str = mainChar.stats.getStrength();
        let disc = mainChar.stats.getDiscipline();
        let intel = mainChar.stats.getIntelligence();
        let conv = mainChar.stats.getConviction();

        return (str / 2 + disc / 2 + intel + conv) / 3;
    };
    if (agi) base = () => {
        let agi = mainChar.stats.getAgility();
        let disc = mainChar.stats.getDiscipline();
        let intel = mainChar.stats.getIntelligence();
        let conv = mainChar.stats.getConviction();

        return ((agi / 2) + (disc / 2) + intel + conv) / 3;
    };

    return new craftingSkills(base, 1.5, name, true, false, null, null, str, agi);
}
function addPerformSkill(name) {
    return new performSkills(() => {
        let disc = mainChar.stats.getDiscipline();
        let intel = mainChar.stats.getIntelligence();
        let conv = mainChar.stats.getConviction();
        let agi = mainChar.stats.getAgility();

        return (disc + agi / 2 + intel / 2 + conv / 2) / 3;
    }, name, true, true);
}
function addKnowledgeSkill(name) {
    return new knowledgeSkills(name);
}
function removeCraftedSkill(id) {
    for (let i = 0; i < allCustomCraftingSkills.length; ++i) {
        if (allCustomCraftingSkills[i].id == id) {
            allCustomCraftingSkills.splice(i, 1);
            return;
        }
    }
}
function removePerformSkill(id) {
    for (let i = 0; i < allCustomPerformSkills.length; ++i) {
        if (allCustomPerformSkills[i].id == id) {
            allCustomPerformSkills.splice(i, 1);
            return;
        }
    }
}
function removeKnowledgeSkill(id) {
    for (let i = 0; i < allKnowledgeSkills.length; ++i) {
        if (allKnowledgeSkills[i].id == id) {
            allKnowledgeSkills.splice(i, 1);
            return;
        }
    }
}

function getSkillByName(name) {
    // Crafting Skills
    if (name == "Alchemy") return mainChar.stats.craftingSkills.Alchemy;
    else if (name == "Brews") return mainChar.stats.craftingSkills.Brews;
    else if (name == "Oils and Balms") return mainChar.stats.craftingSkills.OilsAndBalms;
    else if (name == "Toxins") return mainChar.stats.craftingSkills.Toxins;
    else if (name == "Homunculi") return mainChar.stats.craftingSkills.Homunculi;
    else if (name == "Explosives") return mainChar.stats.craftingSkills.Explosives;
    else if (name == "Transmogrify") return mainChar.stats.craftingSkills.Transmogrify;
    else if (name == "Blacksmith") return mainChar.stats.craftingSkills.Blacksmith;
    else if (name == "Armorsmith") return mainChar.stats.craftingSkills.Armorsmith;
    else if (name == "Weaponsmith") return mainChar.stats.craftingSkills.Weaponsmith;
    else if (name == "Carpentry") return mainChar.stats.craftingSkills.Carpentry;
    else if (name == "Fletchery") return mainChar.stats.craftingSkills.Fletchery;
    else if (name == "Leatherwork") return mainChar.stats.craftingSkills.Leatherwork;
    else if (name == "Tailor") return mainChar.stats.craftingSkills.Tailor;
    else if (name == "Trapmaking") return mainChar.stats.craftingSkills.Trapmaking;
    else if (name == "Engineering") return mainChar.stats.craftingSkills.Engineering;
    // Perform Skills
    else if (name == "Acting") return mainChar.stats.performSkills.Acting;
    else if (name == "Escape Artist") return mainChar.stats.performSkills.EscapeArtist;
    else if (name == "Sleight of Hand") return mainChar.stats.performSkills.SleightOfHand;
}