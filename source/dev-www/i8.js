window.integrateSwitchApp = function () {
	if ($ && $('#connect_perdix7') && $('#connect_perdix7').is(':visible')) {
		setTimeout(integrateSwitchApp, 60000);
		console.log('waiting 60000 secs');
	} else {
		setTimeout(integrateSwitchApp, 1000);
		console.log('waiting 1000 secs');
		$('#connect_perdix7').show();
	}
};
integrateSwitchApp();