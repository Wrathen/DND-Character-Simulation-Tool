activeConditions = [];
lastConditionIndex = 0;

function onNewCondition(cond) {
    activeConditions.push(cond);
}

function onTurnEnded_Conditions() {
    for (let i = activeConditions.length - 1; i > -1; --i) {
        activeConditions[i].tick();
        
        if (--activeConditions[i].turnsLeft <= 0) {
            activeConditions[i].onRemoveEffect(activeConditions[i]);
            activeConditions.splice(i, 1);
        }
    }
}