const Pages = {
    Menu: 0,
    Main: 1,
    Statistics: 2,
    Details: 3,
    Gear: 4,
    Abilities: 5
}

function pageNumberToString(number) {
    if (number == 0) return "Menu";
    else if (number == 1) return "Main";
    else if (number == 2) return "Stats";
    else if (number == 3) return "Details";
    else if (number == 4) return "Gear";
    else if (number == 5) return "Spells";
    return "Character List";
}
function resetDiv(div, alwaysOpen = true, ifItsClosedDontDoIt = true) {
    let isChecked = div.isChecked();
    if (ifItsClosedDontDoIt && !isChecked) return;

    div.onInput();

    if (!isChecked && !alwaysOpen)
        div.onInput();
    if (isChecked) // If it was open at first, we should reopen it at this point because we just closed it. We are trying to reset it.
        div.onInput();
}


// Page Variables
var currentPage = Pages.Menu;
// Navigator
var pnavSetUp, pnav_main, pnav_statistics, pnav_details, pnav_gear, pnav_abilities;
var pnavIsSetUp = false;
// PAGES_MENU
var pmenu_Div, pmenu_newChar, pmenu_load;
// PAGES
var pmainShownAddedDefences = [];
var pmain = {};
var pstats = {};
var pdetails = {};
var pgear = {};
var pspells = {};
var currentTooltip;
var openedSections = [0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0];

function setupNavigators() {
    pnav_main = createButton("Main");
    pnav_main.mousePressed(() => { changePage(Pages.Main) });
    pnav_statistics = createButton("Stats");
    pnav_statistics.mousePressed(() => { changePage(Pages.Statistics) });
    pnav_details = createButton("Details");
    pnav_details.mousePressed(() => { changePage(Pages.Details) });
    pnav_gear = createButton("Gear");
    pnav_gear.mousePressed(() => { changePage(Pages.Gear) });
    pnav_abilities = createButton("Spells");
    pnav_abilities.mousePressed(() => { changePage(Pages.Abilities) });

    pnav_main.class("navButton");
    pnav_statistics.class("navButton");
    pnav_details.class("navButton");
    pnav_gear.class("navButton");
    pnav_abilities.class("navButton");

    let firstRow = createDiv();
    firstRow.class("navigation");

    var cell1 = createDiv();
    var cell2 = createDiv();
    var cell3 = createDiv();
    var cell4 = createDiv();
    var cell5 = createDiv();
    cell1.class("navDiv");
    cell2.class("navDiv");
    cell3.class("navDiv");
    cell4.class("navDiv");
    cell5.class("navDiv");
    firstRow.child(cell1);
    firstRow.child(cell2);
    firstRow.child(cell3);
    firstRow.child(cell4);
    firstRow.child(cell5);
    cell1.child(pnav_main);
    cell2.child(pnav_statistics);
    cell3.child(pnav_details);
    cell4.child(pnav_gear);
    cell5.child(pnav_abilities);
}
function setupPageMenu() {
    let newCharFunction = () => {
        var response = prompt("Please enter the Character Level: ");
        if (response == null) return; // when you click cancel...

        if (!isNaN(parseInt(response))) {
            let level = parseInt(response);

            mainChar = new Character(level);
            mainChar.stats.hp = mainChar.stats.getMaxHP();
            mainChar.stats.mana = mainChar.stats.getMaxMana();
            mainChar.stats.stamina = mainChar.stats.getMaxStamina();
            changePage(Pages.Main);
        }
        else alert("You didn't enter a number. Please enter a number between 1 and 30.")
    }
    let loadFunction = () => {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = ".chd";
        input.onchange = (e) => { loadCharFile(e.target.files[0]); }

        input.click();
    }
    // <input type="file" accept=".chd" id="testeringen">
    pmenu_Div = new myElement(createDiv());
    pmenu_newChar = new myElement(createButton("New Character"), "menuButton", pmenu_Div, newCharFunction);
    pmenu_load = new myElement(createButton("Load a Character"), "menuButton", pmenu_Div, loadFunction);

    pmenu_newChar.style("width", "160px");
    pmenu_load.style("width", "160px");
    pmenu_load.style("margin-top", "25px");

    pmenu_Div.style("width", "160px");
    pmenu_Div.style("margin", "auto");
    pmenu_Div.style("margin-top", "42vh");
}
class myElement {
    constructor(p5Element, elementClass = "", elementParent = null, onClick = null, onInput = null, onChange = null, onBlur = null, isAntiDecimal = false, cap = null) {
        this.p5Element = p5Element;
        this.p5ElementClass = elementClass;
        this.onClick = onClick;
        this.onInput = onInput;
        this.onChange = onChange;
        this.onBlur = onBlur;
        this.elementParent = elementParent;
        this._isChecked = false;

        this.class(elementClass);

        this.tempValue = null;
        this.cap = cap;
        this.func = this.p5Element.elt.tagName == "INPUT" ? (x = null) => { return this.value(x); } : (x = null) => { return this.html(x); };

        if (elementParent != null) elementParent.child(this);
        if (onInput != null) { p5Element.input(onInput); }

        if (isAntiDecimal) {
            this.antiDecimal();
        }

        if (p5Element.elt.tagName == "INPUT") {
            if (this.value() == "0" || !isNaN(parseFloat(this.value())))
                this.attribute("type", "tel");

            if (onClick == null) p5Element.mousePressed(() => { this.checkIfWantsNumber(); this.clearValue(); });
            else p5Element.mousePressed(() => { onClick(); this.checkIfWantsNumber(); this.clearValue(); });
            if (onChange == null) p5Element.changed(() => { this.blur(); this.resetAllSections() });
            else p5Element.changed(() => { onChange(); this.blur(); this.resetAllSections() });
            if (onBlur == null) p5Element.elt.onblur = () => { this.retrieveValue(); this.clamp(); if (isAntiDecimal) { this.antiDecimal(); } };
            else p5Element.elt.onblur = () => { this.retrieveValue(); onBlur(); this.clamp(); if (isAntiDecimal) { this.antiDecimal(); } };
        }
        else {
            if (onClick != null) p5Element.mousePressed(onClick);
            if (onChange != null) p5Element.changed(onChange);
            if (onBlur != null) this.p5Element.elt.onblur = onBlur;
        }
    }

    checkIfWantsNumber() {
        let _type = this.attribute("type");
        let _value = this.value();

        if (_type == "checkbox" || _type == "tel") return;

        if (_value == "0" || !isNaN(parseFloat(_value)))
            this.attribute("type", "tel");
    }
    resetAllSections() {
        if (currentPage == Pages.Statistics) {
            resetDiv(pstats.sdMainCheckBox, false);
            resetDiv(pstats.sdAttributesCheckBox, false);
            resetDiv(pstats.sdVSDefensesCheckBox, false);
            resetDiv(pstats.sdDamageRedCheckBox, false);
            resetDiv(pstats.sdVSEnviroCheckBox, false);
            resetDiv(pstats.sdMovementCheckBox, false);
            resetDiv(pstats.sdSkillsCheckBox, false);
            resetDiv(pstats.sdPowersCheckBox, false);
            resetDiv(pstats.sdMiscellaneousCheckBox, false);
        }
    }
    roundToNearestFive(suffix = "") {
        let x = this.func();
        x = isNaN(parseFloat(x)) ? 0 : Math.round(parseFloat(x));
        let left = x % 5;

        if (x >= 0) { // if X is Positive
            if (left >= 2.5) this.func(parseInt(x + (5 - left)) + suffix);
            else this.func(parseInt(x - left) + suffix);
        }
        else {
            if (left >= -2.5) this.func(parseInt(x - left) + suffix);
            else this.func(parseInt(x + (-left - 5)) + suffix);
        }
    }
    roundDecimal(suffix = "", prefix = "") {
        let x = this.func();
        if (prefix != "") x = x.replace(prefix, "");
        x = isNaN(parseFloat(x)) ? 0 : parseFloat(x);
        this.func(prefix + parseFloat(x.toFixed(1)) + suffix);
    }
    round(suffix = "") {
        let x = this.func();
        x = isNaN(parseFloat(x)) ? 0 : parseFloat(x);
        this.func(Math.round(x) + suffix);
    }
    clamp(suffix = "") {
        if (this.cap != null) {
            let x = this.func();
            x = isNaN(parseInt(x)) ? 0 : parseInt(x);
            if (x > this.cap) x = this.cap;
            if (x < -this.cap) x = -this.cap;
            this.func(x + suffix);
        }
    }
    antiDecimal(suffix = "") {
        let x = this.func();
        x = isNaN(parseInt(x)) ? 0 : parseInt(x);
        this.func(x + suffix);
    }
    retrieveValue() {
        if (this.value() == "" || this.value() == " ") {
            this.value(this.tempValue);
        }
    }
    clearValue() {
        this.tempValue = this.value();
        this.value("");
    }
    blur() {
        this.p5Element.elt.blur();
    }
    style(attrib, val) {
        this.p5Element.style(attrib, val);
    }
    attribute(x, y = undefined) {
        return (this.p5Element.attribute(x, y));
    }
    swapChecked() { this._isChecked = !this._isChecked; }
    isChecked() { return this._isChecked; }
    selectValue(val = null) {
        if (val == null) return this.p5Element.elt.selectedIndex;
        this.p5Element.elt.selectedIndex = val;
    }
    option(val) {
        if (!val.length) { this.p5Element.option(val); return; } // Single Addition

        for (let i = 0; i < val.length; ++i) // Array addition
            this.p5Element.option(val[i]);
    }
    value(val = null) {
        if (val == null) return this.p5Element.value();
        this.p5Element.value(val);
    }
    html(val = null) {
        if (val == null) return this.p5Element.html();
        this.p5Element.html(val);
    }
    child(p5El = null) { // p5 Child
        if (p5El == null) return this.p5Element.child();
        this.p5Element.child(p5El.p5Element);
    }
    class(c) {
        this.p5Element.class(c);
    }
    remove() {
        this.p5Element.remove();
    }
}
function setupPageMain() {
    // Functions
    var calculateDamageTaken = () => {
        if (!pmain.sdSuffer_InputRawDamage || !pmain.sdSuffer_TextDamageTaken) return;

        let val = pmain.sdSuffer_InputRawDamage.value();
        val = (val == "" || val == null || val == " ") ? 0 : val;

        let pureDamage = (isNaN(parseInt(val))) ? 0 : parseInt(val);
        let damageTypeName = pmain.sdSuffer_SelectDamageType.value();
        let damageType = getDamageTypeByName(damageTypeName);

        if (damageType == null) {
            alert("Unexpected Error!");
            pmain.sdSuffer_TextDamageTaken.html("= 0" + " Damage Taken");
            return;
        }

        let mainWeirdNumber = getWeirdNumber(damageType, mainChar.stats.getMaxHP());
        let weirdNumberTotal = mainWeirdNumber;

        if (damageTypeName == "Blunt" || damageTypeName == "Slashing" || damageTypeName == "Piercing") {
            weirdNumberTotal += getWeirdNumber(DamageTypes.Physical, mainChar.stats.getMaxHP());
        }

        for (let i = 0; i < pmainShownAddedDefences.length; ++i) {
            let _addedDefence = pmainShownAddedDefences[i];
            let checkBoxOn = _addedDefence.checkBoxIsOn;
            if (checkBoxOn) weirdNumberTotal += getWeirdNumber(pmainShownAddedDefences[i], mainChar.stats.getMaxHP());
        }

        let DRPercentage = Table_GetDamageReduction(weirdNumberTotal) / 100;
        let finalDamage = pureDamage - (pureDamage * DRPercentage);
        pmain.sdSuffer_TextDamageTaken.html("= " + parseInt(finalDamage) + " Damage Taken");

        return finalDamage;
    };

    // Shrinkable Main Info
    pmain.sdMain = new myElement(createDiv(), "shrinkableDiv");
    pmain.sdMainCheckBox = new myElement(createInput("", "checkbox"), "shrinkableInputField", pmain.sdMain, null, () => {
        let hidden = pmain.sdMainText.html().indexOf("+ Main") != -1 ? false : true;
        pmain.sdMainText.html((hidden ? "+ Main" : "- Main"));

        if (hidden) {
            openedSections[0] = 0;
            pmain.sdMainText.class("shrinkableHeader");

            Object.keys(pmain).forEach(function (key) {
                if (key.startsWith("sdMain") && key != "sdMain" && key != "sdMainCheckBox" && key != "sdMainText") {
                    pmain[key].remove();
                    delete pmain[key];
                }
            });
        }
        else {
            openedSections[0] = 1;
            pmain.sdMainText.class("shrinkableHeaderHidden");

            // Top of Main Info
            // Big Div, Name + Movement stats in this div.
            pmain.sdMain_BigDiv = new myElement(createDiv(), "shrinkableInsideSplitToTwoDiv", pmain.sdMain);
            pmain.sdMain_SplitDivLeftSide = new myElement(createDiv(), "shrinkableInsideSplitToTwo", pmain.sdMain_BigDiv);
            pmain.sdMain_SplitDivRightSide = new myElement(createDiv(), "shrinkableInsideSplitToTwo", pmain.sdMain_BigDiv);

            ////////////////////////////////////////////////////////// LEFT SIDE ///////////////////////////////////////////////////////
            // Name
            pmain.sdMain_DivName = new myElement(createDiv(), "shrinkableDivInput", pmain.sdMain_SplitDivLeftSide);
            pmain.sdMain_TextName = new myElement(createP("Name: "), "shrinkableP", pmain.sdMain_DivName);
            pmain.sdMain_InputName = new myElement(createInput(mainChar.name), "shrinkableInputText", pmain.sdMain_DivName, null, () => {
                mainChar.setName(pmain.sdMain_InputName.value());
            }, () => {
            });

            // Hit Points
            pmain.sdMain_DivHP = new myElement(createDiv(), "shrinkableDivInput", pmain.sdMain_SplitDivLeftSide);
            pmain.sdMain_TextHP = new myElement(createP("Hit Points: "), "shrinkableP", pmain.sdMain_DivHP);
            pmain.sdMain_InputHP = new myElement(createInput(mainChar.stats.getHP()), "shrinkableInputNumber", pmain.sdMain_DivHP, null, () => {
                let val = pmain.sdMain_InputHP.value();
                val = (val == "" || val == null || val == " ") ? 0 : val;

                if (!isNaN(parseInt(val))) mainChar.stats.setHP(parseInt(val)); // If its a number, change stats.
            }, () => {
                pmain.sdMain_InputHP.value(mainChar.stats.getHP());
            });
            pmain.sdMain_SuffixTextHP = new myElement(createP("/" + Math.round(mainChar.stats.getMaxHP())), "shrinkableInputNumberSuffixP", pmain.sdMain_DivHP);

            // Mana
            pmain.sdMain_DivMana = new myElement(createDiv(), "shrinkableDivInput", pmain.sdMain_SplitDivLeftSide);
            pmain.sdMain_TextMana = new myElement(createP("Mana: "), "shrinkableP", pmain.sdMain_DivMana);
            pmain.sdMain_InputMana = new myElement(createInput(mainChar.stats.getMana()), "shrinkableInputNumber", pmain.sdMain_DivMana, null, () => {
                let val = pmain.sdMain_InputMana.value();
                val = (val == "" || val == null || val == " ") ? 0 : val;

                if (!isNaN(parseInt(val))) mainChar.stats.setMana(parseInt(val)); // If its a number, change stats.
            }, () => {
                pmain.sdMain_InputMana.value(mainChar.stats.getMana());
            });
            pmain.sdMain_SuffixTextMana = new myElement(createP("/" + Math.round(mainChar.stats.getMaxMana())), "shrinkableInputNumberSuffixP", pmain.sdMain_DivMana);

            // Stamina
            pmain.sdMain_DivStamina = new myElement(createDiv(), "shrinkableDivInput", pmain.sdMain_SplitDivLeftSide);
            pmain.sdMain_TextStamina = new myElement(createP("Stamina: "), "shrinkableP", pmain.sdMain_DivStamina);
            pmain.sdMain_InputStamina = new myElement(createInput(mainChar.stats.getStamina()), "shrinkableInputNumber", pmain.sdMain_DivStamina, null, () => {
                let val = pmain.sdMain_InputStamina.value();
                val = (val == "" || val == null || val == " ") ? 0 : val;

                if (!isNaN(parseInt(val))) mainChar.stats.setStamina(parseInt(val)); // If its a number, change stats.
            }, () => {
                pmain.sdMain_InputStamina.value(mainChar.stats.getStamina());
            });
            pmain.sdMain_SuffixTextStamina = new myElement(createP("/" + Math.round(mainChar.stats.getMaxStamina())), "shrinkableInputNumberSuffixP", pmain.sdMain_DivStamina);

            ////////////////////////////////////////////////////////// RIGHT SIDE ///////////////////////////////////////////////////////
            pmain.sdMain_DivMovement = new myElement(createDiv(), "shrinkablePMainMovementBigDiv", pmain.sdMain_SplitDivRightSide);
            pmain.sdMain_DivMovementFirstRow = new myElement(createDiv(), "shrinkablePMainMovementOneThirdDiv", pmain.sdMain_DivMovement);
            pmain.sdMain_DivMovementSecondRow = new myElement(createDiv(), "shrinkablePMainMovementOneThirdDiv", pmain.sdMain_DivMovement);
            pmain.sdMain_DivMovementThirdRow = new myElement(createDiv(), "shrinkablePMainMovementOneThirdDiv", pmain.sdMain_DivMovement);

            pmain.sdMain_DivMovementGround = new myElement(createDiv(), "shrinkablePMainMovementMiniDiv", pmain.sdMain_DivMovementFirstRow);
            pmain.sdMain_DivMovementClimb = new myElement(createDiv(), "shrinkablePMainMovementMiniDiv", pmain.sdMain_DivMovementFirstRow);
            pmain.sdMain_DivMovementJump = new myElement(createDiv(), "shrinkablePMainMovementMiniDiv", pmain.sdMain_DivMovementFirstRow);

            pmain.sdMain_DivMovementSwim = new myElement(createDiv(), "shrinkablePMainMovementMiniDiv", pmain.sdMain_DivMovementSecondRow);
            pmain.sdMain_DivMovementBurrow = new myElement(createDiv(), "shrinkablePMainMovementMiniDiv", pmain.sdMain_DivMovementSecondRow);
            pmain.sdMain_DivMovementFlight = new myElement(createDiv(), "shrinkablePMainMovementMiniDiv", pmain.sdMain_DivMovementSecondRow);

            pmain.sdMain_DivMovementOTAs = new myElement(createDiv(), "shrinkablePMainMovementMiniDiv", pmain.sdMain_DivMovementThirdRow);
            pmain.sdMain_DivMovementQckStp = new myElement(createDiv(), "shrinkablePMainMovementMiniDiv", pmain.sdMain_DivMovementThirdRow);
            pmain.sdMain_DivMovementDive = new myElement(createDiv(), "shrinkablePMainMovementMiniDiv", pmain.sdMain_DivMovementThirdRow);

            pmain.sdMain_TextMovementGroundNumber = new myElement(createP(mainChar.stats.movements.ground.getSpeed() + "ft"), "shrinkablePMainMovementP", pmain.sdMain_DivMovementGround)
            pmain.sdMain_TextMovementGroundLabel = new myElement(createP("Ground"), "shrinkablePMainMovementP", pmain.sdMain_DivMovementGround);
            pmain.sdMain_TextMovementClimbNumber = new myElement(createP(mainChar.stats.movements.climb.getSpeed() + "ft"), "shrinkablePMainMovementP", pmain.sdMain_DivMovementClimb)
            pmain.sdMain_TextMovementClimbLabel = new myElement(createP("Climb"), "shrinkablePMainMovementP", pmain.sdMain_DivMovementClimb);
            pmain.sdMain_TextMovementJumpNumber = new myElement(createP(mainChar.stats.movements.jump.getSpeed() + "ft"), "shrinkablePMainMovementP", pmain.sdMain_DivMovementJump)
            pmain.sdMain_TextMovementJumpLabel = new myElement(createP("Jump"), "shrinkablePMainMovementP", pmain.sdMain_DivMovementJump);

            pmain.sdMain_TextMovementSwimNumber = new myElement(createP(mainChar.stats.movements.swim.getSpeed() + "ft"), "shrinkablePMainMovementP", pmain.sdMain_DivMovementSwim)
            pmain.sdMain_TextMovementSwimLabel = new myElement(createP("Swim"), "shrinkablePMainMovementP", pmain.sdMain_DivMovementSwim);
            pmain.sdMain_TextMovementBurrowNumber = new myElement(createP(mainChar.stats.movements.burrow.getSpeed() + "ft"), "shrinkablePMainMovementP", pmain.sdMain_DivMovementBurrow)
            pmain.sdMain_TextMovementBurrowLabel = new myElement(createP("Burrow"), "shrinkablePMainMovementP", pmain.sdMain_DivMovementBurrow);
            pmain.sdMain_TextMovementFlightNumber = new myElement(createP(mainChar.stats.movements.flight.getSpeed() + "ft"), "shrinkablePMainMovementP", pmain.sdMain_DivMovementFlight)
            pmain.sdMain_TextMovementFlightLabel = new myElement(createP("Flight"), "shrinkablePMainMovementP", pmain.sdMain_DivMovementFlight);

            pmain.sdMain_TextMovementOTAsNumber = new myElement(createP(mainChar.stats.getOTAs()), "shrinkablePMainMovementP", pmain.sdMain_DivMovementOTAs)
            pmain.sdMain_TextMovementOTAsLabel = new myElement(createP("OTAs"), "shrinkablePMainMovementP", pmain.sdMain_DivMovementOTAs);
            pmain.sdMain_TextMovementQckStpNumber = new myElement(createP(mainChar.stats.getQuickStep() + "ft"), "shrinkablePMainMovementP", pmain.sdMain_DivMovementQckStp)
            pmain.sdMain_TextMovementQckStpLabel = new myElement(createP("QckStp"), "shrinkablePMainMovementP", pmain.sdMain_DivMovementQckStp);
            pmain.sdMain_TextMovementDiveNumber = new myElement(createP(mainChar.stats.getDive() + "ft"), "shrinkablePMainMovementP", pmain.sdMain_DivMovementDive)
            pmain.sdMain_TextMovementDiveLabel = new myElement(createP("Dive"), "shrinkablePMainMovementP", pmain.sdMain_DivMovementDive);

            pmain.sdMain_TextMovementGroundNumber.roundToNearestFive("ft");
            pmain.sdMain_TextMovementClimbNumber.roundToNearestFive("ft");
            pmain.sdMain_TextMovementJumpNumber.roundToNearestFive("ft");
            pmain.sdMain_TextMovementSwimNumber.roundToNearestFive("ft");
            pmain.sdMain_TextMovementBurrowNumber.roundToNearestFive("ft");
            pmain.sdMain_TextMovementFlightNumber.roundToNearestFive("ft");
            pmain.sdMain_TextMovementQckStpNumber.roundToNearestFive("ft");
            pmain.sdMain_TextMovementDiveNumber.roundToNearestFive("ft");

            // Middle of Main Info
            pmain.sdMain_BigDivMiddle = new myElement(createDiv(), "shrinkableInsideSplitToOneDiv", pmain.sdMain);

            pmain.sdMain_SpaceDiv = new myElement(createDiv(), "shrinkablePMainSpaceDiv", pmain.sdMain_BigDivMiddle);
            // Space
            pmain.sdMain_TextSpace = new myElement(createP("Space: "), "shrinkablePMainSpaceP", pmain.sdMain_SpaceDiv);
            pmain.sdMain_InputSpaceLength = new myElement(createInput(mainChar.stats.getSpaceLength()), "shrinkablePMainSpaceInput", pmain.sdMain_SpaceDiv, null, () => {
                let val = pmain.sdMain_InputSpaceLength.value();
                val = (val == "" || val == null || val == " ") ? 0 : val;

                if (!isNaN(parseInt(val))) mainChar.stats.setSpaceLength(parseInt(val)); // If its a number, change stats.
            }, () => {
                pmain.sdMain_InputSpaceLength.value(mainChar.stats.getSpaceLength());
            }); // Left
            pmain.sdMain_TextSpaceLabelFirst = new myElement(createP("ft /"), "shrinkablePMainSpaceP", pmain.sdMain_SpaceDiv);
            pmain.sdMain_InputSpaceWidth = new myElement(createInput(mainChar.stats.getSpaceWidth()), "shrinkablePMainSpaceInput", pmain.sdMain_SpaceDiv, null, () => {
                let val = pmain.sdMain_InputSpaceWidth.value();
                val = (val == "" || val == null || val == " ") ? 0 : val;

                if (!isNaN(parseInt(val))) mainChar.stats.setSpaceWidth(parseInt(val)); // If its a number, change stats.
            }, () => {
                pmain.sdMain_InputSpaceWidth.value(mainChar.stats.getSpaceWidth());
            }); // Right
            pmain.sdMain_TextSpaceLabelSecond = new myElement(createP("ft"), "shrinkablePMainSpaceP", pmain.sdMain_SpaceDiv);

            // Initiative
            pmain.sdMain_InitiativeAPDiv = new myElement(createDiv(), "", pmain.sdMain_BigDivMiddle);
            pmain.sdMain_TextInitiative = new myElement(createP("Initiative: " + formatNumber(Math.round(mainChar.stats.getInitiative()))), "shrinkablePMainSpaceP", pmain.sdMain_InitiativeAPDiv);

            // AP
            pmain.sdMain_TextAP = new myElement(createP("AP: " + Math.round(mainChar.stats.getAP())), "shrinkablePMainSpaceP", pmain.sdMain_InitiativeAPDiv);
            pmain.sdMain_InitiativeAPDiv.style("display", "flex");
            pmain.sdMain_TextInitiative.style("width", "50%");
            pmain.sdMain_TextInitiative.style("max-width", "160px");
            pmain.sdMain_TextAP.style("min-width", "45%");

            // Encumbrance
            pmain.sdMain_DivEncumbrance = new myElement(createDiv(), "shrinkablePMainConditionListItemDiv", pmain.sdMain_BigDivMiddle);
            pmain.sdMain_TextEncumbrance = new myElement(createP("Encumbrance: " + mainChar.stats.getEncumbranceText()), "shrinkablePMainSpaceP", pmain.sdMain_DivEncumbrance, () => {
                if (currentTooltip) currentTooltip.remove();

                currentTooltip = new myElement(createP(mainChar.stats.getEncumbranceTooltip()), "shrinkablePMainConditionTooltipShown", pmain.sdMain_DivEncumbrance, () => {
                    currentTooltip.remove();
                });
            });
            pmain.sdMain_TextEncumbrance.style("background-color", "rgb(42, 34, 34)");
            pmain.sdMain_TextEncumbrance.style("min-width", "95%");

            // Bottom of Main Info
            pmain.sdMain_BigDivBottom = new myElement(createDiv(), "shrinkableInsideSplitToOneDiv", pmain.sdMain);

            // Weapons
            var weaponString = mainChar.gear.getWeapons();
            pmain.sdMain_TextWeapon = new myElement(createP(weaponString), "shrinkablePMainWeaponP", pmain.sdMain_BigDivBottom);

            // Weapon Stats, 2 divs
            pmain.sdMain_DivWeaponStats = new myElement(createDiv(), "shrinkablePMainWeaponDoubleDiv", pmain.sdMain_BigDivBottom);
            pmain.sdMain_DivWeaponStatsTop = new myElement(createDiv(), "shrinkablePMainWeaponMiniDiv", pmain.sdMain_DivWeaponStats);
            pmain.sdMain_DivWeaponStatsBottom = new myElement(createDiv(), "shrinkablePMainWeaponMiniDiv", pmain.sdMain_DivWeaponStats);

            pmain.sdMain_TextWeaponDamage = new myElement(createP("Damage: " + formatNumber(Math.round(mainChar.gear.getWeaponDamage()))), "shrinkablePMainSpaceP", pmain.sdMain_DivWeaponStatsTop);
            pmain.sdMain_TextWeaponAccuracy = new myElement(createP("Accuracy: " + formatNumber(Math.round(mainChar.gear.getWeaponAccuracy()))), "shrinkablePMainSpaceP", pmain.sdMain_DivWeaponStatsTop);

            pmain.sdMain_TextWeaponDodge = new myElement(createP("Dodge: " + formatNumber(Math.round(mainChar.gear.getWeaponDodge()))), "shrinkablePMainSpaceP", pmain.sdMain_DivWeaponStatsBottom);
            pmain.sdMain_TextWeaponApAP = new myElement(createP("AttcksPerAP: " + mainChar.gear.getWeaponApAP()), "shrinkablePMainSpaceP", pmain.sdMain_DivWeaponStatsBottom);

            pmain.sdMain_TextWeaponDodge = new myElement(createP("Crit/CritDam: " + mainChar.gear.getCritAndCritDamage()), "shrinkablePMainSpaceP", pmain.sdMain_DivWeaponStatsTop);
            pmain.sdMain_TextWeaponApAP = new myElement(createP("Range: " + mainChar.gear.getWeaponRange()), "shrinkablePMainSpaceP", pmain.sdMain_DivWeaponStatsBottom);
        }
    });
    pmain.sdMainText = new myElement(createP("+ Main"), "shrinkableHeader", pmain.sdMain);

    // Shrinkable Suffer Damage
    pmain.sdSuffer = new myElement(createDiv(), "shrinkableDiv");
    pmain.sdSufferCheckBox = new myElement(createInput("", "checkbox"), "shrinkableInputField", pmain.sdSuffer, null, () => {
        let hidden = pmain.sdSufferText.html().indexOf("+ Suffer Damage") != -1 ? false : true;
        pmain.sdSufferText.html((hidden ? "+ Suffer Damage" : "- Suffer Damage"));

        if (hidden) {
            openedSections[1] = 0;
            pmain.sdSufferText.class("shrinkableHeader");

            Object.keys(pmain).forEach(function (key) {
                if (key.startsWith("sdSuffer") && key != "sdSuffer" && key != "sdSufferCheckBox" && key != "sdSufferText") {
                    pmain[key].remove();
                    delete pmain[key];
                }
            });
        }
        else {
            openedSections[1] = 1;
            pmain.sdSufferText.class("shrinkableHeaderHidden");

            pmain.sdSuffer_BigDiv = new myElement(createDiv(), "shrinkablePMainSufferSplitToTwoDiv", pmain.sdSuffer);
            pmain.sdSuffer_SplitDivLeftSide = new myElement(createDiv(), "shrinkablePMainSufferSplitToTwo", pmain.sdSuffer_BigDiv);
            pmain.sdSuffer_SplitDivRightSide = new myElement(createDiv(), "shrinkablePMainSufferSplitToTwo", pmain.sdSuffer_BigDiv);
            pmain.sdSuffer_SplitDivLeftSideLeft = new myElement(createDiv(), "shrinkablePMainSufferDiv", pmain.sdSuffer_SplitDivLeftSide);
            pmain.sdSuffer_SplitDivLeftSideRight = new myElement(createDiv(), "shrinkablePMainSufferDiv", pmain.sdSuffer_SplitDivLeftSide);

            pmain.sdSuffer_SplitDivLeftSide.style("display", "flex");
            pmain.sdSuffer_SplitDivLeftSide.style("min-width", "75%");
            pmain.sdSuffer_SplitDivLeftSide.style("max-width", "75%");
            pmain.sdSuffer_SplitDivLeftSideLeft.style("max-width", "50%");
            pmain.sdSuffer_SplitDivLeftSideRight.style("max-width", "50%");
            pmain.sdSuffer_SplitDivLeftSideLeft.style("min-width", "50%");
            pmain.sdSuffer_SplitDivLeftSideRight.style("min-width", "50%");
            pmain.sdSuffer_SplitDivLeftSideRight.style("display", "block");
            pmain.sdSuffer_SplitDivRightSide.style("min-width", "20%");
            pmain.sdSuffer_SplitDivRightSide.style("max-width", "20%");

            pmain.sdSuffer_InputRawDamage = new myElement(createInput(), "shrinkablePSufferLeftSideInput", pmain.sdSuffer_SplitDivLeftSideLeft, null, () => {
                calculateDamageTaken();
            }, () => {
                let val = pmain.sdSuffer_InputRawDamage.value();
                val = (val == "" || val == null || val == " ") ? 0 : val;

                pmain.sdSuffer_InputRawDamage.value(val);

                pmain.sdSuffer_InputRawDamage.round();
                calculateDamageTaken();
            });
            pmain.sdSuffer_SelectDamageType = new myElement(createSelect(), "shrinkablePSufferLeftSideSelect", pmain.sdSuffer_SplitDivLeftSideRight, null, null, () => {
                calculateDamageTaken();
            });
            pmain.sdSuffer_TextDamageTaken = new myElement(createP("= 0 Damage Taken"), "shrinkablePMainSpaceP", pmain.sdSuffer_SplitDivLeftSideRight);

            pmain.sdSuffer_SelectDamageType.option(["Physical", "Blunt", "Slashing", "Piercing", "Neg. Energy", "Pos. Energy", "Fire", "Cold", "Lightning", "Acid", "Sonic", "Radiation"]);
            pmain.sdSuffer_ButtonTakeDamage = new myElement(createButton("Take Damage"), "shrinkablePMainSufferButton", pmain.sdSuffer_SplitDivRightSide, () => {
                let damageTaken = calculateDamageTaken();
                mainChar.stats.setHP(mainChar.stats.getHP() - damageTaken);
                pmain.sdSuffer_InputRawDamage.value("0");
                calculateDamageTaken();
                pmain.sdMain_InputHP.value(mainChar.stats.getHP());
            });

            pmain.sdSuffer_InputRawDamage.style("min-width", "90%");
            pmain.sdSuffer_InputRawDamage.style("margin", "5px");
        }
    });
    pmain.sdSufferText = new myElement(createP("+ Suffer Damage"), "shrinkableHeader", pmain.sdSuffer);

    // Shrinkable Conditions
    pmain.sdCondition = new myElement(createDiv(), "shrinkableDiv");
    pmain.sdConditionCheckBox = new myElement(createInput("", "checkbox"), "shrinkableInputField", pmain.sdCondition, null, () => {
        let hidden = pmain.sdConditionText.html().indexOf("+ Conditions") != -1 ? false : true;
        pmain.sdConditionText.html((hidden ? "+ Conditions" : "- Conditions"));

        if (hidden) {
            openedSections[2] = 0;
            pmain.sdConditionText.class("shrinkableHeader");

            Object.keys(pmain).forEach(function (key) {
                if (key.startsWith("sdCondition") && key != "sdCondition" && key != "sdConditionCheckBox" && key != "sdConditionText") {
                    pmain[key].remove();
                    delete pmain[key];
                }
            });

            if (pmain.sdCondition_DivList) {
                let uiConditions = pmain.sdCondition_DivList.child();
                for (let i = 0; i < uiConditions.length; ++i) uiConditions[i].remove();
            }
        }
        else {
            openedSections[2] = 1;
            // Functions
            var addSelectSuffixOptions = (type) => {
                for (let i = pmain.sdCondition_SelectConditionSuffix.p5Element.elt.length - 1; i > -1; --i) { // Remove all Options first.
                    pmain.sdCondition_SelectConditionSuffix.p5Element.elt[i] = null;
                }

                pmain.sdCondition_SelectConditionSuffix.option(["Select Suffix"]);

                if (type == "Bound")
                    pmain.sdCondition_SelectConditionSuffix.option(["One Leg", "Both Legs", "One Arm", "Both Arms", "One Hand", "Both Hands"]);
                else if (type == "Enfeebled")
                    pmain.sdCondition_SelectConditionSuffix.option(["Strength", "Intelligence", "Agility", "Discipline", "Conviction", "Attunement", "Constitution"]);
                else if (type == "Hindered")
                    pmain.sdCondition_SelectConditionSuffix.option(["Ground", "Swim", "Climb", "Jump", "Burrow", "Flight"]);
                else if (type == "Partial Paralysis")
                    pmain.sdCondition_SelectConditionSuffix.option(["Left Arm", "Right Arm", "Leg", "Torso", "Head", "General"]);
                else if (type == "Vulnerable")
                    pmain.sdCondition_SelectConditionSuffix.option(["Physical", "Blunt", "Slashing", "Piercing", "Neg. Energy", "Pog. Energy", "Fire", "Cold", "Lightning", "Acid", "Sonic", "Radiation"]);
            }
            var addCondition = (_suf = null, _val = null) => {
                let selectedCondition, selectedSuffix, suffixValue;

                selectedCondition = pmain.sdCondition_SelectCondition.value();
                if (pmain.sdCondition_SelectConditionSuffix) selectedSuffix = pmain.sdCondition_SelectConditionSuffix.value();
                if (pmain.sdCondition_InputConditionNumber) {
                    suffixValue = pmain.sdCondition_InputConditionNumber.value();
                    suffixValue = isNaN(parseInt(suffixValue)) ? 0 : parseInt(suffixValue);
                }

                selectedSuffix = _suf != null ? _suf : selectedSuffix;
                suffixValue = _val != null ? _val : suffixValue;

                if (selectedCondition == "Add Condition") alert("Please Select a Condition First!");
                else if (selectedSuffix == "Select Suffix") alert("Please Select a Suffix!");
                else {
                    let ourNewCondition = newConditionFromString(selectedCondition, selectedSuffix, suffixValue);

                    var _DivItem = new myElement(createDiv(), "shrinkablePMainConditionListItemDiv", pmain.sdCondition_DivList);
                    var _DivTextName = new myElement(createDiv(), "shrinkablePMainConditionItemPDiv", _DivItem, () => {
                        if (currentTooltip) currentTooltip.remove();

                        currentTooltip = new myElement(createP(ourNewCondition.tooltip), "shrinkablePMainConditionTooltipShown", _DivItem, () => {
                            currentTooltip.remove();
                        });
                    });
                    var _TextName = new myElement(createP(ourNewCondition.uiName), "shrinkablePMainConditionItemP", _DivTextName);
                    var _InputTurns = new myElement(createInput(ourNewCondition.turnsLeft + " Turns"), "shrinkablePMainConditionItemInput", _DivItem, null, null, () => {
                        let val = _InputTurns.value();
                        val = (isNaN(parseInt(val))) ? ourNewCondition.getTurnsLeft() : parseInt(val);
                        val = val == 0 ? ourNewCondition.getTurnsLeft() : val;

                        ourNewCondition.setTurnsLeft(val);
                        _InputTurns.value(val + " Turns");
                    });
                    var _ButtonDelete = new myElement(createButton("X"), "shrinkablePMainConditionItemButton", _DivItem, () => {
                        var id = ourNewCondition.id;

                        for (let i = 0; i < activeConditions.length; ++i) {
                            if (activeConditions[i].id == id) {
                                if (activeConditions[i].onRemoveEffect(activeConditions[i]) != false) {
                                    activeConditions.splice(i, 1);
                                }
                                break;
                            }
                        }

                        _TextName.remove();
                        _InputTurns.remove();
                        _DivItem.remove();
                        _ButtonDelete.remove();
                    });
                }
            }
            var addAllConditions = () => {
                for (let i = 0; i < activeConditions.length; ++i) {
                    let cond = activeConditions[i];

                    let _DivItem = new myElement(createDiv(), "shrinkablePMainConditionListItemDiv", pmain.sdCondition_DivList);
                    let _DivTextName = new myElement(createDiv(), "shrinkablePMainConditionItemPDiv", _DivItem, () => {
                        if (currentTooltip) currentTooltip.remove();

                        currentTooltip = new myElement(createP(cond.tooltip), "shrinkablePMainConditionTooltipShown", _DivItem, () => {
                            currentTooltip.remove();
                        });
                    });
                    let _TextName = new myElement(createP(cond.uiName), "shrinkablePMainConditionItemP", _DivTextName);
                    let _InputTurns = new myElement(createInput(cond.turnsLeft + " Turns"), "shrinkablePMainConditionItemInput", _DivItem, null, null, () => {
                        let val = _InputTurns.value();
                        val = (isNaN(parseInt(val))) ? cond.getTurnsLeft() : parseInt(val);
                        val = val == 0 ? cond.getTurnsLeft() : val;

                        cond.setTurnsLeft(val);
                        _InputTurns.value(val + " Turns");
                    });
                    let _ButtonDelete = new myElement(createButton("X"), "shrinkablePMainConditionItemButton", _DivItem, () => {
                        let id = cond.id;

                        for (let j = 0; j < activeConditions.length; ++j) {
                            if (activeConditions[j].id == id) {
                                if (activeConditions[j].onRemoveEffect(activeConditions[j]) != false) {
                                    activeConditions.splice(j, 1);
                                }
                                break;
                            }
                        }

                        _TextName.remove();
                        _InputTurns.remove();
                        _DivItem.remove();
                        _ButtonDelete.remove();
                    });
                }
            }
            var tempEndTurn = () => {
                endTurn();

                if (pmain.sdCondition_DivList) { // remove all
                    let uiConditions = pmain.sdCondition_DivList.child();
                    for (let i = uiConditions.length - 1; i > -1; --i) uiConditions[i].remove();
                }
                addAllConditions(); // then add again.
            }
            var setupWeakenedConditionUI = (_bigDiv) => {
                let div = new myElement(createDiv(), "shrinkablePGearQualityDiv", _bigDiv);

                let select1 = new myElement(createSelect(), "shrinkablePGearInput", div, null, null, () => { check(select1.value(), 0); });
                let select2 = new myElement(createSelect(), "shrinkablePGearInput", div, null, null, () => { check(select2.value(), 1); });
                let select3 = new myElement(createSelect(), "shrinkablePGearInput", div, null, null, () => { check(select3.value(), 2); });
                let select4 = new myElement(createSelect(), "shrinkablePGearInput", div, null, null, () => { check(select4.value(), 3); });

                let inputField = new myElement(createInput(""), "shrinkablePGearInput", div);

                let selects = [select1, select2, select3, select4];

                select1.option(["Select One", "Main Stats*", "Vs Defenses*", "Vs Environment*", "Skills*", "Powers*"]);
                select2.style("display", "none");
                select3.style("display", "none");
                select4.style("display", "none");
                inputField.style("display", "none");

                let check = (str, index) => {
                    if (index == selects.length) return;

                    if (pmain.sdCondition_ButtonAddCondition) {
                        pmain.sdCondition_ButtonAddCondition.remove();
                        delete pmain.sdCondition_ButtonAddCondition;
                    }
                    if (inputField) inputField.remove();

                    for (let i = index + 1; i < selects.length; ++i) {
                        selects[i].remove();
                        selects[i] = new myElement(createSelect(), "shrinkablePGearInput", div, null, null, () => {
                            check(selects[i].value(), i);
                        });
                    }

                    if (str == "Main Stats*")
                        selects[index + 1].option(["Max HP", "Max Stamina", "Max Mana", "Accuracy", "Parry", "Damage"]);
                    else if (str == "Vs Defenses*")
                        selects[index + 1].option(["Main Defenses*", "Magics*", "Psionics", "Technology", "Nature", "Objects*", "Creatures*", "Alignments*", "Luck", "Illusion"]);
                    else if (str == "Main Defenses*")
                        selects[index + 1].option(["Reflex", "Shapechange", "Balance", "Toxic", "Destruction", "Hold Pos.", "Compulsions", "Emotions", "Concentration", "Scry", "Grip", "Restraint"]);
                    else if (str == "Magics*")
                        selects[index + 1].option(["Magic", "Arcane", "Divine", "Primal", "Blood", "Gem", "Witchcraft"]);
                    else if (str == "Objects*")
                        selects[index + 1].option(["Object Group*", "Metal", "Stone", "Bone"]);
                    else if (str == "Object Group*")
                        selects[index + 1].option(["Blades", "Axe", "Mace/Hammer", "Polearms", "Bows", "Guns", "Crossbows"]);
                    else if (str == "Creatures*")
                        selects[index + 1].option(["Add Type", "Add Subtype", "Add Species"]);
                    else if (str == "Alignments*")
                        selects[index + 1].option(["Specific*", "Type Group*"]);
                    else if (str == "Specific*")
                        selects[index + 1].option(["Lawful Good", "Chaotic Good", "Neutral Good", "Lawful Neutral", "True Neutral", "Chaotic Neutral", "Neutral Evil", "Lawful Evil", "Chaotic Evil"]);
                    else if (str == "Type Group*")
                        selects[index + 1].option(["Lawful", "Chaotic", "Good", "Evil", "Neutral"]);
                    else if (str == "Vs Environment*")
                        selects[index + 1].option(["Spot", "Listen", "Scent", "Traps", "Environment Hot", "Environment Cold", "Breathe", "Surprise"]);
                    else if (str == "Skills*")
                        selects[index + 1].option(["Knowledge (All)", "Bluff", "Diplomacy", "Disguise", "Flight", "Hide", "Insight", "Intimidate", "Medicine", "Move Silently", "Pick Lock", "Pick Pocket", "Survival", "Track", "Acting", "Escape Artist", "Sleight of Hand"]);
                    else if (str == "Powers*") {
                        let _allPowers = [];
                        for (let i = 0; i < allPowersArray.length; ++i) {
                            _allPowers.push(allPowersArray[i].name);
                        }
                        selects[index + 1].option(_allPowers);
                    }




                    if (index + 1 != selects.length && selects[index + 1].value().indexOf("*") != -1) {
                        check(selects[index + 1].value(), index + 1); // If the next one is a group, keep recursing
                    }
                    else {
                        for (let i = index + 1; i < 4; ++i) if (selects[i].value() == "") selects[i].style("display", "none");

                        if (selects[0].value() == "Select One") return;
                        inputField = new myElement(createInput(""), "shrinkablePGearInput", div);

                        if (!pmain.sdCondition_ButtonAddCondition) {
                            pmain.sdCondition_ButtonAddCondition = new myElement(createButton("Add"), "shrinkablePMainConditionHalfButton", pmain.sdCondition_DivRight, () => {
                                let _suf = "";
                                let _val = inputField.value();
                                _val = isNaN(parseInt(_val)) ? 0 : parseInt(_val);

                                let sel4Val = selects[3].value();
                                let sel3Val = selects[2].value();
                                let sel2Val = selects[1].value();
                                let sel1Val = selects[0].value();

                                if (sel4Val != "" && sel4Val != null && sel4Val != undefined) _suf = sel4Val;
                                else if (sel3Val != "" && sel3Val != null && sel3Val != undefined) _suf = sel3Val;
                                else if (sel2Val != "" && sel2Val != null && sel2Val != undefined) _suf = sel2Val;
                                else if (sel1Val != "" && sel1Val != null && sel1Val != undefined) _suf = sel1Val;

                                if (_suf == "Add Type" || _suf == "Add Subtype" || _suf == "Add Species")
                                    _val = inputField.value();

                                addCondition(_suf, _val);
                            });

                            pmain.sdCondition_ButtonEndTurn.remove();
                            delete pmain.sdCondition_ButtonEndTurn;
                            pmain.sdCondition_ButtonEndTurn = new myElement(createButton("End Turn"), "shrinkablePMainConditionHalfButtonEnd", pmain.sdCondition_DivRight, tempEndTurn);
                        }
                    }
                }
            }

            pmain.sdConditionText.class("shrinkableHeaderHidden");
            // Big Div
            pmain.sdCondition_BigDiv = new myElement(createDiv(), "shrinkablePMainConditionSplitTwoDiv", pmain.sdCondition);
            pmain.sdCondition_DivLeft = new myElement(createDiv(), "shrinkablePMainConditionLeftSide", pmain.sdCondition_BigDiv);
            pmain.sdCondition_DivRight = new myElement(createDiv(), "shrinkablePMainConditionRightSide", pmain.sdCondition_BigDiv);


            pmain.sdCondition_SelectCondition = new myElement(createSelect(), "shrinkablePMainConditionSelect", pmain.sdCondition_DivLeft, null, null, () => {
                let selectedType = pmain.sdCondition_SelectCondition.value();
                if (selectedType != "Add Condition") {
                    if (!pmain.sdCondition_ButtonAddCondition) {
                        pmain.sdCondition_ButtonEndTurn.remove();
                        delete pmain.sdCondition_ButtonEndTurn;

                        pmain.sdCondition_ButtonAddCondition = new myElement(createButton("Add"), "shrinkablePMainConditionHalfButton", pmain.sdCondition_DivRight, addCondition);
                        pmain.sdCondition_ButtonEndTurn = new myElement(createButton("End Turn"), "shrinkablePMainConditionHalfButtonEnd", pmain.sdCondition_DivRight, tempEndTurn);
                    }
                }
                else {
                    if (pmain.sdCondition_ButtonAddCondition) {
                        pmain.sdCondition_ButtonEndTurn.class("shrinkablePMainConditionButtonEnd");
                        pmain.sdCondition_ButtonAddCondition.remove();
                        delete pmain.sdCondition_ButtonAddCondition;
                    }
                }


                if (selectedType == "Bound" || selectedType == "Enfeebled" || selectedType == "Hindered" || selectedType == "Vulnerable" || selectedType == "Partial Paralysis") { // Suffix Selection
                    if (!pmain.sdCondition_SelectConditionSuffix)
                        pmain.sdCondition_SelectConditionSuffix = new myElement(createSelect(), "shrinkablePMainConditionSelect", pmain.sdCondition_DivLeft);

                    addSelectSuffixOptions(selectedType);
                }
                else {
                    if (pmain.sdCondition_SelectConditionSuffix) {
                        pmain.sdCondition_SelectConditionSuffix.remove();
                        delete pmain.sdCondition_SelectConditionSuffix;
                    }
                }

                if (selectedType == "Enfeebled" || selectedType == "Dazzled" || selectedType == "Hindered" ||
                    selectedType == "Decelerated" || selectedType == "Soul Drain" || selectedType == "Pain" || selectedType == "Vulnerable") { // Value
                    if (!pmain.sdCondition_DivConditionNumber) {
                        pmain.sdCondition_DivConditionNumber = new myElement(createDiv(), "shrinkablePMainConditionMiniDiv", pmain.sdCondition_DivLeft);
                        pmain.sdCondition_TextConditionNumber = new myElement(createP("Value: "), "shrinkablePMainConditionP", pmain.sdCondition_DivConditionNumber);
                        pmain.sdCondition_InputConditionNumber = new myElement(createInput("0"), "shrinkablePMainConditionInput", pmain.sdCondition_DivConditionNumber, null, null, () => {
                            let val = pmain.sdCondition_InputConditionNumber.value();
                            val = (isNaN(parseInt(val))) ? 0 : parseInt(val);
                            pmain.sdCondition_InputConditionNumber.value(val);
                        });
                    }
                }
                else {
                    if (pmain.sdCondition_DivConditionNumber) {
                        pmain.sdCondition_DivConditionNumber.remove();
                        pmain.sdCondition_TextConditionNumber.remove();
                        pmain.sdCondition_InputConditionNumber.remove();

                        delete pmain.sdCondition_DivConditionNumber;
                        delete pmain.sdCondition_TextConditionNumber;
                        delete pmain.sdCondition_InputConditionNumber;
                    }
                }

                if (selectedType == "Weakened") {
                    if (!pmain.sdCondition_DivWeakened) {
                        pmain.sdCondition_DivWeakened = new myElement(createDiv(), "", pmain.sdCondition_DivLeft);

                        pmain.sdCondition_ButtonAddCondition.remove();
                        delete pmain.sdCondition_ButtonAddCondition;

                        setupWeakenedConditionUI(pmain.sdCondition_DivWeakened);
                    }
                }
                else {
                    if (pmain.sdCondition_DivWeakened) {
                        pmain.sdCondition_DivWeakened.remove();
                        delete pmain.sdCondition_DivWeakened;

                        pmain.sdCondition_ButtonAddCondition.remove();
                        delete pmain.sdCondition_ButtonAddCondition;
                        pmain.sdCondition_ButtonEndTurn.remove();
                        delete pmain.sdCondition_ButtonEndTurn;


                        pmain.sdCondition_ButtonAddCondition = new myElement(createButton("Add"), "shrinkablePMainConditionHalfButton", pmain.sdCondition_DivRight, addCondition);
                        pmain.sdCondition_ButtonEndTurn = new myElement(createButton("End Turn"), "shrinkablePMainConditionHalfButtonEnd", pmain.sdCondition_DivRight, tempEndTurn);
                    }
                }
            });

            pmain.sdCondition_SelectCondition.option(["Add Condition", "Physical Anchor", "Suffocated", "Strangled", "Drowning", "Bound", "Semi-Blinded", "Blinded", "Burning", "Aflame", "Ablaze",
                "Chilled", "Frosted", "Frozen", "Charmed", "Dominated", "Enthralled", "Confusion", "Insanity", "Random Action", "Staggered", "Dazed", "Stunned", "Dazzled",
                "Hearing Loss", "Deafened", "Partially Held", "Held", "Enfeebled", "Incensed", "Controlled Rage", "Uncontrolled Rage", "Berserk", "Flat-Footed",
                "Fascinate", "Fatigue", "Exhausted", "Shakened", "Frightened", "Panicked", "Helpless", "Hindered", "Off-Balance", "Prone", "Sickened", "Nauseated",
                "Repulsed", "Decelerated", "Slowed", "Stopped", "Soul Drain", "Invisible", "Imp. Invisible", "Pain", "Partial Paralysis", "Total Paralysis", "Unconscious", "Vulnerable", "Weakened"]);
            pmain.sdCondition_ButtonEndTurn = new myElement(createButton("End Turn"), "shrinkablePMainConditionButtonEnd", pmain.sdCondition_DivRight, tempEndTurn);

            // Condition List
            pmain.sdCondition_DivList = new myElement(createDiv(), "shrinkablePMainConditionListDiv", pmain.sdCondition);
            addAllConditions();
        }
    });
    pmain.sdConditionText = new myElement(createP("+ Conditions"), "shrinkableHeader", pmain.sdCondition);

    // Shrinkable Vs Defense
    pmain.sdDefense = new myElement(createDiv(), "shrinkableDiv");
    pmain.sdDefenseCheckBox = new myElement(createInput("", "checkbox"), "shrinkableInputField", pmain.sdDefense, null, () => {
        let hidden = pmain.sdDefenseText.html().indexOf("+ Vs Defense") != -1 ? false : true;
        pmain.sdDefenseText.html((hidden ? "+ Vs Defense" : "- Vs Defense"));

        if (hidden) {
            openedSections[3] = 0;
            pmain.sdDefenseText.class("shrinkableHeader");

            Object.keys(pmain).forEach(function (key) {
                if (key.startsWith("sdDefense") && key != "sdDefense" && key != "sdDefenseCheckBox" && key != "sdDefenseText") {
                    if (pmain[key].length != 0)
                        pmain[key].remove();

                    delete pmain[key];
                }
            });
        }
        else {
            openedSections[3] = 1;
            pmain.sdDefenseText.class("shrinkableHeaderHidden");
            let reflex = Math.round(VSDefs.Reflex.getPoints());
            let shapechange = Math.round(VSDefs.Shapechange.getPoints());
            let balance = Math.round(VSDefs.Balance.getPoints());
            let toxic = Math.round(VSDefs.Toxic.getPoints());
            let destruction = Math.round(VSDefs.Destruction.getPoints());
            let holdPos = Math.round(VSDefs.HoldPos.getPoints());
            let restraints = Math.round(VSDefs.Restraint.getPoints());
            let grip = Math.round(VSDefs.Grip.getPoints());
            let compulsions = Math.round(VSDefs.Compulsions.getPoints());
            let emotions = Math.round(VSDefs.Emotions.getPoints());
            let concentration = Math.round(VSDefs.Concentration.getPoints());
            let scry = Math.round(VSDefs.Scry.getPoints());

            reflex = formatNumber(reflex);
            shapechange = formatNumber(shapechange);
            balance = formatNumber(balance);
            toxic = formatNumber(toxic);
            destruction = formatNumber(destruction);
            holdPos = formatNumber(holdPos);
            restraints = formatNumber(restraints);
            grip = formatNumber(grip);
            compulsions = formatNumber(compulsions);
            emotions = formatNumber(emotions);
            concentration = formatNumber(concentration);
            scry = formatNumber(scry);

            // Big Div
            pmain.sdDefense_BigDiv = new myElement(createDiv(), "shrinkablePMainDefenseBigDiv", pmain.sdDefense);
            pmain.sdDefense_DefaultDefensesDiv = new myElement(createDiv(), "shrinkablePMainDefenseDefaultBigDiv", pmain.sdDefense_BigDiv);
            pmain.sdDefense_DivLeftSide = new myElement(createDiv(), "shrinkablePMainDefenseSplitTwoDiv", pmain.sdDefense_DefaultDefensesDiv);
            pmain.sdDefense_DivLeftMiniLeftSide = new myElement(createDiv(), "shrinkablePMainDefenseMiniLeftDiv", pmain.sdDefense_DivLeftSide);
            pmain.sdDefense_DivLeftMiniRightSide = new myElement(createDiv(), "shrinkablePMainDefenseMiniRightDiv", pmain.sdDefense_DivLeftSide);

            pmain.sdDefense_DivRightSide = new myElement(createDiv(), "shrinkablePMainDefenseSplitTwoDiv", pmain.sdDefense_DefaultDefensesDiv);
            pmain.sdDefense_DivRightMiniLeftSide = new myElement(createDiv(), "shrinkablePMainDefenseMiniLeftDiv", pmain.sdDefense_DivRightSide);
            pmain.sdDefense_DivRightMiniRightSide = new myElement(createDiv(), "shrinkablePMainDefenseMiniRightDiv", pmain.sdDefense_DivRightSide);

            pmain.sdDefense_TextReflexLeft = new myElement(createP("Reflex"), "shrinkablePMainDefenseP", pmain.sdDefense_DivLeftMiniLeftSide);
            pmain.sdDefense_TextReflexRight = new myElement(createP(reflex), "shrinkablePMainDefenseP", pmain.sdDefense_DivLeftMiniRightSide);
            pmain.sdDefense_TextShapechangeLeft = new myElement(createP("Shapechange"), "shrinkablePMainDefenseP", pmain.sdDefense_DivRightMiniLeftSide);
            pmain.sdDefense_TextShapechangeRight = new myElement(createP(shapechange), "shrinkablePMainDefenseP", pmain.sdDefense_DivRightMiniRightSide);

            pmain.sdDefense_TextBalanceLeft = new myElement(createP("Balance"), "shrinkablePMainDefenseP", pmain.sdDefense_DivLeftMiniLeftSide);
            pmain.sdDefense_TextBalanceRight = new myElement(createP(balance), "shrinkablePMainDefenseP", pmain.sdDefense_DivLeftMiniRightSide);
            pmain.sdDefense_TextToxicLeft = new myElement(createP("Toxic"), "shrinkablePMainDefenseP", pmain.sdDefense_DivRightMiniLeftSide);
            pmain.sdDefense_TextToxicRight = new myElement(createP(toxic), "shrinkablePMainDefenseP", pmain.sdDefense_DivRightMiniRightSide);

            pmain.sdDefense_TextDestructionLeft = new myElement(createP("Destruction"), "shrinkablePMainDefenseP", pmain.sdDefense_DivLeftMiniLeftSide);
            pmain.sdDefense_TextDestructionRight = new myElement(createP(destruction), "shrinkablePMainDefenseP", pmain.sdDefense_DivLeftMiniRightSide);
            pmain.sdDefense_TextHoldPosLeft = new myElement(createP("Hold Pos."), "shrinkablePMainDefenseP", pmain.sdDefense_DivRightMiniLeftSide);
            pmain.sdDefense_TextHoldPosRight = new myElement(createP(holdPos), "shrinkablePMainDefenseP", pmain.sdDefense_DivRightMiniRightSide);

            pmain.sdDefense_TextRestraintsLeft = new myElement(createP("Restraints"), "shrinkablePMainDefenseP", pmain.sdDefense_DivLeftMiniLeftSide);
            pmain.sdDefense_TextRestraintsRight = new myElement(createP(restraints), "shrinkablePMainDefenseP", pmain.sdDefense_DivLeftMiniRightSide);
            pmain.sdDefense_TextGripLeft = new myElement(createP("Grip"), "shrinkablePMainDefenseP", pmain.sdDefense_DivRightMiniLeftSide);
            pmain.sdDefense_TextGripRight = new myElement(createP(grip), "shrinkablePMainDefenseP", pmain.sdDefense_DivRightMiniRightSide);

            pmain.sdDefense_TextCompulsionsLeft = new myElement(createP("Compulsions"), "shrinkablePMainDefenseP", pmain.sdDefense_DivLeftMiniLeftSide);
            pmain.sdDefense_TextCompulsionsRight = new myElement(createP(compulsions), "shrinkablePMainDefenseP", pmain.sdDefense_DivLeftMiniRightSide);
            pmain.sdDefense_TextEmotionsLeft = new myElement(createP("Emotions"), "shrinkablePMainDefenseP", pmain.sdDefense_DivRightMiniLeftSide);
            pmain.sdDefense_TextEmotionsRight = new myElement(createP(emotions), "shrinkablePMainDefenseP", pmain.sdDefense_DivRightMiniRightSide);

            pmain.sdDefense_TextConcentrationLeft = new myElement(createP("Concentration"), "shrinkablePMainDefenseP", pmain.sdDefense_DivLeftMiniLeftSide);
            pmain.sdDefense_TextConcentrationRight = new myElement(createP(concentration), "shrinkablePMainDefenseP", pmain.sdDefense_DivLeftMiniRightSide);
            pmain.sdDefense_TextScryLeft = new myElement(createP("Scry"), "shrinkablePMainDefenseP", pmain.sdDefense_DivRightMiniLeftSide);
            pmain.sdDefense_TextScryRight = new myElement(createP(scry), "shrinkablePMainDefenseP", pmain.sdDefense_DivRightMiniRightSide);

            let addedCustomDefenses = 0;

            pmain.sdDefense_AddedDefensesDiv = new myElement(createDiv(), "shrinkablePMainDefenseDefaultBigDiv", pmain.sdDefense_BigDiv);
            pmain.sdDefense_AddedDivLeftSide = new myElement(createDiv(), "shrinkablePMainDefenseSplitTwoDiv", pmain.sdDefense_AddedDefensesDiv);
            pmain.sdDefense_AddedDivLeftMiniLeftSide = new myElement(createDiv(), "shrinkablePMainDefenseMiniLeftDivX", pmain.sdDefense_AddedDivLeftSide);
            pmain.sdDefense_AddedDivLeftMiniRightSide = new myElement(createDiv(), "shrinkablePMainDefenseMiniRightDivX", pmain.sdDefense_AddedDivLeftSide);

            pmain.sdDefense_AddedDivRightSide = new myElement(createDiv(), "shrinkablePMainDefenseSplitTwoDiv", pmain.sdDefense_AddedDefensesDiv);
            pmain.sdDefense_AddedDivRightMiniLeftSide = new myElement(createDiv(), "shrinkablePMainDefenseMiniLeftDivX", pmain.sdDefense_AddedDivRightSide);
            pmain.sdDefense_AddedDivRightMiniRightSide = new myElement(createDiv(), "shrinkablePMainDefenseMiniRightDivX", pmain.sdDefense_AddedDivRightSide);
            for (let i = 0; i < AddedDefensesArray.length; ++i) {
                if (AddedDefensesArray[i].getPoints() != 0) {
                    let customDefence = AddedDefensesArray[i];
                    let _name = customDefence.getName();
                    let _points = Math.round(customDefence.getPoints());
                    let checkBoxIncluded = (AddedDefensesArray[i].name == "Luck" || AddedDefensesArray[i].name == "Illusion" ? false : true);

                    _points = formatNumber(_points);
                    // Create Holders, Divs
                    if (addedCustomDefenses % 2 == 0) {
                        let checkBoxItself = null;
                        if (checkBoxIncluded) {
                            let miniminiDiv = new myElement(createDiv(), "shrinkableDivInputX", pmain.sdDefense_AddedDivLeftMiniRightSide);
                            new myElement(createP(_points), "shrinkablePMainDefensePX", miniminiDiv);
                            checkBoxItself = new myElement(createCheckbox(), "shrinkablePMainCustomDefenseCheckBoxX", miniminiDiv, null, null, () => {
                                customDefence.checkBoxIsOn = checkBoxItself.p5Element.elt.children[0] ? checkBoxItself.p5Element.elt.children[0].checked : false;
                                calculateDamageTaken();
                            });
                        }

                        (new myElement(createP(_name), "shrinkablePMainDefenseP", pmain.sdDefense_AddedDivLeftMiniLeftSide));
                        if (checkBoxIncluded) checkBoxItself;

                        if (!checkBoxIncluded)
                            new myElement(createP(_points), "shrinkablePMainDefenseP", pmain.sdDefense_AddedDivLeftMiniRightSide);
                    }
                    if (addedCustomDefenses % 2 == 1) {
                        let checkBoxItself2 = null;
                        if (checkBoxIncluded) {
                            let miniminiDiv2 = new myElement(createDiv(), "shrinkableDivInputX", pmain.sdDefense_AddedDivRightMiniRightSide);
                            new myElement(createP(_points), "shrinkablePMainDefensePX", miniminiDiv2);
                            checkBoxItself2 = new myElement(createCheckbox(), "shrinkablePMainCustomDefenseCheckBoxX", miniminiDiv2, null, null, () => {
                                customDefence.checkBoxIsOn = checkBoxItself2.p5Element.elt.children[0] ? checkBoxItself2.p5Element.elt.children[0].checked : false;
                                calculateDamageTaken();
                            });
                        }

                        (new myElement(createP(_name), "shrinkablePMainDefenseP", pmain.sdDefense_AddedDivRightMiniLeftSide));
                        if (checkBoxIncluded) (checkBoxItself2);

                        if (!checkBoxIncluded)
                            new myElement(createP(_points), "shrinkablePMainDefenseP", pmain.sdDefense_AddedDivRightMiniRightSide);
                    }

                    // If we are already in there, don't enter again.
                    let flag = false;
                    for (let j = 0; j < pmainShownAddedDefences.length; ++j) {
                        if (pmainShownAddedDefences[j].getName() == _name) {
                            flag = true;
                            break;
                        }
                    }
                    if (!flag) pmainShownAddedDefences.push(customDefence);

                    addedCustomDefenses++;
                }
            }
        }
    });
    pmain.sdDefenseText = new myElement(createP("+ Vs Defense"), "shrinkableHeader", pmain.sdDefense);

    // Shrinkable Vs Environment
    pmain.sdEnv = new myElement(createDiv(), "shrinkableDiv");
    pmain.sdEnvCheckBox = new myElement(createInput("", "checkbox"), "shrinkableInputField", pmain.sdEnv, null, () => {
        let hidden = pmain.sdEnvText.html().indexOf("+ Vs Environment") != -1 ? false : true;
        pmain.sdEnvText.html((hidden ? "+ Vs Environment" : "- Vs Environment"));

        if (hidden) {
            openedSections[4] = 0;
            pmain.sdEnvText.class("shrinkableHeader");

            Object.keys(pmain).forEach(function (key) {
                if (key.startsWith("sdEnv") && key != "sdEnv" && key != "sdEnvCheckBox" && key != "sdEnvText") {
                    pmain[key].remove();
                    delete pmain[key];
                }
            });
        }

        else {
            openedSections[4] = 1;
            pmain.sdEnvText.class("shrinkableHeaderHidden");
            let spot = Math.round(VSEnvironments.Spot.getPoints());
            let breathe = Math.round(VSEnvironments.Breathe.getPoints());
            let listen = Math.round(VSEnvironments.Listen.getPoints());
            let traps = Math.round(VSEnvironments.Traps.getPoints());
            let scent = Math.round(VSEnvironments.Scent.getPoints());
            let surprise = Math.round(VSEnvironments.Surprise.getPoints());
            let envHot = Math.round(VSEnvironments.EnvHot.getPoints() + DamageTypes.Fire.getPoints());
            let envCold = Math.round(VSEnvironments.EnvCold.getPoints() + DamageTypes.Cold.getPoints());

            breathe = formatNumber(breathe);
            traps = formatNumber(traps);
            scent = formatNumber(scent);
            surprise = formatNumber(surprise);
            envHot = formatNumber(envHot);
            envCold = formatNumber(envCold);

            if (spot < -10000) spot = "n/a";
            else spot = formatNumber(spot);
            if (listen < -10000) listen = "n/a";
            else listen = formatNumber(listen);
            // Big Div
            pmain.sdEnv_BigDiv = new myElement(createDiv(), "shrinkablePMainDefenseBigDiv", pmain.sdEnv);
            pmain.sdEnv_BigDiv.style("display", "flex");
            pmain.sdEnv_DivLeftSide = new myElement(createDiv(), "shrinkablePMainDefenseSplitTwoDiv", pmain.sdEnv_BigDiv);
            pmain.sdEnv_DivLeftMiniLeftSide = new myElement(createDiv(), "shrinkablePMainDefenseMiniLeftDiv", pmain.sdEnv_DivLeftSide);
            pmain.sdEnv_DivLeftMiniRightSide = new myElement(createDiv(), "shrinkablePMainDefenseMiniRightDiv", pmain.sdEnv_DivLeftSide);

            pmain.sdEnv_DivRightSide = new myElement(createDiv(), "shrinkablePMainDefenseSplitTwoDiv", pmain.sdEnv_BigDiv);
            pmain.sdEnv_DivRightMiniLeftSide = new myElement(createDiv(), "shrinkablePMainDefenseMiniLeftDiv", pmain.sdEnv_DivRightSide);
            pmain.sdEnv_DivRightMiniRightSide = new myElement(createDiv(), "shrinkablePMainDefenseMiniRightDiv", pmain.sdEnv_DivRightSide);

            pmain.sdEnv_TextSpotLeft = new myElement(createP("Spot"), "shrinkablePMainDefenseP", pmain.sdEnv_DivLeftMiniLeftSide);
            pmain.sdEnv_TextSpotRight = new myElement(createP(spot), "shrinkablePMainDefenseP", pmain.sdEnv_DivLeftMiniRightSide);
            pmain.sdEnv_TextBreatheLeft = new myElement(createP("Breathe"), "shrinkablePMainDefenseP", pmain.sdEnv_DivRightMiniLeftSide);
            pmain.sdEnv_TextBreatheRight = new myElement(createP(breathe), "shrinkablePMainDefenseP", pmain.sdEnv_DivRightMiniRightSide);

            pmain.sdEnv_TextListenLeft = new myElement(createP("Listen"), "shrinkablePMainDefenseP", pmain.sdEnv_DivLeftMiniLeftSide);
            pmain.sdEnv_TextListenRight = new myElement(createP(listen), "shrinkablePMainDefenseP", pmain.sdEnv_DivLeftMiniRightSide);
            pmain.sdEnv_TextTrapsLeft = new myElement(createP("Traps"), "shrinkablePMainDefenseP", pmain.sdEnv_DivRightMiniLeftSide);
            pmain.sdEnv_TextTrapsRight = new myElement(createP(traps), "shrinkablePMainDefenseP", pmain.sdEnv_DivRightMiniRightSide);

            pmain.sdEnv_TextScentLeft = new myElement(createP("Scent"), "shrinkablePMainDefenseP", pmain.sdEnv_DivLeftMiniLeftSide);
            pmain.sdEnv_TextScentRight = new myElement(createP(scent), "shrinkablePMainDefenseP", pmain.sdEnv_DivLeftMiniRightSide);
            pmain.sdEnv_TextEnvHotLeft = new myElement(createP("Env. Hot"), "shrinkablePMainDefenseP", pmain.sdEnv_DivRightMiniLeftSide);
            pmain.sdEnv_TextEnvHotRight = new myElement(createP(envHot), "shrinkablePMainDefenseP", pmain.sdEnv_DivRightMiniRightSide);

            pmain.sdEnv_TextSurpriseLeft = new myElement(createP("Surprise"), "shrinkablePMainDefenseP", pmain.sdEnv_DivLeftMiniLeftSide);
            pmain.sdEnv_TextSurpriseRight = new myElement(createP(surprise), "shrinkablePMainDefenseP", pmain.sdEnv_DivLeftMiniRightSide);
            pmain.sdEnv_TextEnvColdLeft = new myElement(createP("Env. Cold"), "shrinkablePMainDefenseP", pmain.sdEnv_DivRightMiniLeftSide);
            pmain.sdEnv_TextEnvColdRight = new myElement(createP(envCold), "shrinkablePMainDefenseP", pmain.sdEnv_DivRightMiniRightSide);
        }
    });
    pmain.sdEnvText = new myElement(createP("+ Vs Environment"), "shrinkableHeader", pmain.sdEnv);

    // Shrinkable Damage Defenses
    pmain.sdDmg = new myElement(createDiv(), "shrinkableDiv");
    pmain.sdDmgCheckBox = new myElement(createInput("", "checkbox"), "shrinkableInputField", pmain.sdDmg, null, () => {
        let hidden = pmain.sdDmgText.html().indexOf("+ Damage Reductions") != -1 ? false : true;
        pmain.sdDmgText.html((hidden ? "+ Damage Reductions" : "- Damage Reductions"));

        if (hidden) {
            openedSections[5] = 0;
            pmain.sdDmgText.class("shrinkableHeader");

            Object.keys(pmain).forEach(function (key) {
                if (key.startsWith("sdDmg") && key != "sdDmg" && key != "sdDmgCheckBox" && key != "sdDmgText") {
                    pmain[key].remove();
                    delete pmain[key];
                }
            });
        }
        else {
            openedSections[5] = 1;
            pmain.sdDmgText.class("shrinkableHeaderHidden");

            //let physical = Math.round(DamageTypes.Physical.getPercentage());
            let ArmorModifier = mainChar.gear.equipments.armor.cpForDamageReductions;
            let fire = formatNumber(Math.round(DamageTypes.Fire.getPoints() - ArmorModifier));
            let blunt = Math.round(DamageTypes.Blunt.getPercentage()) + "%";
            let cold = formatNumber(Math.round(DamageTypes.Cold.getPoints() - ArmorModifier));
            let slashing = Math.round(DamageTypes.Slashing.getPercentage()) + "%";
            let lightning = formatNumber(Math.round(DamageTypes.Lightning.getPoints() - ArmorModifier));
            let piercing = Math.round(DamageTypes.Piercing.getPercentage()) + "%";
            let acid = formatNumber(Math.round(DamageTypes.Acid.getPoints() - ArmorModifier));
            let negEnergy = formatNumber(Math.round(DamageTypes.NegEnergy.getPoints() - ArmorModifier));
            let sonic = formatNumber(Math.round(DamageTypes.Sonic.getPoints() - ArmorModifier));
            let posEnergy = formatNumber(Math.round(DamageTypes.PosEnergy.getPoints() - ArmorModifier));
            let radiation = formatNumber(Math.round(DamageTypes.Radiation.getPoints() - ArmorModifier));

            fire = Math.round(DamageTypes.Fire.getPercentage()) + "%/" + fire;
            cold = Math.round(DamageTypes.Cold.getPercentage()) + "%/" + cold;
            lightning = Math.round(DamageTypes.Lightning.getPercentage()) + "%/" + lightning;
            acid = Math.round(DamageTypes.Acid.getPercentage()) + "%/" + acid;
            sonic = Math.round(DamageTypes.Sonic.getPercentage()) + "%/" + sonic;
            radiation = Math.round(DamageTypes.Radiation.getPercentage()) + "%/" + radiation;
            negEnergy = Math.round(DamageTypes.NegEnergy.getPercentage()) + "%/" + negEnergy;
            posEnergy = Math.round(DamageTypes.PosEnergy.getPercentage()) + "%/" + posEnergy;

            pmain.sdDmg_BigDiv = new myElement(createDiv(), "shrinkablePMainDefenseBigDiv", pmain.sdDmg);
            pmain.sdDmg_BigDiv.style("display", "flex");
            pmain.sdDmg_DivLeftSide = new myElement(createDiv(), "shrinkablePMainDefenseSplitTwoDiv", pmain.sdDmg_BigDiv);

            pmain.sdDmg_TempDiv = new myElement(createDiv(), "shrinkablePMainDmgMiniLeftDiv", pmain.sdDmg_DivLeftSide);
            pmain.sdDmg_TextPhysicalLeft = new myElement(createP("Physical"), "shrinkablePMainDefenseP", pmain.sdDmg_TempDiv);
            pmain.sdDmg_TempDiv.style("max-width", "95%");
            pmain.sdDmg_TextPhysicalLeft.style("margin-block-end", "0");


            pmain.sdDmg_BigTempDiv = new myElement(createDiv(), "", pmain.sdDmg_DivLeftSide);
            pmain.sdDmg_DivLeftMiniLeftSide = new myElement(createDiv(), "shrinkablePMainDmgMiniLeftDiv", pmain.sdDmg_BigTempDiv);
            pmain.sdDmg_DivLeftMiniRightSide = new myElement(createDiv(), "shrinkablePMainDmgMiniRightDiv", pmain.sdDmg_BigTempDiv);

            pmain.sdDmg_DivLeftSide.style("display", "block");
            pmain.sdDmg_BigTempDiv.style("display", "flex");

            pmain.sdDmg_DivRightSide = new myElement(createDiv(), "shrinkablePMainDefenseSplitTwoDiv", pmain.sdDmg_BigDiv);
            pmain.sdDmg_DivRightMiniLeftSide = new myElement(createDiv(), "shrinkablePMainDmgMiniLeftDiv", pmain.sdDmg_DivRightSide);
            pmain.sdDmg_DivRightMiniRightSide = new myElement(createDiv(), "shrinkablePMainDmgMiniRightDiv", pmain.sdDmg_DivRightSide);

            //pmain.sdDmg_TextPhysicalRight = new myElement(createP(physical), "shrinkablePMainDefenseP", pmain.sdDmg_DivLeftMiniRightSide);
            pmain.sdDmg_TextFireLeft = new myElement(createP("Fire"), "shrinkablePMainDefenseP", pmain.sdDmg_DivRightMiniLeftSide);
            pmain.sdDmg_TextFireRight = new myElement(createP(fire), "shrinkablePMainDefenseP", pmain.sdDmg_DivRightMiniRightSide);
            pmain.sdDmg_TextPhysicalLeft.style("font-size", "110%");

            pmain.sdDmg_TextBluntLeft = new myElement(createP("Blunt"), "shrinkablePMainDefenseP", pmain.sdDmg_DivLeftMiniLeftSide);
            pmain.sdDmg_TextBluntRight = new myElement(createP(blunt), "shrinkablePMainDefenseP", pmain.sdDmg_DivLeftMiniRightSide);
            pmain.sdDmg_TextColdLeft = new myElement(createP("Cold"), "shrinkablePMainDefenseP", pmain.sdDmg_DivRightMiniLeftSide);
            pmain.sdDmg_TextColdRight = new myElement(createP(cold), "shrinkablePMainDefenseP", pmain.sdDmg_DivRightMiniRightSide);

            pmain.sdDmg_TextSlashingLeft = new myElement(createP("Slashing"), "shrinkablePMainDefenseP", pmain.sdDmg_DivLeftMiniLeftSide);
            pmain.sdDmg_TextSlashingRight = new myElement(createP(slashing), "shrinkablePMainDefenseP", pmain.sdDmg_DivLeftMiniRightSide);
            pmain.sdDmg_TextLightningLeft = new myElement(createP("Lightning"), "shrinkablePMainDefenseP", pmain.sdDmg_DivRightMiniLeftSide);
            pmain.sdDmg_TextLightningRight = new myElement(createP(lightning), "shrinkablePMainDefenseP", pmain.sdDmg_DivRightMiniRightSide);

            pmain.sdDmg_TextPiercingLeft = new myElement(createP("Piercing"), "shrinkablePMainDefenseP", pmain.sdDmg_DivLeftMiniLeftSide);
            pmain.sdDmg_TextPiercingRight = new myElement(createP(piercing), "shrinkablePMainDefenseP", pmain.sdDmg_DivLeftMiniRightSide);
            pmain.sdDmg_TextAcidLeft = new myElement(createP("Acid"), "shrinkablePMainDefenseP", pmain.sdDmg_DivRightMiniLeftSide);
            pmain.sdDmg_TextAcidRight = new myElement(createP(acid), "shrinkablePMainDefenseP", pmain.sdDmg_DivRightMiniRightSide);

            pmain.sdDmg_TextNegEnergyLeft = new myElement(createP("Neg. Energy"), "shrinkablePMainDefenseP", pmain.sdDmg_DivLeftMiniLeftSide);
            pmain.sdDmg_TextNegEnergyRight = new myElement(createP(negEnergy), "shrinkablePMainDefenseP", pmain.sdDmg_DivLeftMiniRightSide);
            pmain.sdDmg_TextSonicLeft = new myElement(createP("Sonic"), "shrinkablePMainDefenseP", pmain.sdDmg_DivRightMiniLeftSide);
            pmain.sdDmg_TextSonicRight = new myElement(createP(sonic), "shrinkablePMainDefenseP", pmain.sdDmg_DivRightMiniRightSide);

            pmain.sdDmg_TextPosEnergyLeft = new myElement(createP("Pos. Energy"), "shrinkablePMainDefenseP", pmain.sdDmg_DivLeftMiniLeftSide);
            pmain.sdDmg_TextPosEnergyRight = new myElement(createP(posEnergy), "shrinkablePMainDefenseP", pmain.sdDmg_DivLeftMiniRightSide);
            pmain.sdDmg_TextRadiationLeft = new myElement(createP("Radiation"), "shrinkablePMainDefenseP", pmain.sdDmg_DivRightMiniLeftSide);
            pmain.sdDmg_TextRadiationRight = new myElement(createP(radiation), "shrinkablePMainDefenseP", pmain.sdDmg_DivRightMiniRightSide);
        }
    });
    pmain.sdDmgText = new myElement(createP("+ Damage Reductions"), "shrinkableHeader", pmain.sdDmg);
    // Shrinkable Skills
    pmain.sdSkills = new myElement(createDiv(), "shrinkableDiv");
    pmain.sdSkillsCheckBox = new myElement(createInput("", "checkbox"), "shrinkableInputField", pmain.sdSkills, null, () => {
        let hidden = pmain.sdSkillsText.html().indexOf("+ Skills") != -1 ? false : true;
        pmain.sdSkillsText.html((hidden ? "+ Skills" : "- Skills"));

        if (hidden) {
            openedSections[6] = 0;
            pmain.sdSkillsText.class("shrinkableHeader");

            Object.keys(pmain).forEach(function (key) {
                if (key.startsWith("sdSkills") && key != "sdSkills" && key != "sdSkillsCheckBox" && key != "sdSkillsText") {
                    pmain[key].remove();
                    delete pmain[key];
                }
            });
        }

        else {
            openedSections[6] = 1;
            pmain.sdSkillsText.class("shrinkableHeaderHidden");
            let hide = formatNumber(Math.round(mainChar.stats.getHide()));
            let insight = formatNumber(Math.round(mainChar.stats.getInsight()));
            let moveSilently = formatNumber(Math.round(mainChar.stats.getMoveSilently()));
            let bluff = formatNumber(Math.round(mainChar.stats.getBluff()));
            let escapeArtist = formatNumber(Math.round(mainChar.stats.getEscapeArtist()));
            let diplomacy = formatNumber(Math.round(mainChar.stats.getDiplomacy()));
            let disguise = formatNumber(Math.round(mainChar.stats.getDisguise()));
            let intimidate = formatNumber(Math.round(mainChar.stats.getIntimidate()));
            let medicine = formatNumber(Math.round(mainChar.stats.getMedicine()));
            let pickLock = formatNumber(Math.round(mainChar.stats.getPickLock()));
            let survival = formatNumber(Math.round(mainChar.stats.getSurvival()));
            let pickPocket = formatNumber(Math.round(mainChar.stats.getPickPocket()));
            let track = formatNumber(Math.round(mainChar.stats.getTrack()));

            // Big Div
            pmain.sdSkills_BigDiv = new myElement(createDiv(), "shrinkablePMainDefenseBigDiv", pmain.sdSkills);
            pmain.sdSkills_BigDiv.style("display", "flex");
            pmain.sdSkills_DivLeftSide = new myElement(createDiv(), "shrinkablePMainDefenseSplitTwoDiv", pmain.sdSkills_BigDiv);
            pmain.sdSkills_DivLeftMiniLeftSide = new myElement(createDiv(), "shrinkablePMainDefenseMiniLeftDiv", pmain.sdSkills_DivLeftSide);
            pmain.sdSkills_DivLeftMiniRightSide = new myElement(createDiv(), "shrinkablePMainDefenseMiniRightDiv", pmain.sdSkills_DivLeftSide);

            pmain.sdSkills_DivRightSide = new myElement(createDiv(), "shrinkablePMainDefenseSplitTwoDiv", pmain.sdSkills_BigDiv);
            pmain.sdSkills_DivRightMiniLeftSide = new myElement(createDiv(), "shrinkablePMainDefenseMiniLeftDiv", pmain.sdSkills_DivRightSide);
            pmain.sdSkills_DivRightMiniRightSide = new myElement(createDiv(), "shrinkablePMainDefenseMiniRightDiv", pmain.sdSkills_DivRightSide);

            pmain.sdSkills_TextHideLeft = new myElement(createP("Hide"), "shrinkablePMainDefenseP", pmain.sdSkills_DivLeftMiniLeftSide);
            pmain.sdSkills_TextHideRight = new myElement(createP(hide), "shrinkablePMainDefenseP", pmain.sdSkills_DivLeftMiniRightSide);
            pmain.sdSkills_TextInsightLeft = new myElement(createP("Insight"), "shrinkablePMainDefenseP", pmain.sdSkills_DivRightMiniLeftSide);
            pmain.sdSkills_TextInsightRight = new myElement(createP(insight), "shrinkablePMainDefenseP", pmain.sdSkills_DivRightMiniRightSide);

            pmain.sdSkills_TextMoveSilentlyLeft = new myElement(createP("Move Silently"), "shrinkablePMainDefenseP", pmain.sdSkills_DivLeftMiniLeftSide);
            pmain.sdSkills_TextMoveSilentlyRight = new myElement(createP(moveSilently), "shrinkablePMainDefenseP", pmain.sdSkills_DivLeftMiniRightSide);
            pmain.sdSkills_TextBluffLeft = new myElement(createP("Bluff"), "shrinkablePMainDefenseP", pmain.sdSkills_DivRightMiniLeftSide);
            pmain.sdSkills_TextBluffRight = new myElement(createP(bluff), "shrinkablePMainDefenseP", pmain.sdSkills_DivRightMiniRightSide);

            pmain.sdSkills_TextEscapeArtistLeft = new myElement(createP("Escape Artist"), "shrinkablePMainDefenseP", pmain.sdSkills_DivLeftMiniLeftSide);
            pmain.sdSkills_TextEscapeArtistRight = new myElement(createP(escapeArtist), "shrinkablePMainDefenseP", pmain.sdSkills_DivLeftMiniRightSide);
            pmain.sdSkills_TextDiplomacyLeft = new myElement(createP("Diplomacy"), "shrinkablePMainDefenseP", pmain.sdSkills_DivRightMiniLeftSide);
            pmain.sdSkills_TextDiplomacyRight = new myElement(createP(diplomacy), "shrinkablePMainDefenseP", pmain.sdSkills_DivRightMiniRightSide);

            pmain.sdSkills_TextDisguiseLeft = new myElement(createP("Disguise"), "shrinkablePMainDefenseP", pmain.sdSkills_DivLeftMiniLeftSide);
            pmain.sdSkills_TextDisguiseRight = new myElement(createP(disguise), "shrinkablePMainDefenseP", pmain.sdSkills_DivLeftMiniRightSide);
            pmain.sdSkills_TextIntimidateLeft = new myElement(createP("Intimidate"), "shrinkablePMainDefenseP", pmain.sdSkills_DivRightMiniLeftSide);
            pmain.sdSkills_TextIntimidateRight = new myElement(createP(intimidate), "shrinkablePMainDefenseP", pmain.sdSkills_DivRightMiniRightSide);

            pmain.sdSkills_TextMedicineLeft = new myElement(createP("Medicine"), "shrinkablePMainDefenseP", pmain.sdSkills_DivLeftMiniLeftSide);
            pmain.sdSkills_TextMedicineRight = new myElement(createP(medicine), "shrinkablePMainDefenseP", pmain.sdSkills_DivLeftMiniRightSide);
            pmain.sdSkills_TextPickLockLeft = new myElement(createP("Pick Lock"), "shrinkablePMainDefenseP", pmain.sdSkills_DivRightMiniLeftSide);
            pmain.sdSkills_TextPickLockRight = new myElement(createP(pickLock), "shrinkablePMainDefenseP", pmain.sdSkills_DivRightMiniRightSide);

            pmain.sdSkills_TextSurvivalLeft = new myElement(createP("Survival"), "shrinkablePMainDefenseP", pmain.sdSkills_DivLeftMiniLeftSide);
            pmain.sdSkills_TextSurvivalRight = new myElement(createP(survival), "shrinkablePMainDefenseP", pmain.sdSkills_DivLeftMiniRightSide);
            pmain.sdSkills_TextPickPocketLeft = new myElement(createP("Pick Pocket"), "shrinkablePMainDefenseP", pmain.sdSkills_DivRightMiniLeftSide);
            pmain.sdSkills_TextPickPocketRight = new myElement(createP(pickPocket), "shrinkablePMainDefenseP", pmain.sdSkills_DivRightMiniRightSide);

            pmain.sdSkills_TextTrackLeft = new myElement(createP("Track"), "shrinkablePMainDefenseP", pmain.sdSkills_DivLeftMiniLeftSide);
            pmain.sdSkills_TextTrackRight = new myElement(createP(track), "shrinkablePMainDefenseP", pmain.sdSkills_DivLeftMiniRightSide);
        }
    });
    pmain.sdSkillsText = new myElement(createP("+ Skills"), "shrinkableHeader", pmain.sdSkills);
    // Shrinkable Powers
    pmain.sdPowers = new myElement(createDiv(), "shrinkableDiv");
    pmain.sdPowersCheckBox = new myElement(createInput("", "checkbox"), "shrinkableInputField", pmain.sdPowers, null, () => {
        let hidden = pmain.sdPowersText.html().indexOf("+ Powers") != -1 ? false : true;
        pmain.sdPowersText.html((hidden ? "+ Powers" : "- Powers"));

        if (hidden) {
            openedSections[7] = 0;
            pmain.sdPowersText.class("shrinkableHeader");

            Object.keys(pmain).forEach(function (key) {
                if (key.startsWith("sdPowers") && key != "sdPowers" && key != "sdPowersCheckBox" && key != "sdPowersText") {
                    pmain[key].remove();
                    delete pmain[key];
                }
            });
        }
        else {
            openedSections[7] = 1;
            pmain.sdPowersText.class("shrinkableHeaderHidden");
            let ability = formatNumber(Math.round(AllPowers.Ability.getPoints()));
            let spell = formatNumber(Math.round(AllPowers.Spell.getPoints()));

            pmain.sdPowers_BigDiv = new myElement(createDiv(), "shrinkablePMainDefenseBigDiv", pmain.sdPowers);
            pmain.sdPowers_BigDiv.style("display", "flex");

            pmain.sdPowers_DivLeftSide = new myElement(createDiv(), "shrinkablePMainDefenseSplitTwoDiv", pmain.sdPowers_BigDiv);
            pmain.sdPowers_DivLeftMiniLeftSide = new myElement(createDiv(), "shrinkablePMainDefenseMiniLeftDiv", pmain.sdPowers_DivLeftSide);
            pmain.sdPowers_DivLeftMiniRightSide = new myElement(createDiv(), "shrinkablePMainDefenseMiniRightDiv", pmain.sdPowers_DivLeftSide);

            pmain.sdPowers_DivRightSide = new myElement(createDiv(), "shrinkablePMainDefenseSplitTwoDiv", pmain.sdPowers_BigDiv);
            pmain.sdPowers_DivRightMiniLeftSide = new myElement(createDiv(), "shrinkablePMainDefenseMiniLeftDiv", pmain.sdPowers_DivRightSide);
            pmain.sdPowers_DivRightMiniRightSide = new myElement(createDiv(), "shrinkablePMainDefenseMiniRightDiv", pmain.sdPowers_DivRightSide);

            pmain.sdPowers_TextAbilityLeft = new myElement(createP("Ability"), "shrinkablePMainDefenseP", pmain.sdPowers_DivLeftMiniLeftSide);
            pmain.sdPowers_TextAbilityRight = new myElement(createP(ability), "shrinkablePMainDefenseP", pmain.sdPowers_DivLeftMiniRightSide);
            pmain.sdPowers_TextSpellLeft = new myElement(createP("Spell"), "shrinkablePMainDefenseP", pmain.sdPowers_DivRightMiniLeftSide);
            pmain.sdPowers_TextSpellRight = new myElement(createP(spell), "shrinkablePMainDefenseP", pmain.sdPowers_DivRightMiniRightSide);

            for (let i = 0; i < allPowersArray.length; ++i) {
                if (allPowersArray[i].getPoints() != 0 && allPowersArray[i].name != "Ability" && allPowersArray[i].name != "Spell") {
                    let points = allPowersArray[i].getPoints();
                    points = formatNumber(Math.round(points));

                    let _divLeftSide = i % 2 ? pmain.sdPowers_DivRightMiniLeftSide : pmain.sdPowers_DivLeftMiniLeftSide;
                    let _divRightSide = i % 2 ? pmain.sdPowers_DivRightMiniRightSide : pmain.sdPowers_DivLeftMiniRightSide;
                    new myElement(createP(allPowersArray[i].name), "shrinkablePMainDefenseP", _divLeftSide);
                    new myElement(createP(points), "shrinkablePMainDefenseP", _divRightSide);
                }
            }
        }
    });
    pmain.sdPowersText = new myElement(createP("+ Powers"), "shrinkableHeader", pmain.sdPowers);
    // Shrinkable Breathe
    pmain.sdBreathe = new myElement(createDiv(), "shrinkableDiv");
    pmain.sdBreatheCheckBox = new myElement(createInput("", "checkbox"), "shrinkableInputField", pmain.sdBreathe, null, () => {
        let hidden = pmain.sdBreatheText.html().indexOf("+ Breathe") != -1 ? false : true;
        pmain.sdBreatheText.html((hidden ? "+ Breathe" : "- Breathe"));

        if (hidden) {
            openedSections[8] = 0;
            pmain.sdBreatheText.class("shrinkableHeader");

            Object.keys(pmain).forEach(function (key) {
                if (key.startsWith("sdBreathe") && key != "sdBreathe" && key != "sdBreatheCheckBox" && key != "sdBreatheText") {
                    pmain[key].remove();
                    delete pmain[key];
                }
            });
        }
        else {
            openedSections[8] = 1;
            pmain.sdBreatheText.class("shrinkableHeaderHidden");
            let breathe = mainChar.stats.getBreathe() >= 0 ? "+" + mainChar.stats.getBreathe() : mainChar.stats.getBreathe();

            pmain.sdBreathe_BigDiv = new myElement(createDiv(), "shrinkablePMainBreatheBigDiv", pmain.sdBreathe);
            pmain.sdBreathe_DivLeftSide = new myElement(createDiv(), "shrinkablePMainBreatheLeftDiv", pmain.sdBreathe_BigDiv);
            pmain.sdBreathe_DivRightSide = new myElement(createDiv(), "shrinkablePMainBreatheRightDiv", pmain.sdBreathe_BigDiv);

            pmain.sdBreathe_DivMiniLeftSide = new myElement(createDiv(), "shrinkablePMainBreatheMiniLeftDiv", pmain.sdBreathe_DivLeftSide);
            pmain.sdBreathe_DivMiniRightSide = new myElement(createDiv(), "shrinkablePMainBreatheMiniRightDiv", pmain.sdBreathe_DivLeftSide);

            pmain.sdBreathe_TextCurrent = new myElement(createP("Current: "), "shrinkablePMainBreatheP", pmain.sdBreathe_DivMiniLeftSide);
            pmain.sdBreathe_InputCurrent = new myElement(createInput(breathe), "shrinkablePMainBreatheInput", pmain.sdBreathe_DivMiniRightSide, null, null, () => {
                let val = pmain.sdBreathe_InputCurrent.value();
                val = isNaN(parseInt(val)) ? parseInt(breathe) : parseInt(val);

                mainChar.stats.setBreathe(val);
                val = val >= 0 ? "+" + val : val;
                pmain.sdBreathe_InputCurrent.value(val);
            });

            pmain.sdBreathe_TextReduce = new myElement(createP("Reduce by: "), "shrinkablePMainBreatheP", pmain.sdBreathe_DivMiniLeftSide);
            pmain.sdBreathe_InputReduce = new myElement(createInput("1"), "shrinkablePMainBreatheInput", pmain.sdBreathe_DivMiniRightSide, null, null, () => {
                let val = pmain.sdBreathe_InputReduce.value();
                val = isNaN(parseInt(val)) ? 1 : parseInt(val);

                pmain.sdBreathe_InputReduce.value(val);
            });

            pmain.sdBreathe_ButtonReduce = new myElement(createButton("Reduce"), "shrinkablePMainBreatheButton", pmain.sdBreathe_DivRightSide, () => {
                let val = pmain.sdBreathe_InputReduce.value();
                val = isNaN(parseInt(val)) ? 0 : parseInt(val);

                pmain.sdBreathe_InputReduce.value(val);
                mainChar.stats.reduceBreathe(val);

                let curBreathe = mainChar.stats.getBreathe();
                curBreathe = curBreathe >= 0 ? "+" + curBreathe : curBreathe;
                pmain.sdBreathe_InputCurrent.value(curBreathe);
            });
        }
    });
    pmain.sdBreatheText = new myElement(createP("+ Breathe"), "shrinkableHeader", pmain.sdBreathe);

    if (openedSections[0]) pmain.sdMainCheckBox.onInput();
    if (openedSections[1]) pmain.sdSufferCheckBox.onInput();
    if (openedSections[2]) pmain.sdConditionCheckBox.onInput();
    if (openedSections[3]) pmain.sdDefenseCheckBox.onInput();
    if (openedSections[4]) pmain.sdEnvCheckBox.onInput();
    if (openedSections[5]) pmain.sdDmgCheckBox.onInput();
    if (openedSections[6]) pmain.sdSkillsCheckBox.onInput();
    if (openedSections[7]) pmain.sdPowersCheckBox.onInput();
    if (openedSections[8]) pmain.sdBreatheCheckBox.onInput();
}
function setupPageStatistics() {
    // Shrinkable Main Info
    pstats.sdMain = new myElement(createDiv(), "shrinkableDiv");
    pstats.sdMainCheckBox = new myElement(createInput("", "checkbox"), "shrinkableInputField", pstats.sdMain, null, () => {
        pstats.sdMainCheckBox.swapChecked(); // This is for updating the isChecked variable inside the element.

        let hidden = pstats.sdMainText.html().indexOf("+ Main Stats") != -1 ? false : true;
        pstats.sdMainText.html((hidden ? "+ Main Stats" : "- Main Stats"));

        if (hidden) {
            openedSections[9] = 0;
            pstats.sdMainText.class("shrinkableHeader");

            Object.keys(pstats).forEach(function (key) {
                if (key.startsWith("sdMain") && key != "sdMain" && key != "sdMainCheckBox" && key != "sdMainText") {
                    pstats[key].remove();
                    delete pstats[key];
                }
            });
        }
        else {
            openedSections[9] = 1;
            pstats.sdMainText.class("shrinkableHeaderHidden");

            // Top of Main Info
            // Big Div, Name + Movement stats in this div.
            pstats.sdMain_BigDiv = new myElement(createDiv(), "shrinkableInsideSplitToTwoDiv", pstats.sdMain);
            pstats.sdMain_SplitDivLeftSide = new myElement(createDiv(), "shrinkableInsideSplitToTwo", pstats.sdMain_BigDiv);
            pstats.sdMain_SplitDivRightSide = new myElement(createDiv(), "shrinkableInsideSplitToTwo", pstats.sdMain_BigDiv);

            ////////////////////////////////////////////////////////// LEFT SIDE ///////////////////////////////////////////////////////
            // Level
            pstats.sdMain_DivLevel = new myElement(createDiv(), "shrinkableDivInput", pstats.sdMain_SplitDivLeftSide);
            pstats.sdMain_TextLevel = new myElement(createP("Level:"), "shrinkableP", pstats.sdMain_DivLevel);
            pstats.sdMain_InputLevel = new myElement(createP(mainChar.stats.getLevel()), "shrinkableP", pstats.sdMain_DivLevel);

            // Max Modifier
            pstats.sdMain_DivMaxModifier = new myElement(createDiv(), "shrinkableDivInput", pstats.sdMain_SplitDivLeftSide);
            pstats.sdMain_TextMaxModifier = new myElement(createP("Max Modifier:"), "shrinkableP", pstats.sdMain_DivMaxModifier);
            pstats.sdMain_TextValue = new myElement(createP(mainChar.cpStats.getMaxModifier()), "shrinkableP", pstats.sdMain_DivMaxModifier);

            ////////////////////////////////////////////////////////// RIGHT SIDE ///////////////////////////////////////////////////////
            pstats.sdMain_DivSize = new myElement(createDiv(), "shrinkableDivInput", pstats.sdMain_SplitDivRightSide);
            pstats.sdMain_TextSize = new myElement(createP("Size:"), "shrinkablePStatsMainP", pstats.sdMain_DivSize);
            pstats.sdMain_SelectSize = new myElement(createSelect(), "shrinkablePStatsMainSelect", pstats.sdMain_DivSize, null, null, () => {
                let val = pstats.sdMain_SelectSize.selectValue(); // returns the current selectedIndex
                mainChar.stats.setSize(val);
                pstats.sdMain_SelectSize.resetAllSections();
            });
            pstats.sdMain_SelectSize.option(["Fine", "Diminutive", "Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan", "Colossal"]);
            pstats.sdMain_SelectSize.selectValue(mainChar.stats.getSize());

            pstats.sdMain_DivBodyType = new myElement(createDiv(), "shrinkableDivInput", pstats.sdMain_SplitDivRightSide);
            pstats.sdMain_TextBodyType = new myElement(createP("Body Type:"), "shrinkablePStatsMainP", pstats.sdMain_DivBodyType);
            pstats.sdMain_SelectBodyType = new myElement(createSelect(), "shrinkablePStatsMainSelect", pstats.sdMain_DivBodyType, null, null, () => {
                let val = pstats.sdMain_SelectBodyType.selectValue(); // returns the current selectedIndex
                mainChar.stats.setBodyType(val);
                pstats.sdMain_SelectBodyType.resetAllSections();
            });
            pstats.sdMain_SelectBodyType.option(["Biped", "Triped", "Quadruped", "5+ Legs", "Slithers", "Rolls"]);
            pstats.sdMain_SelectBodyType.selectValue(mainChar.stats.getBodyType());

            // Bottom of Main Info
            pstats.sdMain_DivMainStats = new myElement(createDiv(), "shrinkablePStatsMainBigSingularDiv", pstats.sdMain);
            pstats.sdMain_DivName = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivBig", pstats.sdMain_DivMainStats);
            pstats.sdMain_DivBase = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivLittle", pstats.sdMain_DivMainStats);
            pstats.sdMain_DivCpCap = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivLittle", pstats.sdMain_DivMainStats);
            pstats.sdMain_DivGear = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivLittle", pstats.sdMain_DivMainStats);
            pstats.sdMain_DivTotal = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivLittle", pstats.sdMain_DivMainStats);

            pstats.sdMain_TextHeaderName = new myElement(createP("Name"), "shrinkablePStatsMainLeftHeaderP", pstats.sdMain_DivName);
            pstats.sdMain_TextHeaderBase = new myElement(createP("Base"), "shrinkablePStatsMainCenterHeaderP", pstats.sdMain_DivBase);
            pstats.sdMain_TextHeaderCpCap = new myElement(createP("Cp/Cap"), "shrinkablePStatsMainCenterHeaderP", pstats.sdMain_DivCpCap);
            pstats.sdMain_TextHeaderGear = new myElement(createP("Gear"), "shrinkablePStatsMainCenterHeaderP", pstats.sdMain_DivGear);
            pstats.sdMain_TextHeaderTotal = new myElement(createP("Total"), "shrinkablePStatsMainCenterHeaderP", pstats.sdMain_DivTotal);

            pstats.sdMain_DivName.style("min-width", "30%");
            pstats.sdMain_DivCpCap.style("min-width", "25%");
            pstats.sdMain_DivCpCap.style("max-width", "25%");
            // Max HP
            pstats.sdMain_TextNameHP = new myElement(createP("Max Hit Points"), "shrinkablePStatsMainP", pstats.sdMain_DivName);
            pstats.sdMain_TextBaseHP = new myElement(createP(mainChar.stats.getMaxHPBase()), "shrinkablePStatsMainFivePieceP", pstats.sdMain_DivBase);
            pstats.sdMain_TextGearHP = new myElement(createP(mainChar.stats.maxHPGearModifier), "shrinkablePStatsMainFivePieceP", pstats.sdMain_DivGear);
            pstats.sdMain_TextTotalHP = new myElement(createP(mainChar.stats.getMaxHPBase() + mainChar.cpStats.getMaxHP() + mainChar.stats.maxHPGearModifier), "shrinkablePStatsMainFivePieceP", pstats.sdMain_DivTotal);

            pstats.sdMain_TextTotalHP.round();

            pstats.sdMain_MiniDivCPCapHP = new myElement(createDiv(), "", pstats.sdMain_DivCpCap);
            pstats.sdMain_InputCPCapHP = new myElement(createInput(mainChar.cpStats.getMaxHP()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdMain_MiniDivCPCapHP, null, () => {
                let x = parseInt(pstats.sdMain_InputCPCapHP.value());
                x = isNaN(x) ? 0 : x;

                // Training
                let cpCost = mainChar.cpStats.maxHP;
                let oldVal = mainChar.cpStats.getMaxHP();

                mainChar.cpStats.setMaxHPBought(x);
                pstats.sdMain_TextTotalHP.html(mainChar.stats.getMaxHPBase() + mainChar.cpStats.getMaxHP() + mainChar.stats.maxHPGearModifier);
                pstats.sdMain_TextTotalHP.round();

                // Training-AfterNewValue
                let newVal = mainChar.cpStats.getMaxHP();
                let diff = newVal - oldVal;
                addTrainingPoints("Max Hit Points", diff, cpCost, true);
            }, null, null, true, mainChar.cpStats.getMaxHPCap());
            pstats.sdMain_TextCPCapHP = new myElement(createP("/" + mainChar.cpStats.getMaxHPCap()), "shrinkablePStatsMainFivePieceP", pstats.sdMain_MiniDivCPCapHP);
            pstats.sdMain_MiniDivCPCapHP.style("display", "flex");
            pstats.sdMain_InputCPCapHP.style("max-width", "45%");
            pstats.sdMain_InputCPCapHP.style("min-width", "45%");
            pstats.sdMain_InputCPCapHP.style("text-align", "center");
            pstats.sdMain_InputCPCapHP.style("margin-top", "0");
            pstats.sdMain_TextCPCapHP.style("margin-top", "2px");

            pstats.sdMain_TextBaseHP.roundDecimal();
            pstats.sdMain_TextGearHP.roundDecimal();
            pstats.sdMain_TextCPCapHP.roundDecimal("", "/");

            // Max Stamina
            pstats.sdMain_TextNameStamina = new myElement(createP("Max Stamina"), "shrinkablePStatsMainP", pstats.sdMain_DivName);
            pstats.sdMain_TextBaseStamina = new myElement(createP(mainChar.stats.getMaxStaminaBase()), "shrinkablePStatsMainFivePieceP", pstats.sdMain_DivBase);
            pstats.sdMain_TextGearStamina = new myElement(createP(mainChar.stats.maxStaminaGearModifier), "shrinkablePStatsMainFivePieceP", pstats.sdMain_DivGear);
            pstats.sdMain_TextTotalStamina = new myElement(createP(mainChar.stats.getMaxStaminaBase() + mainChar.cpStats.getMaxStamina() + mainChar.stats.maxStaminaGearModifier), "shrinkablePStatsMainFivePieceP", pstats.sdMain_DivTotal);

            pstats.sdMain_TextTotalStamina.round();

            pstats.sdMain_MiniDivCPCapStamina = new myElement(createDiv(), "", pstats.sdMain_DivCpCap);
            pstats.sdMain_InputCPCapStamina = new myElement(createInput(mainChar.cpStats.getMaxStamina()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdMain_MiniDivCPCapStamina, null, () => {
                let x = parseInt(pstats.sdMain_InputCPCapStamina.value());
                x = isNaN(x) ? 0 : x;

                // Training
                let cpCost = mainChar.cpStats.maxStamina;
                let oldVal = mainChar.cpStats.getMaxStamina();

                mainChar.cpStats.setMaxStaminaBought(x);
                pstats.sdMain_TextTotalStamina.html(mainChar.stats.getMaxStaminaBase() + mainChar.cpStats.getMaxStamina() + mainChar.stats.maxStaminaGearModifier);
                pstats.sdMain_TextTotalStamina.round();

                // Training-AfterNewValue
                let newVal = mainChar.cpStats.getMaxStamina();
                let diff = newVal - oldVal;
                addTrainingPoints("Max Stamina", diff, cpCost, true);
            }, null, null, true, mainChar.cpStats.getMaxStaminaCap());
            pstats.sdMain_TextCPCapStamina = new myElement(createP("/" + mainChar.cpStats.getMaxStaminaCap()), "shrinkablePStatsMainFivePieceP", pstats.sdMain_MiniDivCPCapStamina);
            pstats.sdMain_MiniDivCPCapStamina.style("display", "flex");
            pstats.sdMain_InputCPCapStamina.style("max-width", "45%");
            pstats.sdMain_InputCPCapStamina.style("min-width", "45%");
            pstats.sdMain_InputCPCapStamina.style("text-align", "center");
            pstats.sdMain_InputCPCapStamina.style("margin-top", "0");
            pstats.sdMain_TextCPCapStamina.style("margin-top", "2px");

            pstats.sdMain_TextBaseStamina.roundDecimal();
            pstats.sdMain_TextGearStamina.roundDecimal();
            pstats.sdMain_TextCPCapStamina.roundDecimal("", "/");

            // Max Mana
            pstats.sdMain_TextNameMana = new myElement(createP("Max Mana"), "shrinkablePStatsMainP", pstats.sdMain_DivName);
            pstats.sdMain_TextBaseMana = new myElement(createP(mainChar.stats.getMaxManaBase()), "shrinkablePStatsMainFivePieceP", pstats.sdMain_DivBase);
            pstats.sdMain_TextGearMana = new myElement(createP(mainChar.stats.maxManaGearModifier), "shrinkablePStatsMainFivePieceP", pstats.sdMain_DivGear);
            pstats.sdMain_TextTotalMana = new myElement(createP(mainChar.stats.getMaxManaBase() + mainChar.cpStats.getMaxMana() + mainChar.stats.maxManaGearModifier), "shrinkablePStatsMainFivePieceP", pstats.sdMain_DivTotal);

            pstats.sdMain_TextTotalMana.round();

            pstats.sdMain_MiniDivCPCapMana = new myElement(createDiv(), "", pstats.sdMain_DivCpCap);
            pstats.sdMain_InputCPCapMana = new myElement(createInput(mainChar.cpStats.getMaxMana()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdMain_MiniDivCPCapMana, null, () => {
                let x = parseInt(pstats.sdMain_InputCPCapMana.value());
                x = isNaN(x) ? 0 : x;

                // Training
                let cpCost = mainChar.cpStats.maxMana;
                let oldVal = mainChar.cpStats.getMaxMana();

                mainChar.cpStats.setMaxManaBought(x);
                pstats.sdMain_TextTotalMana.html(mainChar.stats.getMaxManaBase() + mainChar.cpStats.getMaxMana() + mainChar.stats.maxManaGearModifier);
                pstats.sdMain_TextTotalMana.round();

                // Training-AfterNewValue
                let newVal = mainChar.cpStats.getMaxMana();
                let diff = newVal - oldVal;
                addTrainingPoints("Max Mana", diff, cpCost, true);
            }, null, null, true, mainChar.cpStats.getMaxManaCap());
            pstats.sdMain_TextCPCapMana = new myElement(createP("/" + mainChar.cpStats.getMaxManaCap()), "shrinkablePStatsMainFivePieceP", pstats.sdMain_MiniDivCPCapMana);
            pstats.sdMain_MiniDivCPCapMana.style("display", "flex");
            pstats.sdMain_InputCPCapMana.style("max-width", "45%");
            pstats.sdMain_InputCPCapMana.style("min-width", "45%");
            pstats.sdMain_InputCPCapMana.style("text-align", "center");
            pstats.sdMain_InputCPCapMana.style("margin-top", "0");
            pstats.sdMain_TextCPCapMana.style("margin-top", "2px");

            pstats.sdMain_TextBaseMana.roundDecimal();
            pstats.sdMain_TextGearMana.roundDecimal();
            pstats.sdMain_TextCPCapMana.roundDecimal("", "/");

            // Accuracy
            pstats.sdMain_TextNameAccuracy = new myElement(createP("Accuracy"), "shrinkablePStatsMainP", pstats.sdMain_DivName);
            pstats.sdMain_TextBaseAccuracy = new myElement(createP(mainChar.stats.getAccuracyBase()), "shrinkablePStatsMainFivePieceP", pstats.sdMain_DivBase);
            pstats.sdMain_TextGearAccuracy = new myElement(createP(mainChar.stats.accuracyGearModifier), "shrinkablePStatsMainFivePieceP", pstats.sdMain_DivGear);
            pstats.sdMain_TextTotalAccuracy = new myElement(createP(mainChar.stats.getAccuracyBase() + mainChar.cpStats.getAccuracy() + mainChar.stats.accuracyGearModifier), "shrinkablePStatsMainFivePieceP", pstats.sdMain_DivTotal);

            pstats.sdMain_TextTotalAccuracy.round();

            pstats.sdMain_MiniDivCPCapAccuracy = new myElement(createDiv(), "", pstats.sdMain_DivCpCap);
            pstats.sdMain_InputCPCapAccuracy = new myElement(createInput(mainChar.cpStats.getAccuracy()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdMain_MiniDivCPCapAccuracy, null, () => {
                let x = parseInt(pstats.sdMain_InputCPCapAccuracy.value());
                x = isNaN(x) ? 0 : x;

                // Training
                let cpCost = mainChar.cpStats.accuracy; //1
                let oldVal = mainChar.cpStats.getAccuracy(); // 2

                mainChar.cpStats.setAccuracyBought(x);
                pstats.sdMain_TextTotalAccuracy.html(mainChar.stats.getAccuracyBase() + mainChar.cpStats.getAccuracy() + mainChar.stats.accuracyGearModifier);
                pstats.sdMain_TextTotalAccuracy.round();

                // Training-AfterNewValue
                let newVal = mainChar.cpStats.getAccuracy(); // 3
                let diff = newVal - oldVal;
                addTrainingPoints("Accuracy", diff, cpCost, true); // 4
            }, null, null, true, mainChar.cpStats.getAccuracyCap());
            pstats.sdMain_TextCPCapAccuracy = new myElement(createP("/" + mainChar.cpStats.getAccuracyCap().toFixed(2)), "shrinkablePStatsMainFivePieceP", pstats.sdMain_MiniDivCPCapAccuracy);
            pstats.sdMain_MiniDivCPCapAccuracy.style("display", "flex");
            pstats.sdMain_InputCPCapAccuracy.style("max-width", "45%");
            pstats.sdMain_InputCPCapAccuracy.style("min-width", "45%");
            pstats.sdMain_InputCPCapAccuracy.style("text-align", "center");
            pstats.sdMain_InputCPCapAccuracy.style("margin-top", "0");
            pstats.sdMain_TextCPCapAccuracy.style("margin-top", "2px");

            pstats.sdMain_TextBaseAccuracy.roundDecimal();
            pstats.sdMain_TextGearAccuracy.roundDecimal();
            pstats.sdMain_TextCPCapAccuracy.roundDecimal("", "/");

            // Parry
            pstats.sdMain_TextNameParry = new myElement(createP("Parry"), "shrinkablePStatsMainP", pstats.sdMain_DivName);
            pstats.sdMain_TextBaseParry = new myElement(createP("n/a"), "shrinkablePStatsMainFivePieceP", pstats.sdMain_DivBase);
            pstats.sdMain_TextGearParry = new myElement(createP(mainChar.stats.parryGearModifier), "shrinkablePStatsMainFivePieceP", pstats.sdMain_DivGear);
            pstats.sdMain_TextTotalParry = new myElement(createP(mainChar.cpStats.getParry() + mainChar.stats.parryGearModifier), "shrinkablePStatsMainFivePieceP", pstats.sdMain_DivTotal);

            pstats.sdMain_TextTotalParry.round();

            pstats.sdMain_MiniDivCPCapParry = new myElement(createDiv(), "", pstats.sdMain_DivCpCap);
            pstats.sdMain_InputCPCapParry = new myElement(createInput(mainChar.cpStats.getParry()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdMain_MiniDivCPCapParry, null, () => {
                let x = parseInt(pstats.sdMain_InputCPCapParry.value());
                x = isNaN(x) ? 0 : x;

                // Training
                let cpCost = mainChar.cpStats.parry; //1
                let oldVal = mainChar.cpStats.getParry(); // 2

                mainChar.cpStats.setParryBought(x);
                pstats.sdMain_TextTotalParry.html(mainChar.cpStats.getParry() + mainChar.stats.parryGearModifier);
                pstats.sdMain_TextTotalParry.round();

                // Training-AfterNewValue
                let newVal = mainChar.cpStats.getParry(); // 3
                let diff = newVal - oldVal;
                addTrainingPoints("Parry", diff, cpCost, true); // 4
            }, null, null, true, mainChar.cpStats.getParryCap());
            pstats.sdMain_TextCPCapParry = new myElement(createP("/" + mainChar.cpStats.getParryCap().toFixed(2)), "shrinkablePStatsMainFivePieceP", pstats.sdMain_MiniDivCPCapParry);
            pstats.sdMain_MiniDivCPCapParry.style("display", "flex");
            pstats.sdMain_InputCPCapParry.style("max-width", "45%");
            pstats.sdMain_InputCPCapParry.style("min-width", "45%");
            pstats.sdMain_InputCPCapParry.style("text-align", "center");
            pstats.sdMain_InputCPCapParry.style("margin-top", "0");
            pstats.sdMain_TextCPCapParry.style("margin-top", "2px");

            pstats.sdMain_TextBaseParry.roundDecimal();
            pstats.sdMain_TextGearParry.roundDecimal();
            pstats.sdMain_TextCPCapParry.roundDecimal("", "/");

            // Damage
            pstats.sdMain_TextNameDamage = new myElement(createP("Damage"), "shrinkablePStatsMainP", pstats.sdMain_DivName);
            pstats.sdMain_TextBaseDamage = new myElement(createP(mainChar.stats.getDamageBase().toFixed(2)), "shrinkablePStatsMainFivePieceP", pstats.sdMain_DivBase);
            pstats.sdMain_TextGearDamage = new myElement(createP(mainChar.stats.damageGearModifier), "shrinkablePStatsMainFivePieceP", pstats.sdMain_DivGear);
            pstats.sdMain_TextTotalDamage = new myElement(createP(mainChar.stats.getDamageBase() + mainChar.cpStats.getDamage() + mainChar.stats.damageGearModifier), "shrinkablePStatsMainFivePieceP", pstats.sdMain_DivTotal);

            pstats.sdMain_TextTotalDamage.round();

            pstats.sdMain_MiniDivCPCapDamage = new myElement(createDiv(), "", pstats.sdMain_DivCpCap);
            pstats.sdMain_InputCPCapDamage = new myElement(createInput(mainChar.cpStats.getDamage()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdMain_MiniDivCPCapDamage, null, () => {
                let x = parseInt(pstats.sdMain_InputCPCapDamage.value());
                x = isNaN(x) ? 0 : x;

                // Training
                let cpCost = mainChar.cpStats.damage; //1
                let oldVal = mainChar.cpStats.getDamage(); // 2

                mainChar.cpStats.setDamageBought(x);
                pstats.sdMain_TextTotalDamage.html(mainChar.stats.getDamageBase() + mainChar.cpStats.getDamage() + mainChar.stats.damageGearModifier);
                pstats.sdMain_TextTotalDamage.round();

                // Training-AfterNewValue
                let newVal = mainChar.cpStats.getDamage(); // 3
                let diff = newVal - oldVal;
                addTrainingPoints("Damage", diff, cpCost, true); // 4
            }, null, null, true, mainChar.cpStats.getDamageCap());
            pstats.sdMain_TextCPCapDamage = new myElement(createP("/" + mainChar.cpStats.getDamageCap()), "shrinkablePStatsMainFivePieceP", pstats.sdMain_MiniDivCPCapDamage);
            pstats.sdMain_MiniDivCPCapDamage.style("display", "flex");
            pstats.sdMain_InputCPCapDamage.style("max-width", "45%");
            pstats.sdMain_InputCPCapDamage.style("min-width", "45%");
            pstats.sdMain_InputCPCapDamage.style("text-align", "center");
            pstats.sdMain_InputCPCapDamage.style("margin-top", "0");
            pstats.sdMain_TextCPCapDamage.style("margin-top", "2px");

            pstats.sdMain_TextBaseDamage.roundDecimal();
            pstats.sdMain_TextGearDamage.roundDecimal();
            pstats.sdMain_TextCPCapDamage.roundDecimal("", "/");
        }
    });
    pstats.sdMainText = new myElement(createP("+ Main Stats"), "shrinkableHeader", pstats.sdMain);

    // Shrinkable Attributes
    pstats.sdAttributes = new myElement(createDiv(), "shrinkableDiv");
    pstats.sdAttributesCheckBox = new myElement(createInput("", "checkbox"), "shrinkableInputField", pstats.sdAttributes, null, () => {
        pstats.sdAttributesCheckBox.swapChecked(); // This is for updating the isChecked variable inside the element.
        let hidden = pstats.sdAttributesText.html().indexOf("+ Attributes") != -1 ? false : true;
        pstats.sdAttributesText.html((hidden ? "+ Attributes" : "- Attributes"));

        if (hidden) {
            openedSections[10] = 0;
            pstats.sdAttributesText.class("shrinkableHeader");

            Object.keys(pstats).forEach(function (key) {
                if (key.startsWith("sdAttributes") && key != "sdAttributes" && key != "sdAttributesCheckBox" && key != "sdAttributesText") {
                    pstats[key].remove();
                    delete pstats[key];
                }
            });
        }
        else {
            openedSections[10] = 1;
            pstats.sdAttributesText.class("shrinkableHeaderHidden");

            // Bottom of Attributes Info
            pstats.sdAttributes_DivAttributesStats = new myElement(createDiv(), "shrinkablePStatsMainBigSingularDiv", pstats.sdAttributes);
            pstats.sdAttributes_DivName = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivBig", pstats.sdAttributes_DivAttributesStats);
            pstats.sdAttributes_DivCpCap = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivLittle", pstats.sdAttributes_DivAttributesStats);
            pstats.sdAttributes_DivGear = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivLittle", pstats.sdAttributes_DivAttributesStats);
            pstats.sdAttributes_DivTotal = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivLittle", pstats.sdAttributes_DivAttributesStats);

            pstats.sdAttributes_TextHeaderName = new myElement(createP("Name"), "shrinkablePStatsMainLeftHeaderP", pstats.sdAttributes_DivName);
            pstats.sdAttributes_TextHeaderCpCap = new myElement(createP("Cp/Cap"), "shrinkablePStatsMainCenterHeaderP", pstats.sdAttributes_DivCpCap);
            pstats.sdAttributes_TextHeaderGear = new myElement(createP("Gear"), "shrinkablePStatsMainCenterHeaderP", pstats.sdAttributes_DivGear);
            pstats.sdAttributes_TextHeaderTotal = new myElement(createP("Total"), "shrinkablePStatsMainCenterHeaderP", pstats.sdAttributes_DivTotal);

            pstats.sdAttributes_DivName.style("min-width", "30%");
            pstats.sdAttributes_DivCpCap.style("min-width", "25%");
            pstats.sdAttributes_DivCpCap.style("max-width", "25%");
            // Strength
            pstats.sdAttributes_TextNameStrength = new myElement(createP("Strength"), "shrinkablePStatsMainP", pstats.sdAttributes_DivName);
            pstats.sdAttributes_TextGearStrength = new myElement(createP(mainChar.stats.strengthGearModifier), "shrinkablePStatsMainFivePieceP", pstats.sdAttributes_DivGear);
            pstats.sdAttributes_TextTotalStrength = new myElement(createP(mainChar.cpStats.getStrength() + mainChar.stats.strengthGearModifier), "shrinkablePStatsMainFivePieceP", pstats.sdAttributes_DivTotal);

            pstats.sdAttributes_TextTotalStrength.round();

            pstats.sdAttributes_MiniDivCPCapStrength = new myElement(createDiv(), "", pstats.sdAttributes_DivCpCap);
            pstats.sdAttributes_InputCPCapStrength = new myElement(createInput(mainChar.cpStats.getStrength()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdAttributes_MiniDivCPCapStrength, null, () => {
                let x = parseInt(pstats.sdAttributes_InputCPCapStrength.value());
                x = isNaN(x) ? 0 : x;

                // Training
                let cpCost = mainChar.cpStats.strength; //1
                let oldVal = mainChar.cpStats.getStrength(); // 2

                mainChar.cpStats.setStrBought(x);
                pstats.sdAttributes_TextTotalStrength.html(mainChar.cpStats.getStrength());
                pstats.sdAttributes_TextTotalStrength.round();

                // Training-AfterNewValue
                let newVal = mainChar.cpStats.getStrength(); // 3
                let diff = newVal - oldVal;
                addTrainingPoints("Strength", diff, cpCost, true); // 4
            }, null, null, true, mainChar.cpStats.getMaxModifier());
            pstats.sdAttributes_TextCPCapStrength = new myElement(createP("/" + mainChar.cpStats.getMaxModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdAttributes_MiniDivCPCapStrength);
            pstats.sdAttributes_MiniDivCPCapStrength.style("display", "flex");
            pstats.sdAttributes_InputCPCapStrength.style("max-width", "45%");
            pstats.sdAttributes_InputCPCapStrength.style("min-width", "45%");
            pstats.sdAttributes_InputCPCapStrength.style("text-align", "center");
            pstats.sdAttributes_InputCPCapStrength.style("margin-top", "0");
            pstats.sdAttributes_TextCPCapStrength.style("margin-top", "2px");

            pstats.sdAttributes_TextCPCapStrength.roundDecimal("", "/");

            // Agility
            pstats.sdAttributes_TextNameAgility = new myElement(createP("Agility"), "shrinkablePStatsMainP", pstats.sdAttributes_DivName);
            pstats.sdAttributes_TextGearAgility = new myElement(createP(mainChar.stats.agilityGearModifier), "shrinkablePStatsMainFivePieceP", pstats.sdAttributes_DivGear);
            pstats.sdAttributes_TextTotalAgility = new myElement(createP(mainChar.cpStats.getAgility() + mainChar.stats.agilityGearModifier), "shrinkablePStatsMainFivePieceP", pstats.sdAttributes_DivTotal);

            pstats.sdAttributes_TextTotalAgility.round();

            pstats.sdAttributes_MiniDivCPCapAgility = new myElement(createDiv(), "", pstats.sdAttributes_DivCpCap);
            pstats.sdAttributes_InputCPCapAgility = new myElement(createInput(mainChar.cpStats.getAgility()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdAttributes_MiniDivCPCapAgility, null, () => {
                let x = parseInt(pstats.sdAttributes_InputCPCapAgility.value());
                x = isNaN(x) ? 0 : x;

                // Training
                let cpCost = mainChar.cpStats.agility; //1
                let oldVal = mainChar.cpStats.getAgility(); // 2

                mainChar.cpStats.setAgiBought(x);
                pstats.sdAttributes_TextTotalAgility.html(mainChar.cpStats.getAgility());
                pstats.sdAttributes_TextTotalAgility.round();

                // Training-AfterNewValue
                let newVal = mainChar.cpStats.getAgility(); // 3
                let diff = newVal - oldVal;
                addTrainingPoints("Agility", diff, cpCost, true); // 4
            }, null, null, true, mainChar.cpStats.getMaxModifier());
            pstats.sdAttributes_TextCPCapAgility = new myElement(createP("/" + mainChar.cpStats.getMaxModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdAttributes_MiniDivCPCapAgility);
            pstats.sdAttributes_MiniDivCPCapAgility.style("display", "flex");
            pstats.sdAttributes_InputCPCapAgility.style("max-width", "45%");
            pstats.sdAttributes_InputCPCapAgility.style("min-width", "45%");
            pstats.sdAttributes_InputCPCapAgility.style("text-align", "center");
            pstats.sdAttributes_InputCPCapAgility.style("margin-top", "0");
            pstats.sdAttributes_TextCPCapAgility.style("margin-top", "2px");

            pstats.sdAttributes_TextCPCapAgility.roundDecimal("", "/");

            // Discipline
            pstats.sdAttributes_TextNameDiscipline = new myElement(createP("Discipline"), "shrinkablePStatsMainP", pstats.sdAttributes_DivName);
            pstats.sdAttributes_TextGearDiscipline = new myElement(createP(mainChar.stats.disciplineGearModifier), "shrinkablePStatsMainFivePieceP", pstats.sdAttributes_DivGear);
            pstats.sdAttributes_TextTotalDiscipline = new myElement(createP(mainChar.cpStats.getDiscipline() + mainChar.stats.disciplineGearModifier), "shrinkablePStatsMainFivePieceP", pstats.sdAttributes_DivTotal);

            pstats.sdAttributes_TextTotalDiscipline.round();

            pstats.sdAttributes_MiniDivCPCapDiscipline = new myElement(createDiv(), "", pstats.sdAttributes_DivCpCap);
            pstats.sdAttributes_InputCPCapDiscipline = new myElement(createInput(mainChar.cpStats.getDiscipline()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdAttributes_MiniDivCPCapDiscipline, null, () => {
                let x = parseInt(pstats.sdAttributes_InputCPCapDiscipline.value());
                x = isNaN(x) ? 0 : x;

                // Training
                let cpCost = mainChar.cpStats.discipline; //1
                let oldVal = mainChar.cpStats.getDiscipline(); // 2

                mainChar.cpStats.setDiscBought(x);
                pstats.sdAttributes_TextTotalDiscipline.html(mainChar.cpStats.getDiscipline());
                pstats.sdAttributes_TextTotalDiscipline.round();

                // Training-AfterNewValue
                let newVal = mainChar.cpStats.getDiscipline(); // 3
                let diff = newVal - oldVal;
                addTrainingPoints("Discipline", diff, cpCost, true); // 4
            }, null, null, true, mainChar.cpStats.getMaxModifier());
            pstats.sdAttributes_TextCPCapDiscipline = new myElement(createP("/" + mainChar.cpStats.getMaxModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdAttributes_MiniDivCPCapDiscipline);
            pstats.sdAttributes_MiniDivCPCapDiscipline.style("display", "flex");
            pstats.sdAttributes_InputCPCapDiscipline.style("max-width", "45%");
            pstats.sdAttributes_InputCPCapDiscipline.style("min-width", "45%");
            pstats.sdAttributes_InputCPCapDiscipline.style("text-align", "center");
            pstats.sdAttributes_InputCPCapDiscipline.style("margin-top", "0");
            pstats.sdAttributes_TextCPCapDiscipline.style("margin-top", "2px");

            pstats.sdAttributes_TextCPCapDiscipline.roundDecimal("", "/");

            // Intelligence
            pstats.sdAttributes_TextNameIntelligence = new myElement(createP("Intelligence"), "shrinkablePStatsMainP", pstats.sdAttributes_DivName);
            pstats.sdAttributes_TextGearIntelligence = new myElement(createP(mainChar.stats.intelligenceGearModifier), "shrinkablePStatsMainFivePieceP", pstats.sdAttributes_DivGear);
            pstats.sdAttributes_TextTotalIntelligence = new myElement(createP(mainChar.cpStats.getIntelligence() + mainChar.stats.intelligenceGearModifier), "shrinkablePStatsMainFivePieceP", pstats.sdAttributes_DivTotal);

            pstats.sdAttributes_TextTotalIntelligence.round();

            pstats.sdAttributes_MiniDivCPCapIntelligence = new myElement(createDiv(), "", pstats.sdAttributes_DivCpCap);
            pstats.sdAttributes_InputCPCapIntelligence = new myElement(createInput(mainChar.cpStats.getIntelligence()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdAttributes_MiniDivCPCapIntelligence, null, () => {
                let x = parseInt(pstats.sdAttributes_InputCPCapIntelligence.value());
                x = isNaN(x) ? 0 : x;

                // Training
                let cpCost = mainChar.cpStats.intelligence; //1
                let oldVal = mainChar.cpStats.getIntelligence(); // 2

                mainChar.cpStats.setIntBought(x);
                pstats.sdAttributes_TextTotalIntelligence.html(mainChar.cpStats.getIntelligence());
                pstats.sdAttributes_TextTotalIntelligence.round();

                // Training-AfterNewValue
                let newVal = mainChar.cpStats.getIntelligence(); // 3
                let diff = newVal - oldVal;
                addTrainingPoints("Intelligence", diff, cpCost, true); // 4
            }, null, null, true, mainChar.cpStats.getMaxModifier());
            pstats.sdAttributes_TextCPCapIntelligence = new myElement(createP("/" + mainChar.cpStats.getMaxModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdAttributes_MiniDivCPCapIntelligence);
            pstats.sdAttributes_MiniDivCPCapIntelligence.style("display", "flex");
            pstats.sdAttributes_InputCPCapIntelligence.style("max-width", "45%");
            pstats.sdAttributes_InputCPCapIntelligence.style("min-width", "45%");
            pstats.sdAttributes_InputCPCapIntelligence.style("text-align", "center");
            pstats.sdAttributes_InputCPCapIntelligence.style("margin-top", "0");
            pstats.sdAttributes_TextCPCapIntelligence.style("margin-top", "2px");

            pstats.sdAttributes_TextCPCapIntelligence.roundDecimal("", "/");

            // Conviction
            pstats.sdAttributes_TextNameConviction = new myElement(createP("Conviction"), "shrinkablePStatsMainP", pstats.sdAttributes_DivName);
            pstats.sdAttributes_TextGearConviction = new myElement(createP(mainChar.stats.convictionGearModifier), "shrinkablePStatsMainFivePieceP", pstats.sdAttributes_DivGear);
            pstats.sdAttributes_TextTotalConviction = new myElement(createP(mainChar.cpStats.getConviction() + mainChar.stats.convictionGearModifier), "shrinkablePStatsMainFivePieceP", pstats.sdAttributes_DivTotal);

            pstats.sdAttributes_TextTotalConviction.round();

            pstats.sdAttributes_MiniDivCPCapConviction = new myElement(createDiv(), "", pstats.sdAttributes_DivCpCap);
            pstats.sdAttributes_InputCPCapConviction = new myElement(createInput(mainChar.cpStats.getConviction()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdAttributes_MiniDivCPCapConviction, null, () => {
                let x = parseInt(pstats.sdAttributes_InputCPCapConviction.value());
                x = isNaN(x) ? 0 : x;

                // Training
                let cpCost = mainChar.cpStats.conviction; //1
                let oldVal = mainChar.cpStats.getConviction(); // 2

                mainChar.cpStats.setConvBought(x);
                pstats.sdAttributes_TextTotalConviction.html(mainChar.cpStats.getConviction());
                pstats.sdAttributes_TextTotalConviction.round();

                // Training-AfterNewValue
                let newVal = mainChar.cpStats.getConviction(); // 3
                let diff = newVal - oldVal;
                addTrainingPoints("Conviction", diff, cpCost, true); // 4
            }, null, null, true, mainChar.cpStats.getMaxModifier());
            pstats.sdAttributes_TextCPCapConviction = new myElement(createP("/" + mainChar.cpStats.getMaxModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdAttributes_MiniDivCPCapConviction);
            pstats.sdAttributes_MiniDivCPCapConviction.style("display", "flex");
            pstats.sdAttributes_InputCPCapConviction.style("max-width", "45%");
            pstats.sdAttributes_InputCPCapConviction.style("min-width", "45%");
            pstats.sdAttributes_InputCPCapConviction.style("text-align", "center");
            pstats.sdAttributes_InputCPCapConviction.style("margin-top", "0");
            pstats.sdAttributes_TextCPCapConviction.style("margin-top", "2px");

            pstats.sdAttributes_TextCPCapConviction.roundDecimal("", "/");

            // Attunement
            pstats.sdAttributes_TextNameAttunement = new myElement(createP("Attunement"), "shrinkablePStatsMainP", pstats.sdAttributes_DivName);
            pstats.sdAttributes_TextGearAttunement = new myElement(createP(mainChar.stats.attunementGearModifier), "shrinkablePStatsMainFivePieceP", pstats.sdAttributes_DivGear);
            pstats.sdAttributes_TextTotalAttunement = new myElement(createP(mainChar.cpStats.getAttunement() + mainChar.stats.attunementGearModifier), "shrinkablePStatsMainFivePieceP", pstats.sdAttributes_DivTotal);

            pstats.sdAttributes_TextTotalAttunement.round();

            pstats.sdAttributes_MiniDivCPCapAttunement = new myElement(createDiv(), "", pstats.sdAttributes_DivCpCap);
            pstats.sdAttributes_InputCPCapAttunement = new myElement(createInput(mainChar.cpStats.getAttunement()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdAttributes_MiniDivCPCapAttunement, null, () => {
                let x = parseInt(pstats.sdAttributes_InputCPCapAttunement.value());
                x = isNaN(x) ? 0 : x;

                // Training
                let cpCost = mainChar.cpStats.attunement; //1
                let oldVal = mainChar.cpStats.getAttunement(); // 2

                mainChar.cpStats.setAttBought(x);
                pstats.sdAttributes_TextTotalAttunement.html(mainChar.cpStats.getAttunement());
                pstats.sdAttributes_TextTotalAttunement.round();

                // Training-AfterNewValue
                let newVal = mainChar.cpStats.getAttunement(); // 3
                let diff = newVal - oldVal;
                addTrainingPoints("Attunement", diff, cpCost, true); // 4
            }, null, null, true, mainChar.cpStats.getMaxModifier());
            pstats.sdAttributes_TextCPCapAttunement = new myElement(createP("/" + mainChar.cpStats.getMaxModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdAttributes_MiniDivCPCapAttunement);
            pstats.sdAttributes_MiniDivCPCapAttunement.style("display", "flex");
            pstats.sdAttributes_InputCPCapAttunement.style("max-width", "45%");
            pstats.sdAttributes_InputCPCapAttunement.style("min-width", "45%");
            pstats.sdAttributes_InputCPCapAttunement.style("text-align", "center");
            pstats.sdAttributes_InputCPCapAttunement.style("margin-top", "0");
            pstats.sdAttributes_TextCPCapAttunement.style("margin-top", "2px");

            pstats.sdAttributes_TextCPCapAttunement.roundDecimal("", "/");

            // Constitution
            pstats.sdAttributes_TextNameConstitution = new myElement(createP("Constitution"), "shrinkablePStatsMainP", pstats.sdAttributes_DivName);
            pstats.sdAttributes_TextGearConstitution = new myElement(createP(mainChar.stats.constitutionGearModifier), "shrinkablePStatsMainFivePieceP", pstats.sdAttributes_DivGear);
            pstats.sdAttributes_TextTotalConstitution = new myElement(createP(mainChar.cpStats.getConstitution() + mainChar.stats.constitutionGearModifier), "shrinkablePStatsMainFivePieceP", pstats.sdAttributes_DivTotal);

            pstats.sdAttributes_TextTotalConstitution.round();

            pstats.sdAttributes_MiniDivCPCapConstitution = new myElement(createDiv(), "", pstats.sdAttributes_DivCpCap);
            pstats.sdAttributes_InputCPCapConstitution = new myElement(createInput(mainChar.cpStats.getConstitution()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdAttributes_MiniDivCPCapConstitution, null, () => {
                let x = parseInt(pstats.sdAttributes_InputCPCapConstitution.value());
                x = isNaN(x) ? 0 : x;

                // Training
                let cpCost = mainChar.cpStats.constitution; //1
                let oldVal = mainChar.cpStats.getConstitution(); // 2

                mainChar.cpStats.setConBought(x);
                pstats.sdAttributes_TextTotalConstitution.html(mainChar.cpStats.getConstitution());
                pstats.sdAttributes_TextTotalConstitution.round();

                // Training-AfterNewValue
                let newVal = mainChar.cpStats.getConstitution(); // 3
                let diff = newVal - oldVal;
                addTrainingPoints("Constitution", diff, cpCost, true); // 4
            }, null, null, true, mainChar.cpStats.getMaxModifier());
            pstats.sdAttributes_TextCPCapConstitution = new myElement(createP("/" + mainChar.cpStats.getMaxModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdAttributes_MiniDivCPCapConstitution);
            pstats.sdAttributes_MiniDivCPCapConstitution.style("display", "flex");
            pstats.sdAttributes_InputCPCapConstitution.style("max-width", "45%");
            pstats.sdAttributes_InputCPCapConstitution.style("min-width", "45%");
            pstats.sdAttributes_InputCPCapConstitution.style("text-align", "center");
            pstats.sdAttributes_InputCPCapConstitution.style("margin-top", "0");
            pstats.sdAttributes_TextCPCapConstitution.style("margin-top", "2px");

            pstats.sdAttributes_TextCPCapConstitution.roundDecimal("", "/");
        }
    });
    pstats.sdAttributesText = new myElement(createP("+ Attributes"), "shrinkableHeader", pstats.sdAttributes);

    // Shrinkable VsDefenses
    pstats.sdVsDefenses = new myElement(createDiv(), "shrinkableDiv");
    pstats.sdVSDefensesCheckBox = new myElement(createInput("", "checkbox"), "shrinkableInputField", pstats.sdVsDefenses, null, () => {
        pstats.sdVSDefensesCheckBox.swapChecked(); // This is for updating the isChecked variable inside the element.
        let hidden = pstats.sdVsDefensesText.html().indexOf("+ Vs Defenses") != -1 ? false : true;
        pstats.sdVsDefensesText.html((hidden ? "+ Vs Defenses" : "- Vs Defenses"));

        if (hidden) {
            openedSections[11] = 0;
            pstats.sdVsDefensesText.class("shrinkableHeader");

            Object.keys(pstats).forEach(function (key) {
                if (key.startsWith("sdVsDefenses") && key != "sdVsDefenses" && key != "sdVSDefensesCheckBox" && key != "sdVsDefensesText") {
                    pstats[key].remove();
                    delete pstats[key];
                }
            });
        }
        else {
            openedSections[11] = 1;
            pstats.sdVsDefensesText.class("shrinkableHeaderHidden");

            pstats.sdVsDefenses_DivVsDefensesStats = new myElement(createDiv(), "shrinkablePStatsMainBigSingularDiv", pstats.sdVsDefenses);
            pstats.sdVsDefenses_DivName = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivBig", pstats.sdVsDefenses_DivVsDefensesStats);
            pstats.sdVsDefenses_DivBase = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivLittle", pstats.sdVsDefenses_DivVsDefensesStats);
            pstats.sdVsDefenses_DivCpCap = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivLittle", pstats.sdVsDefenses_DivVsDefensesStats);
            pstats.sdVsDefenses_DivGear = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivLittle", pstats.sdVsDefenses_DivVsDefensesStats);
            pstats.sdVsDefenses_DivTotal = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivLittle", pstats.sdVsDefenses_DivVsDefensesStats);

            pstats.sdVsDefenses_TextHeaderName = new myElement(createP("Name"), "shrinkablePStatsMainLeftHeaderP", pstats.sdVsDefenses_DivName);
            pstats.sdVsDefenses_TextHeaderBase = new myElement(createP("Base"), "shrinkablePStatsMainCenterHeaderP", pstats.sdVsDefenses_DivBase);
            pstats.sdVsDefenses_TextHeaderCpCap = new myElement(createP("Cp/Cap"), "shrinkablePStatsMainCenterHeaderP", pstats.sdVsDefenses_DivCpCap);
            pstats.sdVsDefenses_TextHeaderGear = new myElement(createP("Gear"), "shrinkablePStatsMainCenterHeaderP", pstats.sdVsDefenses_DivGear);
            pstats.sdVsDefenses_TextHeaderTotal = new myElement(createP("Total"), "shrinkablePStatsMainCenterHeaderP", pstats.sdVsDefenses_DivTotal);

            pstats.sdVsDefenses_DivName.style("min-width", "30%");
            pstats.sdVsDefenses_DivCpCap.style("min-width", "25%");
            pstats.sdVsDefenses_DivCpCap.style("max-width", "25%");
            // Reflex
            pstats.sdVsDefenses_TextNameReflex = new myElement(createP("Reflex"), "shrinkablePStatsMainP", pstats.sdVsDefenses_DivName);
            pstats.sdVsDefenses_TextBaseReflex = new myElement(createP(VSDefs.Reflex.getPointsBase()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_DivBase);
            pstats.sdVsDefenses_TextGearReflex = new myElement(createP(VSDefs.Reflex.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_DivGear);
            pstats.sdVsDefenses_TextTotalReflex = new myElement(createP(VSDefs.Reflex.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_DivTotal);

            pstats.sdVsDefenses_TextTotalReflex.round();

            pstats.sdVsDefenses_MiniDivCPCapReflex = new myElement(createDiv(), "shrinkablePStatsDivX", pstats.sdVsDefenses_DivCpCap);
            pstats.sdVsDefenses_InputCPCapReflex = new myElement(createInput(VSDefs.Reflex.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdVsDefenses_MiniDivCPCapReflex, null, () => {
                let x = parseInt(pstats.sdVsDefenses_InputCPCapReflex.value());
                x = isNaN(x) ? 0 : x;
                VSDefs.Reflex.setCPCount(x);
                pstats.sdVsDefenses_TextTotalReflex.html(VSDefs.Reflex.getPointsTotalForStatsPage());
                pstats.sdVsDefenses_TextTotalReflex.round();
            }, null, null, true, VSDefs.Reflex.getCap());
            pstats.sdVsDefenses_TextCPCapReflex = new myElement(createP("/" + VSDefs.Reflex.getCap()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_MiniDivCPCapReflex);
            pstats.sdVsDefenses_MiniDivCPCapReflex.style("display", "flex");
            pstats.sdVsDefenses_InputCPCapReflex.style("max-width", "45%");
            pstats.sdVsDefenses_InputCPCapReflex.style("min-width", "45%");
            pstats.sdVsDefenses_InputCPCapReflex.style("text-align", "center");
            pstats.sdVsDefenses_InputCPCapReflex.style("margin-top", "0");
            pstats.sdVsDefenses_TextCPCapReflex.style("margin-top", "2px");

            pstats.sdVsDefenses_TextBaseReflex.roundDecimal();
            pstats.sdVsDefenses_TextGearReflex.roundDecimal();
            pstats.sdVsDefenses_TextCPCapReflex.roundDecimal("", "/");

            // Shapechange
            pstats.sdVsDefenses_TextNameShapechange = new myElement(createP("Shapechange"), "shrinkablePStatsMainP", pstats.sdVsDefenses_DivName);
            pstats.sdVsDefenses_TextBaseShapechange = new myElement(createP(VSDefs.Shapechange.getPointsBase()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_DivBase);
            pstats.sdVsDefenses_TextGearShapechange = new myElement(createP(VSDefs.Shapechange.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_DivGear);
            pstats.sdVsDefenses_TextTotalShapechange = new myElement(createP(VSDefs.Shapechange.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_DivTotal);

            pstats.sdVsDefenses_TextTotalShapechange.round();

            pstats.sdVsDefenses_MiniDivCPCapShapechange = new myElement(createDiv(), "shrinkablePStatsDivX", pstats.sdVsDefenses_DivCpCap);
            pstats.sdVsDefenses_InputCPCapShapechange = new myElement(createInput(VSDefs.Shapechange.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdVsDefenses_MiniDivCPCapShapechange, null, () => {
                let x = parseInt(pstats.sdVsDefenses_InputCPCapShapechange.value());
                x = isNaN(x) ? 0 : x;
                VSDefs.Shapechange.setCPCount(x);
                pstats.sdVsDefenses_TextTotalShapechange.html(VSDefs.Shapechange.getPointsTotalForStatsPage());
                pstats.sdVsDefenses_TextTotalShapechange.round();
            }, null, null, true, VSDefs.Shapechange.getCap());
            pstats.sdVsDefenses_TextCPCapShapechange = new myElement(createP("/" + VSDefs.Shapechange.getCap()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_MiniDivCPCapShapechange);
            pstats.sdVsDefenses_MiniDivCPCapShapechange.style("display", "flex");
            pstats.sdVsDefenses_InputCPCapShapechange.style("max-width", "45%");
            pstats.sdVsDefenses_InputCPCapShapechange.style("min-width", "45%");
            pstats.sdVsDefenses_InputCPCapShapechange.style("text-align", "center");
            pstats.sdVsDefenses_InputCPCapShapechange.style("margin-top", "0");
            pstats.sdVsDefenses_TextCPCapShapechange.style("margin-top", "2px");

            pstats.sdVsDefenses_TextBaseShapechange.roundDecimal();
            pstats.sdVsDefenses_TextGearShapechange.roundDecimal();
            pstats.sdVsDefenses_TextCPCapShapechange.roundDecimal("", "/");

            // Balance
            pstats.sdVsDefenses_TextNameBalance = new myElement(createP("Balance"), "shrinkablePStatsMainP", pstats.sdVsDefenses_DivName);
            pstats.sdVsDefenses_TextBaseBalance = new myElement(createP(VSDefs.Balance.getPointsBase()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_DivBase);
            pstats.sdVsDefenses_TextGearBalance = new myElement(createP(VSDefs.Balance.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_DivGear);
            pstats.sdVsDefenses_TextTotalBalance = new myElement(createP(VSDefs.Balance.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_DivTotal);

            pstats.sdVsDefenses_TextTotalBalance.round();

            pstats.sdVsDefenses_MiniDivCPCapBalance = new myElement(createDiv(), "shrinkablePStatsDivX", pstats.sdVsDefenses_DivCpCap);
            pstats.sdVsDefenses_InputCPCapBalance = new myElement(createInput(VSDefs.Balance.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdVsDefenses_MiniDivCPCapBalance, null, () => {
                let x = parseInt(pstats.sdVsDefenses_InputCPCapBalance.value());
                x = isNaN(x) ? 0 : x;
                VSDefs.Balance.setCPCount(x);
                pstats.sdVsDefenses_TextTotalBalance.html(VSDefs.Balance.getPointsTotalForStatsPage());
                pstats.sdVsDefenses_TextTotalBalance.round();
            }, null, null, true, VSDefs.Balance.getCap());
            pstats.sdVsDefenses_TextCPCapBalance = new myElement(createP("/" + VSDefs.Balance.getCap()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_MiniDivCPCapBalance);
            pstats.sdVsDefenses_MiniDivCPCapBalance.style("display", "flex");
            pstats.sdVsDefenses_InputCPCapBalance.style("max-width", "45%");
            pstats.sdVsDefenses_InputCPCapBalance.style("min-width", "45%");
            pstats.sdVsDefenses_InputCPCapBalance.style("text-align", "center");
            pstats.sdVsDefenses_InputCPCapBalance.style("margin-top", "0");
            pstats.sdVsDefenses_TextCPCapBalance.style("margin-top", "2px");

            pstats.sdVsDefenses_TextBaseBalance.roundDecimal();
            pstats.sdVsDefenses_TextGearBalance.roundDecimal();
            pstats.sdVsDefenses_TextCPCapBalance.roundDecimal("", "/");

            // Toxic
            pstats.sdVsDefenses_TextNameToxic = new myElement(createP("Toxic"), "shrinkablePStatsMainP", pstats.sdVsDefenses_DivName);
            pstats.sdVsDefenses_TextBaseToxic = new myElement(createP(VSDefs.Toxic.getPointsBase()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_DivBase);
            pstats.sdVsDefenses_TextGearToxic = new myElement(createP(VSDefs.Toxic.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_DivGear);
            pstats.sdVsDefenses_TextTotalToxic = new myElement(createP(VSDefs.Toxic.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_DivTotal);

            pstats.sdVsDefenses_TextTotalToxic.round();

            pstats.sdVsDefenses_MiniDivCPCapToxic = new myElement(createDiv(), "shrinkablePStatsDivX", pstats.sdVsDefenses_DivCpCap);
            pstats.sdVsDefenses_InputCPCapToxic = new myElement(createInput(VSDefs.Toxic.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdVsDefenses_MiniDivCPCapToxic, null, () => {
                let x = parseInt(pstats.sdVsDefenses_InputCPCapToxic.value());
                x = isNaN(x) ? 0 : x;
                VSDefs.Toxic.setCPCount(x);
                pstats.sdVsDefenses_TextTotalToxic.html(VSDefs.Toxic.getPointsTotalForStatsPage());
                pstats.sdVsDefenses_TextTotalToxic.round();
            }, null, null, true, VSDefs.Toxic.getCap());
            pstats.sdVsDefenses_TextCPCapToxic = new myElement(createP("/" + VSDefs.Toxic.getCap()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_MiniDivCPCapToxic);
            pstats.sdVsDefenses_MiniDivCPCapToxic.style("display", "flex");
            pstats.sdVsDefenses_InputCPCapToxic.style("max-width", "45%");
            pstats.sdVsDefenses_InputCPCapToxic.style("min-width", "45%");
            pstats.sdVsDefenses_InputCPCapToxic.style("text-align", "center");
            pstats.sdVsDefenses_InputCPCapToxic.style("margin-top", "0");
            pstats.sdVsDefenses_TextCPCapToxic.style("margin-top", "2px");

            pstats.sdVsDefenses_TextBaseToxic.roundDecimal();
            pstats.sdVsDefenses_TextGearToxic.roundDecimal();
            pstats.sdVsDefenses_TextCPCapToxic.roundDecimal("", "/");

            // Destruction
            pstats.sdVsDefenses_TextNameDestruction = new myElement(createP("Destruction"), "shrinkablePStatsMainP", pstats.sdVsDefenses_DivName);
            pstats.sdVsDefenses_TextBaseDestruction = new myElement(createP(VSDefs.Destruction.getPointsBase()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_DivBase);
            pstats.sdVsDefenses_TextGearDestruction = new myElement(createP(VSDefs.Destruction.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_DivGear);
            pstats.sdVsDefenses_TextTotalDestruction = new myElement(createP(VSDefs.Destruction.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_DivTotal);

            pstats.sdVsDefenses_TextTotalDestruction.round();

            pstats.sdVsDefenses_MiniDivCPCapDestruction = new myElement(createDiv(), "shrinkablePStatsDivX", pstats.sdVsDefenses_DivCpCap);
            pstats.sdVsDefenses_InputCPCapDestruction = new myElement(createInput(VSDefs.Destruction.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdVsDefenses_MiniDivCPCapDestruction, null, () => {
                let x = parseInt(pstats.sdVsDefenses_InputCPCapDestruction.value());
                x = isNaN(x) ? 0 : x;
                VSDefs.Destruction.setCPCount(x);
                pstats.sdVsDefenses_TextTotalDestruction.html(VSDefs.Destruction.getPointsTotalForStatsPage());
                pstats.sdVsDefenses_TextTotalDestruction.round();
            }, null, null, true, VSDefs.Destruction.getCap());
            pstats.sdVsDefenses_TextCPCapDestruction = new myElement(createP("/" + VSDefs.Destruction.getCap()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_MiniDivCPCapDestruction);
            pstats.sdVsDefenses_MiniDivCPCapDestruction.style("display", "flex");
            pstats.sdVsDefenses_InputCPCapDestruction.style("max-width", "45%");
            pstats.sdVsDefenses_InputCPCapDestruction.style("min-width", "45%");
            pstats.sdVsDefenses_InputCPCapDestruction.style("text-align", "center");
            pstats.sdVsDefenses_InputCPCapDestruction.style("margin-top", "0");
            pstats.sdVsDefenses_TextCPCapDestruction.style("margin-top", "2px");

            pstats.sdVsDefenses_TextBaseDestruction.roundDecimal();
            pstats.sdVsDefenses_TextGearDestruction.roundDecimal();
            pstats.sdVsDefenses_TextCPCapDestruction.roundDecimal("", "/");

            // HoldPos
            pstats.sdVsDefenses_TextNameHoldPos = new myElement(createP("Hold Pos."), "shrinkablePStatsMainP", pstats.sdVsDefenses_DivName);
            pstats.sdVsDefenses_TextBaseHoldPos = new myElement(createP(VSDefs.HoldPos.getPointsBase()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_DivBase);
            pstats.sdVsDefenses_TextGearHoldPos = new myElement(createP(VSDefs.HoldPos.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_DivGear);
            pstats.sdVsDefenses_TextTotalHoldPos = new myElement(createP(VSDefs.HoldPos.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_DivTotal);

            pstats.sdVsDefenses_TextTotalHoldPos.round();

            pstats.sdVsDefenses_MiniDivCPCapHoldPos = new myElement(createDiv(), "shrinkablePStatsDivX", pstats.sdVsDefenses_DivCpCap);
            pstats.sdVsDefenses_InputCPCapHoldPos = new myElement(createInput(VSDefs.HoldPos.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdVsDefenses_MiniDivCPCapHoldPos, null, () => {
                let x = parseInt(pstats.sdVsDefenses_InputCPCapHoldPos.value());
                x = isNaN(x) ? 0 : x;
                VSDefs.HoldPos.setCPCount(x);
                pstats.sdVsDefenses_TextTotalHoldPos.html(VSDefs.HoldPos.getPointsTotalForStatsPage());
                pstats.sdVsDefenses_TextTotalHoldPos.round();
            }, null, null, true, VSDefs.HoldPos.getCap());
            pstats.sdVsDefenses_TextCPCapHoldPos = new myElement(createP("/" + VSDefs.HoldPos.getCap()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_MiniDivCPCapHoldPos);
            pstats.sdVsDefenses_MiniDivCPCapHoldPos.style("display", "flex");
            pstats.sdVsDefenses_InputCPCapHoldPos.style("max-width", "45%");
            pstats.sdVsDefenses_InputCPCapHoldPos.style("min-width", "45%");
            pstats.sdVsDefenses_InputCPCapHoldPos.style("text-align", "center");
            pstats.sdVsDefenses_InputCPCapHoldPos.style("margin-top", "0");
            pstats.sdVsDefenses_TextCPCapHoldPos.style("margin-top", "2px");

            pstats.sdVsDefenses_TextBaseHoldPos.roundDecimal();
            pstats.sdVsDefenses_TextGearHoldPos.roundDecimal();
            pstats.sdVsDefenses_TextCPCapHoldPos.roundDecimal("", "/");

            // Restraints
            pstats.sdVsDefenses_TextNameRestraint = new myElement(createP("Restraints"), "shrinkablePStatsMainP", pstats.sdVsDefenses_DivName);
            pstats.sdVsDefenses_TextBaseRestraint = new myElement(createP(VSDefs.Restraint.getPointsBase()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_DivBase);
            pstats.sdVsDefenses_TextGearRestraint = new myElement(createP(VSDefs.Restraint.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_DivGear);
            pstats.sdVsDefenses_TextTotalRestraint = new myElement(createP(VSDefs.Restraint.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_DivTotal);

            pstats.sdVsDefenses_TextTotalRestraint.round();

            pstats.sdVsDefenses_MiniDivCPCapRestraint = new myElement(createDiv(), "shrinkablePStatsDivX", pstats.sdVsDefenses_DivCpCap);
            pstats.sdVsDefenses_InputCPCapRestraint = new myElement(createInput(VSDefs.Restraint.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdVsDefenses_MiniDivCPCapRestraint, null, () => {
                let x = parseInt(pstats.sdVsDefenses_InputCPCapRestraint.value());
                x = isNaN(x) ? 0 : x;
                VSDefs.Restraint.setCPCount(x);
                pstats.sdVsDefenses_TextTotalRestraint.html(VSDefs.Restraint.getPointsTotalForStatsPage());
                pstats.sdVsDefenses_TextTotalRestraint.round();
            }, null, null, true, VSDefs.Restraint.getCap());
            pstats.sdVsDefenses_TextCPCapRestraint = new myElement(createP("/" + VSDefs.Restraint.getCap()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_MiniDivCPCapRestraint);
            pstats.sdVsDefenses_MiniDivCPCapRestraint.style("display", "flex");
            pstats.sdVsDefenses_InputCPCapRestraint.style("max-width", "45%");
            pstats.sdVsDefenses_InputCPCapRestraint.style("min-width", "45%");
            pstats.sdVsDefenses_InputCPCapRestraint.style("text-align", "center");
            pstats.sdVsDefenses_InputCPCapRestraint.style("margin-top", "0");
            pstats.sdVsDefenses_TextCPCapRestraint.style("margin-top", "2px");

            pstats.sdVsDefenses_TextBaseRestraint.roundDecimal();
            pstats.sdVsDefenses_TextGearRestraint.roundDecimal();
            pstats.sdVsDefenses_TextCPCapRestraint.roundDecimal("", "/");

            // Grip
            pstats.sdVsDefenses_TextNameGrip = new myElement(createP("Grip"), "shrinkablePStatsMainP", pstats.sdVsDefenses_DivName);
            pstats.sdVsDefenses_TextBaseGrip = new myElement(createP(VSDefs.Grip.getPointsBase()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_DivBase);
            pstats.sdVsDefenses_TextGearGrip = new myElement(createP(VSDefs.Grip.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_DivGear);
            pstats.sdVsDefenses_TextTotalGrip = new myElement(createP(VSDefs.Grip.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_DivTotal);

            pstats.sdVsDefenses_TextTotalGrip.round();

            pstats.sdVsDefenses_MiniDivCPCapGrip = new myElement(createDiv(), "shrinkablePStatsDivX", pstats.sdVsDefenses_DivCpCap);
            pstats.sdVsDefenses_InputCPCapGrip = new myElement(createInput(VSDefs.Grip.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdVsDefenses_MiniDivCPCapGrip, null, () => {
                let x = parseInt(pstats.sdVsDefenses_InputCPCapGrip.value());
                x = isNaN(x) ? 0 : x;
                VSDefs.Grip.setCPCount(x);
                pstats.sdVsDefenses_TextTotalGrip.html(VSDefs.Grip.getPointsTotalForStatsPage());
                pstats.sdVsDefenses_TextTotalGrip.round();
            }, null, null, true, VSDefs.Grip.getCap());
            pstats.sdVsDefenses_TextCPCapGrip = new myElement(createP("/" + VSDefs.Grip.getCap().toFixed(2)), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_MiniDivCPCapGrip);
            pstats.sdVsDefenses_MiniDivCPCapGrip.style("display", "flex");
            pstats.sdVsDefenses_InputCPCapGrip.style("max-width", "45%");
            pstats.sdVsDefenses_InputCPCapGrip.style("min-width", "45%");
            pstats.sdVsDefenses_InputCPCapGrip.style("text-align", "center");
            pstats.sdVsDefenses_InputCPCapGrip.style("margin-top", "0");
            pstats.sdVsDefenses_TextCPCapGrip.style("margin-top", "2px");

            pstats.sdVsDefenses_TextBaseGrip.roundDecimal();
            pstats.sdVsDefenses_TextGearGrip.roundDecimal();
            pstats.sdVsDefenses_TextCPCapGrip.roundDecimal("", "/");

            // Compulsions
            pstats.sdVsDefenses_TextNameCompulsions = new myElement(createP("Compulsions"), "shrinkablePStatsMainP", pstats.sdVsDefenses_DivName);
            pstats.sdVsDefenses_TextBaseCompulsions = new myElement(createP(VSDefs.Compulsions.getPointsBase()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_DivBase);
            pstats.sdVsDefenses_TextGearCompulsions = new myElement(createP(VSDefs.Compulsions.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_DivGear);
            pstats.sdVsDefenses_TextTotalCompulsions = new myElement(createP(VSDefs.Compulsions.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_DivTotal);

            pstats.sdVsDefenses_TextTotalCompulsions.round();

            pstats.sdVsDefenses_MiniDivCPCapCompulsions = new myElement(createDiv(), "shrinkablePStatsDivX", pstats.sdVsDefenses_DivCpCap);
            pstats.sdVsDefenses_InputCPCapCompulsions = new myElement(createInput(VSDefs.Compulsions.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdVsDefenses_MiniDivCPCapCompulsions, null, () => {
                let x = parseInt(pstats.sdVsDefenses_InputCPCapCompulsions.value());
                x = isNaN(x) ? 0 : x;
                VSDefs.Compulsions.setCPCount(x);
                pstats.sdVsDefenses_TextTotalCompulsions.html(VSDefs.Compulsions.getPointsTotalForStatsPage());
                pstats.sdVsDefenses_TextTotalCompulsions.round();
            }, null, null, true, VSDefs.Compulsions.getCap());
            pstats.sdVsDefenses_TextCPCapCompulsions = new myElement(createP("/" + VSDefs.Compulsions.getCap()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_MiniDivCPCapCompulsions);
            pstats.sdVsDefenses_MiniDivCPCapCompulsions.style("display", "flex");
            pstats.sdVsDefenses_InputCPCapCompulsions.style("max-width", "45%");
            pstats.sdVsDefenses_InputCPCapCompulsions.style("min-width", "45%");
            pstats.sdVsDefenses_InputCPCapCompulsions.style("text-align", "center");
            pstats.sdVsDefenses_InputCPCapCompulsions.style("margin-top", "0");
            pstats.sdVsDefenses_TextCPCapCompulsions.style("margin-top", "2px");

            pstats.sdVsDefenses_TextBaseCompulsions.roundDecimal();
            pstats.sdVsDefenses_TextGearCompulsions.roundDecimal();
            pstats.sdVsDefenses_TextCPCapCompulsions.roundDecimal("", "/");

            // Emotions
            pstats.sdVsDefenses_TextNameEmotions = new myElement(createP("Emotions"), "shrinkablePStatsMainP", pstats.sdVsDefenses_DivName);
            pstats.sdVsDefenses_TextBaseEmotions = new myElement(createP(VSDefs.Emotions.getPointsBase()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_DivBase);
            pstats.sdVsDefenses_TextGearEmotions = new myElement(createP(VSDefs.Emotions.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_DivGear);
            pstats.sdVsDefenses_TextTotalEmotions = new myElement(createP(VSDefs.Emotions.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_DivTotal);

            pstats.sdVsDefenses_TextTotalEmotions.round();

            pstats.sdVsDefenses_MiniDivCPCapEmotions = new myElement(createDiv(), "shrinkablePStatsDivX", pstats.sdVsDefenses_DivCpCap);
            pstats.sdVsDefenses_InputCPCapEmotions = new myElement(createInput(VSDefs.Emotions.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdVsDefenses_MiniDivCPCapEmotions, null, () => {
                let x = parseInt(pstats.sdVsDefenses_InputCPCapEmotions.value());
                x = isNaN(x) ? 0 : x;
                VSDefs.Emotions.setCPCount(x);
                pstats.sdVsDefenses_TextTotalEmotions.html(VSDefs.Emotions.getPointsTotalForStatsPage());
                pstats.sdVsDefenses_TextTotalEmotions.round();
            }, null, null, true, VSDefs.Emotions.getCap());
            pstats.sdVsDefenses_TextCPCapEmotions = new myElement(createP("/" + VSDefs.Emotions.getCap()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_MiniDivCPCapEmotions);
            pstats.sdVsDefenses_MiniDivCPCapEmotions.style("display", "flex");
            pstats.sdVsDefenses_InputCPCapEmotions.style("max-width", "45%");
            pstats.sdVsDefenses_InputCPCapEmotions.style("min-width", "45%");
            pstats.sdVsDefenses_InputCPCapEmotions.style("text-align", "center");
            pstats.sdVsDefenses_InputCPCapEmotions.style("margin-top", "0");
            pstats.sdVsDefenses_TextCPCapEmotions.style("margin-top", "2px");

            pstats.sdVsDefenses_TextBaseEmotions.roundDecimal();
            pstats.sdVsDefenses_TextGearEmotions.roundDecimal();
            pstats.sdVsDefenses_TextCPCapEmotions.roundDecimal("", "/");

            // Concentration
            pstats.sdVsDefenses_TextNameConcentration = new myElement(createP("Concentration"), "shrinkablePStatsMainP", pstats.sdVsDefenses_DivName);
            pstats.sdVsDefenses_TextBaseConcentration = new myElement(createP(VSDefs.Concentration.getPointsBase()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_DivBase);
            pstats.sdVsDefenses_TextGearConcentration = new myElement(createP(VSDefs.Concentration.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_DivGear);
            pstats.sdVsDefenses_TextTotalConcentration = new myElement(createP(VSDefs.Concentration.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_DivTotal);

            pstats.sdVsDefenses_TextTotalConcentration.round();

            pstats.sdVsDefenses_MiniDivCPCapConcentration = new myElement(createDiv(), "shrinkablePStatsDivX", pstats.sdVsDefenses_DivCpCap);
            pstats.sdVsDefenses_InputCPCapConcentration = new myElement(createInput(VSDefs.Concentration.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdVsDefenses_MiniDivCPCapConcentration, null, () => {
                let x = parseInt(pstats.sdVsDefenses_InputCPCapConcentration.value());
                x = isNaN(x) ? 0 : x;
                VSDefs.Concentration.setCPCount(x);
                pstats.sdVsDefenses_TextTotalConcentration.html(VSDefs.Concentration.getPointsTotalForStatsPage());
                pstats.sdVsDefenses_TextTotalConcentration.round();
            }, null, null, true, VSDefs.Concentration.getCap());
            pstats.sdVsDefenses_TextCPCapConcentration = new myElement(createP("/" + VSDefs.Concentration.getCap()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_MiniDivCPCapConcentration);
            pstats.sdVsDefenses_MiniDivCPCapConcentration.style("display", "flex");
            pstats.sdVsDefenses_InputCPCapConcentration.style("max-width", "45%");
            pstats.sdVsDefenses_InputCPCapConcentration.style("min-width", "45%");
            pstats.sdVsDefenses_InputCPCapConcentration.style("text-align", "center");
            pstats.sdVsDefenses_InputCPCapConcentration.style("margin-top", "0");
            pstats.sdVsDefenses_TextCPCapConcentration.style("margin-top", "2px");

            pstats.sdVsDefenses_TextBaseConcentration.roundDecimal();
            pstats.sdVsDefenses_TextGearConcentration.roundDecimal();
            pstats.sdVsDefenses_TextCPCapConcentration.roundDecimal("", "/");

            // Scry
            pstats.sdVsDefenses_TextNameScry = new myElement(createP("Scry"), "shrinkablePStatsMainP", pstats.sdVsDefenses_DivName);
            pstats.sdVsDefenses_TextBaseScry = new myElement(createP(VSDefs.Scry.getPointsBase()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_DivBase);
            pstats.sdVsDefenses_TextGearScry = new myElement(createP(VSDefs.Scry.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_DivGear);
            pstats.sdVsDefenses_TextTotalScry = new myElement(createP(VSDefs.Scry.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_DivTotal);

            pstats.sdVsDefenses_TextTotalScry.round();

            pstats.sdVsDefenses_MiniDivCPCapScry = new myElement(createDiv(), "shrinkablePStatsDivX", pstats.sdVsDefenses_DivCpCap);
            pstats.sdVsDefenses_InputCPCapScry = new myElement(createInput(VSDefs.Scry.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdVsDefenses_MiniDivCPCapScry, null, () => {
                let x = parseInt(pstats.sdVsDefenses_InputCPCapScry.value());
                x = isNaN(x) ? 0 : x;
                VSDefs.Scry.setCPCount(x);
                pstats.sdVsDefenses_TextTotalScry.html(VSDefs.Scry.getPointsTotalForStatsPage());
                pstats.sdVsDefenses_TextTotalScry.round();
            }, null, null, true, VSDefs.Scry.getCap());
            pstats.sdVsDefenses_TextCPCapScry = new myElement(createP("/" + VSDefs.Scry.getCap()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_MiniDivCPCapScry);
            pstats.sdVsDefenses_MiniDivCPCapScry.style("display", "flex");
            pstats.sdVsDefenses_InputCPCapScry.style("max-width", "45%");
            pstats.sdVsDefenses_InputCPCapScry.style("min-width", "45%");
            pstats.sdVsDefenses_InputCPCapScry.style("text-align", "center");
            pstats.sdVsDefenses_InputCPCapScry.style("margin-top", "0");
            pstats.sdVsDefenses_TextCPCapScry.style("margin-top", "2px");

            pstats.sdVsDefenses_TextBaseScry.roundDecimal();
            pstats.sdVsDefenses_TextGearScry.roundDecimal();
            pstats.sdVsDefenses_TextCPCapScry.roundDecimal("", "/");

            // Added Defenses
            for (let i = 0; i < AddedDefensesArray.length; ++i) {
                let addedDef = AddedDefensesArray[i];

                if (addedDef.getCap() != 0) {
                    let textNameAD = new myElement(createP(addedDef.name), "shrinkablePStatsMainP", pstats.sdVsDefenses_DivName);
                    let textBaseAD = new myElement(createP(addedDef.getPointsBase()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_DivBase);
                    let textGearAD = new myElement(createP(addedDef.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_DivGear);
                    let textTotalAD = new myElement(createP(addedDef.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdVsDefenses_DivTotal);

                    textTotalAD.round();

                    let miniDivCPCapAD = new myElement(createDiv(), "shrinkablePStatsDivX", pstats.sdVsDefenses_DivCpCap);
                    let inputCPCapAD = new myElement(createInput(addedDef.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", miniDivCPCapAD, null, () => {
                        let x = parseInt(inputCPCapAD.value());
                        x = isNaN(x) ? 0 : x;
                        addedDef.setCPCount(x);
                        textTotalAD.html(addedDef.getPointsTotalForStatsPage());
                        textTotalAD.round();
                    }, null, null, true, addedDef.getCap());
                    let textCPCapAD = new myElement(createP("/" + addedDef.getCap()), "shrinkablePStatsMainFivePieceP", miniDivCPCapAD);
                    miniDivCPCapAD.style("display", "flex");
                    inputCPCapAD.style("max-width", "45%");
                    inputCPCapAD.style("min-width", "45%");
                    inputCPCapAD.style("text-align", "center");
                    inputCPCapAD.style("margin-top", "0");
                    textCPCapAD.style("margin-top", "2px");

                    textBaseAD.roundDecimal();
                    textGearAD.roundDecimal();
                    textCPCapAD.roundDecimal("", "/");
                }
            }
        }
    });
    pstats.sdVsDefensesText = new myElement(createP("+ Vs Defenses"), "shrinkableHeader", pstats.sdVsDefenses);

    // Shrinkable DamageRed
    pstats.sdDamageRed = new myElement(createDiv(), "shrinkableDiv");
    pstats.sdDamageRedCheckBox = new myElement(createInput("", "checkbox"), "shrinkableInputField", pstats.sdDamageRed, null, () => {
        pstats.sdDamageRedCheckBox.swapChecked(); // This is for updating the isChecked variable inside the element.
        let hidden = pstats.sdDamageRedText.html().indexOf("+ Damage Reductions") != -1 ? false : true;
        pstats.sdDamageRedText.html((hidden ? "+ Damage Reductions" : "- Damage Reductions"));

        if (hidden) {
            openedSections[12] = 0;
            pstats.sdDamageRedText.class("shrinkableHeader");

            Object.keys(pstats).forEach(function (key) {
                if (key.startsWith("sdDamageRed") && key != "sdDamageRed" && key != "sdDamageRedCheckBox" && key != "sdDamageRedText") {
                    pstats[key].remove();
                    delete pstats[key];
                }
            });
        }
        else {
            openedSections[12] = 1;
            pstats.sdDamageRedText.class("shrinkableHeaderHidden");

            pstats.sdDamageRed_DivDamageRedStats = new myElement(createDiv(), "shrinkablePStatsMainBigSingularDiv", pstats.sdDamageRed);
            pstats.sdDamageRed_DivName = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivBig", pstats.sdDamageRed_DivDamageRedStats);
            pstats.sdDamageRed_DivCpCap = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivLittle", pstats.sdDamageRed_DivDamageRedStats);
            pstats.sdDamageRed_DivGear = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivLittle", pstats.sdDamageRed_DivDamageRedStats);
            pstats.sdDamageRed_DivTotal = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivLittle", pstats.sdDamageRed_DivDamageRedStats);

            pstats.sdDamageRed_TextHeaderName = new myElement(createP("Name"), "shrinkablePStatsMainLeftHeaderP", pstats.sdDamageRed_DivName);
            pstats.sdDamageRed_TextHeaderCpCap = new myElement(createP("Cp/Cap"), "shrinkablePStatsMainCenterHeaderP", pstats.sdDamageRed_DivCpCap);
            pstats.sdDamageRed_TextHeaderGear = new myElement(createP("Gear"), "shrinkablePStatsMainCenterHeaderP", pstats.sdDamageRed_DivGear);
            pstats.sdDamageRed_TextHeaderTotal = new myElement(createP("Total"), "shrinkablePStatsMainCenterHeaderP", pstats.sdDamageRed_DivTotal);

            pstats.sdDamageRed_DivName.style("min-width", "30%");
            pstats.sdDamageRed_DivCpCap.style("min-width", "25%");
            pstats.sdDamageRed_DivCpCap.style("max-width", "25%");
            // Physical
            pstats.sdDamageRed_TextNamePhysical = new myElement(createP("Physical"), "shrinkablePStatsMainP", pstats.sdDamageRed_DivName);
            pstats.sdDamageRed_TextGearPhysical = new myElement(createP(DamageTypes.Physical.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdDamageRed_DivGear);
            pstats.sdDamageRed_TextTotalPhysical = new myElement(createP(DamageTypes.Physical.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdDamageRed_DivTotal);

            pstats.sdDamageRed_TextTotalPhysical.round();

            pstats.sdDamageRed_MiniDivCPCapPhysical = new myElement(createDiv(), "", pstats.sdDamageRed_DivCpCap);
            pstats.sdDamageRed_InputCPCapPhysical = new myElement(createInput(DamageTypes.Physical.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdDamageRed_MiniDivCPCapPhysical, null, () => {
                let x = parseInt(pstats.sdDamageRed_InputCPCapPhysical.value());
                x = isNaN(x) ? 0 : x;
                DamageTypes.Physical.setCPCount(x);
                pstats.sdDamageRed_TextTotalPhysical.html(DamageTypes.Physical.getPointsTotalForStatsPage());
                pstats.sdDamageRed_TextTotalPhysical.round();
            }, null, null, true, DamageTypes.Physical.getCap());
            pstats.sdDamageRed_TextCPCapPhysical = new myElement(createP("/" + DamageTypes.Physical.getCap()), "shrinkablePStatsMainFivePieceP", pstats.sdDamageRed_MiniDivCPCapPhysical);
            pstats.sdDamageRed_MiniDivCPCapPhysical.style("display", "flex");
            pstats.sdDamageRed_InputCPCapPhysical.style("max-width", "45%");
            pstats.sdDamageRed_InputCPCapPhysical.style("min-width", "45%");
            pstats.sdDamageRed_InputCPCapPhysical.style("text-align", "center");
            pstats.sdDamageRed_InputCPCapPhysical.style("margin-top", "0");
            pstats.sdDamageRed_TextCPCapPhysical.style("margin-top", "2px");

            pstats.sdDamageRed_TextGearPhysical.roundDecimal();
            pstats.sdDamageRed_TextCPCapPhysical.roundDecimal("", "/");

            // Blunt
            pstats.sdDamageRed_TextNameBlunt = new myElement(createP("Blunt"), "shrinkablePStatsMainP", pstats.sdDamageRed_DivName);
            pstats.sdDamageRed_TextGearBlunt = new myElement(createP(DamageTypes.Blunt.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdDamageRed_DivGear);
            pstats.sdDamageRed_TextTotalBlunt = new myElement(createP(DamageTypes.Blunt.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdDamageRed_DivTotal);

            pstats.sdDamageRed_TextTotalBlunt.round();

            pstats.sdDamageRed_MiniDivCPCapBlunt = new myElement(createDiv(), "", pstats.sdDamageRed_DivCpCap);
            pstats.sdDamageRed_InputCPCapBlunt = new myElement(createInput(DamageTypes.Blunt.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdDamageRed_MiniDivCPCapBlunt, null, () => {
                let x = parseInt(pstats.sdDamageRed_InputCPCapBlunt.value());
                x = isNaN(x) ? 0 : x;
                DamageTypes.Blunt.setCPCount(x);
                pstats.sdDamageRed_TextTotalBlunt.html(DamageTypes.Blunt.getPointsTotalForStatsPage());
                pstats.sdDamageRed_TextTotalBlunt.round();
            }, null, null, true, DamageTypes.Blunt.getCap());
            pstats.sdDamageRed_TextCPCapBlunt = new myElement(createP("/" + DamageTypes.Blunt.getCap()), "shrinkablePStatsMainFivePieceP", pstats.sdDamageRed_MiniDivCPCapBlunt);
            pstats.sdDamageRed_MiniDivCPCapBlunt.style("display", "flex");
            pstats.sdDamageRed_MiniDivCPCapBlunt.style("margin-top", "1px");
            pstats.sdDamageRed_InputCPCapBlunt.style("max-width", "45%");
            pstats.sdDamageRed_InputCPCapBlunt.style("min-width", "45%");
            pstats.sdDamageRed_InputCPCapBlunt.style("text-align", "center");
            pstats.sdDamageRed_InputCPCapBlunt.style("margin-top", "0");
            pstats.sdDamageRed_TextCPCapBlunt.style("margin-top", "2px");

            pstats.sdDamageRed_TextGearBlunt.roundDecimal();
            pstats.sdDamageRed_TextCPCapBlunt.roundDecimal("", "/");

            // Slashing
            pstats.sdDamageRed_TextNameSlashing = new myElement(createP("Slashing"), "shrinkablePStatsMainP", pstats.sdDamageRed_DivName);
            pstats.sdDamageRed_TextGearSlashing = new myElement(createP(DamageTypes.Slashing.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdDamageRed_DivGear);
            pstats.sdDamageRed_TextTotalSlashing = new myElement(createP(DamageTypes.Slashing.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdDamageRed_DivTotal);

            pstats.sdDamageRed_TextTotalSlashing.round();

            pstats.sdDamageRed_MiniDivCPCapSlashing = new myElement(createDiv(), "", pstats.sdDamageRed_DivCpCap);
            pstats.sdDamageRed_InputCPCapSlashing = new myElement(createInput(DamageTypes.Slashing.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdDamageRed_MiniDivCPCapSlashing, null, () => {
                let x = parseInt(pstats.sdDamageRed_InputCPCapSlashing.value());
                x = isNaN(x) ? 0 : x;
                DamageTypes.Slashing.setCPCount(x);
                pstats.sdDamageRed_TextTotalSlashing.html(DamageTypes.Slashing.getPointsTotalForStatsPage());
                pstats.sdDamageRed_TextTotalSlashing.round();
            }, null, null, true, DamageTypes.Slashing.getCap());
            pstats.sdDamageRed_TextCPCapSlashing = new myElement(createP("/" + DamageTypes.Slashing.getCap()), "shrinkablePStatsMainFivePieceP", pstats.sdDamageRed_MiniDivCPCapSlashing);
            pstats.sdDamageRed_MiniDivCPCapSlashing.style("display", "flex");
            pstats.sdDamageRed_MiniDivCPCapSlashing.style("margin-top", "1px");
            pstats.sdDamageRed_InputCPCapSlashing.style("max-width", "45%");
            pstats.sdDamageRed_InputCPCapSlashing.style("min-width", "45%");
            pstats.sdDamageRed_InputCPCapSlashing.style("text-align", "center");
            pstats.sdDamageRed_InputCPCapSlashing.style("margin-top", "0");
            pstats.sdDamageRed_TextCPCapSlashing.style("margin-top", "2px");

            pstats.sdDamageRed_TextGearSlashing.roundDecimal();
            pstats.sdDamageRed_TextCPCapSlashing.roundDecimal("", "/");

            // Piercing
            pstats.sdDamageRed_TextNamePiercing = new myElement(createP("Piercing"), "shrinkablePStatsMainP", pstats.sdDamageRed_DivName);
            pstats.sdDamageRed_TextGearPiercing = new myElement(createP(DamageTypes.Piercing.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdDamageRed_DivGear);
            pstats.sdDamageRed_TextTotalPiercing = new myElement(createP(DamageTypes.Piercing.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdDamageRed_DivTotal);

            pstats.sdDamageRed_TextTotalPiercing.round();

            pstats.sdDamageRed_MiniDivCPCapPiercing = new myElement(createDiv(), "", pstats.sdDamageRed_DivCpCap);
            pstats.sdDamageRed_InputCPCapPiercing = new myElement(createInput(DamageTypes.Piercing.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdDamageRed_MiniDivCPCapPiercing, null, () => {
                let x = parseInt(pstats.sdDamageRed_InputCPCapPiercing.value());
                x = isNaN(x) ? 0 : x;
                DamageTypes.Piercing.setCPCount(x);
                pstats.sdDamageRed_TextTotalPiercing.html(DamageTypes.Piercing.getPointsTotalForStatsPage());
                pstats.sdDamageRed_TextTotalPiercing.round();
            }, null, null, true, DamageTypes.Piercing.getCap());
            pstats.sdDamageRed_TextCPCapPiercing = new myElement(createP("/" + DamageTypes.Piercing.getCap()), "shrinkablePStatsMainFivePieceP", pstats.sdDamageRed_MiniDivCPCapPiercing);
            pstats.sdDamageRed_MiniDivCPCapPiercing.style("display", "flex");
            pstats.sdDamageRed_MiniDivCPCapPiercing.style("margin-top", "1px");
            pstats.sdDamageRed_InputCPCapPiercing.style("max-width", "45%");
            pstats.sdDamageRed_InputCPCapPiercing.style("min-width", "45%");
            pstats.sdDamageRed_InputCPCapPiercing.style("text-align", "center");
            pstats.sdDamageRed_InputCPCapPiercing.style("margin-top", "0");
            pstats.sdDamageRed_TextCPCapPiercing.style("margin-top", "2px");

            pstats.sdDamageRed_TextGearPiercing.roundDecimal();
            pstats.sdDamageRed_TextCPCapPiercing.roundDecimal("", "/");

            // Fire
            pstats.sdDamageRed_TextNameFire = new myElement(createP("Fire"), "shrinkablePStatsMainP", pstats.sdDamageRed_DivName);
            pstats.sdDamageRed_TextGearFire = new myElement(createP(DamageTypes.Fire.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdDamageRed_DivGear);
            pstats.sdDamageRed_TextTotalFire = new myElement(createP(DamageTypes.Fire.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdDamageRed_DivTotal);

            pstats.sdDamageRed_TextTotalFire.round();

            pstats.sdDamageRed_MiniDivCPCapFire = new myElement(createDiv(), "", pstats.sdDamageRed_DivCpCap);
            pstats.sdDamageRed_InputCPCapFire = new myElement(createInput(DamageTypes.Fire.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdDamageRed_MiniDivCPCapFire, null, () => {
                let x = parseInt(pstats.sdDamageRed_InputCPCapFire.value());
                x = isNaN(x) ? 0 : x;
                DamageTypes.Fire.setCPCount(x);
                pstats.sdDamageRed_TextTotalFire.html(DamageTypes.Fire.getPointsTotalForStatsPage());
                pstats.sdDamageRed_TextTotalFire.round();
            }, null, null, true, DamageTypes.Fire.getCap());
            pstats.sdDamageRed_TextCPCapFire = new myElement(createP("/" + DamageTypes.Fire.getCap()), "shrinkablePStatsMainFivePieceP", pstats.sdDamageRed_MiniDivCPCapFire);
            pstats.sdDamageRed_MiniDivCPCapFire.style("display", "flex");
            pstats.sdDamageRed_MiniDivCPCapFire.style("margin-top", "1px");
            pstats.sdDamageRed_InputCPCapFire.style("max-width", "45%");
            pstats.sdDamageRed_InputCPCapFire.style("min-width", "45%");
            pstats.sdDamageRed_InputCPCapFire.style("text-align", "center");
            pstats.sdDamageRed_InputCPCapFire.style("margin-top", "0");
            pstats.sdDamageRed_TextCPCapFire.style("margin-top", "2px");

            pstats.sdDamageRed_TextGearFire.roundDecimal();
            pstats.sdDamageRed_TextCPCapFire.roundDecimal("", "/");

            // Cold
            pstats.sdDamageRed_TextNameCold = new myElement(createP("Cold"), "shrinkablePStatsMainP", pstats.sdDamageRed_DivName);
            pstats.sdDamageRed_TextGearCold = new myElement(createP(DamageTypes.Cold.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdDamageRed_DivGear);
            pstats.sdDamageRed_TextTotalCold = new myElement(createP(DamageTypes.Cold.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdDamageRed_DivTotal);

            pstats.sdDamageRed_TextTotalCold.round();

            pstats.sdDamageRed_MiniDivCPCapCold = new myElement(createDiv(), "", pstats.sdDamageRed_DivCpCap);
            pstats.sdDamageRed_InputCPCapCold = new myElement(createInput(DamageTypes.Cold.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdDamageRed_MiniDivCPCapCold, null, () => {
                let x = parseInt(pstats.sdDamageRed_InputCPCapCold.value());
                x = isNaN(x) ? 0 : x;
                DamageTypes.Cold.setCPCount(x);
                pstats.sdDamageRed_TextTotalCold.html(DamageTypes.Cold.getPointsTotalForStatsPage());
                pstats.sdDamageRed_TextTotalCold.round();
            }, null, null, true, DamageTypes.Cold.getCap());
            pstats.sdDamageRed_TextCPCapCold = new myElement(createP("/" + DamageTypes.Cold.getCap()), "shrinkablePStatsMainFivePieceP", pstats.sdDamageRed_MiniDivCPCapCold);
            pstats.sdDamageRed_MiniDivCPCapCold.style("display", "flex");
            pstats.sdDamageRed_MiniDivCPCapCold.style("margin-top", "1px");
            pstats.sdDamageRed_InputCPCapCold.style("max-width", "45%");
            pstats.sdDamageRed_InputCPCapCold.style("min-width", "45%");
            pstats.sdDamageRed_InputCPCapCold.style("text-align", "center");
            pstats.sdDamageRed_InputCPCapCold.style("margin-top", "0");
            pstats.sdDamageRed_TextCPCapCold.style("margin-top", "2px");

            pstats.sdDamageRed_TextGearCold.roundDecimal();
            pstats.sdDamageRed_TextCPCapCold.roundDecimal("", "/");

            // Lightning
            pstats.sdDamageRed_TextNameLightning = new myElement(createP("Lightning"), "shrinkablePStatsMainP", pstats.sdDamageRed_DivName);
            pstats.sdDamageRed_TextGearLightning = new myElement(createP(DamageTypes.Lightning.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdDamageRed_DivGear);
            pstats.sdDamageRed_TextTotalLightning = new myElement(createP(DamageTypes.Lightning.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdDamageRed_DivTotal);

            pstats.sdDamageRed_TextTotalLightning.round();

            pstats.sdDamageRed_MiniDivCPCapLightning = new myElement(createDiv(), "", pstats.sdDamageRed_DivCpCap);
            pstats.sdDamageRed_InputCPCapLightning = new myElement(createInput(DamageTypes.Lightning.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdDamageRed_MiniDivCPCapLightning, null, () => {
                let x = parseInt(pstats.sdDamageRed_InputCPCapLightning.value());
                x = isNaN(x) ? 0 : x;
                DamageTypes.Lightning.setCPCount(x);
                pstats.sdDamageRed_TextTotalLightning.html(DamageTypes.Lightning.getPointsTotalForStatsPage());
                pstats.sdDamageRed_TextTotalLightning.round();
            }, null, null, true, DamageTypes.Lightning.getCap());
            pstats.sdDamageRed_TextCPCapLightning = new myElement(createP("/" + DamageTypes.Lightning.getCap()), "shrinkablePStatsMainFivePieceP", pstats.sdDamageRed_MiniDivCPCapLightning);
            pstats.sdDamageRed_MiniDivCPCapLightning.style("display", "flex");
            pstats.sdDamageRed_MiniDivCPCapLightning.style("margin-top", "1px");
            pstats.sdDamageRed_InputCPCapLightning.style("max-width", "45%");
            pstats.sdDamageRed_InputCPCapLightning.style("min-width", "45%");
            pstats.sdDamageRed_InputCPCapLightning.style("text-align", "center");
            pstats.sdDamageRed_InputCPCapLightning.style("margin-top", "0");
            pstats.sdDamageRed_TextCPCapLightning.style("margin-top", "2px");

            pstats.sdDamageRed_TextGearLightning.roundDecimal();
            pstats.sdDamageRed_TextCPCapLightning.roundDecimal("", "/");

            // Acid
            pstats.sdDamageRed_TextNameAcid = new myElement(createP("Acid"), "shrinkablePStatsMainP", pstats.sdDamageRed_DivName);
            pstats.sdDamageRed_TextGearAcid = new myElement(createP(DamageTypes.Acid.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdDamageRed_DivGear);
            pstats.sdDamageRed_TextTotalAcid = new myElement(createP(DamageTypes.Acid.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdDamageRed_DivTotal);

            pstats.sdDamageRed_TextTotalAcid.round();

            pstats.sdDamageRed_MiniDivCPCapAcid = new myElement(createDiv(), "", pstats.sdDamageRed_DivCpCap);
            pstats.sdDamageRed_InputCPCapAcid = new myElement(createInput(DamageTypes.Acid.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdDamageRed_MiniDivCPCapAcid, null, () => {
                let x = parseInt(pstats.sdDamageRed_InputCPCapAcid.value());
                x = isNaN(x) ? 0 : x;
                DamageTypes.Acid.setCPCount(x);
                pstats.sdDamageRed_TextTotalAcid.html(DamageTypes.Acid.getPointsTotalForStatsPage());
                pstats.sdDamageRed_TextTotalAcid.round();
            }, null, null, true, DamageTypes.Acid.getCap());
            pstats.sdDamageRed_TextCPCapAcid = new myElement(createP("/" + DamageTypes.Acid.getCap()), "shrinkablePStatsMainFivePieceP", pstats.sdDamageRed_MiniDivCPCapAcid);
            pstats.sdDamageRed_MiniDivCPCapAcid.style("display", "flex");
            pstats.sdDamageRed_MiniDivCPCapAcid.style("margin-top", "1px");
            pstats.sdDamageRed_InputCPCapAcid.style("max-width", "45%");
            pstats.sdDamageRed_InputCPCapAcid.style("min-width", "45%");
            pstats.sdDamageRed_InputCPCapAcid.style("text-align", "center");
            pstats.sdDamageRed_InputCPCapAcid.style("margin-top", "0");
            pstats.sdDamageRed_TextCPCapAcid.style("margin-top", "2px");

            pstats.sdDamageRed_TextGearAcid.roundDecimal();
            pstats.sdDamageRed_TextCPCapAcid.roundDecimal("", "/");

            // Sonic
            pstats.sdDamageRed_TextNameSonic = new myElement(createP("Sonic"), "shrinkablePStatsMainP", pstats.sdDamageRed_DivName);
            pstats.sdDamageRed_TextGearSonic = new myElement(createP(DamageTypes.Sonic.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdDamageRed_DivGear);
            pstats.sdDamageRed_TextTotalSonic = new myElement(createP(DamageTypes.Sonic.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdDamageRed_DivTotal);

            pstats.sdDamageRed_TextTotalSonic.round();

            pstats.sdDamageRed_MiniDivCPCapSonic = new myElement(createDiv(), "", pstats.sdDamageRed_DivCpCap);
            pstats.sdDamageRed_InputCPCapSonic = new myElement(createInput(DamageTypes.Sonic.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdDamageRed_MiniDivCPCapSonic, null, () => {
                let x = parseInt(pstats.sdDamageRed_InputCPCapSonic.value());
                x = isNaN(x) ? 0 : x;
                DamageTypes.Sonic.setCPCount(x);
                pstats.sdDamageRed_TextTotalSonic.html(DamageTypes.Sonic.getPointsTotalForStatsPage());
                pstats.sdDamageRed_TextTotalSonic.round();
            }, null, null, true, DamageTypes.Sonic.getCap());
            pstats.sdDamageRed_TextCPCapSonic = new myElement(createP("/" + DamageTypes.Sonic.getCap()), "shrinkablePStatsMainFivePieceP", pstats.sdDamageRed_MiniDivCPCapSonic);
            pstats.sdDamageRed_MiniDivCPCapSonic.style("display", "flex");
            pstats.sdDamageRed_MiniDivCPCapSonic.style("margin-top", "1px");
            pstats.sdDamageRed_InputCPCapSonic.style("max-width", "45%");
            pstats.sdDamageRed_InputCPCapSonic.style("min-width", "45%");
            pstats.sdDamageRed_InputCPCapSonic.style("text-align", "center");
            pstats.sdDamageRed_InputCPCapSonic.style("margin-top", "0");
            pstats.sdDamageRed_TextCPCapSonic.style("margin-top", "2px");

            pstats.sdDamageRed_TextGearSonic.roundDecimal();
            pstats.sdDamageRed_TextCPCapSonic.roundDecimal("", "/");

            // Pos. Energy
            pstats.sdDamageRed_TextNamePosEnergy = new myElement(createP("Pos. Energy"), "shrinkablePStatsMainP", pstats.sdDamageRed_DivName);
            pstats.sdDamageRed_TextGearPosEnergy = new myElement(createP(DamageTypes.PosEnergy.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdDamageRed_DivGear);
            pstats.sdDamageRed_TextTotalPosEnergy = new myElement(createP(DamageTypes.PosEnergy.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdDamageRed_DivTotal);

            pstats.sdDamageRed_TextTotalPosEnergy.round();

            pstats.sdDamageRed_MiniDivCPCapPosEnergy = new myElement(createDiv(), "", pstats.sdDamageRed_DivCpCap);
            pstats.sdDamageRed_InputCPCapPosEnergy = new myElement(createInput(DamageTypes.PosEnergy.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdDamageRed_MiniDivCPCapPosEnergy, null, () => {
                let x = parseInt(pstats.sdDamageRed_InputCPCapPosEnergy.value());
                x = isNaN(x) ? 0 : x;
                DamageTypes.PosEnergy.setCPCount(x);
                pstats.sdDamageRed_TextTotalPosEnergy.html(DamageTypes.PosEnergy.getPointsTotalForStatsPage());
                pstats.sdDamageRed_TextTotalPosEnergy.round();
            }, null, null, true, DamageTypes.PosEnergy.getCap());
            pstats.sdDamageRed_TextCPCapPosEnergy = new myElement(createP("/" + DamageTypes.PosEnergy.getCap()), "shrinkablePStatsMainFivePieceP", pstats.sdDamageRed_MiniDivCPCapPosEnergy);
            pstats.sdDamageRed_MiniDivCPCapPosEnergy.style("display", "flex");
            pstats.sdDamageRed_MiniDivCPCapPosEnergy.style("margin-top", "1px");
            pstats.sdDamageRed_InputCPCapPosEnergy.style("max-width", "45%");
            pstats.sdDamageRed_InputCPCapPosEnergy.style("min-width", "45%");
            pstats.sdDamageRed_InputCPCapPosEnergy.style("text-align", "center");
            pstats.sdDamageRed_InputCPCapPosEnergy.style("margin-top", "0");
            pstats.sdDamageRed_TextCPCapPosEnergy.style("margin-top", "2px");

            pstats.sdDamageRed_TextGearPosEnergy.roundDecimal();
            pstats.sdDamageRed_TextCPCapPosEnergy.roundDecimal("", "/");

            // Neg. Energy
            pstats.sdDamageRed_TextNameNegEnergy = new myElement(createP("Neg. Energy"), "shrinkablePStatsMainP", pstats.sdDamageRed_DivName);
            pstats.sdDamageRed_TextGearNegEnergy = new myElement(createP(DamageTypes.NegEnergy.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdDamageRed_DivGear);
            pstats.sdDamageRed_TextTotalNegEnergy = new myElement(createP(DamageTypes.NegEnergy.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdDamageRed_DivTotal);

            pstats.sdDamageRed_TextTotalNegEnergy.round();

            pstats.sdDamageRed_MiniDivCPCapNegEnergy = new myElement(createDiv(), "", pstats.sdDamageRed_DivCpCap);
            pstats.sdDamageRed_InputCPCapNegEnergy = new myElement(createInput(DamageTypes.NegEnergy.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdDamageRed_MiniDivCPCapNegEnergy, null, () => {
                let x = parseInt(pstats.sdDamageRed_InputCPCapNegEnergy.value());
                x = isNaN(x) ? 0 : x;
                DamageTypes.NegEnergy.setCPCount(x);
                pstats.sdDamageRed_TextTotalNegEnergy.html(DamageTypes.NegEnergy.getPointsTotalForStatsPage());
                pstats.sdDamageRed_TextTotalNegEnergy.round();
            }, null, null, true, DamageTypes.NegEnergy.getCap());
            pstats.sdDamageRed_TextCPCapNegEnergy = new myElement(createP("/" + DamageTypes.NegEnergy.getCap()), "shrinkablePStatsMainFivePieceP", pstats.sdDamageRed_MiniDivCPCapNegEnergy);
            pstats.sdDamageRed_MiniDivCPCapNegEnergy.style("display", "flex");
            pstats.sdDamageRed_MiniDivCPCapNegEnergy.style("margin-top", "1px");
            pstats.sdDamageRed_InputCPCapNegEnergy.style("max-width", "45%");
            pstats.sdDamageRed_InputCPCapNegEnergy.style("min-width", "45%");
            pstats.sdDamageRed_InputCPCapNegEnergy.style("text-align", "center");
            pstats.sdDamageRed_InputCPCapNegEnergy.style("margin-top", "0");
            pstats.sdDamageRed_TextCPCapNegEnergy.style("margin-top", "2px");

            pstats.sdDamageRed_TextGearNegEnergy.roundDecimal();
            pstats.sdDamageRed_TextCPCapNegEnergy.roundDecimal("", "/");
        }
    });
    pstats.sdDamageRedText = new myElement(createP("+ Damage Reductions"), "shrinkableHeader", pstats.sdDamageRed);

    // Shrinkable VSEnviro
    pstats.sdVSEnviro = new myElement(createDiv(), "shrinkableDiv");
    pstats.sdVSEnviroCheckBox = new myElement(createInput("", "checkbox"), "shrinkableInputField", pstats.sdVSEnviro, null, () => {
        pstats.sdVSEnviroCheckBox.swapChecked(); // This is for updating the isChecked variable inside the element.
        let hidden = pstats.sdVSEnviroText.html().indexOf("+ Vs Environment") != -1 ? false : true;
        pstats.sdVSEnviroText.html((hidden ? "+ Vs Environment" : "- Vs Environment"));

        if (hidden) {
            openedSections[13] = 0;
            pstats.sdVSEnviroText.class("shrinkableHeader");

            Object.keys(pstats).forEach(function (key) {
                if (key.startsWith("sdVSEnviro") && key != "sdVSEnviro" && key != "sdVSEnviroCheckBox" && key != "sdVSEnviroText") {
                    pstats[key].remove();
                    delete pstats[key];
                }
            });
        }
        else {
            openedSections[13] = 1;
            pstats.sdVSEnviroText.class("shrinkableHeaderHidden");

            // Bottom of VSEnviro Info
            pstats.sdVSEnviro_DivVSEnviroStats = new myElement(createDiv(), "shrinkablePStatsMainBigSingularDiv", pstats.sdVSEnviro);
            pstats.sdVSEnviro_DivName = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivBig", pstats.sdVSEnviro_DivVSEnviroStats);
            pstats.sdVSEnviro_DivBase = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivLittle", pstats.sdVSEnviro_DivVSEnviroStats);
            pstats.sdVSEnviro_DivCpCap = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivLittle", pstats.sdVSEnviro_DivVSEnviroStats);
            pstats.sdVSEnviro_DivGear = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivLittle", pstats.sdVSEnviro_DivVSEnviroStats);
            pstats.sdVSEnviro_DivTotal = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivLittle", pstats.sdVSEnviro_DivVSEnviroStats);

            pstats.sdVSEnviro_TextHeaderName = new myElement(createP("Name"), "shrinkablePStatsMainLeftHeaderP", pstats.sdVSEnviro_DivName);
            pstats.sdVSEnviro_TextHeaderBase = new myElement(createP("Base"), "shrinkablePStatsMainCenterHeaderP", pstats.sdVSEnviro_DivBase);
            pstats.sdVSEnviro_TextHeaderCpCap = new myElement(createP("Cp/Cap"), "shrinkablePStatsMainCenterHeaderP", pstats.sdVSEnviro_DivCpCap);
            pstats.sdVSEnviro_TextHeaderGear = new myElement(createP("Gear"), "shrinkablePStatsMainCenterHeaderP", pstats.sdVSEnviro_DivGear);
            pstats.sdVSEnviro_TextHeaderTotal = new myElement(createP("Total"), "shrinkablePStatsMainCenterHeaderP", pstats.sdVSEnviro_DivTotal);

            pstats.sdVSEnviro_DivName.style("min-width", "30%");
            pstats.sdVSEnviro_DivCpCap.style("min-width", "25%");
            pstats.sdVSEnviro_DivCpCap.style("max-width", "25%");
            // Spot
            pstats.sdVSEnviro_TextNameSpot = new myElement(createP("Spot"), "shrinkablePStatsMainP", pstats.sdVSEnviro_DivName);
            pstats.sdVSEnviro_TextBaseSpot = new myElement(createP(VSEnvironments.Spot.getPointsBase()), "shrinkablePStatsMainFivePieceP", pstats.sdVSEnviro_DivBase);
            pstats.sdVSEnviro_TextGearSpot = new myElement(createP(VSEnvironments.Spot.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdVSEnviro_DivGear);
            pstats.sdVSEnviro_TextTotalSpot = new myElement(createP(VSEnvironments.Spot.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdVSEnviro_DivTotal);

            pstats.sdVSEnviro_TextTotalSpot.round();

            pstats.sdVSEnviro_MiniDivCPCapSpot = new myElement(createDiv(), "", pstats.sdVSEnviro_DivCpCap);
            pstats.sdVSEnviro_InputCPCapSpot = new myElement(createInput(VSEnvironments.Spot.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdVSEnviro_MiniDivCPCapSpot, null, () => {
                let x = parseInt(pstats.sdVSEnviro_InputCPCapSpot.value());
                x = isNaN(x) ? 0 : x;
                VSEnvironments.Spot.setCPCount(x);
                pstats.sdVSEnviro_TextTotalSpot.html(VSEnvironments.Spot.getPointsTotalForStatsPage());
                pstats.sdVSEnviro_TextTotalSpot.round();
            }, null, null, true, VSEnvironments.Spot.getCap());
            pstats.sdVSEnviro_TextCPCapSpot = new myElement(createP("/" + VSEnvironments.Spot.getCap()), "shrinkablePStatsMainFivePieceP", pstats.sdVSEnviro_MiniDivCPCapSpot);
            pstats.sdVSEnviro_MiniDivCPCapSpot.style("display", "flex");
            pstats.sdVSEnviro_InputCPCapSpot.style("max-width", "45%");
            pstats.sdVSEnviro_InputCPCapSpot.style("min-width", "45%");
            pstats.sdVSEnviro_InputCPCapSpot.style("text-align", "center");
            pstats.sdVSEnviro_InputCPCapSpot.style("margin-top", "0");
            pstats.sdVSEnviro_TextCPCapSpot.style("margin-top", "2px");

            pstats.sdVSEnviro_TextBaseSpot.roundDecimal();
            pstats.sdVSEnviro_TextGearSpot.roundDecimal();
            pstats.sdVSEnviro_TextCPCapSpot.roundDecimal("", "/");

            // Listen
            pstats.sdVSEnviro_TextNameListen = new myElement(createP("Listen"), "shrinkablePStatsMainP", pstats.sdVSEnviro_DivName);
            pstats.sdVSEnviro_TextBaseListen = new myElement(createP(VSEnvironments.Listen.getPointsBase()), "shrinkablePStatsMainFivePieceP", pstats.sdVSEnviro_DivBase);
            pstats.sdVSEnviro_TextGearListen = new myElement(createP(VSEnvironments.Listen.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdVSEnviro_DivGear);
            pstats.sdVSEnviro_TextTotalListen = new myElement(createP(VSEnvironments.Listen.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdVSEnviro_DivTotal);

            pstats.sdVSEnviro_TextTotalListen.round();

            pstats.sdVSEnviro_MiniDivCPCapListen = new myElement(createDiv(), "", pstats.sdVSEnviro_DivCpCap);
            pstats.sdVSEnviro_InputCPCapListen = new myElement(createInput(VSEnvironments.Listen.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdVSEnviro_MiniDivCPCapListen, null, () => {
                let x = parseInt(pstats.sdVSEnviro_InputCPCapListen.value());
                x = isNaN(x) ? 0 : x;
                VSEnvironments.Listen.setCPCount(x);
                pstats.sdVSEnviro_TextTotalListen.html(VSEnvironments.Listen.getPointsTotalForStatsPage());
                pstats.sdVSEnviro_TextTotalListen.round();
            }, null, null, true, VSEnvironments.Listen.getCap());
            pstats.sdVSEnviro_TextCPCapListen = new myElement(createP("/" + VSEnvironments.Listen.getCap()), "shrinkablePStatsMainFivePieceP", pstats.sdVSEnviro_MiniDivCPCapListen);
            pstats.sdVSEnviro_MiniDivCPCapListen.style("display", "flex");
            pstats.sdVSEnviro_InputCPCapListen.style("max-width", "45%");
            pstats.sdVSEnviro_InputCPCapListen.style("min-width", "45%");
            pstats.sdVSEnviro_InputCPCapListen.style("text-align", "center");
            pstats.sdVSEnviro_InputCPCapListen.style("margin-top", "0");
            pstats.sdVSEnviro_TextCPCapListen.style("margin-top", "2px");

            pstats.sdVSEnviro_TextBaseListen.roundDecimal();
            pstats.sdVSEnviro_TextGearListen.roundDecimal();
            pstats.sdVSEnviro_TextCPCapListen.roundDecimal("", "/");

            // Scent
            pstats.sdVSEnviro_TextNameScent = new myElement(createP("Scent"), "shrinkablePStatsMainP", pstats.sdVSEnviro_DivName);
            pstats.sdVSEnviro_TextBaseScent = new myElement(createP(VSEnvironments.Scent.getPointsBase()), "shrinkablePStatsMainFivePieceP", pstats.sdVSEnviro_DivBase);
            pstats.sdVSEnviro_TextGearScent = new myElement(createP(VSEnvironments.Scent.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdVSEnviro_DivGear);
            pstats.sdVSEnviro_TextTotalScent = new myElement(createP(VSEnvironments.Scent.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdVSEnviro_DivTotal);

            pstats.sdVSEnviro_TextTotalScent.round();

            pstats.sdVSEnviro_MiniDivCPCapScent = new myElement(createDiv(), "", pstats.sdVSEnviro_DivCpCap);
            pstats.sdVSEnviro_InputCPCapScent = new myElement(createInput(VSEnvironments.Scent.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdVSEnviro_MiniDivCPCapScent, null, () => {
                let x = parseInt(pstats.sdVSEnviro_InputCPCapScent.value());
                x = isNaN(x) ? 0 : x;
                VSEnvironments.Scent.setCPCount(x);
                pstats.sdVSEnviro_TextTotalScent.html(VSEnvironments.Scent.getPointsTotalForStatsPage());
                pstats.sdVSEnviro_TextTotalScent.round();
            }, null, null, true, VSEnvironments.Scent.getCap());
            pstats.sdVSEnviro_TextCPCapScent = new myElement(createP("/" + VSEnvironments.Scent.getCap()), "shrinkablePStatsMainFivePieceP", pstats.sdVSEnviro_MiniDivCPCapScent);
            pstats.sdVSEnviro_MiniDivCPCapScent.style("display", "flex");
            pstats.sdVSEnviro_InputCPCapScent.style("max-width", "45%");
            pstats.sdVSEnviro_InputCPCapScent.style("min-width", "45%");
            pstats.sdVSEnviro_InputCPCapScent.style("text-align", "center");
            pstats.sdVSEnviro_InputCPCapScent.style("margin-top", "0");
            pstats.sdVSEnviro_TextCPCapScent.style("margin-top", "2px");

            pstats.sdVSEnviro_TextBaseScent.roundDecimal();
            pstats.sdVSEnviro_TextGearScent.roundDecimal();
            pstats.sdVSEnviro_TextCPCapScent.roundDecimal("", "/");

            // Breathe
            pstats.sdVSEnviro_TextNameBreathe = new myElement(createP("Breathe"), "shrinkablePStatsMainP", pstats.sdVSEnviro_DivName);
            pstats.sdVSEnviro_TextBaseBreathe = new myElement(createP(VSEnvironments.Breathe.getPointsBase()), "shrinkablePStatsMainFivePieceP", pstats.sdVSEnviro_DivBase);
            pstats.sdVSEnviro_TextGearBreathe = new myElement(createP(VSEnvironments.Breathe.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdVSEnviro_DivGear);
            pstats.sdVSEnviro_TextTotalBreathe = new myElement(createP(VSEnvironments.Breathe.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdVSEnviro_DivTotal);

            pstats.sdVSEnviro_TextTotalBreathe.round();

            pstats.sdVSEnviro_MiniDivCPCapBreathe = new myElement(createDiv(), "", pstats.sdVSEnviro_DivCpCap);
            pstats.sdVSEnviro_InputCPCapBreathe = new myElement(createInput(VSEnvironments.Breathe.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdVSEnviro_MiniDivCPCapBreathe, null, () => {
                let x = parseInt(pstats.sdVSEnviro_InputCPCapBreathe.value());
                x = isNaN(x) ? 0 : x;
                VSEnvironments.Breathe.setCPCount(x);
                pstats.sdVSEnviro_TextTotalBreathe.html(VSEnvironments.Breathe.getPointsTotalForStatsPage());
                pstats.sdVSEnviro_TextTotalBreathe.round();
            }, null, null, true, VSEnvironments.Breathe.getCap());
            pstats.sdVSEnviro_TextCPCapBreathe = new myElement(createP("/" + VSEnvironments.Breathe.getCap().toFixed(2)), "shrinkablePStatsMainFivePieceP", pstats.sdVSEnviro_MiniDivCPCapBreathe);
            pstats.sdVSEnviro_MiniDivCPCapBreathe.style("display", "flex");
            pstats.sdVSEnviro_InputCPCapBreathe.style("max-width", "45%");
            pstats.sdVSEnviro_InputCPCapBreathe.style("min-width", "45%");
            pstats.sdVSEnviro_InputCPCapBreathe.style("text-align", "center");
            pstats.sdVSEnviro_InputCPCapBreathe.style("margin-top", "0");
            pstats.sdVSEnviro_TextCPCapBreathe.style("margin-top", "2px");

            pstats.sdVSEnviro_TextBaseBreathe.roundDecimal();
            pstats.sdVSEnviro_TextGearBreathe.roundDecimal();
            pstats.sdVSEnviro_TextCPCapBreathe.roundDecimal("", "/");

            // EnvHot
            pstats.sdVSEnviro_TextNameEnvHot = new myElement(createP("Env. Hot"), "shrinkablePStatsMainP", pstats.sdVSEnviro_DivName);
            pstats.sdVSEnviro_TextBaseEnvHot = new myElement(createP(VSEnvironments.EnvHot.getPointsBase()), "shrinkablePStatsMainFivePieceP", pstats.sdVSEnviro_DivBase);
            pstats.sdVSEnviro_TextGearEnvHot = new myElement(createP(VSEnvironments.EnvHot.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdVSEnviro_DivGear);
            pstats.sdVSEnviro_TextTotalEnvHot = new myElement(createP(VSEnvironments.EnvHot.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdVSEnviro_DivTotal);

            pstats.sdVSEnviro_TextTotalEnvHot.round();

            pstats.sdVSEnviro_MiniDivCPCapEnvHot = new myElement(createDiv(), "", pstats.sdVSEnviro_DivCpCap);
            pstats.sdVSEnviro_InputCPCapEnvHot = new myElement(createInput(VSEnvironments.EnvHot.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdVSEnviro_MiniDivCPCapEnvHot, null, () => {
                let x = parseInt(pstats.sdVSEnviro_InputCPCapEnvHot.value());
                x = isNaN(x) ? 0 : x;
                VSEnvironments.EnvHot.setCPCount(x);
                pstats.sdVSEnviro_TextTotalEnvHot.html(VSEnvironments.EnvHot.getPointsTotalForStatsPage());
                pstats.sdVSEnviro_TextTotalEnvHot.round();
            }, null, null, true, VSEnvironments.EnvHot.getCap());
            pstats.sdVSEnviro_TextCPCapEnvHot = new myElement(createP("/" + VSEnvironments.EnvHot.getCap().toFixed(2)), "shrinkablePStatsMainFivePieceP", pstats.sdVSEnviro_MiniDivCPCapEnvHot);
            pstats.sdVSEnviro_MiniDivCPCapEnvHot.style("display", "flex");
            pstats.sdVSEnviro_InputCPCapEnvHot.style("max-width", "45%");
            pstats.sdVSEnviro_InputCPCapEnvHot.style("min-width", "45%");
            pstats.sdVSEnviro_InputCPCapEnvHot.style("text-align", "center");
            pstats.sdVSEnviro_InputCPCapEnvHot.style("margin-top", "0");
            pstats.sdVSEnviro_TextCPCapEnvHot.style("margin-top", "2px");

            pstats.sdVSEnviro_TextBaseEnvHot.roundDecimal();
            pstats.sdVSEnviro_TextGearEnvHot.roundDecimal();
            pstats.sdVSEnviro_TextCPCapEnvHot.roundDecimal("", "/");

            // EnvCold
            pstats.sdVSEnviro_TextNameEnvCold = new myElement(createP("Env. Cold"), "shrinkablePStatsMainP", pstats.sdVSEnviro_DivName);
            pstats.sdVSEnviro_TextBaseEnvCold = new myElement(createP(VSEnvironments.EnvCold.getPointsBase()), "shrinkablePStatsMainFivePieceP", pstats.sdVSEnviro_DivBase);
            pstats.sdVSEnviro_TextGearEnvCold = new myElement(createP(VSEnvironments.EnvCold.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdVSEnviro_DivGear);
            pstats.sdVSEnviro_TextTotalEnvCold = new myElement(createP(VSEnvironments.EnvCold.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdVSEnviro_DivTotal);

            pstats.sdVSEnviro_TextTotalEnvCold.round();

            pstats.sdVSEnviro_MiniDivCPCapEnvCold = new myElement(createDiv(), "", pstats.sdVSEnviro_DivCpCap);
            pstats.sdVSEnviro_InputCPCapEnvCold = new myElement(createInput(VSEnvironments.EnvCold.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdVSEnviro_MiniDivCPCapEnvCold, null, () => {
                let x = parseInt(pstats.sdVSEnviro_InputCPCapEnvCold.value());
                x = isNaN(x) ? 0 : x;
                VSEnvironments.EnvCold.setCPCount(x);
                pstats.sdVSEnviro_TextTotalEnvCold.html(VSEnvironments.EnvCold.getPointsTotalForStatsPage());
                pstats.sdVSEnviro_TextTotalEnvCold.round();
            }, null, null, true, VSEnvironments.EnvCold.getCap());
            pstats.sdVSEnviro_TextCPCapEnvCold = new myElement(createP("/" + VSEnvironments.EnvCold.getCap().toFixed(2)), "shrinkablePStatsMainFivePieceP", pstats.sdVSEnviro_MiniDivCPCapEnvCold);
            pstats.sdVSEnviro_MiniDivCPCapEnvCold.style("display", "flex");
            pstats.sdVSEnviro_InputCPCapEnvCold.style("max-width", "45%");
            pstats.sdVSEnviro_InputCPCapEnvCold.style("min-width", "45%");
            pstats.sdVSEnviro_InputCPCapEnvCold.style("text-align", "center");
            pstats.sdVSEnviro_InputCPCapEnvCold.style("margin-top", "0");
            pstats.sdVSEnviro_TextCPCapEnvCold.style("margin-top", "2px");

            pstats.sdVSEnviro_TextBaseEnvCold.roundDecimal();
            pstats.sdVSEnviro_TextGearEnvCold.roundDecimal();
            pstats.sdVSEnviro_TextCPCapEnvCold.roundDecimal("", "/");

            // Surprise
            pstats.sdVSEnviro_TextNameSurprise = new myElement(createP("Surprise"), "shrinkablePStatsMainP", pstats.sdVSEnviro_DivName);
            pstats.sdVSEnviro_TextBaseSurprise = new myElement(createP(VSEnvironments.Surprise.getPointsBase()), "shrinkablePStatsMainFivePieceP", pstats.sdVSEnviro_DivBase);
            pstats.sdVSEnviro_TextGearSurprise = new myElement(createP(VSEnvironments.Surprise.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdVSEnviro_DivGear);
            pstats.sdVSEnviro_TextTotalSurprise = new myElement(createP(VSEnvironments.Surprise.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdVSEnviro_DivTotal);

            pstats.sdVSEnviro_TextTotalSurprise.round();

            pstats.sdVSEnviro_MiniDivCPCapSurprise = new myElement(createDiv(), "", pstats.sdVSEnviro_DivCpCap);
            pstats.sdVSEnviro_InputCPCapSurprise = new myElement(createInput(VSEnvironments.Surprise.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdVSEnviro_MiniDivCPCapSurprise, null, () => {
                let x = parseInt(pstats.sdVSEnviro_InputCPCapSurprise.value());
                x = isNaN(x) ? 0 : x;
                VSEnvironments.Surprise.setCPCount(x);
                pstats.sdVSEnviro_TextTotalSurprise.html(VSEnvironments.Surprise.getPointsTotalForStatsPage());
                pstats.sdVSEnviro_TextTotalSurprise.round();
            }, null, null, true, VSEnvironments.Surprise.getCap());
            pstats.sdVSEnviro_TextCPCapSurprise = new myElement(createP("/" + VSEnvironments.Surprise.getCap()), "shrinkablePStatsMainFivePieceP", pstats.sdVSEnviro_MiniDivCPCapSurprise);
            pstats.sdVSEnviro_MiniDivCPCapSurprise.style("display", "flex");
            pstats.sdVSEnviro_InputCPCapSurprise.style("max-width", "45%");
            pstats.sdVSEnviro_InputCPCapSurprise.style("min-width", "45%");
            pstats.sdVSEnviro_InputCPCapSurprise.style("text-align", "center");
            pstats.sdVSEnviro_InputCPCapSurprise.style("margin-top", "0");
            pstats.sdVSEnviro_TextCPCapSurprise.style("margin-top", "2px");

            pstats.sdVSEnviro_TextBaseSurprise.roundDecimal();
            pstats.sdVSEnviro_TextGearSurprise.roundDecimal();
            pstats.sdVSEnviro_TextCPCapSurprise.roundDecimal("", "/");

            // Traps
            pstats.sdVSEnviro_TextNameTraps = new myElement(createP("Traps"), "shrinkablePStatsMainP", pstats.sdVSEnviro_DivName);
            pstats.sdVSEnviro_TextBaseTraps = new myElement(createP(VSEnvironments.Traps.getPointsBase()), "shrinkablePStatsMainFivePieceP", pstats.sdVSEnviro_DivBase);
            pstats.sdVSEnviro_TextGearTraps = new myElement(createP(VSEnvironments.Traps.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdVSEnviro_DivGear);
            pstats.sdVSEnviro_TextTotalTraps = new myElement(createP(VSEnvironments.Traps.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdVSEnviro_DivTotal);

            pstats.sdVSEnviro_TextTotalTraps.round();

            pstats.sdVSEnviro_MiniDivCPCapTraps = new myElement(createDiv(), "", pstats.sdVSEnviro_DivCpCap);
            pstats.sdVSEnviro_InputCPCapTraps = new myElement(createInput(VSEnvironments.Traps.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdVSEnviro_MiniDivCPCapTraps, null, () => {
                let x = parseInt(pstats.sdVSEnviro_InputCPCapTraps.value());
                x = isNaN(x) ? 0 : x;
                VSEnvironments.Traps.setCPCount(x);
                pstats.sdVSEnviro_TextTotalTraps.html(VSEnvironments.Traps.getPointsTotalForStatsPage());
                pstats.sdVSEnviro_TextTotalTraps.round();
            }, null, null, true, VSEnvironments.Traps.getCap());
            pstats.sdVSEnviro_TextCPCapTraps = new myElement(createP("/" + VSEnvironments.Traps.getCap()), "shrinkablePStatsMainFivePieceP", pstats.sdVSEnviro_MiniDivCPCapTraps);
            pstats.sdVSEnviro_MiniDivCPCapTraps.style("display", "flex");
            pstats.sdVSEnviro_InputCPCapTraps.style("max-width", "45%");
            pstats.sdVSEnviro_InputCPCapTraps.style("min-width", "45%");
            pstats.sdVSEnviro_InputCPCapTraps.style("text-align", "center");
            pstats.sdVSEnviro_InputCPCapTraps.style("margin-top", "0");
            pstats.sdVSEnviro_TextCPCapTraps.style("margin-top", "2px");

            pstats.sdVSEnviro_TextBaseTraps.roundDecimal();
            pstats.sdVSEnviro_TextGearTraps.roundDecimal();
            pstats.sdVSEnviro_TextCPCapTraps.roundDecimal("", "/");
        }
    });
    pstats.sdVSEnviroText = new myElement(createP("+ Vs Environment"), "shrinkableHeader", pstats.sdVSEnviro);

    // Shrinkable Movement
    pstats.sdMovement = new myElement(createDiv(), "shrinkableDiv");
    pstats.sdMovementCheckBox = new myElement(createInput("", "checkbox"), "shrinkableInputField", pstats.sdMovement, null, () => {
        pstats.sdMovementCheckBox.swapChecked(); // This is for updating the isChecked variable inside the element.
        let hidden = pstats.sdMovementText.html().indexOf("+ Movement") != -1 ? false : true;
        pstats.sdMovementText.html((hidden ? "+ Movement" : "- Movement"));

        if (hidden) {
            openedSections[14] = 0;
            pstats.sdMovementText.class("shrinkableHeader");

            Object.keys(pstats).forEach(function (key) {
                if (key.startsWith("sdMovement") && key != "sdMovement" && key != "sdMovementCheckBox" && key != "sdMovementText") {
                    pstats[key].remove();
                    delete pstats[key];
                }
            });
        }
        else {
            openedSections[14] = 1;
            pstats.sdMovementText.class("shrinkableHeaderHidden");

            // Bottom of Movement Info
            pstats.sdMovement_DivMovementStats = new myElement(createDiv(), "shrinkablePStatsMainBigSingularDiv", pstats.sdMovement);
            pstats.sdMovement_DivName = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivBig", pstats.sdMovement_DivMovementStats);
            pstats.sdMovement_DivBase = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivLittle", pstats.sdMovement_DivMovementStats);
            pstats.sdMovement_DivCpCap = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivLittle", pstats.sdMovement_DivMovementStats);
            pstats.sdMovement_DivGear = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivLittle", pstats.sdMovement_DivMovementStats);
            pstats.sdMovement_DivTotal = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivLittle", pstats.sdMovement_DivMovementStats);

            pstats.sdMovement_TextHeaderName = new myElement(createP("Name"), "shrinkablePStatsMainLeftHeaderP", pstats.sdMovement_DivName);
            pstats.sdMovement_TextHeaderBase = new myElement(createP("Base"), "shrinkablePStatsMainCenterHeaderP", pstats.sdMovement_DivBase);
            pstats.sdMovement_TextHeaderCpCap = new myElement(createP("Cp/Cap"), "shrinkablePStatsMainCenterHeaderP", pstats.sdMovement_DivCpCap);
            pstats.sdMovement_TextHeaderGear = new myElement(createP("Gear"), "shrinkablePStatsMainCenterHeaderP", pstats.sdMovement_DivGear);
            pstats.sdMovement_TextHeaderTotal = new myElement(createP("Total"), "shrinkablePStatsMainCenterHeaderP", pstats.sdMovement_DivTotal);

            pstats.sdMovement_DivName.style("min-width", "30%");
            pstats.sdMovement_DivCpCap.style("min-width", "25%");
            pstats.sdMovement_DivCpCap.style("max-width", "25%");
            // Ground
            pstats.sdMovement_TextNameGround = new myElement(createP("Ground"), "shrinkablePStatsMainP", pstats.sdMovement_DivName);
            pstats.sdMovement_TextBaseGround = new myElement(createP(mainChar.stats.movements.ground.getPointsBase() + "ft"), "shrinkablePStatsMainFivePieceP", pstats.sdMovement_DivBase);
            pstats.sdMovement_TextGearGround = new myElement(createP(mainChar.stats.movements.ground.getGearModifier() + "ft"), "shrinkablePStatsMainFivePieceP", pstats.sdMovement_DivGear);
            pstats.sdMovement_TextTotalGround = new myElement(createP(mainChar.stats.movements.ground.getPointsTotalForStatsPage() + "ft"), "shrinkablePStatsMainFivePieceP", pstats.sdMovement_DivTotal);

            pstats.sdMovement_TextBaseGround.round("ft");
            pstats.sdMovement_TextGearGround.roundDecimal("ft");
            pstats.sdMovement_TextTotalGround.roundToNearestFive("ft");

            pstats.sdMovement_MiniDivCPCapGround = new myElement(createDiv(), "", pstats.sdMovement_DivCpCap);
            pstats.sdMovement_InputCPCapGround = new myElement(createInput(mainChar.stats.movements.ground.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdMovement_MiniDivCPCapGround, null, () => {
                let x = parseInt(pstats.sdMovement_InputCPCapGround.value());
                x = isNaN(x) ? 0 : x;
                mainChar.stats.movements.ground.setCPCount(x);
                pstats.sdMovement_TextTotalGround.html(mainChar.stats.movements.ground.getPointsTotalForStatsPage() + "ft");
                pstats.sdMovement_TextTotalGround.roundToNearestFive("ft");
            }, null, null, true, mainChar.stats.movements.ground.getCap());
            pstats.sdMovement_TextCPCapGround = new myElement(createP("/" + Math.round(mainChar.stats.movements.ground.getCap())), "shrinkablePStatsMainFivePieceP", pstats.sdMovement_MiniDivCPCapGround);
            pstats.sdMovement_MiniDivCPCapGround.style("display", "flex");
            pstats.sdMovement_InputCPCapGround.style("max-width", "45%");
            pstats.sdMovement_InputCPCapGround.style("min-width", "45%");
            pstats.sdMovement_InputCPCapGround.style("text-align", "center");
            pstats.sdMovement_InputCPCapGround.style("margin-top", "0");
            pstats.sdMovement_TextCPCapGround.style("margin-top", "2px");
            // Swim
            pstats.sdMovement_TextNameSwim = new myElement(createP("Swim"), "shrinkablePStatsMainP", pstats.sdMovement_DivName);
            pstats.sdMovement_TextBaseSwim = new myElement(createP(mainChar.stats.movements.swim.getPointsBase() + "ft"), "shrinkablePStatsMainFivePieceP", pstats.sdMovement_DivBase);
            pstats.sdMovement_TextGearSwim = new myElement(createP(mainChar.stats.movements.swim.getGearModifier() + "ft"), "shrinkablePStatsMainFivePieceP", pstats.sdMovement_DivGear);
            pstats.sdMovement_TextTotalSwim = new myElement(createP(mainChar.stats.movements.swim.getPointsTotalForStatsPage() + "ft"), "shrinkablePStatsMainFivePieceP", pstats.sdMovement_DivTotal);

            pstats.sdMovement_TextBaseSwim.round("ft");
            pstats.sdMovement_TextGearSwim.roundDecimal("ft");
            pstats.sdMovement_TextTotalSwim.roundToNearestFive("ft");

            pstats.sdMovement_MiniDivCPCapSwim = new myElement(createDiv(), "", pstats.sdMovement_DivCpCap);
            pstats.sdMovement_InputCPCapSwim = new myElement(createInput(mainChar.stats.movements.swim.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdMovement_MiniDivCPCapSwim, null, () => {
                let x = parseInt(pstats.sdMovement_InputCPCapSwim.value());
                x = isNaN(x) ? 0 : x;
                mainChar.stats.movements.swim.setCPCount(x);
                pstats.sdMovement_TextTotalSwim.html(mainChar.stats.movements.swim.getPointsTotalForStatsPage() + "ft");
                pstats.sdMovement_TextTotalSwim.roundToNearestFive("ft");
            }, null, null, true, mainChar.stats.movements.swim.getCap());
            pstats.sdMovement_TextCPCapSwim = new myElement(createP("/" + Math.round(mainChar.stats.movements.swim.getCap())), "shrinkablePStatsMainFivePieceP", pstats.sdMovement_MiniDivCPCapSwim);
            pstats.sdMovement_MiniDivCPCapSwim.style("display", "flex");
            pstats.sdMovement_InputCPCapSwim.style("max-width", "45%");
            pstats.sdMovement_InputCPCapSwim.style("min-width", "45%");
            pstats.sdMovement_InputCPCapSwim.style("text-align", "center");
            pstats.sdMovement_InputCPCapSwim.style("margin-top", "0");
            pstats.sdMovement_TextCPCapSwim.style("margin-top", "2px");
            // Climb
            pstats.sdMovement_TextNameClimb = new myElement(createP("Climb"), "shrinkablePStatsMainP", pstats.sdMovement_DivName);
            pstats.sdMovement_TextBaseClimb = new myElement(createP(mainChar.stats.movements.climb.getPointsBase() + "ft"), "shrinkablePStatsMainFivePieceP", pstats.sdMovement_DivBase);
            pstats.sdMovement_TextGearClimb = new myElement(createP(mainChar.stats.movements.climb.getGearModifier() + "ft"), "shrinkablePStatsMainFivePieceP", pstats.sdMovement_DivGear);
            pstats.sdMovement_TextTotalClimb = new myElement(createP(mainChar.stats.movements.climb.getPointsTotalForStatsPage() + "ft"), "shrinkablePStatsMainFivePieceP", pstats.sdMovement_DivTotal);

            pstats.sdMovement_TextBaseClimb.round("ft");
            pstats.sdMovement_TextGearClimb.roundDecimal("ft");
            pstats.sdMovement_TextTotalClimb.roundToNearestFive("ft");

            pstats.sdMovement_MiniDivCPCapClimb = new myElement(createDiv(), "", pstats.sdMovement_DivCpCap);
            pstats.sdMovement_InputCPCapClimb = new myElement(createInput(mainChar.stats.movements.climb.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdMovement_MiniDivCPCapClimb, null, () => {
                let x = parseInt(pstats.sdMovement_InputCPCapClimb.value());
                x = isNaN(x) ? 0 : x;
                mainChar.stats.movements.climb.setCPCount(x);
                pstats.sdMovement_TextTotalClimb.html(mainChar.stats.movements.climb.getPointsTotalForStatsPage() + "ft");
                pstats.sdMovement_TextTotalClimb.roundToNearestFive("ft");
            }, null, null, true, mainChar.stats.movements.climb.getCap());
            pstats.sdMovement_TextCPCapClimb = new myElement(createP("/" + Math.round(mainChar.stats.movements.climb.getCap())), "shrinkablePStatsMainFivePieceP", pstats.sdMovement_MiniDivCPCapClimb);
            pstats.sdMovement_MiniDivCPCapClimb.style("display", "flex");
            pstats.sdMovement_InputCPCapClimb.style("max-width", "45%");
            pstats.sdMovement_InputCPCapClimb.style("min-width", "45%");
            pstats.sdMovement_InputCPCapClimb.style("text-align", "center");
            pstats.sdMovement_InputCPCapClimb.style("margin-top", "0");
            pstats.sdMovement_TextCPCapClimb.style("margin-top", "2px");
            // Jump
            pstats.sdMovement_TextNameJump = new myElement(createP("Jump"), "shrinkablePStatsMainP", pstats.sdMovement_DivName);
            pstats.sdMovement_TextBaseJump = new myElement(createP(mainChar.stats.movements.jump.getPointsBase() + "ft"), "shrinkablePStatsMainFivePieceP", pstats.sdMovement_DivBase);
            pstats.sdMovement_TextGearJump = new myElement(createP(mainChar.stats.movements.jump.getGearModifier() + "ft"), "shrinkablePStatsMainFivePieceP", pstats.sdMovement_DivGear);
            pstats.sdMovement_TextTotalJump = new myElement(createP(mainChar.stats.movements.jump.getPointsTotalForStatsPage() + "ft"), "shrinkablePStatsMainFivePieceP", pstats.sdMovement_DivTotal);

            pstats.sdMovement_TextBaseJump.round("ft");
            pstats.sdMovement_TextGearJump.roundDecimal("ft");
            pstats.sdMovement_TextTotalJump.roundToNearestFive("ft");

            pstats.sdMovement_MiniDivCPCapJump = new myElement(createDiv(), "", pstats.sdMovement_DivCpCap);
            pstats.sdMovement_InputCPCapJump = new myElement(createInput(mainChar.stats.movements.jump.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdMovement_MiniDivCPCapJump, null, () => {
                let x = parseInt(pstats.sdMovement_InputCPCapJump.value());
                x = isNaN(x) ? 0 : x;
                mainChar.stats.movements.jump.setCPCount(x);
                pstats.sdMovement_TextTotalJump.html(mainChar.stats.movements.jump.getPointsTotalForStatsPage() + "ft");
                pstats.sdMovement_TextTotalJump.roundToNearestFive("ft");
            }, null, null, true, mainChar.stats.movements.jump.getCap());
            pstats.sdMovement_TextCPCapJump = new myElement(createP("/" + Math.round(mainChar.stats.movements.jump.getCap())), "shrinkablePStatsMainFivePieceP", pstats.sdMovement_MiniDivCPCapJump);
            pstats.sdMovement_MiniDivCPCapJump.style("display", "flex");
            pstats.sdMovement_InputCPCapJump.style("max-width", "45%");
            pstats.sdMovement_InputCPCapJump.style("min-width", "45%");
            pstats.sdMovement_InputCPCapJump.style("text-align", "center");
            pstats.sdMovement_InputCPCapJump.style("margin-top", "0");
            pstats.sdMovement_TextCPCapJump.style("margin-top", "2px");
            // Burrow
            pstats.sdMovement_TextNameBurrow = new myElement(createP("Burrow"), "shrinkablePStatsMainP", pstats.sdMovement_DivName);
            pstats.sdMovement_TextBaseBurrow = new myElement(createP("n/a"), "shrinkablePStatsMainFivePieceP", pstats.sdMovement_DivBase);
            pstats.sdMovement_TextGearBurrow = new myElement(createP(mainChar.stats.movements.burrow.getGearModifier() + "ft"), "shrinkablePStatsMainFivePieceP", pstats.sdMovement_DivGear);
            pstats.sdMovement_TextTotalBurrow = new myElement(createP(mainChar.stats.movements.burrow.getPointsTotalForStatsPage() + "ft"), "shrinkablePStatsMainFivePieceP", pstats.sdMovement_DivTotal);

            pstats.sdMovement_TextBaseBurrow.round("ft");
            pstats.sdMovement_TextGearBurrow.roundDecimal("ft");
            pstats.sdMovement_TextTotalBurrow.roundToNearestFive("ft");

            pstats.sdMovement_MiniDivCPCapBurrow = new myElement(createDiv(), "", pstats.sdMovement_DivCpCap);
            pstats.sdMovement_InputCPCapBurrow = new myElement(createInput(mainChar.stats.movements.burrow.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdMovement_MiniDivCPCapBurrow, null, () => {
                let x = parseInt(pstats.sdMovement_InputCPCapBurrow.value());
                x = isNaN(x) ? 0 : x;
                mainChar.stats.movements.burrow.setCPCount(x);
                pstats.sdMovement_TextTotalBurrow.html(mainChar.stats.movements.burrow.getPointsTotalForStatsPage() + "ft");
                pstats.sdMovement_TextTotalBurrow.roundToNearestFive("ft");
            }, null, null, true, mainChar.stats.movements.burrow.getCap());
            pstats.sdMovement_TextCPCapBurrow = new myElement(createP("/" + Math.round(mainChar.stats.movements.burrow.getCap())), "shrinkablePStatsMainFivePieceP", pstats.sdMovement_MiniDivCPCapBurrow);
            pstats.sdMovement_MiniDivCPCapBurrow.style("display", "flex");
            pstats.sdMovement_InputCPCapBurrow.style("max-width", "45%");
            pstats.sdMovement_InputCPCapBurrow.style("min-width", "45%");
            pstats.sdMovement_InputCPCapBurrow.style("text-align", "center");
            pstats.sdMovement_InputCPCapBurrow.style("margin-top", "0");
            pstats.sdMovement_TextCPCapBurrow.style("margin-top", "2px");
            // Flight
            pstats.sdMovement_TextNameFlight = new myElement(createP("Flight"), "shrinkablePStatsMainP", pstats.sdMovement_DivName);
            pstats.sdMovement_TextBaseFlight = new myElement(createP("n/a"), "shrinkablePStatsMainFivePieceP", pstats.sdMovement_DivBase);
            pstats.sdMovement_TextGearFlight = new myElement(createP(mainChar.stats.movements.flight.getGearModifier() + "ft"), "shrinkablePStatsMainFivePieceP", pstats.sdMovement_DivGear);
            pstats.sdMovement_TextTotalFlight = new myElement(createP(mainChar.stats.movements.flight.getPointsTotalForStatsPage() + "ft"), "shrinkablePStatsMainFivePieceP", pstats.sdMovement_DivTotal);

            pstats.sdMovement_TextBaseFlight.round("ft");
            pstats.sdMovement_TextGearFlight.roundDecimal("ft");
            pstats.sdMovement_TextTotalFlight.roundToNearestFive("ft");

            pstats.sdMovement_MiniDivCPCapFlight = new myElement(createDiv(), "", pstats.sdMovement_DivCpCap);
            pstats.sdMovement_InputCPCapFlight = new myElement(createInput(mainChar.stats.movements.flight.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdMovement_MiniDivCPCapFlight, null, () => {
                let x = parseInt(pstats.sdMovement_InputCPCapFlight.value());
                x = isNaN(x) ? 0 : x;
                mainChar.stats.movements.flight.setCPCount(x);
                pstats.sdMovement_TextTotalFlight.html(mainChar.stats.movements.flight.getPointsTotalForStatsPage() + "ft");
                pstats.sdMovement_TextTotalFlight.roundToNearestFive("ft");
            }, null, null, true, mainChar.stats.movements.flight.getCap());
            pstats.sdMovement_TextCPCapFlight = new myElement(createP("/" + Math.round(mainChar.stats.movements.flight.getCap())), "shrinkablePStatsMainFivePieceP", pstats.sdMovement_MiniDivCPCapFlight);
            pstats.sdMovement_MiniDivCPCapFlight.style("display", "flex");
            pstats.sdMovement_InputCPCapFlight.style("max-width", "45%");
            pstats.sdMovement_InputCPCapFlight.style("min-width", "45%");
            pstats.sdMovement_InputCPCapFlight.style("text-align", "center");
            pstats.sdMovement_InputCPCapFlight.style("margin-top", "0");
            pstats.sdMovement_TextCPCapFlight.style("margin-top", "2px");
        }
    });
    pstats.sdMovementText = new myElement(createP("+ Movement"), "shrinkableHeader", pstats.sdMovement);

    // Shrinkable Skills
    pstats.sdSkills = new myElement(createDiv(), "shrinkableDiv");
    pstats.sdSkillsCheckBox = new myElement(createInput("", "checkbox"), "shrinkableInputField", pstats.sdSkills, null, () => {
        pstats.sdSkillsCheckBox.swapChecked(); // This is for updating the isChecked variable inside the element.
        let hidden = pstats.sdSkillsText.html().indexOf("+ Skills") != -1 ? false : true;
        pstats.sdSkillsText.html((hidden ? "+ Skills" : "- Skills"));

        if (hidden) {
            openedSections[15] = 0;
            pstats.sdSkillsText.class("shrinkableHeader");

            Object.keys(pstats).forEach(function (key) {
                if (key.startsWith("sdSkills") && key != "sdSkills" && key != "sdSkillsCheckBox" && key != "sdSkillsText") {
                    pstats[key].remove();
                    delete pstats[key];
                }
            });
        }
        else {
            openedSections[15] = 1;
            pstats.sdSkillsText.class("shrinkableHeaderHidden");

            let addSkillToList = (s) => {
                let divName = new myElement(createDiv(), "", pstats.sdSkills_DivName);
                if (s.isCustom || s.isAddedToList) {
                    let buttonDel = new myElement(createButton("X"), "shrinkablePGearButton", divName, () => {
                        if (confirm("Do you want to remove " + s.name + "?")) {
                            if (s.skillType == 1) removeCraftedSkill(s.id);
                            else if (s.skillType == 2) removePerformSkill(s.id);
                            else if (s.skillType == 3) removeKnowledgeSkill(s.id);
                            s.isAddedToList = false;
                            s.setCPCount(0);

                            buttonDel.remove();
                            textNameDisguise.remove();
                            divName.remove();
                            textBaseDisguise.remove();
                            textGearDisguise.remove();
                            textTotalDisguise.remove();
                            inputCPCapDisguise.remove();
                            miniDivCPCapDisguise.remove();
                        }
                    });

                    buttonDel.style("min-width", "15%");
                    buttonDel.style("max-width", "15%");
                    buttonDel.style("height", "100%");
                    buttonDel.style("margin-top", "0");
                }

                let textNameDisguise = new myElement(createP(s.name), "shrinkablePStatsMainP", divName);
                let textBaseDisguise = new myElement(createP(s.getPointsBase()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivBase);
                let textGearDisguise = new myElement(createP(s.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivGear);
                let textTotalDisguise = new myElement(createP(s.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivTotal);

                textBaseDisguise.roundDecimal();
                textGearDisguise.roundDecimal();
                textTotalDisguise.round();

                let miniDivCPCapDisguise = new myElement(createDiv(), "shrinkablePStatsDivXY", pstats.sdSkills_DivCpCap);
                let inputCPCapDisguise = new myElement(createInput(s.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", miniDivCPCapDisguise, null, () => {
                    let x = parseInt(inputCPCapDisguise.value());
                    x = isNaN(x) ? 0 : x;
                    s.setCPCount(x);
                    textTotalDisguise.html(s.getPointsTotalForStatsPage());
                    textTotalDisguise.round();
                }, null, null, true, mainChar.cpStats.getMaxModifier());
                divName.style("margin-block-start", "0.437em");
                divName.style("margin-block-end", "0.437em");
                divName.style("height", "16px");
                divName.style("display", "flex");
                divName.style("min-width", "100%")

                textNameDisguise.style("margin-block-start", "0px");
                textNameDisguise.style("margin-block-end", "0px");
                textNameDisguise.style("margin-top", "0px");
                textNameDisguise.style("min-width", "80%");
                miniDivCPCapDisguise.style("display", "flex");
                inputCPCapDisguise.style("max-width", "90%");
                inputCPCapDisguise.style("min-width", "90%");
                inputCPCapDisguise.style("text-align", "center");
                inputCPCapDisguise.style("margin-top", "0");
            }

            // Bottom of Skills Info
            pstats.sdSkills_DivSkillsStats = new myElement(createDiv(), "shrinkablePStatsMainBigSingularDiv", pstats.sdSkills);
            pstats.sdSkills_DivName = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivBig", pstats.sdSkills_DivSkillsStats);
            pstats.sdSkills_DivBase = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivLittle", pstats.sdSkills_DivSkillsStats);
            pstats.sdSkills_DivCpCap = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivLittle", pstats.sdSkills_DivSkillsStats);
            pstats.sdSkills_DivGear = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivLittle", pstats.sdSkills_DivSkillsStats);
            pstats.sdSkills_DivTotal = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivLittle", pstats.sdSkills_DivSkillsStats);

            pstats.sdSkills_TextHeaderName = new myElement(createP("Name"), "shrinkablePStatsMainLeftHeaderP", pstats.sdSkills_DivName);
            pstats.sdSkills_TextHeaderBase = new myElement(createP("Base"), "shrinkablePStatsMainCenterHeaderP", pstats.sdSkills_DivBase);
            pstats.sdSkills_TextHeaderCpCap = new myElement(createP("Cp"), "shrinkablePStatsMainCenterHeaderP", pstats.sdSkills_DivCpCap);
            pstats.sdSkills_TextHeaderGear = new myElement(createP("Gear"), "shrinkablePStatsMainCenterHeaderP", pstats.sdSkills_DivGear);
            pstats.sdSkills_TextHeaderTotal = new myElement(createP("Total"), "shrinkablePStatsMainCenterHeaderP", pstats.sdSkills_DivTotal);

            pstats.sdSkills_DivName.style("min-width", "30%");
            pstats.sdSkills_DivCpCap.style("min-width", "20%");
            pstats.sdSkills_DivCpCap.style("max-width", "20%");
            // Disguise
            pstats.sdSkills_TextNameDisguise = new myElement(createP("Disguise"), "shrinkablePStatsMainP", pstats.sdSkills_DivName);
            pstats.sdSkills_TextBaseDisguise = new myElement(createP(mainChar.stats.skills.Disguise.getPointsBase()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivBase);
            pstats.sdSkills_TextGearDisguise = new myElement(createP(mainChar.stats.skills.Disguise.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivGear);
            pstats.sdSkills_TextTotalDisguise = new myElement(createP(mainChar.stats.skills.Disguise.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivTotal);

            pstats.sdSkills_TextBaseDisguise.roundDecimal();
            pstats.sdSkills_TextGearDisguise.roundDecimal();
            pstats.sdSkills_TextTotalDisguise.round();

            pstats.sdSkills_MiniDivCPCapDisguise = new myElement(createDiv(), "shrinkablePStatsDivXY", pstats.sdSkills_DivCpCap);
            pstats.sdSkills_InputCPCapDisguise = new myElement(createInput(mainChar.stats.skills.Disguise.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdSkills_MiniDivCPCapDisguise, null, () => {
                let x = parseInt(pstats.sdSkills_InputCPCapDisguise.value());
                x = isNaN(x) ? 0 : x;
                mainChar.stats.skills.Disguise.setCPCount(x);
                pstats.sdSkills_TextTotalDisguise.html(mainChar.stats.skills.Disguise.getPointsTotalForStatsPage());
                pstats.sdSkills_TextTotalDisguise.round();
            }, null, null, true, mainChar.cpStats.getMaxModifier());
            pstats.sdSkills_MiniDivCPCapDisguise.style("display", "flex");
            pstats.sdSkills_InputCPCapDisguise.style("max-width", "90%");
            pstats.sdSkills_InputCPCapDisguise.style("min-width", "90%");
            pstats.sdSkills_InputCPCapDisguise.style("text-align", "center");
            pstats.sdSkills_InputCPCapDisguise.style("margin-top", "0");

            // Medicine
            pstats.sdSkills_TextNameMedicine = new myElement(createP("Medicine"), "shrinkablePStatsMainP", pstats.sdSkills_DivName);
            pstats.sdSkills_TextBaseMedicine = new myElement(createP(mainChar.stats.skills.Medicine.getPointsBase()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivBase);
            pstats.sdSkills_TextGearMedicine = new myElement(createP(mainChar.stats.skills.Medicine.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivGear);
            pstats.sdSkills_TextTotalMedicine = new myElement(createP(mainChar.stats.skills.Medicine.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivTotal);

            pstats.sdSkills_TextBaseMedicine.roundDecimal();
            pstats.sdSkills_TextGearMedicine.roundDecimal();
            pstats.sdSkills_TextTotalMedicine.round();

            pstats.sdSkills_MiniDivCPCapMedicine = new myElement(createDiv(), "shrinkablePStatsDivXY", pstats.sdSkills_DivCpCap);
            pstats.sdSkills_InputCPCapMedicine = new myElement(createInput(mainChar.stats.skills.Medicine.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdSkills_MiniDivCPCapMedicine, null, () => {
                let x = parseInt(pstats.sdSkills_InputCPCapMedicine.value());
                x = isNaN(x) ? 0 : x;
                mainChar.stats.skills.Medicine.setCPCount(x);
                pstats.sdSkills_TextTotalMedicine.html(mainChar.stats.skills.Medicine.getPointsTotalForStatsPage());
                pstats.sdSkills_TextTotalMedicine.round();
            }, null, null, true, mainChar.cpStats.getMaxModifier());
            pstats.sdSkills_MiniDivCPCapMedicine.style("display", "flex");
            pstats.sdSkills_InputCPCapMedicine.style("max-width", "90%");
            pstats.sdSkills_InputCPCapMedicine.style("min-width", "90%");
            pstats.sdSkills_InputCPCapMedicine.style("text-align", "center");
            pstats.sdSkills_InputCPCapMedicine.style("margin-top", "0");
            // Insight
            pstats.sdSkills_TextNameInsight = new myElement(createP("Insight"), "shrinkablePStatsMainP", pstats.sdSkills_DivName);
            pstats.sdSkills_TextBaseInsight = new myElement(createP(mainChar.stats.skills.Insight.getPointsBase()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivBase);
            pstats.sdSkills_TextGearInsight = new myElement(createP(mainChar.stats.skills.Insight.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivGear);
            pstats.sdSkills_TextTotalInsight = new myElement(createP(mainChar.stats.skills.Insight.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivTotal);

            pstats.sdSkills_TextBaseInsight.roundDecimal();
            pstats.sdSkills_TextGearInsight.roundDecimal();
            pstats.sdSkills_TextTotalInsight.round();

            pstats.sdSkills_MiniDivCPCapInsight = new myElement(createDiv(), "shrinkablePStatsDivXY", pstats.sdSkills_DivCpCap);
            pstats.sdSkills_InputCPCapInsight = new myElement(createInput(mainChar.stats.skills.Insight.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdSkills_MiniDivCPCapInsight, null, () => {
                let x = parseInt(pstats.sdSkills_InputCPCapInsight.value());
                x = isNaN(x) ? 0 : x;
                mainChar.stats.skills.Insight.setCPCount(x);
                pstats.sdSkills_TextTotalInsight.html(mainChar.stats.skills.Insight.getPointsTotalForStatsPage());
                pstats.sdSkills_TextTotalInsight.round();
            }, null, null, true, mainChar.cpStats.getMaxModifier());
            pstats.sdSkills_MiniDivCPCapInsight.style("display", "flex");
            pstats.sdSkills_InputCPCapInsight.style("max-width", "90%");
            pstats.sdSkills_InputCPCapInsight.style("min-width", "90%");
            pstats.sdSkills_InputCPCapInsight.style("text-align", "center");
            pstats.sdSkills_InputCPCapInsight.style("margin-top", "0");
            // PickPocket
            pstats.sdSkills_TextNamePickPocket = new myElement(createP("Pick Pocket"), "shrinkablePStatsMainP", pstats.sdSkills_DivName);
            pstats.sdSkills_TextBasePickPocket = new myElement(createP(mainChar.stats.skills.PickPocket.getPointsBase()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivBase);
            pstats.sdSkills_TextGearPickPocket = new myElement(createP(mainChar.stats.skills.PickPocket.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivGear);
            pstats.sdSkills_TextTotalPickPocket = new myElement(createP(mainChar.stats.skills.PickPocket.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivTotal);

            pstats.sdSkills_TextBasePickPocket.roundDecimal();
            pstats.sdSkills_TextGearPickPocket.roundDecimal();
            pstats.sdSkills_TextTotalPickPocket.round();

            pstats.sdSkills_MiniDivCPCapPickPocket = new myElement(createDiv(), "shrinkablePStatsDivXY", pstats.sdSkills_DivCpCap);
            pstats.sdSkills_InputCPCapPickPocket = new myElement(createInput(mainChar.stats.skills.PickPocket.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdSkills_MiniDivCPCapPickPocket, null, () => {
                let x = parseInt(pstats.sdSkills_InputCPCapPickPocket.value());
                x = isNaN(x) ? 0 : x;
                mainChar.stats.skills.PickPocket.setCPCount(x);
                pstats.sdSkills_TextTotalPickPocket.html(mainChar.stats.skills.PickPocket.getPointsTotalForStatsPage());
                pstats.sdSkills_TextTotalPickPocket.round();
            }, null, null, true, mainChar.cpStats.getMaxModifier());
            pstats.sdSkills_MiniDivCPCapPickPocket.style("display", "flex");
            pstats.sdSkills_InputCPCapPickPocket.style("max-width", "90%");
            pstats.sdSkills_InputCPCapPickPocket.style("min-width", "90%");
            pstats.sdSkills_InputCPCapPickPocket.style("text-align", "center");
            pstats.sdSkills_InputCPCapPickPocket.style("margin-top", "0");
            // PickLock
            pstats.sdSkills_TextNamePickLock = new myElement(createP("Pick Lock"), "shrinkablePStatsMainP", pstats.sdSkills_DivName);
            pstats.sdSkills_TextBasePickLock = new myElement(createP(mainChar.stats.skills.PickLock.getPointsBase()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivBase);
            pstats.sdSkills_TextGearPickLock = new myElement(createP(mainChar.stats.skills.PickLock.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivGear);
            pstats.sdSkills_TextTotalPickLock = new myElement(createP(mainChar.stats.skills.PickLock.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivTotal);

            pstats.sdSkills_TextBasePickLock.roundDecimal();
            pstats.sdSkills_TextGearPickLock.roundDecimal();
            pstats.sdSkills_TextTotalPickLock.round();

            pstats.sdSkills_MiniDivCPCapPickLock = new myElement(createDiv(), "shrinkablePStatsDivXY", pstats.sdSkills_DivCpCap);
            pstats.sdSkills_InputCPCapPickLock = new myElement(createInput(mainChar.stats.skills.PickLock.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdSkills_MiniDivCPCapPickLock, null, () => {
                let x = parseInt(pstats.sdSkills_InputCPCapPickLock.value());
                x = isNaN(x) ? 0 : x;
                mainChar.stats.skills.PickLock.setCPCount(x);
                pstats.sdSkills_TextTotalPickLock.html(mainChar.stats.skills.PickLock.getPointsTotalForStatsPage());
                pstats.sdSkills_TextTotalPickLock.round();
            }, null, null, true, mainChar.cpStats.getMaxModifier());
            pstats.sdSkills_MiniDivCPCapPickLock.style("display", "flex");
            pstats.sdSkills_InputCPCapPickLock.style("max-width", "90%");
            pstats.sdSkills_InputCPCapPickLock.style("min-width", "90%");
            pstats.sdSkills_InputCPCapPickLock.style("text-align", "center");
            pstats.sdSkills_InputCPCapPickLock.style("margin-top", "0");
            // Hide
            pstats.sdSkills_TextNameHide = new myElement(createP("Hide"), "shrinkablePStatsMainP", pstats.sdSkills_DivName);
            pstats.sdSkills_TextBaseHide = new myElement(createP(mainChar.stats.skills.Hide.getPointsBase()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivBase);
            pstats.sdSkills_TextGearHide = new myElement(createP(mainChar.stats.skills.Hide.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivGear);
            pstats.sdSkills_TextTotalHide = new myElement(createP(mainChar.stats.skills.Hide.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivTotal);

            pstats.sdSkills_TextBaseHide.roundDecimal();
            pstats.sdSkills_TextGearHide.roundDecimal();
            pstats.sdSkills_TextTotalHide.round();

            pstats.sdSkills_MiniDivCPCapHide = new myElement(createDiv(), "shrinkablePStatsDivXY", pstats.sdSkills_DivCpCap);
            pstats.sdSkills_InputCPCapHide = new myElement(createInput(mainChar.stats.skills.Hide.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdSkills_MiniDivCPCapHide, null, () => {
                let x = parseInt(pstats.sdSkills_InputCPCapHide.value());
                x = isNaN(x) ? 0 : x;
                mainChar.stats.skills.Hide.setCPCount(x);
                pstats.sdSkills_TextTotalHide.html(mainChar.stats.skills.Hide.getPointsTotalForStatsPage());
                pstats.sdSkills_TextTotalHide.round();
            }, null, null, true, mainChar.cpStats.getMaxModifier());
            pstats.sdSkills_MiniDivCPCapHide.style("display", "flex");
            pstats.sdSkills_InputCPCapHide.style("max-width", "90%");
            pstats.sdSkills_InputCPCapHide.style("min-width", "90%");
            pstats.sdSkills_InputCPCapHide.style("text-align", "center");
            pstats.sdSkills_InputCPCapHide.style("margin-top", "0");
            // MoveSilently
            pstats.sdSkills_TextNameMoveSilently = new myElement(createP("Move Silently"), "shrinkablePStatsMainP", pstats.sdSkills_DivName);
            pstats.sdSkills_TextBaseMoveSilently = new myElement(createP(mainChar.stats.skills.MoveSilently.getPointsBase()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivBase);
            pstats.sdSkills_TextGearMoveSilently = new myElement(createP(mainChar.stats.skills.MoveSilently.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivGear);
            pstats.sdSkills_TextTotalMoveSilently = new myElement(createP(mainChar.stats.skills.MoveSilently.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivTotal);

            pstats.sdSkills_TextBaseMoveSilently.roundDecimal();
            pstats.sdSkills_TextGearMoveSilently.roundDecimal();
            pstats.sdSkills_TextTotalMoveSilently.round();

            pstats.sdSkills_MiniDivCPCapMoveSilently = new myElement(createDiv(), "shrinkablePStatsDivXY", pstats.sdSkills_DivCpCap);
            pstats.sdSkills_InputCPCapMoveSilently = new myElement(createInput(mainChar.stats.skills.MoveSilently.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdSkills_MiniDivCPCapMoveSilently, null, () => {
                let x = parseInt(pstats.sdSkills_InputCPCapMoveSilently.value());
                x = isNaN(x) ? 0 : x;
                mainChar.stats.skills.MoveSilently.setCPCount(x);
                pstats.sdSkills_TextTotalMoveSilently.html(mainChar.stats.skills.MoveSilently.getPointsTotalForStatsPage());
                pstats.sdSkills_TextTotalMoveSilently.round();
            }, null, null, true, mainChar.cpStats.getMaxModifier());
            pstats.sdSkills_MiniDivCPCapMoveSilently.style("display", "flex");
            pstats.sdSkills_InputCPCapMoveSilently.style("max-width", "90%");
            pstats.sdSkills_InputCPCapMoveSilently.style("min-width", "90%");
            pstats.sdSkills_InputCPCapMoveSilently.style("text-align", "center");
            pstats.sdSkills_InputCPCapMoveSilently.style("margin-top", "0");
            // Bluff
            pstats.sdSkills_TextNameBluff = new myElement(createP("Bluff"), "shrinkablePStatsMainP", pstats.sdSkills_DivName);
            pstats.sdSkills_TextBaseBluff = new myElement(createP(mainChar.stats.skills.Bluff.getPointsBase()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivBase);
            pstats.sdSkills_TextGearBluff = new myElement(createP(mainChar.stats.skills.Bluff.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivGear);
            pstats.sdSkills_TextTotalBluff = new myElement(createP(mainChar.stats.skills.Bluff.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivTotal);

            pstats.sdSkills_TextBaseBluff.roundDecimal();
            pstats.sdSkills_TextGearBluff.roundDecimal();
            pstats.sdSkills_TextTotalBluff.round();

            pstats.sdSkills_MiniDivCPCapBluff = new myElement(createDiv(), "shrinkablePStatsDivXY", pstats.sdSkills_DivCpCap);
            pstats.sdSkills_InputCPCapBluff = new myElement(createInput(mainChar.stats.skills.Bluff.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdSkills_MiniDivCPCapBluff, null, () => {
                let x = parseInt(pstats.sdSkills_InputCPCapBluff.value());
                x = isNaN(x) ? 0 : x;
                mainChar.stats.skills.Bluff.setCPCount(x);
                pstats.sdSkills_TextTotalBluff.html(mainChar.stats.skills.Bluff.getPointsTotalForStatsPage());
                pstats.sdSkills_TextTotalBluff.round();
            }, null, null, true, mainChar.cpStats.getMaxModifier());
            pstats.sdSkills_MiniDivCPCapBluff.style("display", "flex");
            pstats.sdSkills_InputCPCapBluff.style("max-width", "90%");
            pstats.sdSkills_InputCPCapBluff.style("min-width", "90%");
            pstats.sdSkills_InputCPCapBluff.style("text-align", "center");
            pstats.sdSkills_InputCPCapBluff.style("margin-top", "0");
            // Diplomacy
            pstats.sdSkills_TextNameDiplomacy = new myElement(createP("Diplomacy"), "shrinkablePStatsMainP", pstats.sdSkills_DivName);
            pstats.sdSkills_TextBaseDiplomacy = new myElement(createP(mainChar.stats.skills.Diplomacy.getPointsBase()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivBase);
            pstats.sdSkills_TextGearDiplomacy = new myElement(createP(mainChar.stats.skills.Diplomacy.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivGear);
            pstats.sdSkills_TextTotalDiplomacy = new myElement(createP(mainChar.stats.skills.Diplomacy.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivTotal);

            pstats.sdSkills_TextBaseDiplomacy.roundDecimal();
            pstats.sdSkills_TextGearDiplomacy.roundDecimal();
            pstats.sdSkills_TextTotalDiplomacy.round();

            pstats.sdSkills_MiniDivCPCapDiplomacy = new myElement(createDiv(), "shrinkablePStatsDivXY", pstats.sdSkills_DivCpCap);
            pstats.sdSkills_InputCPCapDiplomacy = new myElement(createInput(mainChar.stats.skills.Diplomacy.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdSkills_MiniDivCPCapDiplomacy, null, () => {
                let x = parseInt(pstats.sdSkills_InputCPCapDiplomacy.value());
                x = isNaN(x) ? 0 : x;
                mainChar.stats.skills.Diplomacy.setCPCount(x);
                pstats.sdSkills_TextTotalDiplomacy.html(mainChar.stats.skills.Diplomacy.getPointsTotalForStatsPage());
                pstats.sdSkills_TextTotalDiplomacy.round();
            }, null, null, true, mainChar.cpStats.getMaxModifier());
            pstats.sdSkills_MiniDivCPCapDiplomacy.style("display", "flex");
            pstats.sdSkills_InputCPCapDiplomacy.style("max-width", "90%");
            pstats.sdSkills_InputCPCapDiplomacy.style("min-width", "90%");
            pstats.sdSkills_InputCPCapDiplomacy.style("text-align", "center");
            pstats.sdSkills_InputCPCapDiplomacy.style("margin-top", "0");
            // Intimidate
            pstats.sdSkills_TextNameIntimidate = new myElement(createP("Intimidate"), "shrinkablePStatsMainP", pstats.sdSkills_DivName);
            pstats.sdSkills_TextBaseIntimidate = new myElement(createP(mainChar.stats.skills.Intimidate.getPointsBase()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivBase);
            pstats.sdSkills_TextGearIntimidate = new myElement(createP(mainChar.stats.skills.Intimidate.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivGear);
            pstats.sdSkills_TextTotalIntimidate = new myElement(createP(mainChar.stats.skills.Intimidate.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivTotal);

            pstats.sdSkills_TextBaseIntimidate.roundDecimal();
            pstats.sdSkills_TextGearIntimidate.roundDecimal();
            pstats.sdSkills_TextTotalIntimidate.round();

            pstats.sdSkills_MiniDivCPCapIntimidate = new myElement(createDiv(), "shrinkablePStatsDivXY", pstats.sdSkills_DivCpCap);
            pstats.sdSkills_InputCPCapIntimidate = new myElement(createInput(mainChar.stats.skills.Intimidate.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdSkills_MiniDivCPCapIntimidate, null, () => {
                let x = parseInt(pstats.sdSkills_InputCPCapIntimidate.value());
                x = isNaN(x) ? 0 : x;
                mainChar.stats.skills.Intimidate.setCPCount(x);
                pstats.sdSkills_TextTotalIntimidate.html(mainChar.stats.skills.Intimidate.getPointsTotalForStatsPage());
                pstats.sdSkills_TextTotalIntimidate.round();
            }, null, null, true, mainChar.cpStats.getMaxModifier());
            pstats.sdSkills_MiniDivCPCapIntimidate.style("display", "flex");
            pstats.sdSkills_InputCPCapIntimidate.style("max-width", "90%");
            pstats.sdSkills_InputCPCapIntimidate.style("min-width", "90%");
            pstats.sdSkills_InputCPCapIntimidate.style("text-align", "center");
            pstats.sdSkills_InputCPCapIntimidate.style("margin-top", "0");
            // Survival
            pstats.sdSkills_TextNameSurvival = new myElement(createP("Survival"), "shrinkablePStatsMainP", pstats.sdSkills_DivName);
            pstats.sdSkills_TextBaseSurvival = new myElement(createP(mainChar.stats.skills.Survival.getPointsBase()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivBase);
            pstats.sdSkills_TextGearSurvival = new myElement(createP(mainChar.stats.skills.Survival.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivGear);
            pstats.sdSkills_TextTotalSurvival = new myElement(createP(mainChar.stats.skills.Survival.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivTotal);

            pstats.sdSkills_TextBaseSurvival.roundDecimal();
            pstats.sdSkills_TextGearSurvival.roundDecimal();
            pstats.sdSkills_TextTotalSurvival.round();

            pstats.sdSkills_MiniDivCPCapSurvival = new myElement(createDiv(), "shrinkablePStatsDivXY", pstats.sdSkills_DivCpCap);
            pstats.sdSkills_InputCPCapSurvival = new myElement(createInput(mainChar.stats.skills.Survival.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdSkills_MiniDivCPCapSurvival, null, () => {
                let x = parseInt(pstats.sdSkills_InputCPCapSurvival.value());
                x = isNaN(x) ? 0 : x;
                mainChar.stats.skills.Survival.setCPCount(x);
                pstats.sdSkills_TextTotalSurvival.html(mainChar.stats.skills.Survival.getPointsTotalForStatsPage());
                pstats.sdSkills_TextTotalSurvival.round();
            }, null, null, true, mainChar.cpStats.getMaxModifier());
            pstats.sdSkills_MiniDivCPCapSurvival.style("display", "flex");
            pstats.sdSkills_InputCPCapSurvival.style("max-width", "90%");
            pstats.sdSkills_InputCPCapSurvival.style("min-width", "90%");
            pstats.sdSkills_InputCPCapSurvival.style("text-align", "center");
            pstats.sdSkills_InputCPCapSurvival.style("margin-top", "0");
            // Track
            pstats.sdSkills_TextNameTrack = new myElement(createP("Track"), "shrinkablePStatsMainP", pstats.sdSkills_DivName);
            pstats.sdSkills_TextBaseTrack = new myElement(createP(mainChar.stats.skills.Track.getPointsBase()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivBase);
            pstats.sdSkills_TextGearTrack = new myElement(createP(mainChar.stats.skills.Track.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivGear);
            pstats.sdSkills_TextTotalTrack = new myElement(createP(mainChar.stats.skills.Track.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivTotal);

            pstats.sdSkills_TextBaseTrack.roundDecimal();
            pstats.sdSkills_TextGearTrack.roundDecimal();
            pstats.sdSkills_TextTotalTrack.round();

            pstats.sdSkills_MiniDivCPCapTrack = new myElement(createDiv(), "shrinkablePStatsDivXY", pstats.sdSkills_DivCpCap);
            pstats.sdSkills_InputCPCapTrack = new myElement(createInput(mainChar.stats.skills.Track.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdSkills_MiniDivCPCapTrack, null, () => {
                let x = parseInt(pstats.sdSkills_InputCPCapTrack.value());
                x = isNaN(x) ? 0 : x;
                mainChar.stats.skills.Track.setCPCount(x);
                pstats.sdSkills_TextTotalTrack.html(mainChar.stats.skills.Track.getPointsTotalForStatsPage());
                pstats.sdSkills_TextTotalTrack.round();
            }, null, null, true, mainChar.cpStats.getMaxModifier());
            pstats.sdSkills_MiniDivCPCapTrack.style("display", "flex");
            pstats.sdSkills_InputCPCapTrack.style("max-width", "90%");
            pstats.sdSkills_InputCPCapTrack.style("min-width", "90%");
            pstats.sdSkills_InputCPCapTrack.style("text-align", "center");
            pstats.sdSkills_InputCPCapTrack.style("margin-top", "0");
            // Flight
            pstats.sdSkills_TextNameFlight = new myElement(createP("Flight"), "shrinkablePStatsMainP", pstats.sdSkills_DivName);
            pstats.sdSkills_TextBaseFlight = new myElement(createP(mainChar.stats.skills.Flight.getPointsBase()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivBase);
            pstats.sdSkills_TextGearFlight = new myElement(createP(mainChar.stats.skills.Flight.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivGear);
            pstats.sdSkills_TextTotalFlight = new myElement(createP(mainChar.stats.skills.Flight.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdSkills_DivTotal);

            pstats.sdSkills_TextBaseFlight.roundDecimal();
            pstats.sdSkills_TextGearFlight.roundDecimal();
            pstats.sdSkills_TextTotalFlight.round();

            pstats.sdSkills_MiniDivCPCapFlight = new myElement(createDiv(), "shrinkablePStatsDivXY", pstats.sdSkills_DivCpCap);
            pstats.sdSkills_InputCPCapFlight = new myElement(createInput(mainChar.stats.skills.Flight.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdSkills_MiniDivCPCapFlight, null, () => {
                let x = parseInt(pstats.sdSkills_InputCPCapFlight.value());
                x = isNaN(x) ? 0 : x;
                mainChar.stats.skills.Flight.setCPCount(x);
                pstats.sdSkills_TextTotalFlight.html(mainChar.stats.skills.Flight.getPointsTotalForStatsPage());
                pstats.sdSkills_TextTotalFlight.round();
            }, null, null, true, mainChar.cpStats.getMaxModifier());
            pstats.sdSkills_MiniDivCPCapFlight.style("display", "flex");
            pstats.sdSkills_InputCPCapFlight.style("max-width", "90%");
            pstats.sdSkills_InputCPCapFlight.style("min-width", "90%");
            pstats.sdSkills_InputCPCapFlight.style("text-align", "center");
            pstats.sdSkills_InputCPCapFlight.style("margin-top", "0");

            // Custom Skills
            for (var i = 0; i < allCraftingSkills.length; ++i) {
                if (allCraftingSkills[i].isAddedToList)
                    addSkillToList(allCraftingSkills[i]);
            }
            for (var i = 0; i < allPerformSkills.length; ++i) {
                if (allPerformSkills[i].isAddedToList)
                    addSkillToList(allPerformSkills[i]);
            }
            for (var i = 0; i < allKnowledgeSkills.length; ++i) {
                if (allKnowledgeSkills[i].isAddedToList)
                    addSkillToList(allKnowledgeSkills[i]);
            }
            // Buttons
            pstats.sdSkills_BigDivButtons = new myElement(createDiv(), "", pstats.sdSkills);
            pstats.sdSkills_TopDivButtons = new myElement(createDiv(), "", pstats.sdSkills_BigDivButtons);
            pstats.sdSkills_BottomDivButtons = new myElement(createDiv(), "", pstats.sdSkills_BigDivButtons);
            pstats.sdSkills_SelectAddCrafting = new myElement(createSelect(), "shrinkablePMainConditionSelect", pstats.sdSkills_TopDivButtons, null, null, () => {
                if (pstats.sdSkills_DivCustomPerform) {
                    pstats.sdSkills_SelectAddPerform.selectValue(0);
                    pstats.sdSkills_DivCustomPerform.remove();
                }

                if (pstats.sdSkills_DivKnow)
                    pstats.sdSkills_DivKnow.remove();

                if (pstats.sdSkills_DivCustomCrafting)
                    pstats.sdSkills_DivCustomCrafting.remove();

                let val = pstats.sdSkills_SelectAddCrafting.value();

                if (val == "Add Custom STR" || val == "Add Custom AGI") {
                    pstats.sdSkills_DivCustomCrafting = new myElement(createDiv(), "", pstats.sdSkills_BottomDivButtons);
                    pstats.sdSkills_InputCustomCrafting = new myElement(createInput("Name"), "shrinkablePGearInput", pstats.sdSkills_DivCustomCrafting, () => {
                        if (pstats.sdSkills_InputCustomCrafting.value() == "Name")
                            pstats.sdSkills_InputCustomCrafting.value("");
                    });
                    pstats.sdSkills_ButtonCustomCrafting = new myElement(createButton("+"), "shrinkablePGearButton", pstats.sdSkills_DivCustomCrafting, () => {
                        let isStrBased = val == "Add Custom STR" ? true : false;
                        let skill = addCraftedSkill(pstats.sdSkills_InputCustomCrafting.value(), isStrBased, !isStrBased);
                        addSkillToList(skill);

                        pstats.sdSkills_SelectAddCrafting.selectValue(0);
                        pstats.sdSkills_DivCustomCrafting.remove();
                    });

                    pstats.sdSkills_DivCustomCrafting.style("display", "flex");
                    pstats.sdSkills_DivCustomCrafting.style("min-width", "33%");
                    pstats.sdSkills_DivCustomCrafting.style("max-width", "33%");
                    pstats.sdSkills_InputCustomCrafting.style("min-width", "80%");
                    pstats.sdSkills_ButtonCustomCrafting.style("min-width", "15%");
                }
                else {
                    if (val == "Add Crafting") return;
                    let skill = getSkillByName(val);
                    skill.isAddedToList = true;
                    addSkillToList(skill);
                    pstats.sdSkills_SelectAddCrafting.selectValue(0);
                }
            });
            pstats.sdSkills_SelectAddPerform = new myElement(createSelect(), "shrinkablePMainConditionSelect", pstats.sdSkills_TopDivButtons, null, null, () => {
                if (pstats.sdSkills_DivCustomCrafting) {
                    pstats.sdSkills_SelectAddCrafting.selectValue(0);
                    pstats.sdSkills_DivCustomCrafting.remove()
                }

                if (pstats.sdSkills_DivKnow)
                    pstats.sdSkills_DivKnow.remove();

                if (pstats.sdSkills_DivCustomPerform)
                    pstats.sdSkills_DivCustomPerform.remove();

                let val = pstats.sdSkills_SelectAddPerform.value();

                if (val == "Add Custom") {
                    pstats.sdSkills_DivCustomPerform = new myElement(createDiv(), "", pstats.sdSkills_BottomDivButtons);
                    pstats.sdSkills_InputCustomPerform = new myElement(createInput("Name"), "shrinkablePGearInput", pstats.sdSkills_DivCustomPerform, () => {
                        if (pstats.sdSkills_InputCustomPerform.value() == "Name")
                            pstats.sdSkills_InputCustomPerform.value("");
                    });
                    pstats.sdSkills_ButtonCustomPerform = new myElement(createButton("+"), "shrinkablePGearButton", pstats.sdSkills_DivCustomPerform, () => {
                        let skill = addPerformSkill(pstats.sdSkills_InputCustomPerform.value());
                        addSkillToList(skill);

                        pstats.sdSkills_SelectAddPerform.selectValue(0);
                        pstats.sdSkills_DivCustomPerform.remove();
                    });

                    pstats.sdSkills_DivCustomPerform.style("margin-left", "33%");
                    pstats.sdSkills_DivCustomPerform.style("display", "flex");
                    pstats.sdSkills_DivCustomPerform.style("min-width", "33%");
                    pstats.sdSkills_DivCustomPerform.style("max-width", "33%");
                    pstats.sdSkills_InputCustomPerform.style("min-width", "80%");
                    pstats.sdSkills_ButtonCustomPerform.style("min-width", "15%");
                }
                else {
                    if (val == "Add Perform") return;
                    let skill = getSkillByName(val);
                    skill.isAddedToList = true;
                    addSkillToList(skill);
                    pstats.sdSkills_SelectAddPerform.selectValue(0);
                }
            });
            pstats.sdSkills_ButtonAddKnow = new myElement(createButton("Add Know"), "shrinkablePGearButton", pstats.sdSkills_TopDivButtons, () => {
                if (pstats.sdSkills_DivCustomCrafting) {
                    pstats.sdSkills_SelectAddCrafting.selectValue(0);
                    pstats.sdSkills_DivCustomCrafting.remove()
                }

                if (pstats.sdSkills_DivCustomPerform) {
                    pstats.sdSkills_DivCustomPerform.selectValue(0);
                    pstats.sdSkills_DivCustomPerform.remove();
                }

                if (pstats.sdSkills_DivKnow)
                    pstats.sdSkills_DivKnow.remove();

                pstats.sdSkills_DivKnow = new myElement(createDiv(), "", pstats.sdSkills_BottomDivButtons);
                pstats.sdSkills_InputKnow = new myElement(createInput("Name"), "shrinkablePGearInput", pstats.sdSkills_DivKnow, () => {
                    if (pstats.sdSkills_InputKnow.value() == "Name")
                        pstats.sdSkills_InputKnow.value("");
                });
                pstats.sdSkills_ButtonKnow = new myElement(createButton("+"), "shrinkablePGearButton", pstats.sdSkills_DivKnow, () => {
                    let skill = addKnowledgeSkill(pstats.sdSkills_InputKnow.value());
                    addSkillToList(skill);

                    if (pstats.sdSkills_DivKnow)
                        pstats.sdSkills_DivKnow.remove();
                });

                pstats.sdSkills_DivKnow.style("margin-left", "60%");
                pstats.sdSkills_DivKnow.style("display", "flex");
                pstats.sdSkills_DivKnow.style("min-width", "33%");
                pstats.sdSkills_DivKnow.style("max-width", "33%");
                pstats.sdSkills_InputKnow.style("min-width", "80%");
                pstats.sdSkills_ButtonKnow.style("min-width", "15%");
            });

            let craftingOptions = ["Add Crafting", "Add Custom STR", "Add Custom AGI"];
            let performOptions = ["Add Perform", "Add Custom"];

            for (let i = 0; i < allCraftingSkills.length; ++i)
                if (allCraftingSkills[i].getCap() == 0)
                    craftingOptions.push(allCraftingSkills[i].name);

            for (let j = 0; j < allPerformSkills.length; ++j)
                if (allPerformSkills[j].getCap() == 0)
                    performOptions.push(allPerformSkills[j].name);

            pstats.sdSkills_SelectAddCrafting.option(craftingOptions);
            pstats.sdSkills_SelectAddPerform.option(performOptions);

            pstats.sdSkills_BigDivButtons.style("min-width", "100%");
            pstats.sdSkills_TopDivButtons.style("min-width", "100%");
            pstats.sdSkills_TopDivButtons.style("display", "flex");
            pstats.sdSkills_BottomDivButtons.style("min-width", "100%");
            pstats.sdSkills_BottomDivButtons.style("display", "flex");
            pstats.sdSkills_SelectAddCrafting.style("min-width", "30%");
            pstats.sdSkills_SelectAddPerform.style("min-width", "30%");
            pstats.sdSkills_SelectAddPerform.style("margin-left", "5px");
            pstats.sdSkills_ButtonAddKnow.style("min-width", "30%");
            pstats.sdSkills_ButtonAddKnow.style("margin-left", "5px");
        }
    });
    pstats.sdSkillsText = new myElement(createP("+ Skills"), "shrinkableHeader", pstats.sdSkills);

    // Shrinkable Powers
    pstats.sdPowers = new myElement(createDiv(), "shrinkableDiv");
    pstats.sdPowersCheckBox = new myElement(createInput("", "checkbox"), "shrinkableInputField", pstats.sdPowers, null, () => {
        pstats.sdPowersCheckBox.swapChecked(); // This is for updating the isChecked variable inside the element.
        let hidden = pstats.sdPowersText.html().indexOf("+ Powers") != -1 ? false : true;
        pstats.sdPowersText.html((hidden ? "+ Powers" : "- Powers"));

        if (hidden) {
            openedSections[16] = 0;
            pstats.sdPowersText.class("shrinkableHeader");

            Object.keys(pstats).forEach(function (key) {
                if (key.startsWith("sdPowers") && key != "sdPowers" && key != "sdPowersCheckBox" && key != "sdPowersText") {
                    pstats[key].remove();
                    delete pstats[key];
                }
            });
        }
        else {
            openedSections[16] = 1;
            pstats.sdPowersText.class("shrinkableHeaderHidden");

            // Bottom of Powers Info
            pstats.sdPowers_DivPowersStats = new myElement(createDiv(), "shrinkablePStatsMainBigSingularDiv", pstats.sdPowers);
            pstats.sdPowers_DivName = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivBig", pstats.sdPowers_DivPowersStats);
            pstats.sdPowers_DivBase = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivLittle", pstats.sdPowers_DivPowersStats);
            pstats.sdPowers_DivCpCap = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivLittle", pstats.sdPowers_DivPowersStats);
            pstats.sdPowers_DivGear = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivLittle", pstats.sdPowers_DivPowersStats);
            pstats.sdPowers_DivTotal = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivLittle", pstats.sdPowers_DivPowersStats);

            pstats.sdPowers_TextHeaderName = new myElement(createP("Name"), "shrinkablePStatsMainLeftHeaderP", pstats.sdPowers_DivName);
            pstats.sdPowers_TextHeaderBase = new myElement(createP("Base"), "shrinkablePStatsMainCenterHeaderP", pstats.sdPowers_DivBase);
            pstats.sdPowers_TextHeaderCpCap = new myElement(createP("Cp/Cap"), "shrinkablePStatsMainCenterHeaderP", pstats.sdPowers_DivCpCap);
            pstats.sdPowers_TextHeaderGear = new myElement(createP("Gear"), "shrinkablePStatsMainCenterHeaderP", pstats.sdPowers_DivGear);
            pstats.sdPowers_TextHeaderTotal = new myElement(createP("Total"), "shrinkablePStatsMainCenterHeaderP", pstats.sdPowers_DivTotal);

            pstats.sdPowers_DivName.style("min-width", "30%");
            pstats.sdPowers_DivCpCap.style("min-width", "25%");
            pstats.sdPowers_DivCpCap.style("max-width", "25%");
            // Spell
            pstats.sdPowers_TextNameSpell = new myElement(createP("Spell"), "shrinkablePStatsMainP", pstats.sdPowers_DivName);
            pstats.sdPowers_TextBaseSpell = new myElement(createP(AllPowers.Spell.getBase()), "shrinkablePStatsMainFivePieceP", pstats.sdPowers_DivBase);
            pstats.sdPowers_TextGearSpell = new myElement(createP(AllPowers.Spell.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdPowers_DivGear);
            pstats.sdPowers_TextTotalSpell = new myElement(createP(AllPowers.Spell.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdPowers_DivTotal);

            pstats.sdPowers_TextTotalSpell.round();

            pstats.sdPowers_MiniDivCPCapSpell = new myElement(createDiv(), "", pstats.sdPowers_DivCpCap);
            pstats.sdPowers_InputCPCapSpell = new myElement(createInput(AllPowers.Spell.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdPowers_MiniDivCPCapSpell, null, () => {
                let x = parseInt(pstats.sdPowers_InputCPCapSpell.value());
                x = isNaN(x) ? 0 : x;
                AllPowers.Spell.setCPCount(x);
                pstats.sdPowers_TextTotalSpell.html(AllPowers.Spell.getPointsTotalForStatsPage());
                pstats.sdPowers_TextTotalSpell.round();
            }, null, null, true, AllPowers.Spell.getCPCap());
            pstats.sdPowers_TextCPCapSpell = new myElement(createP("/" + AllPowers.Spell.getCPCap()), "shrinkablePStatsMainFivePieceP", pstats.sdPowers_MiniDivCPCapSpell);
            pstats.sdPowers_MiniDivCPCapSpell.style("display", "flex");
            pstats.sdPowers_InputCPCapSpell.style("max-width", "45%");
            pstats.sdPowers_InputCPCapSpell.style("min-width", "45%");
            pstats.sdPowers_InputCPCapSpell.style("text-align", "center");
            pstats.sdPowers_InputCPCapSpell.style("margin-top", "0");
            pstats.sdPowers_TextCPCapSpell.style("margin-top", "2px");

            pstats.sdPowers_TextBaseSpell.roundDecimal();
            pstats.sdPowers_TextGearSpell.roundDecimal();
            pstats.sdPowers_TextCPCapSpell.roundDecimal("", "/");

            // Ability
            pstats.sdPowers_TextNameAbility = new myElement(createP("Ability"), "shrinkablePStatsMainP", pstats.sdPowers_DivName);
            pstats.sdPowers_TextBaseAbility = new myElement(createP(AllPowers.Ability.getBase()), "shrinkablePStatsMainFivePieceP", pstats.sdPowers_DivBase);
            pstats.sdPowers_TextGearAbility = new myElement(createP(AllPowers.Ability.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdPowers_DivGear);
            pstats.sdPowers_TextTotalAbility = new myElement(createP(AllPowers.Ability.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdPowers_DivTotal);

            pstats.sdPowers_TextTotalAbility.round();

            pstats.sdPowers_MiniDivCPCapAbility = new myElement(createDiv(), "", pstats.sdPowers_DivCpCap);
            pstats.sdPowers_InputCPCapAbility = new myElement(createInput(AllPowers.Ability.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdPowers_MiniDivCPCapAbility, null, () => {
                let x = parseInt(pstats.sdPowers_InputCPCapAbility.value());
                x = isNaN(x) ? 0 : x;
                AllPowers.Ability.setCPCount(x);
                pstats.sdPowers_TextTotalAbility.html(AllPowers.Ability.getPointsTotalForStatsPage());
                pstats.sdPowers_TextTotalAbility.round();
            }, null, null, true, AllPowers.Ability.getCPCap());
            pstats.sdPowers_TextCPCapAbility = new myElement(createP("/" + AllPowers.Ability.getCPCap()), "shrinkablePStatsMainFivePieceP", pstats.sdPowers_MiniDivCPCapAbility);
            pstats.sdPowers_MiniDivCPCapAbility.style("display", "flex");
            pstats.sdPowers_InputCPCapAbility.style("max-width", "45%");
            pstats.sdPowers_InputCPCapAbility.style("min-width", "45%");
            pstats.sdPowers_InputCPCapAbility.style("text-align", "center");
            pstats.sdPowers_InputCPCapAbility.style("margin-top", "0");
            pstats.sdPowers_TextCPCapAbility.style("margin-top", "2px");

            pstats.sdPowers_TextBaseAbility.roundDecimal();
            pstats.sdPowers_TextGearAbility.roundDecimal();
            pstats.sdPowers_TextCPCapAbility.roundDecimal("", "/");

            let addPowerToList = (power) => {
                let divNameAbility = new myElement(createDiv(), "", pstats.sdPowers_DivName);
                let buttonNameAbility = new myElement(createButton("X"), "shrinkablePGearButton", divNameAbility, () => {
                    if (confirm("Do you want to delete " + power.name + "?")) {
                        power.setCPCount(0);
                        power.isShownOnList = false;

                        textNameAbility.remove();
                        textBaseAbility.remove();
                        textGearAbility.remove();
                        textTotalAbility.remove();
                        inputCPCapAbility.remove();
                        textCPCapAbility.remove();
                        buttonNameAbility.remove();
                        miniDivCPCapAbility.remove();
                        divNameAbility.remove();
                    }
                });
                let textNameAbility = new myElement(createP(power.name), "shrinkablePStatsMainP", divNameAbility);
                let textBaseAbility = new myElement(createP(power.getBase()), "shrinkablePStatsMainFivePieceP", pstats.sdPowers_DivBase);
                let textGearAbility = new myElement(createP(power.getGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdPowers_DivGear);
                let textTotalAbility = new myElement(createP(power.getPointsTotalForStatsPage()), "shrinkablePStatsMainFivePieceP", pstats.sdPowers_DivTotal);

                textTotalAbility.round();

                let miniDivCPCapAbility = new myElement(createDiv(), "", pstats.sdPowers_DivCpCap);
                let inputCPCapAbility = new myElement(createInput(power.getCPCount()), "shrinkablePAbilitiesNotesLittleInput", miniDivCPCapAbility, null, () => {
                    let x = parseInt(inputCPCapAbility.value());
                    x = isNaN(x) ? 0 : x;
                    power.setCPCount(x);
                    textTotalAbility.html(power.getPointsTotalForStatsPage());
                    textTotalAbility.round();
                }, null, null, true, power.getCPCap());
                let textCPCapAbility = new myElement(createP("/" + power.getCPCap()), "shrinkablePStatsMainFivePieceP", miniDivCPCapAbility);

                textBaseAbility.roundDecimal();
                textGearAbility.roundDecimal();
                textCPCapAbility.roundDecimal("", "/");

                miniDivCPCapAbility.style("display", "flex");
                miniDivCPCapAbility.style("margin-top", "0.7px");

                inputCPCapAbility.style("max-width", "45%");
                inputCPCapAbility.style("min-width", "45%");
                inputCPCapAbility.style("text-align", "center");
                inputCPCapAbility.style("margin-top", "0");

                buttonNameAbility.style("min-width", "15%");
                buttonNameAbility.style("max-width", "15%");
                buttonNameAbility.style("height", "100%");
                buttonNameAbility.style("margin-top", "0");

                divNameAbility.style("margin-block-start", "0.437em");
                divNameAbility.style("margin-block-end", "0.437em");
                divNameAbility.style("height", "16px");
                divNameAbility.style("display", "flex");
                divNameAbility.style("min-width", "100%")

                textNameAbility.style("margin-block-start", "0px");
                textNameAbility.style("margin-block-end", "0px");
                textNameAbility.style("margin-top", "0px");
                textNameAbility.style("min-width", "80%");
                textCPCapAbility.style("margin-top", "2px")
            }

            // Added Powers
            for (let i = 0; i < allPowersArray.length; ++i) {
                if (allPowersArray[i].isShownOnList) {
                    addPowerToList(allPowersArray[i]);
                }
            }

            pstats.sdPowers_DivAddedPowers = new myElement(createDiv(), "", pstats.sdPowers);
            pstats.sdPowers_SelectAddedPowers = new myElement(createSelect(), "shrinkablePStatsMainSelect", pstats.sdPowers_DivAddedPowers, null, null, () => {
                let val = pstats.sdPowers_SelectAddedPowers.value();
                if (val != "Select Power") {
                    let power = getPowerByName(val);
                    power.isShownOnList = true;
                    addPowerToList(power);
                }
                pstats.sdPowers_SelectAddedPowers.selectValue(0);
            });

            let options = ["Select Power"];
            for (let i = 0; i < allPowersArray.length; ++i) {
                if (allPowersArray[i].getCPCap() != 0 && allPowersArray[i].name != "Spell" && allPowersArray[i].name != "Ability") {
                    options.push(allPowersArray[i].name);
                }
            }

            pstats.sdPowers_SelectAddedPowers.option(options);

            pstats.sdPowers_SelectAddedPowers.style("font-size", "100%");
            pstats.sdPowers_DivAddedPowers.style("display", "flex");
            pstats.sdPowers_DivAddedPowers.style("min-width", "100%");
        }
    });
    pstats.sdPowersText = new myElement(createP("+ Powers"), "shrinkableHeader", pstats.sdPowers);

    // Shrinkable Miscellaneous
    pstats.sdMiscellaneous = new myElement(createDiv(), "shrinkableDiv");
    pstats.sdMiscellaneousCheckBox = new myElement(createInput("", "checkbox"), "shrinkableInputField", pstats.sdMiscellaneous, null, () => {
        pstats.sdMiscellaneousCheckBox.swapChecked(); // This is for updating the isChecked variable inside the element.
        let hidden = pstats.sdMiscellaneousText.html().indexOf("+ Miscellaneous") != -1 ? false : true;
        pstats.sdMiscellaneousText.html((hidden ? "+ Miscellaneous" : "- Miscellaneous"));

        if (hidden) {
            openedSections[17] = 0;
            pstats.sdMiscellaneousText.class("shrinkableHeader");

            Object.keys(pstats).forEach(function (key) {
                if (key.startsWith("sdMiscellaneous") && key != "sdMiscellaneous" && key != "sdMiscellaneousCheckBox" && key != "sdMiscellaneousText") {
                    pstats[key].remove();
                    delete pstats[key];
                }
            });
        }
        else {
            openedSections[17] = 1;
            pstats.sdMiscellaneousText.class("shrinkableHeaderHidden");

            // Bottom of Miscellaneous Info
            pstats.sdMiscellaneous_DivMiscellaneousStats = new myElement(createDiv(), "shrinkablePStatsMainBigSingularDiv", pstats.sdMiscellaneous);
            pstats.sdMiscellaneous_DivName = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivBig", pstats.sdMiscellaneous_DivMiscellaneousStats);
            pstats.sdMiscellaneous_DivBase = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivLittle", pstats.sdMiscellaneous_DivMiscellaneousStats);
            pstats.sdMiscellaneous_DivCpCap = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivLittle", pstats.sdMiscellaneous_DivMiscellaneousStats);
            pstats.sdMiscellaneous_DivGear = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivLittle", pstats.sdMiscellaneous_DivMiscellaneousStats);
            pstats.sdMiscellaneous_DivTotal = new myElement(createDiv(), "shrinkablePStatsMainFivePieceDivLittle", pstats.sdMiscellaneous_DivMiscellaneousStats);

            pstats.sdMiscellaneous_TextHeaderName = new myElement(createP("Name"), "shrinkablePStatsMainLeftHeaderP", pstats.sdMiscellaneous_DivName);
            pstats.sdMiscellaneous_TextHeaderBase = new myElement(createP("Base"), "shrinkablePStatsMainCenterHeaderP", pstats.sdMiscellaneous_DivBase);
            pstats.sdMiscellaneous_TextHeaderCpCap = new myElement(createP("Cp/Cap"), "shrinkablePStatsMainCenterHeaderP", pstats.sdMiscellaneous_DivCpCap);
            pstats.sdMiscellaneous_TextHeaderGear = new myElement(createP("Gear"), "shrinkablePStatsMainCenterHeaderP", pstats.sdMiscellaneous_DivGear);
            pstats.sdMiscellaneous_TextHeaderTotal = new myElement(createP("Total"), "shrinkablePStatsMainCenterHeaderP", pstats.sdMiscellaneous_DivTotal);

            pstats.sdMiscellaneous_DivName.style("min-width", "30%");
            pstats.sdMiscellaneous_DivCpCap.style("min-width", "25%");
            pstats.sdMiscellaneous_DivCpCap.style("max-width", "25%");
            // CarryCapacity
            pstats.sdMiscellaneous_TextNameCarryCapacity = new myElement(createP("Carry Capacity"), "shrinkablePStatsMainP", pstats.sdMiscellaneous_DivName);
            pstats.sdMiscellaneous_TextBaseCarryCapacity = new myElement(createP(mainChar.stats.getCarryCapacityBase()), "shrinkablePStatsMainFivePieceP", pstats.sdMiscellaneous_DivBase);
            pstats.sdMiscellaneous_TextGearCarryCapacity = new myElement(createP(mainChar.stats.getCarryCapacityGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdMiscellaneous_DivGear);
            pstats.sdMiscellaneous_TextTotalCarryCapacity = new myElement(createP(mainChar.stats.getCarryCapacityBase() + mainChar.cpStats.getCarryCapacityCount() + mainChar.stats.getCarryCapacityGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdMiscellaneous_DivTotal);

            pstats.sdMiscellaneous_TextTotalCarryCapacity.round();

            pstats.sdMiscellaneous_MiniDivCPCapCarryCapacity = new myElement(createDiv(), "", pstats.sdMiscellaneous_DivCpCap);
            pstats.sdMiscellaneous_InputCPCapCarryCapacity = new myElement(createInput(mainChar.cpStats.getCarryCapacityCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdMiscellaneous_MiniDivCPCapCarryCapacity, null, () => {
                let x = parseInt(pstats.sdMiscellaneous_InputCPCapCarryCapacity.value());
                x = isNaN(x) ? 0 : x;
                mainChar.cpStats.setCarryCapacityBought(x);
                pstats.sdMiscellaneous_TextTotalCarryCapacity.html(mainChar.stats.getCarryCapacityBase() + mainChar.cpStats.getCarryCapacityCount() + mainChar.stats.getCarryCapacityGearModifier());
                pstats.sdMiscellaneous_TextTotalCarryCapacity.round();
            }, null, null, true, mainChar.cpStats.getCarryCapacityCap());
            pstats.sdMiscellaneous_TextCPCapCarryCapacity = new myElement(createP("/" + mainChar.cpStats.getCarryCapacityCap()), "shrinkablePStatsMainFivePieceP", pstats.sdMiscellaneous_MiniDivCPCapCarryCapacity);
            pstats.sdMiscellaneous_MiniDivCPCapCarryCapacity.style("display", "flex");
            pstats.sdMiscellaneous_InputCPCapCarryCapacity.style("max-width", "45%");
            pstats.sdMiscellaneous_InputCPCapCarryCapacity.style("min-width", "45%");
            pstats.sdMiscellaneous_InputCPCapCarryCapacity.style("text-align", "center");
            pstats.sdMiscellaneous_InputCPCapCarryCapacity.style("margin-top", "0");
            pstats.sdMiscellaneous_TextCPCapCarryCapacity.style("margin-top", "2px");

            pstats.sdMiscellaneous_TextBaseCarryCapacity.roundDecimal();
            pstats.sdMiscellaneous_TextGearCarryCapacity.roundDecimal();
            pstats.sdMiscellaneous_TextCPCapCarryCapacity.roundDecimal("", "/");

            // QckStp
            pstats.sdMiscellaneous_TextNameQuickStep = new myElement(createP("Quick Step"), "shrinkablePStatsMainP", pstats.sdMiscellaneous_DivName);
            pstats.sdMiscellaneous_TextBaseQuickStep = new myElement(createP(mainChar.stats.getQuickStepBase()), "shrinkablePStatsMainFivePieceP", pstats.sdMiscellaneous_DivBase);
            pstats.sdMiscellaneous_TextGearQuickStep = new myElement(createP(mainChar.stats.getQuickStepGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdMiscellaneous_DivGear);
            pstats.sdMiscellaneous_TextTotalQuickStep = new myElement(createP(mainChar.stats.getQuickStepBase() + mainChar.cpStats.getQckStpCount() + mainChar.stats.getQuickStepGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdMiscellaneous_DivTotal);

            pstats.sdMiscellaneous_TextTotalQuickStep.roundToNearestFive();

            pstats.sdMiscellaneous_MiniDivCPCapQuickStep = new myElement(createDiv(), "", pstats.sdMiscellaneous_DivCpCap);
            pstats.sdMiscellaneous_InputCPCapQuickStep = new myElement(createInput(mainChar.cpStats.getQckStpCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdMiscellaneous_MiniDivCPCapQuickStep, null, () => {
                let x = parseInt(pstats.sdMiscellaneous_InputCPCapQuickStep.value());
                x = isNaN(x) ? 0 : x;
                mainChar.cpStats.setQckStpBought(x);
                pstats.sdMiscellaneous_TextTotalQuickStep.html(mainChar.stats.getQuickStepBase() + mainChar.cpStats.getQckStpCount() + mainChar.stats.getQuickStepGearModifier());
                pstats.sdMiscellaneous_TextTotalQuickStep.roundToNearestFive();
            }, null, null, true, mainChar.cpStats.getQckStpCap());
            pstats.sdMiscellaneous_TextCPCapQuickStep = new myElement(createP("/" + mainChar.cpStats.getQckStpCap()), "shrinkablePStatsMainFivePieceP", pstats.sdMiscellaneous_MiniDivCPCapQuickStep);
            pstats.sdMiscellaneous_MiniDivCPCapQuickStep.style("display", "flex");
            pstats.sdMiscellaneous_InputCPCapQuickStep.style("max-width", "45%");
            pstats.sdMiscellaneous_InputCPCapQuickStep.style("min-width", "45%");
            pstats.sdMiscellaneous_InputCPCapQuickStep.style("text-align", "center");
            pstats.sdMiscellaneous_InputCPCapQuickStep.style("margin-top", "0");
            pstats.sdMiscellaneous_TextCPCapQuickStep.style("margin-top", "2px");

            pstats.sdMiscellaneous_TextBaseQuickStep.roundDecimal();
            pstats.sdMiscellaneous_TextGearQuickStep.roundDecimal();
            pstats.sdMiscellaneous_TextCPCapQuickStep.roundDecimal("", "/");

            // OTAs
            pstats.sdMiscellaneous_TextNameOTAs = new myElement(createP("OTAs"), "shrinkablePStatsMainP", pstats.sdMiscellaneous_DivName);
            pstats.sdMiscellaneous_TextBaseOTAs = new myElement(createP(mainChar.stats.getOTAsBase()), "shrinkablePStatsMainFivePieceP", pstats.sdMiscellaneous_DivBase);
            pstats.sdMiscellaneous_TextGearOTAs = new myElement(createP(mainChar.stats.getOTAsGearModifier()), "shrinkablePStatsMainFivePieceP", pstats.sdMiscellaneous_DivGear);
            pstats.sdMiscellaneous_TextTotalOTAs = new myElement(createP(mainChar.stats.getOTAsBase() + mainChar.cpStats.getOTAsCount() + mainChar.stats.getOTAsBase()), "shrinkablePStatsMainFivePieceP", pstats.sdMiscellaneous_DivTotal);

            pstats.sdMiscellaneous_TextTotalOTAs.round();

            pstats.sdMiscellaneous_MiniDivCPCapOTAs = new myElement(createDiv(), "", pstats.sdMiscellaneous_DivCpCap);
            pstats.sdMiscellaneous_InputCPCapOTAs = new myElement(createInput(mainChar.cpStats.getOTAsCount()), "shrinkablePAbilitiesNotesLittleInput", pstats.sdMiscellaneous_MiniDivCPCapOTAs, null, () => {
                let x = parseInt(pstats.sdMiscellaneous_InputCPCapOTAs.value());
                x = isNaN(x) ? 0 : x;
                mainChar.cpStats.setOTAsBought(x);
                pstats.sdMiscellaneous_TextTotalOTAs.html(mainChar.stats.getOTAsBase() + mainChar.cpStats.getOTAsCount() + mainChar.stats.getOTAsBase());
                pstats.sdMiscellaneous_TextTotalOTAs.round();
            }, null, null, true, mainChar.cpStats.getOTAsCap());
            pstats.sdMiscellaneous_TextCPCapOTAs = new myElement(createP("/" + mainChar.cpStats.getOTAsCap()), "shrinkablePStatsMainFivePieceP", pstats.sdMiscellaneous_MiniDivCPCapOTAs);
            pstats.sdMiscellaneous_MiniDivCPCapOTAs.style("display", "flex");
            pstats.sdMiscellaneous_InputCPCapOTAs.style("max-width", "45%");
            pstats.sdMiscellaneous_InputCPCapOTAs.style("min-width", "45%");
            pstats.sdMiscellaneous_InputCPCapOTAs.style("text-align", "center");
            pstats.sdMiscellaneous_InputCPCapOTAs.style("margin-top", "0");
            pstats.sdMiscellaneous_TextCPCapOTAs.style("margin-top", "2px");

            pstats.sdMiscellaneous_TextBaseOTAs.roundDecimal();
            pstats.sdMiscellaneous_TextGearOTAs.roundDecimal();
            pstats.sdMiscellaneous_TextCPCapOTAs.roundDecimal("", "/");
        }
    });
    pstats.sdMiscellaneousText = new myElement(createP("+ Miscellaneous"), "shrinkableHeader", pstats.sdMiscellaneous);

    if (openedSections[9]) pstats.sdMainCheckBox.onInput();
    if (openedSections[10]) pstats.sdAttributesCheckBox.onInput();
    if (openedSections[11]) pstats.sdVSDefensesCheckBox.onInput();
    if (openedSections[12]) pstats.sdDamageRedCheckBox.onInput();
    if (openedSections[13]) pstats.sdVSEnviroCheckBox.onInput();
    if (openedSections[14]) pstats.sdMovementCheckBox.onInput();
    if (openedSections[15]) pstats.sdSkillsCheckBox.onInput();
    if (openedSections[16]) pstats.sdPowersCheckBox.onInput();
    if (openedSections[17]) pstats.sdMiscellaneousCheckBox.onInput();
}
function setupPageDetails() {
    let resetMainDiv = (alwaysOpen = true) => {
        let isChecked = pdetails.sdMainCheckBox.isChecked();
        pdetails.sdMainCheckBox.onInput();

        if (!isChecked && !alwaysOpen)
            pdetails.sdMainCheckBox.onInput();
        if (isChecked) // If it was open at first, we should reopen it at this point because we just closed it. We are trying to reset it.
            pdetails.sdMainCheckBox.onInput();
    }
    let resetTrainingDiv = (alwaysOpen = true) => {
        let isChecked = pdetails.sdTrainingCheckBox.isChecked();
        pdetails.sdTrainingCheckBox.onInput();

        if (!isChecked && !alwaysOpen)
            pdetails.sdTrainingCheckBox.onInput();
        if (isChecked) // If it was open at first, we should reopen it at this point because we just closed it. We are trying to reset it.
            pdetails.sdTrainingCheckBox.onInput();
    }
    let resetQualityDiv = (alwaysOpen = true) => {
        let isChecked = pdetails.sdQualityCheckBox.isChecked();
        pdetails.sdQualityCheckBox.onInput();

        if (!isChecked && !alwaysOpen)
            pdetails.sdQualityCheckBox.onInput();
        if (isChecked) // If it was open at first, we should reopen it at this point because we just closed it. We are trying to reset it.
            pdetails.sdQualityCheckBox.onInput();
    }
    var showMainPage = () => {
        openedSections[18] = 1;
        pdetails.sdMainText.html("- Main");
        pdetails.sdMainText.class("shrinkableHeaderHidden");

        pdetails.sdMain_BigDiv = new myElement(createDiv(), "shrinkablePAbilitiesBigDiv", pdetails.sdMain);

        // Race
        pdetails.sdMain_DivRace = new myElement(createDiv(), "shrinkableDivInput", pdetails.sdMain_BigDiv);
        pdetails.sdMain_TextRace = new myElement(createP("Race: "), "shrinkablePX", pdetails.sdMain_DivRace);
        pdetails.sdMain_InputRace = new myElement(createInput(mainChar.getRace()), "shrinkableInputText", pdetails.sdMain_DivRace, null, () => {
            mainChar.setRace(pdetails.sdMain_InputRace.value());
        });
        pdetails.sdMain_TextRace.style("margin-top", "10px");

        // Type
        pdetails.sdMain_DivType = new myElement(createDiv(), "shrinkableDivInput", pdetails.sdMain_BigDiv);
        pdetails.sdMain_TextType = new myElement(createP("Type: "), "shrinkablePX", pdetails.sdMain_DivType);
        pdetails.sdMain_InputType = new myElement(createInput(mainChar.getType()), "shrinkableInputText", pdetails.sdMain_DivType, null, () => {
            mainChar.setType(pdetails.sdMain_InputType.value());
        });
        pdetails.sdMain_TextType.style("margin-top", "10px");

        // Alignment & Sex
        pdetails.sdMain_DivAlignmentSex = new myElement(createDiv(), "shrinkableDivInput", pdetails.sdMain_BigDiv);
        pdetails.sdMain_DivAlignmentSex.style("display", "flex");

        pdetails.sdMain_DivAlignment = new myElement(createDiv(), "shrinkableDivInput", pdetails.sdMain_DivAlignmentSex);
        pdetails.sdMain_TextAlignment = new myElement(createP("Alignment: "), "shrinkablePX", pdetails.sdMain_DivAlignment);
        pdetails.sdMain_InputAlignment = new myElement(createInput(mainChar.getAlignment()), "shrinkableInputText", pdetails.sdMain_DivAlignment, null, () => {
            mainChar.setAlignment(pdetails.sdMain_InputAlignment.value());
        });
        pdetails.sdMain_TextAlignment.style("margin-top", "10px");

        // Sex
        pdetails.sdMain_DivSex = new myElement(createDiv(), "shrinkableDivInput", pdetails.sdMain_DivAlignmentSex);
        pdetails.sdMain_TextSex = new myElement(createP("Sex: "), "shrinkablePX", pdetails.sdMain_DivSex);
        pdetails.sdMain_InputSex = new myElement(createInput(mainChar.getSex()), "shrinkableInputText", pdetails.sdMain_DivSex, null, () => {
            mainChar.setSex(pdetails.sdMain_InputSex.value());
        });
        pdetails.sdMain_TextSex.style("margin-top", "10px");

        pdetails.sdMain_DivAlignment.style("max-width", "48%");
        pdetails.sdMain_DivSex.style("max-width", "48%");

        // Hair & Eyes
        pdetails.sdMain_DivHairEyes = new myElement(createDiv(), "shrinkableDivInput", pdetails.sdMain_BigDiv);
        pdetails.sdMain_DivHairEyes.style("display", "flex");

        pdetails.sdMain_DivHair = new myElement(createDiv(), "shrinkableDivInput", pdetails.sdMain_DivHairEyes);
        pdetails.sdMain_TextHair = new myElement(createP("Hair: "), "shrinkablePX", pdetails.sdMain_DivHair);
        pdetails.sdMain_InputHair = new myElement(createInput(mainChar.getHair()), "shrinkableInputText", pdetails.sdMain_DivHair, null, () => {
            mainChar.setHair(pdetails.sdMain_InputHair.value());
        });
        pdetails.sdMain_TextHair.style("margin-top", "10px");

        // Eyes
        pdetails.sdMain_DivEyes = new myElement(createDiv(), "shrinkableDivInput", pdetails.sdMain_DivHairEyes);
        pdetails.sdMain_TextEyes = new myElement(createP("Eyes: "), "shrinkablePX", pdetails.sdMain_DivEyes);
        pdetails.sdMain_InputEyes = new myElement(createInput(mainChar.getEyes()), "shrinkableInputText", pdetails.sdMain_DivEyes, null, () => {
            mainChar.setEyes(pdetails.sdMain_InputEyes.value());
        });
        pdetails.sdMain_TextEyes.style("margin-top", "10px");

        pdetails.sdMain_DivHair.style("max-width", "48%");
        pdetails.sdMain_DivEyes.style("max-width", "48%");

        // Height Weight
        pdetails.sdMain_DivSplitTwo = new myElement(createDiv(), "shrinkableDivInput", pdetails.sdMain_BigDiv);
        pdetails.sdMain_DivHeight = new myElement(createDiv(), "shrinkableDivInput", pdetails.sdMain_DivSplitTwo);
        pdetails.sdMain_TextHeight = new myElement(createP("Height: "), "shrinkablePX", pdetails.sdMain_DivHeight);
        pdetails.sdMain_InputHeight = new myElement(createInput(mainChar.getHeight()), "shrinkableInputText", pdetails.sdMain_DivHeight, null, () => {
            mainChar.setHeight(pdetails.sdMain_InputHeight.value());
        }, () => {
            pdetails.sdMain_InputHeight.value(mainChar.getHeight());
        });
        pdetails.sdMain_DivWeight = new myElement(createDiv(), "shrinkableDivInput", pdetails.sdMain_DivSplitTwo);
        pdetails.sdMain_TextWeight = new myElement(createP("Weight: "), "shrinkablePX", pdetails.sdMain_DivWeight);
        pdetails.sdMain_InputWeight = new myElement(createInput(mainChar.getWeight()), "shrinkableInputText", pdetails.sdMain_DivWeight, null, () => {
            mainChar.setWeight(pdetails.sdMain_InputWeight.value());
        }, () => {
            pdetails.sdMain_InputWeight.value(mainChar.getWeight());
        });
        pdetails.sdMain_DivSplitTwo.style("display", "flex");
        pdetails.sdMain_DivSplitTwo.style("min-width", "100%");
        pdetails.sdMain_TextHeight.style("margin-top", "10px");
        pdetails.sdMain_TextWeight.style("margin-top", "10px");

        pdetails.sdMain_DivWeight.style("min-width", "15px");
        pdetails.sdMain_DivWeight.style("max-width", "120px");
        pdetails.sdMain_DivHeight.style("min-width", "15px");
        pdetails.sdMain_DivHeight.style("max-width", "120px");

        pdetails.sdMain_InputWeight.style("text-align", "center");
        pdetails.sdMain_InputHeight.style("text-align", "center");

        // Age and Exp
        pdetails.sdMain_DivSplitTwo = new myElement(createDiv(), "shrinkableDivInput", pdetails.sdMain_BigDiv);
        pdetails.sdMain_DivAge = new myElement(createDiv(), "shrinkableDivInput", pdetails.sdMain_DivSplitTwo);
        pdetails.sdMain_TextAge = new myElement(createP("Age: "), "shrinkablePX", pdetails.sdMain_DivAge);
        pdetails.sdMain_InputAge = new myElement(createInput(mainChar.getAge()), "shrinkableInputText", pdetails.sdMain_DivAge, null, () => {
            mainChar.setAge(pdetails.sdMain_InputAge.value());
        }, () => {
            pdetails.sdMain_InputAge.value(mainChar.getAge());
        });
        pdetails.sdMain_DivExp = new myElement(createDiv(), "shrinkableDivInput", pdetails.sdMain_DivSplitTwo);
        pdetails.sdMain_TextExp = new myElement(createP("Exp: "), "shrinkablePX", pdetails.sdMain_DivExp);
        pdetails.sdMain_InputExp = new myElement(createInput(mainChar.getExp()), "shrinkableInputText", pdetails.sdMain_DivExp, null, () => {
            mainChar.setExp(pdetails.sdMain_InputExp.value());
        }, () => {
            pdetails.sdMain_InputExp.value(mainChar.getExp());
            resetMainDiv(false);
        });
        pdetails.sdMain_DivSplitTwo.style("display", "flex");
        pdetails.sdMain_DivSplitTwo.style("min-width", "100%");
        pdetails.sdMain_TextAge.style("margin-top", "10px");
        pdetails.sdMain_TextExp.style("margin-top", "10px");

        pdetails.sdMain_DivExp.style("min-width", "15px");
        pdetails.sdMain_DivExp.style("max-width", "120px");
        pdetails.sdMain_DivAge.style("min-width", "15px");
        pdetails.sdMain_DivAge.style("max-width", "120px");

        pdetails.sdMain_InputExp.style("text-align", "center");
        pdetails.sdMain_InputAge.style("text-align", "center");

        // MaxCP
        pdetails.sdMain_DivMaxCP = new myElement(createDiv(), "shrinkableDivInput", pdetails.sdMain_BigDiv);
        pdetails.sdMain_TextMaxCP = new myElement(createP("CpLeft/MaxCp: " + Math.round(mainChar.stats.getCP()) + "/" + Math.round(mainChar.stats.getMaxCP())), "shrinkablePX", pdetails.sdMain_DivMaxCP);
        pdetails.sdMain_TextMaxCP.style("margin-top", "10px");
        pdetails.sdMain_TextMaxCP.style("min-width", "90%");
        pdetails.sdMain_TextMaxCP.style("font-size", "100%");
    };
    var hideMainPage = () => {
        openedSections[18] = 0;
        pdetails.sdMainText.html("+ Main");
        pdetails.sdMainText.class("shrinkableHeader");

        Object.keys(pdetails).forEach(function (key) {
            if (key.startsWith("sdMain") && key != "sdMain" && key != "sdMainCheckBox" && key != "sdMainText") {
                pdetails[key].remove();
                delete pdetails[key];
            }
        });
    };

    // Shrinkable Main
    pdetails.sdMain = new myElement(createDiv(), "shrinkableDiv");
    pdetails.sdMainCheckBox = new myElement(createInput("", "checkbox"), "shrinkableInputField", pdetails.sdMain, null, () => {
        let hidden = pdetails.sdMainText.html().indexOf("+ Main") != -1 ? false : true;

        if (hidden) hideMainPage();
        else showMainPage();
    });
    pdetails.sdMainText = new myElement(createP("+ Main"), "shrinkableHeader", pdetails.sdMain);

    // Shrinkable Training
    var addTraining = (training, div, isTraining = true) => {
        let masterSpec = training.masterSpecType;
        let DivToHoldEm = new myElement(createDiv(), "", div);
        let DivToHoldEmLeft = new myElement(createDiv(), "", DivToHoldEm);
        let DivToHoldEmRight = new myElement(createDiv(), "", DivToHoldEm);

        if (masterSpec != MASTERSPECTYPES.Stats || training.isCustom) {
            let DeleteButton = new myElement(createButton("X"), "shrinkablePGearButton", DivToHoldEmLeft, () => {
                if (confirm("Do you want to delete " + training.name + "?")) {
                    training.delete();

                    DivToHoldEm.remove();
                    resetMainDiv(false);
                    if (isTraining) resetTrainingDiv();
                    else resetQualityDiv();
                }
            });

            DeleteButton.style("width", "10%");
            DeleteButton.style("min-width", "20px");
            DeleteButton.style("height", "18px");
            DeleteButton.style("margin-left", "5px");
        }

        let DescText = new myElement(createP("- " + training.getFullDesc()), "shrinkablePDetailsTrainingP", DivToHoldEmLeft);
        let CPCostText = new myElement(createP(training.getCPCost() == 0 ? (training.name.indexOf("Perimeter") != -1 || training.name.indexOf("Body Size") != -1 || training.name.indexOf("Body Type") != -1 ? "0" : "") : Math.round(training.getCPCost())), "shrinkablePDetailsTrainingP", DivToHoldEmRight);

        if (training.isSwappable) {
            let SwapButton = new myElement(createButton(isTraining ? ">" : "<"), "shrinkablePGearButton", DivToHoldEmRight, () => {
                if (training.points != null) { // If its a Stat
                    var response = prompt("Please enter the amount you want to swap!");
                    if (response == null) return; // when you click cancel...

                    if (!isNaN(parseFloat(response))) {
                        let amount = parseFloat(response);
                        if (training.swap(amount)) {
                            DivToHoldEm.remove();

                            if (isTraining) resetTrainingDiv();
                            else resetQualityDiv();
                        }
                        else {
                            DescText.html("- " + training.getFullDesc());
                            CPCostText.html(training.getCPCost() == 0 ? "" : Math.round(training.getCPCost()));
                        }

                        if (isTraining) resetQualityDiv();
                        else resetTrainingDiv();
                    }
                }
                else { // If its a Spec
                    training.swap();
                    DivToHoldEm.remove();

                    resetMainDiv(false);
                    resetQualityDiv();
                    resetTrainingDiv();
                }
            });

            SwapButton.style("width", "10%");
            SwapButton.style("min-width", "20px");
            SwapButton.style("height", "18px");
            SwapButton.style("margin-left", "-15%");
        }

        if (masterSpec == MASTERSPECTYPES.Martial || masterSpec == MASTERSPECTYPES.Supernatural) {
            CPCostText.html(Math.round(training.spec.getCpCost()));

            let rankInput = new myElement(createInput(training.spec.rank), "shrinkablePGearButton", DivToHoldEmLeft, null, () => {
                let x = rankInput.value();
                x = isNaN(parseInt(x)) ? training.spec.rank : parseInt(x);

                training.changeRank(x);
                CPCostText.html(Math.round(training.spec.getCpCost()));
                rankInput.html(training.spec.rank);
            });

            rankInput.style("margin-bottom", "5px");
            rankInput.style("width", "10%");
            rankInput.style("min-width", "20px");
            rankInput.style("height", "18px");
            rankInput.style("margin-left", "5px");
        }

        DivToHoldEmLeft.style("min-width", "75%");
        DivToHoldEmLeft.style("display", "flex");
        DivToHoldEmRight.style("min-width", "20%");
        DivToHoldEmRight.style("display", "flex");
        CPCostText.style("min-width", "100%");

        DescText.style("margin-left", "15px");
        CPCostText.style("text-align", "center");
        DivToHoldEm.style("width", "100%");
        DivToHoldEm.style("display", "flex");
    }
    let addNewTraining = (_bigDiv) => {
        let div = new myElement(createDiv(), "shrinkablePGearQualityDiv", _bigDiv);

        let select1 = new myElement(createSelect(), "shrinkablePGearInput", div, null, null, () => { check(select1.value(), 0); });
        let select2 = new myElement(createSelect(), "shrinkablePGearInput", div, null, null, () => { check(select2.value(), 1); });
        let select3 = new myElement(createSelect(), "shrinkablePGearInput", div, null, null, () => { check(select3.value(), 2); });

        let select4 = new myElement(createSelect(), "shrinkablePGearInput", div, null, null, () => { check(select4.value(), 3); }); // SubSelects
        let select5 = new myElement(createSelect(), "shrinkablePGearInput", div, null, null, () => { check(select5.value(), 4); });
        let select6 = new myElement(createSelect(), "shrinkablePGearInput", div, null, null, () => { check(select6.value(), 5); });
        let select7 = new myElement(createSelect(), "shrinkablePGearInput", div, null, null, () => { check(select7.value(), 6); });

        let addButton = new myElement(createButton("Add"), "shrinkablePGearButton", div);
        let inputFieldSpecial = new myElement(createInput(""), "shrinkablePGearInput", div); // Lordship: Creature
        let inputFieldSpecial2 = new myElement(createInput(""), "shrinkablePGearInput", div); // Lordship: Creature

        let selects = [select1, select2, select3, select4, select5, select6, select7];

        select1.option(["Select One", "Custom Training", "Magics*", "Specializations*"]);
        select2.style("display", "none");
        select3.style("display", "none");
        select4.style("display", "none");
        select5.style("display", "none");
        select6.style("display", "none");
        select7.style("display", "none");
        addButton.style("display", "none");
        inputFieldSpecial.style("display", "none");
        inputFieldSpecial2.style("display", "none");

        let check = (str, index) => {
            if (index == selects.length) return;

            if (addButton) addButton.remove();
            if (inputFieldSpecial) inputFieldSpecial.remove();
            if (inputFieldSpecial2) inputFieldSpecial2.remove();

            for (let i = index + 1; i < selects.length; ++i) {
                selects[i].remove();
                selects[i] = new myElement(createSelect(), "shrinkablePGearInput", div, null, null, () => {
                    check(selects[i].value(), i);
                });
            }

            if (str == "Magics*")
                selects[index + 1].option(["Arcane*", "Divine*", "Primal*"]);
            else if (str == "Specializations*")
                selects[index + 1].option(["Martial*", "Supernatural*"]);
            else if (str == "Arcane*")
                selects[index + 1].option(["Divination", "Evocation", "Abjuration", "Enchantment", "Conjuration", "Illusion", "Necromancy", "Transmutation"]);
            else if (str == "Divine*")
                selects[index + 1].option(["Sun", "War", "Weather", "Knowledge", "Fire", "Travel", "Air", "Creation", "Good", "Law", "Life", "Time", "Moon", "Protection", "Earth", "Prosperity", "Divination", "Evil", "Chaos", "Death", "Magic", "Nature", "Strength", "Water", "Trickery"]);
            else if (str == "Primal*")
                selects[index + 1].option(["Growth", "Air", "Animal", "Water", "Balance", "Fire", "Decay", "Earth", "Plant", "Astral"]);
            else if (str == "Martial*")
                selects[index + 1].option(["Brute", "Strong", "Swift", "Technical", "Tricky"]);
            else if (str == "Supernatural*")
                selects[index + 1].option(["Aeromancy", "Chloromancy", "Inquisitory", "Exorcism", "Order", "Aquamancy", "Cryomancy", "Healing", "Magnetism", "Entropy", "Geomancy", "Chronomancy", "Holy", "Gravitational", "Lordship: Creature", "Pyromancy", "Restructuring", "Shifting", "Unholy", "Metalmancy", "Shadowmancy", "Imbuing", "True Necromancy", "Beguiling", "Lordship: Summer", "Lordship: Spring", "Lordship: Autumn", "Lordship: Winter", "Light Magic", "Artificing", "Blight", "Osteomancy", "Plasmamancy", "Oraculemancy", "Taming", "Sandmancy"]);

            if (index + 1 != selects.length && selects[index + 1].value().indexOf("*") != -1) {
                check(selects[index + 1].value(), index + 1); // If the next one is a group, keep recursing
            }
            else {
                for (let i = index + 1; i < 7; ++i) if (selects[i].value() == "") selects[i].style("display", "none");

                if (selects[0].value() == "Custom Training") {
                    inputFieldSpecial = new myElement(createInput("Name"), "shrinkablePGearInput", div, () => { // Name
                        if (inputFieldSpecial.value() == "Name") inputFieldSpecial.value("");
                    }, null, null, () => {
                        if (inputFieldSpecial.value() == "" || inputFieldSpecial.value() == " ") inputFieldSpecial.value("Name");
                    });

                    inputFieldSpecial2 = new myElement(createInput("CP Cost"), "shrinkablePGearInput", div, () => { // Name
                        if (inputFieldSpecial2.value() == "CP Cost") inputFieldSpecial2.value("");
                    }, null, null, () => {
                        if (inputFieldSpecial2.value() == "" || inputFieldSpecial2.value() == " ") inputFieldSpecial2.value("CP Cost");
                    });

                    addButton = new myElement(createButton("Add"), "shrinkablePGearButton", div, () => {
                        let _name = inputFieldSpecial.value();
                        let _cpCost = inputFieldSpecial2.value();
                        _name = _name == "" || _name == " " ? _name = "Unnamed" : _name;
                        _cpCost = isNaN(parseInt(_cpCost)) ? 0 : parseInt(_cpCost);

                        createCustomTraining(_name, _cpCost);
                        div.remove();

                        // Reset Trainings Tab
                        let isChecked = pdetails.sdTrainingCheckBox.isChecked();
                        pdetails.sdTrainingCheckBox.onInput();

                        if (isChecked) // If it was open at first, we should reopen it at this point because we just closed it. We are trying to reset it.
                            pdetails.sdTrainingCheckBox.onInput();

                        resetMainDiv(false);
                    });
                    return;
                }
                if (selects[0].value() == "Select One") return;
                if (selects[1].value() == "Arcane*") { // Arcane
                    selects[3] = new myElement(createSelect(), "shrinkablePGearInput", div);
                    selects[3].option(["Minor", "Major", "Specialization"]);
                }
                if (selects[2].value() == "Lordship: Creature") { // Lordship: Creature
                    inputFieldSpecial = new myElement(createInput("Creature Name"), "shrinkablePGearInput", div, () => { // Name
                        if (inputFieldSpecial.value() == "Creature Name") inputFieldSpecial.value("");
                    }, null, null, () => {
                        if (inputFieldSpecial.value() == "" || inputFieldSpecial.value() == " ") inputFieldSpecial.value("Creature Name");
                    });

                    selects[3] = new myElement(createSelect(), "shrinkablePGearInput", div);
                    selects[3].option(["Select a Movement", "Ground", "Swim", "Climb", "Jump", "Burrow", "Flight"]);

                    selects[4] = new myElement(createSelect(), "shrinkablePGearInput", div);
                    selects[4].option(["Select a Damage Reduction", "Physical", "Blunt", "Slashing", "Piercing", "Neg. Energy", "Pos. Energy", "Fire", "Cold", "Lightning", "Acid", "Sonic", "Radiation"]);

                    selects[5] = new myElement(createSelect(), "shrinkablePGearInput", div);
                    selects[5].option(["Select a Defense", "Reflex", "Shapechange", "Balance", "Toxic", "Destruction", "Hold Pos.", "Compulsions", "Emotions", "Concentration", "Scry", "Grip", "Restrain"]);

                    selects[6] = new myElement(createSelect(), "shrinkablePGearInput", div);
                    selects[6].option(["Select a Defense", "Reflex", "Shapechange", "Balance", "Toxic", "Destruction", "Hold Pos.", "Compulsions", "Emotions", "Concentration", "Scry", "Grip", "Restrain"]);
                }

                addButton = new myElement(createButton("Add"), "shrinkablePGearButton", div, () => {
                    let masterSpecType = selects[0].value(); // Magics, Specializations
                    let masterSpec = selects[1].value();
                    let spec = selects[2].value();
                    let msType; // Arcane, Primal, Divine, Martial, Supernatural
                    let arcaneRank = 1;
                    let cName = null;
                    let mvmnt = null;
                    let dr = null;
                    let def1 = null;
                    let def2 = null;

                    if (masterSpecType == "Select One") return; // If a master spec isn't selected, return.

                    if (masterSpec == "Arcane*") {
                        msType = AllMasterSpecs.Arcane;
                        arcaneRank = selects[3].selectValue() + 2; // Minor, Major, Specialization ranks
                    }
                    else if (masterSpec == "Divine*") msType = AllMasterSpecs.Divine;
                    else if (masterSpec == "Primal*") msType = AllMasterSpecs.Primal;
                    else if (masterSpec == "Martial*") msType = AllMasterSpecs.Martial;
                    else if (masterSpec == "Supernatural*") msType = AllMasterSpecs.Supernatural;
                    if (spec == "Lordship: Creature") {
                        cName = inputFieldSpecial.value();
                        mvmnt = selects[3].value();
                        dr = selects[4].value();
                        def1 = selects[5].value();
                        def2 = selects[6].value();

                        if (cName == "" || cName == " ") cName = "Unnamed";
                        if (mvmnt == "Select a Movement") {
                            alert("Please select a Movement for your Creature!");
                            return;
                        }
                        if (dr == "Select a Damage Reduction") {
                            alert("Please select a Damage Reduction for your Creature!");
                            return;
                        }
                        if (def1 == "Select a Defense" || def2 == "Select a Defense") {
                            alert("Please select both Defenses for your Creature!");
                            return;
                        }
                    }

                    newTraining(spec, null, null, arcaneRank, msType, true, null, cName, mvmnt, def1, def2, dr);
                    div.remove();

                    // Reset Trainings Tab
                    let isChecked = pdetails.sdTrainingCheckBox.isChecked();
                    pdetails.sdTrainingCheckBox.onInput();

                    if (isChecked) // If it was open at first, we should reopen it at this point because we just closed it. We are trying to reset it.
                        pdetails.sdTrainingCheckBox.onInput();

                    resetMainDiv(false);
                });
            }
        }
    }
    // Arcane, Divine, Primal.. ETC
    let makeModularGroup = (masterSpec, masterSpecType, ModularBigDiv, isTraining = true, headerName = "") => {
        let ArcaneTrainings = [];

        if (headerName != "Custom") ArcaneTrainings = masterSpec != null ? (isTraining ? getTrainingsByMasterSpecType(masterSpecType) : getQualitiesByMasterSpecType(masterSpecType)) : (isTraining ? getTrainingsStats() : getQualitiesStats());
        else ArcaneTrainings = isTraining ? getAllCustomTrainings() : getAllCustomQualities();

        if (ArcaneTrainings.length != 0) { // Only show this section if it has members.
            let ArcaneBigDiv = new myElement(createDiv(), "shrinkablePAbilitiesBigDiv", ModularBigDiv);
            let ArcaneHeaderDiv = new myElement(createDiv(), "shrinkablePAbilitiesBigDiv", ArcaneBigDiv);
            let ArcaneHeaderLeftDiv = new myElement(createDiv(), "ArcaneHeaderDiv", ArcaneHeaderDiv);
            let ArcaneHeaderRightDiv = new myElement(createDiv(), "ArcaneHeaderDiv", ArcaneHeaderDiv);

            ArcaneHeaderDiv.style("display", "flex");
            ArcaneHeaderLeftDiv.style("display", "flex");
            ArcaneHeaderLeftDiv.style("min-width", "75%");
            ArcaneHeaderRightDiv.style("min-width", "20%");

            if (masterSpec && masterSpecType != MASTERSPECTYPES.Martial && masterSpecType != MASTERSPECTYPES.Supernatural) {
                let ArcaneHeaderCPCost = new myElement(createP(masterSpec.getCPCost()), "shrinkablePDetailsP", ArcaneHeaderRightDiv);
                let ArcaneHeaderName = new myElement(createP(masterSpec.name), "shrinkablePDetailsP", ArcaneHeaderLeftDiv);
                let ArcaneHeaderRank = new myElement(createInput(masterSpec.getRank()), "shrinkablePGearInput", ArcaneHeaderLeftDiv, null, null, () => {
                    let x = ArcaneHeaderRank.value();
                    x = isNaN(parseInt(x)) ? 1 : parseInt(x); // Number Check
                    x = x <= 0 ? 1 : x; // Negativity Check

                    masterSpec.setRank(x);
                    ArcaneHeaderRank.value(masterSpec.getRank());
                    ArcaneHeaderCPCost.html(masterSpec.getCPCost());

                    resetMainDiv(false);
                    resetTrainingDiv(isTraining);
                    resetQualityDiv(!isTraining);
                });

                ArcaneHeaderName.style("max-width", "70%");
                ArcaneHeaderRank.style("min-width", "10%");
                ArcaneHeaderRank.style("max-width", "10%");
                ArcaneHeaderRank.style("text-align", "center");
                ArcaneHeaderRank.style("padding-left", "0px");
                ArcaneHeaderCPCost.style("text-align", "center");
                ArcaneHeaderCPCost.style("margin-left", "10px");
            } else {
                let HeaderName = new myElement(createP(headerName), "shrinkablePDetailsP", ArcaneHeaderLeftDiv);
                HeaderName.style("max-width", "70%");
            }

            // List All Trainings
            for (let i = 0; i < ArcaneTrainings.length; ++i)
                addTraining(ArcaneTrainings[i], ArcaneBigDiv, isTraining);
        }
    }

    pdetails.sdTraining = new myElement(createDiv(), "shrinkableDiv");
    pdetails.sdTrainingCheckBox = new myElement(createInput("", "checkbox"), "shrinkableInputField", pdetails.sdTraining, null, () => {
        pdetails.sdTrainingCheckBox.swapChecked(); // This is for updating the isChecked variable inside the element.
        let hidden = pdetails.sdTrainingText.html().indexOf("+ Training") != -1 ? false : true;

        if (hidden) {
            openedSections[19] = 0;
            pdetails.sdTrainingText.html("+ Training");
            pdetails.sdTrainingText.class("shrinkableHeader");

            Object.keys(pdetails).forEach(function (key) {
                if (key.startsWith("sdTraining") && key != "sdTraining" && key != "sdTrainingCheckBox" && key != "sdTrainingText") {
                    pdetails[key].remove();
                    delete pdetails[key];
                }
            });
        }
        else {
            openedSections[19] = 1;
            pdetails.sdTrainingText.html("- Training");
            pdetails.sdTrainingText.class("shrinkableHeaderHidden");

            // Biggest Div to hold em all!
            pdetails.sdTrainingBiggestDiv = new myElement(createDiv(), "shrinkablePAbilitiesBigDiv", pdetails.sdTraining);

            // New Training Button
            let NewTrainingDiv = new myElement(createDiv(), "shrinkablePAbilitiesBigDiv", pdetails.sdTrainingBiggestDiv);
            let NewTrainingButton = new myElement(createButton("New Training"), "shrinkablePGearButton", NewTrainingDiv, () => {
                if (NewTrainingDiv.child().length == 1) // If the tab is not open, then open the tab.
                    addNewTraining(NewTrainingDiv);
            });
            NewTrainingDiv.style("margin-left", "15px");
            NewTrainingDiv.style("width", "90%");
            NewTrainingDiv.style("max-width", "350px");

            // Modular Divs, Like Arcane, Divine, Stats...
            let ModularBigDiv = new myElement(createDiv(), "shrinkablePAbilitiesBigDiv", pdetails.sdTrainingBiggestDiv);
            let ModularHeaderDiv = new myElement(createDiv(), "shrinkablePAAbilitiesBigDiv", ModularBigDiv);
            ModularBigDiv.style("background-color", "rgb(58, 54, 54)");
            ModularBigDiv.style("margin-top", "10px");
            ModularBigDiv.style("margin-left", "20px");
            ModularBigDiv.style("width", "90%");
            ModularHeaderDiv.style("display", "flex");

            let ModularHeaderPName = new myElement(createP("Name"), "shrinkablePDetailsHeaderP", ModularHeaderDiv);
            let ModularHeaderPCPCost = new myElement(createP("CPCost"), "shrinkablePDetailsHeaderP", ModularHeaderDiv);
            ModularHeaderPName.style("min-width", "75%");
            ModularHeaderPCPCost.style("min-width", "20%");
            ModularHeaderPCPCost.style("text-align", "center");

            // Custom
            makeModularGroup(null, null, ModularBigDiv, true, "Custom");
            // Arcane
            makeModularGroup(AllMasterSpecs.Arcane, MASTERSPECTYPES.Arcane, ModularBigDiv);
            // Divine
            makeModularGroup(AllMasterSpecs.Divine, MASTERSPECTYPES.Divine, ModularBigDiv);
            // Primal
            makeModularGroup(AllMasterSpecs.Primal, MASTERSPECTYPES.Primal, ModularBigDiv);
            // Martial
            makeModularGroup(AllMasterSpecs.Martial, MASTERSPECTYPES.Martial, ModularBigDiv, true, "Martial");
            // Supernatural
            makeModularGroup(AllMasterSpecs.Supernatural, MASTERSPECTYPES.Supernatural, ModularBigDiv, true, "Supernatural");
            // Stats
            makeModularGroup(null, MASTERSPECTYPES.Stats, ModularBigDiv, true, "Stats");
        }
    });
    pdetails.sdTrainingText = new myElement(createP("+ Training"), "shrinkableHeader", pdetails.sdTraining);

    // Shrinkable Quality
    pdetails.sdQuality = new myElement(createDiv(), "shrinkableDiv");
    pdetails.sdQualityCheckBox = new myElement(createInput("", "checkbox"), "shrinkableInputField", pdetails.sdQuality, null, () => {
        pdetails.sdQualityCheckBox.swapChecked(); // This is for updating the isChecked variable inside the element.
        let hidden = pdetails.sdQualityText.html().indexOf("+ Quality") != -1 ? false : true;

        if (hidden) {
            openedSections[20] = 0;
            pdetails.sdQualityText.html("+ Quality");
            pdetails.sdQualityText.class("shrinkableHeader");

            Object.keys(pdetails).forEach(function (key) {
                if (key.startsWith("sdQuality") && key != "sdQuality" && key != "sdQualityCheckBox" && key != "sdQualityText") {
                    pdetails[key].remove();
                    delete pdetails[key];
                }
            });
        }
        else {
            openedSections[20] = 1;
            pdetails.sdQualityText.html("- Quality");
            pdetails.sdQualityText.class("shrinkableHeaderHidden");

            // Biggest Div to hold em all!
            pdetails.sdQualityBiggestDiv = new myElement(createDiv(), "shrinkablePAbilitiesBigDiv", pdetails.sdQuality);

            // Modular Divs, Like Arcane, Divine, Stats...
            let ModularBigDiv = new myElement(createDiv(), "shrinkablePAbilitiesBigDiv", pdetails.sdQualityBiggestDiv);
            let ModularHeaderDiv = new myElement(createDiv(), "shrinkablePAAbilitiesBigDiv", ModularBigDiv);
            ModularBigDiv.style("background-color", "rgb(58, 54, 54)");
            ModularBigDiv.style("margin-top", "10px");
            ModularBigDiv.style("margin-left", "20px");
            ModularBigDiv.style("width", "90%");
            ModularHeaderDiv.style("display", "flex");

            let ModularHeaderPName = new myElement(createP("Name"), "shrinkablePDetailsHeaderP", ModularHeaderDiv);
            let ModularHeaderPCPCost = new myElement(createP("CPCost"), "shrinkablePDetailsHeaderP", ModularHeaderDiv);
            ModularHeaderPName.style("min-width", "75%");
            ModularHeaderPCPCost.style("min-width", "20%");
            ModularHeaderPCPCost.style("text-align", "center");

            // Custom
            makeModularGroup(null, null, ModularBigDiv, false, "Custom");
            // Arcane
            makeModularGroup(AllMasterSpecs.Arcane, MASTERSPECTYPES.Arcane, ModularBigDiv, false);
            // Divine
            makeModularGroup(AllMasterSpecs.Divine, MASTERSPECTYPES.Divine, ModularBigDiv, false);
            // Primal
            makeModularGroup(AllMasterSpecs.Primal, MASTERSPECTYPES.Primal, ModularBigDiv, false);
            // Martial
            makeModularGroup(AllMasterSpecs.Martial, MASTERSPECTYPES.Martial, ModularBigDiv, false, "Martial");
            // Supernatural
            makeModularGroup(AllMasterSpecs.Supernatural, MASTERSPECTYPES.Supernatural, ModularBigDiv, false, "Supernatural");
            // Stats
            makeModularGroup(null, MASTERSPECTYPES.Stats, ModularBigDiv, false, "Stats");
        }
    });
    pdetails.sdQualityText = new myElement(createP("+ Quality"), "shrinkableHeader", pdetails.sdQuality);

    // Shrinkable Languages
    pdetails.sdLanguages = new myElement(createDiv(), "shrinkableDiv");
    pdetails.sdLanguagesCheckBox = new myElement(createInput("", "checkbox"), "shrinkableInputField", pdetails.sdLanguages, null, () => {
        let hidden = pdetails.sdLanguagesText.html().indexOf("+ Languages") != -1 ? false : true;

        if (hidden) {
            openedSections[21] = 0;
            pdetails.sdLanguagesText.html("+ Languages");
            pdetails.sdLanguagesText.class("shrinkableHeader");

            Object.keys(pdetails).forEach(function (key) {
                if (key.startsWith("sdLanguages") && key != "sdLanguages" && key != "sdLanguagesCheckBox" && key != "sdLanguagesText") {
                    pdetails[key].remove();
                    delete pdetails[key];
                }
            });
        }
        else {
            openedSections[21] = 1;
            pdetails.sdLanguagesText.html("- Languages");
            pdetails.sdLanguagesText.class("shrinkableHeaderHidden");

            pdetails.sdLanguagesDiv = new myElement(createDiv(), "shrinkablePAbilitiesDivDescription", pdetails.sdLanguages);
            pdetails.sdLanguagesInput = new myElement(createElement("textarea"), "shrinkablePAbilitiesTextArea", pdetails.sdLanguagesDiv, () => {
                if (pdetails.sdLanguagesInput.value() == "Languages")
                    pdetails.sdLanguagesInput.value("");
            }, () => {
                mainChar.languages = pdetails.sdLanguagesInput.value();
            }, null, () => {
                if (pdetails.sdLanguagesInput.value() == "")
                    pdetails.sdLanguagesInput.value("Languages");
            });
            pdetails.sdLanguagesInput.value(mainChar.languages == "" ? "Languages" : mainChar.languages);
        }
    });
    pdetails.sdLanguagesText = new myElement(createP("+ Languages"), "shrinkableHeader", pdetails.sdLanguages);

    // Shrinkable Quirks
    pdetails.sdQuirks = new myElement(createDiv(), "shrinkableDiv");
    pdetails.sdQuirksCheckBox = new myElement(createInput("", "checkbox"), "shrinkableInputField", pdetails.sdQuirks, null, () => {
        let hidden = pdetails.sdQuirksText.html().indexOf("+ Quirks") != -1 ? false : true;

        if (hidden) {
            openedSections[22] = 0;
            pdetails.sdQuirksText.html("+ Quirks");
            pdetails.sdQuirksText.class("shrinkableHeader");

            Object.keys(pdetails).forEach(function (key) {
                if (key.startsWith("sdQuirks") && key != "sdQuirks" && key != "sdQuirksCheckBox" && key != "sdQuirksText") {
                    pdetails[key].remove();
                    delete pdetails[key];
                }
            });
        }
        else {
            openedSections[22] = 1;
            pdetails.sdQuirksText.html("- Quirks");
            pdetails.sdQuirksText.class("shrinkableHeaderHidden");

            pdetails.sdQuirksDiv = new myElement(createDiv(), "shrinkablePAbilitiesDivDescription", pdetails.sdQuirks);
            pdetails.sdQuirksInput = new myElement(createElement("textarea"), "shrinkablePAbilitiesTextArea", pdetails.sdQuirksDiv, () => {
                if (pdetails.sdQuirksInput.value() == "Quirks")
                    pdetails.sdQuirksInput.value("");
            }, () => {
                mainChar.quirks = pdetails.sdQuirksInput.value();
            }, null, () => {
                if (pdetails.sdQuirksInput.value() == "")
                    pdetails.sdQuirksInput.value("Quirks");
            });
            pdetails.sdQuirksInput.value(mainChar.quirks == "" ? "Quirks" : mainChar.quirks);
        }
    });
    pdetails.sdQuirksText = new myElement(createP("+ Quirks"), "shrinkableHeader", pdetails.sdQuirks);

    // Shrinkable Biography
    pdetails.sdBiography = new myElement(createDiv(), "shrinkableDiv");
    pdetails.sdBiographyCheckBox = new myElement(createInput("", "checkbox"), "shrinkableInputField", pdetails.sdBiography, null, () => {
        let hidden = pdetails.sdBiographyText.html().indexOf("+ Biography") != -1 ? false : true;

        if (hidden) {
            openedSections[23] = 0;
            pdetails.sdBiographyText.html("+ Biography");
            pdetails.sdBiographyText.class("shrinkableHeader");

            Object.keys(pdetails).forEach(function (key) {
                if (key.startsWith("sdBiography") && key != "sdBiography" && key != "sdBiographyCheckBox" && key != "sdBiographyText") {
                    pdetails[key].remove();
                    delete pdetails[key];
                }
            });
        }
        else {
            openedSections[23] = 1;
            pdetails.sdBiographyText.html("- Biography");
            pdetails.sdBiographyText.class("shrinkableHeaderHidden");

            pdetails.sdBiographyDiv = new myElement(createDiv(), "shrinkablePAbilitiesDivDescription", pdetails.sdBiography);
            pdetails.sdBiographyInput = new myElement(createElement("textarea"), "shrinkablePAbilitiesTextArea", pdetails.sdBiographyDiv, () => {
                if (pdetails.sdBiographyInput.value() == "Biography")
                    pdetails.sdBiographyInput.value("");
            }, () => {
                mainChar.biography = pdetails.sdBiographyInput.value();
            }, null, () => {
                if (pdetails.sdBiographyInput.value() == "")
                    pdetails.sdBiographyInput.value("Biography");
            });
            pdetails.sdBiographyInput.value(mainChar.biography == "" ? "Biography" : mainChar.biography);
        }
    });
    pdetails.sdBiographyText = new myElement(createP("+ Biography"), "shrinkableHeader", pdetails.sdBiography);

    if (openedSections[18]) pdetails.sdMainCheckBox.onInput();
    if (openedSections[19]) pdetails.sdTrainingCheckBox.onInput();
    if (openedSections[20]) pdetails.sdQualityCheckBox.onInput();
    if (openedSections[21]) pdetails.sdLanguagesCheckBox.onInput();
    if (openedSections[22]) pdetails.sdQuirksCheckBox.onInput();
    if (openedSections[23]) pdetails.sdBiographyCheckBox.onInput();
}
function setupPageGear() {
    pgear.allWeapons = [];
    pgear.allEquipments = []; // Besides the main ones. This wont include them.
    pgear.allCarryings = [];

    let addNewQuality = (_bigDiv, targetEquipment, qual = null) => {
        let quality = qual ? qual : null;
        let div = new myElement(createDiv(), "shrinkablePGearQualityDiv", _bigDiv);

        let select1 = new myElement(createSelect(), "shrinkablePGearInput", div, null, null, () => { check(select1.value(), 0); });
        let select2 = new myElement(createSelect(), "shrinkablePGearInput", div, null, null, () => { check(select2.value(), 1); });
        let select3 = new myElement(createSelect(), "shrinkablePGearInput", div, null, null, () => { check(select3.value(), 2); });
        let select4 = new myElement(createSelect(), "shrinkablePGearInput", div, null, null, () => { check(select4.value(), 3); });
        let select5 = new myElement(createSelect(), "shrinkablePGearInput", div, null, null, () => { check(select5.value(), 4); });
        let select6 = new myElement(createSelect(), "shrinkablePGearInput", div, null, null, () => { check(select6.value(), 5); });
        let selects = [select1, select2, select3, select4, select5, select6];
        let inputField = new myElement(createInput(0), "shrinkablePGearInput", div, null, null, null, () => {
            let val = isNaN(parseInt(inputField.value())) ? 0 : parseInt(inputField.value());
            inputField.value(val);
            if (quality) quality.changeValue(val);
        });
        let deleteButton = new myElement(createButton("Delete"), "shrinkablePGearButton", div, () => {
            if (confirm("Do you want to destroy this Quality?")) {
                if (quality) targetEquipment.removeQuality(quality);
                div.remove();
            }
        });
        let inputFieldSpecial = new myElement(createInput(quality ? quality.specialQuality : ""), "shrinkablePGearInput", div, null, () => {
            if (quality) quality.specialQuality = inputFieldSpecial.value();
        });

        select1.option(["Select One", "Special Quality", "Statistics*"]);
        select2.style("display", "none");
        select3.style("display", "none");
        select4.style("display", "none");
        select5.style("display", "none");
        select6.style("display", "none");
        inputField.style("display", "none");
        deleteButton.style("display", "none");
        inputFieldSpecial.remove();

        let loadQuality = (valueArr, index = 0) => {
            inputField.remove();
            deleteButton.remove();

            if (valueArr[index] == -1 || index == valueArr.length) {
                for (let i = index; i < 6; ++i) selects[i].remove();

                inputField = new myElement(createInput(quality ? quality.value : 0), "shrinkablePGearInput", div, null, null, null, () => {
                    let val = isNaN(parseInt(inputField.value())) ? 0 : parseInt(inputField.value());
                    inputField.value(val);
                    if (quality) quality.changeValue(val);
                });

                deleteButton = new myElement(createButton("Delete"), "shrinkablePGearButton", div, () => {
                    if (confirm("Do you want to destroy this Quality?")) {
                        if (quality) targetEquipment.removeQuality(quality);
                        div.remove();
                    }
                });
                return;
            }
            for (let i = index + 1; i < 6; ++i) {
                selects[i].remove();
                selects[i] = new myElement(createSelect(), "shrinkablePGearInput", div, null, null, () => {
                    check(selects[i].value(), i);
                });
            }

            selects[index].selectValue(valueArr[index]);

            let str = selects[index].value();
            index += 1;
            if (str == "Statistics*")
                selects[index].option(["Main*", "Attributes*", "Defenses*", "Movement*", "Skills*", "Other*"]);
            else if (str == "Attributes*")
                selects[index].option(["Strength", "Agility", "Intelligence", "Discipline", "Conviction", "Attunement", "Constitution"]);
            else if (str == "Main*")
                selects[index].option(["Hit Points", "Stamina", "Mana", "Accuracy", "Parry", "Damage"]);
            else if (str == "Defenses*")
                selects[index].option(["Vs Defenses*", "Vs Environment*", "Damage Reductions*"]);
            else if (str == "Vs Defenses*")
                selects[index].option(["Major*", "Magics*", "Technology", "Nature", "Objects*", "Creatures*", "Alignments*", "Luck"]);
            else if (str == "Vs Environment*")
                selects[index].option(["Spot", "Listen", "Scent", "Environment Hot", "Environment Cold", "Breathe", "Surprise", "Traps"]);
            else if (str == "Damage Reductions*")
                selects[index].option(["Physical", "Blunt", "Slashing", "Piercing", "Fire", "Cold", "Acid", "Lightning", "Pos. Energy", "Neg. Energy", "Sonic", "Radiation"]);
            else if (str == "Major*")
                selects[index].option(["Reflex", "Compulsions", "Shapeshift", "Emotions", "Balance"]);
            else if (str == "Magics*")
                selects[index].option(["Magic", "Arcane", "Divine", "Primal", "Blood", "Gem", "Witchcraft"]);
            else if (str == "Objects*")
                selects[index].option(["Object Group*", "Metal", "Stone", "Bone"]);
            else if (str == "Object Group*")
                selects[index].option(["Blades", "Axes", "Maces/Hammers", "Polearms", "Bows", "Guns", "Crossbows"]);
            else if (str == "Creatures*")
                selects[index].option(["Add Creature"]);
            else if (str == "Alignments*")
                selects[index].option(["Specific*", "Type Group*"]);
            else if (str == "Specific*")
                selects[index].option(["Lawful Good", "Chaotic Good", "Neutral Good", "Lawful Neutral", "True Neutral",
                    "Chaotic Neutral", "Neutral Evil", "Lawful Evil", "Chaotic Evil"]);
            else if (str == "Type Group*")
                selects[index].option(["Lawful", "Chaotic", "Good", "Evil", "Neutral"]);
            else if (str == "Movement*")
                selects[index].option(["Ground", "Swim", "Climb", "Jump", "Burrow", "Movement Flight"]);
            else if (str == "Skills*")
                selects[index].option(["Crafting*", "Perform*", "Other*"]);
            else if (str == "Crafting*")
                selects[index].option(["Alchemy", "Brews", "Oils and Balms", "Toxins", "Homunculi", "Explosives", "Transmogrify", "Blacksmith",
                    "Armorsmith", "Weaponsmith", "Carpentry", "Fletchery", "Leatherwork", "Tailor", "Trapmaking", "Engineering"]);
            else if (str == "Perform*")
                selects[index].option(["Acting", "Escape Artist", "Sleight of Hand"]);
            else if (str == "Other*")
                selects[index].option(["Hide", "Move Silently", "Disguise", "Medicine", "Survival", "Track", "Flight", "Insight", "Bluff", "Diplomacy",
                    "Intimidate", "Pick Lock", "Pick Pocket"]);
            else if (str == "Other*")
                selects[index].option(["Carry Capacity", "QuickSteps", "OTAs"]);

            loadQuality(valueArr, index);
        }
        let check = (str, index) => {
            if (quality && select1.selectValue() == 0) {
                quality.getEquipment().removeQuality(quality);
            }
            else if (quality && select1.selectValue() == 1) {
                let _newQuality2 = newGearQuality(QualityTypes.Custom, 0, targetEquipment);
                targetEquipment.changeQuality(quality, _newQuality2);
                quality = _newQuality2;
            }
            else if (select1.selectValue() == 1) {
                quality = newGearQuality(QualityTypes.Custom, 0, targetEquipment);
                targetEquipment.addQuality(quality);
            }
            if (quality) { // update quality
                quality.selectedIndexArray[0] = select1.selectValue();
                quality.selectedIndexArray[1] = select2.selectValue();
                quality.selectedIndexArray[2] = select3.selectValue();
                quality.selectedIndexArray[3] = select4.selectValue();
                quality.selectedIndexArray[4] = select5.selectValue();
                quality.selectedIndexArray[5] = select6.selectValue();
            }

            if (index == selects.length) return;

            if (str == "Special Quality") {
                inputFieldSpecial = new myElement(createInput(quality ? quality.specialQuality : ""), "shrinkablePGearInput", div, null, () => {
                    if (quality) quality.specialQuality = inputFieldSpecial.value();
                });
            }
            else inputFieldSpecial.remove();
            inputField.remove();
            deleteButton.remove();

            for (let i = index + 1; i < 6; ++i) {
                selects[i].remove();
                selects[i] = new myElement(createSelect(), "shrinkablePGearInput", div, null, null, () => {
                    check(selects[i].value(), i);
                });
            }

            index += 1;
            if (str == "Statistics*")
                selects[index].option(["Main*", "Attributes*", "Defenses*", "Movement*", "Skills*", "Other*"]);
            else if (str == "Attributes*")
                selects[index].option(["Strength", "Agility", "Intelligence", "Discipline", "Conviction", "Attunement", "Constitution"]);
            else if (str == "Main*")
                selects[index].option(["Hit Points", "Stamina", "Mana", "Accuracy", "Parry", "Damage"]);
            else if (str == "Defenses*")
                selects[index].option(["Vs Defenses*", "Vs Environment*", "Damage Reductions*"]);
            else if (str == "Vs Defenses*")
                selects[index].option(["Major*", "Magics*", "Technology", "Nature", "Objects*", "Creatures*", "Alignments*", "Luck"]);
            else if (str == "Vs Environment*")
                selects[index].option(["Spot", "Listen", "Scent", "Environment Hot", "Environment Cold", "Breathe", "Surprise", "Traps"]);
            else if (str == "Damage Reductions*")
                selects[index].option(["Physical", "Blunt", "Slashing", "Piercing", "Fire", "Cold", "Acid", "Lightning", "Pos. Energy", "Neg. Energy", "Sonic", "Radiation"]);
            else if (str == "Major*")
                selects[index].option(["Reflex", "Compulsions", "Shapeshift", "Emotions", "Balance"]);
            else if (str == "Magics*")
                selects[index].option(["Magic", "Arcane", "Divine", "Primal", "Blood", "Gem", "Witchcraft"]);
            else if (str == "Objects*")
                selects[index].option(["Object Group*", "Metal", "Stone", "Bone"]);
            else if (str == "Object Group*")
                selects[index].option(["Blades", "Axes", "Maces/Hammers", "Polearms", "Bows", "Guns", "Crossbows"]);
            else if (str == "Creatures*")
                selects[index].option(["Add Creature"]);
            else if (str == "Alignments*")
                selects[index].option(["Specific*", "Type Group*"]);
            else if (str == "Specific*")
                selects[index].option(["Lawful Good", "Chaotic Good", "Neutral Good", "Lawful Neutral", "True Neutral",
                    "Chaotic Neutral", "Neutral Evil", "Lawful Evil", "Chaotic Evil"]);
            else if (str == "Type Group*")
                selects[index].option(["Lawful", "Chaotic", "Good", "Evil", "Neutral"]);
            else if (str == "Movement*")
                selects[index].option(["Ground", "Swim", "Climb", "Jump", "Burrow", "Movement Flight"]);
            else if (str == "Skills*")
                selects[index].option(["Crafting*", "Perform*", "Other*"]);
            else if (str == "Crafting*")
                selects[index].option(["Alchemy", "Brews", "Oils and Balms", "Toxins", "Homunculi", "Explosives", "Transmogrify", "Blacksmith",
                    "Armorsmith", "Weaponsmith", "Carpentry", "Fletchery", "Leatherwork", "Tailor", "Trapmaking", "Engineering"]);
            else if (str == "Perform*")
                selects[index].option(["Acting", "Escape Artist", "Sleight of Hand"]);
            else if (str == "Other*")
                selects[index].option(["Hide", "Move Silently", "Disguise", "Medicine", "Survival", "Track", "Flight", "Insight", "Bluff", "Diplomacy",
                    "Intimidate", "Pick Lock", "Pick Pocket"]);
            else if (str == "Other*")
                selects[index].option(["Carry Capacity", "QuickSteps", "OTAs"]);

            index -= 1;

            if (index + 1 != selects.length && selects[index + 1].value().indexOf("*") != -1) {
                check(selects[index + 1].value(), index + 1);
            }
            else {
                for (let i = index + 1; i < 6; ++i) if (selects[i].value() == "") selects[i].style("display", "none");

                if (index == 0) {
                    if (str == "Special Quality") {
                        deleteButton = new myElement(createButton("Delete"), "shrinkablePGearButton", div, () => {
                            if (confirm("Do you want to destroy this Quality?")) {
                                if (quality) targetEquipment.removeQuality(quality);
                                div.remove();
                            }
                        });
                    }

                    return;
                }

                if (select1.selectValue() != 1) {
                    inputField = new myElement(createInput(quality ? quality.value : 0), "shrinkablePGearInput", div, null, null, null, () => {
                        let val = isNaN(parseInt(inputField.value())) ? 0 : parseInt(inputField.value());
                        inputField.value(val);
                        if (quality) quality.changeValue(val);
                    });
                }

                deleteButton = new myElement(createButton("Delete"), "shrinkablePGearButton", div, () => {
                    if (confirm("Do you want to destroy this Quality?")) {
                        if (quality) targetEquipment.removeQuality(quality);
                        div.remove();
                    }
                });

                if (selects[index].value().indexOf("*") != -1) index++;

                let val = isNaN(parseInt(inputField.value())) ? 0 : parseInt(inputField.value());
                let qualityType = getGearQualityByName(selects[index].value());
                let _newQuality = newGearQuality(qualityType, val, targetEquipment, selects[index].value());

                if (quality && quality.id != _newQuality.id) quality.getEquipment().changeQuality(quality, _newQuality);
                else _newQuality.getEquipment().addQuality(_newQuality);

                quality = _newQuality;
                quality.selectedIndexArray = [selects[0].selectValue(), selects[1].selectValue(), selects[2].selectValue(), selects[3].selectValue(), selects[4].selectValue(), selects[5].selectValue()];
            }
        }

        if (quality) {
            loadQuality(quality.selectedIndexArray);
            if (quality.selectedIndexArray[0] == 1) {
                inputFieldSpecial = new myElement(createInput(quality ? quality.specialQuality : ""), "shrinkablePGearInput", div, null, () => {
                    quality.specialQuality = inputFieldSpecial.value();
                });

                inputFieldSpecial.value(quality.specialQuality);
                inputField.remove();
            }
        }
    }
    var addWeapon = (wep) => {
        let weapon = wep == null ? mainChar.gear.newWeapon() : wep;
        // Lets make them Shrinkable!
        var weaponName = (weapon.name != "" ? weapon.name : "Unnamed");
        let shrinkableDiv = new myElement(createDiv(), "shrinkableAbilitiesDiv", pgear.sdWeapons_BigDiv);
        let shrinkableCheckBox = new myElement(createInput("", "checkbox"), "shrinkableAbilitiesInputField", shrinkableDiv, null, () => {
            let weaponName = (weapon.name != "" ? weapon.name : "Unnamed");

            let hidden = shrinkableText.html().indexOf("+ " + weaponName) != -1 ? false : true;
            shrinkableText.html((hidden ? "+ " + weaponName : "- " + weaponName));

            if (hidden) {
                shrinkableText.class("shrinkableAbilitiesHeader");
                shrinkableDiv.child()[2].remove(); // Big Div
            }
            else {
                shrinkableText.class("shrinkableAbilitiesHeaderHidden");

                // Actual Stuff...
                let BigDiv = new myElement(createDiv(), "shrinkablePAbilitiesDiv", shrinkableDiv);

                // First Row
                let DivFirst = new myElement(createDiv(), "shrinkablePGearDiv", BigDiv);
                let InputName = new myElement(createInput(weapon.name), "shrinkablePGearInput", DivFirst, () => {
                    if (InputName.value() == "Unnamed")
                        InputName.value("");
                }, () => {
                    weapon.name = InputName.value() == "" || InputName.value() == " " ? "Unnamed" : InputName.value();
                    shrinkableText.html("- " + weapon.name);
                }, null, () => {
                    if (InputName.value() == "" || InputName.value() == " ")
                        InputName.value(weapon.name);
                });

                // Second Row
                let DivSecond = new myElement(createDiv(), "shrinkablePGearSplitTwoDiv", BigDiv);
                let SelectType = new myElement(createSelect(), "shrinkablePGearInput", DivSecond, null, null, () => {
                    let selectedIndex = SelectType.selectValue();
                    weapon.type = selectedIndex;
                });
                SelectType.option(["Natural", "Blade", "Mace/Hammer", "Axe", "Polearm", "Shield", "Thrown", "Sling", "Crossbow", "Gun", "Bow"]);
                SelectType.selectValue(weapon.type); // Set to Default.

                let SelectSize = new myElement(createSelect(), "shrinkablePGearInput", DivSecond, null, null, () => {
                    let selectedIndex = SelectSize.selectValue();
                    weapon.size = selectedIndex;
                });
                SelectSize.option(["Light", "One-Handed", "Two-Handed"]);
                SelectSize.selectValue(weapon.size); // Set to Default.

                // Third Row
                let DivExtra = new myElement(createDiv(), "shrinkablePGearSplitTwoDiv", BigDiv);
                let TextExtra = new myElement(createP("Is Equipped:"), "shrinkablePGearP", DivExtra);
                let InputExtra = new myElement(createSelect(), "shrinkablePGearInput", DivExtra, null, null, () => {
                    let decision = InputExtra.selectValue() == 0 ? true: false;
                    weapon.isEquipped = decision;
                });
                InputExtra.option(["Yes", "No"]);
                InputExtra.selectValue(weapon.isEquipped ? 0: 1);

                // Third Row
                let DivThird = new myElement(createDiv(), "shrinkablePGearSplitTwoDiv", BigDiv);
                let TextTier = new myElement(createP("Tier:"), "shrinkablePGearP", DivThird);
                let InputTier = new myElement(createInput(weapon.tier), "shrinkablePGearInput", DivThird, null, () => {
                    let tier = isNaN(parseInt(InputTier.value())) ? weapon.tier : parseInt(InputTier.value());
                    weapon.tier = tier;
                }, null, () => {
                    InputTier.value(weapon.tier);
                });

                // Forth Row
                let DivForth = new myElement(createDiv(), "shrinkablePGearSplitTwoDiv", BigDiv);
                let TextAccProf = new myElement(createP("Acc. Prof:"), "shrinkablePGearP", DivForth);
                let InputAccProf = new myElement(createInput(weapon.accProf), "shrinkablePGearInput", DivForth, null, () => {
                    let accProf = isNaN(parseInt(InputAccProf.value())) ? weapon.accProf : parseInt(InputAccProf.value());
                    weapon.accProf = accProf;
                }, null, () => {
                    InputAccProf.value(weapon.accProf);
                });

                // Fifth Row
                let DivFifth = new myElement(createDiv(), "shrinkablePGearSplitTwoDiv", BigDiv);
                let TextParryProf = new myElement(createP("Parry Prof:"), "shrinkablePGearP", DivFifth);
                let InputParryProf = new myElement(createInput(weapon.parryProf), "shrinkablePGearInput", DivFifth, null, () => {
                    let parryProf = isNaN(parseInt(InputParryProf.value())) ? weapon.parryProf : parseInt(InputParryProf.value());
                    weapon.parryProf = parryProf;
                }, null, () => {
                    InputParryProf.value(weapon.parryProf);
                });

                // Sixth Row
                let DivSixth = new myElement(createDiv(), "shrinkablePGearSplitTwoDiv", BigDiv);
                let TextCritChance = new myElement(createP("Crit Chance:"), "shrinkablePGearP", DivSixth);
                let InputCritChance = new myElement(createInput(weapon.critChance + "%"), "shrinkablePGearInput", DivSixth, null, () => {
                    let text = InputCritChance.value();
                    text = text.replace("%", "");

                    let critChance = isNaN(parseInt(text)) ? weapon.critChance : parseInt(text);
                    weapon.critChance = critChance;
                }, null, () => {
                    InputCritChance.value(weapon.critChance + "%");
                });

                // Seventh Row
                let DivSeventh = new myElement(createDiv(), "shrinkablePGearSplitTwoDiv", BigDiv);
                let TextCritDamage = new myElement(createP("Crit Damage:"), "shrinkablePGearP", DivSeventh);
                let InputCritDamage = new myElement(createInput(weapon.critDamage + "%"), "shrinkablePGearInput", DivSeventh, () => {
                    let text = InputCritDamage.value();
                    text = text.replace("%", "");
                    InputCritDamage.value(text);
                }, () => {
                    let critDamage = isNaN(parseInt(InputCritDamage.value())) ? weapon.critDamage : parseInt(InputCritDamage.value());
                    weapon.critDamage = critDamage;
                }, null, () => {
                    InputCritDamage.value(weapon.critDamage + "%");
                });

                // Eighth Row
                let DivEighth = new myElement(createDiv(), "shrinkablePGearSplitTwoDiv", BigDiv);
                let TextDamage = new myElement(createP("Damage:"), "shrinkablePGearP", DivEighth);
                let InputDamage = new myElement(createInput(weapon.damage + "%"), "shrinkablePGearInput", DivEighth, () => {
                    let text = InputDamage.value();
                    text = text.replace("%", "");
                    InputDamage.value(text);
                }, () => {
                    let damage = isNaN(parseInt(InputDamage.value())) ? weapon.damage : parseInt(InputDamage.value());
                    weapon.damage = damage;
                }, null, () => {
                    InputDamage.value(weapon.damage + "%");
                });

                // Ninth Row
                let DivNinth = new myElement(createDiv(), "shrinkablePGearSplitTwoDiv", BigDiv);
                let TextRange = new myElement(createP("Range:"), "shrinkablePGearP", DivNinth);
                let InputRange = new myElement(createInput(weapon.range), "shrinkablePGearInput", DivNinth, null, () => {
                    let range = isNaN(parseInt(InputRange.value())) ? weapon.range : parseInt(InputRange.value());
                    weapon.range = range;
                }, null, () => {
                    InputRange.value(weapon.range);
                });

                // Tenth Row
                let DivTenth = new myElement(createDiv(), "shrinkablePGearSplitTwoDiv", BigDiv);
                let TextDamageType = new myElement(createP("Damage Type:"), "shrinkablePGearP", DivTenth);
                let InputDamageType = new myElement(createInput(weapon.damageType), "shrinkablePGearInput", DivTenth, null, () => {
                    let damageType = InputDamageType.value();
                    weapon.damageType = damageType;
                }, null, () => {
                    InputDamageType.value(weapon.damageType);
                });

                // Shrinkable Qualities
                let _shrinkableDiv = new myElement(createDiv(), "shrinkableAbilitiesDiv", BigDiv);
                let _shrinkableCheckBox = new myElement(createInput("", "checkbox"), "shrinkableAbilitiesInputField", _shrinkableDiv, null, () => {
                    let hidden = _shrinkableText.html().indexOf("+ Qualities") != -1 ? false : true;
                    _shrinkableText.html((hidden ? "+ Qualities" : "- Qualities"));

                    if (hidden) {
                        _shrinkableButton.style("display", "none");
                        _shrinkableText.class("shrinkableAbilitiesHeader");

                        BigDiv2.remove();
                        for (let i = 2; i < _shrinkableDiv.child().length; ++i) {
                            _shrinkableDiv.child()[i].remove(); // Big Div2
                        }
                    }
                    else {
                        BigDiv2 = new myElement(createDiv(), "shrinkablePGearDiv", _shrinkableDiv);
                        _shrinkableButton.style("display", "block");

                        for (let i = 0; i < weapon.qualities.length; ++i) {
                            addNewQuality(BigDiv2, weapon, weapon.qualities[i]);
                        }
                    }
                });
                let _shrinkableLittleDiv = new myElement(createDiv(), "shrinkableLittleDiv", _shrinkableDiv);
                let _shrinkableText = new myElement(createP("+ Qualities"), "shrinkableAbilitiesHeader", _shrinkableLittleDiv);
                let _shrinkableButton = new myElement(createButton("New"), "shrinkableLittleButton", _shrinkableLittleDiv, () => {
                    addNewQuality(BigDiv2, weapon);
                });
                let BigDiv2 = new myElement(createDiv(), "shrinkablePGearDiv", _shrinkableDiv);
                _shrinkableButton.style("display", "none");
                _shrinkableDiv.style("margin-left", "20px");

                // Custom Styles
                DivFirst.style("margin-top", "5px");
                DivThird.style("margin-top", "10px");
                InputName.style("min-width", "90%");

                InputTier.style("text-align", "center");
                InputTier.style("padding-left", 0);
                InputTier.style("min-width", "25%");

                InputAccProf.style("text-align", "center");
                InputAccProf.style("padding-left", 0);
                InputAccProf.style("min-width", "25%");

                InputParryProf.style("text-align", "center");
                InputParryProf.style("padding-left", 0);
                InputParryProf.style("min-width", "25%");

                InputCritChance.style("text-align", "center");
                InputCritChance.style("padding-left", 0);
                InputCritChance.style("min-width", "25%");

                InputCritDamage.style("text-align", "center");
                InputCritDamage.style("padding-left", 0);
                InputCritDamage.style("min-width", "25%");

                InputDamage.style("text-align", "center");
                InputDamage.style("padding-left", 0);
                InputDamage.style("min-width", "25%");

                InputRange.style("text-align", "center");
                InputRange.style("padding-left", 0);
                InputRange.style("min-width", "25%");

                InputDamageType.style("text-align", "center");
                InputDamageType.style("padding-left", 0);
                InputDamageType.style("min-width", "25%");
            }
        });
        let shrinkableLittleDiv = new myElement(createDiv(), "shrinkableLittleDiv", shrinkableDiv);
        let shrinkableText = new myElement(createP("+ " + weaponName), "shrinkableAbilitiesHeader", shrinkableLittleDiv);

        let shrinkableButton = new myElement(createButton("Delete"), "shrinkableLittleButton", shrinkableLittleDiv, () => {
            if (confirm("Do you want to destroy " + (weapon.name == "" ? "Unnamed" : weapon.name) + "?")) {
                mainChar.gear.removeWeapon(weapon.id);
                shrinkableDiv.remove();
            }
        });
        pgear.allWeapons.push(shrinkableDiv); // So we can delete them afterwards.

        if (wep == null) {
            pgear.sdWeapons_ButtonAdd.remove();

            pgear.sdWeapons_ButtonAdd = new myElement(createButton("New Weapon"), "shrinkablePGearButtonNewWeapon", pgear.sdWeapons_BigDiv, () => {
                addWeapon();
            });
        }
    }
    var showWeaponsPage = () => {
        openedSections[24] = 1;
        pgear.sdWeaponsText.html("- Weapons");
        pgear.sdWeaponsText.class("shrinkableHeaderHidden");

        pgear.sdWeapons_BigDiv = new myElement(createDiv(), "shrinkablePAbilitiesBigDiv", pgear.sdWeapons);
        // Load All Weapons
        for (let i = 0; i < mainChar.gear.weapons.length; ++i) {
            addWeapon(mainChar.gear.weapons[i]);
        }

        // After Loading, Add a button to the end.
        pgear.sdWeapons_ButtonAdd = new myElement(createButton("New Weapon"), "shrinkablePGearButtonNewWeapon", pgear.sdWeapons_BigDiv, () => {
            addWeapon();
        });
    }
    var hideWeaponsPage = () => {
        openedSections[24] = 0;
        pgear.sdWeaponsText.html("+ Weapons");
        pgear.sdWeaponsText.class("shrinkableHeader");

        for (let i = pgear.allWeapons.length - 1; i > -1; --i) {
            pgear.allWeapons[i].remove();
        }

        Object.keys(pgear).forEach(function (key) {
            if (key.startsWith("sdWeapons") && key != "sdWeapons" && key != "sdWeaponsCheckBox" && key != "sdWeaponsText") {
                pgear[key].remove();
                delete pgear[key];
            }
        });
    }

    var showArmor = () => {
        armor = mainChar.gear.equipments.armor;

        // Actual Stuff...
        let BigDiv = pgear.sdArmor_BigDiv;

        // First Row
        let DivFirst = new myElement(createDiv(), "shrinkablePGearDiv", BigDiv);
        let InputName = new myElement(createInput(armor.name == "" || armor.name == " " ? "Unnamed" : armor.name), "shrinkablePGearInput", DivFirst, () => {
            if (InputName.value() == "Unnamed")
                InputName.value("");
        }, () => {
            armor.name = InputName.value() == "" || InputName.value() == " " ? "Unnamed" : InputName.value();
        }, null, () => {
            if (InputName.value() == "" || InputName.value() == " ")
                InputName.value(armor.name);
        });

        // Second Row
        let DivSecond = new myElement(createDiv(), "shrinkablePGearDiv", BigDiv);
        let TextType = new myElement(createP("Armor Type: "), "shrinkablePGearP", DivSecond);
        let SelectType = new myElement(createSelect(), "shrinkablePGearInput", DivSecond, null, null, () => {
            let selectedIndex = SelectType.selectValue();
            armor.type = selectedIndex;

            InputManaPenalty.html(mainChar.gear.getArmorMaxManaPenalty() + "%");
        });

        SelectType.option(["None", "Very Light", "Light", "Medium", "Medium Heavy", "Heavy", "Very Heavy"]);
        SelectType.selectValue(armor.type); // Set to Default.

        // Third Row
        let DivThird = new myElement(createDiv(), "shrinkablePGearSplitTwoDiv", BigDiv);
        let TextCPDamageReduction = new myElement(createP("CP/Dmg Red.:"), "shrinkablePGearP", DivThird);
        let InputCPDamageReduction = new myElement(createInput(armor.cpForDamageReductions), "shrinkablePGearInput", DivThird, null, () => {
            let cpForDamageReductions = isNaN(parseInt(InputCPDamageReduction.value())) ? 0 : parseInt(InputCPDamageReduction.value());
            armor.setCPForDamageReductions(cpForDamageReductions);
        }, null, () => {
            InputCPDamageReduction.value(armor.cpForDamageReductions);
        });

        // Forth Row
        let DivForth = new myElement(createDiv(), "shrinkablePGearSplitTwoDiv", BigDiv);
        let TextWeight = new myElement(createP("Weight:"), "shrinkablePGearP", DivForth);
        let InputWeight = new myElement(createInput(armor.weight), "shrinkablePGearInput", DivForth, null, () => {
            let weight = isNaN(parseInt(InputWeight.value())) ? 0 : parseInt(InputWeight.value());
            armor.weight = weight;

            if (pgear.sdCarrying_TotalWeight)
                pgear.sdCarrying_TotalWeight.html("Total Weight: " + mainChar.gear.getTotalWeight());
        }, null, () => {
            InputWeight.value(armor.weight);
        });

        // Fifth Row
        let DivFifth = new myElement(createDiv(), "shrinkablePGearSplitTwoDiv", BigDiv);
        let TextManaPenalty = new myElement(createP("Mana Penalty:"), "shrinkablePGearP", DivFifth);
        let InputManaPenalty = new myElement(createP(mainChar.gear.getArmorMaxManaPenalty() + "%"), "shrinkablePGearP", DivFifth);

        // Shrinkable Qualities
        let shrinkableDiv = new myElement(createDiv(), "shrinkableAbilitiesDiv", pgear.sdArmor_BigDiv);
        let shrinkableCheckBox = new myElement(createInput("", "checkbox"), "shrinkableAbilitiesInputField", shrinkableDiv, null, () => {
            let hidden = shrinkableText.html().indexOf("+ Qualities") != -1 ? false : true;
            shrinkableText.html((hidden ? "+ Qualities" : "- Qualities"));

            if (hidden) {
                shrinkableButton.style("display", "none");
                shrinkableText.class("shrinkableAbilitiesHeader");

                BigDiv2.remove();
                for (let i = 2; i < shrinkableDiv.child().length; ++i) {
                    shrinkableDiv.child()[i].remove(); // Big Div2
                }
            }
            else {
                BigDiv2 = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv);
                shrinkableButton.style("display", "block");

                for (let i = 0; i < mainChar.gear.equipments.armor.qualities.length; ++i) {
                    addNewQuality(BigDiv2, mainChar.gear.equipments.armor, mainChar.gear.equipments.armor.qualities[i]);
                }
            }
        });
        let shrinkableLittleDiv = new myElement(createDiv(), "shrinkableLittleDiv", shrinkableDiv);
        let shrinkableText = new myElement(createP("+ Qualities"), "shrinkableAbilitiesHeader", shrinkableLittleDiv);
        let shrinkableButton = new myElement(createButton("New"), "shrinkableLittleButton", shrinkableLittleDiv, () => {
            addNewQuality(BigDiv2, mainChar.gear.equipments.armor);
        });
        let BigDiv2 = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv);
        shrinkableButton.style("display", "none");


        // Custom Styles
        shrinkableDiv.style("margin-left", "20px");
        DivSecond.style("display", "flex");
        DivSecond.style("margin-top", "5px");
        InputName.style("min-width", "85%");
        InputName.style("max-width", "85%");
        SelectType.style("min-width", "45%");
    }
    var showArmorPage = () => {
        openedSections[25] = 1;
        pgear.sdArmorText.html("- Armor");
        pgear.sdArmorText.class("shrinkableHeaderHidden");

        pgear.sdArmor_BigDiv = new myElement(createDiv(), "shrinkablePAbilitiesBigDiv", pgear.sdArmor);

        // Load Armor
        showArmor();
    }
    var hideArmorPage = () => {
        openedSections[25] = 0;
        pgear.sdArmorText.html("+ Armor");
        pgear.sdArmorText.class("shrinkableHeader");

        Object.keys(pgear).forEach(function (key) {
            if (key.startsWith("sdArmor") && key != "sdArmor" && key != "sdArmorCheckBox" && key != "sdArmorText") {
                pgear[key].remove();
                delete pgear[key];
            }
        });
    }

    var showAccessories = () => {
        // Shrinkable Head
        let shrinkableDiv_Head = new myElement(createDiv(), "shrinkableAbilitiesDiv", pgear.sdAccessories_BigDiv);
        let shrinkableCheckBox_Head = new myElement(createInput("", "checkbox"), "shrinkableAbilitiesInputField", shrinkableDiv_Head, null, () => {
            let hidden = shrinkableText_Head.html().indexOf("+ Head") != -1 ? false : true;
            shrinkableText_Head.html((hidden ? "+ Head" : "- Head"));

            if (hidden) {
                shrinkableText_Head.class("shrinkableAbilitiesHeader");
                shrinkableDivInside_Head.remove();
            }
            else {
                shrinkableDivInside_Head = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv_Head);
                let armor = mainChar.gear.equipments.head; // Change Here

                let divName = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDivInside_Head);
                let textName = new myElement(createP("Name:"), "shrinkablePAbilitiesNotesP", divName);
                let inputName = new myElement(createInput(armor.name), "shrinkablePAbilitiesNotesBigInput", divName, null, () => {
                    armor.name = inputName.value();
                });

                // Shrinkable Qualities
                let shrinkableDiv = new myElement(createDiv(), "shrinkableAbilitiesDiv", shrinkableDivInside_Head);
                let shrinkableCheckBox = new myElement(createInput("", "checkbox"), "shrinkableAbilitiesInputField", shrinkableDiv, null, () => {
                    let hidden = shrinkableText.html().indexOf("+ Qualities") != -1 ? false : true;
                    shrinkableText.html((hidden ? "+ Qualities" : "- Qualities"));

                    if (hidden) {
                        shrinkableButton.style("display", "none");
                        shrinkableText.class("shrinkableAbilitiesHeader");

                        BigDiv2.remove();
                        for (let i = 2; i < shrinkableDiv.child().length; ++i) {
                            shrinkableDiv.child()[i].remove(); // Big Div2
                        }
                    }
                    else {
                        BigDiv2 = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv);
                        shrinkableButton.style("display", "block");

                        for (let i = 0; i < armor.qualities.length; ++i) {
                            addNewQuality(BigDiv2, armor, armor.qualities[i]);
                        }
                    }
                });
                let shrinkableLittleDiv = new myElement(createDiv(), "shrinkableLittleDiv", shrinkableDiv);
                let shrinkableText = new myElement(createP("+ Qualities"), "shrinkableAbilitiesHeader", shrinkableLittleDiv);
                let shrinkableButton = new myElement(createButton("New"), "shrinkableLittleButton", shrinkableLittleDiv, () => {
                    addNewQuality(BigDiv2, armor);
                });
                let BigDiv2 = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv);
                shrinkableButton.style("display", "none");

                // Custom Styles
                shrinkableDiv.style("margin-top", "10px");
                divName.style("display", "flex");
                textName.style("text-align", "left");
                textName.style("min-width", "20%");
                inputName.style("min-width", "60%");
                inputName.style("margin-left", "20px");
            }
        });
        let shrinkableText_Head = new myElement(createP("+ Head"), "shrinkableAbilitiesHeader", shrinkableDiv_Head);
        let shrinkableDivInside_Head = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv_Head);
        shrinkableText_Head.style("margin-left", "20px");

        // Shrinkable Eyes
        let shrinkableDiv_Eyes = new myElement(createDiv(), "shrinkableAbilitiesDiv", pgear.sdAccessories_BigDiv);
        let shrinkableCheckBox_Eyes = new myElement(createInput("", "checkbox"), "shrinkableAbilitiesInputField", shrinkableDiv_Eyes, null, () => {
            let hidden = shrinkableText_Eyes.html().indexOf("+ Eyes") != -1 ? false : true;
            shrinkableText_Eyes.html((hidden ? "+ Eyes" : "- Eyes"));

            if (hidden) {
                shrinkableText_Eyes.class("shrinkableAbilitiesHeader");
                shrinkableDivInside_Eyes.remove();
            }
            else {
                shrinkableDivInside_Eyes = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv_Eyes);
                let armor = mainChar.gear.equipments.eyes; // Change Here

                let divName = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDivInside_Eyes);
                let textName = new myElement(createP("Name:"), "shrinkablePAbilitiesNotesP", divName);
                let inputName = new myElement(createInput(armor.name), "shrinkablePAbilitiesNotesBigInput", divName, null, () => {
                    armor.name = inputName.value();
                });

                // Shrinkable Qualities
                let shrinkableDiv = new myElement(createDiv(), "shrinkableAbilitiesDiv", shrinkableDivInside_Eyes);
                let shrinkableCheckBox = new myElement(createInput("", "checkbox"), "shrinkableAbilitiesInputField", shrinkableDiv, null, () => {
                    let hidden = shrinkableText.html().indexOf("+ Qualities") != -1 ? false : true;
                    shrinkableText.html((hidden ? "+ Qualities" : "- Qualities"));

                    if (hidden) {
                        shrinkableButton.style("display", "none");
                        shrinkableText.class("shrinkableAbilitiesHeader");

                        BigDiv2.remove();
                        for (let i = 2; i < shrinkableDiv.child().length; ++i) {
                            shrinkableDiv.child()[i].remove(); // Big Div2
                        }
                    }
                    else {
                        BigDiv2 = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv);
                        shrinkableButton.style("display", "block");

                        for (let i = 0; i < armor.qualities.length; ++i) {
                            addNewQuality(BigDiv2, armor, armor.qualities[i]);
                        }
                    }
                });
                let shrinkableLittleDiv = new myElement(createDiv(), "shrinkableLittleDiv", shrinkableDiv);
                let shrinkableText = new myElement(createP("+ Qualities"), "shrinkableAbilitiesHeader", shrinkableLittleDiv);
                let shrinkableButton = new myElement(createButton("New"), "shrinkableLittleButton", shrinkableLittleDiv, () => {
                    addNewQuality(BigDiv2, armor);
                });
                let BigDiv2 = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv);
                shrinkableButton.style("display", "none");

                // Custom Styles
                shrinkableDiv.style("margin-top", "10px");
                divName.style("display", "flex");
                textName.style("text-align", "left");
                textName.style("min-width", "20%");
                inputName.style("min-width", "60%");
                inputName.style("margin-left", "20px");
            }
        });
        let shrinkableText_Eyes = new myElement(createP("+ Eyes"), "shrinkableAbilitiesHeader", shrinkableDiv_Eyes);
        let shrinkableDivInside_Eyes = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv_Eyes);
        shrinkableText_Eyes.style("margin-left", "20px");

        // Shrinkable Neck
        let shrinkableDiv_Neck = new myElement(createDiv(), "shrinkableAbilitiesDiv", pgear.sdAccessories_BigDiv);
        let shrinkableCheckBox_Neck = new myElement(createInput("", "checkbox"), "shrinkableAbilitiesInputField", shrinkableDiv_Neck, null, () => {
            let hidden = shrinkableText_Neck.html().indexOf("+ Neck") != -1 ? false : true;
            shrinkableText_Neck.html((hidden ? "+ Neck" : "- Neck"));

            if (hidden) {
                shrinkableText_Neck.class("shrinkableAbilitiesHeader");
                shrinkableDivInside_Neck.remove();
            }
            else {
                shrinkableDivInside_Neck = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv_Neck);
                let armor = mainChar.gear.equipments.neck; // Change Here

                let divName = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDivInside_Neck);
                let textName = new myElement(createP("Name:"), "shrinkablePAbilitiesNotesP", divName);
                let inputName = new myElement(createInput(armor.name), "shrinkablePAbilitiesNotesBigInput", divName, null, () => {
                    armor.name = inputName.value();
                });

                // Shrinkable Qualities
                let shrinkableDiv = new myElement(createDiv(), "shrinkableAbilitiesDiv", shrinkableDivInside_Neck);
                let shrinkableCheckBox = new myElement(createInput("", "checkbox"), "shrinkableAbilitiesInputField", shrinkableDiv, null, () => {
                    let hidden = shrinkableText.html().indexOf("+ Qualities") != -1 ? false : true;
                    shrinkableText.html((hidden ? "+ Qualities" : "- Qualities"));

                    if (hidden) {
                        shrinkableButton.style("display", "none");
                        shrinkableText.class("shrinkableAbilitiesHeader");

                        BigDiv2.remove();
                        for (let i = 2; i < shrinkableDiv.child().length; ++i) {
                            shrinkableDiv.child()[i].remove(); // Big Div2
                        }
                    }
                    else {
                        BigDiv2 = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv);
                        shrinkableButton.style("display", "block");

                        for (let i = 0; i < armor.qualities.length; ++i) {
                            addNewQuality(BigDiv2, armor, armor.qualities[i]);
                        }
                    }
                });
                let shrinkableLittleDiv = new myElement(createDiv(), "shrinkableLittleDiv", shrinkableDiv);
                let shrinkableText = new myElement(createP("+ Qualities"), "shrinkableAbilitiesHeader", shrinkableLittleDiv);
                let shrinkableButton = new myElement(createButton("New"), "shrinkableLittleButton", shrinkableLittleDiv, () => {
                    addNewQuality(BigDiv2, armor);
                });
                let BigDiv2 = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv);
                shrinkableButton.style("display", "none");

                // Custom Styles
                shrinkableDiv.style("margin-top", "10px");
                divName.style("display", "flex");
                textName.style("text-align", "left");
                textName.style("min-width", "20%");
                inputName.style("min-width", "60%");
                inputName.style("margin-left", "20px");
            }
        });
        let shrinkableText_Neck = new myElement(createP("+ Neck"), "shrinkableAbilitiesHeader", shrinkableDiv_Neck);
        let shrinkableDivInside_Neck = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv_Neck);
        shrinkableText_Neck.style("margin-left", "20px");

        // Shrinkable Back
        let shrinkableDiv_Back = new myElement(createDiv(), "shrinkableAbilitiesDiv", pgear.sdAccessories_BigDiv);
        let shrinkableCheckBox_Back = new myElement(createInput("", "checkbox"), "shrinkableAbilitiesInputField", shrinkableDiv_Back, null, () => {
            let hidden = shrinkableText_Back.html().indexOf("+ Back") != -1 ? false : true;
            shrinkableText_Back.html((hidden ? "+ Back" : "- Back"));

            if (hidden) {
                shrinkableText_Back.class("shrinkableAbilitiesHeader");
                shrinkableDivInside_Back.remove();
            }
            else {
                shrinkableDivInside_Back = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv_Back);
                let armor = mainChar.gear.equipments.back; // Change Here

                let divName = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDivInside_Back);
                let textName = new myElement(createP("Name:"), "shrinkablePAbilitiesNotesP", divName);
                let inputName = new myElement(createInput(armor.name), "shrinkablePAbilitiesNotesBigInput", divName, null, () => {
                    armor.name = inputName.value();
                });

                // Shrinkable Qualities
                let shrinkableDiv = new myElement(createDiv(), "shrinkableAbilitiesDiv", shrinkableDivInside_Back);
                let shrinkableCheckBox = new myElement(createInput("", "checkbox"), "shrinkableAbilitiesInputField", shrinkableDiv, null, () => {
                    let hidden = shrinkableText.html().indexOf("+ Qualities") != -1 ? false : true;
                    shrinkableText.html((hidden ? "+ Qualities" : "- Qualities"));

                    if (hidden) {
                        shrinkableButton.style("display", "none");
                        shrinkableText.class("shrinkableAbilitiesHeader");

                        BigDiv2.remove();
                        for (let i = 2; i < shrinkableDiv.child().length; ++i) {
                            shrinkableDiv.child()[i].remove(); // Big Div2
                        }
                    }
                    else {
                        BigDiv2 = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv);
                        shrinkableButton.style("display", "block");

                        for (let i = 0; i < armor.qualities.length; ++i) {
                            addNewQuality(BigDiv2, armor, armor.qualities[i]);
                        }
                    }
                });
                let shrinkableLittleDiv = new myElement(createDiv(), "shrinkableLittleDiv", shrinkableDiv);
                let shrinkableText = new myElement(createP("+ Qualities"), "shrinkableAbilitiesHeader", shrinkableLittleDiv);
                let shrinkableButton = new myElement(createButton("New"), "shrinkableLittleButton", shrinkableLittleDiv, () => {
                    addNewQuality(BigDiv2, armor);
                });
                let BigDiv2 = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv);
                shrinkableButton.style("display", "none");

                // Custom Styles
                shrinkableDiv.style("margin-top", "10px");
                divName.style("display", "flex");
                textName.style("text-align", "left");
                textName.style("min-width", "20%");
                inputName.style("min-width", "60%");
                inputName.style("margin-left", "20px");
            }
        });
        let shrinkableText_Back = new myElement(createP("+ Back"), "shrinkableAbilitiesHeader", shrinkableDiv_Back);
        let shrinkableDivInside_Back = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv_Back);
        shrinkableText_Back.style("margin-left", "20px");

        // Shrinkable Waist
        let shrinkableDiv_Waist = new myElement(createDiv(), "shrinkableAbilitiesDiv", pgear.sdAccessories_BigDiv);
        let shrinkableCheckBox_Waist = new myElement(createInput("", "checkbox"), "shrinkableAbilitiesInputField", shrinkableDiv_Waist, null, () => {
            let hidden = shrinkableText_Waist.html().indexOf("+ Waist") != -1 ? false : true;
            shrinkableText_Waist.html((hidden ? "+ Waist" : "- Waist"));

            if (hidden) {
                shrinkableText_Waist.class("shrinkableAbilitiesHeader");
                shrinkableDivInside_Waist.remove();
            }
            else {
                shrinkableDivInside_Waist = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv_Waist);
                let armor = mainChar.gear.equipments.waist; // Change Here

                let divName = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDivInside_Waist);
                let textName = new myElement(createP("Name:"), "shrinkablePAbilitiesNotesP", divName);
                let inputName = new myElement(createInput(armor.name), "shrinkablePAbilitiesNotesBigInput", divName, null, () => {
                    armor.name = inputName.value();
                });

                // Shrinkable Qualities
                let shrinkableDiv = new myElement(createDiv(), "shrinkableAbilitiesDiv", shrinkableDivInside_Waist);
                let shrinkableCheckBox = new myElement(createInput("", "checkbox"), "shrinkableAbilitiesInputField", shrinkableDiv, null, () => {
                    let hidden = shrinkableText.html().indexOf("+ Qualities") != -1 ? false : true;
                    shrinkableText.html((hidden ? "+ Qualities" : "- Qualities"));

                    if (hidden) {
                        shrinkableButton.style("display", "none");
                        shrinkableText.class("shrinkableAbilitiesHeader");

                        BigDiv2.remove();
                        for (let i = 2; i < shrinkableDiv.child().length; ++i) {
                            shrinkableDiv.child()[i].remove(); // Big Div2
                        }
                    }
                    else {
                        BigDiv2 = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv);
                        shrinkableButton.style("display", "block");

                        for (let i = 0; i < armor.qualities.length; ++i) {
                            addNewQuality(BigDiv2, armor, armor.qualities[i]);
                        }
                    }
                });
                let shrinkableLittleDiv = new myElement(createDiv(), "shrinkableLittleDiv", shrinkableDiv);
                let shrinkableText = new myElement(createP("+ Qualities"), "shrinkableAbilitiesHeader", shrinkableLittleDiv);
                let shrinkableButton = new myElement(createButton("New"), "shrinkableLittleButton", shrinkableLittleDiv, () => {
                    addNewQuality(BigDiv2, armor);
                });
                let BigDiv2 = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv);
                shrinkableButton.style("display", "none");

                // Custom Styles
                shrinkableDiv.style("margin-top", "10px");
                divName.style("display", "flex");
                textName.style("text-align", "left");
                textName.style("min-width", "20%");
                inputName.style("min-width", "60%");
                inputName.style("margin-left", "20px");
            }
        });
        let shrinkableText_Waist = new myElement(createP("+ Waist"), "shrinkableAbilitiesHeader", shrinkableDiv_Waist);
        let shrinkableDivInside_Waist = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv_Waist);
        shrinkableText_Waist.style("margin-left", "20px");

        // Shrinkable Undergarment
        let shrinkableDiv_Undergarment = new myElement(createDiv(), "shrinkableAbilitiesDiv", pgear.sdAccessories_BigDiv);
        let shrinkableCheckBox_Undergarment = new myElement(createInput("", "checkbox"), "shrinkableAbilitiesInputField", shrinkableDiv_Undergarment, null, () => {
            let hidden = shrinkableText_Undergarment.html().indexOf("+ Undergarment") != -1 ? false : true;
            shrinkableText_Undergarment.html((hidden ? "+ Undergarment" : "- Undergarment"));

            if (hidden) {
                shrinkableText_Undergarment.class("shrinkableAbilitiesHeader");
                shrinkableDivInside_Undergarment.remove();
            }
            else {
                shrinkableDivInside_Undergarment = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv_Undergarment);
                let armor = mainChar.gear.equipments.undergarment; // Change Here

                let divName = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDivInside_Undergarment);
                let textName = new myElement(createP("Name:"), "shrinkablePAbilitiesNotesP", divName);
                let inputName = new myElement(createInput(armor.name), "shrinkablePAbilitiesNotesBigInput", divName, null, () => {
                    armor.name = inputName.value();
                });

                // Shrinkable Qualities
                let shrinkableDiv = new myElement(createDiv(), "shrinkableAbilitiesDiv", shrinkableDivInside_Undergarment);
                let shrinkableCheckBox = new myElement(createInput("", "checkbox"), "shrinkableAbilitiesInputField", shrinkableDiv, null, () => {
                    let hidden = shrinkableText.html().indexOf("+ Qualities") != -1 ? false : true;
                    shrinkableText.html((hidden ? "+ Qualities" : "- Qualities"));

                    if (hidden) {
                        shrinkableButton.style("display", "none");
                        shrinkableText.class("shrinkableAbilitiesHeader");

                        BigDiv2.remove();
                        for (let i = 2; i < shrinkableDiv.child().length; ++i) {
                            shrinkableDiv.child()[i].remove(); // Big Div2
                        }
                    }
                    else {
                        BigDiv2 = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv);
                        shrinkableButton.style("display", "block");

                        for (let i = 0; i < armor.qualities.length; ++i) {
                            addNewQuality(BigDiv2, armor, armor.qualities[i]);
                        }
                    }
                });
                let shrinkableLittleDiv = new myElement(createDiv(), "shrinkableLittleDiv", shrinkableDiv);
                let shrinkableText = new myElement(createP("+ Qualities"), "shrinkableAbilitiesHeader", shrinkableLittleDiv);
                let shrinkableButton = new myElement(createButton("New"), "shrinkableLittleButton", shrinkableLittleDiv, () => {
                    addNewQuality(BigDiv2, armor);
                });
                let BigDiv2 = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv);
                shrinkableButton.style("display", "none");

                // Custom Styles
                shrinkableDiv.style("margin-top", "10px");
                divName.style("display", "flex");
                textName.style("text-align", "left");
                textName.style("min-width", "20%");
                inputName.style("min-width", "60%");
                inputName.style("margin-left", "20px");
            }
        });
        let shrinkableText_Undergarment = new myElement(createP("+ Undergarment"), "shrinkableAbilitiesHeader", shrinkableDiv_Undergarment);
        let shrinkableDivInside_Undergarment = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv_Undergarment);
        shrinkableText_Undergarment.style("margin-left", "20px");

        // Shrinkable Arms
        let shrinkableDiv_Arms = new myElement(createDiv(), "shrinkableAbilitiesDiv", pgear.sdAccessories_BigDiv);
        let shrinkableCheckBox_Arms = new myElement(createInput("", "checkbox"), "shrinkableAbilitiesInputField", shrinkableDiv_Arms, null, () => {
            let hidden = shrinkableText_Arms.html().indexOf("+ Arms") != -1 ? false : true;
            shrinkableText_Arms.html((hidden ? "+ Arms" : "- Arms"));

            if (hidden) {
                shrinkableText_Arms.class("shrinkableAbilitiesHeader");
                shrinkableDivInside_Arms.remove();
            }
            else {
                shrinkableDivInside_Arms = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv_Arms);
                let armor = mainChar.gear.equipments.arms; // Change Here

                let divName = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDivInside_Arms);
                let textName = new myElement(createP("Name:"), "shrinkablePAbilitiesNotesP", divName);
                let inputName = new myElement(createInput(armor.name), "shrinkablePAbilitiesNotesBigInput", divName, null, () => {
                    armor.name = inputName.value();
                });

                // Shrinkable Qualities
                let shrinkableDiv = new myElement(createDiv(), "shrinkableAbilitiesDiv", shrinkableDivInside_Arms);
                let shrinkableCheckBox = new myElement(createInput("", "checkbox"), "shrinkableAbilitiesInputField", shrinkableDiv, null, () => {
                    let hidden = shrinkableText.html().indexOf("+ Qualities") != -1 ? false : true;
                    shrinkableText.html((hidden ? "+ Qualities" : "- Qualities"));

                    if (hidden) {
                        shrinkableButton.style("display", "none");
                        shrinkableText.class("shrinkableAbilitiesHeader");

                        BigDiv2.remove();
                        for (let i = 2; i < shrinkableDiv.child().length; ++i) {
                            shrinkableDiv.child()[i].remove(); // Big Div2
                        }
                    }
                    else {
                        BigDiv2 = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv);
                        shrinkableButton.style("display", "block");

                        for (let i = 0; i < armor.qualities.length; ++i) {
                            addNewQuality(BigDiv2, armor, armor.qualities[i]);
                        }
                    }
                });
                let shrinkableLittleDiv = new myElement(createDiv(), "shrinkableLittleDiv", shrinkableDiv);
                let shrinkableText = new myElement(createP("+ Qualities"), "shrinkableAbilitiesHeader", shrinkableLittleDiv);
                let shrinkableButton = new myElement(createButton("New"), "shrinkableLittleButton", shrinkableLittleDiv, () => {
                    addNewQuality(BigDiv2, armor);
                });
                let BigDiv2 = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv);
                shrinkableButton.style("display", "none");

                // Custom Styles
                shrinkableDiv.style("margin-top", "10px");
                divName.style("display", "flex");
                textName.style("text-align", "left");
                textName.style("min-width", "20%");
                inputName.style("min-width", "60%");
                inputName.style("margin-left", "20px");
            }
        });
        let shrinkableText_Arms = new myElement(createP("+ Arms"), "shrinkableAbilitiesHeader", shrinkableDiv_Arms);
        let shrinkableDivInside_Arms = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv_Arms);
        shrinkableText_Arms.style("margin-left", "20px");

        // Shrinkable Hands
        let shrinkableDiv_Hands = new myElement(createDiv(), "shrinkableAbilitiesDiv", pgear.sdAccessories_BigDiv);
        let shrinkableCheckBox_Hands = new myElement(createInput("", "checkbox"), "shrinkableAbilitiesInputField", shrinkableDiv_Hands, null, () => {
            let hidden = shrinkableText_Hands.html().indexOf("+ Hands") != -1 ? false : true;
            shrinkableText_Hands.html((hidden ? "+ Hands" : "- Hands"));

            if (hidden) {
                shrinkableText_Hands.class("shrinkableAbilitiesHeader");
                shrinkableDivInside_Hands.remove();
            }
            else {
                shrinkableDivInside_Hands = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv_Hands);
                let armor = mainChar.gear.equipments.hands; // Change Here

                let divName = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDivInside_Hands);
                let textName = new myElement(createP("Name:"), "shrinkablePAbilitiesNotesP", divName);
                let inputName = new myElement(createInput(armor.name), "shrinkablePAbilitiesNotesBigInput", divName, null, () => {
                    armor.name = inputName.value();
                });

                // Shrinkable Qualities
                let shrinkableDiv = new myElement(createDiv(), "shrinkableAbilitiesDiv", shrinkableDivInside_Hands);
                let shrinkableCheckBox = new myElement(createInput("", "checkbox"), "shrinkableAbilitiesInputField", shrinkableDiv, null, () => {
                    let hidden = shrinkableText.html().indexOf("+ Qualities") != -1 ? false : true;
                    shrinkableText.html((hidden ? "+ Qualities" : "- Qualities"));

                    if (hidden) {
                        shrinkableButton.style("display", "none");
                        shrinkableText.class("shrinkableAbilitiesHeader");

                        BigDiv2.remove();
                        for (let i = 2; i < shrinkableDiv.child().length; ++i) {
                            shrinkableDiv.child()[i].remove(); // Big Div2
                        }
                    }
                    else {
                        BigDiv2 = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv);
                        shrinkableButton.style("display", "block");

                        for (let i = 0; i < armor.qualities.length; ++i) {
                            addNewQuality(BigDiv2, armor, armor.qualities[i]);
                        }
                    }
                });
                let shrinkableLittleDiv = new myElement(createDiv(), "shrinkableLittleDiv", shrinkableDiv);
                let shrinkableText = new myElement(createP("+ Qualities"), "shrinkableAbilitiesHeader", shrinkableLittleDiv);
                let shrinkableButton = new myElement(createButton("New"), "shrinkableLittleButton", shrinkableLittleDiv, () => {
                    addNewQuality(BigDiv2, armor);
                });
                let BigDiv2 = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv);
                shrinkableButton.style("display", "none");

                // Custom Styles
                shrinkableDiv.style("margin-top", "10px");
                divName.style("display", "flex");
                textName.style("text-align", "left");
                textName.style("min-width", "20%");
                inputName.style("min-width", "60%");
                inputName.style("margin-left", "20px");
            }
        });
        let shrinkableText_Hands = new myElement(createP("+ Hands"), "shrinkableAbilitiesHeader", shrinkableDiv_Hands);
        let shrinkableDivInside_Hands = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv_Hands);
        shrinkableText_Hands.style("margin-left", "20px");

        // Shrinkable Feet
        let shrinkableDiv_Feet = new myElement(createDiv(), "shrinkableAbilitiesDiv", pgear.sdAccessories_BigDiv);
        let shrinkableCheckBox_Feet = new myElement(createInput("", "checkbox"), "shrinkableAbilitiesInputField", shrinkableDiv_Feet, null, () => {
            let hidden = shrinkableText_Feet.html().indexOf("+ Feet") != -1 ? false : true;
            shrinkableText_Feet.html((hidden ? "+ Feet" : "- Feet"));

            if (hidden) {
                shrinkableText_Feet.class("shrinkableAbilitiesHeader");
                shrinkableDivInside_Feet.remove();
            }
            else {
                shrinkableDivInside_Feet = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv_Feet);
                let armor = mainChar.gear.equipments.feet; // Change Here

                let divName = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDivInside_Feet);
                let textName = new myElement(createP("Name:"), "shrinkablePAbilitiesNotesP", divName);
                let inputName = new myElement(createInput(armor.name), "shrinkablePAbilitiesNotesBigInput", divName, null, () => {
                    armor.name = inputName.value();
                });

                // Shrinkable Qualities
                let shrinkableDiv = new myElement(createDiv(), "shrinkableAbilitiesDiv", shrinkableDivInside_Feet);
                let shrinkableCheckBox = new myElement(createInput("", "checkbox"), "shrinkableAbilitiesInputField", shrinkableDiv, null, () => {
                    let hidden = shrinkableText.html().indexOf("+ Qualities") != -1 ? false : true;
                    shrinkableText.html((hidden ? "+ Qualities" : "- Qualities"));

                    if (hidden) {
                        shrinkableButton.style("display", "none");
                        shrinkableText.class("shrinkableAbilitiesHeader");

                        BigDiv2.remove();
                        for (let i = 2; i < shrinkableDiv.child().length; ++i) {
                            shrinkableDiv.child()[i].remove(); // Big Div2
                        }
                    }
                    else {
                        BigDiv2 = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv);
                        shrinkableButton.style("display", "block");

                        for (let i = 0; i < armor.qualities.length; ++i) {
                            addNewQuality(BigDiv2, armor, armor.qualities[i]);
                        }
                    }
                });
                let shrinkableLittleDiv = new myElement(createDiv(), "shrinkableLittleDiv", shrinkableDiv);
                let shrinkableText = new myElement(createP("+ Qualities"), "shrinkableAbilitiesHeader", shrinkableLittleDiv);
                let shrinkableButton = new myElement(createButton("New"), "shrinkableLittleButton", shrinkableLittleDiv, () => {
                    addNewQuality(BigDiv2, armor);
                });
                let BigDiv2 = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv);
                shrinkableButton.style("display", "none");

                // Custom Styles
                shrinkableDiv.style("margin-top", "10px");
                divName.style("display", "flex");
                textName.style("text-align", "left");
                textName.style("min-width", "20%");
                inputName.style("min-width", "60%");
                inputName.style("margin-left", "20px");
            }
        });
        let shrinkableText_Feet = new myElement(createP("+ Feet"), "shrinkableAbilitiesHeader", shrinkableDiv_Feet);
        let shrinkableDivInside_Feet = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv_Feet);
        shrinkableText_Feet.style("margin-left", "20px");

        // Shrinkable RingOne
        let shrinkableDiv_RingOne = new myElement(createDiv(), "shrinkableAbilitiesDiv", pgear.sdAccessories_BigDiv);
        let shrinkableCheckBox_RingOne = new myElement(createInput("", "checkbox"), "shrinkableAbilitiesInputField", shrinkableDiv_RingOne, null, () => {
            let hidden = shrinkableText_RingOne.html().indexOf("+ Ring I") != -1 ? false : true;
            shrinkableText_RingOne.html((hidden ? "+ Ring I" : "- Ring I"));

            if (hidden) {
                shrinkableText_RingOne.class("shrinkableAbilitiesHeader");
                shrinkableDivInside_RingOne.remove();
            }
            else {
                shrinkableDivInside_RingOne = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv_RingOne);
                let armor = mainChar.gear.equipments.ring1; // Change Here

                let divName = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDivInside_RingOne);
                let textName = new myElement(createP("Name:"), "shrinkablePAbilitiesNotesP", divName);
                let inputName = new myElement(createInput(armor.name), "shrinkablePAbilitiesNotesBigInput", divName, null, () => {
                    armor.name = inputName.value();
                });

                // Shrinkable Qualities
                let shrinkableDiv = new myElement(createDiv(), "shrinkableAbilitiesDiv", shrinkableDivInside_RingOne);
                let shrinkableCheckBox = new myElement(createInput("", "checkbox"), "shrinkableAbilitiesInputField", shrinkableDiv, null, () => {
                    let hidden = shrinkableText.html().indexOf("+ Qualities") != -1 ? false : true;
                    shrinkableText.html((hidden ? "+ Qualities" : "- Qualities"));

                    if (hidden) {
                        shrinkableButton.style("display", "none");
                        shrinkableText.class("shrinkableAbilitiesHeader");

                        BigDiv2.remove();
                        for (let i = 2; i < shrinkableDiv.child().length; ++i) {
                            shrinkableDiv.child()[i].remove(); // Big Div2
                        }
                    }
                    else {
                        BigDiv2 = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv);
                        shrinkableButton.style("display", "block");

                        for (let i = 0; i < armor.qualities.length; ++i) {
                            addNewQuality(BigDiv2, armor, armor.qualities[i]);
                        }
                    }
                });
                let shrinkableLittleDiv = new myElement(createDiv(), "shrinkableLittleDiv", shrinkableDiv);
                let shrinkableText = new myElement(createP("+ Qualities"), "shrinkableAbilitiesHeader", shrinkableLittleDiv);
                let shrinkableButton = new myElement(createButton("New"), "shrinkableLittleButton", shrinkableLittleDiv, () => {
                    addNewQuality(BigDiv2, armor);
                });
                let BigDiv2 = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv);
                shrinkableButton.style("display", "none");

                // Custom Styles
                shrinkableDiv.style("margin-top", "10px");
                divName.style("display", "flex");
                textName.style("text-align", "left");
                textName.style("min-width", "20%");
                inputName.style("min-width", "60%");
                inputName.style("margin-left", "20px");
            }
        });
        let shrinkableText_RingOne = new myElement(createP("+ Ring I"), "shrinkableAbilitiesHeader", shrinkableDiv_RingOne);
        let shrinkableDivInside_RingOne = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv_RingOne);
        shrinkableText_RingOne.style("margin-left", "20px");

        // Shrinkable RingTwo
        let shrinkableDiv_RingTwo = new myElement(createDiv(), "shrinkableAbilitiesDiv", pgear.sdAccessories_BigDiv);
        let shrinkableCheckBox_RingTwo = new myElement(createInput("", "checkbox"), "shrinkableAbilitiesInputField", shrinkableDiv_RingTwo, null, () => {
            let hidden = shrinkableText_RingTwo.html().indexOf("+ Ring II") != -1 ? false : true;
            shrinkableText_RingTwo.html((hidden ? "+ Ring II" : "- Ring II"));

            if (hidden) {
                shrinkableText_RingTwo.class("shrinkableAbilitiesHeader");
                shrinkableDivInside_RingTwo.remove();
            }
            else {
                shrinkableDivInside_RingTwo = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv_RingTwo);
                let armor = mainChar.gear.equipments.ring2; // Change Here

                let divName = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDivInside_RingTwo);
                let textName = new myElement(createP("Name:"), "shrinkablePAbilitiesNotesP", divName);
                let inputName = new myElement(createInput(armor.name), "shrinkablePAbilitiesNotesBigInput", divName, null, () => {
                    armor.name = inputName.value();
                });

                // Shrinkable Qualities
                let shrinkableDiv = new myElement(createDiv(), "shrinkableAbilitiesDiv", shrinkableDivInside_RingTwo);
                let shrinkableCheckBox = new myElement(createInput("", "checkbox"), "shrinkableAbilitiesInputField", shrinkableDiv, null, () => {
                    let hidden = shrinkableText.html().indexOf("+ Qualities") != -1 ? false : true;
                    shrinkableText.html((hidden ? "+ Qualities" : "- Qualities"));

                    if (hidden) {
                        shrinkableButton.style("display", "none");
                        shrinkableText.class("shrinkableAbilitiesHeader");

                        BigDiv2.remove();
                        for (let i = 2; i < shrinkableDiv.child().length; ++i) {
                            shrinkableDiv.child()[i].remove(); // Big Div2
                        }
                    }
                    else {
                        BigDiv2 = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv);
                        shrinkableButton.style("display", "block");

                        for (let i = 0; i < armor.qualities.length; ++i) {
                            addNewQuality(BigDiv2, armor, armor.qualities[i]);
                        }
                    }
                });
                let shrinkableLittleDiv = new myElement(createDiv(), "shrinkableLittleDiv", shrinkableDiv);
                let shrinkableText = new myElement(createP("+ Qualities"), "shrinkableAbilitiesHeader", shrinkableLittleDiv);
                let shrinkableButton = new myElement(createButton("New"), "shrinkableLittleButton", shrinkableLittleDiv, () => {
                    addNewQuality(BigDiv2, armor);
                });
                let BigDiv2 = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv);
                shrinkableButton.style("display", "none");

                // Custom Styles
                shrinkableDiv.style("margin-top", "10px");
                divName.style("display", "flex");
                textName.style("text-align", "left");
                textName.style("min-width", "20%");
                inputName.style("min-width", "60%");
                inputName.style("margin-left", "20px");
            }
        });
        let shrinkableText_RingTwo = new myElement(createP("+ Ring II"), "shrinkableAbilitiesHeader", shrinkableDiv_RingTwo);
        let shrinkableDivInside_RingTwo = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv_RingTwo);
        shrinkableText_RingTwo.style("margin-left", "20px");

        // Shrinkable FloatingOne
        let shrinkableDiv_FloatingOne = new myElement(createDiv(), "shrinkableAbilitiesDiv", pgear.sdAccessories_BigDiv);
        let shrinkableCheckBox_FloatingOne = new myElement(createInput("", "checkbox"), "shrinkableAbilitiesInputField", shrinkableDiv_FloatingOne, null, () => {
            let hidden = shrinkableText_FloatingOne.html().indexOf("+ Floating I") != -1 ? false : true;
            shrinkableText_FloatingOne.html((hidden ? "+ Floating I" : "- Floating I"));

            if (hidden) {
                shrinkableText_FloatingOne.class("shrinkableAbilitiesHeader");
                shrinkableDivInside_FloatingOne.remove();
            }
            else {
                shrinkableDivInside_FloatingOne = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv_FloatingOne);
                let armor = mainChar.gear.equipments.floating1; // Change Here

                let divName = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDivInside_FloatingOne);
                let textName = new myElement(createP("Name:"), "shrinkablePAbilitiesNotesP", divName);
                let inputName = new myElement(createInput(armor.name), "shrinkablePAbilitiesNotesBigInput", divName, null, () => {
                    armor.name = inputName.value();
                });

                // Shrinkable Qualities
                let shrinkableDiv = new myElement(createDiv(), "shrinkableAbilitiesDiv", shrinkableDivInside_FloatingOne);
                let shrinkableCheckBox = new myElement(createInput("", "checkbox"), "shrinkableAbilitiesInputField", shrinkableDiv, null, () => {
                    let hidden = shrinkableText.html().indexOf("+ Qualities") != -1 ? false : true;
                    shrinkableText.html((hidden ? "+ Qualities" : "- Qualities"));

                    if (hidden) {
                        shrinkableButton.style("display", "none");
                        shrinkableText.class("shrinkableAbilitiesHeader");

                        BigDiv2.remove();
                        for (let i = 2; i < shrinkableDiv.child().length; ++i) {
                            shrinkableDiv.child()[i].remove(); // Big Div2
                        }
                    }
                    else {
                        BigDiv2 = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv);
                        shrinkableButton.style("display", "block");

                        for (let i = 0; i < armor.qualities.length; ++i) {
                            addNewQuality(BigDiv2, armor, armor.qualities[i]);
                        }
                    }
                });
                let shrinkableLittleDiv = new myElement(createDiv(), "shrinkableLittleDiv", shrinkableDiv);
                let shrinkableText = new myElement(createP("+ Qualities"), "shrinkableAbilitiesHeader", shrinkableLittleDiv);
                let shrinkableButton = new myElement(createButton("New"), "shrinkableLittleButton", shrinkableLittleDiv, () => {
                    addNewQuality(BigDiv2, armor);
                });
                let BigDiv2 = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv);
                shrinkableButton.style("display", "none");

                // Custom Styles
                shrinkableDiv.style("margin-top", "10px");
                divName.style("display", "flex");
                textName.style("text-align", "left");
                textName.style("min-width", "20%");
                inputName.style("min-width", "60%");
                inputName.style("margin-left", "20px");
            }
        });
        let shrinkableText_FloatingOne = new myElement(createP("+ Floating I"), "shrinkableAbilitiesHeader", shrinkableDiv_FloatingOne);
        let shrinkableDivInside_FloatingOne = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv_FloatingOne);
        shrinkableText_FloatingOne.style("margin-left", "20px");

        // Shrinkable FloatingTwo
        let shrinkableDiv_FloatingTwo = new myElement(createDiv(), "shrinkableAbilitiesDiv", pgear.sdAccessories_BigDiv);
        let shrinkableCheckBox_FloatingTwo = new myElement(createInput("", "checkbox"), "shrinkableAbilitiesInputField", shrinkableDiv_FloatingTwo, null, () => {
            let hidden = shrinkableText_FloatingTwo.html().indexOf("+ Floating II") != -1 ? false : true;
            shrinkableText_FloatingTwo.html((hidden ? "+ Floating II" : "- Floating II"));

            if (hidden) {
                shrinkableText_FloatingTwo.class("shrinkableAbilitiesHeader");
                shrinkableDivInside_FloatingTwo.remove();
            }
            else {
                shrinkableDivInside_FloatingTwo = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv_FloatingTwo);
                let armor = mainChar.gear.equipments.floating2; // Change Here

                let divName = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDivInside_FloatingTwo);
                let textName = new myElement(createP("Name:"), "shrinkablePAbilitiesNotesP", divName);
                let inputName = new myElement(createInput(armor.name), "shrinkablePAbilitiesNotesBigInput", divName, null, () => {
                    armor.name = inputName.value();
                });

                // Shrinkable Qualities
                let shrinkableDiv = new myElement(createDiv(), "shrinkableAbilitiesDiv", shrinkableDivInside_FloatingTwo);
                let shrinkableCheckBox = new myElement(createInput("", "checkbox"), "shrinkableAbilitiesInputField", shrinkableDiv, null, () => {
                    let hidden = shrinkableText.html().indexOf("+ Qualities") != -1 ? false : true;
                    shrinkableText.html((hidden ? "+ Qualities" : "- Qualities"));

                    if (hidden) {
                        shrinkableButton.style("display", "none");
                        shrinkableText.class("shrinkableAbilitiesHeader");

                        BigDiv2.remove();
                        for (let i = 2; i < shrinkableDiv.child().length; ++i) {
                            shrinkableDiv.child()[i].remove(); // Big Div2
                        }
                    }
                    else {
                        BigDiv2 = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv);
                        shrinkableButton.style("display", "block");

                        for (let i = 0; i < armor.qualities.length; ++i) {
                            addNewQuality(BigDiv2, armor, armor.qualities[i]);
                        }
                    }
                });
                let shrinkableLittleDiv = new myElement(createDiv(), "shrinkableLittleDiv", shrinkableDiv);
                let shrinkableText = new myElement(createP("+ Qualities"), "shrinkableAbilitiesHeader", shrinkableLittleDiv);
                let shrinkableButton = new myElement(createButton("New"), "shrinkableLittleButton", shrinkableLittleDiv, () => {
                    addNewQuality(BigDiv2, armor);
                });
                let BigDiv2 = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv);
                shrinkableButton.style("display", "none");

                // Custom Styles
                shrinkableDiv.style("margin-top", "10px");
                divName.style("display", "flex");
                textName.style("text-align", "left");
                textName.style("min-width", "20%");
                inputName.style("min-width", "60%");
                inputName.style("margin-left", "20px");
            }
        });
        let shrinkableText_FloatingTwo = new myElement(createP("+ Floating II"), "shrinkableAbilitiesHeader", shrinkableDiv_FloatingTwo);
        let shrinkableDivInside_FloatingTwo = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv_FloatingTwo);
        shrinkableText_FloatingTwo.style("margin-left", "20px");

        // Shrinkable FloatingThree
        let shrinkableDiv_FloatingThree = new myElement(createDiv(), "shrinkableAbilitiesDiv", pgear.sdAccessories_BigDiv);
        let shrinkableCheckBox_FloatingThree = new myElement(createInput("", "checkbox"), "shrinkableAbilitiesInputField", shrinkableDiv_FloatingThree, null, () => {
            let hidden = shrinkableText_FloatingThree.html().indexOf("+ Floating III") != -1 ? false : true;
            shrinkableText_FloatingThree.html((hidden ? "+ Floating III" : "- Floating III"));

            if (hidden) {
                shrinkableText_FloatingThree.class("shrinkableAbilitiesHeader");
                shrinkableDivInside_FloatingThree.remove();
            }
            else {
                shrinkableDivInside_FloatingThree = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv_FloatingThree);
                let armor = mainChar.gear.equipments.floating3; // Change Here

                let divName = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDivInside_FloatingThree);
                let textName = new myElement(createP("Name:"), "shrinkablePAbilitiesNotesP", divName);
                let inputName = new myElement(createInput(armor.name), "shrinkablePAbilitiesNotesBigInput", divName, null, () => {
                    armor.name = inputName.value();
                });

                // Shrinkable Qualities
                let shrinkableDiv = new myElement(createDiv(), "shrinkableAbilitiesDiv", shrinkableDivInside_FloatingThree);
                let shrinkableCheckBox = new myElement(createInput("", "checkbox"), "shrinkableAbilitiesInputField", shrinkableDiv, null, () => {
                    let hidden = shrinkableText.html().indexOf("+ Qualities") != -1 ? false : true;
                    shrinkableText.html((hidden ? "+ Qualities" : "- Qualities"));

                    if (hidden) {
                        shrinkableButton.style("display", "none");
                        shrinkableText.class("shrinkableAbilitiesHeader");

                        BigDiv2.remove();
                        for (let i = 2; i < shrinkableDiv.child().length; ++i) {
                            shrinkableDiv.child()[i].remove(); // Big Div2
                        }
                    }
                    else {
                        BigDiv2 = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv);
                        shrinkableButton.style("display", "block");

                        for (let i = 0; i < armor.qualities.length; ++i) {
                            addNewQuality(BigDiv2, armor, armor.qualities[i]);
                        }
                    }
                });
                let shrinkableLittleDiv = new myElement(createDiv(), "shrinkableLittleDiv", shrinkableDiv);
                let shrinkableText = new myElement(createP("+ Qualities"), "shrinkableAbilitiesHeader", shrinkableLittleDiv);
                let shrinkableButton = new myElement(createButton("New"), "shrinkableLittleButton", shrinkableLittleDiv, () => {
                    addNewQuality(BigDiv2, armor);
                });
                let BigDiv2 = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv);
                shrinkableButton.style("display", "none");

                // Custom Styles
                shrinkableDiv.style("margin-top", "10px");
                divName.style("display", "flex");
                textName.style("text-align", "left");
                textName.style("min-width", "20%");
                inputName.style("min-width", "60%");
                inputName.style("margin-left", "20px");
            }
        });
        let shrinkableText_FloatingThree = new myElement(createP("+ Floating III"), "shrinkableAbilitiesHeader", shrinkableDiv_FloatingThree);
        let shrinkableDivInside_FloatingThree = new myElement(createDiv(), "shrinkablePGearDiv", shrinkableDiv_FloatingThree);
        shrinkableText_FloatingThree.style("margin-left", "20px");
    }
    var showAccessoriesPage = () => {
        openedSections[26] = 1;
        pgear.sdAccessoriesText.html("- Accessories");
        pgear.sdAccessoriesText.class("shrinkableHeaderHidden");

        pgear.sdAccessories_BigDiv = new myElement(createDiv(), "shrinkablePAbilitiesBigDiv", pgear.sdAccessories);

        // Load Armor
        showAccessories();
    }
    var hideAccessoriesPage = () => {
        openedSections[26] = 0;
        pgear.sdAccessoriesText.html("+ Accessories");
        pgear.sdAccessoriesText.class("shrinkableHeader");

        Object.keys(pgear).forEach(function (key) {
            if (key.startsWith("sdAccessories") && key != "sdAccessories" && key != "sdAccessoriesCheckBox" && key != "sdAccessoriesText") {
                pgear[key].remove();
                delete pgear[key];
            }
        });
    }

    var updateTotalWeight = () => {
        let weight = mainChar.stats.getCarryCapacity(); //mainChar.gear.getTotalWeight();
        let loadTable = Table_GetCarryCapacity(weight);

        pgear.sdCarrying_TotalWeight.html("Total Weight: " + mainChar.gear.getTotalWeight());
        pgear.sdCarrying_MaxLight.html("Max Light: " + loadTable[0].toFixed(2));
        pgear.sdCarrying_MaxMedium.html("Max Medium: " + loadTable[1].toFixed(2));
        pgear.sdCarrying_MaxHeavy.html("Max Heavy: " + loadTable[2].toFixed(2));
    }
    var addCarrying = (c = null) => {
        if (c == null) c = mainChar.gear.newCarrying();

        let _div = new myElement(createDiv(), "shrinkablePAbilitiesBigDiv", pgear.sdCarrying_BigDivCarryings);
        let inputText = new myElement(createInput(c.name), "shrinkablePAbilitiesNotesBigInput", _div, null, () => {
            c.name = inputText.value();
        });
        let weightText = new myElement(createInput(c.weight), "shrinkablePAbilitiesNotesBigInput", _div, null, () => {
            let val = isNaN(parseInt(weightText.value())) ? 0 : parseInt(weightText.value());
            c.weight = val;

            updateTotalWeight();
        })
        let deleteButton = new myElement(createButton("X"), "shrinkablePGearButton", _div, () => {
            if (confirm("Do you want to remove " + (c.name != "" && c.name != " " ? c.name : "Unnamed") + "?")) {
                mainChar.gear.removeCarrying(c.index);
                hideCarryingPage();
                showCarryingPage();
            }
        });

        inputText.style("min-width", "60%");
        weightText.style("min-width", "20%");
        deleteButton.style("min-width", "10%");

        inputText.style("margin-left", "0");
        weightText.style("margin-left", "0");
        deleteButton.style("margin-left", "0");
        _div.style("display", "flex");
    }
    var showCarrying = () => {
        for (let i = 0; i < mainChar.gear.carryings.length; ++i) {
            addCarrying(mainChar.gear.carryings[i]);
        }

        let newLineButton = new myElement(createButton("New Line"), "shrinkablePGearButton", pgear.sdCarrying_BigDiv, () => {
            addCarrying();
        });

        pgear.sdCarrying_TotalWeight = new myElement(createP("Total Weight: 0"), "shrinkablePAbilitiesNotesP", pgear.sdCarrying_BigDiv);

        pgear.sdCarrying_MaxLight = new myElement(createP("Max Light: 0"), "shrinkablePAbilitiesNotesP", pgear.sdCarrying_BigDiv);
        pgear.sdCarrying_MaxMedium = new myElement(createP("Max Medium: 0"), "shrinkablePAbilitiesNotesP", pgear.sdCarrying_BigDiv);
        pgear.sdCarrying_MaxHeavy = new myElement(createP("Max Heavy: 0"), "shrinkablePAbilitiesNotesP", pgear.sdCarrying_BigDiv);

        pgear.sdCarrying_TotalWeight.style("margin-top", "20px");

        pgear.sdCarrying_TotalWeight.style("margin-left", "15px");
        pgear.sdCarrying_MaxLight.style("margin-left", "15px");
        pgear.sdCarrying_MaxMedium.style("margin-left", "15px");
        pgear.sdCarrying_MaxHeavy.style("margin-left", "15px");

        pgear.sdCarrying_TotalWeight.style("text-align", "left");
        pgear.sdCarrying_MaxLight.style("text-align", "left");
        pgear.sdCarrying_MaxMedium.style("text-align", "left");
        pgear.sdCarrying_MaxHeavy.style("text-align", "left");

        updateTotalWeight();
    }
    var showCarryingPage = () => {
        openedSections[27] = 1;
        pgear.sdCarryingText.html("- Carrying");
        pgear.sdCarryingText.class("shrinkableHeaderHidden");

        pgear.sdCarrying_BigDiv = new myElement(createDiv(), "shrinkablePAbilitiesBigDiv", pgear.sdCarrying);
        pgear.sdCarrying_BigDivCarryings = new myElement(createDiv(), "shrinkablePAbilitiesBigDiv", pgear.sdCarrying_BigDiv);
        // Load Carrying
        showCarrying();
    }
    var hideCarryingPage = () => {
        openedSections[27] = 0;
        pgear.sdCarryingText.html("+ Carrying");
        pgear.sdCarryingText.class("shrinkableHeader");

        Object.keys(pgear).forEach(function (key) {
            if (key.startsWith("sdCarrying") && key != "sdCarrying" && key != "sdCarryingCheckBox" && key != "sdCarryingText") {
                pgear[key].remove();
                delete pgear[key];
            }
        });
    }

    // Shrinkable Weapons
    pgear.sdWeapons = new myElement(createDiv(), "shrinkableDiv");
    pgear.sdWeaponsCheckBox = new myElement(createInput("", "checkbox"), "shrinkableInputField", pgear.sdWeapons, null, () => {
        let hidden = pgear.sdWeaponsText.html().indexOf("+ Weapons") != -1 ? false : true;

        if (hidden) hideWeaponsPage();
        else showWeaponsPage();
    });
    pgear.sdWeaponsText = new myElement(createP("+ Weapons"), "shrinkableHeader", pgear.sdWeapons);

    // Shrinkable Armor
    pgear.sdArmor = new myElement(createDiv(), "shrinkableDiv");
    pgear.sdArmorCheckBox = new myElement(createInput("", "checkbox"), "shrinkableInputField", pgear.sdArmor, null, () => {
        let hidden = pgear.sdArmorText.html().indexOf("+ Armor") != -1 ? false : true;

        if (hidden) hideArmorPage();
        else showArmorPage();
    });
    pgear.sdArmorText = new myElement(createP("+ Armor"), "shrinkableHeader", pgear.sdArmor);

    // Shrinkable Accessories
    pgear.sdAccessories = new myElement(createDiv(), "shrinkableDiv");
    pgear.sdAccessoriesCheckBox = new myElement(createInput("", "checkbox"), "shrinkableInputField", pgear.sdAccessories, null, () => {
        let hidden = pgear.sdAccessoriesText.html().indexOf("+ Accessories") != -1 ? false : true;

        if (hidden) hideAccessoriesPage();
        else showAccessoriesPage();
    });
    pgear.sdAccessoriesText = new myElement(createP("+ Accessories"), "shrinkableHeader", pgear.sdAccessories);

    // Shrinkable Carrying
    pgear.sdCarrying = new myElement(createDiv(), "shrinkableDiv");
    pgear.sdCarryingCheckBox = new myElement(createInput("", "checkbox"), "shrinkableInputField", pgear.sdCarrying, null, () => {
        let hidden = pgear.sdCarryingText.html().indexOf("+ Carrying") != -1 ? false : true;

        if (hidden) hideCarryingPage();
        else showCarryingPage();
    });
    pgear.sdCarryingText = new myElement(createP("+ Carrying"), "shrinkableHeader", pgear.sdCarrying);

    if (openedSections[24]) pgear.sdWeaponsCheckBox.onInput();
    if (openedSections[25]) pgear.sdArmorCheckBox.onInput();
    if (openedSections[26]) pgear.sdAccessoriesCheckBox.onInput();
    if (openedSections[27]) pgear.sdCarryingCheckBox.onInput();
}
function setupPageAbilities() {
    pspells.allAbilities = [];
    pspells.allSpells = [];

    var showAbilitiesPage = () => {
        openedSections[28] = 1;
        pspells.sdAbilitiesText.html("- Abilities");
        pspells.sdAbilitiesText.class("shrinkableHeaderHidden");

        pspells.sdAbilities_BigDiv = new myElement(createDiv(), "shrinkablePAbilitiesBigDiv", pspells.sdAbilities);

        // Load All Abilities
        for (let i = 0; i < allSpells.length; ++i) {
            if (allSpells[i].isAbility) {
                addAbility(!allSpells[i].isAbility, allSpells[i]);
            }
        }
    }
    var hideAbilitiesPage = () => {
        openedSections[28] = 0;
        pspells.sdAbilitiesText.html("+ Abilities");
        pspells.sdAbilitiesText.class("shrinkableHeader");

        Object.keys(pspells).forEach(function (key) {
            if (key.startsWith("sdAbilities") && key != "sdAbilities" && key != "sdAbilitiesCheckBox" && key != "sdAbilitiesText") {
                pspells[key].remove();
                delete pspells[key];
            }
        });
    }
    var showSpellsPage = () => {
        openedSections[29] = 1;
        pspells.sdSpellsText.html("- Spells");
        pspells.sdSpellsText.class("shrinkableHeaderHidden");

        pspells.sdSpells_BigDiv = new myElement(createDiv(), "shrinkablePAbilitiesBigDiv", pspells.sdSpells);

        // Load All Spells
        for (let i = 0; i < allSpells.length; ++i) {
            if (!allSpells[i].isAbility) {
                addAbility(!allSpells[i].isAbility, allSpells[i]);
            }
        }
    }
    var hideSpellsPage = () => {
        openedSections[29] = 0;
        pspells.sdSpellsText.html("+ Spells");
        pspells.sdSpellsText.class("shrinkableHeader");

        Object.keys(pspells).forEach(function (key) {
            if (key.startsWith("sdSpells") && key != "sdSpells" && key != "sdSpellsCheckBox" && key != "sdSpellsText") {
                pspells[key].remove();
                delete pspells[key];
            }
        });
    }
    var addAbility = (isSpell, theAbility = null) => {
        // If Pages are not shown do stuff.
        if (!isSpell) {
            if (!pspells.sdAbilities_BigDiv) { // If Abilities page is hidden, we just make the spell but dont do anything else.
                if (theAbility == null) {
                    let newAb = new Spell();
                    newAb.isAbility = true;
                }

                showAbilitiesPage();
                return;
            }
        }
        else {
            if (!pspells.sdSpells_BigDiv) {
                if (theAbility == null) new Spell();

                showSpellsPage();
                return;
            }
        }

        let ability = theAbility == null ? new Spell() : theAbility;
        ability.isAbility = !isSpell;

        // Lets make them Shrinkable!
        var abilityName = (ability.name != "" ? ability.name : "Unnamed");
        let shrinkableDiv = new myElement(createDiv(), "shrinkableAbilitiesDiv", (!isSpell ? pspells.sdAbilities_BigDiv : pspells.sdSpells_BigDiv));

        let shrinkableCheckBox = new myElement(createInput("", "checkbox"), "shrinkableAbilitiesInputField", shrinkableDiv, null, () => {
            let abilityName = (ability.name != "" ? ability.name : "Unnamed");

            let hidden = shrinkableText.html().indexOf("+ " + abilityName) != -1 ? false : true;
            shrinkableText.html((hidden ? "+ " + abilityName : "- " + abilityName));

            if (hidden) {
                shrinkableText.class("shrinkableAbilitiesHeader");
                shrinkableDiv.child()[2].remove(); // Big Div
            }
            else {
                shrinkableText.class("shrinkableAbilitiesHeaderHidden");

                // Actual Stuff...
                let BigDiv = new myElement(createDiv(), "shrinkablePAbilitiesDiv", shrinkableDiv);
                let DivAbility = new myElement(createDiv(), "shrinkablePAbilitiesDiv", BigDiv);
                //2s
                let DivName = new myElement(createDiv(), "shrinkablePAbilitiesSplitTwoDiv", DivAbility);
                let TextName = new myElement(createP("Name:"), "shrinkablePAbilitiesP", DivName);
                let InputName = new myElement(createInput(ability.name), "shrinkablePAbilitiesInput", DivName, null, () => {
                    ability.name = InputName.value() == "" || InputName.value() == " " ? "Unnamed" : InputName.value();
                    shrinkableText.html("- " + ability.name);
                });

                //2s
                let DivAccess = new myElement(createDiv(), "shrinkablePAbilitiesSplitTwoDiv", DivAbility);
                let TextAccess = new myElement(createP("Access:"), "shrinkablePAbilitiesP", DivAccess);
                let InputAccess = new myElement(createInput(ability.access), "shrinkablePAbilitiesInput", DivAccess, null, () => {
                    ability.access = InputAccess.value();
                });

                //2s
                let DivComponents = new myElement(createDiv(), "shrinkablePAbilitiesSplitTwoDiv", DivAbility);
                let TextComponents = new myElement(createP("Components:"), "shrinkablePAbilitiesP", DivComponents);
                let InputComponents = new myElement(createInput(ability.components), "shrinkablePAbilitiesInput", DivComponents, null, () => {
                    ability.components = InputComponents.value();
                });

                //2s
                let DivTargeting = new myElement(createDiv(), "shrinkablePAbilitiesSplitTwoDiv", DivAbility);
                let TextTargeting = new myElement(createP("Targeting:"), "shrinkablePAbilitiesP", DivTargeting);
                let InputTargeting = new myElement(createInput(ability.targeting), "shrinkablePAbilitiesInput", DivTargeting, null, () => {
                    ability.targeting = InputTargeting.value();
                });

                //2s
                let DivCastingTime = new myElement(createDiv(), "shrinkablePAbilitiesSplitTwoDiv", DivAbility);
                let TextCastingTime = new myElement(createP("Casting Time:"), "shrinkablePAbilitiesP", DivCastingTime);
                let InputCastingTime = new myElement(createInput(ability.castingTime), "shrinkablePAbilitiesInput", DivCastingTime, null, () => {
                    ability.castingTime = InputCastingTime.value();
                });

                //2s
                let DivCosts = new myElement(createDiv(), "shrinkablePAbilitiesSplitTwoDiv", DivAbility);
                let TextCosts = new myElement(createP("Costs:"), "shrinkablePAbilitiesP", DivCosts);
                let InputCosts = new myElement(createInput(ability.costs), "shrinkablePAbilitiesInput", DivCosts, null, () => {
                    ability.costs = InputCosts.value();
                });

                //2s
                let DivDefense = new myElement(createDiv(), "shrinkablePAbilitiesSplitTwoDiv", DivAbility);
                let TextDefense = new myElement(createP("Defense:"), "shrinkablePAbilitiesP", DivDefense);
                let InputDefense = new myElement(createInput(ability.defense), "shrinkablePAbilitiesInput", DivDefense, null, () => {
                    ability.defense = InputDefense.value();
                });

                //2s
                let DivDuration = new myElement(createDiv(), "shrinkablePAbilitiesSplitTwoDiv", DivAbility);
                let TextDuration = new myElement(createP("Duration:"), "shrinkablePAbilitiesP", DivDuration);
                let InputDuration = new myElement(createInput(ability.duration), "shrinkablePAbilitiesInput", DivDuration, null, () => {
                    ability.duration = InputDuration.value();
                });

                //2s
                let DivConditions = new myElement(createDiv(), "shrinkablePAbilitiesSplitTwoDiv", DivAbility);
                let TextConditions = new myElement(createP("Conditions:"), "shrinkablePAbilitiesP", DivConditions);
                let InputConditions = new myElement(createInput(ability.conditions), "shrinkablePAbilitiesInput", DivConditions, null, () => {
                    ability.conditions = InputConditions.value();
                });

                //2s
                let DivDiscretionaries = new myElement(createDiv(), "shrinkablePAbilitiesSplitTwoDiv", DivAbility);
                let TextDiscretionaries = new myElement(createP("Discretionaries:"), "shrinkablePAbilitiesP", DivDiscretionaries);
                let InputDiscretionaries = new myElement(createInput(ability.discretionaries), "shrinkablePAbilitiesInput", DivDiscretionaries, null, () => {
                    ability.discretionaries = InputDiscretionaries.value();
                });

                // 1 Big
                let DivDescription = new myElement(createDiv(), "shrinkablePAbilitiesDivDescription", DivAbility);
                let InputDescription = new myElement(createElement("textarea"), "shrinkablePAbilitiesTextArea", DivDescription, () => {
                    if (InputDescription.value() == "Description")
                        InputDescription.value("");
                }, () => {
                    ability.description = InputDescription.value();
                }, null, () => {
                    if (InputDescription.value() == "")
                        InputDescription.value("Description");
                });
                InputDescription.value(ability.description == "" ? "Description" : ability.description);

                // NOTES
                let DivNotes = new myElement(createDiv(), "shrinkablePAbilitiesDiv", BigDiv);
                let updateComplexities = () => {
                    TextPartialComplexity.html(getPartialComplexity().toFixed(2) + " = Partial Complexity");
                    TextFinalComplexity.html(getFinalComplexity().toFixed(2) + " = Final Complexity");
                }
                let getPartialComplexity = () => {
                    let effects = isNaN(parseInt(InputEffectsLeft.value())) ? 0 : parseInt(InputEffectsLeft.value());
                    let potency = isNaN(parseInt(InputPotencyLeft.value())) ? 0 : parseInt(InputPotencyLeft.value());
                    let aoe = isNaN(parseInt(InputAoELeft.value())) ? 0 : parseInt(InputAoELeft.value());
                    let targeting = isNaN(parseInt(InputTargetingLeft.value())) ? 0 : parseInt(InputTargetingLeft.value());
                    let specMods = isNaN(parseInt(InputSpecModsLeft.value())) ? 0 : parseInt(InputSpecModsLeft.value());

                    return effects + potency + aoe + targeting + specMods;
                };
                let getFinalComplexity = () => {
                    let range = isNaN(parseInt(InputRangeLeft.value())) ? 0 : parseInt(InputRangeLeft.value());
                    let castingTime = isNaN(parseFloat(InputCastingTimeLeft.value())) ? 0 : parseFloat(InputCastingTimeLeft.value());
                    let components = isNaN(parseInt(InputComponentsLeft.value())) ? 0 : parseInt(InputComponentsLeft.value());
                    let costs = isNaN(parseFloat(InputCostsLeft.value())) ? 0 : parseFloat(InputCostsLeft.value());
                    let conditions = isNaN(parseInt(InputConditionsLeft.value())) ? 0 : parseInt(InputConditionsLeft.value());
                    let discretionaries = isNaN(parseInt(InputDiscretionariesLeft.value())) ? 0 : parseInt(InputDiscretionariesLeft.value());

                    return range + castingTime + components + costs + conditions + discretionaries;
                }

                let DivHeader = new myElement(createDiv(), "shrinkablePAbilitiesNotesDiv", DivNotes);
                let TextHeader = new myElement(createP("Notes"), "shrinkablePAbilitiesNotesHeaderP", DivHeader);

                let DivSelections = new myElement(createDiv(), "shrinkablePAbilitiesNotesDiv", DivNotes);
                let SelectParameterOne = new myElement(createSelect(), "shrinkablePAbilitiesNotesSelect", DivSelections, null, null, () => {
                    ability.selectedParameterOne = SelectParameterOne.selectValue();
                });
                let SelectParameterTwo = new myElement(createSelect(), "shrinkablePAbilitiesNotesSelect", DivSelections, null, null, () => {
                    ability.selectedParameterTwo = SelectParameterTwo.selectValue();
                });

                SelectParameterOne.option(["Effectiveness/DC/Duration", "Targeting/AoE", "Range"]);
                SelectParameterTwo.option(["Effectiveness/DC/Duration", "Targeting/AoE", "Range"]);
                SelectParameterOne.selectValue(ability.selectedParameterOne);
                SelectParameterTwo.selectValue(ability.selectedParameterTwo);

                // 3s - Effects
                let DivNotesEffects = new myElement(createDiv(), "shrinkablePAbilitiesSplitTwoDiv", DivNotes);
                let InputEffectsLeft = new myElement(createInput(ability.notesEffects), "shrinkablePAbilitiesNotesLittleInput", DivNotesEffects, null, () => {
                    ability.notesEffects = InputEffectsLeft.value();
                    updateComplexities();
                });
                let TextEffects = new myElement(createP("= Effects:"), "shrinkablePAbilitiesNotesP", DivNotesEffects);
                let InputEffectsRight = new myElement(createInput(ability.notesEffectsRight), "shrinkablePAbilitiesNotesBigInput", DivNotesEffects, null, () => {
                    ability.notesEffectsRight = InputEffectsRight.value();
                });

                // 3s - Potency
                let DivNotesPotency = new myElement(createDiv(), "shrinkablePAbilitiesSplitTwoDiv", DivNotes);
                let InputPotencyLeft = new myElement(createInput(ability.notesPotency), "shrinkablePAbilitiesNotesLittleInput", DivNotesPotency, null, () => {
                    ability.notesPotency = InputPotencyLeft.value();
                    updateComplexities();
                });
                let TextPotency = new myElement(createP("= Potency:"), "shrinkablePAbilitiesNotesP", DivNotesPotency);
                let InputPotencyRight = new myElement(createInput(ability.notesPotencyRight), "shrinkablePAbilitiesNotesBigInput", DivNotesPotency, null, () => {
                    ability.notesPotencyRight = InputPotencyRight.value();
                });

                // 3s - AoE
                let DivNotesAoE = new myElement(createDiv(), "shrinkablePAbilitiesSplitTwoDiv", DivNotes);
                let InputAoELeft = new myElement(createInput(ability.notesAoE), "shrinkablePAbilitiesNotesLittleInput", DivNotesAoE, null, () => {
                    ability.notesAoE = InputAoELeft.value();
                    updateComplexities();
                });
                let TextAoE = new myElement(createP("= AoE:"), "shrinkablePAbilitiesNotesP", DivNotesAoE);
                let InputAoERight = new myElement(createInput(ability.notesAoERight), "shrinkablePAbilitiesNotesBigInput", DivNotesAoE, null, () => {
                    ability.notesAoERight = InputAoERight.value();
                });

                // 3s - Targeting
                let DivNotesTargeting = new myElement(createDiv(), "shrinkablePAbilitiesSplitTwoDiv", DivNotes);
                let InputTargetingLeft = new myElement(createInput(ability.notesTargeting), "shrinkablePAbilitiesNotesLittleInput", DivNotesTargeting, null, () => {
                    ability.notesTargeting = InputTargetingLeft.value();
                    updateComplexities();
                });
                let TextNotesTargeting = new myElement(createP("= Targeting:"), "shrinkablePAbilitiesNotesP", DivNotesTargeting);
                let InputTargetingRight = new myElement(createInput(ability.notesTargetingRight), "shrinkablePAbilitiesNotesBigInput", DivNotesTargeting, null, () => {
                    ability.notesTargetingRight = InputTargetingRight.value();
                });

                // 3s - Spec. Mods
                let DivNotesSpecMods = new myElement(createDiv(), "shrinkablePAbilitiesSplitTwoDiv", DivNotes);
                let InputSpecModsLeft = new myElement(createInput(ability.notesSpecMods), "shrinkablePAbilitiesNotesLittleInput", DivNotesSpecMods, null, () => {
                    ability.notesSpecMods = InputSpecModsLeft.value();
                    updateComplexities();
                });
                let TextSpecMods = new myElement(createP("= Spec. Mods:"), "shrinkablePAbilitiesNotesP", DivNotesSpecMods);
                let InputSpecModsRight = new myElement(createInput(ability.notesSpecModsRight), "shrinkablePAbilitiesNotesBigInput", DivNotesSpecMods, null, () => {
                    ability.notesSpecModsRight = InputSpecModsRight.value();
                });

                // Partial Complexity
                let TextPartialComplexity = new myElement(createP(getPartialComplexity() + " = Partial Complexity"), "shrinkablePAbilitiesP", DivNotes);

                // 3s - Range
                let DivNotesRange = new myElement(createDiv(), "shrinkablePAbilitiesSplitTwoDiv", DivNotes);
                let InputRangeLeft = new myElement(createInput(ability.notesRange), "shrinkablePAbilitiesNotesLittleInput", DivNotesRange, null, () => {
                    ability.notesRange = InputRangeLeft.value();
                    updateComplexities();
                });
                let TextRange = new myElement(createP("= Range:"), "shrinkablePAbilitiesNotesP", DivNotesRange);
                let InputRangeRight = new myElement(createInput(ability.notesRangeRight), "shrinkablePAbilitiesNotesBigInput", DivNotesRange, null, () => {
                    ability.notesRangeRight = InputRangeRight.value();
                });

                // 3s - CastingTime
                let DivNotesCastingTime = new myElement(createDiv(), "shrinkablePAbilitiesSplitTwoDiv", DivNotes);
                let InputCastingTimeLeft = new myElement(createInput(ability.notesCastingTime), "shrinkablePAbilitiesNotesLittleInput", DivNotesCastingTime, null, () => {
                    ability.notesCastingTime = InputCastingTimeLeft.value();
                    updateComplexities();
                });
                let TextNotesCastingTime = new myElement(createP("= Casting Time:"), "shrinkablePAbilitiesNotesP", DivNotesCastingTime);
                let InputCastingTimeRight = new myElement(createInput(ability.notesCastingTimeRight), "shrinkablePAbilitiesNotesBigInput", DivNotesCastingTime, null, () => {
                    ability.notesCastingTimeRight = InputCastingTimeRight.value();
                });

                // 3s - Components
                let DivNotesComponents = new myElement(createDiv(), "shrinkablePAbilitiesSplitTwoDiv", DivNotes);
                let InputComponentsLeft = new myElement(createInput(ability.notesComponents), "shrinkablePAbilitiesNotesLittleInput", DivNotesComponents, null, () => {
                    ability.notesComponents = InputComponentsLeft.value();
                    updateComplexities();
                });
                let TextNotesComponents = new myElement(createP("= Components:"), "shrinkablePAbilitiesNotesP", DivNotesComponents);
                let InputComponentsRight = new myElement(createInput(ability.notesComponentsRight), "shrinkablePAbilitiesNotesBigInput", DivNotesComponents, null, () => {
                    ability.notesComponentsRight = InputComponentsRight.value();
                });

                // 3s - Costs
                let DivNotesCosts = new myElement(createDiv(), "shrinkablePAbilitiesSplitTwoDiv", DivNotes);
                let InputCostsLeft = new myElement(createInput(ability.notesCosts), "shrinkablePAbilitiesNotesLittleInput", DivNotesCosts, null, () => {
                    ability.notesCosts = InputCostsLeft.value();
                    updateComplexities();
                });
                let TextNotesCosts = new myElement(createP("= Costs:"), "shrinkablePAbilitiesNotesP", DivNotesCosts);
                let InputCostsRight = new myElement(createInput(ability.notesCostsRight), "shrinkablePAbilitiesNotesBigInput", DivNotesCosts, null, () => {
                    ability.notesCostsRight = InputCostsRight.value();
                });

                // 3s - Conditions
                let DivNotesConditions = new myElement(createDiv(), "shrinkablePAbilitiesSplitTwoDiv", DivNotes);
                let InputConditionsLeft = new myElement(createInput(ability.notesConditions), "shrinkablePAbilitiesNotesLittleInput", DivNotesConditions, null, () => {
                    ability.notesConditions = InputConditionsLeft.value();
                    updateComplexities();
                });
                let TextNotesConditions = new myElement(createP("= Conditions:"), "shrinkablePAbilitiesNotesP", DivNotesConditions);
                let InputConditionsRight = new myElement(createInput(ability.notesConditionsRight), "shrinkablePAbilitiesNotesBigInput", DivNotesConditions, null, () => {
                    ability.notesConditionsRight = InputConditionsRight.value();
                });

                // 3s - Discretionaries
                let DivNotesDiscretionaries = new myElement(createDiv(), "shrinkablePAbilitiesSplitTwoDiv", DivNotes);
                let InputDiscretionariesLeft = new myElement(createInput(ability.notesDiscretionaries), "shrinkablePAbilitiesNotesLittleInput", DivNotesDiscretionaries, null, () => {
                    ability.notesDiscretionaries = InputDiscretionariesLeft.value();
                    updateComplexities();
                });
                let TextNotesDiscretionaries = new myElement(createP("= Discretionaries:"), "shrinkablePAbilitiesNotesP", DivNotesDiscretionaries);
                let InputDiscretionariesRight = new myElement(createInput(ability.notesDiscretionariesRight), "shrinkablePAbilitiesNotesBigInput", DivNotesDiscretionaries, null, () => {
                    ability.notesDiscretionariesRight = InputDiscretionariesRight.value();
                });

                // Final Complexity
                let TextFinalComplexity = new myElement(createP(getFinalComplexity() + " = Final Complexity"), "shrinkablePAbilitiesP", DivNotes);
            }
        });
        let shrinkableLittleDiv = new myElement(createDiv(), "shrinkableLittleDiv", shrinkableDiv);
        let shrinkableText = new myElement(createP("+ " + abilityName), "shrinkableAbilitiesHeader", shrinkableLittleDiv);
        let shrinkableButton = new myElement(createButton("Delete"), "shrinkableLittleButton", shrinkableLittleDiv, () => {
            if (confirm("Do you want to destroy " + (ability.name == "" ? "Unnamed" : ability.name) + "?")) {
                for (let i = 0; i < allSpells.length; ++i) {
                    if (allSpells[i].id == ability.id) {
                        allSpells.splice(i, 1);
                        break;
                    }
                }

                shrinkableDiv.remove();
            }
        });
        pspells.allAbilities.push(shrinkableDiv); // So we can delete them afterwards.
    };

    // Add New Ability Button
    pspells.ButtonNewAbility = new myElement(createButton("New Ability"), "shrinkablePAbilitiesButtonNewAbility", pspells.sdAbilities, () => {
        addAbility(false); // new Ability
    });
    pspells.ButtonNewSpell = new myElement(createButton("New Spell"), "shrinkablePAbilitiesButtonNewAbility", pspells.sdAbilities, () => {
        addAbility(true); // new Spell
    });

    // Shrinkable Abilities
    pspells.sdAbilities = new myElement(createDiv(), "shrinkableDiv");
    pspells.sdAbilitiesCheckBox = new myElement(createInput("", "checkbox"), "shrinkableInputField", pspells.sdAbilities, null, () => {
        let hidden = pspells.sdAbilitiesText.html().indexOf("+ Abilities") != -1 ? false : true;

        if (hidden) hideAbilitiesPage();
        else showAbilitiesPage();
    });
    pspells.sdAbilitiesText = new myElement(createP("+ Abilities"), "shrinkableHeader", pspells.sdAbilities);



    // Shrinkable Spells -- The Same...
    pspells.sdSpells = new myElement(createDiv(), "shrinkableDiv");
    pspells.sdSpellsCheckBox = new myElement(createInput("", "checkbox"), "shrinkableInputField", pspells.sdSpells, null, () => {
        let hidden = pspells.sdSpellsText.html().indexOf("+ Spells") != -1 ? false : true;

        if (hidden) hideSpellsPage();
        else showSpellsPage();
    });
    pspells.sdSpellsText = new myElement(createP("+ Spells"), "shrinkableHeader", pspells.sdSpells);

    // Shrinkable Defense Equations
    var updateEquations = () => {
        pspells.sdDefense_TextDurationEquation.html("Defense Per 1 Duration = " + parseFloat(defenseEquationsDuration().toFixed(2)));
        pspells.sdDefense_TextSaveEquation.html("DC = " + parseFloat(defenseEquationsSave().toFixed(2)));
        pspells.sdDefense_TextOngoingEquation.html("Defense Needed = " + parseFloat(defenseEquationsOngoing().toFixed(2)));
        pspells.sdDefense_TextPVEquation.html("Percent of Change = " + parseFloat(defenseEquationsPV().toFixed(2)) + "%");
    }
    var defenseEquationsDuration = () => {
        let effects = 0;
        let dur = 0;
        let appPower = 0;

        effects = isNaN(parseInt(pspells.sdDefense_InputDurationEffects.value())) ? 0 : parseInt(pspells.sdDefense_InputDurationEffects.value());
        dur = isNaN(parseInt(pspells.sdDefense_InputDuration.value())) ? 0 : parseInt(pspells.sdDefense_InputDuration.value());
        appPower = isNaN(parseInt(pspells.sdDefense_InputDurationAppPower.value())) ? 0 : parseInt(pspells.sdDefense_InputDurationAppPower.value());

        if (dur == 0) return 0;
        return ((effects + 3) * (dur / 3) + appPower) / dur;
    }
    var defenseEquationsSave = () => {
        let effects = 0;
        let appPower = 0;

        effects = isNaN(parseInt(pspells.sdDefense_InputSaveEffects.value())) ? 0 : parseInt(pspells.sdDefense_InputSaveEffects.value());
        appPower = isNaN(parseInt(pspells.sdDefense_InputSaveAppPower.value())) ? 0 : parseInt(pspells.sdDefense_InputSaveAppPower.value());

        return 12 + effects + appPower / 2;
    }
    var defenseEquationsOngoing = () => {
        let effects = 0;
        let appPower = 0;

        effects = isNaN(parseInt(pspells.sdDefense_InputOngoingEffects.value())) ? 0 : parseInt(pspells.sdDefense_InputOngoingEffects.value());
        appPower = isNaN(parseInt(pspells.sdDefense_InputOngoingAppPower.value())) ? 0 : parseInt(pspells.sdDefense_InputOngoingAppPower.value());

        return 3 + effects + appPower / 2;
    }
    var defenseEquationsPV = () => {
        let pv = isNaN(parseInt(pspells.sdDefense_InputPV.value())) ? 0 : parseInt(pspells.sdDefense_InputPV.value());
        let isPVPositive = pv >= 0;
        pv = Math.abs(pv);

        let PoR = (0.05 * pv) / (1 + 0.05 * pv);
        if (isPVPositive) PoR = (Math.abs(1 / (PoR - 1))) - 1;

        return PoR;
    }

    pspells.sdDefense = new myElement(createDiv(), "shrinkableDiv");
    pspells.sdDefenseCheckBox = new myElement(createInput("", "checkbox"), "shrinkableInputField", pspells.sdDefense, null, () => {
        let hidden = pspells.sdDefenseText.html().indexOf("+ Defense Equations") != -1 ? false : true;
        pspells.sdDefenseText.html((hidden ? "+ Defense Equations" : "- Defense Equations"));

        if (hidden) {
            openedSections[30] = 0;
            pspells.sdDefenseText.class("shrinkableHeader");

            Object.keys(pspells).forEach(function (key) {
                if (key.startsWith("sdDefense") && key != "sdDefense" && key != "sdDefenseCheckBox" && key != "sdDefenseText") {
                    pspells[key].remove();
                    delete pspells[key];
                }
            });
        }
        else {
            openedSections[30] = 1;
            pspells.sdDefenseText.class("shrinkableHeaderHidden");

            pspells.sdDefense_BigDiv = new myElement(createDiv(), "", pspells.sdDefense);
            pspells.sdDefense_BigDiv.style("max-width", "99%");
            // Vs Duration
            pspells.sdDefense_TextHeaderDuration = new myElement(createP("Vs Duration"), "shrinkablePAbilitiesDefEqHeaderP", pspells.sdDefense_BigDiv);
            pspells.sdDefense_DivDuration = new myElement(createDiv(), "shrinkablePAbilitiesNotesDiv", pspells.sdDefense_BigDiv);
            // Effects
            pspells.sdDefense_DivDurationMiniEffects = new myElement(createDiv(), "shrinkablePAbilitiesSplitTwoDiv", pspells.sdDefense_DivDuration);
            pspells.sdDefense_TextDurationEffects = new myElement(createP("Effects"), "shrinkablePAbilitiesP", pspells.sdDefense_DivDurationMiniEffects);
            pspells.sdDefense_InputDurationEffects = new myElement(createInput(), "shrinkablePAbilitiesInput", pspells.sdDefense_DivDurationMiniEffects, null, () => {
                updateEquations();
            });
            // App Power
            pspells.sdDefense_DivDurationMiniAppPower = new myElement(createDiv(), "shrinkablePAbilitiesSplitTwoDiv", pspells.sdDefense_DivDuration);
            pspells.sdDefense_TextDurationAppPower = new myElement(createP("App. Power"), "shrinkablePAbilitiesP", pspells.sdDefense_DivDurationMiniAppPower);
            pspells.sdDefense_InputDurationAppPower = new myElement(createInput(), "shrinkablePAbilitiesInput", pspells.sdDefense_DivDurationMiniAppPower, null, () => {
                updateEquations();
            });
            // Duration
            pspells.sdDefense_DivDurationMiniDuration = new myElement(createDiv(), "shrinkablePAbilitiesSplitTwoDiv", pspells.sdDefense_DivDuration);
            pspells.sdDefense_TextDuration = new myElement(createP("Duration"), "shrinkablePAbilitiesP", pspells.sdDefense_DivDurationMiniDuration);
            pspells.sdDefense_InputDuration = new myElement(createInput(), "shrinkablePAbilitiesInput", pspells.sdDefense_DivDurationMiniDuration, null, () => {
                updateEquations();
            });

            // Equation
            pspells.sdDefense_TextDurationEquation = new myElement(createP("Defense Per 1 Duration = " + defenseEquationsDuration()), "shrinkablePAbilitiesP", pspells.sdDefense_DivDuration);

            // Vs Save
            pspells.sdDefense_TextHeaderSave = new myElement(createP("Vs Save"), "shrinkablePAbilitiesDefEqHeaderP", pspells.sdDefense_BigDiv);
            pspells.sdDefense_DivSave = new myElement(createDiv(), "shrinkablePAbilitiesNotesDiv", pspells.sdDefense_BigDiv);
            // Effects
            pspells.sdDefense_DivSaveMiniEffects = new myElement(createDiv(), "shrinkablePAbilitiesSplitTwoDiv", pspells.sdDefense_DivSave);
            pspells.sdDefense_TextSaveEffects = new myElement(createP("Effects"), "shrinkablePAbilitiesP", pspells.sdDefense_DivSaveMiniEffects);
            pspells.sdDefense_InputSaveEffects = new myElement(createInput(), "shrinkablePAbilitiesInput", pspells.sdDefense_DivSaveMiniEffects, null, () => {
                updateEquations();
            });
            // App Power
            pspells.sdDefense_DivSaveMiniAppPower = new myElement(createDiv(), "shrinkablePAbilitiesSplitTwoDiv", pspells.sdDefense_DivSave);
            pspells.sdDefense_TextSaveAppPower = new myElement(createP("App. Power"), "shrinkablePAbilitiesP", pspells.sdDefense_DivSaveMiniAppPower);
            pspells.sdDefense_InputSaveAppPower = new myElement(createInput(), "shrinkablePAbilitiesInput", pspells.sdDefense_DivSaveMiniAppPower, null, () => {
                updateEquations();
            });

            // Equation
            pspells.sdDefense_TextSaveEquation = new myElement(createP("DC = " + defenseEquationsSave()), "shrinkablePAbilitiesP", pspells.sdDefense_DivSave);

            // Vs Ongoing
            pspells.sdDefense_TextHeaderOngoing = new myElement(createP("Vs Ongoing"), "shrinkablePAbilitiesDefEqHeaderP", pspells.sdDefense_BigDiv);
            pspells.sdDefense_DivOngoing = new myElement(createDiv(), "shrinkablePAbilitiesNotesDiv", pspells.sdDefense_BigDiv);
            // Effects
            pspells.sdDefense_DivOngoingMiniEffects = new myElement(createDiv(), "shrinkablePAbilitiesSplitTwoDiv", pspells.sdDefense_DivOngoing);
            pspells.sdDefense_TextOngoingEffects = new myElement(createP("Effects"), "shrinkablePAbilitiesP", pspells.sdDefense_DivOngoingMiniEffects);
            pspells.sdDefense_InputOngoingEffects = new myElement(createInput(), "shrinkablePAbilitiesInput", pspells.sdDefense_DivOngoingMiniEffects, null, () => {
                updateEquations();
            });
            // App Power
            pspells.sdDefense_DivOngoingMiniAppPower = new myElement(createDiv(), "shrinkablePAbilitiesSplitTwoDiv", pspells.sdDefense_DivOngoing);
            pspells.sdDefense_TextOngoingAppPower = new myElement(createP("App. Power"), "shrinkablePAbilitiesP", pspells.sdDefense_DivOngoingMiniAppPower);
            pspells.sdDefense_InputOngoingAppPower = new myElement(createInput(), "shrinkablePAbilitiesInput", pspells.sdDefense_DivOngoingMiniAppPower, null, () => {
                updateEquations();
            });

            // Equation
            pspells.sdDefense_TextOngoingEquation = new myElement(createP("Defense Needed = " + defenseEquationsOngoing()), "shrinkablePAbilitiesP", pspells.sdDefense_DivOngoing);

            // Pv Calculator
            pspells.sdDefense_TextHeaderPVCalculator = new myElement(createP("PV Calculator"), "shrinkablePAbilitiesDefEqHeaderP", pspells.sdDefense_BigDiv);
            pspells.sdDefense_DivPVCalculator = new myElement(createDiv(), "shrinkablePAbilitiesNotesDiv", pspells.sdDefense_BigDiv);

            // PV
            pspells.sdDefense_DivPV = new myElement(createDiv(), "shrinkablePAbilitiesSplitTwoDiv", pspells.sdDefense_DivPVCalculator);
            pspells.sdDefense_TextPV = new myElement(createP("PV"), "shrinkablePAbilitiesP", pspells.sdDefense_DivPV);
            pspells.sdDefense_InputPV = new myElement(createInput(), "shrinkablePAbilitiesInput", pspells.sdDefense_DivPV, null, () => {
                updateEquations();
            });

            // Equation
            pspells.sdDefense_TextPVEquation = new myElement(createP("Percent of Change = " + defenseEquationsPV()), "shrinkablePAbilitiesP", pspells.sdDefense_DivPVCalculator);
        }
    });
    pspells.sdDefenseText = new myElement(createP("+ Defense Equations"), "shrinkableHeader", pspells.sdDefense);

    pspells.sdSaveButton = new myElement(createButton("Save Character"), "shrinkablePGearButton", null, () => {
        saveCharFile();
        alert("Successfully Saved Character! You can load it back any time you want!");
    });

    pspells.sdSaveButton.style("margin-top", "10px");
    pspells.sdSaveButton.style("margin-left", "10px");
    pspells.sdSaveButton.style("height", "60px");

    if (openedSections[28]) pspells.sdAbilitiesCheckBox.onInput();
    if (openedSections[29]) pspells.sdSpellsCheckBox.onInput();
    if (openedSections[30]) pspells.sdDefenseCheckBox.onInput();
}

function setup() {
    noCanvas();

    setupPageMenu();
    changePage(Pages.Menu);
}

function changePage(newPage) {
    if (newPage == currentPage) return;
    currentPage = newPage;

    if (pnav_main) pnav_main.class("navButton");
    if (pnav_statistics) pnav_statistics.class("navButton");
    if (pnav_gear) pnav_gear.class("navButton");
    if (pnav_details) pnav_details.class("navButton");
    if (pnav_abilities) pnav_abilities.class("navButton");

    if (newPage == Pages.Menu) {
        showPageMenu();
        hidePageMain();
        hidePageStatistics();
        hidePageDetails();
        hidePageGear();
        hidePageAbilities();
    }
    else if (newPage == Pages.Main) {
        hidePageMenu();
        showPageMain();
        hidePageStatistics();
        hidePageDetails();
        hidePageGear();
        hidePageAbilities();
        pnav_main.class("navButtonSelected");
    }
    else if (newPage == Pages.Statistics) {
        hidePageMenu();
        hidePageMain();
        showPageStatistics();
        hidePageDetails();
        hidePageGear();
        hidePageAbilities();
        pnav_statistics.class("navButtonSelected");
    }
    else if (newPage == Pages.Details) {
        hidePageMenu();
        hidePageMain();
        hidePageStatistics();
        showPageDetails();
        hidePageGear();
        hidePageAbilities();
        pnav_details.class("navButtonSelected");
    }
    else if (newPage == Pages.Gear) {
        hidePageMenu();
        hidePageMain();
        hidePageStatistics();
        hidePageDetails();
        showPageGear();
        hidePageAbilities();
        pnav_gear.class("navButtonSelected");
    }
    else if (newPage == Pages.Abilities) {
        hidePageMenu();
        hidePageMain();
        hidePageStatistics();
        hidePageDetails();
        hidePageGear();
        showPageAbilities();
        pnav_abilities.class("navButtonSelected");
    }
}

function showPageMenu() {
    setupPageMenu();
}
function showPageMain() {
    if (!pnavIsSetUp) setupNavigators();

    setupPageMain();
}
function showPageStatistics() {
    setupPageStatistics();
}
function showPageDetails() {
    setupPageDetails();
}
function showPageGear() {
    setupPageGear();
}
function showPageAbilities() {
    setupPageAbilities();
}
function hidePageMenu() {
    pmenu_Div.remove();
    pmenu_newChar.remove();
    pmenu_load.remove();
}
function hidePageMain() {
    Object.keys(pmain).forEach(function (key) {
        if (pmain[key].length != 0) // if its not an array
            pmain[key].remove();
        delete pmain[key];
    });

    if (pmain.sdCondition_DivList) {
        let uiConditions = pmain.sdCondition_DivList.child();
        for (let i = 0; i < uiConditions.length; ++i) uiConditions[i].remove();
    }

    if (currentTooltip) currentTooltip.remove();

    pmainShownAddedDefences = [];
}
function hidePageStatistics() {
    Object.keys(pstats).forEach(function (key) {
        if (pstats[key].length != 0) // if its not an array
            pstats[key].remove();
        delete pstats[key];
    });

    if (currentTooltip) currentTooltip.remove();
}
function hidePageDetails() {
    Object.keys(pdetails).forEach(function (key) {
        if (pdetails[key].length != 0) // if its not an array
            pdetails[key].remove();
        delete pdetails[key];
    });

    if (currentTooltip) currentTooltip.remove();
}
function hidePageGear() {
    // Remove All Weapons
    if (pgear.allWeapons) {
        for (let i = pgear.allWeapons.length - 1; i > -1; --i)
            pgear.allWeapons[i].remove();
        delete pgear.allWeapons;
    }

    // Remove All Equipments
    if (pgear.allEquipments) {
        for (let i = pgear.allEquipments.length - 1; i > -1; --i)
            pgear.allEquipments[i].remove();
        delete pgear.allEquipments;
    }

    // Remove All Carryings
    if (pgear.allCarryings) {
        for (let i = pgear.allCarryings.length - 1; i > -1; --i)
            pgear.allCarryings[i].remove();
        delete pgear.allCarryings;
    }

    Object.keys(pgear).forEach(function (key) {
        if (pgear[key].length != 0) // if its not an array
            pgear[key].remove();
        delete pgear[key];
    });
}
function hidePageAbilities() {
    // Remove All Abilities
    if (pspells.allAbilities) {
        for (let i = pspells.allAbilities.length - 1; i > -1; --i)
            pspells.allAbilities[i].remove();
        delete pspells.allAbilities;
    }

    if (pspells.allSpells) {
        for (let i = pspells.allSpells.length - 1; i > -1; --i)
            pspells.allSpells[i].remove();
        delete pspells.allSpells;
    }


    Object.keys(pspells).forEach(function (key) {
        if (pspells[key].length != 0) // if its not an array
            pspells[key].remove();
        delete pspells[key];
    });

    if (currentTooltip) currentTooltip.remove();
}