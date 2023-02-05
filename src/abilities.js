allSpells = [];
allSpellsIndex = 0;

class Spell {
    constructor() {
        this.id = ++allSpellsIndex;
        this.name = "";
        this.access = "";
        this.components = "";
        this.targeting = "";
        this.castingTime = "";
        this.costs = "";
        this.defense = "";
        this.duration = "";
        this.conditions = "";
        this.discretionaries = "";
        this.description = "";

        this.notesEffects = 0;
        this.notesPotency = 0;
        this.notesAoE = 0;
        this.notesTargeting = 0;
        this.notesSpecMods = 0;

        this.notesEffectsRight = 0;
        this.notesPotencyRight = 0;
        this.notesAoERight = 0;
        this.notesTargetingRight = 0;
        this.notesSpecModsRight = 0;

        this.notesRange = 0;
        this.notesCastingTime = 0;
        this.notesComponents = 0;
        this.notesCosts = 0;
        this.notesConditions = 0;
        this.notesDiscretionaries = 0;

        this.notesRangeRight = 0;
        this.notesCastingTimeRight = 0;
        this.notesComponentsRight = 0;
        this.notesCostsRight = 0;
        this.notesConditionsRight = 0;
        this.notesDiscretionariesRight = 0;

        this.selectedParameterOne = 0;
        this.selectedParameterTwo = 0;

        this.isAbility = false;

        allSpells.push(this);
    }

    setNotesEffects(x) { if (isNaN(parseFloat(x))) x = 0; this.notesEffects = x; }
    setNotesPotency(x) { if (isNaN(parseFloat(x))) x = 0; this.notesPotency = x; }
    setNotesAoe(x) { if (isNaN(parseFloat(x))) x = 0; this.notesAoE = x; }
    setNotesTargeting(x) { if (isNaN(parseFloat(x))) x = 0; this.notesTargeting = x; }
    setNotesSpecMods(x) { if (isNaN(parseFloat(x))) x = 0; this.notesSpecMods = x; }

    setNotesRange(x) { if (isNaN(parseFloat(x))) x = 0; this.notesRange = x; }
    setNotesCastingTime(x) { if (isNaN(parseFloat(x))) x = 0; this.notesCastingTime = x; }
    setNotesComponents(x) { if (isNaN(parseFloat(x))) x = 0; this.notesComponents = x; }
    setNotesCosts(x) { if (isNaN(parseFloat(x))) x = 0; this.notesCosts = x; }
    setNotesConditions(x) { if (isNaN(parseFloat(x))) x = 0; this.notesConditions = x; }
    setNotesDiscretionaries(x) { if (isNaN(parseFloat(x))) x = 0; this.notesDiscretionaries = x; }

    getPartialComplexity() { 
        return this.notesEffects + this.notesPotency + 
        this.notesAoE + this.notesTargeting + this.notesSpecMods;
    }
    getFinalComplexity() {
        return this.notesRange + this.notesCastingTime + this.notesComponents
        + this.notesCosts + this.notesConditions + this.notesDiscretionaries;
    }

    setName(x) { this.name = x; }
    setAccess(x) { this.access = x; }
    setComponents(x) { this.components = x; }
    setTargeting(x) { this.targeting = x; }
    setCastingTime(x) { this.castingTime = x; }
    setCosts(x) { this.costs = x; }
    setDefense(x) { this.defense = x; }
    setDuration(x) { this.duration = x; }
    setConditions(x) { this.conditions = x; }
    setDiscretionaries(x) { this.discretionaries = x; }
    setDescription(x) { this.description = x; }

    isSpell() { return !this.isAbility; }
    isAbility() { return this.isAbility; }
    setToAbility() { this.isAbility = true; }
    setToSpell() { this.isAbility = false; }
}