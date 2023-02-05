function Table_GetCarryCapacity(x) {
    let maxHeavyLoad = 0;
    if (x >= 0) { // Positive
        if (x <= 2) maxHeavyLoad = 20 * x + 100;
        else if (x <= 4) maxHeavyLoad = 30 * x + 80;
        else if (x <= 6) maxHeavyLoad = 40 * x + 40;
        else if (x <= 8) maxHeavyLoad = 50 * x - 20;
        else if (x <= 10) maxHeavyLoad = 60 * x - 100;
        else if (x <= 12) maxHeavyLoad = 70 * x - 200;
        else if (x <= 14) maxHeavyLoad = 80 * x - 320;
        else if (x <= 16) maxHeavyLoad = 90 * x - 460;
        else if (x <= 18) maxHeavyLoad = 100 * x - 620;
        else if (x <= 20) maxHeavyLoad = 110 * x - 800;
        else if (x <= 22) maxHeavyLoad = 120 * x - 1000;
        else if (x <= 24) maxHeavyLoad = 130 * x - 1220;
        else if (x <= 26) maxHeavyLoad = 140 * x - 1460;
        else maxHeavyLoad = 150 * x - 1720;
    }
    else {
        if (x >= -2) maxHeavyLoad = 20 * x + 100;
        else if (x >= -4) maxHeavyLoad = 10 * x + 70;
        else if (x >= -7) maxHeavyLoad = 5 * x + 45;
        else {
            if (x < -10) x = -10; // Limiting CarryCapacity at -10
            maxHeavyLoad = 2 * x + 21;
        }
    }

    return [maxHeavyLoad * 0.333, maxHeavyLoad * 0.666, maxHeavyLoad];
}
function Table_GetDamageReduction(DRValue) {
    return Math.round((0.05 * DRValue) / (1 + (0.05 * DRValue)) * 100);
}
function Table_GetXP(level) {
    return (level * (50 + (25 * (level - 1))) * (level < 0 ? -1 : 1));
}

function Table_GetLevel(xp) {
    let lvl = 0;
    let tries = 0;

    if (xp >= 0) {
        while (tries < 100000) {
            let curLevelsMinXP = Table_GetXP(lvl);
            let nextLevelsMinXP = Table_GetXP(lvl + 1);

            if (xp >= curLevelsMinXP && xp < nextLevelsMinXP) {
                return lvl;
            }

            ++lvl;
            ++tries;
        }
    }
    else {
        while (tries < 100000) {
            let curLevelsMinXP = Table_GetXP(lvl);
            let nextLevelsMinXP = Table_GetXP(lvl - 1);

            if (xp <= curLevelsMinXP && xp > nextLevelsMinXP) {
                return lvl;
            }

            --lvl;
            ++tries;
        }
    }

    return 1;
}