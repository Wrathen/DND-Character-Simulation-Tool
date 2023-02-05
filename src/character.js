class Character {
    constructor(level) {
        this.name = "";
        this.stats = new Stats(level);
        this.cpStats = new CPStats(this.stats);
        this.gear = new Gear();

        this.race = "";
        this.type = "";
        this.alignment = "";
        this.age = 0;
        this.sex = "";
        this.height = 0;
        this.weight = 0;
        this.eyes = "";
        this.hair = "";

        this.languages = "";
        this.quirks = "";
        this.biography = "";
    }

    setName(newName) {
        this.name = newName;
    }
    getName() {
        if (this.name == "" || this.name == null || this.name == " ") return "Unnamed";

        const allowedChars = ["0", "1", "2","3","4","5","6","7","8","9",
        "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","r","s","t","u","v","y","z"
        , "q","w","x","_"];

        let newName = this.name;
        let _newName = "";
        for (let i = 0; i < newName.length; ++i) {
            if (!allowedChars.includes(newName.substr(i, 1).toLowerCase())) continue;

            _newName += newName.substr(i, 1);
        }

        if (_newName.length > 64) return _newName.substr(0, 64);
        return _newName;
    }
    turnEnded() {
        this.stats.turnEnded();
    }

    setRace(x) { this.race = x; }
    setType(x) { this.type = x; }
    setAlignment(x) { this.alignment = x; }
    setSex(x) { this.sex = x; }
    setAge(x) { 
        x = isNaN(parseInt(x)) ? 0: parseInt(x);
        this.age = x;
    }
    setHeight(x) { 
        x = isNaN(parseInt(x)) ? 0: parseInt(x);
        this.height = x;
    }
    setWeight(x) { 
        x = isNaN(parseInt(x)) ? 0: parseInt(x);
        this.weight = x;
    }
    setExp(x) {
        x = isNaN(parseInt(x)) ? 0: parseInt(x);
        this.stats.setXP(x); 
    }
    setEyes(x) { this.eyes = x; }
    setHair(x) { this.hair = x; }
    setLanguages(x) { this.languages = x; }
    setQuirks(x) { this.quirks = x; }
    setBiography(x) { this.biography = x; }
    getExp() { return this.stats.getXP(); }

    getRace() { return this.race; }
    getType() { return this.type; }
    getAlignment() { return this.alignment; }
    getSex() { return this.sex; }
    getHeight() { return this.height; }
    getWeight() { return this.weight; }
    getEyes() { return this.eyes; }
    getHair() { return this.hair; }
    getAge() { return this.age; }
    getLanguages() { return this.languages; }
    getQuirks() { return this.quirks; }
    getBiography() { return this.biography; }
}