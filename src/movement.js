class Movement {
    constructor(base, y, cpCost, firstXFtCpCost = null, name) {
        this.base = base;
        this.baseModifier = 0;
        this.gearPointsModifier = 0;
        this.y = y;
        this.baseCpCost = cpCost;
        this.cpCost = cpCost;
        this.firstXFtCpCost = firstXFtCpCost; // First 5 ft CpCost 20, after that 6/5.. for ex for burrow.
        this.cpCount = 0;

        this.slowPercent = 0; // 0%
        this.feetsMoved = 0;
        this.capModifier = 0;

        this.name = name;
    }

    addCapModifier(x) { this.capModifier += x; }
    reduceCapModifier(x) { this.capModifier -= x; }
    getCPCount() { return this.cpCount; }
    getCPCost() { return this.cpCost; }
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
    getPointsTotalForStatsPage() { return this.base() + this.getCPCount() + this.getGearModifier(); }
    getPointsBase() { return this.base(); }
    getGearModifier() { return this.gearPointsModifier; }
    move() {
        if (++this.feetsMoved >= this.firstXFtCpCost[0]) {
            this.cpCost = this.firstXFtCpCost[1];
        }
    }
    slowDown(x, src = null) { this.baseModifier -= x; if (src == "Gear") { this.gearPointsModifier -= x; } } // BY X FEET
    getSlow() {
        let e = mainChar.stats.getEncumbrance(); // encumbrance level
        return this.slowPercent + (e == 0 ? 0 : (e == 1 ? 20 : (e == 2 ? 40 : (e == 3 ? 60 : (e == 4 ? 100 : 0)))));
    }
    reduceSpeed(byPercent) { this.slowPercent += byPercent; }
    addSpeed(byPercent) { this.slowPercent -= byPercent; }
    getSpeed() {
        let bodySize = mainChar.stats.getSize();
        let bodySizeModifier = (bodySize == Size.Fine ? -20 : (bodySize == Size.Diminutive ? -15 : (bodySize == Size.Tiny ? -10 : (bodySize == Size.Small ? -5 : (bodySize == Size.Medium ? 0 : (
            bodySize == Size.Large ? 5 : (bodySize == Size.Huge ? 10 : (bodySize == Size.Gargantuan ? 15 : (bodySize == Size.Colossal ? 20 : 0)))))))));

        let armorModifier = mainChar.gear.getArmorMovementPenalty();
        let cpModifier = this.getCPCount();
        let _spd = (this.base() + cpModifier) - ((this.base() + cpModifier) * (this.getSlow() / 100 + (armorModifier / 100)));

        let finalSpd = _spd + bodySizeModifier + this.baseModifier;
        return finalSpd < 0 ? 0 : finalSpd;
    }
    getCap() {
        let bodyType = mainChar.stats.getBodyType();
        let bodyTypeModifier = (bodyType == BodyType.Triped ? 3 : (bodyType == BodyType.Quadruped ? 6 : (bodyType == BodyType.FiveLegs ? 6 : (bodyType == BodyType.Slithers ? 6 : (bodyType == BodyType.Rolls ? 6 : 0)))));

        let _cap = this.y() + bodyTypeModifier + this.capModifier;
        if (_cap > mainChar.cpStats.getMaxModifier()) _cap = mainChar.cpStats.getMaxModifier();

        return _cap;
    }
    turnEnded() { this.cpCost = this.baseCpCost; this.feetsMoved = 0; }
}