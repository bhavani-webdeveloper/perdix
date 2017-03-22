window.integrateSwitchApp = function () {
	alert('STOP');
	if ($ && $('#linkOn7') && $('#linkOn7').length) {
		setTimeout(integrateSwitchApp, 60000);
		console.log('waiting 60000 secs');
	} else {
		setTimeout(integrateSwitchApp, 1000);
		console.log('waiting 1000 secs');
		try {
			$ && $('<a id="linkOn7" href="#" class="mnu1" onClick="integrationApi.switchApp()">Perdix 8</a>').prependTo($('.top-sec td[align="right"]'));
		} catch (e) {}
	}
};
setTimeout(integrateSwitchApp, 3000);
