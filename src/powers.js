allPowersArray = [];
allSpecsArray = [];
powersIndex = 0;

class MasterSpec {
    constructor(name, cpCost, effect, removalEffect) {
        this.name = name;
        this.cpCost = cpCost;
        this.rank = 0;
        this.effect = effect;
        this.removalEffect = removalEffect;

        this.trainingsCount = 0;
        this.qualitiesCount = 0;
    }

    onEffect() {
        if (this.name == "Martial" || this.name == "Supernatural") return;

        mainChar.stats.reduceCP(this.getCPCost());
        if (!this.effect) return;
        this.effect(this.rank);
    }
    onRemovalEffect() {
        if (this.name == "Martial" || this.name == "Supernatural") return;

        mainChar.stats.addCP(this.getCPCost());
        if (!this.removalEffect) return;
        this.removalEffect(this.rank);
    }
    onTrainingAdd(isATraining) {
        if (this.trainingsCount == 0 && this.qualitiesCount == 0) {
            this.rank = 1;
            this.onEffect();
        }

        if (isATraining) this.trainingsCount++;
        else this.qualitiesCount++;
    }
    onTrainingRemove(isATraining) {
        if (isATraining) this.trainingsCount--;
        else this.qualitiesCount--;

        if (this.trainingsCount <= 0 && this.qualitiesCount <= 0) {
            this.onRemovalEffect();
            this.rank = 0;
        }
    }

    getCPCost() { return this.cpCost * this.rank; }
    getRank() { return this.rank; }
    setRank(x) {
        if (this.rank == x) return;

        let oldRank = this.rank;
        this.onRemovalEffect();
        this.rank = x;
        this.onEffect();

        let subSpecs = [];
        if (this.name == "Martial") subSpecs = getTrainingsByMasterSpecType(MASTERSPECTYPES.Martial);
        else if (this.name == "Supernatural") subSpecs = getTrainingsByMasterSpecType(MASTERSPECTYPES.Supernatural);
        else if (this.name == "Arcane") subSpecs = getTrainingsByMasterSpecType(MASTERSPECTYPES.Arcane);
        else if (this.name == "Divine") subSpecs = getTrainingsByMasterSpecType(MASTERSPECTYPES.Divine);
        else if (this.name == "Primal") subSpecs = getTrainingsByMasterSpecType(MASTERSPECTYPES.Primal);

        for (let i = 0; i < subSpecs.length; ++i)
            subSpecs[i].spec.onMasterSpecRankChange(oldRank, this.rank);
    }
}
class Spec {
    constructor(name, masterSpec, effect, removalEffect, cpCost = 0, arcaneRank = 1, rank = 0) {
        this.name = name;
        this.masterSpec = masterSpec;
        this.effect = effect;
        this.removalEffect = removalEffect;

        this.arcaneRank = arcaneRank; // Minor, Major, Specialization
        this.cpCost = cpCost;
        this.rank = rank;

        // Lordship Creature
        this.mvmnt = null;
        this.def1 = null;
        this.def2 = null;
        this.dr = null;

        allSpecsArray.push(this);
    }

    onMasterSpecRankChange(oldRank, newRank) {
        this.onRemovalEffect(oldRank);
        this.onEffect(newRank);
    }

    onEffect(newMasterRank = this.masterSpec.getRank()) {
        if (!this.effect) return;

        if (this.rank != 0) // Martial and Supernatural
            this.effect(this.rank, this.mvmnt, this.def1, this.def2, this.dr);
        else { // Others
            if (this.arcaneRank > 1) this.effect(newMasterRank * (this.arcaneRank - 1), this.mvmnt, this.def1, this.def2, this.dr);
            else this.effect(newMasterRank * this.arcaneRank, this.mvmnt, this.def1, this.def2, this.dr);
        }

        mainChar.stats.reduceCP(this.getCpCost(newMasterRank));
    }
    onRemovalEffect(oldMasterRank = this.masterSpec.getRank()) {
        if (!this.removalEffect) return;
        if (this.rank != 0) // Martial and Supernatural
            this.removalEffect(this.rank, this.mvmnt, this.def1, this.def2, this.dr);
        else {
            if (this.arcaneRank > 1) this.removalEffect(oldMasterRank * (this.arcaneRank - 1), this.mvmnt, this.def1, this.def2, this.dr);
            else this.removalEffect(oldMasterRank * this.arcaneRank, this.mvmnt, this.def1, this.def2, this.dr);
        }
        mainChar.stats.addCP(this.getCpCost(oldMasterRank));
    }
    setRank(x) {
        if (x < 1) x = 1;
        if (this.rank == x) return;

        this.onRemovalEffect();
        this.rank = x;
        this.onEffect();
    }
    setMvmnt(x) {
        this.onRemovalEffect();
        this.mvmnt = x;
        this.onEffect();
    }
    setDef1(x) {
        this.onRemovalEffect();
        this.def1 = x;
        this.onEffect();
    }
    setDef2(x) {
        this.onRemovalEffect();
        this.def2 = x;
        this.onEffect();
    }
    setDR(x) {
        this.onRemovalEffect();
        this.dr = x;
        this.onEffect();
    }
    getCpCost(masterRank = this.masterSpec.getRank()) {
        if (this.rank != 0) {
            return this.rank * this.masterSpec.cpCost;
        }
        else if (this.arcaneRank != 1) {
            if (this.arcaneRank == 2) return 3 * masterRank;
            else if (this.arcaneRank == 3) return 6 * masterRank;
            else if (this.arcaneRank == 4) return 10 * masterRank;
        }
        return this.cpCost;
    }
    getArcaneRank() { return this.arcaneRank; }
    setArcaneRank(x) {
        this.onRemovalEffect();
        this.arcaneRank = x;
        this.onEffect();
    }
}
class Power {
    constructor(name, base = () => { return 0; }, cpCost = 1, cap = () => { return 0; }) {
        this.id = ++powersIndex;
        this.name = name;
        this.base = base;
        this.cpCount = 0;
        this.cpCap = cap;
        this.cpCapModifier = 0;
        this.cpCost = cpCost;
        this.gearModifier = 0;
        this.isShownOnList = false;

        allPowersArray.push(this);
    }

    getPointsTotalForStatsPage() { return this.getBase() + this.getCPCount() + this.getGearModifier(); }
    getCPCount() { return this.cpCount; }
    setCPCount(x) {
        let maxMod = mainChar.cpStats.getMaxModifier();
        if (x > this.getCPCap()) x = this.getCPCap();
        else if (x < -this.getCPCap()) x = -this.getCPCap();
        if (x > maxMod) x = maxMod;
        else if (x < -maxMod) x = -maxMod;
        x = Math.round(x);

        // Training
        let cpCost = this.cpCost; //1
        let oldVal = this.getCPCount(); // 2

        mainChar.stats.addCP(this.cpCount * this.cpCost);
        this.cpCount = x;
        mainChar.stats.reduceCP(this.cpCount * this.cpCost);

        // Training-AfterNewValue
        let newVal = this.getCPCount(); // 3
        let diff = newVal - oldVal;
        addTrainingPoints("Power, " + this.name, diff, cpCost, true); // 4
    }
    addCap(x) { this.cpCapModifier += x; }
    reduceCap(x) { this.cpCapModifier -= x; }
    addCapModifier(x) { this.cpCapModifier += x; }
    reduceCapModifier(x) { this.cpCapModifier -= x; }
    getBase() { return this.base(); }
    getCPCap() {
        let _cap = this.cpCap() + this.cpCapModifier;
        if (_cap > mainChar.cpStats.getMaxModifier()) _cap = mainChar.cpStats.getMaxModifier();

        return _cap;
    }
    getCPCost() { return this.cpCost; }
    addPointsModifier(x) { this.gearModifier += x; }
    reducePointsModifier(x) { this.gearModifier -= x; }
    getGearModifier() { return this.gearModifier; }
    getPoints() {
        return this.getBase() + this.getCPCount() + this.getGearModifier();
    }
    remove() {
        for (let i = 0; i < allPowersArray.length; ++i) {
            if (allPowersArray[i].id == this.id) {
                allPowersArray.splice(i, 1);
                return;
            }
        }
    }
}

AllMasterSpecs = {
    Martial: new MasterSpec("Martial", 15, null, null),
    Supernatural: new MasterSpec("Supernatural", 20, null, null),
    Arcane: new MasterSpec("Arcane", 15, (x) => {
        AllPowers.Arcane.addCap(2 * x);
        AddedDefenses.Arcane.addCapModifier(0.5 * x);
        VSDefs.Concentration.addCapModifier(1 * x);
    }, (x) => {
        AllPowers.Arcane.reduceCap(2 * x);
        AddedDefenses.Arcane.reduceCapModifier(0.5 * x);
        VSDefs.Concentration.reduceCapModifier(1 * x);
    }),
    Divine: new MasterSpec("Divine", 15, (x) => {
        AllPowers.Divine.addCap(2 * x);
        AddedDefenses.Divine.addCapModifier(0.5 * x);
        VSDefs.Concentration.addCapModifier(1 * x);
    }, (x) => {
        AllPowers.Divine.reduceCap(2 * x);
        AddedDefenses.Divine.reduceCapModifier(0.5 * x);
        VSDefs.Concentration.reduceCapModifier(1 * x);
    }),
    Primal: new MasterSpec("Primal", 15, (x) => {
        AllPowers.Primal.addCap(2 * x);
        AddedDefenses.Primal.addCapModifier(0.5 * x);
        VSDefs.Concentration.addCapModifier(1 * x);
    }, (x) => {
        AllPowers.Primal.reduceCap(2 * x);
        AddedDefenses.Primal.reduceCapModifier(0.5 * x);
        VSDefs.Concentration.reduceCapModifier(1 * x);
    })
}
AllSpecs = {
    // Martial
    Brute: new Spec("Brute", AllMasterSpecs.Martial, (x) => {
        AllPowers.Brute.addCap(3 * x);
        mainChar.cpStats.addAccuracyCap(3 * x);
        mainChar.cpStats.addDamageCap(3 * x);
        VSDefs.Destruction.addCapModifier(2 * x);
        VSDefs.HoldPos.addCapModifier(1 * x);
        VSDefs.Restraint.addCapModifier(1 * x);
        DamageTypes.Physical.addCapModifier(5 * x);
        VSDefs.Toxic.addCapModifier(2 * x);
    }, (x) => {
        AllPowers.Brute.reduceCap(3 * x);
        mainChar.cpStats.reduceAccuracyCap(3 * x);
        mainChar.cpStats.reduceDamageCap(3 * x);
        VSDefs.Destruction.reduceCapModifier(2 * x);
        VSDefs.HoldPos.reduceCapModifier(1 * x);
        VSDefs.Restraint.reduceCapModifier(1 * x);
        DamageTypes.Physical.reduceCapModifier(5 * x);
        VSDefs.Toxic.reduceCapModifier(2 * x);
    }),
    Strong: new Spec("Strong", AllMasterSpecs.Martial, (x) => {
        AllPowers.Strong.addCap(3 * x);
        mainChar.cpStats.addAccuracyCap(3 * x);
        mainChar.cpStats.addDamageCap(2 * x);
        VSDefs.Toxic.addCapModifier(2 * x);
        VSDefs.Restraint.addCapModifier(2 * x);
        VSDefs.HoldPos.addCapModifier(2 * x);
        VSDefs.Emotions.addCapModifier(1 * x);
        DamageTypes.Physical.addCapModifier(3 * x);
    }, (x) => {
        AllPowers.Strong.reduceCap(3 * x);
        mainChar.cpStats.reduceAccuracyCap(3 * x);
        mainChar.cpStats.reduceDamageCap(2 * x);
        VSDefs.Toxic.reduceCapModifier(2 * x);
        VSDefs.Restraint.reduceCapModifier(2 * x);
        VSDefs.HoldPos.reduceCapModifier(2 * x);
        VSDefs.Emotions.reduceCapModifier(1 * x);
        DamageTypes.Physical.reduceCapModifier(3 * x);
    }),
    Swift: new Spec("Swift", AllMasterSpecs.Martial, (x) => {
        AllPowers.Swift.addCap(3 * x);
        mainChar.cpStats.addAccuracyCap(3 * x);
        mainChar.cpStats.addDamageCap(3 * x);
        VSDefs.Reflex.addCapModifier(1 * x);
        VSDefs.Balance.addCapModifier(1 * x);
        mainChar.stats.movements.swim.addCapModifier(2.5 * x);
        mainChar.stats.movements.ground.addCapModifier(2.5 * x);
    }, (x) => {
        AllPowers.Swift.reduceCap(3 * x);
        mainChar.cpStats.reduceAccuracyCap(3 * x);
        mainChar.cpStats.reduceDamageCap(3 * x);
        VSDefs.Reflex.reduceCapModifier(1 * x);
        VSDefs.Balance.reduceCapModifier(1 * x);
        mainChar.stats.movements.swim.reduceCapModifier(2.5 * x);
        mainChar.stats.movements.ground.reduceCapModifier(2.5 * x);
    }),
    Technical: new Spec("Technical", AllMasterSpecs.Martial, (x) => {
        AllPowers.Technical.addCap(3 * x);
        mainChar.cpStats.addAccuracyCap(3 * x);
        mainChar.cpStats.addDamageCap(2 * x);
        VSDefs.Balance.addCapModifier(2 * x);
        VSDefs.Concentration.addCapModifier(2 * x);
        VSDefs.HoldPos.addCapModifier(2 * x);
        VSDefs.Shapechange.addCapModifier(2 * x);
    }, (x) => {
        AllPowers.Technical.reduceCap(3 * x);
        mainChar.cpStats.reduceAccuracyCap(3 * x);
        mainChar.cpStats.reduceDamageCap(2 * x);
        VSDefs.Balance.reduceCapModifier(2 * x);
        VSDefs.Concentration.reduceCapModifier(2 * x);
        VSDefs.HoldPos.reduceCapModifier(2 * x);
        VSDefs.Shapechange.reduceCapModifier(2 * x);
    }),
    Tricky: new Spec("Tricky", AllMasterSpecs.Martial, (x) => {
        AllPowers.Tricky.addCap(3 * x);
        mainChar.cpStats.addAccuracyCap(3 * x);
        mainChar.cpStats.addDamageCap(3 * x);
        VSDefs.Reflex.addCapModifier(1 * x);
        VSDefs.Scry.addCapModifier(1 * x);
        VSDefs.Compulsions.addCapModifier(2 * x);
        VSDefs.Shapechange.addCapModifier(2 * x);
    }, (x) => {
        AllPowers.Tricky.reduceCap(3 * x);
        mainChar.cpStats.reduceAccuracyCap(3 * x);
        mainChar.cpStats.reduceDamageCap(3 * x);
        VSDefs.Reflex.reduceCapModifier(1 * x);
        VSDefs.Scry.reduceCapModifier(1 * x);
        VSDefs.Compulsions.reduceCapModifier(2 * x);
        VSDefs.Shapechange.reduceCapModifier(2 * x);
    }),

    // Supernatural
    Aeromancy: new Spec("Aeromancy", AllMasterSpecs.Supernatural, (x) => {
        AllPowers.Aero.addCap(3 * x);
        DamageTypes.Cold.addCapModifier(1 * x);
        VSDefs.Reflex.addCapModifier(1 * x);
        VSDefs.Balance.addCapModifier(2 * x);
        DamageTypes.Lightning.addCapModifier(1 * x);
        mainChar.stats.movements.ground.addCapModifier(0.5 * x);
        mainChar.stats.movements.jump.addCapModifier(1 * x);
        VSEnvironments.Breathe.addCapModifier(2 * x);
    }, (x) => {
        AllPowers.Aero.reduceCap(3 * x);
        DamageTypes.Cold.reduceCapModifier(1 * x);
        VSDefs.Reflex.reduceCapModifier(1 * x);
        VSDefs.Balance.reduceCapModifier(2 * x);
        DamageTypes.Lightning.reduceCapModifier(1 * x);
        mainChar.stats.movements.ground.reduceCapModifier(0.5 * x);
        mainChar.stats.movements.jump.reduceCapModifier(1 * x);
        VSEnvironments.Breathe.reduceCapModifier(2 * x);
    }),
    Chloromancy: new Spec("Chloromancy", AllMasterSpecs.Supernatural, (x) => {
        AllPowers.Plant.addCap(3 * x);
        DamageTypes.Physical.addCapModifier(5 * x);
        VSDefs.Toxic.addCapModifier(2 * x);
        VSDefs.HoldPos.addCapModifier(3 * x);
        VSDefs.Restraint.addCapModifier(3 * x);
        VSDefs.Compulsions.addCapModifier(3 * x);
        VSDefs.Emotions.addCapModifier(2 * x);
    }, (x) => {
        AllPowers.Plant.reduceCap(3 * x);
        DamageTypes.Physical.reduceCapModifier(5 * x);
        VSDefs.Toxic.reduceCapModifier(2 * x);
        VSDefs.HoldPos.reduceCapModifier(3 * x);
        VSDefs.Restraint.reduceCapModifier(3 * x);
        VSDefs.Compulsions.reduceCapModifier(3 * x);
        VSDefs.Emotions.reduceCapModifier(2 * x);
    }),
    Inquisitory: new Spec("Inquisitory", AllMasterSpecs.Supernatural, (x) => {
        AllPowers.Inquisitory.addCap(3 * x);
        VSDefs.Compulsions.addCapModifier(2 * x);
        VSDefs.Scry.addCapModifier(2 * x);
        VSDefs.Emotions.addCapModifier(2 * x);
        VSDefs.Concentration.addCapModifier(2 * x);
        VSDefs.Shapechange.addCapModifier(2 * x);

        // Senses
        VSEnvironments.Spot.addCapModifier(2 * x);
        VSEnvironments.Listen.addCapModifier(2 * x);
        VSEnvironments.Scent.addCapModifier(2 * x);
    }, (x) => {
        AllPowers.Inquisitory.reduceCap(3 * x);
        VSDefs.Compulsions.reduceCapModifier(2 * x);
        VSDefs.Scry.reduceCapModifier(2 * x);
        VSDefs.Emotions.reduceCapModifier(2 * x);
        VSDefs.Concentration.reduceCapModifier(2 * x);
        VSDefs.Shapechange.reduceCapModifier(2 * x);

        // Senses
        VSEnvironments.Spot.reduceCapModifier(2 * x);
        VSEnvironments.Listen.reduceCapModifier(2 * x);
        VSEnvironments.Scent.reduceCapModifier(2 * x);
    }),
    Exorcism: new Spec("Exorcism", AllMasterSpecs.Supernatural, (x) => {
        AllPowers.Exorcism.addCap(3 * x);
        VSDefs.Compulsions.addCapModifier(2 * x);
        VSDefs.Emotions.addCapModifier(2 * x);
        VSDefs.Destruction.addCapModifier(2 * x);
        VSDefs.Restraint.addCapModifier(2 * x);
        VSDefs.Scry.addCapModifier(2 * x);
        DamageTypes.PosEnergy.addCapModifier(2 * x);
        DamageTypes.NegEnergy.addCapModifier(2 * x);
    }, (x) => {
        AllPowers.Exorcism.reduceCap(3 * x);
        VSDefs.Compulsions.reduceCapModifier(2 * x);
        VSDefs.Emotions.reduceCapModifier(2 * x);
        VSDefs.Destruction.reduceCapModifier(2 * x);
        VSDefs.Restraint.reduceCapModifier(2 * x);
        VSDefs.Scry.reduceCapModifier(2 * x);
        DamageTypes.PosEnergy.reduceCapModifier(2 * x);
        DamageTypes.NegEnergy.reduceCapModifier(2 * x);
    }),
    Order: new Spec("Order", AllMasterSpecs.Supernatural, (x) => {
        AllPowers.Order.addCap(3 * x);
        AddedDefenses.Chaotic.addCapModifier(2 * x);
        VSDefs.Compulsions.addCapModifier(3 * x);
        VSDefs.Shapechange.addCapModifier(3 * x);
        VSDefs.Destruction.addCapModifier(3 * x);
        VSDefs.Emotions.addCapModifier(2 * x);
    }, (x) => {
        AllPowers.Order.reduceCap(3 * x);
        AddedDefenses.Chaotic.reduceCapModifier(2 * x);
        VSDefs.Compulsions.reduceCapModifier(3 * x);
        VSDefs.Shapechange.reduceCapModifier(3 * x);
        VSDefs.Destruction.reduceCapModifier(3 * x);
        VSDefs.Emotions.reduceCapModifier(2 * x);
    }),
    Aquamancy: new Spec("Aquamancy", AllMasterSpecs.Supernatural, (x) => {
        mainChar.stats.movements.swim.addCapModifier(1 * x);
        VSEnvironments.Breathe.addCapModifier(3 * x);
        DamageTypes.Cold.addCapModifier(1 * x);
        DamageTypes.Fire.addCapModifier(1 * x);
        VSDefs.Toxic.addCapModifier(2 * x);
        VSDefs.Restraint.addCapModifier(2 * x);
        VSDefs.Emotions.addCapModifier(2 * x);
    }, (x) => {
        mainChar.stats.movements.swim.reduceCapModifier(1 * x);
        VSEnvironments.Breathe.reduceCapModifier(3 * x);
        DamageTypes.Cold.reduceCapModifier(1 * x);
        DamageTypes.Fire.reduceCapModifier(1 * x);
        VSDefs.Toxic.reduceCapModifier(2 * x);
        VSDefs.Restraint.reduceCapModifier(2 * x);
        VSDefs.Emotions.reduceCapModifier(2 * x);
    }),
    Cryomancy: new Spec("Cryomancy", AllMasterSpecs.Supernatural, (x) => {
        AllPowers.Cold.addCap(3 * x);
        DamageTypes.Cold.addCapModifier(2 * x);
        DamageTypes.Fire.addCapModifier(1 * x);
        DamageTypes.Slashing.addCapModifier(4 * x);
        VSDefs.Toxic.addCapModifier(2 * x);
        VSDefs.Grip.addCapModifier(2 * x);
        VSDefs.Balance.addCapModifier(2 * x);
        VSDefs.Emotions.addCapModifier(2 * x);
    }, (x) => {
        AllPowers.Cold.reduceCap(3 * x);
        DamageTypes.Cold.reduceCapModifier(2 * x);
        DamageTypes.Fire.reduceCapModifier(1 * x);
        DamageTypes.Slashing.reduceCapModifier(4 * x);
        VSDefs.Toxic.reduceCapModifier(2 * x);
        VSDefs.Grip.reduceCapModifier(2 * x);
        VSDefs.Balance.reduceCapModifier(2 * x);
        VSDefs.Emotions.reduceCapModifier(2 * x);
    }),
    Healing: new Spec("Healing", AllMasterSpecs.Supernatural, (x) => {
        AllPowers.Healing.addCap(3 * x);
        DamageTypes.PosEnergy.addCapModifier(2 * x);
        DamageTypes.NegEnergy.addCapModifier(2 * x);
        VSDefs.Destruction.addCapModifier(3 * x);
        VSDefs.Emotions.addCapModifier(2 * x);
        VSDefs.Toxic.addCapModifier(3 * x);
        VSEnvironments.Breathe.addCapModifier(3 * x);
    }, (x) => {
        AllPowers.Healing.reduceCap(3 * x);
        DamageTypes.PosEnergy.reduceCapModifier(2 * x);
        DamageTypes.NegEnergy.reduceCapModifier(2 * x);
        VSDefs.Destruction.reduceCapModifier(3 * x);
        VSDefs.Emotions.reduceCapModifier(2 * x);
        VSDefs.Toxic.reduceCapModifier(3 * x);
        VSEnvironments.Breathe.reduceCapModifier(3 * x);
    }),
    Magnetism: new Spec("Magnetism", AllMasterSpecs.Supernatural, (x) => {
        AllPowers.Magnet.addCap(3 * x);
        VSDefs.Grip.addCapModifier(3 * x);
        VSDefs.HoldPos.addCapModifier(3 * x);
        VSDefs.Restraint.addCapModifier(2 * x);
        VSDefs.Balance.addCapModifier(3 * x);
        mainChar.stats.movements.jump.addCapModifier(2 * x);
    }, (x) => {
        AllPowers.Magnet.reduceCap(3 * x);
        VSDefs.Grip.reduceCapModifier(3 * x);
        VSDefs.HoldPos.reduceCapModifier(3 * x);
        VSDefs.Restraint.reduceCapModifier(2 * x);
        VSDefs.Balance.reduceCapModifier(3 * x);
        mainChar.stats.movements.jump.reduceCapModifier(2 * x);
    }),
    Entropy: new Spec("Entropy", AllMasterSpecs.Supernatural, (x) => {
        AllPowers.Entropy.addCap(3 * x);
        VSDefs.Destruction.addCapModifier(3 * x);
        VSDefs.Toxic.addCapModifier(2 * x);
        VSDefs.Emotions.addCapModifier(3 * x);
        VSDefs.Shapechange.addCapModifier(3 * x);
    }, (x) => {
        AllPowers.Entropy.reduceCap(3 * x);
        VSDefs.Destruction.reduceCapModifier(3 * x);
        VSDefs.Toxic.reduceCapModifier(2 * x);
        VSDefs.Emotions.reduceCapModifier(3 * x);
        VSDefs.Shapechange.reduceCapModifier(3 * x);
    }),
    Geomancy: new Spec("Geomancy", AllMasterSpecs.Supernatural, (x) => {
        AllPowers.Earth.addCap(3 * x);
        VSDefs.HoldPos.addCapModifier(3 * x);
        VSDefs.Emotions.addCapModifier(2 * x);
        VSDefs.Grip.addCapModifier(2 * x);
        DamageTypes.Physical.addCapModifier(4 * x);
        DamageTypes.Acid.addCapModifier(4 * x);
        VSDefs.Toxic.addCapModifier(2 * x);
        DamageTypes.Fire.addCapModifier(1 * x);
        DamageTypes.Cold.addCapModifier(1 * x);
    }, (x) => {
        AllPowers.Earth.reduceCap(3 * x);
        VSDefs.HoldPos.reduceCapModifier(3 * x);
        VSDefs.Emotions.reduceCapModifier(2 * x);
        VSDefs.Grip.reduceCapModifier(2 * x);
        DamageTypes.Physical.reduceCapModifier(4 * x);
        DamageTypes.Acid.reduceCapModifier(4 * x);
        VSDefs.Toxic.reduceCapModifier(2 * x);
        DamageTypes.Fire.reduceCapModifier(1 * x);
        DamageTypes.Cold.reduceCapModifier(1 * x);
    }),
    Chronomancy: new Spec("Chronomancy", AllMasterSpecs.Supernatural, (x) => {
        AllPowers.Time.addCap(3 * x);
        mainChar.stats.movements.ground.addCapModifier(2 * x);
        mainChar.stats.movements.swim.addCapModifier(2 * x);
        VSDefs.Reflex.addCapModifier(2 * x);
        VSEnvironments.Surprise.addCapModifier(2 * x);
        VSDefs.Destruction.addCapModifier(2 * x);
    }, (x) => {
        AllPowers.Time.reduceCap(3 * x);
        mainChar.stats.movements.ground.reduceCapModifier(2 * x);
        mainChar.stats.movements.swim.reduceCapModifier(2 * x);
        VSDefs.Reflex.reduceCapModifier(2 * x);
        VSEnvironments.Surprise.reduceCapModifier(2 * x);
        VSDefs.Destruction.reduceCapModifier(2 * x);
    }),
    Holy: new Spec("Holy", AllMasterSpecs.Supernatural, (x) => {
        AllPowers.Holy.addCap(3 * x);
        AddedDefenses.Evil.addCapModifier(2 * x);
        DamageTypes.PosEnergy.addCapModifier(2 * x);
        DamageTypes.NegEnergy.addCapModifier(2 * x);
        VSDefs.Emotions.addCapModifier(2 * x);
        VSDefs.Compulsions.addCapModifier(2 * x);
        VSDefs.Destruction.addCapModifier(3 * x);
    }, (x) => {
        AllPowers.Holy.reduceCap(3 * x);
        AddedDefenses.Evil.reduceCapModifier(2 * x);
        DamageTypes.PosEnergy.reduceCapModifier(2 * x);
        DamageTypes.NegEnergy.reduceCapModifier(2 * x);
        VSDefs.Emotions.reduceCapModifier(2 * x);
        VSDefs.Compulsions.reduceCapModifier(2 * x);
        VSDefs.Destruction.reduceCapModifier(3 * x);
    }),
    Gravitational: new Spec("Gravitational", AllMasterSpecs.Supernatural, (x) => {
        AllPowers.Gravity.addCap(3 * x);
        mainChar.stats.movements.jump.addCapModifier(2 * x);
        VSDefs.Balance.addCapModifier(2 * x);
        VSDefs.HoldPos.addCapModifier(2 * x);
        mainChar.stats.movements.ground.addCapModifier(2 * x);
        VSDefs.Destruction.addCapModifier(2 * x);
    }, (x) => {
        AllPowers.Gravity.reduceCap(3 * x);
        mainChar.stats.movements.jump.reduceCapModifier(2 * x);
        VSDefs.Balance.reduceCapModifier(2 * x);
        VSDefs.HoldPos.reduceCapModifier(2 * x);
        mainChar.stats.movements.ground.reduceCapModifier(2 * x);
        VSDefs.Destruction.reduceCapModifier(2 * x);
    }),
    LordshipCreature: new Spec("Lordship: Creature", AllMasterSpecs.Supernatural, (x, mvmnt, def1, def2, dr) => {
        AllPowers.Animal.addCap(3 * x);
        // Senses
        VSEnvironments.Spot.addCapModifier(1 * x);
        VSEnvironments.Listen.addCapModifier(1 * x);
        VSEnvironments.Scent.addCapModifier(1 * x);

        // Movement Selection
        if (mvmnt == "Ground") mainChar.stats.movements.ground.addCapModifier(1 * x);
        else if (mvmnt == "Swim") mainChar.stats.movements.swim.addCapModifier(1 * x);
        else if (mvmnt == "Climb") mainChar.stats.movements.climb.addCapModifier(1 * x);
        else if (mvmnt == "Jump") mainChar.stats.movements.jump.addCapModifier(1 * x);
        else if (mvmnt == "Burrow") mainChar.stats.movements.burrow.addCapModifier(1 * x);
        else if (mvmnt == "Flight") mainChar.stats.movements.flight.addCapModifier(1 * x);

        // DR Selection
        if (dr == "Physical") DamageTypes.Physical.addCapModifier(2 * x);
        else if (dr == "Blunt") DamageTypes.Blunt.addCapModifier(2 * x);
        else if (dr == "Slashing") DamageTypes.Slashing.addCapModifier(2 * x);
        else if (dr == "Piercing") DamageTypes.Piercing.addCapModifier(2 * x);
        else if (dr == "NegEnergy") DamageTypes.NegEnergy.addCapModifier(2 * x);
        else if (dr == "PosEnergy") DamageTypes.PosEnergy.addCapModifier(2 * x);
        else if (dr == "Fire") DamageTypes.Fire.addCapModifier(2 * x);
        else if (dr == "Cold") DamageTypes.Cold.addCapModifier(2 * x);
        else if (dr == "Lightning") DamageTypes.Lightning.addCapModifier(2 * x);
        else if (dr == "Acid") DamageTypes.Acid.addCapModifier(2 * x);
        else if (dr == "Sonic") DamageTypes.Sonic.addCapModifier(2 * x);
        else if (dr == "Radiation") DamageTypes.Radiation.addCapModifier(2 * x);

        // Defense Selection
        let defSelection = (c) => {
            if (c == "Reflex") VSDefs.Reflex.addCapModifier(2 * x);
            else if (c == "Shapechange") VSDefs.Shapechange.addCapModifier(2 * x);
            else if (c == "Balance") VSDefs.Balance.addCapModifier(2 * x);
            else if (c == "Toxic") VSDefs.Toxic.addCapModifier(2 * x);
            else if (c == "Destruction") VSDefs.Destruction.addCapModifier(2 * x);
            else if (c == "HoldPos") VSDefs.HoldPos.addCapModifier(2 * x);
            else if (c == "Compulsions") VSDefs.Compulsions.addCapModifier(2 * x);
            else if (c == "Emotions") VSDefs.Emotions.addCapModifier(2 * x);
            else if (c == "Concentration") VSDefs.Concentration.addCapModifier(2 * x);
            else if (c == "Scry") VSDefs.Scry.addCapModifier(2 * x);
            else if (c == "Grip") VSDefs.Grip.addCapModifier(2 * x);
            else if (c == "Restraint") VSDefs.Restraint.addCapModifier(2 * x);
        }

        defSelection(def1);
        defSelection(def2);
    }, (x, mvmnt, def1, def2, dr) => {
        AllPowers.Animal.reduceCap(3 * x);
        // Senses
        VSEnvironments.Spot.reduceCapModifier(1 * x);
        VSEnvironments.Listen.reduceCapModifier(1 * x);
        VSEnvironments.Scent.reduceCapModifier(1 * x);

        // Movement Selection
        if (mvmnt == "Ground") mainChar.stats.movements.ground.reduceCapModifier(1 * x);
        else if (mvmnt == "Swim") mainChar.stats.movements.swim.reduceCapModifier(1 * x);
        else if (mvmnt == "Climb") mainChar.stats.movements.climb.reduceCapModifier(1 * x);
        else if (mvmnt == "Jump") mainChar.stats.movements.jump.reduceCapModifier(1 * x);
        else if (mvmnt == "Burrow") mainChar.stats.movements.burrow.reduceCapModifier(1 * x);
        else if (mvmnt == "Flight") mainChar.stats.movements.flight.reduceCapModifier(1 * x);

        // DR Selection
        if (dr == "Physical") DamageTypes.Physical.reduceCapModifier(2 * x);
        else if (dr == "Blunt") DamageTypes.Blunt.reduceCapModifier(2 * x);
        else if (dr == "Slashing") DamageTypes.Slashing.reduceCapModifier(2 * x);
        else if (dr == "Piercing") DamageTypes.Piercing.reduceCapModifier(2 * x);
        else if (dr == "NegEnergy") DamageTypes.NegEnergy.reduceCapModifier(2 * x);
        else if (dr == "PosEnergy") DamageTypes.PosEnergy.reduceCapModifier(2 * x);
        else if (dr == "Fire") DamageTypes.Fire.reduceCapModifier(2 * x);
        else if (dr == "Cold") DamageTypes.Cold.reduceCapModifier(2 * x);
        else if (dr == "Lightning") DamageTypes.Lightning.reduceCapModifier(2 * x);
        else if (dr == "Acid") DamageTypes.Acid.reduceCapModifier(2 * x);
        else if (dr == "Sonic") DamageTypes.Sonic.reduceCapModifier(2 * x);
        else if (dr == "Radiation") DamageTypes.Radiation.reduceCapModifier(2 * x);

        // Defense Selection
        let defSelection = (c) => {
            if (c == "Spot") VSEnvironments.Spot.reduceCapModifier(2 * x);
            else if (c == "Listen") VSEnvironments.Listen.reduceCapModifier(2 * x);
            else if (c == "Scent") VSEnvironments.Scent.reduceCapModifier(2 * x);
            else if (c == "Traps") VSEnvironments.Traps.reduceCapModifier(2 * x);
            else if (c == "EnvHot") VSEnvironments.EnvHot.reduceCapModifier(2 * x);
            else if (c == "EnvCold") VSEnvironments.EnvCold.reduceCapModifier(2 * x);
            else if (c == "Breathe") VSEnvironments.Breathe.reduceCapModifier(2 * x);
            else if (c == "Surprise") VSEnvironments.Surprise.reduceCapModifier(2 * x);

            else if (c == "Reflex") VSDefs.Reflex.reduceCapModifier(2 * x);
            else if (c == "Shapechange") VSDefs.Shapechange.reduceCapModifier(2 * x);
            else if (c == "Balance") VSDefs.Balance.reduceCapModifier(2 * x);
            else if (c == "Toxic") VSDefs.Toxic.reduceCapModifier(2 * x);
            else if (c == "Destruction") VSDefs.Destruction.reduceCapModifier(2 * x);
            else if (c == "HoldPos") VSDefs.HoldPos.reduceCapModifier(2 * x);
            else if (c == "Compulsions") VSDefs.Compulsions.reduceCapModifier(2 * x);
            else if (c == "Emotions") VSDefs.Emotions.reduceCapModifier(2 * x);
            else if (c == "Concentration") VSDefs.Concentration.reduceCapModifier(2 * x);
            else if (c == "Scry") VSDefs.Scry.reduceCapModifier(2 * x);
            else if (c == "Grip") VSDefs.Grip.reduceCapModifier(2 * x);
            else if (c == "Restraint") VSDefs.Restraint.reduceCapModifier(2 * x);

            else if (c == "Physical") DamageTypes.Physical.reduceCapModifier(2 * x);
            else if (c == "Blunt") DamageTypes.Blunt.reduceCapModifier(2 * x);
            else if (c == "Slashing") DamageTypes.Slashing.reduceCapModifier(2 * x);
            else if (c == "Piercing") DamageTypes.Piercing.reduceCapModifier(2 * x);
            else if (c == "NegEnergy") DamageTypes.NegEnergy.reduceCapModifier(2 * x);
            else if (c == "PosEnergy") DamageTypes.PosEnergy.reduceCapModifier(2 * x);
            else if (c == "Fire") DamageTypes.Fire.reduceCapModifier(2 * x);
            else if (c == "Cold") DamageTypes.Cold.reduceCapModifier(2 * x);
            else if (c == "Lightning") DamageTypes.Lightning.reduceCapModifier(2 * x);
            else if (c == "Acid") DamageTypes.Acid.reduceCapModifier(2 * x);
            else if (c == "Sonic") DamageTypes.Sonic.reduceCapModifier(2 * x);
            else if (c == "Radiation") DamageTypes.Radiation.reduceCapModifier(2 * x);

            else if (c == "Magic") AddedDefenses.Magic.reduceCapModifier(2 * x);
            else if (c == "Arcane") AddedDefenses.Arcane.reduceCapModifier(2 * x);
            else if (c == "Divine") AddedDefenses.Divine.reduceCapModifier(2 * x);
            else if (c == "Primal") AddedDefenses.Primal.reduceCapModifier(2 * x);
            else if (c == "Blood") AddedDefenses.Blood.reduceCapModifier(2 * x);
            else if (c == "Gem") AddedDefenses.Gem.reduceCapModifier(2 * x);
            else if (c == "Witchcraft") AddedDefenses.Witchcraft.reduceCapModifier(2 * x);
            else if (c == "Psionics") AddedDefenses.Psionics.reduceCapModifier(2 * x);
            else if (c == "Technology") AddedDefenses.Technology.reduceCapModifier(2 * x);
            else if (c == "Nature") AddedDefenses.Nature.reduceCapModifier(2 * x);
            else if (c == "Luck") AddedDefenses.Luck.reduceCapModifier(2 * x);
            else if (c == "Illusion") AddedDefenses.Illusion.reduceCapModifier(2 * x);

            else if (c == "Blades") AddedDefenses.Blades.reduceCapModifier(2 * x);
            else if (c == "Axe") AddedDefenses.Axe.reduceCapModifier(2 * x);
            else if (c == "MaceHammer") AddedDefenses.MaceHammer.reduceCapModifier(2 * x);
            else if (c == "Polearms") AddedDefenses.Polearms.reduceCapModifier(2 * x);
            else if (c == "Bows") AddedDefenses.Bows.reduceCapModifier(2 * x);
            else if (c == "Guns") AddedDefenses.Guns.reduceCapModifier(2 * x);
            else if (c == "Crossbows") AddedDefenses.Crossbows.reduceCapModifier(2 * x);

            else if (c == "Metal") AddedDefenses.Metal.reduceCapModifier(2 * x);
            else if (c == "Stone") AddedDefenses.Stone.reduceCapModifier(2 * x);
            else if (c == "Bone") AddedDefenses.Bone.reduceCapModifier(2 * x);

            else if (c == "LawfulGood") AddedDefenses.LawfulGood.reduceCapModifier(2 * x);
            else if (c == "ChaoticGood") AddedDefenses.ChaoticGood.reduceCapModifier(2 * x);
            else if (c == "NeutralGood") AddedDefenses.NeutralGood.reduceCapModifier(2 * x);
            else if (c == "LawfulNeutral") AddedDefenses.LawfulNeutral.reduceCapModifier(2 * x);
            else if (c == "TrueNeutral") AddedDefenses.TrueNeutral.reduceCapModifier(2 * x);
            else if (c == "ChaoticNeutral") AddedDefenses.ChaoticNeutral.reduceCapModifier(2 * x);
            else if (c == "NeutralEvil") AddedDefenses.NeutralEvil.reduceCapModifier(2 * x);
            else if (c == "LawfulEvil") AddedDefenses.LawfulEvil.reduceCapModifier(2 * x);
            else if (c == "ChaoticEvil") AddedDefenses.ChaoticEvil.reduceCapModifier(2 * x);

            else if (c == "Lawful") AddedDefenses.Lawful.reduceCapModifier(2 * x);
            else if (c == "Chaotic") AddedDefenses.Chaotic.reduceCapModifier(2 * x);
            else if (c == "Good") AddedDefenses.Good.reduceCapModifier(2 * x);
            else if (c == "Evil") AddedDefenses.Evil.reduceCapModifier(2 * x);
            else if (c == "Neutral") AddedDefenses.Neutral.reduceCapModifier(2 * x);
        }

        defSelection(def1);
        defSelection(def2);
    }),
    Pyromancy: new Spec("Pyromancy", AllMasterSpecs.Supernatural, (x) => {
        AllPowers.Fire.addCap(3 * x);
        DamageTypes.Fire.addCapModifier(2 * x);
        DamageTypes.Cold.addCapModifier(1 * x);
        VSDefs.Reflex.addCapModifier(1 * x);
        VSDefs.Toxic.addCapModifier(2 * x);
        mainChar.stats.movements.ground.addCapModifier(2 * x);
        VSDefs.Destruction.addCapModifier(2 * x);
    }, (x) => {
        AllPowers.Fire.reduceCap(3 * x);
        DamageTypes.Fire.reduceCapModifier(2 * x);
        DamageTypes.Cold.reduceCapModifier(1 * x);
        VSDefs.Reflex.reduceCapModifier(1 * x);
        VSDefs.Toxic.reduceCapModifier(2 * x);
        mainChar.stats.movements.ground.reduceCapModifier(2 * x);
        VSDefs.Destruction.reduceCapModifier(2 * x);
    }),
    Restructuring: new Spec("Restructuring", AllMasterSpecs.Supernatural, (x) => {
        AllPowers.Shapeshift.addCap(3 * x);
        VSDefs.Shapechange.addCapModifier(3 * x);
        DamageTypes.Fire.addCapModifier(1 * x);
        DamageTypes.Cold.addCapModifier(1 * x);
        DamageTypes.Lightning.addCapModifier(1 * x);
        DamageTypes.Acid.addCapModifier(1 * x);

        // Senses
        VSEnvironments.Spot.addCapModifier(1 * x);
        VSEnvironments.Listen.addCapModifier(1 * x);
        VSEnvironments.Scent.addCapModifier(1 * x);

        // All Movements
        mainChar.stats.movements.ground.addCapModifier(3 * x);
        mainChar.stats.movements.swim.addCapModifier(3 * x);
        mainChar.stats.movements.climb.addCapModifier(3 * x);
        mainChar.stats.movements.jump.addCapModifier(3 * x);
        mainChar.stats.movements.burrow.addCapModifier(3 * x);
        mainChar.stats.movements.flight.addCapModifier(3 * x);
    }, (x) => {
        AllPowers.Shapeshift.reduceCap(3 * x);
        VSDefs.Shapechange.reduceCapModifier(3 * x);
        DamageTypes.Fire.reduceCapModifier(1 * x);
        DamageTypes.Cold.reduceCapModifier(1 * x);
        DamageTypes.Lightning.reduceCapModifier(1 * x);
        DamageTypes.Acid.reduceCapModifier(1 * x);

        // Senses
        VSEnvironments.Spot.reduceCapModifier(1 * x);
        VSEnvironments.Listen.reduceCapModifier(1 * x);
        VSEnvironments.Scent.reduceCapModifier(1 * x);

        // All Movements
        mainChar.stats.movements.ground.reduceCapModifier(3 * x);
        mainChar.stats.movements.swim.reduceCapModifier(3 * x);
        mainChar.stats.movements.climb.reduceCapModifier(3 * x);
        mainChar.stats.movements.jump.reduceCapModifier(3 * x);
        mainChar.stats.movements.burrow.reduceCapModifier(3 * x);
        mainChar.stats.movements.flight.reduceCapModifier(3 * x);
    }),
    Shifting: new Spec("Shifting", AllMasterSpecs.Supernatural, (x) => {
        AllPowers.Shapeshift.addCap(3 * x);
        VSDefs.Shapechange.addCapModifier(3 * x);
        DamageTypes.Fire.addCapModifier(1 * x);
        DamageTypes.Cold.addCapModifier(1 * x);
        DamageTypes.Lightning.addCapModifier(1 * x);
        DamageTypes.Acid.addCapModifier(1 * x);

        // Senses
        VSEnvironments.Spot.addCapModifier(1 * x);
        VSEnvironments.Listen.addCapModifier(1 * x);
        VSEnvironments.Scent.addCapModifier(1 * x);

        // All Movements
        mainChar.stats.movements.ground.addCapModifier(3 * x);
        mainChar.stats.movements.swim.addCapModifier(3 * x);
        mainChar.stats.movements.climb.addCapModifier(3 * x);
        mainChar.stats.movements.jump.addCapModifier(3 * x);
        mainChar.stats.movements.burrow.addCapModifier(3 * x);
        mainChar.stats.movements.flight.addCapModifier(3 * x);
    }, (x) => {
        AllPowers.Shapeshift.reduceCap(3 * x);
        VSDefs.Shapechange.reduceCapModifier(3 * x);
        DamageTypes.Fire.reduceCapModifier(1 * x);
        DamageTypes.Cold.reduceCapModifier(1 * x);
        DamageTypes.Lightning.reduceCapModifier(1 * x);
        DamageTypes.Acid.reduceCapModifier(1 * x);

        // Senses
        VSEnvironments.Spot.reduceCapModifier(1 * x);
        VSEnvironments.Listen.reduceCapModifier(1 * x);
        VSEnvironments.Scent.reduceCapModifier(1 * x);

        // All Movements
        mainChar.stats.movements.ground.reduceCapModifier(3 * x);
        mainChar.stats.movements.swim.reduceCapModifier(3 * x);
        mainChar.stats.movements.climb.reduceCapModifier(3 * x);
        mainChar.stats.movements.jump.reduceCapModifier(3 * x);
        mainChar.stats.movements.burrow.reduceCapModifier(3 * x);
        mainChar.stats.movements.flight.reduceCapModifier(3 * x);
    }),
    Unholy: new Spec("Unholy", AllMasterSpecs.Supernatural, (x) => {
        AllPowers.Unholy.addCap(3 * x);
        DamageTypes.PosEnergy.addCapModifier(2 * x);
        DamageTypes.NegEnergy.addCapModifier(2 * x);
        AddedDefenses.Good.addCapModifier(2 * x);
        VSDefs.Compulsions.addCapModifier(2 * x);
        VSDefs.Destruction.addCapModifier(3 * x);
        VSDefs.Emotions.addCapModifier(2 * x);
    }, (x) => {
        AllPowers.Unholy.reduceCap(3 * x);
        DamageTypes.PosEnergy.reduceCapModifier(2 * x);
        DamageTypes.NegEnergy.reduceCapModifier(2 * x);
        AddedDefenses.Good.reduceCapModifier(2 * x);
        VSDefs.Compulsions.reduceCapModifier(2 * x);
        VSDefs.Destruction.reduceCapModifier(3 * x);
        VSDefs.Emotions.reduceCapModifier(2 * x);
    }),
    Metalmancy: new Spec("Metalmancy", AllMasterSpecs.Supernatural, (x) => {
        AllPowers.Metal.addCap(3 * x);
        AddedDefenses.Metal.addCapModifier(3 * x);
        VSDefs.Toxic.addCapModifier(3 * x);
        VSDefs.Destruction.addCapModifier(2 * x);
        DamageTypes.Physical.addCapModifier(5 * x);
        DamageTypes.Sonic.addCapModifier(2 * x);
        DamageTypes.Radiation.addCapModifier(3 * x);
    }, (x) => {
        AllPowers.Metal.reduceCap(3 * x);
        AddedDefenses.Metal.reduceCapModifier(3 * x);
        VSDefs.Toxic.reduceCapModifier(3 * x);
        VSDefs.Destruction.reduceCapModifier(2 * x);
        DamageTypes.Physical.reduceCapModifier(5 * x);
        DamageTypes.Sonic.reduceCapModifier(2 * x);
        DamageTypes.Radiation.reduceCapModifier(3 * x);
    }),
    LordshipSpring: new Spec("Lordship: Spring", AllMasterSpecs.Supernatural, (x) => {
        AllPowers.Spring.addCap(3 * x);
        VSDefs.Emotions.addCapModifier(2 * x);
        VSDefs.Compulsions.addCapModifier(2 * x);
        VSDefs.Destruction.addCapModifier(2 * x);
        DamageTypes.Fire.addCapModifier(2 * x);
        DamageTypes.Cold.addCapModifier(1 * x);
        mainChar.stats.movements.ground.addCapModifier(1 * x);
    }, (x) => {
        AllPowers.Spring.reduceCap(3 * x);
        VSDefs.Emotions.reduceCapModifier(2 * x);
        VSDefs.Compulsions.reduceCapModifier(2 * x);
        VSDefs.Destruction.reduceCapModifier(2 * x);
        DamageTypes.Fire.reduceCapModifier(2 * x);
        DamageTypes.Cold.reduceCapModifier(1 * x);
        mainChar.stats.movements.ground.reduceCapModifier(1 * x);
    }),
    Shadowmancy: new Spec("Shadowmancy", AllMasterSpecs.Supernatural, (x) => {
        AllPowers.Shadow.addCap(3 * x);
        DamageTypes.PosEnergy.addCapModifier(1 * x);
        DamageTypes.Cold.addCapModifier(2 * x);
        DamageTypes.NegEnergy.addCapModifier(2 * x);
        VSDefs.Destruction.addCapModifier(2 * x);
        VSDefs.Compulsions.addCapModifier(2 * x);
        VSDefs.Scry.addCapModifier(2 * x);
        VSDefs.Reflex.addCapModifier(1 * x);
    }, (x) => {
        AllPowers.Shadow.reduceCap(3 * x);
        DamageTypes.PosEnergy.reduceCapModifier(1 * x);
        DamageTypes.Cold.reduceCapModifier(2 * x);
        DamageTypes.NegEnergy.reduceCapModifier(2 * x);
        VSDefs.Destruction.reduceCapModifier(2 * x);
        VSDefs.Compulsions.reduceCapModifier(2 * x);
        VSDefs.Scry.reduceCapModifier(2 * x);
        VSDefs.Reflex.reduceCapModifier(1 * x);
    }),
    Imbuing: new Spec("Imbuing", AllMasterSpecs.Supernatural, (x) => {
        AllPowers.Imbue.addCap(3 * x);
        DamageTypes.Physical.addCapModifier(4 * x);
        DamageTypes.Lightning.addCapModifier(1 * x);
        DamageTypes.Acid.addCapModifier(1 * x);
        DamageTypes.Sonic.addCapModifier(1 * x);
        DamageTypes.Fire.addCapModifier(1 * x);
        DamageTypes.Cold.addCapModifier(1 * x);
        DamageTypes.Radiation.addCapModifier(1 * x);
        VSDefs.Destruction.addCapModifier(2 * x);
        VSDefs.Shapechange.addCapModifier(2 * x);
    }, (x) => {
        AllPowers.Imbue.reduceCap(3 * x);
        DamageTypes.Physical.reduceCapModifier(4 * x);
        DamageTypes.Lightning.reduceCapModifier(1 * x);
        DamageTypes.Acid.reduceCapModifier(1 * x);
        DamageTypes.Sonic.reduceCapModifier(1 * x);
        DamageTypes.Fire.reduceCapModifier(1 * x);
        DamageTypes.Cold.reduceCapModifier(1 * x);
        DamageTypes.Radiation.reduceCapModifier(1 * x);
        VSDefs.Destruction.reduceCapModifier(2 * x);
        VSDefs.Shapechange.reduceCapModifier(2 * x);
    }),
    TrueNecromancy: new Spec("True Necromancy", AllMasterSpecs.Supernatural, (x) => {
        AllPowers.TrueNec.addCap(3 * x);
        DamageTypes.NegEnergy.addCapModifier(2 * x);
        DamageTypes.PosEnergy.addCapModifier(1 * x);
        DamageTypes.Cold.addCapModifier(2 * x);
        VSDefs.Destruction.addCapModifier(3 * x);
        VSDefs.Toxic.addCapModifier(2 * x);
        VSDefs.Emotions.addCapModifier(2 * x);
    }, (x) => {
        AllPowers.TrueNec.reduceCap(3 * x);
        DamageTypes.NegEnergy.reduceCapModifier(2 * x);
        DamageTypes.PosEnergy.reduceCapModifier(1 * x);
        DamageTypes.Cold.reduceCapModifier(2 * x);
        VSDefs.Destruction.reduceCapModifier(3 * x);
        VSDefs.Toxic.reduceCapModifier(2 * x);
        VSDefs.Emotions.reduceCapModifier(2 * x);
    }),
    Beguiling: new Spec("Beguiling", AllMasterSpecs.Supernatural, (x) => {
        AllPowers.Beguile.addCap(3 * x);
        VSDefs.Emotions.addCapModifier(3 * x);
        VSDefs.Compulsions.addCapModifier(3 * x);
        VSDefs.Concentration.addCapModifier(3 * x);
        VSDefs.Destruction.addCapModifier(2 * x);
        VSDefs.Shapechange.addCapModifier(2 * x);
    }, (x) => {
        AllPowers.Beguile.reduceCap(3 * x);
        VSDefs.Emotions.reduceCapModifier(3 * x);
        VSDefs.Compulsions.reduceCapModifier(3 * x);
        VSDefs.Concentration.reduceCapModifier(3 * x);
        VSDefs.Destruction.reduceCapModifier(2 * x);
        VSDefs.Shapechange.reduceCapModifier(2 * x);
    }),
    LordshipSummer: new Spec("Lordship: Summer", AllMasterSpecs.Supernatural, (x) => {
        AllPowers.Summer.addCap(3 * x);
        VSDefs.Emotions.addCapModifier(2 * x);
        VSDefs.Reflex.addCapModifier(1 * x);
        VSDefs.Balance.addCapModifier(2 * x);
        DamageTypes.Cold.addCapModifier(1 * x);
        DamageTypes.Fire.addCapModifier(2 * x);
        mainChar.stats.movements.ground.addCapModifier(1 * x);
    }, (x) => {
        AllPowers.Summer.reduceCap(3 * x);
        VSDefs.Emotions.reduceCapModifier(2 * x);
        VSDefs.Reflex.reduceCapModifier(1 * x);
        VSDefs.Balance.reduceCapModifier(2 * x);
        DamageTypes.Cold.reduceCapModifier(1 * x);
        DamageTypes.Fire.reduceCapModifier(2 * x);
        mainChar.stats.movements.ground.reduceCapModifier(1 * x);
    }),
    LightMagic: new Spec("Light Magic", AllMasterSpecs.Supernatural, (x) => {
        AllPowers.Light.addCap(3 * x);
        VSDefs.Destruction.addCapModifier(2 * x);
        VSDefs.Reflex.addCapModifier(1 * x);
        VSDefs.Emotions.addCapModifier(2 * x);
        DamageTypes.NegEnergy.addCapModifier(2 * x);
        DamageTypes.PosEnergy.addCapModifier(2 * x);
        DamageTypes.Fire.addCapModifier(1 * x);
        mainChar.stats.movements.ground.addCapModifier(2 * x);
        mainChar.stats.movements.flight.addCapModifier(2 * x);
    }, (x) => {
        AllPowers.Light.reduceCap(3 * x);
        VSDefs.Destruction.reduceCapModifier(2 * x);
        VSDefs.Reflex.reduceCapModifier(1 * x);
        VSDefs.Emotions.reduceCapModifier(2 * x);
        DamageTypes.NegEnergy.reduceCapModifier(2 * x);
        DamageTypes.PosEnergy.reduceCapModifier(2 * x);
        DamageTypes.Fire.reduceCapModifier(1 * x);
        mainChar.stats.movements.ground.reduceCapModifier(2 * x);
        mainChar.stats.movements.flight.reduceCapModifier(2 * x);
    }),
    Artificing: new Spec("Artificing", AllMasterSpecs.Supernatural, (x) => {
        AllPowers.Artifice.addCap(3 * x);
        VSDefs.Shapechange.addCapModifier(3 * x);
        VSDefs.Destruction.addCapModifier(3 * x);
        DamageTypes.Physical.addCapModifier(4 * x);
        DamageTypes.Lightning.addCapModifier(1 * x);
        DamageTypes.Acid.addCapModifier(1 * x);

        DamageTypes.Sonic.addCapModifier(1 * x);
        DamageTypes.Cold.addCapModifier(1 * x);
        DamageTypes.Fire.addCapModifier(1 * x);
        DamageTypes.Radiation.addCapModifier(1 * x);
    }, (x) => {
        AllPowers.Artifice.reduceCap(3 * x);
        VSDefs.Shapechange.reduceCapModifier(3 * x);
        VSDefs.Destruction.reduceCapModifier(3 * x);
        DamageTypes.Physical.reduceCapModifier(4 * x);
        DamageTypes.Lightning.reduceCapModifier(1 * x);
        DamageTypes.Acid.reduceCapModifier(1 * x);

        DamageTypes.Sonic.reduceCapModifier(1 * x);
        DamageTypes.Cold.reduceCapModifier(1 * x);
        DamageTypes.Fire.reduceCapModifier(1 * x);
        DamageTypes.Radiation.reduceCapModifier(1 * x);
    }),
    Blight: new Spec("Blight", AllMasterSpecs.Supernatural, (x) => {
        AllPowers.Blight.addCap(3 * x);
        DamageTypes.Acid.addCapModifier(2 * x);
        DamageTypes.NegEnergy.addCapModifier(2 * x);
        DamageTypes.PosEnergy.addCapModifier(2 * x);
        DamageTypes.Cold.addCapModifier(1 * x);
        DamageTypes.Fire.addCapModifier(1 * x);
        VSDefs.Toxic.addCapModifier(3 * x);
        VSDefs.Destruction.addCapModifier(2 * x);
    }, (x) => {
        AllPowers.Blight.reduceCap(3 * x);
        DamageTypes.Acid.reduceCapModifier(2 * x);
        DamageTypes.NegEnergy.reduceCapModifier(2 * x);
        DamageTypes.PosEnergy.reduceCapModifier(2 * x);
        DamageTypes.Cold.reduceCapModifier(1 * x);
        DamageTypes.Fire.reduceCapModifier(1 * x);
        VSDefs.Toxic.reduceCapModifier(3 * x);
        VSDefs.Destruction.reduceCapModifier(2 * x);
    }),
    Osteomancy: new Spec("Osteomancy", AllMasterSpecs.Supernatural, (x) => {
        AllPowers.Healing.addCap(3 * x);
        DamageTypes.Blunt.addCapModifier(4 * x);
        DamageTypes.Slashing.addCapModifier(4 * x);
        VSDefs.Concentration.addCapModifier(2 * x);
        VSDefs.Shapechange.addCapModifier(2 * x);
        VSDefs.Grip.addCapModifier(2 * x);
        VSDefs.HoldPos.addCapModifier(2 * x);
        AddedDefenses.Bone.addCapModifier(3 * x);
    }, (x) => {
        AllPowers.Healing.reduceCap(3 * x);
        DamageTypes.Blunt.reduceCapModifier(4 * x);
        DamageTypes.Slashing.reduceCapModifier(4 * x);
        VSDefs.Concentration.reduceCapModifier(2 * x);
        VSDefs.Shapechange.reduceCapModifier(2 * x);
        VSDefs.Grip.reduceCapModifier(2 * x);
        VSDefs.HoldPos.reduceCapModifier(2 * x);
        AddedDefenses.Bone.reduceCapModifier(3 * x);
    }),
    LordshipAutumn: new Spec("Lordship: Autumn", AllMasterSpecs.Supernatural, (x) => {
        AllPowers.Autumn.addCap(3 * x);
        DamageTypes.Cold.addCapModifier(2 * x);
        DamageTypes.Fire.addCapModifier(1 * x);
        VSDefs.Balance.addCapModifier(2 * x);
        VSDefs.Emotions.addCapModifier(2 * x);
        VSDefs.Toxic.addCapModifier(2 * x);
        VSDefs.Concentration.addCapModifier(2 * x);
        mainChar.stats.movements.swim.addCapModifier(2 * x);
    }, (x) => {
        AllPowers.Autumn.reduceCap(3 * x);
        DamageTypes.Cold.reduceCapModifier(2 * x);
        DamageTypes.Fire.reduceCapModifier(1 * x);
        VSDefs.Balance.reduceCapModifier(2 * x);
        VSDefs.Emotions.reduceCapModifier(2 * x);
        VSDefs.Toxic.reduceCapModifier(2 * x);
        VSDefs.Concentration.reduceCapModifier(2 * x);
        mainChar.stats.movements.swim.reduceCapModifier(2 * x);
    }),
    Plasmamancy: new Spec("Plasmamancy", AllMasterSpecs.Supernatural, (x) => {
        AllPowers.Fire.addCap(3 * x);
        AllPowers.Lightning.addCap(3 * x);
        VSDefs.Destruction.addCapModifier(2 * x);
        VSDefs.Toxic.addCapModifier(2 * x);
        DamageTypes.Fire.addCapModifier(2 * x);
        DamageTypes.Lightning.addCapModifier(2 * x);
        VSDefs.Shapechange.addCapModifier(2 * x);
        VSDefs.Concentration.addCapModifier(2 * x);
    }, (x) => {
        AllPowers.Fire.reduceCap(3 * x);
        AllPowers.Lightning.reduceCap(3 * x);
        VSDefs.Destruction.reduceCapModifier(2 * x);
        VSDefs.Toxic.reduceCapModifier(2 * x);
        DamageTypes.Fire.reduceCapModifier(2 * x);
        DamageTypes.Lightning.reduceCapModifier(2 * x);
        VSDefs.Shapechange.reduceCapModifier(2 * x);
        VSDefs.Concentration.reduceCapModifier(2 * x);
    }),
    Oraculemancy: new Spec("Oraculemancy", AllMasterSpecs.Supernatural, (x) => {
        AllPowers.Oracle.addCap(3 * x);
        VSDefs.Scry.addCapModifier(3 * x);
        VSDefs.Reflex.addCapModifier(1 * x);
        VSEnvironments.Surprise.addCapModifier(2 * x);
        VSEnvironments.Traps.addCapModifier(2 * x);
        VSDefs.Concentration.addCapModifier(2 * x);
        // Senses
        VSEnvironments.Spot.addCapModifier(1 * x);
        VSEnvironments.Listen.addCapModifier(1 * x);
        VSEnvironments.Scent.addCapModifier(1 * x);
    }, (x) => {
        AllPowers.Oracle.reduceCap(3 * x);
        VSDefs.Scry.reduceCapModifier(3 * x);
        VSDefs.Reflex.reduceCapModifier(1 * x);
        VSEnvironments.Surprise.reduceCapModifier(2 * x);
        VSEnvironments.Traps.reduceCapModifier(2 * x);
        VSDefs.Concentration.reduceCapModifier(2 * x);
        // Senses
        VSEnvironments.Spot.reduceCapModifier(1 * x);
        VSEnvironments.Listen.reduceCapModifier(1 * x);
        VSEnvironments.Scent.reduceCapModifier(1 * x);
    }),
    Taming: new Spec("Taming", AllMasterSpecs.Supernatural, (x) => {
        AllPowers.Taming.addCap(3 * x);
        // All Movements
        mainChar.stats.movements.ground.addCapModifier(3 * x);
        mainChar.stats.movements.swim.addCapModifier(3 * x);
        mainChar.stats.movements.climb.addCapModifier(3 * x);
        mainChar.stats.movements.jump.addCapModifier(3 * x);
        mainChar.stats.movements.burrow.addCapModifier(3 * x);
        mainChar.stats.movements.flight.addCapModifier(3 * x);
        VSDefs.Compulsions.addCapModifier(2 * x);
        VSEnvironments.Surprise.addCapModifier(3 * x);
        VSDefs.Restraint.addCapModifier(2 * x);

        // Senses
        VSEnvironments.Spot.addCapModifier(1 * x);
        VSEnvironments.Listen.addCapModifier(1 * x);
        VSEnvironments.Scent.addCapModifier(1 * x);
    }, (x) => {
        AllPowers.Taming.reduceCap(3 * x);
        mainChar.stats.movements.ground.reduceCapModifier(3 * x);
        mainChar.stats.movements.swim.reduceCapModifier(3 * x);
        mainChar.stats.movements.climb.reduceCapModifier(3 * x);
        mainChar.stats.movements.jump.reduceCapModifier(3 * x);
        mainChar.stats.movements.burrow.reduceCapModifier(3 * x);
        mainChar.stats.movements.flight.reduceCapModifier(3 * x);
        VSDefs.Compulsions.reduceCapModifier(2 * x);
        VSEnvironments.Surprise.reduceCapModifier(3 * x);
        VSDefs.Restraint.reduceCapModifier(2 * x);

        // Senses
        VSEnvironments.Spot.reduceCapModifier(1 * x);
        VSEnvironments.Listen.reduceCapModifier(1 * x);
        VSEnvironments.Scent.reduceCapModifier(1 * x);
    }),
    Sandmancy: new Spec("Sandmancy", AllMasterSpecs.Supernatural, (x) => {
        AllPowers.Sand.addCap(3 * x);
        DamageTypes.Cold.addCapModifier(2 * x);
        DamageTypes.Fire.addCapModifier(2 * x);
        mainChar.stats.movements.burrow.addCapModifier(1 * x);
        VSDefs.Concentration.addCapModifier(2 * x);
        mainChar.stats.movements.ground.addCapModifier(2 * x);
        VSDefs.Balance.addCapModifier(3 * x);
    }, (x) => {
        AllPowers.Sand.reduceCap(3 * x);
        DamageTypes.Cold.reduceCapModifier(2 * x);
        DamageTypes.Fire.reduceCapModifier(2 * x);
        mainChar.stats.movements.burrow.reduceCapModifier(1 * x);
        VSDefs.Concentration.reduceCapModifier(2 * x);
        mainChar.stats.movements.ground.reduceCapModifier(2 * x);
        VSDefs.Balance.reduceCapModifier(3 * x);
    }),
    LordshipWinter: new Spec("Lordship: Winter", AllMasterSpecs.Supernatural, (x) => {
        AllPowers.Winter.addCap(3 * x);
        DamageTypes.Cold.addCapModifier(2 * x);
        DamageTypes.Fire.addCapModifier(1 * x);
        VSDefs.Toxic.addCapModifier(2 * x);
        VSDefs.Destruction.addCapModifier(2 * x);
        VSDefs.Emotions.addCapModifier(3 * x);
        VSDefs.Compulsions.addCapModifier(2 * x);
    }, (x) => {
        AllPowers.Winter.reduceCap(3 * x);
        DamageTypes.Cold.reduceCapModifier(2 * x);
        DamageTypes.Fire.reduceCapModifier(1 * x);
        VSDefs.Toxic.reduceCapModifier(2 * x);
        VSDefs.Destruction.reduceCapModifier(2 * x);
        VSDefs.Emotions.reduceCapModifier(3 * x);
        VSDefs.Compulsions.reduceCapModifier(2 * x);
    }),

    // Arcane
    ArcaneDivination: new Spec("Divination", AllMasterSpecs.Arcane, (x) => {
        AllPowers.Divination.addCapModifier(0.66 * x);
        VSDefs.Scry.addCapModifier(0.33 * x);
        VSDefs.Reflex.addCapModifier(0.25 * x);
        VSEnvironments.Surprise.addCapModifier(0.33 * x);
    }, (x) => {
        AllPowers.Divination.reduceCapModifier(0.66 * x);
        VSDefs.Scry.reduceCapModifier(0.33 * x);
        VSDefs.Reflex.reduceCapModifier(0.25 * x);
        VSEnvironments.Surprise.reduceCapModifier(0.33 * x);
    }),
    Evocation: new Spec("Evocation", AllMasterSpecs.Arcane, (x) => {
        AllPowers.Evo.addCapModifier(0.66 * x);
        DamageTypes.Fire.addCapModifier(0.33 * x);
        DamageTypes.Cold.addCapModifier(0.33 * x);
        DamageTypes.Acid.addCapModifier(0.33 * x);
        DamageTypes.Sonic.addCapModifier(0.33 * x);
        DamageTypes.Lightning.addCapModifier(0.33 * x);
    }, (x) => {
        AllPowers.Evo.reduceCapModifier(0.66 * x);
        DamageTypes.Fire.reduceCapModifier(0.33 * x);
        DamageTypes.Cold.reduceCapModifier(0.33 * x);
        DamageTypes.Acid.reduceCapModifier(0.33 * x);
        DamageTypes.Sonic.reduceCapModifier(0.33 * x);
        DamageTypes.Lightning.reduceCapModifier(0.33 * x);
    }),
    Abjuration: new Spec("Abjuration", AllMasterSpecs.Arcane, (x) => {
        AllPowers.Abjur.addCapModifier(0.66 * x);
        AddedDefenses.Magic.addCapModifier(0.33 * x);
    }, (x) => {
        AllPowers.Abjur.reduceCapModifier(0.66 * x);
        AddedDefenses.Magic.reduceCapModifier(0.33 * x);
    }),
    Enchantment: new Spec("Enchantment", AllMasterSpecs.Arcane, (x) => {
        AllPowers.Enchant.addCapModifier(0.66 * x);
        VSDefs.Compulsions.addCapModifier(0.33 * x);
        VSDefs.Emotions.addCapModifier(0.33 * x);
    }, (x) => {
        AllPowers.Enchant.reduceCapModifier(0.66 * x);
        VSDefs.Compulsions.reduceCapModifier(0.33 * x);
        VSDefs.Emotions.reduceCapModifier(0.33 * x);
    }),
    Conjuration: new Spec("Conjuration", AllMasterSpecs.Arcane, (x) => {
        AllPowers.Conj.addCapModifier(0.66 * x);
        VSDefs.Compulsions.addCapModifier(0.33 * x);
    }, (x) => {
        AllPowers.Conj.reduceCapModifier(0.66 * x);
        VSDefs.Compulsions.reduceCapModifier(0.33 * x);
    }),
    Illusion: new Spec("Illusion", AllMasterSpecs.Arcane, (x) => {
        AllPowers.Illusion.addCapModifier(0.66 * x);
        AddedDefenses.Illusion.addCapModifier(0.5 * x);
        VSDefs.Scry.addCapModifier(0.33 * x);
    }, (x) => {
        AllPowers.Illusion.reduceCapModifier(0.66 * x);
        AddedDefenses.Illusion.reduceCapModifier(0.5 * x);
        VSDefs.Scry.reduceCapModifier(0.33 * x);
    }),
    Necromancy: new Spec("Necromancy", AllMasterSpecs.Arcane, (x) => {
        AllPowers.Necro.addCapModifier(0.66 * x);
        DamageTypes.NegEnergy.addCapModifier(0.33 * x);
        VSDefs.Destruction.addCapModifier(0.33 * x);
    }, (x) => {
        AllPowers.Necro.reduceCapModifier(0.66 * x);
        DamageTypes.NegEnergy.reduceCapModifier(0.33 * x);
        VSDefs.Destruction.reduceCapModifier(0.33 * x);
    }),
    Transmutation: new Spec("Transmutation", AllMasterSpecs.Arcane, (x) => {
        AllPowers.Trans.addCapModifier(0.66 * x);
        VSDefs.Shapechange.addCapModifier(0.33 * x);
        VSDefs.Destruction.addCapModifier(0.33 * x);
    }, (x) => {
        AllPowers.Trans.reduceCapModifier(0.66 * x);
        VSDefs.Shapechange.reduceCapModifier(0.33 * x);
        VSDefs.Destruction.reduceCapModifier(0.33 * x);
    }),

    // Divine
    Sun: new Spec("Sun", AllMasterSpecs.Divine, (x) => {
        AllPowers.Sun.addCapModifier(2 * x);
        DamageTypes.Fire.addCapModifier(1 * x);
        DamageTypes.Cold.addCapModifier(1 * x);
        DamageTypes.PosEnergy.addCapModifier(1 * x);
        DamageTypes.NegEnergy.addCapModifier(1 * x);
    }, (x) => {
        AllPowers.Sun.reduceCapModifier(2 * x);
        DamageTypes.Fire.reduceCapModifier(1 * x);
        DamageTypes.Cold.reduceCapModifier(1 * x);
        DamageTypes.PosEnergy.reduceCapModifier(1 * x);
        DamageTypes.NegEnergy.reduceCapModifier(1 * x);
    }),
    War: new Spec("War", AllMasterSpecs.Divine, (x) => {
        AllPowers.War.addCapModifier(2 * x);
        DamageTypes.Physical.addCapModifier(2 * x);
        VSDefs.Emotions.addCapModifier(1 * x);
    }, (x) => {
        AllPowers.War.reduceCapModifier(2 * x);
        DamageTypes.Physical.reduceCapModifier(2 * x);
        VSDefs.Emotions.reduceCapModifier(1 * x);
    }),
    Weather: new Spec("Weather", AllMasterSpecs.Divine, (x) => {
        AllPowers.Weather.addCapModifier(2 * x);
        DamageTypes.Lightning.addCapModifier(1 * x);
        DamageTypes.Cold.addCapModifier(1 * x);
        VSEnvironments.EnvHot.addCapModifier(1 * x);
        VSEnvironments.Scent.addCapModifier(1 * x);
    }, (x) => {
        AllPowers.Weather.reduceCapModifier(2 * x);
        DamageTypes.Lightning.reduceCapModifier(1 * x);
        DamageTypes.Cold.reduceCapModifier(1 * x);
        VSEnvironments.EnvHot.reduceCapModifier(1 * x);
        VSEnvironments.Scent.reduceCapModifier(1 * x);
    }),
    Knowledge: new Spec("Knowledge", AllMasterSpecs.Divine, (x) => {
        AllPowers.Knowledge.addCapModifier(2 * x);
        AddedDefenses.Arcane.addCapModifier(1 * x);
        VSEnvironments.Surprise.addCapModifier(1 * x);
        VSDefs.Scry.addCapModifier(1 * x);
    }, (x) => {
        AllPowers.Knowledge.reduceCapModifier(2 * x);
        AddedDefenses.Arcane.reduceCapModifier(1 * x);
        VSEnvironments.Surprise.reduceCapModifier(1 * x);
        VSDefs.Scry.reduceCapModifier(1 * x);
    }),
    DivineFire: new Spec("Fire", AllMasterSpecs.Divine, (x) => {
        AllPowers.Fire.addCapModifier(2 * x);
        DamageTypes.Fire.addCapModifier(1 * x);
        DamageTypes.Cold.addCapModifier(1 * x);
        VSDefs.Toxic.addCapModifier(1 * x);
    }, (x) => {
        AllPowers.Fire.reduceCapModifier(2 * x);
        DamageTypes.Fire.reduceCapModifier(1 * x);
        DamageTypes.Cold.reduceCapModifier(1 * x);
        VSDefs.Toxic.reduceCapModifier(1 * x);
    }),
    Travel: new Spec("Travel", AllMasterSpecs.Divine, (x) => {
        AllPowers.Travel.addCapModifier(2 * x);

        // All Movements
        mainChar.stats.movements.ground.addCapModifier(0.33 * x);
        mainChar.stats.movements.swim.addCapModifier(0.33 * x);
        mainChar.stats.movements.climb.addCapModifier(0.33 * x);
        mainChar.stats.movements.jump.addCapModifier(0.33 * x);
        mainChar.stats.movements.burrow.addCapModifier(0.33 * x);
        mainChar.stats.movements.flight.addCapModifier(0.33 * x);
    }, (x) => {
        AllPowers.Travel.reduceCapModifier(2 * x);

        // All Movements
        mainChar.stats.movements.ground.reduceCapModifier(0.33 * x);
        mainChar.stats.movements.swim.reduceCapModifier(0.33 * x);
        mainChar.stats.movements.climb.reduceCapModifier(0.33 * x);
        mainChar.stats.movements.jump.reduceCapModifier(0.33 * x);
        mainChar.stats.movements.burrow.reduceCapModifier(0.33 * x);
        mainChar.stats.movements.flight.reduceCapModifier(0.33 * x);
    }),
    DivineAir: new Spec("Air", AllMasterSpecs.Divine, (x) => {
        AllPowers.Air.addCapModifier(2 * x);
        DamageTypes.Lightning.addCapModifier(1 * x);
    }, (x) => {
        AllPowers.Air.reduceCapModifier(2 * x);
        DamageTypes.Lightning.reduceCapModifier(1 * x);
    }),
    Creation: new Spec("Creation", AllMasterSpecs.Divine, (x) => {
        AllPowers.Creation.addCapModifier(2 * x);
        DamageTypes.PosEnergy.addCapModifier(1 * x);
        DamageTypes.NegEnergy.addCapModifier(1 * x);
        VSDefs.Destruction.addCapModifier(1 * x);
    }, (x) => {
        AllPowers.Creation.reduceCapModifier(2 * x);
        DamageTypes.PosEnergy.reduceCapModifier(1 * x);
        DamageTypes.NegEnergy.reduceCapModifier(1 * x);
        VSDefs.Destruction.reduceCapModifier(1 * x);
    }),
    Good: new Spec("Good", AllMasterSpecs.Divine, (x) => {
        AllPowers.Good.addCapModifier(2 * x);
        DamageTypes.PosEnergy.addCapModifier(1 * x);
        DamageTypes.NegEnergy.addCapModifier(1 * x);
        AddedDefenses.Evil.addCapModifier(1 * x);
    }, (x) => {
        AllPowers.Good.reduceCapModifier(2 * x);
        DamageTypes.PosEnergy.reduceCapModifier(1 * x);
        DamageTypes.NegEnergy.reduceCapModifier(1 * x);
        AddedDefenses.Evil.reduceCapModifier(1 * x);
    }),
    Law: new Spec("Law", AllMasterSpecs.Divine, (x) => {
        AllPowers.Law.addCapModifier(2 * x);
        AddedDefenses.Chaotic.addCapModifier(1 * x);
        VSDefs.Compulsions.addCapModifier(1 * x);
    }, (x) => {
        AllPowers.Law.reduceCapModifier(2 * x);
        AddedDefenses.Chaotic.reduceCapModifier(1 * x);
        VSDefs.Compulsions.reduceCapModifier(1 * x);
    }),
    Life: new Spec("Life", AllMasterSpecs.Divine, (x) => {
        AllPowers.Life.addCapModifier(2 * x);
        DamageTypes.PosEnergy.addCapModifier(1 * x);
        DamageTypes.NegEnergy.addCapModifier(1 * x);
        VSDefs.Destruction.addCapModifier(1 * x);
    }, (x) => {
        AllPowers.Life.reduceCapModifier(2 * x);
        DamageTypes.PosEnergy.reduceCapModifier(1 * x);
        DamageTypes.NegEnergy.reduceCapModifier(1 * x);
        VSDefs.Destruction.reduceCapModifier(1 * x);
    }),
    Time: new Spec("Time", AllMasterSpecs.Divine, (x) => {
        AllPowers.Time.addCapModifier(2 * x);
        VSDefs.Reflex.addCapModifier(0.5 * x);
        VSEnvironments.Surprise.addCapModifier(2 * x);
    }, (x) => {
        AllPowers.Time.reduceCapModifier(2 * x);
        VSDefs.Reflex.reduceCapModifier(0.5 * x);
        VSEnvironments.Surprise.reduceCapModifier(2 * x);
    }),
    Moon: new Spec("Moon", AllMasterSpecs.Divine, (x) => {
        AllPowers.Moon.addCapModifier(2 * x);
        VSDefs.Scry.addCapModifier(1 * x);
        VSDefs.Shapechange.addCapModifier(1 * x);
    }, (x) => {
        AllPowers.Moon.reduceCapModifier(2 * x);
        VSDefs.Scry.reduceCapModifier(1 * x);
        VSDefs.Shapechange.reduceCapModifier(1 * x);
    }),
    Protection: new Spec("Protection", AllMasterSpecs.Divine, (x) => {
        AllPowers.Protect.addCapModifier(2 * x);
        VSDefs.Scry.addCapModifier(1 * x);
        DamageTypes.Physical.addCapModifier(2 * x);
    }, (x) => {
        AllPowers.Protect.reduceCapModifier(2 * x);
        VSDefs.Scry.reduceCapModifier(1 * x);
        DamageTypes.Physical.reduceCapModifier(2 * x);
    }),
    DivineEarth: new Spec("Earth", AllMasterSpecs.Divine, (x) => {
        AllPowers.Earth.addCapModifier(2 * x);
        VSDefs.HoldPos.addCapModifier(0.5 * x);
        VSDefs.Grip.addCapModifier(0.5 * x);
        VSDefs.Emotions.addCapModifier(0.5 * x);
        DamageTypes.Lightning.addCapModifier(1 * x);
    }, (x) => {
        AllPowers.Earth.reduceCapModifier(2 * x);
        VSDefs.HoldPos.reduceCapModifier(0.5 * x);
        VSDefs.Grip.reduceCapModifier(0.5 * x);
        VSDefs.Emotions.reduceCapModifier(0.5 * x);
        DamageTypes.Lightning.reduceCapModifier(1 * x);
    }),
    Prosperity: new Spec("Prosperity", AllMasterSpecs.Divine, (x) => {
        AllPowers.Prosperity.addCapModifier(2 * x);
        VSDefs.Toxic.addCapModifier(0.5 * x);
        AddedDefenses.Luck.addCapModifier(0.5 * x);
        mainChar.cpStats.addCapModifierHP(1 * x);
    }, (x) => {
        AllPowers.Prosperity.reduceCapModifier(2 * x);
        VSDefs.Toxic.reduceCapModifier(0.5 * x);
        AddedDefenses.Luck.reduceCapModifier(0.5 * x);
        mainChar.cpStats.reduceCapModifierHP(1 * x);
    }),
    DivineDivination: new Spec("Divination", AllMasterSpecs.Divine, (x) => {
        AllPowers.Divination.addCapModifier(2 * x);
        VSDefs.Scry.addCapModifier(0.5 * x);
        VSDefs.Reflex.addCapModifier(0.5 * x);
        VSEnvironments.Surprise.addCapModifier(1 * x);
    }, (x) => {
        AllPowers.Divination.reduceCapModifier(2 * x);
        VSDefs.Scry.reduceCapModifier(0.5 * x);
        VSDefs.Reflex.reduceCapModifier(0.5 * x);
        VSEnvironments.Surprise.reduceCapModifier(1 * x);
    }),
    Destruction: new Spec("Destruction", AllMasterSpecs.Divine, (x) => {
        DamageTypes.PosEnergy.addCapModifier(1 * x);
        DamageTypes.NegEnergy.addCapModifier(1 * x);
        VSDefs.Destruction.addCapModifier(1 * x);
    }, (x) => {
        DamageTypes.PosEnergy.reduceCapModifier(1 * x);
        DamageTypes.NegEnergy.reduceCapModifier(1 * x);
        VSDefs.Destruction.reduceCapModifier(1 * x);
    }),
    Evil: new Spec("Evil", AllMasterSpecs.Divine, (x) => {
        DamageTypes.PosEnergy.addCapModifier(1 * x);
        DamageTypes.NegEnergy.addCapModifier(1 * x);
        AddedDefenses.Good.addCapModifier(0.5 * x);
        AddedDefenses.Evil.addCapModifier(0.5 * x);
    }, (x) => {
        DamageTypes.PosEnergy.reduceCapModifier(1 * x);
        DamageTypes.NegEnergy.reduceCapModifier(1 * x);
        AddedDefenses.Good.reduceCapModifier(0.5 * x);
        AddedDefenses.Evil.reduceCapModifier(0.5 * x);
    }),
    Chaos: new Spec("Chaos", AllMasterSpecs.Divine, (x) => {
        VSDefs.Restraint.addCapModifier(1 * x);
        AddedDefenses.Chaotic.addCapModifier(0.5 * x);
    }, (x) => {
        VSDefs.Restraint.reduceCapModifier(1 * x);
        AddedDefenses.Chaotic.reduceCapModifier(0.5 * x);
    }),
    Death: new Spec("Death", AllMasterSpecs.Divine, (x) => {
        DamageTypes.PosEnergy.addCapModifier(1 * x);
        DamageTypes.NegEnergy.addCapModifier(1 * x);
        VSDefs.Destruction.addCapModifier(1 * x);
    }, (x) => {
        DamageTypes.PosEnergy.reduceCapModifier(1 * x);
        DamageTypes.NegEnergy.reduceCapModifier(1 * x);
        VSDefs.Destruction.reduceCapModifier(1 * x);
    }),
    Magic: new Spec("Magic", AllMasterSpecs.Divine, (x) => {
        AddedDefenses.Magic.addCapModifier(0.5 * x);
        AddedDefenses.Arcane.addCapModifier(1 * x);
    }, (x) => {
        AddedDefenses.Magic.reduceCapModifier(0.5 * x);
        AddedDefenses.Arcane.reduceCapModifier(1 * x);
    }),
    Nature: new Spec("Nature", AllMasterSpecs.Divine, (x) => {
        AddedDefenses.Nature.addCapModifier(1 * x);
        DamageTypes.PosEnergy.addCapModifier(1 * x);
        DamageTypes.NegEnergy.addCapModifier(1 * x);
    }, (x) => {
        AddedDefenses.Nature.reduceCapModifier(1 * x);
        DamageTypes.PosEnergy.reduceCapModifier(1 * x);
        DamageTypes.NegEnergy.reduceCapModifier(1 * x);
    }),
    Strength: new Spec("Strength", AllMasterSpecs.Divine, (x) => {
        VSDefs.Grip.addCapModifier(0.5 * x);
        VSDefs.HoldPos.addCapModifier(0.5 * x);
        VSDefs.Emotions.addCapModifier(0.5 * x);
        VSDefs.Restraint.addCapModifier(0.5 * x);
        DamageTypes.Physical.addCapModifier(1 * x);
    }, (x) => {
        VSDefs.Grip.reduceCapModifier(0.5 * x);
        VSDefs.HoldPos.reduceCapModifier(0.5 * x);
        VSDefs.Emotions.reduceCapModifier(0.5 * x);
        VSDefs.Restraint.reduceCapModifier(0.5 * x);
        DamageTypes.Physical.reduceCapModifier(1 * x);
    }),
    DivineWater: new Spec("Water", AllMasterSpecs.Divine, (x) => {
        VSDefs.Emotions.addCapModifier(0.5 * x);
        VSDefs.Restraint.addCapModifier(0.5 * x);
        DamageTypes.Cold.addCapModifier(1 * x);
        DamageTypes.Fire.addCapModifier(1 * x);
    }, (x) => {
        VSDefs.Emotions.reduceCapModifier(0.5 * x);
        VSDefs.Restraint.reduceCapModifier(0.5 * x);
        DamageTypes.Cold.reduceCapModifier(1 * x);
        DamageTypes.Fire.reduceCapModifier(1 * x);
    }),
    Trickery: new Spec("Trickery", AllMasterSpecs.Divine, (x) => {
        VSDefs.Shapechange.addCapModifier(0.5 * x);
        VSDefs.Compulsions.addCapModifier(0.5 * x);

        // Senses
        VSEnvironments.Spot.addCapModifier(0.33 * x);
        VSEnvironments.Listen.addCapModifier(0.33 * x);
        VSEnvironments.Scent.addCapModifier(0.33 * x);
    }, (x) => {
        VSDefs.Shapechange.reduceCapModifier(0.5 * x);
        VSDefs.Compulsions.reduceCapModifier(0.5 * x);

        // Senses
        VSEnvironments.Spot.reduceCapModifier(0.33 * x);
        VSEnvironments.Listen.reduceCapModifier(0.33 * x);
        VSEnvironments.Scent.reduceCapModifier(0.33 * x);
    }),

    // Primal
    Growth: new Spec("Growth", AllMasterSpecs.Primal, (x) => {
        AllPowers.Growth.addCapModifier(2 * x);
        DamageTypes.PosEnergy.addCapModifier(1 * x);
        DamageTypes.NegEnergy.addCapModifier(1 * x);
        VSDefs.Restraint.addCapModifier(1 * x);
    }, (x) => {
        AllPowers.Growth.reduceCapModifier(2 * x);
        DamageTypes.PosEnergy.reduceCapModifier(1 * x);
        DamageTypes.NegEnergy.reduceCapModifier(1 * x);
        VSDefs.Restraint.reduceCapModifier(1 * x);
    }),
    PrimalAir: new Spec("Air", AllMasterSpecs.Primal, (x) => {
        AllPowers.Air.addCapModifier(2 * x);
        VSDefs.Reflex.addCapModifier(0.5 * x);
        VSDefs.Balance.addCapModifier(1 * x);
    }, (x) => {
        AllPowers.Air.reduceCapModifier(2 * x);
        VSDefs.Reflex.reduceCapModifier(0.5 * x);
        VSDefs.Balance.reduceCapModifier(1 * x);
    }),
    Animal: new Spec("Animal", AllMasterSpecs.Primal, (x) => {
        AllPowers.Animal.addCapModifier(2 * x);
        DamageTypes.Physical.addCapModifier(1 * x);

        // Senses
        VSEnvironments.Spot.addCapModifier(0.5 * x);
        VSEnvironments.Listen.addCapModifier(0.5 * x);
        VSEnvironments.Scent.addCapModifier(0.5 * x);
    }, (x) => {
        AllPowers.Animal.reduceCapModifier(2 * x);
        DamageTypes.Physical.reduceCapModifier(1 * x);

        // Senses
        VSEnvironments.Spot.reduceCapModifier(0.5 * x);
        VSEnvironments.Listen.reduceCapModifier(0.5 * x);
        VSEnvironments.Scent.reduceCapModifier(0.5 * x);
    }),
    PrimalWater: new Spec("Water", AllMasterSpecs.Primal, (x) => {
        AllPowers.Water.addCapModifier(2 * x);
        DamageTypes.Fire.addCapModifier(1 * x);
        DamageTypes.Cold.addCapModifier(1 * x);
    }, (x) => {
        AllPowers.Water.reduceCapModifier(2 * x);
        DamageTypes.Fire.reduceCapModifier(1 * x);
        DamageTypes.Cold.reduceCapModifier(1 * x);
    }),
    Balance: new Spec("Balance", AllMasterSpecs.Primal, (x) => {
        AllPowers.Balance.addCapModifier(2 * x);
        VSDefs.Balance.addCapModifier(1 * x);
    }, (x) => {
        AllPowers.Balance.reduceCapModifier(2 * x);
        VSDefs.Balance.reduceCapModifier(1 * x);
    }),
    DivineFire: new Spec("Fire", AllMasterSpecs.Primal, (x) => {
        AllPowers.Fire.addCapModifier(2 * x);
        DamageTypes.Fire.addCapModifier(1 * x);
        DamageTypes.Cold.addCapModifier(1 * x);
        VSDefs.Toxic.addCapModifier(1 * x);
    }, (x) => {
        AllPowers.Fire.reduceCapModifier(2 * x);
        DamageTypes.Fire.reduceCapModifier(1 * x);
        DamageTypes.Cold.reduceCapModifier(1 * x);
        VSDefs.Toxic.reduceCapModifier(1 * x);
    }),
    Decay: new Spec("Decay", AllMasterSpecs.Primal, (x) => {
        AllPowers.Decay.addCapModifier(2 * x);
        DamageTypes.PosEnergy.addCapModifier(1 * x);
        DamageTypes.NegEnergy.addCapModifier(1 * x);
        VSDefs.Destruction.addCapModifier(1 * x);
    }, (x) => {
        AllPowers.Decay.reduceCapModifier(2 * x);
        DamageTypes.PosEnergy.reduceCapModifier(1 * x);
        DamageTypes.NegEnergy.reduceCapModifier(1 * x);
        VSDefs.Destruction.reduceCapModifier(1 * x);
    }),
    PrimalEarth: new Spec("Earth", AllMasterSpecs.Primal, (x) => {
        AllPowers.Earth.addCapModifier(2 * x);
        DamageTypes.Lightning.addCapModifier(1 * x);
        DamageTypes.Fire.addCapModifier(1 * x);
        DamageTypes.Cold.addCapModifier(1 * x);
        DamageTypes.Acid.addCapModifier(1 * x);
    }, (x) => {
        AllPowers.Earth.reduceCapModifier(2 * x);
        DamageTypes.Lightning.reduceCapModifier(1 * x);
        DamageTypes.Fire.reduceCapModifier(1 * x);
        DamageTypes.Cold.reduceCapModifier(1 * x);
        DamageTypes.Acid.reduceCapModifier(1 * x);
    }),
    Plant: new Spec("Plant", AllMasterSpecs.Primal, (x) => {
        AllPowers.Plant.addCapModifier(2 * x);
        DamageTypes.PosEnergy.addCapModifier(1 * x);
        DamageTypes.NegEnergy.addCapModifier(1 * x);
        VSDefs.Restraint.addCapModifier(1 * x);
    }, (x) => {
        AllPowers.Plant.reduceCapModifier(2 * x);
        DamageTypes.PosEnergy.reduceCapModifier(1 * x);
        DamageTypes.NegEnergy.reduceCapModifier(1 * x);
        VSDefs.Restraint.reduceCapModifier(1 * x);
    }),
    Astral: new Spec("Astral", AllMasterSpecs.Primal, (x) => {
        AllPowers.Astral.addCapModifier(2 * x);
        VSDefs.Shapechange.addCapModifier(1 * x);
        VSDefs.Scry.addCapModifier(1 * x);
    }, (x) => {
        AllPowers.Astral.reduceCapModifier(2 * x);
        VSDefs.Shapechange.reduceCapModifier(1 * x);
        VSDefs.Scry.reduceCapModifier(1 * x);
    }),

}
AllPowers = {
    Spell: new Power("Spell", () => {
        let intel = mainChar.stats.getIntelligence();
        let conv = mainChar.stats.getConviction();
        let att = mainChar.stats.getAttunement();
        let disc = mainChar.stats.getDiscipline();

        return (intel + conv + att + disc / 2) / 2;
    }, 2, () => { return 4 + mainChar.stats.getLevel() / 2; }),
    Ability: new Power("Ability", () => {
        let str = mainChar.stats.getStrength();
        let agi = mainChar.stats.getAgility();
        let con = mainChar.stats.getConstitution();
        let intel = mainChar.stats.getIntelligence();
        let conv = mainChar.stats.getConviction();
        let att = mainChar.stats.getAttunement();
        let disc = mainChar.stats.getDiscipline();

        return (str + agi + disc / 2 + intel + conv + att + con) / 2;
    }, 2, () => { return 4 + mainChar.stats.getLevel() / 2; }),
    All: new Power("All", () => { return 0; }, 2.5, () => { return 4 + mainChar.stats.getLevel() / 2; }),
    Brute: new Power("Brute"),
    Strong: new Power("Strong"),
    Swift: new Power("Swift"),
    Technical: new Power("Technical"),
    Tricky: new Power("Tricky"),
    Aero: new Power("Aero"),
    Plant: new Power("Plant"),
    Inquisitory: new Power("Inquisitory"),
    Exorcism: new Power("Exorcism"),
    Order: new Power("Order"),
    Cold: new Power("Cold"),
    Healing: new Power("Healing"),
    Magnet: new Power("Magnet"),
    Entropy: new Power("Entropy"),
    Time: new Power("Time"),
    Holy: new Power("Holy"),
    Gravity: new Power("Gravity"),
    Animal: new Power("Animal"),
    Fire: new Power("Fire"),
    Shapeshift: new Power("Shapeshift"),
    Unholy: new Power("Unholy"),
    Metal: new Power("Metal"),
    Spring: new Power("Spring"),
    Shadow: new Power("Shadow"),
    Imbue: new Power("Imbue"),
    TrueNec: new Power("TrueNec"),
    Beguile: new Power("Beguile"),
    Summer: new Power("Summer"),
    Light: new Power("Light"),
    Artifice: new Power("Artifice"),
    Blight: new Power("Blight"),
    Autumn: new Power("Autumn"),
    Lightning: new Power("Lightning"),
    Oracle: new Power("Oracle"),
    Taming: new Power("Taming"),
    Sand: new Power("Sand"),
    Winter: new Power("Winter"),
    Arcane: new Power("Arcane", () => { return 0; }, 1.5, () => { return 0; }),
    Divine: new Power("Divine", () => { return 0; }, 1.5, () => { return 0; }),
    Primal: new Power("Primal", () => { return 0; }, 1.5, () => { return 0; }),
    Divination: new Power("Divination"),
    Evo: new Power("Evocation"),
    Abjur: new Power("Abjuration"),
    Enchant: new Power("Enchant"),
    Conj: new Power("Conjuration"),
    Illusion: new Power("Illusion"),
    Necro: new Power("Necromancy"),
    Trans: new Power("Transmutation"),
    Sun: new Power("Sun"),
    War: new Power("War"),
    Weather: new Power("Weather"),
    Knowledge: new Power("Knowledge"),
    Travel: new Power("Travel"),
    Air: new Power("Air"),
    Creation: new Power("Creation"),
    Good: new Power("Good"),
    Law: new Power("Law"),
    Life: new Power("Life"),
    Moon: new Power("Moon"),
    Protect: new Power("Protection"),
    Earth: new Power("Earth"),
    Prosperity: new Power("Prosperity"),
    Growth: new Power("Growth"),
    Water: new Power("Water"),
    Balance: new Power("Balance"),
    Decay: new Power("Decay"),
    Astral: new Power("Astral")
}

function getPowerByName(x) {
    for (let i = 0; i < allPowersArray.length; ++i) {
        if (allPowersArray[i].name == x) {
            return allPowersArray[i];
        }
    }
}

function getSpecByName(x) {
    for (let i = 0; i < allSpecsArray.length; ++i) {
        if (allSpecsArray[i].name == x) {
            return allSpecsArray[i];
        }
    }
}

function getMasterSpecByName(x) {
    if (x == "Martial") return AllMasterSpecs.Martial;
    else if (x == "Supernatural") return AllMasterSpecs.Supernatural;
    else if (x == "Arcane") return AllMasterSpecs.Arcane;
    else if (x == "Divine") return AllMasterSpecs.Divine;
    else if (x == "Primal") return AllMasterSpecs.Primal;
}