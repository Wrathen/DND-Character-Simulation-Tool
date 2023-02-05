allTrainings = [];
allQualities = [];
allMasterSpecs = [];
trainingsID = 0;

const MASTERSPECTYPES = {
    Arcane: 0,
    Divine: 1,
    Primal: 2,
    Martial: 3,
    Supernatural: 4,
    Stats: 5
}

class Training {
    constructor(name, arcaneRank = 1, points = null, cpCost = null, masterSpec = null, isATraining = true, isSwappable = true, friend = null, cName = null, mv = null, df1 = null, df2 = null, _dr = null, isCustom = false, isLoaded = false) {
        this.id = ++trainingsID;
        this.name = name;
        this.masterSpec = masterSpec;
        this.masterSpecType = this.getMasterSpecType();

        this.arcaneRank = arcaneRank;
        this.arcaneCPCost = arcaneRank == 1 ? 0 : (arcaneRank == 2 ? 3 : (arcaneRank == 3 ? 6 : 10));

        this.isTraining = isATraining;
        this.splitFriend = friend;
        this.isSwappable = isSwappable;

        this.points = points;
        this.cpCost = cpCost;
        
        if (isATraining) allTrainings.push(this);
        else allQualities.push(this);

        this.spec = null;
        this.creatureName = cName; // For Lordship: Creature
        this.mvmnt = mv; // For Lordship: Creature
        this.def1 = df1; // For Lordship: Creature
        this.def2 = df2; // For Lordship: Creature
        this.dr = _dr; // For Lordship: Creature

        this.isCustom = isCustom;

        if (isLoaded) return;

        if (this.isCustom) {
            mainChar.stats.reduceCP(this.cpCost);
        }

        this.onAdd();
    }
    delete() {
        if (this.spec && this.spec.onRemovalEffect) this.spec.onRemovalEffect();
        if (this.spec) this.spec.masterSpec.onTrainingRemove(this.isTraining);

        let arr = allTrainings;
        if (!this.isTraining) arr = allQualities;

        for (let i = 0; i < arr.length; ++i) {
            if (arr[i].id == this.id) {
                arr.splice(i, 1);
            }
        }

        if (this.splitFriend)
            this.splitFriend.splitFriend = null;

        if (this.isCustom) {
            mainChar.stats.addCP(this.cpCost);
        }
    }
    increasePoints(x) {
        this.points += x;

        if (this.points == 0 && this.name.indexOf("Perimeter") == -1 && this.name.indexOf("Body Size") != -1 && this.name.indexOf("Body Type") != -1) {
            if (this.isTraining) deleteTraining(this.id);
            else deleteQuality(this.id);
        }
    }
    reducePoints(x) {
        this.points -= x;

        if (this.points == 0 && this.name.indexOf("Perimeter") == -1 && this.name.indexOf("Body Size") != -1 && this.name.indexOf("Body Type") != -1) {
            if (this.isTraining) deleteTraining(this.id);
            else deleteQuality(this.id);
        }
    }
    getMasterSpecType() {
        if (this.masterSpec) {
            if (this.masterSpec.name == "Arcane") return MASTERSPECTYPES.Arcane;
            else if (this.masterSpec.name == "Divine") return MASTERSPECTYPES.Divine;
            else if (this.masterSpec.name == "Primal") return MASTERSPECTYPES.Primal;
            else if (this.masterSpec.name == "Martial") return MASTERSPECTYPES.Martial;
            else if (this.masterSpec.name == "Supernatural") return MASTERSPECTYPES.Supernatural;
        }

        return MASTERSPECTYPES.Stats;
    }
    changeArcaneRank(x) {
        this.arcaneRank = x;
        this.arcaneCPCost = this.arcaneRank == 1 ? 0 : (this.arcaneRank == 2 ? 3 : (this.arcaneRank == 3 ? 6 : 10));

        if (this.spec == null) this.spec = getSpecByName(this.name);
        this.spec.setArcaneRank(this.arcaneRank);
    }
    changePoints(x) {
        this.points = x;
    }
    changeCreatureName(x) {
        this.creatureName = x;
    }
    changeMvmnt(x) {
        this.mvmnt = x;
        if (this.spec) this.spec.setMvmnt(x);
    }
    changeDef1(x) {
        this.def1 = x;
        if (this.spec) this.spec.setDef1(x);
    }
    changeDef2(x) {
        this.def2 = x;
        if (this.spec) this.spec.setDef2(x);
    }
    changeDR(x) {
        this.dr = x;
        if (this.spec) this.spec.setDR(x);
    }
    changeRank(x) {
        if (this.spec) this.spec.setRank(x);
    }
    onAdd() {
        if (this.masterSpec) {
            this.masterSpec.onTrainingAdd(this.isTraining);

            this.spec = getSpecByName(this.name);
            this.spec.setMvmnt(this.mvmnt);
            this.spec.setDef1(this.def1);
            this.spec.setDef2(this.def2);
            this.spec.setDR(this.dr);
            //this.spec.setArcaneRank(this.arcaneRank); // This was causing bugs.
            this.spec.arcaneRank = this.arcaneRank;

            if (this.masterSpecType == MASTERSPECTYPES.Martial || this.masterSpecType == MASTERSPECTYPES.Supernatural) {
                this.spec.rank = 1;
            }
            if (this.spec.onEffect) this.spec.onEffect();
        }
    }
    onRemove() {
        if (this.masterSpec) {
            this.masterSpec.onTrainingRemove(this.isTraining);
        }

        if (this.splitFriend)
            this.splitFriend.splitFriend = null;

        if (this.spec && this.spec.onRemovalEffect) this.spec.onRemovalEffect();
    }
    getCPCost() {
        if (this.isCustom) return this.cpCost;

        if (this.name.indexOf("Perimeter") != -1 || this.name.indexOf("Body Size") != -1 || this.name.indexOf("Body Type") != -1) return this.cpCost;
        return AllMasterSpecs.Arcane.getRank() * this.arcaneCPCost + (this.points != null && this.cpCost != null ? this.points * this.cpCost : 0);
    }
    getFullDesc() {
        if (this.name.indexOf("Perimeter") != -1 || this.name.indexOf("Body Size") != -1 || this.name.indexOf("Body Type") != -1) return this.name;
        return this.name + (this.points != null ? (" " + (this.points >= 0 ? "+" + Math.round(this.points) : Math.round(this.points))) : "") + (this.arcaneRank != 1 ? ", " + (this.arcaneRank == 2 ? "Minor" : (this.arcaneRank == 3 ? "Major" : "Specialization")) : "");
    }
    swap(amount = 0) {
        if (!this.isSwappable) return;

        if (this.points != null) {
            if (amount == 0) return;
            this.points -= amount;

            if (this.points == 0) {
                if (this.isTraining) deleteTraining(this.id);
                else deleteQuality(this.id);
            }

            if (this.splitFriend) this.splitFriend.increasePoints(amount);
            else this.splitFriend = new Training(this.name, this.arcaneRank, amount, this.cpCost, this.masterSpec, !this.isTraining, this.isSwappable, this, this.creatureName, this.mvmnt, this.def1, this.def2, this.dr);

            return true;
        }
        else {
            if (this.isTraining) {
                for (let i = 0; i < allTrainings.length; ++i) {
                    if (allTrainings[i].id == this.id) {
                        allTrainings.splice(i, 1);
                    }
                }

                allQualities.push(this);
            }
            else {
                for (let i = 0; i < allQualities.length; ++i) {
                    if (allQualities[i].id == this.id) {
                        allQualities.splice(i, 1);
                    }
                }

                allTrainings.push(this);
            }

            this.isTraining = !this.isTraining;
        }
    }
}

function createCustomTraining(name, cpCost) {
    return new Training(name, 1, null, cpCost, null, true, true, null, null, null, null, null, null, true)
}
function getAllCustomTrainings() {
    let arr = [];

    for (let i = 0; i < allTrainings.length; ++i) {
        if (allTrainings[i].isCustom) {
            arr.push(allTrainings[i]);
        }
    }

    return arr;
}
function getAllCustomQualities() {
    let arr = [];

    for (let i = 0; i < allQualities.length; ++i) {
        if (allQualities[i].isCustom) {
            arr.push(allQualities[i]);
        }
    }

    return arr;
}

function getTrainingsStats() {
    let arr = [];
    for (let i = 0; i < allTrainings.length; ++i) {
        if (allTrainings[i].points != null) {
            arr.push(allTrainings[i]);
        }
    }

    return arr;
}
function getQualitiesStats() {
    let arr = [];
    for (let i = 0; i < allQualities.length; ++i) {
        if (allQualities[i].points != null) {
            arr.push(allQualities[i]);
        }
    }

    return arr;
}
function getTrainingsByMasterSpecType(masterSpecType) {
    let arr = [];
    for (let i = 0; i < allTrainings.length; ++i) {
        if (allTrainings[i].masterSpecType == masterSpecType) {
            arr.push(allTrainings[i]);
        }
    }

    return arr;
}

function getQualitiesByMasterSpecType(masterSpecType) {
    let arr = [];
    for (let i = 0; i < allQualities.length; ++i) {
        if (allQualities[i].masterSpecType == masterSpecType) {
            arr.push(allQualities[i]);
        }
    }

    return arr;
}

function getTrainingByID(x) {
    for (let i = 0; i < allTrainings.length; ++i) {
        if (allTrainings[i].id == x) {
            return allTrainings[i];
        }
    }
    return null;
}
function getQualityByID(x) {
    for (let i = 0; i < allQualities.length; ++i) {
        if (allQualities[i].id == x) {
            return allQualities[i];
        }
    }
    return null;
}
function getTrainingByName(x) {
    for (let i = 0; i < allTrainings.length; ++i) {
        if (allTrainings[i].name == x) {
            return allTrainings[i];
        }
    }
    return null;
}
function getQualityByName(x) {
    for (let i = 0; i < allQualities.length; ++i) {
        if (allQualities[i].name == x) {
            return allQualities[i];
        }
    }
    return null;
}
function getTraining(x) {
    for (let i = 0; i < allTrainings.length; ++i) {
        if (allTrainings[i].id == x) {
            return allTrainings[i];
        }
    }
    return null;
}
function getQuality(x) {
    for (let i = 0; i < allQualities.length; ++i) {
        if (allQualities[i].id == x) {
            return allQualities[i];
        }
    }
    return null;
}
function deleteTraining(x) {
    for (let i = 0; i < allTrainings.length; ++i) {
        if (allTrainings[i].id == x) {
            allTrainings[i].onRemove();
            allTrainings.splice(i, 1);
        }
    }
}
function deleteQuality(x) {
    for (let i = 0; i < allQualities.length; ++i) {
        if (allQualities[i].id == x) {
            allQualities[i].onRemove();
            allQualities.splice(i, 1);
        }
    }
}

function addTrainingPoints(name, points, cpCost, isTraining = true) {
    let isTrainingExists = getTrainingByName(name);
    let isQualityExists = getQualityByName(name);

    if (!isTrainingExists && !isQualityExists) {
        if (points == 0 && name.indexOf("Perimeter") == -1 && name.indexOf("Body Size") == -1 && name.indexOf("Body Type") == -1) return; // If points is 0, dont instantiate any training.

        let func = isTraining ? newTraining : newQuality;
        return func(name, points, cpCost);
    }

    if (isTrainingExists) isTrainingExists.cpCost = cpCost;
    if (isQualityExists) isQualityExists.cpCost = cpCost;

    if (name.indexOf("Perimeter") != -1 || name.indexOf("Body Size") != -1 || name.indexOf("Body Type") != -1) return; // debug.

    if (isTrainingExists && isQualityExists) points = points / 2;
    if (isTrainingExists) isTrainingExists.increasePoints(points);
    if (isQualityExists) isQualityExists.increasePoints(points);
}
function newTraining(name, points, cpCost, arcaneRank = 1, masterSpec = null, isSwappable = true, friend = null, cName = null, mvmnt = null, def1 = null, def2 = null, dr = null) {
    let isTrainingExists = getTrainingByName(name);
    if (!isTrainingExists) {
        let _newTraining = new Training(name, arcaneRank, points, cpCost, masterSpec, true, isSwappable, friend, cName, mvmnt, def1, def2, dr);
        return _newTraining;
    }

    isTrainingExists.changeArcaneRank(arcaneRank);
    isTrainingExists.changePoints(points);
    isTrainingExists.changeCreatureName(cName);
    isTrainingExists.changeMvmnt(mvmnt);
    isTrainingExists.changeDef1(def1);
    isTrainingExists.changeDef2(def2);
    isTrainingExists.changeDR(dr);
    return isTrainingExists;
}
function newQuality(name, points, cpCost, arcaneRank = 0, masterSpec = null, isSwappable = true, friend = null, cName = null, mvmnt = null, def1 = null, def2 = null, dr = null) {
    let isTrainingExists = getQualityByName(name);
    if (!isTrainingExists) {
        let _newTraining = new Training(name, arcaneRank, points, cpCost, masterSpec, false, isSwappable, friend, cName, mvmnt, def1, def2, dr);
        return _newTraining;
    }

    isTrainingExists.changeArcaneRank(arcaneRank);
    isTrainingExists.changePoints(points);
    isTrainingExists.changeCreatureName(cName);
    isTrainingExists.changeMvmnt(mvmnt);
    isTrainingExists.changeDef1(def1);
    isTrainingExists.changeDef2(def2);
    isTrainingExists.changeDR(dr);
    return isTrainingExists;
}