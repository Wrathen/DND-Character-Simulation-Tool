class Condition {
    constructor(name, tooltip, suffix = null, suffixValue = null, onAddEffect, onRemoveEffect, onTickEffect = null, isLoaded = false) {
        this.id = ++lastConditionIndex;
        this.name = name;
        this._tooltip = tooltip;

        this.onAddEffect = onAddEffect;
        this.onRemoveEffect = onRemoveEffect;
        this.onTickEffect = onTickEffect;

        this.turnsLeft = 3;
        this.suffix = suffix;
        this.suffixValue = suffixValue;
        this.uiName = this.name;

        if (this.suffix != null) this.uiName += " " + this.suffix;
        if (this.suffixValue != null) {
            this.uiName += " ";
            let _number = this.suffixValue;
            if (this.name == "Weakened") _number = -_number;

            if (_number >= 0) this.uiName += "+";
            this.uiName += _number;
        }

        if (this.suffix == "Add Type" || this.suffix == "Add Subtype" || this.suffix == "Add Species") {
            this.uiName = "Weakened " + this.suffixValue;
            this._tooltip = "Weakened against " + this.suffixValue + ".";
        }
        else {
            if (this.suffixValue != null)
                this._tooltip = this._tooltip.replace("-x", (this.suffixValue >= 0 ? "-" + this.suffixValue : "+" + (-this.suffixValue)));
            if (this.suffix != null) {
                this._tooltip = this._tooltip.replace("chosen stats", this.suffix);
                this._tooltip = this._tooltip.replace("chosen stat", this.suffix);
            }
        }

        this.tooltip = '<span style="color:rgb(255, 255, 355); font-size: 110%;">Condition Name: </span>' + this.uiName +
            '<br><br><span style="color:rgb(255, 255, 355); font-size: 110%;">Condition Effect: </span> ' +
            this._tooltip + '<br><br><br><br><br><br><span style="position: absolute; justify-content: center; right: 5px; bottom: 5px; color:rgb(255, 60, 75); font-size: 80%;">Click on Tooltip to Close.</span>';

        activeConditions.push(this);

        if (!isLoaded) onAddEffect(this);
    }

    tick() { if (this.onTickEffect) this.onTickEffect(this); }
    getTurnsLeft() { return this.turnsLeft; }
    setTurnsLeft(newStat) { this.turnsLeft = newStat; }

    changeTooltip(newTooltip) { this.tooltip = newTooltip; }
}
function newConditionFromString(str, suf = null, val = null, isLoaded = false) {
    if (str == "Physical Anchor") return newCondition(Conditions.PhysicalAnchor, null, null, isLoaded);
    else if (str == "Suffocated") return newCondition(Conditions.Suffocated, null, null, isLoaded);
    else if (str == "Strangled") return newCondition(Conditions.Strangled, null, null, isLoaded);
    else if (str == "Drowning") return newCondition(Conditions.Drowning, null, null, isLoaded);
    else if (str == "Bound") {
        if (suf == "One Leg") return newCondition(Conditions.BoundOneLeg, suf, null, isLoaded);
        else if (suf == "Both Legs") return newCondition(Conditions.BoundBothLegs, suf, null, isLoaded);
        else if (suf == "One Arm") return newCondition(Conditions.BoundOneArm, suf, null, isLoaded);
        else if (suf == "Both Arms") return newCondition(Conditions.BoundBothArms, suf, null, isLoaded);
        else if (suf == "One Hand") return newCondition(Conditions.BoundOneHand, suf, null, isLoaded);
        else if (suf == "Both Hands") return newCondition(Conditions.BoundBothHands, suf, null, isLoaded);
    }
    else if (str == "Semi-Blinded") return newCondition(Conditions.SemiBlinded, null, null, isLoaded);
    else if (str == "Blinded") return newCondition(Conditions.Blinded, null, null, isLoaded);
    else if (str == "Burning") return newCondition(Conditions.Burning, null, null, isLoaded);
    else if (str == "Aflame") return newCondition(Conditions.Aflame, null, null, isLoaded);
    else if (str == "Ablaze") return newCondition(Conditions.Ablaze, null, null, isLoaded);
    else if (str == "Chilled") return newCondition(Conditions.Chilled, null, null, isLoaded);
    else if (str == "Frosted") return newCondition(Conditions.Frosted, null, null, isLoaded);
    else if (str == "Frozen") return newCondition(Conditions.Frozen, null, null, isLoaded);
    else if (str == "Charmed") return newCondition(Conditions.Charmed, null, null, isLoaded);
    else if (str == "Dominated") return newCondition(Conditions.Dominated, null, null, isLoaded);
    else if (str == "Enthralled") return newCondition(Conditions.Enthralled, null, null, isLoaded);
    else if (str == "Confusion") return newCondition(Conditions.Confusion, null, null, isLoaded);
    else if (str == "Insanity") return newCondition(Conditions.Insanity, null, null, isLoaded);
    else if (str == "Random Action") return newCondition(Conditions.RandomAction, null, null, isLoaded);
    else if (str == "Staggered") return newCondition(Conditions.Staggered, null, null, isLoaded);
    else if (str == "Dazed") return newCondition(Conditions.Dazed, null, null, isLoaded);
    else if (str == "Stunned") return newCondition(Conditions.Stunned, null, null, isLoaded);
    else if (str == "Dazzled") return newCondition(Conditions.Dazzled, suf, val, isLoaded);
    else if (str == "Hearing Loss") return newCondition(Conditions.HearingLoss, null, null, isLoaded);
    else if (str == "Deafened") return newCondition(Conditions.Deafened, null, null, isLoaded);
    else if (str == "Partially Held") return newCondition(Conditions.PartiallyHeld, null, null, isLoaded);
    else if (str == "Held") return newCondition(Conditions.Held, null, null, isLoaded);
    else if (str == "Enfeebled" && val != null) return newCondition(Conditions.Enfeebled, suf, val, isLoaded);
    else if (str == "Incensed") return newCondition(Conditions.Incensed, null, null, isLoaded);
    else if (str == "Controlled Rage") return newCondition(Conditions.ControlledRage, null, null, isLoaded);
    else if (str == "Uncontrolled Rage") return newCondition(Conditions.UncontrolledRage, null, null, isLoaded);
    else if (str == "Berserk" || str == "BERSERK") return newCondition(Conditions.Berserk, null, null, isLoaded);
    else if (str == "Flat-Footed") return newCondition(Conditions.FlatFooted, null, null, isLoaded);
    else if (str == "Fascinate") return newCondition(Conditions.Fascinate, null, null, isLoaded);
    else if (str == "Fatigue") return newCondition(Conditions.Fatigue, null, null, isLoaded);
    else if (str == "Exhausted") return newCondition(Conditions.Exhausted, null, null, isLoaded);
    else if (str == "Shakened") return newCondition(Conditions.Shakened, null, null, isLoaded);
    else if (str == "Frightened") return newCondition(Conditions.Frightened, null, null, isLoaded);
    else if (str == "Panicked") return newCondition(Conditions.Panicked, null, null, isLoaded);
    else if (str == "Helpless") return newCondition(Conditions.Helpless, null, null, isLoaded);
    else if (str == "Hindered") return newCondition(Conditions.Hindered, suf, val, isLoaded);
    else if (str == "Off-Balance") return newCondition(Conditions.OffBalance, null, null, isLoaded);
    else if (str == "Prone") return newCondition(Conditions.Prone, null, null, isLoaded);
    else if (str == "Sickened") return newCondition(Conditions.Sickened, null, null, isLoaded);
    else if (str == "Nauseated") return newCondition(Conditions.Nauseated, null, null, isLoaded);
    else if (str == "Repulsed") return newCondition(Conditions.Repulsed, null, null, isLoaded);
    else if (str == "Decelerated") return newCondition(Conditions.Decelerated, suf, val, isLoaded);
    else if (str == "Slowed") return newCondition(Conditions.Slowed, null, null, isLoaded);
    else if (str == "Stopped") return newCondition(Conditions.Stopped, null, null, isLoaded);
    else if (str == "Soul Drain") return newCondition(Conditions.SoulDrain, suf, val, isLoaded);
    else if (str == "Invisible") return newCondition(Conditions.Invisible, null, null, isLoaded);
    else if (str == "Imp. Invisible" || str == "Improved Invisibility") return newCondition(Conditions.ImprovedInvisible, null, null, isLoaded);
    else if (str == "Pain") return newCondition(Conditions.Pain, suf, val, isLoaded);
    else if (str == "Partial Paralysis") return newCondition(Conditions.PartialParalysis, suf, null, isLoaded);
    else if (str == "Total Paralysis") return newCondition(Conditions.TotalParalysis, null, null, isLoaded);
    else if (str == "Unconscious") return newCondition(Conditions.Unconscious, null, null, isLoaded);
    else if (str == "Vulnerable") return newCondition(Conditions.Vulnerable, suf, val, isLoaded);
    else if (str == "Weakened") return newCondition(Conditions.Weakened, suf, val, isLoaded);
}
function newCondition(condEnum, suf = null, val = null, isLoaded = false) {
    return new Condition(condEnum[0], condEnum[1], suf, val, condEnum[2], condEnum[3], condEnum[4], isLoaded);
}
const Conditions = {
    PhysicalAnchor: ["Physical Anchor", "-100% All Movement Speeds", () => {
        let movements = mainChar.stats.movements; // On Condition Add
        movements.ground.reduceSpeed(100);
        movements.swim.reduceSpeed(100);
        movements.climb.reduceSpeed(100);
        movements.jump.reduceSpeed(100);
        movements.burrow.reduceSpeed(100);
        movements.flight.reduceSpeed(100);
    }, () => {
        let movements = mainChar.stats.movements;  // On Condition Remove
        movements.ground.addSpeed(100);
        movements.swim.addSpeed(100);
        movements.climb.addSpeed(100);
        movements.jump.addSpeed(100);
        movements.burrow.addSpeed(100);
        movements.flight.addSpeed(100);
    }],
    Suffocated: ["Suffocated", "Target is unable to breathe.  Target rolls 1d20+VsBreathe at beginning of suffocation to determine starting breathe capacity.", () => { }, () => { }],
    Strangled: ["Strangled", "Target is unable to breathe and unable to speak.", () => { }, () => { }],
    Drowning: ["Drowning", "Lungs filled with some substance.  Target cannot breathe or speak, but successful vomiting removes condition. Action Vomit: 3Ap Save Vs Concentration DC(15 + Your own Con)", () => { }, () => { }],
    BoundOneLeg: ["Bound", " -50% Ground/Jump/Swim Speed, -4 Dodge, Balance, Hold Position", () => {
        let movements = mainChar.stats.movements;  // On Condition Remove
        movements.ground.reduceSpeed(50);
        movements.jump.reduceSpeed(50);
        movements.swim.reduceSpeed(50);

        mainChar.stats.reduceDodge(4);
        VSDefs.Balance.reducePointsModifier(4);
        VSDefs.HoldPos.reducePointsModifier(4);
    }, () => {
        let movements = mainChar.stats.movements;  // On Condition Remove
        movements.ground.addSpeed(50);
        movements.jump.addSpeed(50);
        movements.swim.addSpeed(50);

        mainChar.stats.addDodge(4);
        VSDefs.Balance.addPointsModifier(4);
        VSDefs.HoldPos.addPointsModifier(4);
    }],
    BoundBothLegs: ["Bound", "-100% Ground/Jump/Swim Speed, -6 Dodge -8 Balance, Hold Position", () => {
        let movements = mainChar.stats.movements;  // On Condition Remove
        movements.ground.reduceSpeed(100);
        movements.jump.reduceSpeed(100);
        movements.swim.reduceSpeed(100);

        mainChar.stats.reduceDodge(6);
        VSDefs.Balance.reducePointsModifier(8);
        VSDefs.HoldPos.reducePointsModifier(8);
    }, () => {
        let movements = mainChar.stats.movements;  // On Condition Remove
        movements.ground.addSpeed(100);
        movements.jump.addSpeed(100);
        movements.swim.addSpeed(100);

        mainChar.stats.addDodge(6);
        VSDefs.Balance.addPointsModifier(8);
        VSDefs.HoldPos.addPointsModifier(8);
    }],
    BoundOneHand: ["Bound", "If it was holding anything it cannot let it go, if it is empty it is unable to pick anything up.", () => { }, () => { }],
    BoundBothHands: ["Bound", "Both hands of the target become bound.", () => { }, () => { }],
    BoundOneArm: ["Bound", "-33% Climb Speed, Unable to use that arm or anything held by it.", () => {
        mainChar.stats.movements.climb.reduceSpeed(33);
    }, () => {
        mainChar.stats.movements.climb.addSpeed(33);
    }],
    BoundBothArms: ["Bound", "-66% Climb Speed,	Unable to use either arm or anything held by them. Objects may be dropped or for 6Ap picked up.", () => {
        mainChar.stats.movements.climb.reduceSpeed(66);
    }, () => {
        mainChar.stats.movements.climb.addSpeed(66);
    }],
    SemiBlinded: ["Semi-Blinded", "-4 Acc, -2 Balance, -2 Dodge, and -8 spot", () => {
        mainChar.stats.reduceAccuracy(4);
        VSDefs.Balance.reducePointsModifier(2);
        mainChar.stats.reduceDodge(2);
        VSEnvironments.Spot.reducePointsModifier(8);
    }, () => {
        mainChar.stats.addAccuracy(4);
        VSDefs.Balance.addPointsModifier(2);
        mainChar.stats.addDodge(2);
        VSEnvironments.Spot.addPointsModifier(8);
    }],
    Blinded: ["Blinded", "-8 Acc, -4 Balance, - Dodge, and Cannot Spot", () => {
        mainChar.stats.reduceAccuracy(8);
        VSDefs.Balance.reducePointsModifier(4);
        mainChar.stats.reduceDodge(4);
        VSEnvironments.Spot.reducePointsModifier(15000);
    }, () => {
        mainChar.stats.addAccuracy(8);
        VSDefs.Balance.addPointsModifier(4);
        mainChar.stats.addDodge(4);
        VSEnvironments.Spot.addPointsModifier(15000);
    }],
    Burning: ["Burning", "You are burning, may spend 3ap to pat out.", () => { }, () => { }],
    Aflame: ["Aflame", "You are on fire! You may spend 6ap to pat out.", () => { }, () => { }],
    Ablaze: ["Ablaze", "You are completely Aflame! You may fall prone and spend 6ap to extinguish flames.", () => { }, () => { }],
    Chilled: ["Chilled", "-2AP for the duration, warming effects remove", () => { }, () => { }],
    Frosted: ["Frosted", "-4ap for the duration, warming effects remove but take twice the time as chilled, once removed target is chilled for one turn", () => { }, () => { }],
    Frozen: ["Frozen", "Target is completely frozen, Unable to take action till AP cost payed (specified by effect], once broken out of target remains freezing for one turn, then chilled for one turn", () => { }, () => { }],
    Charmed: ["Charmed", "You are Charmed", () => { }, () => { }],
    Dominated: ["Dominated", "Dominated by another.", () => { }, () => { }],
    Enthralled: ["Enthralled", "Mind's enslaved.", () => { }, () => { }],
    Confusion: ["Confusion", "Target rolls on the table below to determine its actions for the turn.", () => { }, () => { }],
    Insanity: ["Insanity", "Target rolls on the table below to determine its actions for the turn.", () => { }, () => { }],
    RandomAction: ["Random Action", "Target rolls on the table below to determine its actions for the turn.", () => { }, () => { }],
    Staggered: ["Staggered", "-2 Acc and all Defenses and Senses", () => {
        mainChar.stats.reduceAccuracy(2);

        // All Defenses (VS Defs)
        VSDefs.Reflex.reducePointsModifier(2);
        VSDefs.Shapechange.reducePointsModifier(2);
        VSDefs.Balance.reducePointsModifier(2);
        VSDefs.Toxic.reducePointsModifier(2);
        VSDefs.Destruction.reducePointsModifier(2);
        VSDefs.HoldPos.reducePointsModifier(2);
        VSDefs.Compulsions.reducePointsModifier(2);
        VSDefs.Emotions.reducePointsModifier(2);
        VSDefs.Concentration.reducePointsModifier(2);
        VSDefs.Scry.reducePointsModifier(2);
        VSDefs.Grip.reducePointsModifier(2);
        VSDefs.Restraint.reducePointsModifier(2);

        // Senses
        VSEnvironments.Spot.reducePointsModifier(2);
        VSEnvironments.Listen.reducePointsModifier(2);
        VSEnvironments.Scent.reducePointsModifier(2);
    }, () => {
        mainChar.stats.addAccuracy(2);

        VSDefs.Reflex.addPointsModifier(2);
        VSDefs.Shapechange.addPointsModifier(2);
        VSDefs.Balance.addPointsModifier(2);
        VSDefs.Toxic.addPointsModifier(2);
        VSDefs.Destruction.addPointsModifier(2);
        VSDefs.HoldPos.addPointsModifier(2);
        VSDefs.Compulsions.addPointsModifier(2);
        VSDefs.Emotions.addPointsModifier(2);
        VSDefs.Concentration.addPointsModifier(2);
        VSDefs.Scry.addPointsModifier(2);
        VSDefs.Grip.addPointsModifier(2);
        VSDefs.Restraint.addPointsModifier(2);

        VSEnvironments.Spot.addPointsModifier(2);
        VSEnvironments.Listen.addPointsModifier(2);
        VSEnvironments.Scent.addPointsModifier(2);
    }],
    Dazed: ["Dazed", " -4 to all Defenses and Senses, 3Ap to remove", () => {
        // All Defenses (VS Defs)
        VSDefs.Reflex.reducePointsModifier(4);
        VSDefs.Shapechange.reducePointsModifier(4);
        VSDefs.Balance.reducePointsModifier(4);
        VSDefs.Toxic.reducePointsModifier(4);
        VSDefs.Destruction.reducePointsModifier(4);
        VSDefs.HoldPos.reducePointsModifier(4);
        VSDefs.Compulsions.reducePointsModifier(4);
        VSDefs.Emotions.reducePointsModifier(4);
        VSDefs.Concentration.reducePointsModifier(4);
        VSDefs.Scry.reducePointsModifier(4);
        VSDefs.Grip.reducePointsModifier(4);
        VSDefs.Restraint.reducePointsModifier(4);

        // Senses
        VSEnvironments.Spot.reducePointsModifier(4);
        VSEnvironments.Listen.reducePointsModifier(4);
        VSEnvironments.Scent.reducePointsModifier(4);
    }, () => {
        //if (mainChar.stats.getAP() < 3) return false;
        //mainChar.stats.setAP(mainChar.stats.getAP() - 3);

        // All Defenses (VS Defs)
        VSDefs.Reflex.addPointsModifier(4);
        VSDefs.Shapechange.addPointsModifier(4);
        VSDefs.Balance.addPointsModifier(4);
        VSDefs.Toxic.addPointsModifier(4);
        VSDefs.Destruction.addPointsModifier(4);
        VSDefs.HoldPos.addPointsModifier(4);
        VSDefs.Compulsions.addPointsModifier(4);
        VSDefs.Emotions.addPointsModifier(4);
        VSDefs.Concentration.addPointsModifier(4);
        VSDefs.Scry.addPointsModifier(4);
        VSDefs.Grip.addPointsModifier(4);
        VSDefs.Restraint.addPointsModifier(4);

        // Senses
        VSEnvironments.Spot.addPointsModifier(4);
        VSEnvironments.Listen.addPointsModifier(4);
        VSEnvironments.Scent.addPointsModifier(4);
    }],
    Stunned: ["Stunned", "Unable to take action, -4 All Defenses and Senses, Chance to drop held items at end of turns unless Save vs Concentration. DC(10+damage taken that round)", () => {
        // All Defenses (VS Defs)
        VSDefs.Reflex.reducePointsModifier(4);
        VSDefs.Shapechange.reducePointsModifier(4);
        VSDefs.Balance.reducePointsModifier(4);
        VSDefs.Toxic.reducePointsModifier(4);
        VSDefs.Destruction.reducePointsModifier(4);
        VSDefs.HoldPos.reducePointsModifier(4);
        VSDefs.Compulsions.reducePointsModifier(4);
        VSDefs.Emotions.reducePointsModifier(4);
        VSDefs.Concentration.reducePointsModifier(4);
        VSDefs.Scry.reducePointsModifier(4);
        VSDefs.Grip.reducePointsModifier(4);
        VSDefs.Restraint.reducePointsModifier(4);

        // Senses
        VSEnvironments.Spot.reducePointsModifier(4);
        VSEnvironments.Listen.reducePointsModifier(4);
        VSEnvironments.Scent.reducePointsModifier(4);
    }, () => {
        // All Defenses (VS Defs)
        VSDefs.Reflex.addPointsModifier(4);
        VSDefs.Shapechange.addPointsModifier(4);
        VSDefs.Balance.addPointsModifier(4);
        VSDefs.Toxic.addPointsModifier(4);
        VSDefs.Destruction.addPointsModifier(4);
        VSDefs.HoldPos.addPointsModifier(4);
        VSDefs.Compulsions.addPointsModifier(4);
        VSDefs.Emotions.addPointsModifier(4);
        VSDefs.Concentration.addPointsModifier(4);
        VSDefs.Scry.addPointsModifier(4);
        VSDefs.Grip.addPointsModifier(4);
        VSDefs.Restraint.addPointsModifier(4);

        // Senses
        VSEnvironments.Spot.addPointsModifier(4);
        VSEnvironments.Listen.addPointsModifier(4);
        VSEnvironments.Scent.addPointsModifier(4);
    }],
    Dazzled: ["Dazzled", "Senses overstimulated, -x Acc/Defenses/Senses", (char) => {
        let x = char.suffixValue;

        mainChar.stats.reduceAccuracy(x);

        // All Defenses (VS Defs)
        VSDefs.Reflex.reducePointsModifier(x);
        VSDefs.Shapechange.reducePointsModifier(x);
        VSDefs.Balance.reducePointsModifier(x);
        VSDefs.Toxic.reducePointsModifier(x);
        VSDefs.Destruction.reducePointsModifier(x);
        VSDefs.HoldPos.reducePointsModifier(x);
        VSDefs.Compulsions.reducePointsModifier(x);
        VSDefs.Emotions.reducePointsModifier(x);
        VSDefs.Concentration.reducePointsModifier(x);
        VSDefs.Scry.reducePointsModifier(x);
        VSDefs.Grip.reducePointsModifier(x);
        VSDefs.Restraint.reducePointsModifier(x);

        // Senses
        VSEnvironments.Spot.reducePointsModifier(x);
        VSEnvironments.Listen.reducePointsModifier(x);
        VSEnvironments.Scent.reducePointsModifier(x);
    }, (char) => {
        let x = char.suffixValue;
        mainChar.stats.addAccuracy(x);

        // All Defenses (VS Defs)
        VSDefs.Reflex.addPointsModifier(x);
        VSDefs.Shapechange.addPointsModifier(x);
        VSDefs.Balance.addPointsModifier(x);
        VSDefs.Toxic.addPointsModifier(x);
        VSDefs.Destruction.addPointsModifier(x);
        VSDefs.HoldPos.addPointsModifier(x);
        VSDefs.Compulsions.addPointsModifier(x);
        VSDefs.Emotions.addPointsModifier(x);
        VSDefs.Concentration.addPointsModifier(x);
        VSDefs.Scry.addPointsModifier(x);
        VSDefs.Grip.addPointsModifier(x);
        VSDefs.Restraint.addPointsModifier(x);

        // Senses
        VSEnvironments.Spot.addPointsModifier(x);
        VSEnvironments.Listen.addPointsModifier(x);
        VSEnvironments.Scent.addPointsModifier(x);
    }],
    HearingLoss: ["Hearing Loss", "-6 Listen", () => {
        VSEnvironments.Listen.reducePointsModifier(6);
    }, () => {
        VSEnvironments.Listen.addPointsModifier(6);
    }],
    Deafened: ["Deafened", "No longer able to hear.", () => {
        VSEnvironments.Listen.reducePointsModifier(15000);
    }, () => {
        VSEnvironments.Listen.addPointsModifier(15000);
    }],
    PartiallyHeld: ["Partially Held", "-3 AP", () => {
        mainChar.stats.reduceAP(3);
    }, () => {
        mainChar.stats.addAP(3);
    }],
    Held: ["Held", "You are unable to Act or Defend.", () => {
        mainChar.stats.reduceAP(15000);
    }, () => {
        mainChar.stats.addAP(15000);
    }],
    Enfeebled: ["Enfeebled", "You suffer a determined modifier to a specified attribute.", (char) => {
        let suff = char.suffix;
        let val = char.suffixValue;

        if (suff == "Strength") mainChar.stats.reduceStrength(val);
        else if (suff == "Agility") mainChar.stats.reduceAgility(val);
        else if (suff == "Discipline") mainChar.stats.reduceDiscipline(val);
        else if (suff == "Intelligence") mainChar.stats.reduceIntelligence(val);
        else if (suff == "Conviction") mainChar.stats.reduceConviction(val);
        else if (suff == "Attunement") mainChar.stats.reduceAttunement(val);
        else if (suff == "Constitution") mainChar.stats.reduceConstitution(val);
    }, (char) => {
        let suff = char.suffix;
        let val = char.suffixValue;

        if (suff == "Strength") mainChar.stats.addStrength(val);
        else if (suff == "Agility") mainChar.stats.addAgility(val);
        else if (suff == "Discipline") mainChar.stats.addDiscipline(val);
        else if (suff == "Intelligence") mainChar.stats.addIntelligence(val);
        else if (suff == "Conviction") mainChar.stats.addConviction(val);
        else if (suff == "Attunement") mainChar.stats.addAttunement(val);
        else if (suff == "Constitution") mainChar.stats.addConstitution(val);
    }],
    Incensed: ["Incensed", "You suffer -2 to Dodge, Concent, Emotions, Compulsion", () => {
        mainChar.stats.reduceDodge(2);
        VSDefs.Concentration.reducePointsModifier(2);
        VSDefs.Emotions.reducePointsModifier(2);
        VSDefs.Compulsions.reducePointsModifier(2);
    }, () => {
        mainChar.stats.addDodge(2);
        VSDefs.Concentration.addPointsModifier(2);
        VSDefs.Emotions.addPointsModifier(2);
        VSDefs.Compulsions.addPointsModifier(2);
    }],
    ControlledRage: ["Controlled Rage", "Target is enraged but in control to an extent, it attacks the nearest enemy or prioritizes targets that injured it if possible.", () => { }, () => { }],
    UncontrolledRage: ["Uncontrolled Rage", "Unable to think rationally, attacks nearest target, or last target to injure him, up to DM. Suffers -4 Dodge, Consent, Emotions, Compulsions", () => {
        mainChar.stats.reduceDodge(4);
        VSDefs.Concentration.reducePointsModifier(4);
        VSDefs.Emotions.reducePointsModifier(4);
        VSDefs.Compulsions.reducePointsModifier(4);
    }, () => {
        mainChar.stats.addDodge(4);
        VSDefs.Concentration.addPointsModifier(4);
        VSDefs.Emotions.addPointsModifier(4);
        VSDefs.Compulsions.addPointsModifier(4);
    }],
    Berserk: ["BERSERK", "Target has lost all control to its fury.  Attacks nearest target with its most powerful abilities/spells with no regard for self-preservation. Suffers -6 Dodge, Consent, Emotions, Compulsions.", () => {
        mainChar.stats.reduceDodge(6);
        VSDefs.Concentration.reducePointsModifier(6);
        VSDefs.Emotions.reducePointsModifier(6);
        VSDefs.Compulsions.reducePointsModifier(6);
    }, () => {
        mainChar.stats.addDodge(6);
        VSDefs.Concentration.addPointsModifier(6);
        VSDefs.Emotions.addPointsModifier(6);
        VSDefs.Compulsions.addPointsModifier(6);
    }],
    FlatFooted: ["Flat-Footed", "Caught off-guard, -8 All Defenses and Senses", () => {
        // All Defenses (VS Defs)
        VSDefs.Reflex.reducePointsModifier(8);
        VSDefs.Shapechange.reducePointsModifier(8);
        VSDefs.Balance.reducePointsModifier(8);
        VSDefs.Toxic.reducePointsModifier(8);
        VSDefs.Destruction.reducePointsModifier(8);
        VSDefs.HoldPos.reducePointsModifier(8);
        VSDefs.Compulsions.reducePointsModifier(8);
        VSDefs.Emotions.reducePointsModifier(8);
        VSDefs.Concentration.reducePointsModifier(8);
        VSDefs.Scry.reducePointsModifier(8);
        VSDefs.Grip.reducePointsModifier(8);
        VSDefs.Restraint.reducePointsModifier(8);

        // Senses
        VSEnvironments.Spot.reducePointsModifier(8);
        VSEnvironments.Listen.reducePointsModifier(8);
        VSEnvironments.Scent.reducePointsModifier(8);
    }, () => {
        // All Defenses (VS Defs)
        VSDefs.Reflex.addPointsModifier(8);
        VSDefs.Shapechange.addPointsModifier(8);
        VSDefs.Balance.addPointsModifier(8);
        VSDefs.Toxic.addPointsModifier(8);
        VSDefs.Destruction.addPointsModifier(8);
        VSDefs.HoldPos.addPointsModifier(8);
        VSDefs.Compulsions.addPointsModifier(8);
        VSDefs.Emotions.addPointsModifier(8);
        VSDefs.Concentration.addPointsModifier(8);
        VSDefs.Scry.addPointsModifier(8);
        VSDefs.Grip.addPointsModifier(8);
        VSDefs.Restraint.addPointsModifier(8);

        // Senses
        VSEnvironments.Spot.addPointsModifier(8);
        VSEnvironments.Listen.addPointsModifier(8);
        VSEnvironments.Scent.addPointsModifier(8);
    }],
    Fascinate: ["Fascinate", "You stare entranced, unable to take action unless an action is taken upon it", () => { }, () => { }],
    Fatigue: ["Fatigue", "-2 Acc and Defenses and Senses", () => {
        mainChar.stats.reduceAccuracy(2);
        // All Defenses (VS Defs)
        VSDefs.Reflex.reducePointsModifier(2);
        VSDefs.Shapechange.reducePointsModifier(2);
        VSDefs.Balance.reducePointsModifier(2);
        VSDefs.Toxic.reducePointsModifier(2);
        VSDefs.Destruction.reducePointsModifier(2);
        VSDefs.HoldPos.reducePointsModifier(2);
        VSDefs.Compulsions.reducePointsModifier(2);
        VSDefs.Emotions.reducePointsModifier(2);
        VSDefs.Concentration.reducePointsModifier(2);
        VSDefs.Scry.reducePointsModifier(2);
        VSDefs.Grip.reducePointsModifier(2);
        VSDefs.Restraint.reducePointsModifier(2);

        // Senses
        VSEnvironments.Spot.reducePointsModifier(2);
        VSEnvironments.Listen.reducePointsModifier(2);
        VSEnvironments.Scent.reducePointsModifier(2);
    }, () => {
        mainChar.stats.addAccuracy(2);
        // All Defenses (VS Defs)
        VSDefs.Reflex.addPointsModifier(2);
        VSDefs.Shapechange.addPointsModifier(2);
        VSDefs.Balance.addPointsModifier(2);
        VSDefs.Toxic.addPointsModifier(2);
        VSDefs.Destruction.addPointsModifier(2);
        VSDefs.HoldPos.addPointsModifier(2);
        VSDefs.Compulsions.addPointsModifier(2);
        VSDefs.Emotions.addPointsModifier(2);
        VSDefs.Concentration.addPointsModifier(2);
        VSDefs.Scry.addPointsModifier(2);
        VSDefs.Grip.addPointsModifier(2);
        VSDefs.Restraint.addPointsModifier(2);

        // Senses
        VSEnvironments.Spot.addPointsModifier(2);
        VSEnvironments.Listen.addPointsModifier(2);
        VSEnvironments.Scent.addPointsModifier(2);
    }],
    Exhausted: ["Exhausted", "-4 Acc and Defenses and Senses regain 1 Stam every Other Turn", () => {
        mainChar.stats.reduceAccuracy(4);
        // All Defenses (VS Defs)
        VSDefs.Reflex.reducePointsModifier(4);
        VSDefs.Shapechange.reducePointsModifier(4);
        VSDefs.Balance.reducePointsModifier(4);
        VSDefs.Toxic.reducePointsModifier(4);
        VSDefs.Destruction.reducePointsModifier(4);
        VSDefs.HoldPos.reducePointsModifier(4);
        VSDefs.Compulsions.reducePointsModifier(4);
        VSDefs.Emotions.reducePointsModifier(4);
        VSDefs.Concentration.reducePointsModifier(4);
        VSDefs.Scry.reducePointsModifier(4);
        VSDefs.Grip.reducePointsModifier(4);
        VSDefs.Restraint.reducePointsModifier(4);

        // Senses
        VSEnvironments.Spot.reducePointsModifier(4);
        VSEnvironments.Listen.reducePointsModifier(4);
        VSEnvironments.Scent.reducePointsModifier(4);
    }, () => {
        mainChar.stats.addAccuracy(4);
        // All Defenses (VS Defs)
        VSDefs.Reflex.addPointsModifier(4);
        VSDefs.Shapechange.addPointsModifier(4);
        VSDefs.Balance.addPointsModifier(4);
        VSDefs.Toxic.addPointsModifier(4);
        VSDefs.Destruction.addPointsModifier(4);
        VSDefs.HoldPos.addPointsModifier(4);
        VSDefs.Compulsions.addPointsModifier(4);
        VSDefs.Emotions.addPointsModifier(4);
        VSDefs.Concentration.addPointsModifier(4);
        VSDefs.Scry.addPointsModifier(4);
        VSDefs.Grip.addPointsModifier(4);
        VSDefs.Restraint.addPointsModifier(4);

        // Senses
        VSEnvironments.Spot.addPointsModifier(4);
        VSEnvironments.Listen.addPointsModifier(4);
        VSEnvironments.Scent.addPointsModifier(4);
    }, () => {
        mainChar.stats.regainStamina();
    }],
    Shakened: ["Shakened", "-2 Acc and Defenses", () => {
        mainChar.stats.reduceAccuracy(2);
        // All Defenses (VS Defs)
        VSDefs.Reflex.reducePointsModifier(2);
        VSDefs.Shapechange.reducePointsModifier(2);
        VSDefs.Balance.reducePointsModifier(2);
        VSDefs.Toxic.reducePointsModifier(2);
        VSDefs.Destruction.reducePointsModifier(2);
        VSDefs.HoldPos.reducePointsModifier(2);
        VSDefs.Compulsions.reducePointsModifier(2);
        VSDefs.Emotions.reducePointsModifier(2);
        VSDefs.Concentration.reducePointsModifier(2);
        VSDefs.Scry.reducePointsModifier(2);
        VSDefs.Grip.reducePointsModifier(2);
        VSDefs.Restraint.reducePointsModifier(2);
    }, () => {
        mainChar.stats.addAccuracy(2);
        // All Defenses (VS Defs)
        VSDefs.Reflex.addPointsModifier(2);
        VSDefs.Shapechange.addPointsModifier(2);
        VSDefs.Balance.addPointsModifier(2);
        VSDefs.Toxic.addPointsModifier(2);
        VSDefs.Destruction.addPointsModifier(2);
        VSDefs.HoldPos.addPointsModifier(2);
        VSDefs.Compulsions.addPointsModifier(2);
        VSDefs.Emotions.addPointsModifier(2);
        VSDefs.Concentration.addPointsModifier(2);
        VSDefs.Scry.addPointsModifier(2);
        VSDefs.Grip.addPointsModifier(2);
        VSDefs.Restraint.addPointsModifier(2);
    }],
    Frightened: ["Frightened", "-4 Acc and Defenses, at beginning of turn target must Save Vs Fear DC(Source) or flee from source, being able to choose its path of flight. If unable to flee it continues fighting at -6 to all rolls for that turn.", () => {
        mainChar.stats.reduceAccuracy(4);
        // All Defenses (VS Defs)
        VSDefs.Reflex.reducePointsModifier(4);
        VSDefs.Shapechange.reducePointsModifier(4);
        VSDefs.Balance.reducePointsModifier(4);
        VSDefs.Toxic.reducePointsModifier(4);
        VSDefs.Destruction.reducePointsModifier(4);
        VSDefs.HoldPos.reducePointsModifier(4);
        VSDefs.Compulsions.reducePointsModifier(4);
        VSDefs.Emotions.reducePointsModifier(4);
        VSDefs.Concentration.reducePointsModifier(4);
        VSDefs.Scry.reducePointsModifier(4);
        VSDefs.Grip.reducePointsModifier(4);
        VSDefs.Restraint.reducePointsModifier(4);
    }, () => {
        mainChar.stats.addAccuracy(4);
        // All Defenses (VS Defs)
        VSDefs.Reflex.addPointsModifier(4);
        VSDefs.Shapechange.addPointsModifier(4);
        VSDefs.Balance.addPointsModifier(4);
        VSDefs.Toxic.addPointsModifier(4);
        VSDefs.Destruction.addPointsModifier(4);
        VSDefs.HoldPos.addPointsModifier(4);
        VSDefs.Compulsions.addPointsModifier(4);
        VSDefs.Emotions.addPointsModifier(4);
        VSDefs.Concentration.addPointsModifier(4);
        VSDefs.Scry.addPointsModifier(4);
        VSDefs.Grip.addPointsModifier(4);
        VSDefs.Restraint.addPointsModifier(4);
    }],
    Panicked: ["Panicked", "Flees from the source of fear, if unable to flee, cowers helplessly.  Creature flees regardless of its path, attempting to do anything to remove itself from the sight and sound of source.", () => { }, () => { }],
    Helpless: ["Helpless", "Cannot Act or Defend", () => { }, () => { }],
    Hindered: ["Hindered", "-xft to chosen Movement Speeds.", (char) => { // Multiple Choice
        if (char.suffix.indexOf("Ground") != -1) mainChar.stats.movements.ground.slowDown(char.suffixValue);
        if (char.suffix.indexOf("Swim") != -1) mainChar.stats.movements.swim.slowDown(char.suffixValue);
        if (char.suffix.indexOf("Climb") != -1) mainChar.stats.movements.climb.slowDown(char.suffixValue);
        if (char.suffix.indexOf("Jump") != -1) mainChar.stats.movements.jump.slowDown(char.suffixValue);
        if (char.suffix.indexOf("Burrow") != -1) mainChar.stats.movements.burrow.slowDown(char.suffixValue);
        if (char.suffix.indexOf("Flight") != -1) mainChar.stats.movements.flight.slowDown(char.suffixValue);
    }, (char) => {
        if (char.suffix.indexOf("Ground") != -1) mainChar.stats.movements.ground.slowDown(-char.suffixValue);
        if (char.suffix.indexOf("Swim") != -1) mainChar.stats.movements.swim.slowDown(-char.suffixValue);
        if (char.suffix.indexOf("Climb") != -1) mainChar.stats.movements.climb.slowDown(-char.suffixValue);
        if (char.suffix.indexOf("Jump") != -1) mainChar.stats.movements.jump.slowDown(-char.suffixValue);
        if (char.suffix.indexOf("Burrow") != -1) mainChar.stats.movements.burrow.slowDown(-char.suffixValue);
        if (char.suffix.indexOf("Flight") != -1) mainChar.stats.movements.flight.slowDown(-char.suffixValue);
    }],
    OffBalance: ["Off-Balance", "-4 Acc and Defenses, 2Ap to remove", () => {
        mainChar.stats.reduceAccuracy(4);
        // All Defenses (VS Defs)
        VSDefs.Reflex.reducePointsModifier(4);
        VSDefs.Shapechange.reducePointsModifier(4);
        VSDefs.Balance.reducePointsModifier(4);
        VSDefs.Toxic.reducePointsModifier(4);
        VSDefs.Destruction.reducePointsModifier(4);
        VSDefs.HoldPos.reducePointsModifier(4);
        VSDefs.Compulsions.reducePointsModifier(4);
        VSDefs.Emotions.reducePointsModifier(4);
        VSDefs.Concentration.reducePointsModifier(4);
        VSDefs.Scry.reducePointsModifier(4);
        VSDefs.Grip.reducePointsModifier(4);
        VSDefs.Restraint.reducePointsModifier(4);
    }, () => {
        //if (mainChar.stats.getAP() < 2) return false;
        //mainChar.stats.setAP(mainChar.stats.getAP() - 2);

        mainChar.stats.addAccuracy(4);
        // All Defenses (VS Defs)
        VSDefs.Reflex.addPointsModifier(4);
        VSDefs.Shapechange.addPointsModifier(4);
        VSDefs.Balance.addPointsModifier(4);
        VSDefs.Toxic.addPointsModifier(4);
        VSDefs.Destruction.addPointsModifier(4);
        VSDefs.HoldPos.addPointsModifier(4);
        VSDefs.Compulsions.addPointsModifier(4);
        VSDefs.Emotions.addPointsModifier(4);
        VSDefs.Concentration.addPointsModifier(4);
        VSDefs.Scry.addPointsModifier(4);
        VSDefs.Grip.addPointsModifier(4);
        VSDefs.Restraint.addPointsModifier(4);
    }],
    Prone: ["Prone", "On ground, -8 Acc and Defenses. Costs 4AP to stand up.", () => {
        mainChar.stats.reduceAccuracy(8);
        // All Defenses (VS Defs)
        VSDefs.Reflex.reducePointsModifier(8);
        VSDefs.Shapechange.reducePointsModifier(8);
        VSDefs.Balance.reducePointsModifier(8);
        VSDefs.Toxic.reducePointsModifier(8);
        VSDefs.Destruction.reducePointsModifier(8);
        VSDefs.HoldPos.reducePointsModifier(8);
        VSDefs.Compulsions.reducePointsModifier(8);
        VSDefs.Emotions.reducePointsModifier(8);
        VSDefs.Concentration.reducePointsModifier(8);
        VSDefs.Scry.reducePointsModifier(8);
        VSDefs.Grip.reducePointsModifier(8);
        VSDefs.Restraint.reducePointsModifier(8);
    }, () => {
        //if (mainChar.stats.getAP() < 4) return false;
        //mainChar.stats.setAP(mainChar.stats.getAP() - 4);

        mainChar.stats.addAccuracy(8);
        // All Defenses (VS Defs)
        VSDefs.Reflex.addPointsModifier(8);
        VSDefs.Shapechange.addPointsModifier(8);
        VSDefs.Balance.addPointsModifier(8);
        VSDefs.Toxic.addPointsModifier(8);
        VSDefs.Destruction.addPointsModifier(8);
        VSDefs.HoldPos.addPointsModifier(8);
        VSDefs.Compulsions.addPointsModifier(8);
        VSDefs.Emotions.addPointsModifier(8);
        VSDefs.Concentration.addPointsModifier(8);
        VSDefs.Scry.addPointsModifier(8);
        VSDefs.Grip.addPointsModifier(8);
        VSDefs.Restraint.addPointsModifier(8);
    }],
    Sickened: ["Sickened", "-2 Acc and Defenses", () => {
        mainChar.stats.reduceAccuracy(2);
        // All Defenses (VS Defs)
        VSDefs.Reflex.reducePointsModifier(2);
        VSDefs.Shapechange.reducePointsModifier(2);
        VSDefs.Balance.reducePointsModifier(2);
        VSDefs.Toxic.reducePointsModifier(2);
        VSDefs.Destruction.reducePointsModifier(2);
        VSDefs.HoldPos.reducePointsModifier(2);
        VSDefs.Compulsions.reducePointsModifier(2);
        VSDefs.Emotions.reducePointsModifier(2);
        VSDefs.Concentration.reducePointsModifier(2);
        VSDefs.Scry.reducePointsModifier(2);
        VSDefs.Grip.reducePointsModifier(2);
        VSDefs.Restraint.reducePointsModifier(2);
    }, () => {
        mainChar.stats.addAccuracy(2);
        // All Defenses (VS Defs)
        VSDefs.Reflex.addPointsModifier(2);
        VSDefs.Shapechange.addPointsModifier(2);
        VSDefs.Balance.addPointsModifier(2);
        VSDefs.Toxic.addPointsModifier(2);
        VSDefs.Destruction.addPointsModifier(2);
        VSDefs.HoldPos.addPointsModifier(2);
        VSDefs.Compulsions.addPointsModifier(2);
        VSDefs.Emotions.addPointsModifier(2);
        VSDefs.Concentration.addPointsModifier(2);
        VSDefs.Scry.addPointsModifier(2);
        VSDefs.Grip.addPointsModifier(2);
        VSDefs.Restraint.addPointsModifier(2);
    }],
    Nauseated: ["Nauseated", "-4 Acc and Defenses, -2 Str", () => {
        mainChar.stats.reduceStrength(2);
        mainChar.stats.reduceAccuracy(4);
        // All Defenses (VS Defs)
        VSDefs.Reflex.reducePointsModifier(4);
        VSDefs.Shapechange.reducePointsModifier(4);
        VSDefs.Balance.reducePointsModifier(4);
        VSDefs.Toxic.reducePointsModifier(4);
        VSDefs.Destruction.reducePointsModifier(4);
        VSDefs.HoldPos.reducePointsModifier(4);
        VSDefs.Compulsions.reducePointsModifier(4);
        VSDefs.Emotions.reducePointsModifier(4);
        VSDefs.Concentration.reducePointsModifier(4);
        VSDefs.Scry.reducePointsModifier(4);
        VSDefs.Grip.reducePointsModifier(4);
        VSDefs.Restraint.reducePointsModifier(4);
    }, () => {
        mainChar.stats.addStrength(2);
        mainChar.stats.addAccuracy(4);
        // All Defenses (VS Defs)
        VSDefs.Reflex.addPointsModifier(4);
        VSDefs.Shapechange.addPointsModifier(4);
        VSDefs.Balance.addPointsModifier(4);
        VSDefs.Toxic.addPointsModifier(4);
        VSDefs.Destruction.addPointsModifier(4);
        VSDefs.HoldPos.addPointsModifier(4);
        VSDefs.Compulsions.addPointsModifier(4);
        VSDefs.Emotions.addPointsModifier(4);
        VSDefs.Concentration.addPointsModifier(4);
        VSDefs.Scry.addPointsModifier(4);
        VSDefs.Grip.addPointsModifier(4);
        VSDefs.Restraint.addPointsModifier(4);
    }],
    Repulsed: ["Repulsed", "-6 Acc and Defenses, -4 Str, target must Save Vs Concentration DC(Source), on failure it may not move towards source.", () => {
        mainChar.stats.reduceStrength(4);
        mainChar.stats.reduceAccuracy(6);
        // All Defenses (VS Defs)
        VSDefs.Reflex.reducePointsModifier(6);
        VSDefs.Shapechange.reducePointsModifier(6);
        VSDefs.Balance.reducePointsModifier(6);
        VSDefs.Toxic.reducePointsModifier(6);
        VSDefs.Destruction.reducePointsModifier(6);
        VSDefs.HoldPos.reducePointsModifier(6);
        VSDefs.Compulsions.reducePointsModifier(6);
        VSDefs.Emotions.reducePointsModifier(6);
        VSDefs.Concentration.reducePointsModifier(6);
        VSDefs.Scry.reducePointsModifier(6);
        VSDefs.Grip.reducePointsModifier(6);
        VSDefs.Restraint.reducePointsModifier(6);
    }, () => {
        mainChar.stats.addStrength(4);
        mainChar.stats.addAccuracy(6);
        // All Defenses (VS Defs)
        VSDefs.Reflex.addPointsModifier(6);
        VSDefs.Shapechange.addPointsModifier(6);
        VSDefs.Balance.addPointsModifier(6);
        VSDefs.Toxic.addPointsModifier(6);
        VSDefs.Destruction.addPointsModifier(6);
        VSDefs.HoldPos.addPointsModifier(6);
        VSDefs.Compulsions.addPointsModifier(6);
        VSDefs.Emotions.addPointsModifier(6);
        VSDefs.Concentration.addPointsModifier(6);
        VSDefs.Scry.addPointsModifier(6);
        VSDefs.Grip.addPointsModifier(6);
        VSDefs.Restraint.addPointsModifier(6);
    }],
    Decelerated: ["Decelerated", "-x AP and Acc/Dodge", (char) => {
        mainChar.stats.setAP(mainChar.stats.getAP() - char.suffixValue);
        mainChar.stats.reduceAccuracy(char.suffixValue);
        mainChar.stats.reduceDodge(char.suffixValue);
    }, (char) => {
        mainChar.stats.addAccuracy(char.suffixValue);
        mainChar.stats.addDodge(char.suffixValue);
    }, (char) => {
        mainChar.stats.setAP(mainChar.stats.getAP() - char.suffixValue);
    }],
    Slowed: ["Slowed", "-3Ap", () => { }, () => { }],
    Stopped: ["Stopped", "Cannot Act or Defend", () => { }, () => { }],
    SoulDrain: ["Soul Drain", "-x Everything except Attributes.  If a character ever suffers as much soul drain as it has levels it dies.  Characters recover 1 Soul Drain + 1 per 5Con for each Full Rest.", (char) => {
        let x = char.suffixValue;
        // Everything = Main Vs Defenses, and all Vs Enviros, and All Skills
        // VS Defenses
        VSDefs.Reflex.reducePointsModifier(x);
        VSDefs.Shapechange.reducePointsModifier(x);
        VSDefs.Balance.reducePointsModifier(x);
        VSDefs.Toxic.reducePointsModifier(x);
        VSDefs.Destruction.reducePointsModifier(x);
        VSDefs.HoldPos.reducePointsModifier(x);
        VSDefs.Compulsions.reducePointsModifier(x);
        VSDefs.Emotions.reducePointsModifier(x);
        VSDefs.Concentration.reducePointsModifier(x);
        VSDefs.Scry.reducePointsModifier(x);
        VSDefs.Grip.reducePointsModifier(x);
        VSDefs.Restraint.reducePointsModifier(x);

        // Vs Environments
        // Spot, Listen, Scent, Traps, EnvHot, EnvCold, Breathe, Surprise
        VSEnvironments.Spot.reducePointsModifier(x);
        VSEnvironments.Listen.reducePointsModifier(x);
        VSEnvironments.Scent.reducePointsModifier(x);
        VSEnvironments.Traps.reducePointsModifier(x);
        VSEnvironments.EnvHot.reducePointsModifier(x);
        VSEnvironments.EnvCold.reducePointsModifier(x);
        VSEnvironments.Breathe.reducePointsModifier(x);
        VSEnvironments.Surprise.reducePointsModifier(x);

        // Skills
        // Craft // Alchemy, Brews, OilsAndBalms, Toxins, Homunculi, Explosives, Transmogrify, Blacksmith, Armorsmith, Weaponsmith, Carpentry, Fletchery, Leatherwork, Tailor, Trapmaking, Engineering
        mainChar.stats.craftingSkills.Alchemy.reducePointsModifier(x);
        mainChar.stats.craftingSkills.Brews.reducePointsModifier(x);
        mainChar.stats.craftingSkills.OilsAndBalms.reducePointsModifier(x);
        mainChar.stats.craftingSkills.Toxins.reducePointsModifier(x);
        mainChar.stats.craftingSkills.Homunculi.reducePointsModifier(x);
        mainChar.stats.craftingSkills.Explosives.reducePointsModifier(x);
        mainChar.stats.craftingSkills.Transmogrify.reducePointsModifier(x);
        mainChar.stats.craftingSkills.Blacksmith.reducePointsModifier(x);
        mainChar.stats.craftingSkills.Armorsmith.reducePointsModifier(x);
        mainChar.stats.craftingSkills.Weaponsmith.reducePointsModifier(x);
        mainChar.stats.craftingSkills.Carpentry.reducePointsModifier(x);
        mainChar.stats.craftingSkills.Fletchery.reducePointsModifier(x);
        mainChar.stats.craftingSkills.Leatherwork.reducePointsModifier(x);
        mainChar.stats.craftingSkills.Tailor.reducePointsModifier(x);
        mainChar.stats.craftingSkills.Trapmaking.reducePointsModifier(x);
        mainChar.stats.craftingSkills.Engineering.reducePointsModifier(x);
        // Perform // Acting, EscapeArtist, SleightOfHand
        mainChar.stats.performSkills.Acting.reducePointsModifier(x);
        mainChar.stats.performSkills.EscapeArtist.reducePointsModifier(x);
        mainChar.stats.performSkills.SleightOfHand.reducePointsModifier(x);
        // The Rest // Hide, MoveSilently, Disguise, Medicine, Survival, Track, Flight, Insight, Bluff, Diplomacy, Intimidate, PickLock, PickPocket
        mainChar.stats.skills.Hide.reducePointsModifier(x);
        mainChar.stats.skills.MoveSilently.reducePointsModifier(x);
        mainChar.stats.skills.Disguise.reducePointsModifier(x);
        mainChar.stats.skills.Medicine.reducePointsModifier(x);
        mainChar.stats.skills.Survival.reducePointsModifier(x);
        mainChar.stats.skills.Track.reducePointsModifier(x);
        mainChar.stats.skills.Flight.reducePointsModifier(x);
        mainChar.stats.skills.Insight.reducePointsModifier(x);
        mainChar.stats.skills.Bluff.reducePointsModifier(x);
        mainChar.stats.skills.Diplomacy.reducePointsModifier(x);
        mainChar.stats.skills.Intimidate.reducePointsModifier(x);
        mainChar.stats.skills.PickLock.reducePointsModifier(x);
        mainChar.stats.skills.PickPocket.reducePointsModifier(x);
    }, (char) => {
        let x = char.suffixValue;
        // Everything = Main Vs Defenses, and all Vs Enviros, and All Skills
        // VS Defenses
        VSDefs.Reflex.addPointsModifier(x);
        VSDefs.Shapechange.addPointsModifier(x);
        VSDefs.Balance.addPointsModifier(x);
        VSDefs.Toxic.addPointsModifier(x);
        VSDefs.Destruction.addPointsModifier(x);
        VSDefs.HoldPos.addPointsModifier(x);
        VSDefs.Compulsions.addPointsModifier(x);
        VSDefs.Emotions.addPointsModifier(x);
        VSDefs.Concentration.addPointsModifier(x);
        VSDefs.Scry.addPointsModifier(x);
        VSDefs.Grip.addPointsModifier(x);
        VSDefs.Restraint.addPointsModifier(x);

        // Vs Environments
        // Spot, Listen, Scent, Traps, EnvHot, EnvCold, Breathe, Surprise
        VSEnvironments.Spot.addPointsModifier(x);
        VSEnvironments.Listen.addPointsModifier(x);
        VSEnvironments.Scent.addPointsModifier(x);
        VSEnvironments.Traps.addPointsModifier(x);
        VSEnvironments.EnvHot.addPointsModifier(x);
        VSEnvironments.EnvCold.addPointsModifier(x);
        VSEnvironments.Breathe.addPointsModifier(x);
        VSEnvironments.Surprise.addPointsModifier(x);

        // Skills
        // Craft // Alchemy, Brews, OilsAndBalms, Toxins, Homunculi, Explosives, Transmogrify, Blacksmith, Armorsmith, Weaponsmith, Carpentry, Fletchery, Leatherwork, Tailor, Trapmaking, Engineering
        mainChar.stats.craftingSkills.Alchemy.addPointsModifier(x);
        mainChar.stats.craftingSkills.Brews.addPointsModifier(x);
        mainChar.stats.craftingSkills.OilsAndBalms.addPointsModifier(x);
        mainChar.stats.craftingSkills.Toxins.addPointsModifier(x);
        mainChar.stats.craftingSkills.Homunculi.addPointsModifier(x);
        mainChar.stats.craftingSkills.Explosives.addPointsModifier(x);
        mainChar.stats.craftingSkills.Transmogrify.addPointsModifier(x);
        mainChar.stats.craftingSkills.Blacksmith.addPointsModifier(x);
        mainChar.stats.craftingSkills.Armorsmith.addPointsModifier(x);
        mainChar.stats.craftingSkills.Weaponsmith.addPointsModifier(x);
        mainChar.stats.craftingSkills.Carpentry.addPointsModifier(x);
        mainChar.stats.craftingSkills.Fletchery.addPointsModifier(x);
        mainChar.stats.craftingSkills.Leatherwork.addPointsModifier(x);
        mainChar.stats.craftingSkills.Tailor.addPointsModifier(x);
        mainChar.stats.craftingSkills.Trapmaking.addPointsModifier(x);
        mainChar.stats.craftingSkills.Engineering.addPointsModifier(x);
        // Perform // Acting, EscapeArtist, SleightOfHand
        mainChar.stats.performSkills.Acting.addPointsModifier(x);
        mainChar.stats.performSkills.EscapeArtist.addPointsModifier(x);
        mainChar.stats.performSkills.SleightOfHand.addPointsModifier(x);
        // The Rest // Hide, MoveSilently, Disguise, Medicine, Survival, Track, Flight, Insight, Bluff, Diplomacy, Intimidate, PickLock, PickPocket
        mainChar.stats.skills.Hide.addPointsModifier(x);
        mainChar.stats.skills.MoveSilently.addPointsModifier(x);
        mainChar.stats.skills.Disguise.addPointsModifier(x);
        mainChar.stats.skills.Medicine.addPointsModifier(x);
        mainChar.stats.skills.Survival.addPointsModifier(x);
        mainChar.stats.skills.Track.addPointsModifier(x);
        mainChar.stats.skills.Flight.addPointsModifier(x);
        mainChar.stats.skills.Insight.addPointsModifier(x);
        mainChar.stats.skills.Bluff.addPointsModifier(x);
        mainChar.stats.skills.Diplomacy.addPointsModifier(x);
        mainChar.stats.skills.Intimidate.addPointsModifier(x);
        mainChar.stats.skills.PickLock.addPointsModifier(x);
        mainChar.stats.skills.PickPocket.addPointsModifier(x);
    }],
    Invisible: ["Invisible", "Cannot be seen.  Any attack, ability, or spell used removes invisibility.  Others must choose your square to attack you. You gain Concealment 50%.", () => { }, () => { }],
    ImprovedInvisible: ["Improved Invisibility", "Cannot be seen.  Can act freely without losing invisibility.  Others must choose your square to attack you.  You gain Concealment 50%.", () => { }, () => { }],
    Pain: ["Pain", "-x Everything except Attributes", (char) => {
        let x = char.suffixValue;
        // Everything = Main Vs Defenses, and all Vs Enviros, and All Skills
        // VS Defenses
        VSDefs.Reflex.reducePointsModifier(x);
        VSDefs.Shapechange.reducePointsModifier(x);
        VSDefs.Balance.reducePointsModifier(x);
        VSDefs.Toxic.reducePointsModifier(x);
        VSDefs.Destruction.reducePointsModifier(x);
        VSDefs.HoldPos.reducePointsModifier(x);
        VSDefs.Compulsions.reducePointsModifier(x);
        VSDefs.Emotions.reducePointsModifier(x);
        VSDefs.Concentration.reducePointsModifier(x);
        VSDefs.Scry.reducePointsModifier(x);
        VSDefs.Grip.reducePointsModifier(x);
        VSDefs.Restraint.reducePointsModifier(x);

        // Vs Environments
        // Spot, Listen, Scent, Traps, EnvHot, EnvCold, Breathe, Surprise
        VSEnvironments.Spot.reducePointsModifier(x);
        VSEnvironments.Listen.reducePointsModifier(x);
        VSEnvironments.Scent.reducePointsModifier(x);
        VSEnvironments.Traps.reducePointsModifier(x);
        VSEnvironments.EnvHot.reducePointsModifier(x);
        VSEnvironments.EnvCold.reducePointsModifier(x);
        VSEnvironments.Breathe.reducePointsModifier(x);
        VSEnvironments.Surprise.reducePointsModifier(x);

        // Skills
        // Craft // Alchemy, Brews, OilsAndBalms, Toxins, Homunculi, Explosives, Transmogrify, Blacksmith, Armorsmith, Weaponsmith, Carpentry, Fletchery, Leatherwork, Tailor, Trapmaking, Engineering
        mainChar.stats.craftingSkills.Alchemy.reducePointsModifier(x);
        mainChar.stats.craftingSkills.Brews.reducePointsModifier(x);
        mainChar.stats.craftingSkills.OilsAndBalms.reducePointsModifier(x);
        mainChar.stats.craftingSkills.Toxins.reducePointsModifier(x);
        mainChar.stats.craftingSkills.Homunculi.reducePointsModifier(x);
        mainChar.stats.craftingSkills.Explosives.reducePointsModifier(x);
        mainChar.stats.craftingSkills.Transmogrify.reducePointsModifier(x);
        mainChar.stats.craftingSkills.Blacksmith.reducePointsModifier(x);
        mainChar.stats.craftingSkills.Armorsmith.reducePointsModifier(x);
        mainChar.stats.craftingSkills.Weaponsmith.reducePointsModifier(x);
        mainChar.stats.craftingSkills.Carpentry.reducePointsModifier(x);
        mainChar.stats.craftingSkills.Fletchery.reducePointsModifier(x);
        mainChar.stats.craftingSkills.Leatherwork.reducePointsModifier(x);
        mainChar.stats.craftingSkills.Tailor.reducePointsModifier(x);
        mainChar.stats.craftingSkills.Trapmaking.reducePointsModifier(x);
        mainChar.stats.craftingSkills.Engineering.reducePointsModifier(x);
        // Perform // Acting, EscapeArtist, SleightOfHand
        mainChar.stats.performSkills.Acting.reducePointsModifier(x);
        mainChar.stats.performSkills.EscapeArtist.reducePointsModifier(x);
        mainChar.stats.performSkills.SleightOfHand.reducePointsModifier(x);
        // The Rest // Hide, MoveSilently, Disguise, Medicine, Survival, Track, Flight, Insight, Bluff, Diplomacy, Intimidate, PickLock, PickPocket
        mainChar.stats.skills.Hide.reducePointsModifier(x);
        mainChar.stats.skills.MoveSilently.reducePointsModifier(x);
        mainChar.stats.skills.Disguise.reducePointsModifier(x);
        mainChar.stats.skills.Medicine.reducePointsModifier(x);
        mainChar.stats.skills.Survival.reducePointsModifier(x);
        mainChar.stats.skills.Track.reducePointsModifier(x);
        mainChar.stats.skills.Flight.reducePointsModifier(x);
        mainChar.stats.skills.Insight.reducePointsModifier(x);
        mainChar.stats.skills.Bluff.reducePointsModifier(x);
        mainChar.stats.skills.Diplomacy.reducePointsModifier(x);
        mainChar.stats.skills.Intimidate.reducePointsModifier(x);
        mainChar.stats.skills.PickLock.reducePointsModifier(x);
        mainChar.stats.skills.PickPocket.reducePointsModifier(x);
    }, (char) => {
        let x = char.suffixValue;
        // Everything = Main Vs Defenses, and all Vs Enviros, and All Skills
        // VS Defenses
        VSDefs.Reflex.addPointsModifier(x);
        VSDefs.Shapechange.addPointsModifier(x);
        VSDefs.Balance.addPointsModifier(x);
        VSDefs.Toxic.addPointsModifier(x);
        VSDefs.Destruction.addPointsModifier(x);
        VSDefs.HoldPos.addPointsModifier(x);
        VSDefs.Compulsions.addPointsModifier(x);
        VSDefs.Emotions.addPointsModifier(x);
        VSDefs.Concentration.addPointsModifier(x);
        VSDefs.Scry.addPointsModifier(x);
        VSDefs.Grip.addPointsModifier(x);
        VSDefs.Restraint.addPointsModifier(x);

        // Vs Environments
        // Spot, Listen, Scent, Traps, EnvHot, EnvCold, Breathe, Surprise
        VSEnvironments.Spot.addPointsModifier(x);
        VSEnvironments.Listen.addPointsModifier(x);
        VSEnvironments.Scent.addPointsModifier(x);
        VSEnvironments.Traps.addPointsModifier(x);
        VSEnvironments.EnvHot.addPointsModifier(x);
        VSEnvironments.EnvCold.addPointsModifier(x);
        VSEnvironments.Breathe.addPointsModifier(x);
        VSEnvironments.Surprise.addPointsModifier(x);

        // Skills
        // Craft // Alchemy, Brews, OilsAndBalms, Toxins, Homunculi, Explosives, Transmogrify, Blacksmith, Armorsmith, Weaponsmith, Carpentry, Fletchery, Leatherwork, Tailor, Trapmaking, Engineering
        mainChar.stats.craftingSkills.Alchemy.addPointsModifier(x);
        mainChar.stats.craftingSkills.Brews.addPointsModifier(x);
        mainChar.stats.craftingSkills.OilsAndBalms.addPointsModifier(x);
        mainChar.stats.craftingSkills.Toxins.addPointsModifier(x);
        mainChar.stats.craftingSkills.Homunculi.addPointsModifier(x);
        mainChar.stats.craftingSkills.Explosives.addPointsModifier(x);
        mainChar.stats.craftingSkills.Transmogrify.addPointsModifier(x);
        mainChar.stats.craftingSkills.Blacksmith.addPointsModifier(x);
        mainChar.stats.craftingSkills.Armorsmith.addPointsModifier(x);
        mainChar.stats.craftingSkills.Weaponsmith.addPointsModifier(x);
        mainChar.stats.craftingSkills.Carpentry.addPointsModifier(x);
        mainChar.stats.craftingSkills.Fletchery.addPointsModifier(x);
        mainChar.stats.craftingSkills.Leatherwork.addPointsModifier(x);
        mainChar.stats.craftingSkills.Tailor.addPointsModifier(x);
        mainChar.stats.craftingSkills.Trapmaking.addPointsModifier(x);
        mainChar.stats.craftingSkills.Engineering.addPointsModifier(x);
        // Perform // Acting, EscapeArtist, SleightOfHand
        mainChar.stats.performSkills.Acting.addPointsModifier(x);
        mainChar.stats.performSkills.EscapeArtist.addPointsModifier(x);
        mainChar.stats.performSkills.SleightOfHand.addPointsModifier(x);
        // The Rest // Hide, MoveSilently, Disguise, Medicine, Survival, Track, Flight, Insight, Bluff, Diplomacy, Intimidate, PickLock, PickPocket
        mainChar.stats.skills.Hide.addPointsModifier(x);
        mainChar.stats.skills.MoveSilently.addPointsModifier(x);
        mainChar.stats.skills.Disguise.addPointsModifier(x);
        mainChar.stats.skills.Medicine.addPointsModifier(x);
        mainChar.stats.skills.Survival.addPointsModifier(x);
        mainChar.stats.skills.Track.addPointsModifier(x);
        mainChar.stats.skills.Flight.addPointsModifier(x);
        mainChar.stats.skills.Insight.addPointsModifier(x);
        mainChar.stats.skills.Bluff.addPointsModifier(x);
        mainChar.stats.skills.Diplomacy.addPointsModifier(x);
        mainChar.stats.skills.Intimidate.addPointsModifier(x);
        mainChar.stats.skills.PickLock.addPointsModifier(x);
        mainChar.stats.skills.PickPocket.addPointsModifier(x);
    }],
    PartialParalysis: ["Partial Paralysis", "Subject to Change", (char) => {
        let suff = char.suffix;

        if (suff == "Left Arm") {
            mainChar.gear.accProfPercentModifier_LeftHand += 50;
            mainChar.gear.parryProfPercentModifier_LeftHand += 50;
        }
        else if (suff == "Right Arm") {
            mainChar.gear.accProfPercentModifier_RightHand += 50;
            mainChar.gear.parryProfPercentModifier_RightHand += 50;
        }
        else if (suff == "Leg") {
            let movements = mainChar.stats.movements;
            movements.ground.reduceSpeed(50);
            movements.swim.reduceSpeed(50);
            movements.climb.reduceSpeed(50);
            movements.jump.reduceSpeed(50);
            movements.burrow.reduceSpeed(50);
            movements.flight.reduceSpeed(50);
        }
        else if (suff == "Torso") {
            VSDefs.Destruction.reducePointsModifier(4);
            VSDefs.Shapechange.reducePointsModifier(4);
            VSDefs.Toxic.reducePointsModifier(4);
            VSEnvironments.EnvHot.reducePointsModifier(4);
            VSEnvironments.EnvCold.reducePointsModifier(4);
            VSEnvironments.Breathe.reducePointsModifier(4);
        }
        else if (suff == "Head") {
            VSEnvironments.Spot.reducePointsModifier(4);
            VSEnvironments.Listen.reducePointsModifier(4);
            VSEnvironments.Scent.reducePointsModifier(4);
            VSDefs.Compulsions.reducePointsModifier(4);
            VSDefs.Concentration.reducePointsModifier(4);
            VSDefs.Reflex.reducePointsModifier(4);
            VSDefs.Balance.reducePointsModifier(4);
        }
        else if (suff == "General") {
            mainChar.stats.reduceAccuracy(2);

            // VS Defenses
            VSDefs.Reflex.reducePointsModifier(2);
            VSDefs.Shapechange.reducePointsModifier(2);
            VSDefs.Balance.reducePointsModifier(2);
            VSDefs.Toxic.reducePointsModifier(2);
            VSDefs.Destruction.reducePointsModifier(2);
            VSDefs.HoldPos.reducePointsModifier(2);
            VSDefs.Compulsions.reducePointsModifier(2);
            VSDefs.Emotions.reducePointsModifier(2);
            VSDefs.Concentration.reducePointsModifier(2);
            VSDefs.Scry.reducePointsModifier(2);
            VSDefs.Grip.reducePointsModifier(2);
            VSDefs.Restraint.reducePointsModifier(2);

            VSEnvironments.Spot.reducePointsModifier(2);
            VSEnvironments.Listen.reducePointsModifier(2);
            VSEnvironments.Scent.reducePointsModifier(2);

            let movements = mainChar.stats.movements;
            movements.ground.reduceSpeed(25);
            movements.swim.reduceSpeed(25);
            movements.climb.reduceSpeed(25);
            movements.jump.reduceSpeed(25);
            movements.burrow.reduceSpeed(25);
            movements.flight.reduceSpeed(25);
        }
    }, (char) => {
        let suff = char.suffix;

        if (suff == "Left Arm") {
            mainChar.gear.accProfPercentModifier_LeftHand += 50;
            mainChar.gear.parryProfPercentModifier_LeftHand += 50;
        }
        else if (suff == "Right Arm") {
            mainChar.gear.accProfPercentModifier_RightHand += 50;
            mainChar.gear.parryProfPercentModifier_RightHand += 50;
        }
        else if (suff == "Leg") {
            let movements = mainChar.stats.movements;
            movements.ground.addSpeed(50);
            movements.swim.addSpeed(50);
            movements.climb.addSpeed(50);
            movements.jump.addSpeed(50);
            movements.burrow.addSpeed(50);
            movements.flight.addSpeed(50);
        }
        else if (suff == "Torso") {
            VSDefs.Destruction.addPointsModifier(4);
            VSDefs.Shapechange.addPointsModifier(4);
            VSDefs.Toxic.addPointsModifier(4);
            VSEnvironments.EnvHot.addPointsModifier(4);
            VSEnvironments.EnvCold.addPointsModifier(4);
            VSEnvironments.Breathe.addPointsModifier(4);
        }
        else if (suff == "Head") {
            VSEnvironments.Spot.addPointsModifier(4);
            VSEnvironments.Listen.addPointsModifier(4);
            VSEnvironments.Scent.addPointsModifier(4);
            VSDefs.Compulsions.addPointsModifier(4);
            VSDefs.Concentration.addPointsModifier(4);
            VSDefs.Reflex.addPointsModifier(4);
            VSDefs.Balance.addPointsModifier(4);
        }
        else if (suff == "General") {
            mainChar.stats.addAccuracy(2);

            // VS Defenses
            VSDefs.Reflex.addPointsModifier(2);
            VSDefs.Shapechange.addPointsModifier(2);
            VSDefs.Balance.addPointsModifier(2);
            VSDefs.Toxic.addPointsModifier(2);
            VSDefs.Destruction.addPointsModifier(2);
            VSDefs.HoldPos.addPointsModifier(2);
            VSDefs.Compulsions.addPointsModifier(2);
            VSDefs.Emotions.addPointsModifier(2);
            VSDefs.Concentration.addPointsModifier(2);
            VSDefs.Scry.addPointsModifier(2);
            VSDefs.Grip.addPointsModifier(2);
            VSDefs.Restraint.addPointsModifier(2);

            VSEnvironments.Spot.addPointsModifier(2);
            VSEnvironments.Listen.addPointsModifier(2);
            VSEnvironments.Scent.addPointsModifier(2);

            let movements = mainChar.stats.movements;
            movements.ground.addSpeed(25);
            movements.swim.addSpeed(25);
            movements.climb.addSpeed(25);
            movements.jump.addSpeed(25);
            movements.burrow.addSpeed(25);
            movements.flight.addSpeed(25);
        }
    }],
    TotalParalysis: ["Total Paralysis", "Cannot Act or Defend", () => { }, () => { }],
    Unconscious: ["Unconscious", "Knocked out, unable to Act or Defend.", () => { }, () => { }],
    Vulnerable: ["Vulnerable", "-x CpSpent on chosen Damage Reduction.", (char) => {
        let str = char.suffix;
        let x = char.suffixValue;
        if (str == "Physical") DamageTypes.Physical.reducePointsModifier(x);
        else if (str == "Blunt") DamageTypes.Blunt.reducePointsModifier(x);
        else if (str == "Slashing") DamageTypes.Slashing.reducePointsModifier(x);
        else if (str == "Piercing") DamageTypes.Piercing.reducePointsModifier(x);
        else if (str == "Neg. Energy") DamageTypes.NegEnergy.reducePointsModifier(x);
        else if (str == "Pos. Energy") DamageTypes.PosEnergy.reducePointsModifier(x);
        else if (str == "Fire") DamageTypes.Fire.reducePointsModifier(x);
        else if (str == "Cold") DamageTypes.Cold.reducePointsModifier(x);
        else if (str == "Lightning") DamageTypes.Lightning.reducePointsModifier(x);
        else if (str == "Acid") DamageTypes.Acid.reducePointsModifier(x);
        else if (str == "Sonic") DamageTypes.Sonic.reducePointsModifier(x);
        else if (str == "Radiation") DamageTypes.Radiation.reducePointsModifier(x);
    }, (char) => {
        let str = char.suffix;
        let x = char.suffixValue;
        if (str == "Physical") DamageTypes.Physical.addPointsModifier(x);
        else if (str == "Blunt") DamageTypes.Blunt.addPointsModifier(x);
        else if (str == "Slashing") DamageTypes.Slashing.addPointsModifier(x);
        else if (str == "Piercing") DamageTypes.Piercing.addPointsModifier(x);
        else if (str == "Neg. Energy") DamageTypes.NegEnergy.addPointsModifier(x);
        else if (str == "Pos. Energy") DamageTypes.PosEnergy.addPointsModifier(x);
        else if (str == "Fire") DamageTypes.Fire.addPointsModifier(x);
        else if (str == "Cold") DamageTypes.Cold.addPointsModifier(x);
        else if (str == "Lightning") DamageTypes.Lightning.addPointsModifier(x);
        else if (str == "Acid") DamageTypes.Acid.addPointsModifier(x);
        else if (str == "Sonic") DamageTypes.Sonic.addPointsModifier(x);
        else if (str == "Radiation") DamageTypes.Radiation.addPointsModifier(x);
    }],
    Weakened: ["Weakened", "-x to chosen stat.", (cond) => {
        let suf = cond.suffix;
        let val = cond.suffixValue;

        // Main Stats
        if (suf == "Max HP") mainChar.stats.reduceMaxHP(val);
        else if (suf == "Max Stamina") mainChar.stats.reduceMaxStamina(val);
        else if (suf == "Max Mana") mainChar.stats.reduceMaxMana(val);
        else if (suf == "Accuracy") mainChar.stats.reduceAccuracy(val);
        else if (suf == "Parry") mainChar.stats.reduceParry(val);
        else if (suf == "Damage") mainChar.stats.reduceDamage(val);
        // Vs Defenses
        else if (suf == "Reflex") VSDefs.Reflex.reducePointsModifier(val);
        else if (suf == "Shapechange") VSDefs.Shapechange.reducePointsModifier(val);
        else if (suf == "Balance") VSDefs.Balance.reducePointsModifier(val);
        else if (suf == "Toxic") VSDefs.Toxic.reducePointsModifier(val);
        else if (suf == "Destruction") VSDefs.Destruction.reducePointsModifier(val);
        else if (suf == "Hold Pos.") VSDefs.HoldPos.reducePointsModifier(val);
        else if (suf == "Compulsions") VSDefs.Compulsions.reducePointsModifier(val);
        else if (suf == "Emotions") VSDefs.Emotions.reducePointsModifier(val);
        else if (suf == "Concentration") VSDefs.Concentration.reducePointsModifier(val);
        else if (suf == "Scry") VSDefs.Scry.reducePointsModifier(val);
        else if (suf == "Grip") VSDefs.Grip.reducePointsModifier(val);
        else if (suf == "Restraint") VSDefs.Restraint.reducePointsModifier(val);
        // Magics
        else if (suf == "Magic") AddedDefenses.Magic.reducePointsModifier(val);
        else if (suf == "Arcane") AddedDefenses.Arcane.reducePointsModifier(val);
        else if (suf == "Divine") AddedDefenses.Divine.reducePointsModifier(val);
        else if (suf == "Primal") AddedDefenses.Primal.reducePointsModifier(val);
        else if (suf == "Blood") AddedDefenses.Blood.reducePointsModifier(val);
        else if (suf == "Gem") AddedDefenses.Gem.reducePointsModifier(val);
        else if (suf == "Witchcraft") AddedDefenses.Witchcraft.reducePointsModifier(val);
        // Vs Defenses Continue
        else if (suf == "Psionics") AddedDefenses.Psionics.reducePointsModifier(val);
        else if (suf == "Technology") AddedDefenses.Technology.reducePointsModifier(val);
        else if (suf == "Nature") AddedDefenses.Nature.reducePointsModifier(val);
        else if (suf == "Luck") AddedDefenses.Luck.reducePointsModifier(val);
        else if (suf == "Illusion") AddedDefenses.Illusion.reducePointsModifier(val);
        // Vs Defenses Objects
        else if (suf == "Blades") AddedDefenses.Blades.reducePointsModifier(val);
        else if (suf == "Axe") AddedDefenses.Axe.reducePointsModifier(val);
        else if (suf == "Mace/Hammer") AddedDefenses.MaceHammer.reducePointsModifier(val);
        else if (suf == "Polearms") AddedDefenses.Polearms.reducePointsModifier(val);
        else if (suf == "Bows") AddedDefenses.Bows.reducePointsModifier(val);
        else if (suf == "Guns") AddedDefenses.Guns.reducePointsModifier(val);
        else if (suf == "Crossbows") AddedDefenses.Crossbows.reducePointsModifier(val);
        else if (suf == "Metal") AddedDefenses.Metal.reducePointsModifier(val);
        else if (suf == "Stone") AddedDefenses.Stone.reducePointsModifier(val);
        else if (suf == "Bone") AddedDefenses.Bone.reducePointsModifier(val);

        else if (suf == "Add Type") {
        }
        else if (suf == "Add Subtype") {
        }
        else if (suf == "Add Species") {
        }

        // Alignments
        else if (suf == "Lawful Good") AddedDefenses.LawfulGood.reducePointsModifier(val);
        else if (suf == "Chaotic Good") AddedDefenses.ChaoticGood.reducePointsModifier(val);
        else if (suf == "Neutral Good") AddedDefenses.NeutralGood.reducePointsModifier(val);
        else if (suf == "Lawful Neutral") AddedDefenses.LawfulNeutral.reducePointsModifier(val);
        else if (suf == "True Neutral") AddedDefenses.TrueNeutral.reducePointsModifier(val);
        else if (suf == "Chaotic Neutral") AddedDefenses.ChaoticNeutral.reducePointsModifier(val);
        else if (suf == "Neutral Evil") AddedDefenses.NeutralEvil.reducePointsModifier(val);
        else if (suf == "Lawful Evil") AddedDefenses.LawfulEvil.reducePointsModifier(val);
        else if (suf == "Chaotic Evil") AddedDefenses.ChaoticEvil.reducePointsModifier(val);

        else if (suf == "Lawful") AddedDefenses.Lawful.reducePointsModifier(val);
        else if (suf == "Chaotic") AddedDefenses.Chaotic.reducePointsModifier(val);
        else if (suf == "Good") AddedDefenses.Good.reducePointsModifier(val);
        else if (suf == "Evil") AddedDefenses.Evil.reducePointsModifier(val);
        else if (suf == "Neutral") AddedDefenses.Neutral.reducePointsModifier(val);

        // Vs Environment
        else if (suf == "Spot") VSEnvironments.Spot.reducePointsModifier(val);
        else if (suf == "Listen") VSEnvironments.Listen.reducePointsModifier(val);
        else if (suf == "Scent") VSEnvironments.Scent.reducePointsModifier(val);
        else if (suf == "Traps") VSEnvironments.Traps.reducePointsModifier(val);
        else if (suf == "Environment Hot") VSEnvironments.EnvHot.reducePointsModifier(val);
        else if (suf == "Environment Cold") VSEnvironments.EnvCold.reducePointsModifier(val);
        else if (suf == "Breathe") VSEnvironments.Breathe.reducePointsModifier(val);
        else if (suf == "Surprise") VSEnvironments.Surprise.reducePointsModifier(val);

        // Skills
        else if (suf == "Acting") mainChar.stats.performSkills.Acting.reducePoints(val);
        else if (suf == "Escape Artist") mainChar.stats.performSkills.EscapeArtist.reducePoints(val);
        else if (suf == "Sleight of Hand") mainChar.stats.performSkills.SleightOfHand.reducePoints(val);
        else if (suf == "Knowledge (All)") allKnowledgeSkillsModifier -= val;
        else if (suf == "Hide") mainChar.stats.skills.Hide.reducePoints(val);
        else if (suf == "Move Silently") mainChar.stats.skills.MoveSilently.reducePoints(val);
        else if (suf == "Disguise") mainChar.stats.skills.Disguise.reducePoints(val);
        else if (suf == "Medicine") mainChar.stats.skills.Medicine.reducePoints(val);
        else if (suf == "Survival") mainChar.stats.skills.Survival.reducePoints(val);
        else if (suf == "Track") mainChar.stats.skills.Track.reducePoints(val);
        else if (suf == "Flight") mainChar.stats.skills.Flight.reducePoints(val);
        else if (suf == "Insight") mainChar.stats.skills.Insight.reducePoints(val);
        else if (suf == "Bluff") mainChar.stats.skills.Bluff.reducePoints(val);
        else if (suf == "Diplomacy") mainChar.stats.skills.Diplomacy.reducePoints(val);
        else if (suf == "Intimidate") mainChar.stats.skills.Intimidate.reducePoints(val);
        else if (suf == "Pick Lock") mainChar.stats.skills.PickLock.reducePoints(val);
        else if (suf == "Pick Pocket") mainChar.stats.skills.PickPocket.reducePoints(val);

        // Powers
        else {
            let _power = getPowerByName(suf);
            if (_power) _power.reducePointsModifier(val);
        }
    }, (char) => {
        let suf = char.suffix;
        let val = char.suffixValue;

        // Main Stats
        if (suf == "Max HP") mainChar.stats.addMaxHP(val);
        else if (suf == "Max Stamina") mainChar.stats.addMaxStamina(val);
        else if (suf == "Max Mana") mainChar.stats.addMaxMana(val);
        else if (suf == "Accuracy") mainChar.stats.addAccuracy(val);
        else if (suf == "Parry") mainChar.stats.addParry(val);
        else if (suf == "Damage") mainChar.stats.addDamage(val);
        // Vs Defenses
        else if (suf == "Reflex") VSDefs.Reflex.addPointsModifier(val);
        else if (suf == "Shapechange") VSDefs.Shapechange.addPointsModifier(val);
        else if (suf == "Balance") VSDefs.Balance.addPointsModifier(val);
        else if (suf == "Toxic") VSDefs.Toxic.addPointsModifier(val);
        else if (suf == "Destruction") VSDefs.Destruction.addPointsModifier(val);
        else if (suf == "Hold Pos.") VSDefs.HoldPos.addPointsModifier(val);
        else if (suf == "Compulsions") VSDefs.Compulsions.addPointsModifier(val);
        else if (suf == "Emotions") VSDefs.Emotions.addPointsModifier(val);
        else if (suf == "Concentration") VSDefs.Concentration.addPointsModifier(val);
        else if (suf == "Scry") VSDefs.Scry.addPointsModifier(val);
        else if (suf == "Grip") VSDefs.Grip.addPointsModifier(val);
        else if (suf == "Restraint") VSDefs.Restraint.addPointsModifier(val);
        // Magics
        else if (suf == "Magic") AddedDefenses.Magic.addPointsModifier(val);
        else if (suf == "Arcane") AddedDefenses.Arcane.addPointsModifier(val);
        else if (suf == "Divine") AddedDefenses.Divine.addPointsModifier(val);
        else if (suf == "Primal") AddedDefenses.Primal.addPointsModifier(val);
        else if (suf == "Blood") AddedDefenses.Blood.addPointsModifier(val);
        else if (suf == "Gem") AddedDefenses.Gem.addPointsModifier(val);
        else if (suf == "Witchcraft") AddedDefenses.Witchcraft.addPointsModifier(val);
        // Vs Defenses Continue
        else if (suf == "Psionics") AddedDefenses.Psionics.addPointsModifier(val);
        else if (suf == "Technology") AddedDefenses.Technology.addPointsModifier(val);
        else if (suf == "Nature") AddedDefenses.Nature.addPointsModifier(val);
        else if (suf == "Luck") AddedDefenses.Luck.addPointsModifier(val);
        else if (suf == "Illusion") AddedDefenses.Illusion.addPointsModifier(val);
        // Vs Defenses Objects
        else if (suf == "Blades") AddedDefenses.Blades.addPointsModifier(val);
        else if (suf == "Axe") AddedDefenses.Axe.addPointsModifier(val);
        else if (suf == "Mace/Hammer") AddedDefenses.MaceHammer.addPointsModifier(val);
        else if (suf == "Polearms") AddedDefenses.Polearms.addPointsModifier(val);
        else if (suf == "Bows") AddedDefenses.Bows.addPointsModifier(val);
        else if (suf == "Guns") AddedDefenses.Guns.addPointsModifier(val);
        else if (suf == "Crossbows") AddedDefenses.Crossbows.addPointsModifier(val);
        else if (suf == "Metal") AddedDefenses.Metal.addPointsModifier(val);
        else if (suf == "Stone") AddedDefenses.Stone.addPointsModifier(val);
        else if (suf == "Bone") AddedDefenses.Bone.addPointsModifier(val);

        else if (suf == "Add Type") {
        }
        else if (suf == "Add Subtype") {
        }
        else if (suf == "Add Species") {
        }

        // Alignments
        else if (suf == "Lawful Good") AddedDefenses.LawfulGood.addPointsModifier(val);
        else if (suf == "Chaotic Good") AddedDefenses.ChaoticGood.addPointsModifier(val);
        else if (suf == "Neutral Good") AddedDefenses.NeutralGood.addPointsModifier(val);
        else if (suf == "Lawful Neutral") AddedDefenses.LawfulNeutral.addPointsModifier(val);
        else if (suf == "True Neutral") AddedDefenses.TrueNeutral.addPointsModifier(val);
        else if (suf == "Chaotic Neutral") AddedDefenses.ChaoticNeutral.addPointsModifier(val);
        else if (suf == "Neutral Evil") AddedDefenses.NeutralEvil.addPointsModifier(val);
        else if (suf == "Lawful Evil") AddedDefenses.LawfulEvil.addPointsModifier(val);
        else if (suf == "Chaotic Evil") AddedDefenses.ChaoticEvil.addPointsModifier(val);

        else if (suf == "Lawful") AddedDefenses.Lawful.addPointsModifier(val);
        else if (suf == "Chaotic") AddedDefenses.Chaotic.addPointsModifier(val);
        else if (suf == "Good") AddedDefenses.Good.addPointsModifier(val);
        else if (suf == "Evil") AddedDefenses.Evil.addPointsModifier(val);
        else if (suf == "Neutral") AddedDefenses.Neutral.addPointsModifier(val);

        // Vs Environment
        else if (suf == "Spot") VSEnvironments.Spot.addPointsModifier(val);
        else if (suf == "Listen") VSEnvironments.Listen.addPointsModifier(val);
        else if (suf == "Scent") VSEnvironments.Scent.addPointsModifier(val);
        else if (suf == "Traps") VSEnvironments.Traps.addPointsModifier(val);
        else if (suf == "Environment Hot") VSEnvironments.EnvHot.addPointsModifier(val);
        else if (suf == "Environment Cold") VSEnvironments.EnvCold.addPointsModifier(val);
        else if (suf == "Breathe") VSEnvironments.Breathe.addPointsModifier(val);
        else if (suf == "Surprise") VSEnvironments.Surprise.addPointsModifier(val);

        // Skills
        else if (suf == "Acting") mainChar.stats.performSkills.Acting.addPoints(val);
        else if (suf == "Escape Artist") mainChar.stats.performSkills.EscapeArtist.addPoints(val);
        else if (suf == "Sleight of Hand") mainChar.stats.performSkills.SleightOfHand.addPoints(val);
        else if (suf == "Knowledge (All)") allKnowledgeSkillsModifier += val;
        else if (suf == "Hide") mainChar.stats.skills.Hide.addPoints(val);
        else if (suf == "Move Silently") mainChar.stats.skills.MoveSilently.addPoints(val);
        else if (suf == "Disguise") mainChar.stats.skills.Disguise.addPoints(val);
        else if (suf == "Medicine") mainChar.stats.skills.Medicine.addPoints(val);
        else if (suf == "Survival") mainChar.stats.skills.Survival.addPoints(val);
        else if (suf == "Track") mainChar.stats.skills.Track.addPoints(val);
        else if (suf == "Flight") mainChar.stats.skills.Flight.addPoints(val);
        else if (suf == "Insight") mainChar.stats.skills.Insight.addPoints(val);
        else if (suf == "Bluff") mainChar.stats.skills.Bluff.addPoints(val);
        else if (suf == "Diplomacy") mainChar.stats.skills.Diplomacy.addPoints(val);
        else if (suf == "Intimidate") mainChar.stats.skills.Intimidate.addPoints(val);
        else if (suf == "Pick Lock") mainChar.stats.skills.PickLock.addPoints(val);
        else if (suf == "Pick Pocket") mainChar.stats.skills.PickPocket.addPoints(val);

        // Powers
        else {
            let _power = getPowerByName(suf);
            if (_power) _power.addPointsModifier(val);
        }
    }]
};