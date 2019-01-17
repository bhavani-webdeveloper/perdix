irf.appConfig.CONNECT_PERDIX7 = false;
irf.appConfig.CORPORATE_LOGO = "img/corporate_logo.IREPDhan.png";
irf.appConfig.FORCE_COLOR = "";
irf.appConfig.AMS_ENABLED = false;


var blurActiveNumber = function(e) {
    if (document.activeElement.type === "number") {
        document.activeElement.blur();
        e.preventDefault();
    }
    return true;
}
var keyBlurActive = function(e) {
    if (e.which == 38 || e.which == 40) {
        blurActiveNumber(e);
    }
    return true;
}
document.addEventListener("wheel", blurActiveNumber);
document.addEventListener("keydown", keyBlurActive);