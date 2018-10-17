var irfSessionManager = angular.module("irf.SessionManager", []);

irfSessionManager.constant("dateFormats", ["DD-MM-YYYY", "DD-MMM-YYYY", "Do MMM YYYY", "dddd Do MMM YYYY", "YYYY-DD-MM"]);

irfSessionManager.factory('SessionStore', ["$log", "$window", "dateFormats", function($log, $window, dateFormats){
	var self = this;

	self.session = {
		passwordHash: null,
		//photo: "//bit.ly/1SEDKqa",
		//photo: '//bit.ly/1V4DF1Z',
		status: "invalid",
		activated:false,
		agentAmtLimit:null,
		bankName:null,
		branchName:"Karambayam",
		branchSetCode:null,
		email:null,
		firstName:null,
		id:null,
		langKey:null,
		lastName:null,
		login:null,
		password:null,
		roleCode:null,
		roles:null,
		version:null,
		currentBranch: {
			branchCode: "",
			branchNamme: "",
			branchId: ""
		},
		activeBranch: null,
		global: {}
	};
	var session = self.session;

	self.profile = {

	};

	self.settings = {
		
	};

	self.clear = function() {
		session = self.session = {};
		self.profile = {};
		self.settings = {};
	};

	self.getUsername = function() {
		return (session.firstName || session.lastName)
			? [session.firstName, session.lastName].join(" ")
			: (session.userName ? session.userName : session.login);
	};

	self.getLoginname = function() {
		return session.login;
	};

	self.getEmail = function() {
		return session.email;
	};

	self.verifyPassword = function(password) {
		return password === session.passwordHash;
	};

	self.getRole = function() {
		if (session.role) {
			return session.role.name;
		} else {
			return session.roleCode;
		}
	};

	self.getUserRole = function() {
		return session.role;
	};

	self.getLanguage = function() {
		return session.language ? session.language : (self.settings.language ? self.settings.language : self.getSystemPreferredLanguage());
	};

	self.setLanguage = function(l) {
		self.session.language = l;
	};

	self.getSystemAllowedLanguages = function () {
		if(self.session.global && self.session.global['allowedLanguages']) {
			return self.session.global['allowedLanguages'].split(",");
		}
		return [self.getSystemPreferredLanguage()];
	};

	self.getSystemPreferredLanguage = function () {
		return self.session.global && self.session.global['preferredLanguage'] ? self.session.global['preferredLanguage'] : 'en';
	}

	self.getBranch = function() {
		//return session.branchName;
		//The getBranch method is made to return the current branch which is selected in SERVER
		return self.getActiveBranch();
	};

	self.getBranchCode = function() {
		return session.branchCode;
	};

	self.getBranchId = function() {
		return session.branchId;
	};

	self.getBankName = function() {
		return session.bankName;
	};

	self.getCentres = function() {
		return session.centres;
	}

	self.getPhoto = function() {
		return session.photo;
	};

	self.getSystemDateFormat = function() {
		return 'YYYY-MM-DD';
	};

	self.getDateFormat = function() {
		return (self.settings && self.settings.dateFormat) ? self.settings.dateFormat : dateFormats[0];
	};

	self.getFormatedDate = function(dt) {
		return dt ? dt.format(self.getDateFormat()) : dt;
	};

	self.getCBSDate = function() {
		return session.cbsDate;
	}

	self.getSystemDate = function() {
		return session.systemDate;
	}

	self.getFormatedCBSDate = function() {
		return moment(session.cbsDate, self.getSystemDateFormat()).format(self.getDateFormat());
	}

	self.getFormatedSystemDate = function() {
		return moment(session.systemDate, self.getSystemDateFormat()).format(self.getDateFormat());
	}

	self.getGlobalSetting = function(key) {
		return session.global[key];
	};

	self.setItem = function(key, value){
		value = JSON.stringify(value);
		$window.localStorage.setItem(key, value);
	};

	self.getItem = function(key){
		return JSON.parse($window.localStorage.getItem(key));
	};

	self.removeItem = function(key){
		$window.localStorage.removeItem(key);
	};

	self.setSession = function(session) {
		angular.extend(self.session, session);
	};

	self.getCurrentBranch = function(){
		var currentBranch = self.getItem('UserCurrentBranch');
		if (currentBranch){
			return currentBranch;
		} else {
			return {
				branchCode: session.branchCode,
				branchName: session.branchName,
				branchId: session.branchId
			}
		}
		return self.session.currentBranch;
	}

	self.setCurrentBranch = function(currentBranch){
		if (_.hasIn(currentBranch, 'branchId') && _.hasIn(currentBranch, 'branchName') && _.hasIn(currentBranch, 'branchCode')){
			self.setItem("UserCurrentBranch", currentBranch);
			return true;
		}
		return false;
	}

	self.getActiveBranch = function() {
		return (angular.isUndefined(session.activeBranch) || session.activeBranch == null) ? session.branchName : session.activeBranch;
	};

	self.getHomeBranchName = function() {
		return session.branchName;
	};

	return self;
}]);