document.addEventListener("DOMContentLoaded", function (event) {
    start();
    // Disable Right Click
    document.addEventListener("contextmenu", (event) => { event.preventDefault(); }, false);
    // Keyboard Listeners
    window.addEventListener('keydown', onKeyDown, false);
    window.addEventListener('keyup', onKeyUp, false);
    // Resize Listener
    window.addEventListener('resize', onWindowResize, false);
    // On Focus Lost
    window.addEventListener('blur', onBlur, false);

    setInterval(update);
});

function onBlur(event) {
}
function onKeyDown(event) {
    //event.keyCode == 65
}
function onKeyUp(event) {
}
function onWindowResize() {

}

function formatNumber(x) {
    return x >= 0 ? "+" + x: x;
}