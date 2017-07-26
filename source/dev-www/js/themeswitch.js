var themeswitch = {};
themeswitch.currentTheme = "skin-blue-light";
themeswitch.changeTheme = function(color, saveOffline) {
	var newTheme = 'skin-'+color+'-light';
	document.body.className = document.body.className.replace(new RegExp("(?:^|\\s)"+themeswitch.currentTheme+"(?!\\S)", "g"), ' '+newTheme+' ');
	themeswitch.currentTheme = newTheme;
	if (saveOffline) {
		themeswitch.saveThemeColor(color);
	}
	return false;
};
themeswitch.getThemeColor = function(){
	return irf.appManifest && irf.appManifest.force_color? irf.appManifest.force_color: (localStorage.getItem("irfThemeColor") || 'blue');
};
themeswitch.saveThemeColor = function(color){
	return localStorage.setItem("irfThemeColor", color);
};
themeswitch.irfThemeColor = themeswitch.getThemeColor();
if (!themeswitch.irfThemeColor) {
	themeswitch.saveThemeColor(themeswitch.irfThemeColor);
}
themeswitch.changeTheme(themeswitch.irfThemeColor);