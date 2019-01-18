var irf = irf || {};
var commons = irf.commons = angular.module("IRFCommons", ['IRFModels', 'ui.bootstrap']);

commons.constant("languages", {
	"en": {
		"code": "en",
		"codeLanguage": "En",
		"titleLanguage": "English",
		"titleEnglish": "English"
	},
	"hi": {
		"code": "hi",
		"codeLanguage": "क",
		"titleLanguage": "हिन्दी",
		"titleEnglish": "Hindi"
	},
	"ta": {
		"code": "ta",
		"codeLanguage": "த",
		"titleLanguage": "தமிழ்",
		"titleEnglish": "Tamil"
	}
});

irf.commons.factory("irfConfig", function(){
	var dataMainPath = "process/";
	return {
		elementsViewpath: "modules/irfelements/templates/default/",
		getMenuDefUrl: function() {
			return dataMainPath + "MenuDefinition.json";
		},
		getFSDefUrl: function(processType) {
			return dataMainPath + "ProcessTypes/" + processType + "/FieldSetsDefinition.json";
		},
		getSchemaDefUrl: function(processType) {
			return dataMainPath + "ProcessTypes/" + processType + "/SchemaDefinition.json";
		},
		getOldStageDefUrl: function(processType) {
			return dataMainPath + "ProcessTypes/" + processType + "/StagesOldDefinition.json";
		},
		getStageDefUrl: function(processType) {
			return dataMainPath + "ProcessTypes/" + processType + "/StagesDefinition.json";
		},
		getActionsUrl: function(processType) {
			return dataMainPath + "ProcessTypes/" + processType + "/irfActions.js";
		}
	};
});

irf.commons.filter("age", function() {
	return function(dob) {
		if (dob)
			return moment().diff(dob, "years");
		else
			return "NA";
	}
});

irf.initCap = function(input) {
	return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
};

irf.commons.filter("initcap", function() {
	return irf.initCap;
});

irf.commons.filter("userDate", ["SessionStore", function(SessionStore) {
	return function(rawDate) {
		if (rawDate)
			return SessionStore.getFormatedDate(moment(rawDate, SessionStore.getSystemDateFormat()));
		return rawDate;
	}
}]);

irf.commons.factory("Utils", ["$log", "$q", "$http", function($log, $q, $http){
	var isCordovaFlag = typeof cordova !== 'undefined';
	return {
		isCordova: isCordovaFlag,

		downloadFile:function(url){
			try {

				try {
					cordova.InAppBrowser.open(url, '_system', 'location=yes');
					return true;
				} catch (err) {
					window.open(url, '_blank', 'location=yes');
					return true;
				}
			}catch(err){
				console.error(err);
			}
			return false;
		},
		roundToDecimal: function(amount){
			return (Math.round( amount * 1e2 ) / 1e2);
		},
		getFullName: function(f, m, l) {
			return f + (m&l?' '+m:'') + (l?' '+l:'');
		},
		alert: function(message, title) {
			var deferred = $q.defer();
			if (typeof cordova === 'undefined') {
				alert(message);
				deferred.resolve();
			} else {
				navigator.notification.alert(
					message,
					function() {
						deferred.resolve();
					}, // callback
					(typeof title === 'undefined' || !title) ? 'Alert' : title, // title
					'OK'
				);
			}
			return deferred.promise;
		},
		confirm: function(message, title) {
			var deferred = $q.defer();
			if (typeof cordova === 'undefined') {
				if (window.confirm(message))
					deferred.resolve();
				else 
					deferred.reject();
			} else {
				navigator.notification.confirm(
					message,
					function(buttonText){
						$log.debug('User Responded for confirm:'+buttonText);
						if(buttonText===1) deferred.resolve();
						else deferred.reject();
					},
					(typeof title === 'undefined' || !title) ? 'Confirm' : title, // title
					['Yes', 'No']
				);
			}
			return deferred.promise;
		},
		swiper: function(swipeBody, swipeMenu) {
			window.mySwipe = new Swipe($(swipeBody)[0], {continuous:false, callback:function(i, el) {
				$(swipeMenu + ' .active').removeClass('active');
				$(swipeMenu + ' a[href="#'+(i+1)+'"]').parent().addClass('active');
				window.scrollTo(0, 0);
			}});
			$(swipeMenu + ' a').click(function(e) {
				e.preventDefault();
				try {
					var i = Number(this.hash.substr(1));
					if(!i) return;
					window.mySwipe.slide(i-1);
				} catch(e) {}
			});
			window.scrollTo(0, 0);
		},
		getCurrentDate:function(){
            //TODO : format date
            // var date = new Date();
            // var y = date.getFullYear();
            // var m = (date.getMonth()+1);
            // var d = date.getDate();
            // m = (m.toString().length<2)?("0"+m):m;
            // d = (d.toString().length<2)?("0"+d):d;

            return moment().format('YYYY-MM-DD');
        },
		getCurrentDateTime:function(){
            return moment().format();
        },
        convertJSONTimestampToDate: function(jsonTimestamp){
            var a = moment.utc(jsonTimestamp);
            return a.format("YYYY-MM-DD");
        },
		removeNulls:function(obj, recurse) {

			for (var i in obj) {
				try{
					delete obj[i].$promise;
					delete obj[i].$resolved;

				}catch(err){

				}
				if (obj[i] === null) {
					delete obj[i];
				}else if(_.isArray(obj[i])){
                    if(obj[i].length<=0){
                        delete obj[i];
                    }
					else if(recurse){
						this.removeNulls(obj[i],recurse);
					}
                }
                else if (recurse && typeof obj[i] === 'object') {

					this.removeNulls(obj[i], recurse);
				}
			}
			return obj;
		},
        ceil: function(x){
            if (!_.isNumber(x)){
                try{
                    x = x * 1;
                } catch(e){
                    return x;
                }

            }

            if (_.isNumber(x)){
                return Math.ceil(x);
            }

        },
        /**
         * Compare two dates and return 1 if aData>bDate, 0 if equals, -1 otherwise
         * @param  {string} aDate In format "Y-m-d". E.g : 2016-12-12
         * @param  {string} bDate In format "Y-m-d"
         * @return {int}       [description]
         */
        compareDates: function(aDate, bDate){
    		var aMDate = moment(aDate);
    		var bMDate = moment(bDate);
    		if (aDate > bDate){
    			return 1;
    		} else if (aDate == bDate){
    			return 0
    		} else {
    			return -1;
    		}
        },
		millisecondsToStr: function(milliseconds) {
			// TIP: to find current time in milliseconds, use:
			// var  current_time_milliseconds = new Date().getTime();

			function numberEnding (number) {
				return (number > 1) ? 's' : '';
			}

			var temp = Math.floor(milliseconds / 1000);
			var years = Math.floor(temp / 31536000);
			if (years) {
				return years + ' year' + numberEnding(years);
			}
			//TODO: Months! Maybe weeks? 
			var days = Math.floor((temp %= 31536000) / 86400);
			if (days) {
				return days + ' day' + numberEnding(days);
			}
			var hours = Math.floor((temp %= 86400) / 3600);
			if (hours) {
				return hours + ' hour' + numberEnding(hours);
			}
			var minutes = Math.floor((temp %= 3600) / 60);
			if (minutes) {
				return minutes + ' minute' + numberEnding(minutes);
			}
			var seconds = temp % 60;
			if (seconds) {
				return seconds + ' second' + numberEnding(seconds);
			}
			return 'less than a second'; //'just now' //or other string you like;
			// return moment(milliseconds).humanize();
		},
        dateToLocalTZ: function(mysqlDate){
        	var localUtcOffset = moment().utcOffset();
        	return moment.utc(mysqlDate).utcOffset(localUtcOffset);
        },
        randomString: function(length){
        	return Math.random().toString(36).substring(2, length+2);
        },
		generateUUID: function() {
			var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
				return v.toString(16);
			});
			$log.info("Generated UUID: " + uuid);
			return uuid;
		},
		updateAppTitle: function(menuTitle) {
			document.title = translateFilter(menuTitle) + " | " + document.mainTitle;
		}
	};
}]);

irf.commons.factory("BiometricService", ['$log', '$q','irfSimpleModal','$sce','Files', function($log, $q,irfSimpleModal,$sce, Files){

	return {
        getLabel: function(fingerId){
            var labelCode = null;
            switch (fingerId){
                case 'LeftThumb':
                    labelCode = 'LEFT_HAND_THUMB';
                    break;
                case 'LeftIndex':
                    labelCode = 'LEFT_HAND_INDEX';
                    break;
                case 'LeftMiddle':
                    labelCode = 'LEFT_HAND_MIDDLE';
                    break;
                case 'LeftRing':
                    labelCode = 'LEFT_HAND_RING';
                    break;
                case 'LeftLittle':
                    labelCode = 'LEFT_HAND_SMALL';
                    break;
                case 'RightThumb':
                    labelCode = 'RIGHT_HAND_THUMB';
                    break;
                case 'RightIndex':
                    labelCode = 'RIGHT_HAND_INDEX';
                    break;
                case 'RightMiddle':
                    labelCode = 'RIGHT_HAND_MIDDLE';
                    break;
                case 'RightRing':
                    labelCode = 'RIGHT_HAND_RING';
                    break;
                case 'RightLittle':
                    labelCode = 'RIGHT_HAND_SMALL';
                    break;
            }
            return labelCode;
        },
        getFingerTF: function(fingerId){
            var tableField = null;
            switch (fingerId) {
                case 'LeftThumb':
                    tableField = 'leftHandThumpImageId';
                    break;
                case 'LeftIndex':
                    tableField = 'leftHandIndexImageId';
                    break;
                case 'LeftMiddle':
                    tableField = 'leftHandMiddleImageId';
                    break;
                case 'LeftRing':
                    tableField = 'leftHandRingImageId';
                    break;
                case 'LeftLittle':
                    tableField = 'leftHandSmallImageId';
                    break;
                case 'RightThumb':
                    tableField = 'rightHandThumpImageId';
                    break;
                case 'RightIndex':
                    tableField = 'rightHandIndexImageId';
                    break;
                case 'RightMiddle':
                    tableField = 'rightHandMiddleImageId';
                    break;
                case 'RightRing':
                    tableField = 'rightHandRingImageId';
                    break;
                case 'RightLittle':
                    tableField = 'rightHandSmallImageId';
                    break;
            }

            return tableField;
        },
        validate: function(fingerObj) {
        	var fingerObj= fingerObj;
        	var deferred = $q.defer();
			var fingerData;
			var response;
			var result = [];
			var fileId = null;
			var BiometricHTML = '\
			<select ng-model="selectedFinger" ng-change="model.changeFinger(selectedFinger)">\
			<option value="LeftThumb">LeftThumb</option>\
			<option value="LeftIndex">LeftIndex</option>\
			<option value="LeftMiddle">LeftMiddle</option>\
			<option value="LeftRing">LeftRing</option>\
			<option value="LeftLittle">LeftLittle</option>\
			<option value="RightThumb">RightThumb</option>\
			<option value="RightIndex">RightIndex</option>\
			<option value="RightMiddle">RightMiddle</option>\
			<option value="RightRing">RightRing</option>\
			<option value="RightLittle">RightLittle</option>\
			</select>\
			<applet code="in/gov/uidai/auth/biometric/VerifyApplet.class" archive="resources/fingerprintutil/FingerPrintUtil.jar" id="verificationApplet" height="20px"></applet>\
			<button ng-click="model.takeData();">Validate Finger</button>\
			<div id="responsediv" class="text-danger">\
			</div>';

                
                var BiometricModal = irfSimpleModal("Choose a finger to Validate Biometric Data", BiometricHTML, {
                	"result": result,
                	changeFinger: function(fingerId) {
                		// Get Finger Data Using API
                		fileId = fingerObj[fingerId];
                	},
                	takeData: function() {
                		Files.getBase64DataFromFileId(fileId, {}, true)
                		.then(function(res) {
                			fingerData = res;
                			var applet = document.getElementById('verificationApplet');
                			var responsediv = document.getElementById('responsediv');
	                		result = applet.getMatch(fingerData);
	                		responsediv.innerHTML=result;
	                		deferred.resolve(result);
                		}, function(err) {
                			responsediv.innerHTML=err;
                			deferred.reject(err);
                		});
                	}
                });

            return deferred.promise;
        },
		capture: function(model){
			var deferred = $q.defer();
			if (typeof(cordova)!=='undefined' && cordova && cordova.plugins && cordova.plugins.irfBluetooth && _.isFunction(cordova.plugins.irfBluetooth.enroll)) {
				cordova.plugins.irfBluetooth.enroll(function(result){
					if (result && result.code === 200 && result.data) {
						var out = result.data;
						var returnVals = {};
                        var tableField = null;

						for (var key in out){
							if (out.hasOwnProperty(key)){
                                tableField = null;
								switch (key) {
                                    case 'LeftThumb':
                                        tableField = 'leftHandThumpImageId';
                                        break;
                                    case 'LeftIndex':
                                        tableField = 'leftHandIndexImageId';
                                        break;
                                    case 'LeftMiddle':
                                        tableField = 'leftHandMiddleImageId';
                                        break;
                                    case 'LeftRing':
                                        tableField = 'leftHandRingImageId';
                                        break;
                                    case 'LeftLittle':
                                        tableField = 'leftHandSmallImageId';
                                        break;
                                    case 'RightThumb':
                                        tableField = 'rightHandThumpImageId';
                                        break;
                                    case 'RightIndex':
                                        tableField = 'rightHandIndexImageId';
                                        break;
                                    case 'RightMiddle':
                                        tableField = 'rightHandMiddleImageId';
                                        break;
                                    case 'RightRing':
                                        tableField = 'rightHandRingImageId';
                                        break;
                                    case 'RightLittle':
                                        tableField = 'rightHandSmallImageId';
                                        break;
                                }
                                if (tableField!=null) {
                                    out[key]['table_field'] = tableField;
                                }
							}
						}
						deferred.resolve(out);
					} else {
						deferred.reject('ERR_BIOMETRIC_CAPTURE_INVALID');
					}
				}, function(error){
					deferred.reject('ERR_BIOMETRIC_CAPTURE_FAILED');
				});
			} else if (navigator.userAgent.indexOf("Trident") > 0 || navigator.userAgent.indexOf("MSIE") > 0 || (navigator.userAgent.indexOf("Firefox") > 0 && parseInt(navigator.userAgent.match(/Firefox\/([0-9]+)\./)[1]) < 60)) {
				var BiometricHTML = '\
                    <applet code="in/gov/uidai/auth/biometric/FingerPrintCaptureApplet.class" archive="resources/fingerprintutil/FingerPrintUtil.jar" id="webCaptureApplet" height="250px" width="525px"><param name="isEkycMode" value="false"> Choose a finger</applet>\
                    <button ng-click="$close(model.takeData())">Confirm</button>';
                var result = [];
                var out = null;

                var BiometricModal = irfSimpleModal("Capture Data", BiometricHTML, {
                	"result": result,
                	"takeData": function() {
                		var applet = document.getElementById('webCaptureApplet');
                		result = applet.getFingerPrints();
                		var tableField = null;
                		var thumb = null;
                		var obj = {};
                		for (var i = 0; i < result.length; i++) {
							
							switch (i) {
                                    case 0:
                                        tableField = 'leftHandThumpImageId';
                                        thumb = 'LeftThumb';
                                        break;
                                    case 1:
                                        tableField = 'leftHandIndexImageId';
                                        thumb = 'LeftIndex';
                                        break;
                                    case 2:
                                        tableField = 'leftHandMiddleImageId';
                                        thumb = 'LeftMiddle';
                                        break;
                                    case 3:
                                        tableField = 'leftHandRingImageId';
                                        thumb = 'LeftRing';
                                        break;
                                    case 4:
                                        tableField = 'leftHandSmallImageId';
                                        thumb = 'LeftLittle';
                                        break;
                                    case 5:
                                        tableField = 'rightHandThumpImageId';
                                        thumb = 'RightThumb';
                                        break;
                                    case 6:
                                        tableField = 'rightHandIndexImageId';
                                        thumb = 'RightIndex';
                                        break;
                                    case 7:
                                        tableField = 'rightHandMiddleImageId';
                                        thumb = 'RightMiddle';
                                        break;
                                    case 8:
                                        tableField = 'rightHandRingImageId';
                                        thumb = 'RightRing';
                                        break;
                                    case 9:
                                        tableField = 'rightHandSmallImageId';
                                        thumb = 'RightLittle';
                                        break;
                                }
                                if (tableField!=null) {                                	
                                    obj[thumb] = {};
                                    obj[thumb]['data'] = result[i];
                                    obj[thumb]['table_field'] = tableField;
                                }

							             			
                		}
                		
                		return obj;
                		
                		// deferred.resolve(result);
                	}
                });
               

                BiometricModal.result.then(function(obj) {
                	console.log(obj)
                	deferred.resolve(obj);
                }, function(){
                	console.log("Modal closed by user");
                	deferred.reject();
                })
			} else {
				deferred.reject('ERR_BIOMETRIC_PLUGIN_MISSING');
			}
			return deferred.promise;
		}
	}
}])

irf.commons.factory("irfLazyLoader", ["$state", "$log", "$timeout", function($state, $log, $timeout){
	return {
		loadPage: function(toState, toParams, options){
			var pageDefPath = "pages/" + toParams.pageName.replace(/\./g, "/");
        	require([pageDefPath], function(pageDefObj){
        		/* Page is loaded, now bind it to pages */
        		$log.info("[REQUIRE] Done loading page(" + toParams.pageName + ")");
        		irf.pageCollection.loadPage(pageDefObj.pageUID, pageDefObj.dependencies, pageDefObj.$pageFn);
        		options.reload = true;

        		$timeout(function(){
        			$state.go(toState.name, toParams, options);	
        		}, 10)
        	}, function(err){
        		$log.info("[REQUIRE] Error loading page(" + toParams.pageName + ")");
        		$log.error(err);
        	})
		} 
	}
}])


irf.commons.service("PrinterData", ["$state", "$log", "$timeout", function($state, $log, $timeout){
		this.FONT_LARGE_BOLD =2,
		this.FONT_LARGE_NORMAL =1,
		this.FONT_SMALL_NORMAL =3,
		this.FONT_SMALL_BOLD =4,
		this.lines =[],

		this.getLineLength =function(font) {
			if (font == this.FONT_LARGE_BOLD || font == this.FONT_LARGE_NORMAL) {
				return 24;
			} else {
				return 42;
			}
		},

		this.addLine =function(text, opts) {
			opts['font'] = opts['font'] || this.FONT_SMALL_NORMAL;
			opts['center'] = _.has(opts, 'center') && _.isBoolean(opts['center']) ? opts['center'] : false;
			var obj = {
				"bFont": opts['font'],
				"text": text,
				"style": {
					"center": opts['center']
				}
			};
			this.lines.push(obj);
			return this;
		},

		this.addKeyValueLine =function(key, value, opts) {
			opts['font'] = opts['font'] || this.FONT_SMALL_NORMAL;
			var keyLength = parseInt(this.getLineLength(opts['font']) / 2) - 1;
			var line = _.padEnd(key, keyLength, ' ') + ': ' + value;
			var obj = {
				"bFont": opts['font'],
				"text": line,
				"style": {
					"center": false
				}
			};
			this.lines.push(obj);
			return this;
		},

		this.addStrRepeatingLine =function(str, opts) {
			opts['font'] = opts['font'] || this.FONT_SMALL_NORMAL;
			var lineLength = this.getLineLength(opts['font']);
			var line = _.padEnd("", lineLength, '-')
			var obj = {
				"bFont": opts['font'],
				"text": line,
				"style": {
					"center": false
				}
			};
			this.lines.push(obj);
			return this;
		},

		this.addLines =function(lines) {
			this.lines = this.lines.concat(lines);
		},

		this.getLines =function() {
			return this.lines;
		}
}])
irf.commons.service('irfPrinter',["$log","PageHelper","Utils","irfSimpleModal",function($log,PageHelper,Utils,irfSimpleModal){
	var self = this;
	self.printPreview = function(printData){
		self.data = printData;
		if (Utils.isCordova && self.data.thermalReceipt) {
			self.thermalReceipt = generateThermelPrint(data.thermalReceipt);
			// self.previewHtml = self.thermalReceipt.html;
			self.previewHtml = '<div class="web-print-wrapper">' + self.webPrintStyle + self.thermalReceipt.html + '</div>'
		} else if (self.data.paperReceipt) {
			self.previewHtml = '<div class="web-print-wrapper">' + self.webPrintStyle + printData.paperReceipt + '</div>'
		}
		self.thermalReceipt = generateThermelPrint(self.data.thermalReceipt);
		// self.previewHtml = self.thermalReceipt.html;
		// self.previewHtml = '<div class="web-print-wrapper">' + self.webPrintStyle + self.thermalReceipt.html + '</div>'
		self.previewHtml = mapButtonToHtml(self.previewHtml);
		irfSimpleModal('Print Preview', self.previewHtml, {
			print: function() {
				self.print();
			}
		});
	}
	self.print = function(){
			try {
				if (Utils.isCordova && self.thermalReceipt.data) {
					cordova.plugins.irfBluetooth.print(function() {
						console.log("succc callback");
					}, function(err) {
						console.error(err);
						console.log("errr callback");
					}, self.thermalReceipt.data);
				} else if (self.data.paperReceipt) {
					// var restorepage = document.body.innerHTML;
					// var printcontent = document.getElementsByClassName("web-print-wrapper")
					// $('body').empty().html(printcontent.innerHTML);
					// document.body.innerHTML = printcontent[0].innerHTML;
					window.print();
					// document.body.innerHTML = restorepage;
					// window.print();
					// $("#web-print-wrapper").printElement();
				} else {
					PageHelper.clearErrors();
					PageHelper.setError({message: 'No Data To Print'});
				}
			} catch (err) {
				console.log(err);
				$log.info("pringing web data");
			}
	}
	var mapButtonToHtml = function(html){
		var button = `<br><div><button ng-click=model.print()>PRINT</button></div><br>`;
		return html + button;
	}
	var generateThermelPrint = function(opts) {
		// Code 
			// 2 - string,
			// 3 - line,
			// 4 - keyvalue

		// self.FONT_LARGE_BOLD =2,
		// self.FONT_LARGE_NORMAL =1,
		// self.FONT_SMALL_NORMAL =3,
		// self.FONT_SMALL_BOLD =4,
		var fontHtml = [
			[''],
			['<h3 style="white-space: pre">', '</h3>'],
			['<h3 style="white-space: pre"><strong>', '</strong></h3>'],
			['<p style="white-space: pre">', '<p>'],
			['<p style="white-space: pre"><strong>', '</strong></p>']
		];
		var defaultFont = 3,defaultValue="",defaultCenter=false,data = [];
		var html = '<div style="font-family:monospace">';
		for(var i=0; i<opts.length; i++){
			font = defaultFont;
			value = defaultValue;
			center = defaultCenter;
			if(opts[i].length==2){										
				center = false;
				font  = opts[i][0]+1 < 5 ? opts[i][0] : defaultFont;
				value = _.padEnd(" ",font+3 < 5 ?  24: 42,opts[i][1]);
			}
			else if (opts[i].length == 3){
				center = opts[i][0] == 0 ? false : true;
				font = opts[i][1]+1 < 5 ? opts[i][1] : defaultFont;
				value = opts[i][2];
			}
			else if (opts[i].length == 4){
				center = opts[i][0] == 0 ? false : true;
				font = opts[i][1]+1 < 5? opts[i][1] : defaultFont;
				value = _.padEnd(opts[i][2], font+3 < 5 ?  11: 23) + ': ' + opts[i][3];
			}
			var d = {
				"bFont": font,
				"text": value,
				"style": {
					"center": center
				}
			};
			data.push(d);
			var t = d.style.center? '<center>'+d.text+'</center>': d.text;
			html += fontHtml[d.bFont][0] + t + fontHtml[d.bFont][1] + "";
		}
		return {
			data: data,
			html: html + '</div>'
		};
	}
	self.webPrintStyle = '<style>@media print { body * { visibility: hidden; } .web-print-wrapper, .web-print-wrapper * { visibility: visible } .web-print-wrapper { position: absolute; top: 0; left: 0;} .web-print-wrapper > div {page-break-after:auto;} html, body {height: 100%;}}</style>';
}])