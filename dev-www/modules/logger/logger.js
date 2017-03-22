var irf = irf || {};
/*
----Under Dev----
@TODO:
1. Log message to Server endpoint
2. Format error report/console output 

Usage:
1. Add irfLogger as module dependency and use $log for logging
2. To log ajax calls, config() the module as follows:

.config(function($httpProvider) {
	$httpProvider.interceptors.push('irfHttpLogInterceptor');
});

*/
angular.module('IRFLogger', [])
.service('$log', function () {
	var self = this;

	self.loggingEnabled = true;
	self.showConsole = true;
	self.saveLog = false;
	self.lastLogTime = null;

	var log2Server = function(logLevel,msg){
		//logLevel =  v,d,i,w,e corresponding to Verbose, Debug, Info, Warn and Error
		//@TODO : Log to server endpoint
		// console.log("Sending Report to server");
	};

	self.allLogs = "";

	var _saveLog = function(logLevel, msg) {
		var log = msg;
		self.lastLogTime = moment(new Date());
		head = '<span class="time">' + self.lastLogTime.format('MMM-DD:HH:mm:ss') + ' =&gt; </span>';
		if (_.isObject(msg)) {
			log = '<span class="object">' + JSON.stringify(msg) + '</span>';
		}
		log = head + log;
		switch (logLevel) {
			case 'info':
				self.allLogs +=  '<p class="info">' + log + '</p>\r\n';
				break;
			case 'debug':
				self.allLogs +=  '<p class="debug">' + log + '</p>\r\n';
				break;
			case 'warn':
				self.allLogs +=  '<p class="warn">' + log + '</p>\r\n';
				break;
			case 'error':
				self.allLogs +=  '<p class="error">' + log + '</p>\r\n';
				break;
			default:
				self.allLogs +=  '<p class="log">' + log + '</p>\r\n';
		}
	};

	self.getAllLogs = function() {
		return self.allLogs;
	};

	self.clearLogs = function() {
		self.allLogs = "";
	};

	var windowConsole = window.console;
	irf.windowConsole = windowConsole;
	window.console = {};

	window.console.log = function (msg) {
		if (self.loggingEnabled) {
			if (self.showConsole) windowConsole.log(msg);
			if (self.saveLog) _saveLog('log', msg);
		}
	};

	window.console.debug = function (msg) {
		if (self.loggingEnabled) {
			if (self.showConsole) windowConsole.debug(msg);
			if (self.saveLog) _saveLog('debug', msg);
		}
	};

	window.console.info = function (msg) {
		if (self.loggingEnabled) {
			if (self.showConsole) windowConsole.info(msg);
			if (self.saveLog) _saveLog('info', msg);
		}
	};

	window.console.warn = function (msg) {
		if (self.loggingEnabled) {
			if (self.showConsole) windowConsole.warn(msg);
			if (self.saveLog) _saveLog('warn', msg);
		}
	};

	window.console.error = function (msg) {
		if (self.loggingEnabled) {
			if (self.showConsole) windowConsole.error(msg);
			if (self.saveLog) _saveLog('error', msg);
		}
	};

	self.log = window.console.log;
	self.info = window.console.info;
	self.debug = window.console.debug;
	self.warn = window.console.warn;
	self.error = window.console.error;

	window.onerror = function(message, file, line, position, error) {
		_saveLog('error', {message:message, file:file, line:line, position:position, error:error});
	};

})
.config(['$provide', function($provide){
	$provide.decorator('$exceptionHandler', ['$log', function($log){
		return function(exception, cause){
			$log.error.apply($log, [exception.stack]);
		};
	}]);
}])
.factory('irfHttpLogInterceptor',function($q,$log){
	var httpInterceptor = {
		'request': function (config) {
			config.msBeforeAjaxCall = new Date().getTime();
			return config;
		},
		'response': function (response) {
			if (response.config.warningAfter) {
				var msAfterAjaxCall = new Date().getTime();
				var timeTakenInMs =  msAfterAjaxCall - response.config.msBeforeAjaxCall;
				if (timeTakenInMs > response.config.warningAfter) {
					$log.warn({ 
					  timeTakenInMs: timeTakenInMs, 
					  config: response.config, 
					  data: response.data });
				}
			}
			return response;
		},
		'responseError': function (rejection) {
			var errorMessage = "timeout";
			if (rejection && rejection.status && rejection.data) {
				errorMessage = rejection.data.ExceptionMessage;
			}
			$log.error({ 
					  errorMessage: errorMessage, 
					  status: rejection.status, 
					  config: rejection.config,
					  data:rejection.data});

			return $q.reject(rejection);
		}
	};
	return httpInterceptor;
});
