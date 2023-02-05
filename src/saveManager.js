// ------------ Saving and Loading <FrontEnd> -----------
function saveCharFile() {
    let savedCharData = saveChar();
    var blob = new Blob([savedCharData], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "Character_" + mainChar.getName() + ".chd");
}
function loadCharFile(file) {
    if (file) {
        var reader = new FileReader();

        reader.readAsText(file, "UTF-8");
        reader.onload = (e) => {
            var obj = JSON.parse(e.target.result);
            loadChar(obj);
        };

        reader.onerror = () => {
            alert("Loading Failed! This Character Data is Corrupt!");
        }
    }
}

// ------------ Saving and Loading <BackEnd> -----------
function saveChar() {
    let charData = [];

    charData.push(mainChar); // 0

    charData.push(allTrainings); // 1
    charData.push(allQualities); // 2
    charData.push(allPowersArray); // 3
    charData.push(allSpecsArray); // 4
    charData.push(AllMasterSpecs); // 5

    charData.push(activeConditions); // 6

    charData.push(AddedDefensesArray); // 7
    charData.push(DamageTypesArray); // 8
    charData.push(VSEnvironmentArray); // 9
    charData.push(VSDefsArray); // 10

    charData.push(allSpells); // 11

    charData.push(allCustomPerformSkills); // 12
    charData.push(allCustomCraftingSkills); // 13
    charData.push(allKnowledgeSkills); // 14

    charData.push(trainingsID); // 15
    charData.push(powersIndex); // 16
    charData.push(lastConditionIndex); // 17
    charData.push(gearIndex); // 18
    charData.push(qualityIndex); // 19
    charData.push(carryingIndex); // 20
    charData.push(allKnowledgeSkillsModifier); // 21
    charData.push(globalSkillIndex); // 22
    charData.push(allSpellsIndex); // 23

    return JSON.stringify(charData);
}
function loadChar(charData) {
    let mainCharData = charData[0]; // Object
    let allTrainingsData = charData[1]; // Array
    let allQualitiesData = charData[2]; // Array
    let allPowersArrayData = charData[3]; // Array
    let allSpecsArrayData = charData[4]; // Array
    let AllMasterSpecsData = charData[5]; // Object
    let activeConditionsData = charData[6]; // Array
    let AddedDefensesArrayData = charData[7]; // Array
    let DamageTypesArrayData = charData[8]; // Array
    let VSEnvironmentArrayData = charData[9]; // Array
    let VSDefsArrayData = charData[10]; // Array
    let allSpellsData = charData[11]; // Array
    let allCustomPerformSkillsData = charData[12]; // Array
    let allCustomCraftingSkillsData = charData[13]; // Array
    let allKnowledgeSkillsData = charData[14]; // Array

    // Loading Main Char
    mainChar = new Character(mainCharData.stats.level);
    mainChar.name = mainCharData.name;
    mainChar.race = mainCharData.race;
    mainChar.type = mainCharData.type;
    mainChar.alignment = mainCharData.alignment;
    mainChar.age = mainCharData.age;
    mainChar.sex = mainCharData.sex;
    mainChar.height = mainCharData.height;
    mainChar.weight = mainCharData.weight;
    mainChar.eyes = mainCharData.eyes;
    mainChar.hair = mainCharData.hair;
    mainChar.languages = mainCharData.languages;
    mainChar.quirks = mainCharData.quirks;
    mainChar.biography = mainCharData.biography;

    // <---------------------- MainChar Stats ---------------------->
    mainChar.stats.level = mainCharData.stats.level;
    mainChar.stats.xp = mainCharData.stats.xp;
    mainChar.stats.cp = mainCharData.stats.cp;
    mainChar.stats.maxCP = mainCharData.stats.maxCP;
    mainChar.stats.cpModifier = mainCharData.stats.cpModifier;
    mainChar.stats.size = mainCharData.stats.size;
    mainChar.stats.bodyType = mainCharData.stats.bodyType;
    mainChar.stats.strength = mainCharData.stats.strength;
    mainChar.stats.agility = mainCharData.stats.agility;
    mainChar.stats.discipline = mainCharData.stats.discipline;
    mainChar.stats.intelligence = mainCharData.stats.intelligence;
    mainChar.stats.conviction = mainCharData.stats.conviction;
    mainChar.stats.attunement = mainCharData.stats.attunement;
    mainChar.stats.constitution = mainCharData.stats.constitution;
    mainChar.stats.strengthModifier = mainCharData.stats.strengthModifier;
    mainChar.stats.agilityModifier = mainCharData.stats.agilityModifier;
    mainChar.stats.disciplineModifier = mainCharData.stats.disciplineModifier;
    mainChar.stats.intelligenceModifier = mainCharData.stats.intelligenceModifier;
    mainChar.stats.convictionModifier = mainCharData.stats.convictionModifier;
    mainChar.stats.attunementModifier = mainCharData.stats.attunementModifier;
    mainChar.stats.constitutionModifier = mainCharData.stats.constitutionModifier;
    mainChar.stats.hp = mainCharData.stats.hp;
    mainChar.stats.mana = mainCharData.stats.mana;
    mainChar.stats.stamina = mainCharData.stats.stamina;
    mainChar.stats.accuracy = mainCharData.stats.accuracy;
    mainChar.stats.parry = mainCharData.stats.parry;
    mainChar.stats.damage = mainCharData.stats.damage;
    mainChar.stats.dodge = mainCharData.stats.dodge;
    mainChar.stats.hpModifier = mainCharData.stats.hpModifier;
    mainChar.stats.manaModifier = mainCharData.stats.manaModifier;
    mainChar.stats.staminaModifier = mainCharData.stats.staminaModifier;
    mainChar.stats.accuracyModifier = mainCharData.stats.accuracyModifier;
    mainChar.stats.parryModifier = mainCharData.stats.parryModifier;
    mainChar.stats.damageModifier = mainCharData.stats.damageModifier;
    mainChar.stats.dodgeModifier = mainCharData.stats.dodgeModifier;
    mainChar.stats.maxHPModifier = mainCharData.stats.maxHPModifier;
    mainChar.stats.maxManaModifier = mainCharData.stats.maxManaModifier;
    mainChar.stats.maxStaminaModifier = mainCharData.stats.maxStaminaModifier;
    mainChar.stats.strengthGearModifier = mainCharData.stats.strengthGearModifier;
    mainChar.stats.agilityGearModifier = mainCharData.stats.agilityGearModifier;
    mainChar.stats.disciplineGearModifier = mainCharData.stats.disciplineGearModifier;
    mainChar.stats.intelligenceGearModifier = mainCharData.stats.intelligenceGearModifier;
    mainChar.stats.convictionGearModifier = mainCharData.stats.convictionGearModifier;
    mainChar.stats.attunementGearModifier = mainCharData.stats.attunementGearModifier;
    mainChar.stats.constitutionGearModifier = mainCharData.stats.constitutionGearModifier;

    mainChar.stats.movements.ground.baseModifier = mainCharData.stats.movements.ground.baseModifier;
    mainChar.stats.movements.ground.gearPointsModifier = mainCharData.stats.movements.ground.gearPointsModifier;
    mainChar.stats.movements.ground.baseCpCost = mainCharData.stats.movements.ground.baseCpCost;
    mainChar.stats.movements.ground.cpCost = mainCharData.stats.movements.ground.cpCost;
    mainChar.stats.movements.ground.firstXFtCpCost = mainCharData.stats.movements.ground.firstXFtCpCost;
    mainChar.stats.movements.ground.cpCount = mainCharData.stats.movements.ground.cpCount;
    mainChar.stats.movements.ground.slowPercent = mainCharData.stats.movements.ground.slowPercent;
    mainChar.stats.movements.ground.feetsMoved = mainCharData.stats.movements.ground.feetsMoved;
    mainChar.stats.movements.ground.capModifier = mainCharData.stats.movements.ground.capModifier;
    mainChar.stats.movements.ground.name = mainCharData.stats.movements.ground.name;

    mainChar.stats.movements.swim.baseModifier = mainCharData.stats.movements.swim.baseModifier;
    mainChar.stats.movements.swim.gearPointsModifier = mainCharData.stats.movements.swim.gearPointsModifier;
    mainChar.stats.movements.swim.baseCpCost = mainCharData.stats.movements.swim.baseCpCost;
    mainChar.stats.movements.swim.cpCost = mainCharData.stats.movements.swim.cpCost;
    mainChar.stats.movements.swim.firstXFtCpCost = mainCharData.stats.movements.swim.firstXFtCpCost;
    mainChar.stats.movements.swim.cpCount = mainCharData.stats.movements.swim.cpCount;
    mainChar.stats.movements.swim.slowPercent = mainCharData.stats.movements.swim.slowPercent;
    mainChar.stats.movements.swim.feetsMoved = mainCharData.stats.movements.swim.feetsMoved;
    mainChar.stats.movements.swim.capModifier = mainCharData.stats.movements.swim.capModifier;
    mainChar.stats.movements.swim.name = mainCharData.stats.movements.swim.name;

    mainChar.stats.movements.climb.baseModifier = mainCharData.stats.movements.climb.baseModifier;
    mainChar.stats.movements.climb.gearPointsModifier = mainCharData.stats.movements.climb.gearPointsModifier;
    mainChar.stats.movements.climb.baseCpCost = mainCharData.stats.movements.climb.baseCpCost;
    mainChar.stats.movements.climb.cpCost = mainCharData.stats.movements.climb.cpCost;
    mainChar.stats.movements.climb.firstXFtCpCost = mainCharData.stats.movements.climb.firstXFtCpCost;
    mainChar.stats.movements.climb.cpCount = mainCharData.stats.movements.climb.cpCount;
    mainChar.stats.movements.climb.slowPercent = mainCharData.stats.movements.climb.slowPercent;
    mainChar.stats.movements.climb.feetsMoved = mainCharData.stats.movements.climb.feetsMoved;
    mainChar.stats.movements.climb.capModifier = mainCharData.stats.movements.climb.capModifier;
    mainChar.stats.movements.climb.name = mainCharData.stats.movements.climb.name;

    mainChar.stats.movements.jump.baseModifier = mainCharData.stats.movements.jump.baseModifier;
    mainChar.stats.movements.jump.gearPointsModifier = mainCharData.stats.movements.jump.gearPointsModifier;
    mainChar.stats.movements.jump.baseCpCost = mainCharData.stats.movements.jump.baseCpCost;
    mainChar.stats.movements.jump.cpCost = mainCharData.stats.movements.jump.cpCost;
    mainChar.stats.movements.jump.firstXFtCpCost = mainCharData.stats.movements.jump.firstXFtCpCost;
    mainChar.stats.movements.jump.cpCount = mainCharData.stats.movements.jump.cpCount;
    mainChar.stats.movements.jump.slowPercent = mainCharData.stats.movements.jump.slowPercent;
    mainChar.stats.movements.jump.feetsMoved = mainCharData.stats.movements.jump.feetsMoved;
    mainChar.stats.movements.jump.capModifier = mainCharData.stats.movements.jump.capModifier;
    mainChar.stats.movements.jump.name = mainCharData.stats.movements.jump.name;

    mainChar.stats.movements.burrow.baseModifier = mainCharData.stats.movements.burrow.baseModifier;
    mainChar.stats.movements.burrow.gearPointsModifier = mainCharData.stats.movements.burrow.gearPointsModifier;
    mainChar.stats.movements.burrow.baseCpCost = mainCharData.stats.movements.burrow.baseCpCost;
    mainChar.stats.movements.burrow.cpCost = mainCharData.stats.movements.burrow.cpCost;
    mainChar.stats.movements.burrow.firstXFtCpCost = mainCharData.stats.movements.burrow.firstXFtCpCost;
    mainChar.stats.movements.burrow.cpCount = mainCharData.stats.movements.burrow.cpCount;
    mainChar.stats.movements.burrow.slowPercent = mainCharData.stats.movements.burrow.slowPercent;
    mainChar.stats.movements.burrow.feetsMoved = mainCharData.stats.movements.burrow.feetsMoved;
    mainChar.stats.movements.burrow.capModifier = mainCharData.stats.movements.burrow.capModifier;
    mainChar.stats.movements.burrow.name = mainCharData.stats.movements.burrow.name;

    mainChar.stats.movements.flight.baseModifier = mainCharData.stats.movements.flight.baseModifier;
    mainChar.stats.movements.flight.gearPointsModifier = mainCharData.stats.movements.flight.gearPointsModifier;
    mainChar.stats.movements.flight.baseCpCost = mainCharData.stats.movements.flight.baseCpCost;
    mainChar.stats.movements.flight.cpCost = mainCharData.stats.movements.flight.cpCost;
    mainChar.stats.movements.flight.firstXFtCpCost = mainCharData.stats.movements.flight.firstXFtCpCost;
    mainChar.stats.movements.flight.cpCount = mainCharData.stats.movements.flight.cpCount;
    mainChar.stats.movements.flight.slowPercent = mainCharData.stats.movements.flight.slowPercent;
    mainChar.stats.movements.flight.feetsMoved = mainCharData.stats.movements.flight.feetsMoved;
    mainChar.stats.movements.flight.capModifier = mainCharData.stats.movements.flight.capModifier;
    mainChar.stats.movements.flight.name = mainCharData.stats.movements.flight.name;

    //CraftingSkills
    mainChar.stats.craftingSkills.Alchemy.id = mainCharData.stats.craftingSkills.Alchemy.id;
    mainChar.stats.craftingSkills.Alchemy.baseModifier = mainCharData.stats.craftingSkills.Alchemy.baseModifier;
    mainChar.stats.craftingSkills.Alchemy.gearPointsModifier = mainCharData.stats.craftingSkills.Alchemy.gearPointsModifier;
    mainChar.stats.craftingSkills.Alchemy.cpCount = mainCharData.stats.craftingSkills.Alchemy.cpCount;
    mainChar.stats.craftingSkills.Alchemy.cpMultiplier = mainCharData.stats.craftingSkills.Alchemy.cpMultiplier;
    mainChar.stats.craftingSkills.Alchemy.name = mainCharData.stats.craftingSkills.Alchemy.name;
    mainChar.stats.craftingSkills.Alchemy.capModifier = mainCharData.stats.craftingSkills.Alchemy.capModifier;
    mainChar.stats.craftingSkills.Alchemy.isCustom = mainCharData.stats.craftingSkills.Alchemy.isCustom;
    mainChar.stats.craftingSkills.Alchemy.isAddedToList = mainCharData.stats.craftingSkills.Alchemy.isAddedToList;
    mainChar.stats.craftingSkills.Alchemy.skillType = mainCharData.stats.craftingSkills.Alchemy.skillType;
    mainChar.stats.craftingSkills.Alchemy.rank = mainCharData.stats.craftingSkills.Alchemy.rank;

    mainChar.stats.craftingSkills.Brews.id = mainCharData.stats.craftingSkills.Brews.id;
    mainChar.stats.craftingSkills.Brews.baseModifier = mainCharData.stats.craftingSkills.Brews.baseModifier;
    mainChar.stats.craftingSkills.Brews.gearPointsModifier = mainCharData.stats.craftingSkills.Brews.gearPointsModifier;
    mainChar.stats.craftingSkills.Brews.cpCount = mainCharData.stats.craftingSkills.Brews.cpCount;
    mainChar.stats.craftingSkills.Brews.cpMultiplier = mainCharData.stats.craftingSkills.Brews.cpMultiplier;
    mainChar.stats.craftingSkills.Brews.name = mainCharData.stats.craftingSkills.Brews.name;
    mainChar.stats.craftingSkills.Brews.capModifier = mainCharData.stats.craftingSkills.Brews.capModifier;
    mainChar.stats.craftingSkills.Brews.isCustom = mainCharData.stats.craftingSkills.Brews.isCustom;
    mainChar.stats.craftingSkills.Brews.isAddedToList = mainCharData.stats.craftingSkills.Brews.isAddedToList;
    mainChar.stats.craftingSkills.Brews.skillType = mainCharData.stats.craftingSkills.Brews.skillType;
    mainChar.stats.craftingSkills.Brews.rank = mainCharData.stats.craftingSkills.Brews.rank;

    mainChar.stats.craftingSkills.OilsAndBalms.id = mainCharData.stats.craftingSkills.OilsAndBalms.id;
    mainChar.stats.craftingSkills.OilsAndBalms.baseModifier = mainCharData.stats.craftingSkills.OilsAndBalms.baseModifier;
    mainChar.stats.craftingSkills.OilsAndBalms.gearPointsModifier = mainCharData.stats.craftingSkills.OilsAndBalms.gearPointsModifier;
    mainChar.stats.craftingSkills.OilsAndBalms.cpCount = mainCharData.stats.craftingSkills.OilsAndBalms.cpCount;
    mainChar.stats.craftingSkills.OilsAndBalms.cpMultiplier = mainCharData.stats.craftingSkills.OilsAndBalms.cpMultiplier;
    mainChar.stats.craftingSkills.OilsAndBalms.name = mainCharData.stats.craftingSkills.OilsAndBalms.name;
    mainChar.stats.craftingSkills.OilsAndBalms.capModifier = mainCharData.stats.craftingSkills.OilsAndBalms.capModifier;
    mainChar.stats.craftingSkills.OilsAndBalms.isCustom = mainCharData.stats.craftingSkills.OilsAndBalms.isCustom;
    mainChar.stats.craftingSkills.OilsAndBalms.isAddedToList = mainCharData.stats.craftingSkills.OilsAndBalms.isAddedToList;
    mainChar.stats.craftingSkills.OilsAndBalms.skillType = mainCharData.stats.craftingSkills.OilsAndBalms.skillType;
    mainChar.stats.craftingSkills.OilsAndBalms.rank = mainCharData.stats.craftingSkills.OilsAndBalms.rank;

    mainChar.stats.craftingSkills.Toxins.id = mainCharData.stats.craftingSkills.Toxins.id;
    mainChar.stats.craftingSkills.Toxins.baseModifier = mainCharData.stats.craftingSkills.Toxins.baseModifier;
    mainChar.stats.craftingSkills.Toxins.gearPointsModifier = mainCharData.stats.craftingSkills.Toxins.gearPointsModifier;
    mainChar.stats.craftingSkills.Toxins.cpCount = mainCharData.stats.craftingSkills.Toxins.cpCount;
    mainChar.stats.craftingSkills.Toxins.cpMultiplier = mainCharData.stats.craftingSkills.Toxins.cpMultiplier;
    mainChar.stats.craftingSkills.Toxins.name = mainCharData.stats.craftingSkills.Toxins.name;
    mainChar.stats.craftingSkills.Toxins.capModifier = mainCharData.stats.craftingSkills.Toxins.capModifier;
    mainChar.stats.craftingSkills.Toxins.isCustom = mainCharData.stats.craftingSkills.Toxins.isCustom;
    mainChar.stats.craftingSkills.Toxins.isAddedToList = mainCharData.stats.craftingSkills.Toxins.isAddedToList;
    mainChar.stats.craftingSkills.Toxins.skillType = mainCharData.stats.craftingSkills.Toxins.skillType;
    mainChar.stats.craftingSkills.Toxins.rank = mainCharData.stats.craftingSkills.Toxins.rank;

    mainChar.stats.craftingSkills.Homunculi.id = mainCharData.stats.craftingSkills.Homunculi.id;
    mainChar.stats.craftingSkills.Homunculi.baseModifier = mainCharData.stats.craftingSkills.Homunculi.baseModifier;
    mainChar.stats.craftingSkills.Homunculi.gearPointsModifier = mainCharData.stats.craftingSkills.Homunculi.gearPointsModifier;
    mainChar.stats.craftingSkills.Homunculi.cpCount = mainCharData.stats.craftingSkills.Homunculi.cpCount;
    mainChar.stats.craftingSkills.Homunculi.cpMultiplier = mainCharData.stats.craftingSkills.Homunculi.cpMultiplier;
    mainChar.stats.craftingSkills.Homunculi.name = mainCharData.stats.craftingSkills.Homunculi.name;
    mainChar.stats.craftingSkills.Homunculi.capModifier = mainCharData.stats.craftingSkills.Homunculi.capModifier;
    mainChar.stats.craftingSkills.Homunculi.isCustom = mainCharData.stats.craftingSkills.Homunculi.isCustom;
    mainChar.stats.craftingSkills.Homunculi.isAddedToList = mainCharData.stats.craftingSkills.Homunculi.isAddedToList;
    mainChar.stats.craftingSkills.Homunculi.skillType = mainCharData.stats.craftingSkills.Homunculi.skillType;
    mainChar.stats.craftingSkills.Homunculi.rank = mainCharData.stats.craftingSkills.Homunculi.rank;

    mainChar.stats.craftingSkills.Explosives.id = mainCharData.stats.craftingSkills.Explosives.id;
    mainChar.stats.craftingSkills.Explosives.baseModifier = mainCharData.stats.craftingSkills.Explosives.baseModifier;
    mainChar.stats.craftingSkills.Explosives.gearPointsModifier = mainCharData.stats.craftingSkills.Explosives.gearPointsModifier;
    mainChar.stats.craftingSkills.Explosives.cpCount = mainCharData.stats.craftingSkills.Explosives.cpCount;
    mainChar.stats.craftingSkills.Explosives.cpMultiplier = mainCharData.stats.craftingSkills.Explosives.cpMultiplier;
    mainChar.stats.craftingSkills.Explosives.name = mainCharData.stats.craftingSkills.Explosives.name;
    mainChar.stats.craftingSkills.Explosives.capModifier = mainCharData.stats.craftingSkills.Explosives.capModifier;
    mainChar.stats.craftingSkills.Explosives.isCustom = mainCharData.stats.craftingSkills.Explosives.isCustom;
    mainChar.stats.craftingSkills.Explosives.isAddedToList = mainCharData.stats.craftingSkills.Explosives.isAddedToList;
    mainChar.stats.craftingSkills.Explosives.skillType = mainCharData.stats.craftingSkills.Explosives.skillType;
    mainChar.stats.craftingSkills.Explosives.rank = mainCharData.stats.craftingSkills.Explosives.rank;

    mainChar.stats.craftingSkills.Transmogrify.id = mainCharData.stats.craftingSkills.Transmogrify.id;
    mainChar.stats.craftingSkills.Transmogrify.baseModifier = mainCharData.stats.craftingSkills.Transmogrify.baseModifier;
    mainChar.stats.craftingSkills.Transmogrify.gearPointsModifier = mainCharData.stats.craftingSkills.Transmogrify.gearPointsModifier;
    mainChar.stats.craftingSkills.Transmogrify.cpCount = mainCharData.stats.craftingSkills.Transmogrify.cpCount;
    mainChar.stats.craftingSkills.Transmogrify.cpMultiplier = mainCharData.stats.craftingSkills.Transmogrify.cpMultiplier;
    mainChar.stats.craftingSkills.Transmogrify.name = mainCharData.stats.craftingSkills.Transmogrify.name;
    mainChar.stats.craftingSkills.Transmogrify.capModifier = mainCharData.stats.craftingSkills.Transmogrify.capModifier;
    mainChar.stats.craftingSkills.Transmogrify.isCustom = mainCharData.stats.craftingSkills.Transmogrify.isCustom;
    mainChar.stats.craftingSkills.Transmogrify.isAddedToList = mainCharData.stats.craftingSkills.Transmogrify.isAddedToList;
    mainChar.stats.craftingSkills.Transmogrify.skillType = mainCharData.stats.craftingSkills.Transmogrify.skillType;
    mainChar.stats.craftingSkills.Transmogrify.rank = mainCharData.stats.craftingSkills.Transmogrify.rank;

    mainChar.stats.craftingSkills.Blacksmith.id = mainCharData.stats.craftingSkills.Blacksmith.id;
    mainChar.stats.craftingSkills.Blacksmith.baseModifier = mainCharData.stats.craftingSkills.Blacksmith.baseModifier;
    mainChar.stats.craftingSkills.Blacksmith.gearPointsModifier = mainCharData.stats.craftingSkills.Blacksmith.gearPointsModifier;
    mainChar.stats.craftingSkills.Blacksmith.cpCount = mainCharData.stats.craftingSkills.Blacksmith.cpCount;
    mainChar.stats.craftingSkills.Blacksmith.cpMultiplier = mainCharData.stats.craftingSkills.Blacksmith.cpMultiplier;
    mainChar.stats.craftingSkills.Blacksmith.name = mainCharData.stats.craftingSkills.Blacksmith.name;
    mainChar.stats.craftingSkills.Blacksmith.capModifier = mainCharData.stats.craftingSkills.Blacksmith.capModifier;
    mainChar.stats.craftingSkills.Blacksmith.isCustom = mainCharData.stats.craftingSkills.Blacksmith.isCustom;
    mainChar.stats.craftingSkills.Blacksmith.isAddedToList = mainCharData.stats.craftingSkills.Blacksmith.isAddedToList;
    mainChar.stats.craftingSkills.Blacksmith.skillType = mainCharData.stats.craftingSkills.Blacksmith.skillType;
    mainChar.stats.craftingSkills.Blacksmith.rank = mainCharData.stats.craftingSkills.Blacksmith.rank;

    mainChar.stats.craftingSkills.Armorsmith.id = mainCharData.stats.craftingSkills.Armorsmith.id;
    mainChar.stats.craftingSkills.Armorsmith.baseModifier = mainCharData.stats.craftingSkills.Armorsmith.baseModifier;
    mainChar.stats.craftingSkills.Armorsmith.gearPointsModifier = mainCharData.stats.craftingSkills.Armorsmith.gearPointsModifier;
    mainChar.stats.craftingSkills.Armorsmith.cpCount = mainCharData.stats.craftingSkills.Armorsmith.cpCount;
    mainChar.stats.craftingSkills.Armorsmith.cpMultiplier = mainCharData.stats.craftingSkills.Armorsmith.cpMultiplier;
    mainChar.stats.craftingSkills.Armorsmith.name = mainCharData.stats.craftingSkills.Armorsmith.name;
    mainChar.stats.craftingSkills.Armorsmith.capModifier = mainCharData.stats.craftingSkills.Armorsmith.capModifier;
    mainChar.stats.craftingSkills.Armorsmith.isCustom = mainCharData.stats.craftingSkills.Armorsmith.isCustom;
    mainChar.stats.craftingSkills.Armorsmith.isAddedToList = mainCharData.stats.craftingSkills.Armorsmith.isAddedToList;
    mainChar.stats.craftingSkills.Armorsmith.skillType = mainCharData.stats.craftingSkills.Armorsmith.skillType;
    mainChar.stats.craftingSkills.Armorsmith.rank = mainCharData.stats.craftingSkills.Armorsmith.rank;

    mainChar.stats.craftingSkills.Weaponsmith.id = mainCharData.stats.craftingSkills.Weaponsmith.id;
    mainChar.stats.craftingSkills.Weaponsmith.baseModifier = mainCharData.stats.craftingSkills.Weaponsmith.baseModifier;
    mainChar.stats.craftingSkills.Weaponsmith.gearPointsModifier = mainCharData.stats.craftingSkills.Weaponsmith.gearPointsModifier;
    mainChar.stats.craftingSkills.Weaponsmith.cpCount = mainCharData.stats.craftingSkills.Weaponsmith.cpCount;
    mainChar.stats.craftingSkills.Weaponsmith.cpMultiplier = mainCharData.stats.craftingSkills.Weaponsmith.cpMultiplier;
    mainChar.stats.craftingSkills.Weaponsmith.name = mainCharData.stats.craftingSkills.Weaponsmith.name;
    mainChar.stats.craftingSkills.Weaponsmith.capModifier = mainCharData.stats.craftingSkills.Weaponsmith.capModifier;
    mainChar.stats.craftingSkills.Weaponsmith.isCustom = mainCharData.stats.craftingSkills.Weaponsmith.isCustom;
    mainChar.stats.craftingSkills.Weaponsmith.isAddedToList = mainCharData.stats.craftingSkills.Weaponsmith.isAddedToList;
    mainChar.stats.craftingSkills.Weaponsmith.skillType = mainCharData.stats.craftingSkills.Weaponsmith.skillType;
    mainChar.stats.craftingSkills.Weaponsmith.rank = mainCharData.stats.craftingSkills.Weaponsmith.rank;

    mainChar.stats.craftingSkills.Carpentry.id = mainCharData.stats.craftingSkills.Carpentry.id;
    mainChar.stats.craftingSkills.Carpentry.baseModifier = mainCharData.stats.craftingSkills.Carpentry.baseModifier;
    mainChar.stats.craftingSkills.Carpentry.gearPointsModifier = mainCharData.stats.craftingSkills.Carpentry.gearPointsModifier;
    mainChar.stats.craftingSkills.Carpentry.cpCount = mainCharData.stats.craftingSkills.Carpentry.cpCount;
    mainChar.stats.craftingSkills.Carpentry.cpMultiplier = mainCharData.stats.craftingSkills.Carpentry.cpMultiplier;
    mainChar.stats.craftingSkills.Carpentry.name = mainCharData.stats.craftingSkills.Carpentry.name;
    mainChar.stats.craftingSkills.Carpentry.capModifier = mainCharData.stats.craftingSkills.Carpentry.capModifier;
    mainChar.stats.craftingSkills.Carpentry.isCustom = mainCharData.stats.craftingSkills.Carpentry.isCustom;
    mainChar.stats.craftingSkills.Carpentry.isAddedToList = mainCharData.stats.craftingSkills.Carpentry.isAddedToList;
    mainChar.stats.craftingSkills.Carpentry.skillType = mainCharData.stats.craftingSkills.Carpentry.skillType;
    mainChar.stats.craftingSkills.Carpentry.rank = mainCharData.stats.craftingSkills.Carpentry.rank;

    mainChar.stats.craftingSkills.Fletchery.id = mainCharData.stats.craftingSkills.Fletchery.id;
    mainChar.stats.craftingSkills.Fletchery.baseModifier = mainCharData.stats.craftingSkills.Fletchery.baseModifier;
    mainChar.stats.craftingSkills.Fletchery.gearPointsModifier = mainCharData.stats.craftingSkills.Fletchery.gearPointsModifier;
    mainChar.stats.craftingSkills.Fletchery.cpCount = mainCharData.stats.craftingSkills.Fletchery.cpCount;
    mainChar.stats.craftingSkills.Fletchery.cpMultiplier = mainCharData.stats.craftingSkills.Fletchery.cpMultiplier;
    mainChar.stats.craftingSkills.Fletchery.name = mainCharData.stats.craftingSkills.Fletchery.name;
    mainChar.stats.craftingSkills.Fletchery.capModifier = mainCharData.stats.craftingSkills.Fletchery.capModifier;
    mainChar.stats.craftingSkills.Fletchery.isCustom = mainCharData.stats.craftingSkills.Fletchery.isCustom;
    mainChar.stats.craftingSkills.Fletchery.isAddedToList = mainCharData.stats.craftingSkills.Fletchery.isAddedToList;
    mainChar.stats.craftingSkills.Fletchery.skillType = mainCharData.stats.craftingSkills.Fletchery.skillType;
    mainChar.stats.craftingSkills.Fletchery.rank = mainCharData.stats.craftingSkills.Fletchery.rank;

    mainChar.stats.craftingSkills.Leatherwork.id = mainCharData.stats.craftingSkills.Leatherwork.id;
    mainChar.stats.craftingSkills.Leatherwork.baseModifier = mainCharData.stats.craftingSkills.Leatherwork.baseModifier;
    mainChar.stats.craftingSkills.Leatherwork.gearPointsModifier = mainCharData.stats.craftingSkills.Leatherwork.gearPointsModifier;
    mainChar.stats.craftingSkills.Leatherwork.cpCount = mainCharData.stats.craftingSkills.Leatherwork.cpCount;
    mainChar.stats.craftingSkills.Leatherwork.cpMultiplier = mainCharData.stats.craftingSkills.Leatherwork.cpMultiplier;
    mainChar.stats.craftingSkills.Leatherwork.name = mainCharData.stats.craftingSkills.Leatherwork.name;
    mainChar.stats.craftingSkills.Leatherwork.capModifier = mainCharData.stats.craftingSkills.Leatherwork.capModifier;
    mainChar.stats.craftingSkills.Leatherwork.isCustom = mainCharData.stats.craftingSkills.Leatherwork.isCustom;
    mainChar.stats.craftingSkills.Leatherwork.isAddedToList = mainCharData.stats.craftingSkills.Leatherwork.isAddedToList;
    mainChar.stats.craftingSkills.Leatherwork.skillType = mainCharData.stats.craftingSkills.Leatherwork.skillType;
    mainChar.stats.craftingSkills.Leatherwork.rank = mainCharData.stats.craftingSkills.Leatherwork.rank;

    mainChar.stats.craftingSkills.Tailor.id = mainCharData.stats.craftingSkills.Tailor.id;
    mainChar.stats.craftingSkills.Tailor.baseModifier = mainCharData.stats.craftingSkills.Tailor.baseModifier;
    mainChar.stats.craftingSkills.Tailor.gearPointsModifier = mainCharData.stats.craftingSkills.Tailor.gearPointsModifier;
    mainChar.stats.craftingSkills.Tailor.cpCount = mainCharData.stats.craftingSkills.Tailor.cpCount;
    mainChar.stats.craftingSkills.Tailor.cpMultiplier = mainCharData.stats.craftingSkills.Tailor.cpMultiplier;
    mainChar.stats.craftingSkills.Tailor.name = mainCharData.stats.craftingSkills.Tailor.name;
    mainChar.stats.craftingSkills.Tailor.capModifier = mainCharData.stats.craftingSkills.Tailor.capModifier;
    mainChar.stats.craftingSkills.Tailor.isCustom = mainCharData.stats.craftingSkills.Tailor.isCustom;
    mainChar.stats.craftingSkills.Tailor.isAddedToList = mainCharData.stats.craftingSkills.Tailor.isAddedToList;
    mainChar.stats.craftingSkills.Tailor.skillType = mainCharData.stats.craftingSkills.Tailor.skillType;
    mainChar.stats.craftingSkills.Tailor.rank = mainCharData.stats.craftingSkills.Tailor.rank;

    mainChar.stats.craftingSkills.Trapmaking.id = mainCharData.stats.craftingSkills.Trapmaking.id;
    mainChar.stats.craftingSkills.Trapmaking.baseModifier = mainCharData.stats.craftingSkills.Trapmaking.baseModifier;
    mainChar.stats.craftingSkills.Trapmaking.gearPointsModifier = mainCharData.stats.craftingSkills.Trapmaking.gearPointsModifier;
    mainChar.stats.craftingSkills.Trapmaking.cpCount = mainCharData.stats.craftingSkills.Trapmaking.cpCount;
    mainChar.stats.craftingSkills.Trapmaking.cpMultiplier = mainCharData.stats.craftingSkills.Trapmaking.cpMultiplier;
    mainChar.stats.craftingSkills.Trapmaking.name = mainCharData.stats.craftingSkills.Trapmaking.name;
    mainChar.stats.craftingSkills.Trapmaking.capModifier = mainCharData.stats.craftingSkills.Trapmaking.capModifier;
    mainChar.stats.craftingSkills.Trapmaking.isCustom = mainCharData.stats.craftingSkills.Trapmaking.isCustom;
    mainChar.stats.craftingSkills.Trapmaking.isAddedToList = mainCharData.stats.craftingSkills.Trapmaking.isAddedToList;
    mainChar.stats.craftingSkills.Trapmaking.skillType = mainCharData.stats.craftingSkills.Trapmaking.skillType;
    mainChar.stats.craftingSkills.Trapmaking.rank = mainCharData.stats.craftingSkills.Trapmaking.rank;

    mainChar.stats.craftingSkills.Engineering.id = mainCharData.stats.craftingSkills.Engineering.id;
    mainChar.stats.craftingSkills.Engineering.baseModifier = mainCharData.stats.craftingSkills.Engineering.baseModifier;
    mainChar.stats.craftingSkills.Engineering.gearPointsModifier = mainCharData.stats.craftingSkills.Engineering.gearPointsModifier;
    mainChar.stats.craftingSkills.Engineering.cpCount = mainCharData.stats.craftingSkills.Engineering.cpCount;
    mainChar.stats.craftingSkills.Engineering.cpMultiplier = mainCharData.stats.craftingSkills.Engineering.cpMultiplier;
    mainChar.stats.craftingSkills.Engineering.name = mainCharData.stats.craftingSkills.Engineering.name;
    mainChar.stats.craftingSkills.Engineering.capModifier = mainCharData.stats.craftingSkills.Engineering.capModifier;
    mainChar.stats.craftingSkills.Engineering.isCustom = mainCharData.stats.craftingSkills.Engineering.isCustom;
    mainChar.stats.craftingSkills.Engineering.isAddedToList = mainCharData.stats.craftingSkills.Engineering.isAddedToList;
    mainChar.stats.craftingSkills.Engineering.skillType = mainCharData.stats.craftingSkills.Engineering.skillType;
    mainChar.stats.craftingSkills.Engineering.rank = mainCharData.stats.craftingSkills.Engineering.rank;
    //PerformSkills
    mainChar.stats.performSkills.Acting.id = mainCharData.stats.performSkills.Acting.id;
    mainChar.stats.performSkills.Acting.baseModifier = mainCharData.stats.performSkills.Acting.baseModifier;
    mainChar.stats.performSkills.Acting.gearPointsModifier = mainCharData.stats.performSkills.Acting.gearPointsModifier;
    mainChar.stats.performSkills.Acting.cpCount = mainCharData.stats.performSkills.Acting.cpCount;
    mainChar.stats.performSkills.Acting.cpMultiplier = mainCharData.stats.performSkills.Acting.cpMultiplier;
    mainChar.stats.performSkills.Acting.name = mainCharData.stats.performSkills.Acting.name;
    mainChar.stats.performSkills.Acting.capModifier = mainCharData.stats.performSkills.Acting.capModifier;
    mainChar.stats.performSkills.Acting.isCustom = mainCharData.stats.performSkills.Acting.isCustom;
    mainChar.stats.performSkills.Acting.isAddedToList = mainCharData.stats.performSkills.Acting.isAddedToList;
    mainChar.stats.performSkills.Acting.skillType = mainCharData.stats.performSkills.Acting.skillType;
    mainChar.stats.performSkills.Acting.rank = mainCharData.stats.performSkills.Acting.rank;

    mainChar.stats.performSkills.EscapeArtist.id = mainCharData.stats.performSkills.EscapeArtist.id;
    mainChar.stats.performSkills.EscapeArtist.baseModifier = mainCharData.stats.performSkills.EscapeArtist.baseModifier;
    mainChar.stats.performSkills.EscapeArtist.gearPointsModifier = mainCharData.stats.performSkills.EscapeArtist.gearPointsModifier;
    mainChar.stats.performSkills.EscapeArtist.cpCount = mainCharData.stats.performSkills.EscapeArtist.cpCount;
    mainChar.stats.performSkills.EscapeArtist.cpMultiplier = mainCharData.stats.performSkills.EscapeArtist.cpMultiplier;
    mainChar.stats.performSkills.EscapeArtist.name = mainCharData.stats.performSkills.EscapeArtist.name;
    mainChar.stats.performSkills.EscapeArtist.capModifier = mainCharData.stats.performSkills.EscapeArtist.capModifier;
    mainChar.stats.performSkills.EscapeArtist.isCustom = mainCharData.stats.performSkills.EscapeArtist.isCustom;
    mainChar.stats.performSkills.EscapeArtist.isAddedToList = mainCharData.stats.performSkills.EscapeArtist.isAddedToList;
    mainChar.stats.performSkills.EscapeArtist.skillType = mainCharData.stats.performSkills.EscapeArtist.skillType;
    mainChar.stats.performSkills.EscapeArtist.rank = mainCharData.stats.performSkills.EscapeArtist.rank;

    mainChar.stats.performSkills.SleightOfHand.id = mainCharData.stats.performSkills.SleightOfHand.id;
    mainChar.stats.performSkills.SleightOfHand.baseModifier = mainCharData.stats.performSkills.SleightOfHand.baseModifier;
    mainChar.stats.performSkills.SleightOfHand.gearPointsModifier = mainCharData.stats.performSkills.SleightOfHand.gearPointsModifier;
    mainChar.stats.performSkills.SleightOfHand.cpCount = mainCharData.stats.performSkills.SleightOfHand.cpCount;
    mainChar.stats.performSkills.SleightOfHand.cpMultiplier = mainCharData.stats.performSkills.SleightOfHand.cpMultiplier;
    mainChar.stats.performSkills.SleightOfHand.name = mainCharData.stats.performSkills.SleightOfHand.name;
    mainChar.stats.performSkills.SleightOfHand.capModifier = mainCharData.stats.performSkills.SleightOfHand.capModifier;
    mainChar.stats.performSkills.SleightOfHand.isCustom = mainCharData.stats.performSkills.SleightOfHand.isCustom;
    mainChar.stats.performSkills.SleightOfHand.isAddedToList = mainCharData.stats.performSkills.SleightOfHand.isAddedToList;
    mainChar.stats.performSkills.SleightOfHand.skillType = mainCharData.stats.performSkills.SleightOfHand.skillType;
    mainChar.stats.performSkills.SleightOfHand.rank = mainCharData.stats.performSkills.SleightOfHand.rank;
    //Skills
    mainChar.stats.skills.Hide.id = mainCharData.stats.skills.Hide.id;
    mainChar.stats.skills.Hide.name = mainCharData.stats.skills.Hide.name;
    mainChar.stats.skills.Hide.baseModifier = mainCharData.stats.skills.Hide.baseModifier;
    mainChar.stats.skills.Hide.gearPointsModifier = mainCharData.stats.skills.Hide.gearPointsModifier;
    mainChar.stats.skills.Hide.cpCount = mainCharData.stats.skills.Hide.cpCount;
    mainChar.stats.skills.Hide.cpMultiplier = mainCharData.stats.skills.Hide.cpMultiplier;
    mainChar.stats.skills.Hide.capModifier = mainCharData.stats.skills.Hide.capModifier;
    mainChar.stats.skills.Hide.isCustom = mainCharData.stats.skills.Hide.isCustom;
    mainChar.stats.skills.Hide.skillType = mainCharData.stats.skills.Hide.skillType;
    mainChar.stats.skills.Hide.rank = mainCharData.stats.skills.Hide.rank;

    mainChar.stats.skills.MoveSilently.id = mainCharData.stats.skills.MoveSilently.id;
    mainChar.stats.skills.MoveSilently.name = mainCharData.stats.skills.MoveSilently.name;
    mainChar.stats.skills.MoveSilently.baseModifier = mainCharData.stats.skills.MoveSilently.baseModifier;
    mainChar.stats.skills.MoveSilently.gearPointsModifier = mainCharData.stats.skills.MoveSilently.gearPointsModifier;
    mainChar.stats.skills.MoveSilently.cpCount = mainCharData.stats.skills.MoveSilently.cpCount;
    mainChar.stats.skills.MoveSilently.cpMultiplier = mainCharData.stats.skills.MoveSilently.cpMultiplier;
    mainChar.stats.skills.MoveSilently.capModifier = mainCharData.stats.skills.MoveSilently.capModifier;
    mainChar.stats.skills.MoveSilently.isCustom = mainCharData.stats.skills.MoveSilently.isCustom;
    mainChar.stats.skills.MoveSilently.skillType = mainCharData.stats.skills.MoveSilently.skillType;
    mainChar.stats.skills.MoveSilently.rank = mainCharData.stats.skills.MoveSilently.rank;

    mainChar.stats.skills.Disguise.id = mainCharData.stats.skills.Disguise.id;
    mainChar.stats.skills.Disguise.name = mainCharData.stats.skills.Disguise.name;
    mainChar.stats.skills.Disguise.baseModifier = mainCharData.stats.skills.Disguise.baseModifier;
    mainChar.stats.skills.Disguise.gearPointsModifier = mainCharData.stats.skills.Disguise.gearPointsModifier;
    mainChar.stats.skills.Disguise.cpCount = mainCharData.stats.skills.Disguise.cpCount;
    mainChar.stats.skills.Disguise.cpMultiplier = mainCharData.stats.skills.Disguise.cpMultiplier;
    mainChar.stats.skills.Disguise.capModifier = mainCharData.stats.skills.Disguise.capModifier;
    mainChar.stats.skills.Disguise.isCustom = mainCharData.stats.skills.Disguise.isCustom;
    mainChar.stats.skills.Disguise.skillType = mainCharData.stats.skills.Disguise.skillType;
    mainChar.stats.skills.Disguise.rank = mainCharData.stats.skills.Disguise.rank;

    mainChar.stats.skills.Medicine.id = mainCharData.stats.skills.Medicine.id;
    mainChar.stats.skills.Medicine.name = mainCharData.stats.skills.Medicine.name;
    mainChar.stats.skills.Medicine.baseModifier = mainCharData.stats.skills.Medicine.baseModifier;
    mainChar.stats.skills.Medicine.gearPointsModifier = mainCharData.stats.skills.Medicine.gearPointsModifier;
    mainChar.stats.skills.Medicine.cpCount = mainCharData.stats.skills.Medicine.cpCount;
    mainChar.stats.skills.Medicine.cpMultiplier = mainCharData.stats.skills.Medicine.cpMultiplier;
    mainChar.stats.skills.Medicine.capModifier = mainCharData.stats.skills.Medicine.capModifier;
    mainChar.stats.skills.Medicine.isCustom = mainCharData.stats.skills.Medicine.isCustom;
    mainChar.stats.skills.Medicine.skillType = mainCharData.stats.skills.Medicine.skillType;
    mainChar.stats.skills.Medicine.rank = mainCharData.stats.skills.Medicine.rank;

    mainChar.stats.skills.Survival.id = mainCharData.stats.skills.Survival.id;
    mainChar.stats.skills.Survival.name = mainCharData.stats.skills.Survival.name;
    mainChar.stats.skills.Survival.baseModifier = mainCharData.stats.skills.Survival.baseModifier;
    mainChar.stats.skills.Survival.gearPointsModifier = mainCharData.stats.skills.Survival.gearPointsModifier;
    mainChar.stats.skills.Survival.cpCount = mainCharData.stats.skills.Survival.cpCount;
    mainChar.stats.skills.Survival.cpMultiplier = mainCharData.stats.skills.Survival.cpMultiplier;
    mainChar.stats.skills.Survival.capModifier = mainCharData.stats.skills.Survival.capModifier;
    mainChar.stats.skills.Survival.isCustom = mainCharData.stats.skills.Survival.isCustom;
    mainChar.stats.skills.Survival.skillType = mainCharData.stats.skills.Survival.skillType;
    mainChar.stats.skills.Survival.rank = mainCharData.stats.skills.Survival.rank;

    mainChar.stats.skills.Track.id = mainCharData.stats.skills.Track.id;
    mainChar.stats.skills.Track.name = mainCharData.stats.skills.Track.name;
    mainChar.stats.skills.Track.baseModifier = mainCharData.stats.skills.Track.baseModifier;
    mainChar.stats.skills.Track.gearPointsModifier = mainCharData.stats.skills.Track.gearPointsModifier;
    mainChar.stats.skills.Track.cpCount = mainCharData.stats.skills.Track.cpCount;
    mainChar.stats.skills.Track.cpMultiplier = mainCharData.stats.skills.Track.cpMultiplier;
    mainChar.stats.skills.Track.capModifier = mainCharData.stats.skills.Track.capModifier;
    mainChar.stats.skills.Track.isCustom = mainCharData.stats.skills.Track.isCustom;
    mainChar.stats.skills.Track.skillType = mainCharData.stats.skills.Track.skillType;
    mainChar.stats.skills.Track.rank = mainCharData.stats.skills.Track.rank;

    mainChar.stats.skills.Flight.id = mainCharData.stats.skills.Flight.id;
    mainChar.stats.skills.Flight.name = mainCharData.stats.skills.Flight.name;
    mainChar.stats.skills.Flight.baseModifier = mainCharData.stats.skills.Flight.baseModifier;
    mainChar.stats.skills.Flight.gearPointsModifier = mainCharData.stats.skills.Flight.gearPointsModifier;
    mainChar.stats.skills.Flight.cpCount = mainCharData.stats.skills.Flight.cpCount;
    mainChar.stats.skills.Flight.cpMultiplier = mainCharData.stats.skills.Flight.cpMultiplier;
    mainChar.stats.skills.Flight.capModifier = mainCharData.stats.skills.Flight.capModifier;
    mainChar.stats.skills.Flight.isCustom = mainCharData.stats.skills.Flight.isCustom;
    mainChar.stats.skills.Flight.skillType = mainCharData.stats.skills.Flight.skillType;
    mainChar.stats.skills.Flight.rank = mainCharData.stats.skills.Flight.rank;

    mainChar.stats.skills.Insight.id = mainCharData.stats.skills.Insight.id;
    mainChar.stats.skills.Insight.name = mainCharData.stats.skills.Insight.name;
    mainChar.stats.skills.Insight.baseModifier = mainCharData.stats.skills.Insight.baseModifier;
    mainChar.stats.skills.Insight.gearPointsModifier = mainCharData.stats.skills.Insight.gearPointsModifier;
    mainChar.stats.skills.Insight.cpCount = mainCharData.stats.skills.Insight.cpCount;
    mainChar.stats.skills.Insight.cpMultiplier = mainCharData.stats.skills.Insight.cpMultiplier;
    mainChar.stats.skills.Insight.capModifier = mainCharData.stats.skills.Insight.capModifier;
    mainChar.stats.skills.Insight.isCustom = mainCharData.stats.skills.Insight.isCustom;
    mainChar.stats.skills.Insight.skillType = mainCharData.stats.skills.Insight.skillType;
    mainChar.stats.skills.Insight.rank = mainCharData.stats.skills.Insight.rank;

    mainChar.stats.skills.Bluff.id = mainCharData.stats.skills.Bluff.id;
    mainChar.stats.skills.Bluff.name = mainCharData.stats.skills.Bluff.name;
    mainChar.stats.skills.Bluff.baseModifier = mainCharData.stats.skills.Bluff.baseModifier;
    mainChar.stats.skills.Bluff.gearPointsModifier = mainCharData.stats.skills.Bluff.gearPointsModifier;
    mainChar.stats.skills.Bluff.cpCount = mainCharData.stats.skills.Bluff.cpCount;
    mainChar.stats.skills.Bluff.cpMultiplier = mainCharData.stats.skills.Bluff.cpMultiplier;
    mainChar.stats.skills.Bluff.capModifier = mainCharData.stats.skills.Bluff.capModifier;
    mainChar.stats.skills.Bluff.isCustom = mainCharData.stats.skills.Bluff.isCustom;
    mainChar.stats.skills.Bluff.skillType = mainCharData.stats.skills.Bluff.skillType;
    mainChar.stats.skills.Bluff.rank = mainCharData.stats.skills.Bluff.rank;

    mainChar.stats.skills.Diplomacy.id = mainCharData.stats.skills.Diplomacy.id;
    mainChar.stats.skills.Diplomacy.name = mainCharData.stats.skills.Diplomacy.name;
    mainChar.stats.skills.Diplomacy.baseModifier = mainCharData.stats.skills.Diplomacy.baseModifier;
    mainChar.stats.skills.Diplomacy.gearPointsModifier = mainCharData.stats.skills.Diplomacy.gearPointsModifier;
    mainChar.stats.skills.Diplomacy.cpCount = mainCharData.stats.skills.Diplomacy.cpCount;
    mainChar.stats.skills.Diplomacy.cpMultiplier = mainCharData.stats.skills.Diplomacy.cpMultiplier;
    mainChar.stats.skills.Diplomacy.capModifier = mainCharData.stats.skills.Diplomacy.capModifier;
    mainChar.stats.skills.Diplomacy.isCustom = mainCharData.stats.skills.Diplomacy.isCustom;
    mainChar.stats.skills.Diplomacy.skillType = mainCharData.stats.skills.Diplomacy.skillType;
    mainChar.stats.skills.Diplomacy.rank = mainCharData.stats.skills.Diplomacy.rank;

    mainChar.stats.skills.Intimidate.id = mainCharData.stats.skills.Intimidate.id;
    mainChar.stats.skills.Intimidate.name = mainCharData.stats.skills.Intimidate.name;
    mainChar.stats.skills.Intimidate.baseModifier = mainCharData.stats.skills.Intimidate.baseModifier;
    mainChar.stats.skills.Intimidate.gearPointsModifier = mainCharData.stats.skills.Intimidate.gearPointsModifier;
    mainChar.stats.skills.Intimidate.cpCount = mainCharData.stats.skills.Intimidate.cpCount;
    mainChar.stats.skills.Intimidate.cpMultiplier = mainCharData.stats.skills.Intimidate.cpMultiplier;
    mainChar.stats.skills.Intimidate.capModifier = mainCharData.stats.skills.Intimidate.capModifier;
    mainChar.stats.skills.Intimidate.isCustom = mainCharData.stats.skills.Intimidate.isCustom;
    mainChar.stats.skills.Intimidate.skillType = mainCharData.stats.skills.Intimidate.skillType;
    mainChar.stats.skills.Intimidate.rank = mainCharData.stats.skills.Intimidate.rank;

    mainChar.stats.skills.PickLock.id = mainCharData.stats.skills.PickLock.id;
    mainChar.stats.skills.PickLock.name = mainCharData.stats.skills.PickLock.name;
    mainChar.stats.skills.PickLock.baseModifier = mainCharData.stats.skills.PickLock.baseModifier;
    mainChar.stats.skills.PickLock.gearPointsModifier = mainCharData.stats.skills.PickLock.gearPointsModifier;
    mainChar.stats.skills.PickLock.cpCount = mainCharData.stats.skills.PickLock.cpCount;
    mainChar.stats.skills.PickLock.cpMultiplier = mainCharData.stats.skills.PickLock.cpMultiplier;
    mainChar.stats.skills.PickLock.capModifier = mainCharData.stats.skills.PickLock.capModifier;
    mainChar.stats.skills.PickLock.isCustom = mainCharData.stats.skills.PickLock.isCustom;
    mainChar.stats.skills.PickLock.skillType = mainCharData.stats.skills.PickLock.skillType;
    mainChar.stats.skills.PickLock.rank = mainCharData.stats.skills.PickLock.rank;

    mainChar.stats.skills.PickPocket.id = mainCharData.stats.skills.PickPocket.id;
    mainChar.stats.skills.PickPocket.name = mainCharData.stats.skills.PickPocket.name;
    mainChar.stats.skills.PickPocket.baseModifier = mainCharData.stats.skills.PickPocket.baseModifier;
    mainChar.stats.skills.PickPocket.gearPointsModifier = mainCharData.stats.skills.PickPocket.gearPointsModifier;
    mainChar.stats.skills.PickPocket.cpCount = mainCharData.stats.skills.PickPocket.cpCount;
    mainChar.stats.skills.PickPocket.cpMultiplier = mainCharData.stats.skills.PickPocket.cpMultiplier;
    mainChar.stats.skills.PickPocket.capModifier = mainCharData.stats.skills.PickPocket.capModifier;
    mainChar.stats.skills.PickPocket.isCustom = mainCharData.stats.skills.PickPocket.isCustom;
    mainChar.stats.skills.PickPocket.skillType = mainCharData.stats.skills.PickPocket.skillType;
    mainChar.stats.skills.PickPocket.rank = mainCharData.stats.skills.PickPocket.rank;

    mainChar.stats.ap = mainCharData.stats.ap;
    mainChar.stats.apModifier = mainCharData.stats.apModifier;
    mainChar.stats.encumbranceLevel = mainCharData.stats.encumbranceLevel;
    mainChar.stats.dive = mainCharData.stats.dive;
    mainChar.stats.spaceLength = mainCharData.stats.spaceLength;
    mainChar.stats.spaceWidth = mainCharData.stats.spaceWidth;
    mainChar.stats.carryCapacity = mainCharData.stats.carryCapacity;
    mainChar.stats.carryCapacityModifier = mainCharData.stats.carryCapacityModifier;
    mainChar.stats.quickStep = mainCharData.stats.quickStep;
    mainChar.stats.quickStepModifier = mainCharData.stats.quickStepModifier;
    mainChar.stats.OTAs = mainCharData.stats.OTAs;
    mainChar.stats.OTAsModifier = mainCharData.stats.OTAsModifier;
    mainChar.stats.maxHPGearModifier = mainCharData.stats.maxHPGearModifier;
    mainChar.stats.maxStaminaGearModifier = mainCharData.stats.maxStaminaGearModifier;
    mainChar.stats.maxManaGearModifier = mainCharData.stats.maxManaGearModifier;
    mainChar.stats.accuracyGearModifier = mainCharData.stats.accuracyGearModifier;
    mainChar.stats.parryGearModifier = mainCharData.stats.parryGearModifier;
    mainChar.stats.damageGearModifier = mainCharData.stats.damageGearModifier;
    mainChar.stats.carryCapacityGearModifier = mainCharData.stats.carryCapacityGearModifier;
    mainChar.stats.quickStepGearModifier = mainCharData.stats.quickStepGearModifier;
    mainChar.stats.OTAsGearModifier = mainCharData.stats.OTAsGearModifier;
    mainChar.stats.breathe = mainCharData.stats.breathe;

    // <---------------------- MainChar CPStats ---------------------->
    mainChar.cpStats.carryCapacity = mainCharData.cpStats.carryCapacity;
    mainChar.cpStats.carryCapacityCount = mainCharData.cpStats.carryCapacityCount;
    mainChar.cpStats.carryCapacityCap = mainCharData.cpStats.carryCapacityCap;
    mainChar.cpStats.OTAs = mainCharData.cpStats.OTAs;
    mainChar.cpStats.OTAsCount = mainCharData.cpStats.OTAsCount;
    mainChar.cpStats.OTAsCap = mainCharData.cpStats.OTAsCap;
    mainChar.cpStats.quickStep = mainCharData.cpStats.quickStep;
    mainChar.cpStats.quickStepCount = mainCharData.cpStats.quickStepCount;
    mainChar.cpStats.quickStepCap = mainCharData.cpStats.quickStepCap;
    mainChar.cpStats.strength = mainCharData.cpStats.strength;
    mainChar.cpStats.strengthCount = mainCharData.cpStats.strengthCount;
    mainChar.cpStats.strengthCap = mainCharData.cpStats.strengthCap;
    mainChar.cpStats.agility = mainCharData.cpStats.agility;
    mainChar.cpStats.agilityCount = mainCharData.cpStats.agilityCount;
    mainChar.cpStats.agilityCap = mainCharData.cpStats.agilityCap;
    mainChar.cpStats.discipline = mainCharData.cpStats.discipline;
    mainChar.cpStats.disciplineCount = mainCharData.cpStats.disciplineCount;
    mainChar.cpStats.disciplineCap = mainCharData.cpStats.disciplineCap;
    mainChar.cpStats.intelligence = mainCharData.cpStats.intelligence;
    mainChar.cpStats.intelligenceCount = mainCharData.cpStats.intelligenceCount;
    mainChar.cpStats.intelligenceCap = mainCharData.cpStats.intelligenceCap;
    mainChar.cpStats.conviction = mainCharData.cpStats.conviction;
    mainChar.cpStats.convictionCount = mainCharData.cpStats.convictionCount;
    mainChar.cpStats.convictionCap = mainCharData.cpStats.convictionCap;
    mainChar.cpStats.attunement = mainCharData.cpStats.attunement;
    mainChar.cpStats.attunementCount = mainCharData.cpStats.attunementCount;
    mainChar.cpStats.attunementCap = mainCharData.cpStats.attunementCap;
    mainChar.cpStats.constitution = mainCharData.cpStats.constitution;
    mainChar.cpStats.constitutionCount = mainCharData.cpStats.constitutionCount;
    mainChar.cpStats.constitutionCap = mainCharData.cpStats.constitutionCap;
    mainChar.cpStats.maxHP = mainCharData.cpStats.maxHP;
    mainChar.cpStats.maxHPCount = mainCharData.cpStats.maxHPCount;
    mainChar.cpStats.maxHPCap = mainCharData.cpStats.maxHPCap;
    mainChar.cpStats.maxHPCapUpgrade = mainCharData.cpStats.maxHPCapUpgrade;
    mainChar.cpStats.maxMana = mainCharData.cpStats.maxMana;
    mainChar.cpStats.maxManaCount = mainCharData.cpStats.maxManaCount;
    mainChar.cpStats.maxManaCap = mainCharData.cpStats.maxManaCap;
    mainChar.cpStats.maxManaCapUpgrade = mainCharData.cpStats.maxManaCapUpgrade;
    mainChar.cpStats.maxStamina = mainCharData.cpStats.maxStamina;
    mainChar.cpStats.maxStaminaCount = mainCharData.cpStats.maxStaminaCount;
    mainChar.cpStats.maxStaminaCap = mainCharData.cpStats.maxStaminaCap;
    mainChar.cpStats.maxStaminaCapUpgrade = mainCharData.cpStats.maxStaminaCapUpgrade;
    mainChar.cpStats.accuracy = mainCharData.cpStats.accuracy;
    mainChar.cpStats.accuracyCount = mainCharData.cpStats.accuracyCount;
    mainChar.cpStats.accuracyCap = mainCharData.cpStats.accuracyCap;
    mainChar.cpStats.accuracyCapUpgrade = mainCharData.cpStats.accuracyCapUpgrade;
    mainChar.cpStats.parry = mainCharData.cpStats.parry;
    mainChar.cpStats.parryCount = mainCharData.cpStats.parryCount;
    mainChar.cpStats.parryCap = mainCharData.cpStats.parryCap;
    mainChar.cpStats.parryCapUpgrade = mainCharData.cpStats.parryCapUpgrade;
    mainChar.cpStats.damage = mainCharData.cpStats.damage;
    mainChar.cpStats.damageCount = mainCharData.cpStats.damageCount;
    mainChar.cpStats.damageCap = mainCharData.cpStats.damageCap;
    mainChar.cpStats.damageCapUpgrade = mainCharData.cpStats.damageCapUpgrade;

    // <---------------------- MainChar Gear ---------------------->
    mainChar.gear.totalWeight = mainCharData.gear.totalWeight;

    // Weapons
    for (let i = 0; i < mainCharData.gear.weapons.length; ++i) {
        let _newWeapon = new Weapon();
        _newWeapon.id = mainCharData.gear.weapons[i].id;
        _newWeapon.isEquipped = mainCharData.gear.weapons[i].isEquipped;
        _newWeapon.name = mainCharData.gear.weapons[i].name;
        _newWeapon.type = mainCharData.gear.weapons[i].type;
        _newWeapon.size = mainCharData.gear.weapons[i].size;
        _newWeapon.tier = mainCharData.gear.weapons[i].tier;
        _newWeapon.accProf = mainCharData.gear.weapons[i].accProf;
        _newWeapon.parryProf = mainCharData.gear.weapons[i].parryProf;
        _newWeapon.critChance = mainCharData.gear.weapons[i].critChance;
        _newWeapon.critDamage = mainCharData.gear.weapons[i].critDamage;
        _newWeapon.damage = mainCharData.gear.weapons[i].damage;
        _newWeapon.range = mainCharData.gear.weapons[i].range;
        _newWeapon.damageType = mainCharData.gear.weapons[i].damageType;

        // Qualities
        for (let j = 0; j < mainCharData.gear.weapons[i].qualities.length; ++j) {
            let qualityToBeLoaded = mainCharData.gear.weapons[i].qualities[j];
            let gearQualityChoice = getGearQualityByName(qualityToBeLoaded.name);

            let _newQuality = newGearQuality(gearQualityChoice, qualityToBeLoaded.value, _newWeapon, qualityToBeLoaded.name, true);
            _newQuality.id = qualityToBeLoaded.id;
            _newQuality.name = qualityToBeLoaded.name;
            _newQuality.value = qualityToBeLoaded.value;
            _newQuality.selectedIndexArray = qualityToBeLoaded.selectedIndexArray;

            _newWeapon.addQuality(_newQuality);
        }

        mainChar.gear.weapons.push(_newWeapon);
    }
    // Equipments
    mainChar.gear.equipments.armor.id = mainCharData.gear.equipments.armor.id;
    mainChar.gear.equipments.armor.name = mainCharData.gear.equipments.armor.name;
    mainChar.gear.equipments.armor.specialQuality = mainCharData.gear.equipments.armor.specialQuality;
    mainChar.gear.equipments.armor.cpForDamageReductions = mainCharData.gear.equipments.armor.cpForDamageReductions;
    mainChar.gear.equipments.armor.weight = mainCharData.gear.equipments.armor.weight;
    mainChar.gear.equipments.armor.type = mainCharData.gear.equipments.armor.type;
    for (let i = 0; i < mainCharData.gear.equipments.armor.qualities.length; ++i) {
        let qualityToBeLoaded = mainCharData.gear.equipments.armor.qualities[i];
        let gearQualityChoice = getGearQualityByName(qualityToBeLoaded.name);

        let _newQuality = newGearQuality(gearQualityChoice, qualityToBeLoaded.value, mainChar.gear.equipments.armor, qualityToBeLoaded.name, true);
        _newQuality.id = qualityToBeLoaded.id;
        _newQuality.name = qualityToBeLoaded.name;
        _newQuality.value = qualityToBeLoaded.value;
        _newQuality.selectedIndexArray = qualityToBeLoaded.selectedIndexArray;

        mainChar.gear.equipments.armor.addQuality(_newQuality);
    }

    mainChar.gear.equipments.head.id = mainCharData.gear.equipments.head.id;
    mainChar.gear.equipments.head.name = mainCharData.gear.equipments.head.name;
    mainChar.gear.equipments.head.specialQuality = mainCharData.gear.equipments.head.specialQuality;
    mainChar.gear.equipments.head.cpForDamageReductions = mainCharData.gear.equipments.head.cpForDamageReductions;
    mainChar.gear.equipments.head.weight = mainCharData.gear.equipments.head.weight;
    mainChar.gear.equipments.head.type = mainCharData.gear.equipments.head.type;
    for (let i = 0; i < mainCharData.gear.equipments.head.qualities.length; ++i) {
        let qualityToBeLoaded = mainCharData.gear.equipments.head.qualities[i];
        let gearQualityChoice = getGearQualityByName(qualityToBeLoaded.name);

        let _newQuality = newGearQuality(gearQualityChoice, qualityToBeLoaded.value, mainChar.gear.equipments.head, qualityToBeLoaded.name, true);
        _newQuality.id = qualityToBeLoaded.id;
        _newQuality.name = qualityToBeLoaded.name;
        _newQuality.value = qualityToBeLoaded.value;
        _newQuality.selectedIndexArray = qualityToBeLoaded.selectedIndexArray;

        mainChar.gear.equipments.head.addQuality(_newQuality);
    }

    mainChar.gear.equipments.waist.id = mainCharData.gear.equipments.waist.id;
    mainChar.gear.equipments.waist.name = mainCharData.gear.equipments.waist.name;
    mainChar.gear.equipments.waist.specialQuality = mainCharData.gear.equipments.waist.specialQuality;
    mainChar.gear.equipments.waist.cpForDamageReductions = mainCharData.gear.equipments.waist.cpForDamageReductions;
    mainChar.gear.equipments.waist.weight = mainCharData.gear.equipments.waist.weight;
    mainChar.gear.equipments.waist.type = mainCharData.gear.equipments.waist.type;
    for (let i = 0; i < mainCharData.gear.equipments.waist.qualities.length; ++i) {
        let qualityToBeLoaded = mainCharData.gear.equipments.waist.qualities[i];
        let gearQualityChoice = getGearQualityByName(qualityToBeLoaded.name);

        let _newQuality = newGearQuality(gearQualityChoice, qualityToBeLoaded.value, mainChar.gear.equipments.waist, qualityToBeLoaded.name, true);
        _newQuality.id = qualityToBeLoaded.id;
        _newQuality.name = qualityToBeLoaded.name;
        _newQuality.value = qualityToBeLoaded.value;
        _newQuality.selectedIndexArray = qualityToBeLoaded.selectedIndexArray;

        mainChar.gear.equipments.waist.addQuality(_newQuality);
    }

    mainChar.gear.equipments.eyes.id = mainCharData.gear.equipments.eyes.id;
    mainChar.gear.equipments.eyes.name = mainCharData.gear.equipments.eyes.name;
    mainChar.gear.equipments.eyes.specialQuality = mainCharData.gear.equipments.eyes.specialQuality;
    mainChar.gear.equipments.eyes.cpForDamageReductions = mainCharData.gear.equipments.eyes.cpForDamageReductions;
    mainChar.gear.equipments.eyes.weight = mainCharData.gear.equipments.eyes.weight;
    mainChar.gear.equipments.eyes.type = mainCharData.gear.equipments.eyes.type;
    for (let i = 0; i < mainCharData.gear.equipments.eyes.qualities.length; ++i) {
        let qualityToBeLoaded = mainCharData.gear.equipments.eyes.qualities[i];
        let gearQualityChoice = getGearQualityByName(qualityToBeLoaded.name);

        let _newQuality = newGearQuality(gearQualityChoice, qualityToBeLoaded.value, mainChar.gear.equipments.eyes, qualityToBeLoaded.name, true);
        _newQuality.id = qualityToBeLoaded.id;
        _newQuality.name = qualityToBeLoaded.name;
        _newQuality.value = qualityToBeLoaded.value;
        _newQuality.selectedIndexArray = qualityToBeLoaded.selectedIndexArray;

        mainChar.gear.equipments.eyes.addQuality(_newQuality);
    }

    mainChar.gear.equipments.neck.id = mainCharData.gear.equipments.neck.id;
    mainChar.gear.equipments.neck.name = mainCharData.gear.equipments.neck.name;
    mainChar.gear.equipments.neck.specialQuality = mainCharData.gear.equipments.neck.specialQuality;
    mainChar.gear.equipments.neck.cpForDamageReductions = mainCharData.gear.equipments.neck.cpForDamageReductions;
    mainChar.gear.equipments.neck.weight = mainCharData.gear.equipments.neck.weight;
    mainChar.gear.equipments.neck.type = mainCharData.gear.equipments.neck.type;
    for (let i = 0; i < mainCharData.gear.equipments.neck.qualities.length; ++i) {
        let qualityToBeLoaded = mainCharData.gear.equipments.neck.qualities[i];
        let gearQualityChoice = getGearQualityByName(qualityToBeLoaded.name);

        let _newQuality = newGearQuality(gearQualityChoice, qualityToBeLoaded.value, mainChar.gear.equipments.neck, qualityToBeLoaded.name, true);
        _newQuality.id = qualityToBeLoaded.id;
        _newQuality.name = qualityToBeLoaded.name;
        _newQuality.value = qualityToBeLoaded.value;
        _newQuality.selectedIndexArray = qualityToBeLoaded.selectedIndexArray;

        mainChar.gear.equipments.neck.addQuality(_newQuality);
    }

    mainChar.gear.equipments.back.id = mainCharData.gear.equipments.back.id;
    mainChar.gear.equipments.back.name = mainCharData.gear.equipments.back.name;
    mainChar.gear.equipments.back.specialQuality = mainCharData.gear.equipments.back.specialQuality;
    mainChar.gear.equipments.back.cpForDamageReductions = mainCharData.gear.equipments.back.cpForDamageReductions;
    mainChar.gear.equipments.back.weight = mainCharData.gear.equipments.back.weight;
    mainChar.gear.equipments.back.type = mainCharData.gear.equipments.back.type;
    for (let i = 0; i < mainCharData.gear.equipments.back.qualities.length; ++i) {
        let qualityToBeLoaded = mainCharData.gear.equipments.back.qualities[i];
        let gearQualityChoice = getGearQualityByName(qualityToBeLoaded.name);

        let _newQuality = newGearQuality(gearQualityChoice, qualityToBeLoaded.value, mainChar.gear.equipments.back, qualityToBeLoaded.name, true);
        _newQuality.id = qualityToBeLoaded.id;
        _newQuality.name = qualityToBeLoaded.name;
        _newQuality.value = qualityToBeLoaded.value;
        _newQuality.selectedIndexArray = qualityToBeLoaded.selectedIndexArray;

        mainChar.gear.equipments.back.addQuality(_newQuality);
    }

    mainChar.gear.equipments.arms.id = mainCharData.gear.equipments.arms.id;
    mainChar.gear.equipments.arms.name = mainCharData.gear.equipments.arms.name;
    mainChar.gear.equipments.arms.specialQuality = mainCharData.gear.equipments.arms.specialQuality;
    mainChar.gear.equipments.arms.cpForDamageReductions = mainCharData.gear.equipments.arms.cpForDamageReductions;
    mainChar.gear.equipments.arms.weight = mainCharData.gear.equipments.arms.weight;
    mainChar.gear.equipments.arms.type = mainCharData.gear.equipments.arms.type;
    for (let i = 0; i < mainCharData.gear.equipments.arms.qualities.length; ++i) {
        let qualityToBeLoaded = mainCharData.gear.equipments.arms.qualities[i];
        let gearQualityChoice = getGearQualityByName(qualityToBeLoaded.name);

        let _newQuality = newGearQuality(gearQualityChoice, qualityToBeLoaded.value, mainChar.gear.equipments.arms, qualityToBeLoaded.name, true);
        _newQuality.id = qualityToBeLoaded.id;
        _newQuality.name = qualityToBeLoaded.name;
        _newQuality.value = qualityToBeLoaded.value;
        _newQuality.selectedIndexArray = qualityToBeLoaded.selectedIndexArray;

        mainChar.gear.equipments.arms.addQuality(_newQuality);
    }

    mainChar.gear.equipments.hands.id = mainCharData.gear.equipments.hands.id;
    mainChar.gear.equipments.hands.name = mainCharData.gear.equipments.hands.name;
    mainChar.gear.equipments.hands.specialQuality = mainCharData.gear.equipments.hands.specialQuality;
    mainChar.gear.equipments.hands.cpForDamageReductions = mainCharData.gear.equipments.hands.cpForDamageReductions;
    mainChar.gear.equipments.hands.weight = mainCharData.gear.equipments.hands.weight;
    mainChar.gear.equipments.hands.type = mainCharData.gear.equipments.hands.type;
    for (let i = 0; i < mainCharData.gear.equipments.hands.qualities.length; ++i) {
        let qualityToBeLoaded = mainCharData.gear.equipments.hands.qualities[i];
        let gearQualityChoice = getGearQualityByName(qualityToBeLoaded.name);

        let _newQuality = newGearQuality(gearQualityChoice, qualityToBeLoaded.value, mainChar.gear.equipments.hands, qualityToBeLoaded.name, true);
        _newQuality.id = qualityToBeLoaded.id;
        _newQuality.name = qualityToBeLoaded.name;
        _newQuality.value = qualityToBeLoaded.value;
        _newQuality.selectedIndexArray = qualityToBeLoaded.selectedIndexArray;

        mainChar.gear.equipments.hands.addQuality(_newQuality);
    }

    mainChar.gear.equipments.feet.id = mainCharData.gear.equipments.feet.id;
    mainChar.gear.equipments.feet.name = mainCharData.gear.equipments.feet.name;
    mainChar.gear.equipments.feet.specialQuality = mainCharData.gear.equipments.feet.specialQuality;
    mainChar.gear.equipments.feet.cpForDamageReductions = mainCharData.gear.equipments.feet.cpForDamageReductions;
    mainChar.gear.equipments.feet.weight = mainCharData.gear.equipments.feet.weight;
    mainChar.gear.equipments.feet.type = mainCharData.gear.equipments.feet.type;
    for (let i = 0; i < mainCharData.gear.equipments.feet.qualities.length; ++i) {
        let qualityToBeLoaded = mainCharData.gear.equipments.feet.qualities[i];
        let gearQualityChoice = getGearQualityByName(qualityToBeLoaded.name);

        let _newQuality = newGearQuality(gearQualityChoice, qualityToBeLoaded.value, mainChar.gear.equipments.feet, qualityToBeLoaded.name, true);
        _newQuality.id = qualityToBeLoaded.id;
        _newQuality.name = qualityToBeLoaded.name;
        _newQuality.value = qualityToBeLoaded.value;
        _newQuality.selectedIndexArray = qualityToBeLoaded.selectedIndexArray;

        mainChar.gear.equipments.feet.addQuality(_newQuality);
    }

    mainChar.gear.equipments.undergarment.id = mainCharData.gear.equipments.undergarment.id;
    mainChar.gear.equipments.undergarment.name = mainCharData.gear.equipments.undergarment.name;
    mainChar.gear.equipments.undergarment.specialQuality = mainCharData.gear.equipments.undergarment.specialQuality;
    mainChar.gear.equipments.undergarment.cpForDamageReductions = mainCharData.gear.equipments.undergarment.cpForDamageReductions;
    mainChar.gear.equipments.undergarment.weight = mainCharData.gear.equipments.undergarment.weight;
    mainChar.gear.equipments.undergarment.type = mainCharData.gear.equipments.undergarment.type;
    for (let i = 0; i < mainCharData.gear.equipments.undergarment.qualities.length; ++i) {
        let qualityToBeLoaded = mainCharData.gear.equipments.undergarment.qualities[i];
        let gearQualityChoice = getGearQualityByName(qualityToBeLoaded.name);

        let _newQuality = newGearQuality(gearQualityChoice, qualityToBeLoaded.value, mainChar.gear.equipments.undergarment, qualityToBeLoaded.name, true);
        _newQuality.id = qualityToBeLoaded.id;
        _newQuality.name = qualityToBeLoaded.name;
        _newQuality.value = qualityToBeLoaded.value;
        _newQuality.selectedIndexArray = qualityToBeLoaded.selectedIndexArray;

        mainChar.gear.equipments.undergarment.addQuality(_newQuality);
    }

    mainChar.gear.equipments.ring1.id = mainCharData.gear.equipments.ring1.id;
    mainChar.gear.equipments.ring1.name = mainCharData.gear.equipments.ring1.name;
    mainChar.gear.equipments.ring1.specialQuality = mainCharData.gear.equipments.ring1.specialQuality;
    mainChar.gear.equipments.ring1.cpForDamageReductions = mainCharData.gear.equipments.ring1.cpForDamageReductions;
    mainChar.gear.equipments.ring1.weight = mainCharData.gear.equipments.ring1.weight;
    mainChar.gear.equipments.ring1.type = mainCharData.gear.equipments.ring1.type;
    for (let i = 0; i < mainCharData.gear.equipments.ring1.qualities.length; ++i) {
        let qualityToBeLoaded = mainCharData.gear.equipments.ring1.qualities[i];
        let gearQualityChoice = getGearQualityByName(qualityToBeLoaded.name);

        let _newQuality = newGearQuality(gearQualityChoice, qualityToBeLoaded.value, mainChar.gear.equipments.ring1, qualityToBeLoaded.name, true);
        _newQuality.id = qualityToBeLoaded.id;
        _newQuality.name = qualityToBeLoaded.name;
        _newQuality.value = qualityToBeLoaded.value;
        _newQuality.selectedIndexArray = qualityToBeLoaded.selectedIndexArray;

        mainChar.gear.equipments.ring1.addQuality(_newQuality);
    }

    mainChar.gear.equipments.ring2.id = mainCharData.gear.equipments.ring2.id;
    mainChar.gear.equipments.ring2.name = mainCharData.gear.equipments.ring2.name;
    mainChar.gear.equipments.ring2.specialQuality = mainCharData.gear.equipments.ring2.specialQuality;
    mainChar.gear.equipments.ring2.cpForDamageReductions = mainCharData.gear.equipments.ring2.cpForDamageReductions;
    mainChar.gear.equipments.ring2.weight = mainCharData.gear.equipments.ring2.weight;
    mainChar.gear.equipments.ring2.type = mainCharData.gear.equipments.ring2.type;
    for (let i = 0; i < mainCharData.gear.equipments.ring2.qualities.length; ++i) {
        let qualityToBeLoaded = mainCharData.gear.equipments.ring2.qualities[i];
        let gearQualityChoice = getGearQualityByName(qualityToBeLoaded.name);

        let _newQuality = newGearQuality(gearQualityChoice, qualityToBeLoaded.value, mainChar.gear.equipments.ring2, qualityToBeLoaded.name, true);
        _newQuality.id = qualityToBeLoaded.id;
        _newQuality.name = qualityToBeLoaded.name;
        _newQuality.value = qualityToBeLoaded.value;
        _newQuality.selectedIndexArray = qualityToBeLoaded.selectedIndexArray;

        mainChar.gear.equipments.ring2.addQuality(_newQuality);
    }

    mainChar.gear.equipments.floating1.id = mainCharData.gear.equipments.floating1.id;
    mainChar.gear.equipments.floating1.name = mainCharData.gear.equipments.floating1.name;
    mainChar.gear.equipments.floating1.specialQuality = mainCharData.gear.equipments.floating1.specialQuality;
    mainChar.gear.equipments.floating1.cpForDamageReductions = mainCharData.gear.equipments.floating1.cpForDamageReductions;
    mainChar.gear.equipments.floating1.weight = mainCharData.gear.equipments.floating1.weight;
    mainChar.gear.equipments.floating1.type = mainCharData.gear.equipments.floating1.type;
    for (let i = 0; i < mainCharData.gear.equipments.floating1.qualities.length; ++i) {
        let qualityToBeLoaded = mainCharData.gear.equipments.floating1.qualities[i];
        let gearQualityChoice = getGearQualityByName(qualityToBeLoaded.name);

        let _newQuality = newGearQuality(gearQualityChoice, qualityToBeLoaded.value, mainChar.gear.equipments.floating1, qualityToBeLoaded.name, true);
        _newQuality.id = qualityToBeLoaded.id;
        _newQuality.name = qualityToBeLoaded.name;
        _newQuality.value = qualityToBeLoaded.value;
        _newQuality.selectedIndexArray = qualityToBeLoaded.selectedIndexArray;

        mainChar.gear.equipments.floating1.addQuality(_newQuality);
    }

    mainChar.gear.equipments.floating2.id = mainCharData.gear.equipments.floating2.id;
    mainChar.gear.equipments.floating2.name = mainCharData.gear.equipments.floating2.name;
    mainChar.gear.equipments.floating2.specialQuality = mainCharData.gear.equipments.floating2.specialQuality;
    mainChar.gear.equipments.floating2.cpForDamageReductions = mainCharData.gear.equipments.floating2.cpForDamageReductions;
    mainChar.gear.equipments.floating2.weight = mainCharData.gear.equipments.floating2.weight;
    mainChar.gear.equipments.floating2.type = mainCharData.gear.equipments.floating2.type;
    for (let i = 0; i < mainCharData.gear.equipments.floating2.qualities.length; ++i) {
        let qualityToBeLoaded = mainCharData.gear.equipments.floating2.qualities[i];
        let gearQualityChoice = getGearQualityByName(qualityToBeLoaded.name);

        let _newQuality = newGearQuality(gearQualityChoice, qualityToBeLoaded.value, mainChar.gear.equipments.floating2, qualityToBeLoaded.name, true);
        _newQuality.id = qualityToBeLoaded.id;
        _newQuality.name = qualityToBeLoaded.name;
        _newQuality.value = qualityToBeLoaded.value;
        _newQuality.selectedIndexArray = qualityToBeLoaded.selectedIndexArray;

        mainChar.gear.equipments.floating2.addQuality(_newQuality);
    }

    mainChar.gear.equipments.floating3.id = mainCharData.gear.equipments.floating3.id;
    mainChar.gear.equipments.floating3.name = mainCharData.gear.equipments.floating3.name;
    mainChar.gear.equipments.floating3.specialQuality = mainCharData.gear.equipments.floating3.specialQuality;
    mainChar.gear.equipments.floating3.cpForDamageReductions = mainCharData.gear.equipments.floating3.cpForDamageReductions;
    mainChar.gear.equipments.floating3.weight = mainCharData.gear.equipments.floating3.weight;
    mainChar.gear.equipments.floating3.type = mainCharData.gear.equipments.floating3.type;
    for (let i = 0; i < mainCharData.gear.equipments.floating3.qualities.length; ++i) {
        let qualityToBeLoaded = mainCharData.gear.equipments.floating3.qualities[i];
        let gearQualityChoice = getGearQualityByName(qualityToBeLoaded.name);

        let _newQuality = newGearQuality(gearQualityChoice, qualityToBeLoaded.value, mainChar.gear.equipments.floating3, qualityToBeLoaded.name, true);
        _newQuality.id = qualityToBeLoaded.id;
        _newQuality.name = qualityToBeLoaded.name;
        _newQuality.value = qualityToBeLoaded.value;
        _newQuality.selectedIndexArray = qualityToBeLoaded.selectedIndexArray;

        mainChar.gear.equipments.floating3.addQuality(_newQuality);
    }

    // AddedEquipments
    for (let i = 0; i < mainCharData.gear.addedEquipments.length; ++i) {
        let _newEquipment = new Equipment();
        _newEquipment.id = mainCharData.gear.addedEquipments[i].id;
        _newEquipment.name = mainCharData.gear.addedEquipments[i].name;
        _newEquipment.specialQuality = mainCharData.gear.addedEquipments[i].specialQuality;
        _newEquipment.cpForDamageReductions = mainCharData.gear.addedEquipments[i].cpForDamageReductions;
        _newEquipment.weight = mainCharData.gear.addedEquipments[i].weight;
        _newEquipment.type = mainCharData.gear.addedEquipments[i].type;

        // Qualities
        for (let j = 0; j < mainCharData.gear.addedEquipments[i].qualities.length; ++j) {
            let qualityToBeLoaded = mainCharData.gear.addedEquipments[i].qualities[j];
            let gearQualityChoice = getGearQualityByName(qualityToBeLoaded.name);

            let _newQuality = newGearQuality(gearQualityChoice, qualityToBeLoaded.value, _newEquipment, qualityToBeLoaded.name, true);
            _newQuality.id = qualityToBeLoaded.id;
            _newQuality.name = qualityToBeLoaded.name;
            _newQuality.value = qualityToBeLoaded.value;
            _newQuality.selectedIndexArray = qualityToBeLoaded.selectedIndexArray;

            _newEquipment.addQuality(_newQuality);
        }

        mainChar.gear.addedEquipments.push(_newEquipment);
    }

    // Carryings
    for (let i = 0; i < mainCharData.gear.carryings.length; ++i) {
        let _newCarrying = mainChar.gear.newCarrying();
        _newCarrying.index = mainCharData.gear.carryings[i].index;
        _newCarrying.name = mainCharData.gear.carryings[i].name;
        _newCarrying.weight = mainCharData.gear.carryings[i].weight;
    }

    mainChar.gear.accProfPercentModifier_LeftHand = mainCharData.gear.accProfPercentModifier_LeftHand;
    mainChar.gear.parryProfPercentModifier_LeftHand = mainCharData.gear.parryProfPercentModifier_LeftHand;
    mainChar.gear.accProfPercentModifier_RightHand = mainCharData.gear.accProfPercentModifier_RightHand;
    mainChar.gear.parryProfPercentModifier_RightHand = mainCharData.gear.parryProfPercentModifier_RightHand;


    // <------------------------------ allTrainings ---------------------------->
    for (let i = 0; i < allTrainingsData.length; ++i) {
        let loaded = allTrainingsData[i];
        let _new = new Training(loaded.name, loaded.arcaneRank, loaded.points, loaded.cpCost, loaded.masterSpec, loaded.isTraining, loaded.isSwappable, loaded.splitFriend, loaded.creatureName, loaded.mvmnt, loaded.def1, loaded.def2, loaded.dr, loaded.isCustom, true);

        _new.id = loaded.id;
    }
    for (let i = 0; i < allQualitiesData.length; ++i) {
        let loaded = allQualitiesData[i];

        if (loaded.name == "Perimeter" || loaded.name == "Body Size") {
            addTrainingPoints(loaded.name, 0, loaded.cpCost, false); // BodySize and Perimeter Quality Initialization for Details Page
            continue;
        }

        let _new = new Training(loaded.name, loaded.arcaneRank, loaded.points, loaded.cpCost, loaded.masterSpec, loaded.isTraining, loaded.isSwappable, loaded.splitFriend, loaded.creatureName, loaded.mvmnt, loaded.def1, loaded.def2, loaded.dr, loaded.isCustom, true);

        _new.id = loaded.id;
    }

    // <------------------------------ allPowersArray --------------------------->
    for (let i = 0; i < allPowersArrayData.length; ++i) {
        allPowersArray[i].id = allPowersArrayData[i].id;
        allPowersArray[i].name = allPowersArrayData[i].name;
        allPowersArray[i].cpCount = allPowersArrayData[i].cpCount;
        allPowersArray[i].cpCapModifier = allPowersArrayData[i].cpCapModifier;
        allPowersArray[i].cpCost = allPowersArrayData[i].cpCost;
        allPowersArray[i].gearModifier = allPowersArrayData[i].gearModifier;
        allPowersArray[i].isShownOnList = allPowersArrayData[i].isShownOnList;
    }
    // <----------------------------- allSpecsArray ------------------------>
    for (let i = 0; i < allSpecsArrayData.length; ++i) {
        allSpecsArray[i].name = allSpecsArrayData[i].name;
        allSpecsArray[i].arcaneRank = allSpecsArrayData[i].arcaneRank;
        allSpecsArray[i].cpCost = allSpecsArrayData[i].cpCost;
        allSpecsArray[i].rank = allSpecsArrayData[i].rank;
        allSpecsArray[i].mvmnt = allSpecsArrayData[i].mvmnt;
        allSpecsArray[i].def1 = allSpecsArrayData[i].def1;
        allSpecsArray[i].def2 = allSpecsArrayData[i].def2;
        allSpecsArray[i].dr = allSpecsArrayData[i].dr;
    }
    // <---------------------------- AllMasterSpecsData --------------------------------->
    AllMasterSpecs.Martial.name = AllMasterSpecsData.Martial.name;
    AllMasterSpecs.Martial.cpCost = AllMasterSpecsData.Martial.cpCost;
    AllMasterSpecs.Martial.rank = AllMasterSpecsData.Martial.rank;
    AllMasterSpecs.Martial.trainingsCount = AllMasterSpecsData.Martial.trainingsCount;
    AllMasterSpecs.Martial.qualitiesCount = AllMasterSpecsData.Martial.qualitiesCount;

    AllMasterSpecs.Supernatural.name = AllMasterSpecsData.Supernatural.name;
    AllMasterSpecs.Supernatural.cpCost = AllMasterSpecsData.Supernatural.cpCost;
    AllMasterSpecs.Supernatural.rank = AllMasterSpecsData.Supernatural.rank;
    AllMasterSpecs.Supernatural.trainingsCount = AllMasterSpecsData.Supernatural.trainingsCount;
    AllMasterSpecs.Supernatural.qualitiesCount = AllMasterSpecsData.Supernatural.qualitiesCount;

    AllMasterSpecs.Arcane.name = AllMasterSpecsData.Arcane.name;
    AllMasterSpecs.Arcane.cpCost = AllMasterSpecsData.Arcane.cpCost;
    AllMasterSpecs.Arcane.rank = AllMasterSpecsData.Arcane.rank;
    AllMasterSpecs.Arcane.trainingsCount = AllMasterSpecsData.Arcane.trainingsCount;
    AllMasterSpecs.Arcane.qualitiesCount = AllMasterSpecsData.Arcane.qualitiesCount;

    AllMasterSpecs.Divine.name = AllMasterSpecsData.Divine.name;
    AllMasterSpecs.Divine.cpCost = AllMasterSpecsData.Divine.cpCost;
    AllMasterSpecs.Divine.rank = AllMasterSpecsData.Divine.rank;
    AllMasterSpecs.Divine.trainingsCount = AllMasterSpecsData.Divine.trainingsCount;
    AllMasterSpecs.Divine.qualitiesCount = AllMasterSpecsData.Divine.qualitiesCount;

    AllMasterSpecs.Primal.name = AllMasterSpecsData.Primal.name;
    AllMasterSpecs.Primal.cpCost = AllMasterSpecsData.Primal.cpCost;
    AllMasterSpecs.Primal.rank = AllMasterSpecsData.Primal.rank;
    AllMasterSpecs.Primal.trainingsCount = AllMasterSpecsData.Primal.trainingsCount;
    AllMasterSpecs.Primal.qualitiesCount = AllMasterSpecsData.Primal.qualitiesCount;

    // <----------------------------- activeConditions -------------------------->
    for (let i = 0; i < activeConditionsData.length; ++i) {
        let loaded = activeConditionsData[i];
        let _new = newConditionFromString(loaded.name, loaded.suffix, loaded.suffixValue, true);
        _new.id = loaded.id;
        _new.name = loaded.name;
        _new._tooltip = loaded._tooltip;
        _new.turnsLeft = loaded.turnsLeft;
        _new.suffix = loaded.suffix;
        _new.suffixValue = loaded.suffixValue;
        _new.uiName = loaded.uiName;
        _new.tooltip = loaded.tooltip;
    }

    // <----------------------------- AddedDefensesArray -------------------------->
    for (let i = 0; i < AddedDefensesArrayData.length; ++i) {
        AddedDefensesArray[i].points = AddedDefensesArrayData[i].points;
        AddedDefensesArray[i].pointsModifier = AddedDefensesArrayData[i].pointsModifier;
        AddedDefensesArray[i].gearPointsModifier = AddedDefensesArrayData[i].gearPointsModifier;
        AddedDefensesArray[i].cpCost = AddedDefensesArrayData[i].cpCost;
        AddedDefensesArray[i].cpCostModifier = AddedDefensesArrayData[i].cpCostModifier;
        AddedDefensesArray[i].cap = AddedDefensesArrayData[i].cap;
        AddedDefensesArray[i].capModifier = AddedDefensesArrayData[i].capModifier;
        AddedDefensesArray[i].cpCount = AddedDefensesArrayData[i].cpCount;
        AddedDefensesArray[i].magicNumber = AddedDefensesArrayData[i].magicNumber;
        AddedDefensesArray[i].name = AddedDefensesArrayData[i].name;
        AddedDefensesArray[i].checkBoxIsOn = AddedDefensesArrayData[i].checkBoxIsOn;
    }

    // <----------------------------- DamageTypesArray -------------------------->
    for (let i = 0; i < DamageTypesArrayData.length; ++i) {
        DamageTypesArray[i].points = DamageTypesArrayData[i].points;
        DamageTypesArray[i].pointsModifier = DamageTypesArrayData[i].pointsModifier;
        DamageTypesArray[i].gearPointsModifier = DamageTypesArrayData[i].gearPointsModifier;
        DamageTypesArray[i].cpCost = DamageTypesArrayData[i].cpCost;
        DamageTypesArray[i].cpCostModifier = DamageTypesArrayData[i].cpCostModifier;
        DamageTypesArray[i].capModifier = DamageTypesArrayData[i].capModifier;
        DamageTypesArray[i].cpCount = DamageTypesArrayData[i].cpCount;
        DamageTypesArray[i].magicNumber = DamageTypesArrayData[i].magicNumber;
        DamageTypesArray[i].name = DamageTypesArrayData[i].name;
        DamageTypesArray[i].checkBoxIsOn = DamageTypesArrayData[i].checkBoxIsOn;
    }
    // <----------------------------- VSEnvironmentArray -------------------------->
    for (let i = 0; i < VSEnvironmentArrayData.length; ++i) {
        VSEnvironmentArray[i].pointsModifier = VSEnvironmentArrayData[i].pointsModifier;
        VSEnvironmentArray[i].gearPointsModifier = VSEnvironmentArrayData[i].gearPointsModifier;
        VSEnvironmentArray[i].cpCost = VSEnvironmentArrayData[i].cpCost;
        VSEnvironmentArray[i].cpCostModifier = VSEnvironmentArrayData[i].cpCostModifier;
        VSEnvironmentArray[i].capModifier = VSEnvironmentArrayData[i].capModifier;
        VSEnvironmentArray[i].cpCount = VSEnvironmentArrayData[i].cpCount;
        VSEnvironmentArray[i].name = VSEnvironmentArrayData[i].name;
    }
    // <----------------------------- VSDefsArray -------------------------->
    for (let i = 0; i < VSDefsArrayData.length; ++i) {
        VSDefsArray[i].pointsModifier = VSDefsArrayData[i].pointsModifier;
        VSDefsArray[i].gearPointsModifier = VSDefsArrayData[i].gearPointsModifier;
        VSDefsArray[i].cpCost = VSDefsArrayData[i].cpCost;
        VSDefsArray[i].cpCostModifier = VSDefsArrayData[i].cpCostModifier;
        VSDefsArray[i].capModifier = VSDefsArrayData[i].capModifier;
        VSDefsArray[i].cpCount = VSDefsArrayData[i].cpCount;
        VSDefsArray[i].name = VSDefsArrayData[i].name;
    }
    // <----------------------------- allSpells -------------------------->
    for (let i = 0; i < allSpellsData.length; ++i) {
        let loaded = allSpellsData[i];
        let newSpell = new Spell();

        newSpell.id = loaded.id;
        newSpell.name = loaded.name;
        newSpell.access = loaded.access;
        newSpell.components = loaded.components;
        newSpell.targeting = loaded.targeting;
        newSpell.castingTime = loaded.castingTime;
        newSpell.costs = loaded.costs;
        newSpell.defense = loaded.defense;
        newSpell.duration = loaded.duration;
        newSpell.conditions = loaded.conditions;
        newSpell.discretionaries = loaded.discretionaries;
        newSpell.description = loaded.description;

        newSpell.notesEffects = loaded.notesEffects;
        newSpell.notesPotency = loaded.notesPotency;
        newSpell.notesAoE = loaded.notesAoE;
        newSpell.notesTargeting = loaded.notesTargeting;
        newSpell.notesSpecMods = loaded.notesSpecMods;

        newSpell.notesEffectsRight = loaded.notesEffectsRight;
        newSpell.notesPotencyRight = loaded.notesPotencyRight;
        newSpell.notesAoERight = loaded.notesAoERight;
        newSpell.notesTargetingRight = loaded.notesTargetingRight;
        newSpell.notesSpecModsRight = loaded.notesSpecModsRight;

        newSpell.notesRange = loaded.notesRange;
        newSpell.notesCastingTime = loaded.notesCastingTime;
        newSpell.notesComponents = loaded.notesComponents;
        newSpell.notesCosts = loaded.notesCosts;
        newSpell.notesConditions = loaded.notesConditions;
        newSpell.notesDiscretionaries = loaded.notesDiscretionaries;

        newSpell.notesRangeRight = loaded.notesRangeRight;
        newSpell.notesCastingTimeRight = loaded.notesCastingTimeRight;
        newSpell.notesComponentsRight = loaded.notesComponentsRight;
        newSpell.notesCostsRight = loaded.notesCostsRight;
        newSpell.notesConditionsRight = loaded.notesConditionsRight;
        newSpell.notesDiscretionariesRight = loaded.notesDiscretionariesRight;

        newSpell.selectedParameterOne = loaded.selectedParameterOne;
        newSpell.selectedParameterTwo = loaded.selectedParameterTwo;
        newSpell.isAbility = loaded.isAbility;
    }

    // <----------------------------- allCustomPerformSkills -------------------------->
    for (let i = 0; i < allCustomPerformSkillsData.length; ++i) {
        let loaded = allCustomPerformSkillsData[i];
        let _new = addPerformSkill(loaded.name);

        _new.id = loaded.id;
        _new.baseModifier = loaded.baseModifier;
        _new.gearPointsModifier = loaded.gearPointsModifier;
        _new.cpCount = loaded.cpCount;
        _new.cpMultiplier = loaded.cpMultiplier;
        _new.capModifier = loaded.capModifier;
        _new.isCustom = loaded.isCustom;
        _new.isAddedToList = loaded.isAddedToList;
        _new.skillType = loaded.skillType;
        _new.rank = loaded.rank;
    }
    // <----------------------------- allCustomCraftingSkills -------------------------->
    for (let i = 0; i < allCustomCraftingSkillsData.length; ++i) {
        let loaded = allCustomCraftingSkillsData[i];
        let _new = addCraftedSkill(loaded.name, loaded.isStrBasedCustom, loaded.isAgiBasedCustom);

        _new.id = loaded.id;
        _new.baseModifier = loaded.baseModifier;
        _new.gearPointsModifier = loaded.gearPointsModifier;
        _new.cpCount = loaded.cpCount;
        _new.cpMultiplier = loaded.cpMultiplier;
        _new.capModifier = loaded.capModifier;
        _new.isCustom = loaded.isCustom;
        _new.isAddedToList = loaded.isAddedToList;
        _new.skillType = loaded.skillType;
        _new.isStrBasedCustom = loaded.isStrBasedCustom;
        _new.isAgiBasedCustom = loaded.isAgiBasedCustom;
        _new.rank = loaded.rank;
    }
    // <----------------------------- allKnowledgeSkills -------------------------->
    for (let i = 0; i < allKnowledgeSkillsData.length; ++i) {
        let loaded = allKnowledgeSkillsData[i];
        let _new = addKnowledgeSkill(loaded.name);

        _new.id = loaded.id;
        _new.baseModifier = loaded.baseModifier;
        _new.gearPointsModifier = loaded.gearPointsModifier;
        _new.cpCount = loaded.cpCount;
        _new.cpMultiplier = loaded.cpMultiplier;
        _new.capModifier = loaded.capModifier;
        _new.isCustom = loaded.isCustom;
        _new.isAddedToList = loaded.isAddedToList;
        _new.skillType = loaded.skillType;
        _new.rank = loaded.rank;
    }

    // Loading Indexes
    let trainingsIDData = charData[15]; // Number
    let powersIndexData = charData[16]; // Number
    let lastConditionIndexData = charData[17]; // Number
    let gearIndexData = charData[18]; // Number
    let qualityIndexData = charData[19]; // Number
    let carryingIndexData = charData[20]; // Number
    let allKnowledgeSkillsModifierData = charData[21]; // Number
    let globalSkillIndexData = charData[22]; // Number
    let allSpellsIndexData = charData[23]; // Number

    trainingsID = trainingsIDData;
    powersIndex = powersIndexData;
    lastConditionIndex = lastConditionIndexData;
    gearIndex = gearIndexData;
    qualityIndex = qualityIndexData;
    carryingIndex = carryingIndexData;
    allKnowledgeSkillsModifier = allKnowledgeSkillsModifierData;
    globalSkillIndex = globalSkillIndexData;
    allSpellsIndex = allSpellsIndexData;

    // After Stuff
    for (let i = 0; i < allTrainings.length; ++i) {
        allTrainings[i].spec = getSpecByName(allTrainings[i].name);
    }
    for (let i = 0; i < allQualities.length; ++i) {
        allQualities[i].spec = getSpecByName(allQualities[i].name);
    }

    // Switch to Main Page and Let All Start!
    changePage(Pages.Main);
}


















