
MainApp.directive('irfHeader', function(){
	return {
		restrict: "E",
		replace: true,
		scope: {
			theme: '='
		},
		templateUrl: "modules/app/templates/header.html",
		link: function(scope, elem, attrs, ctrl) {
			//ctrl.init(elem);
		},
		controller: "irfHeaderController",
		controllerAs: "c"
	};
});

MainApp.controller("irfHeaderController",
["$scope", "$log", "$http", "$templateCache", "irfConfig", "SessionStore", "$translate", "languages", "$state", "$q", "User", "Message",
	"authService", "irfSimpleModal", "irfProgressMessage", "irfStorageService", "Utils", "Auth", "PageHelper", "Account", "formHelper",
function($scope, $log, $http, $templateCache, irfConfig, SessionStore, $translate, languages, $state, $q, User, Message,
	authService, irfSimpleModal, irfProgressMessage, irfStorageService, Utils, Auth, PageHelper, Account, formHelper) {

	$scope.ss = SessionStore;

	$scope.photo = SessionStore.getPhoto();

	$("a[href='#']").click(function(e){e.preventDefault()});

	$scope.branchSwitch = {
		"showBranchSelect": false,
		"currentBranch": SessionStore.getCurrentBranch()
	};

	this.toggleSwitchBranch = function(){
		$scope.branchSwitch.showBranchSelect = !!!$scope.branchSwitch.showBranchSelect;
	}

	this.updateNewBranch = function($event, selectedBranch){
		var $this = this;
		var currentBranch = SessionStore.getCurrentBranch();
		Utils.confirm("Are you sure you want to switch to " + selectedBranch.branchName + "?")
		.then(function(){

			PageHelper.showBlockingLoader("Switching...");
			Auth.changeBranch({userId: SessionStore.getLoginname(), branchName: selectedBranch.branchName})
				.$promise
				.then(function(response){
					/* Now load centres for the user */
					Account.getCentresForUser(selectedBranch.branchId, SessionStore.getLoginname())
						.then(function(centres){
							selectedBranch.centresMappedToUser = centres;
						})
						.finally(function(){
							$this.toggleSwitchBranch();
							SessionStore.setCurrentBranch(selectedBranch);	
							window.location.reload();
						})
				}, function(httpResponse){
					Utils.alert("Unknown error while trying to switch branch");
				})
				.finally(function(){
					PageHelper.hideBlockingLoader();
				})
			
		},
		function(){
			$scope.branchSwitch.selectedBranch = $scope.branchSwitch.currentBranch;
		})
	}

	$scope.preventClose = function($event){
		$event.stopPropagation();
	}

	/* Loading branch details */
	var branches = SessionStore.getItem("UserAllowedBranches");
	//getting the home branch details from masters
	var homeBranch = Account.getHomeBranchForUser();
	var homebranchCode = homeBranch.branchCode;
	/* Need to add homebranch to list, if its already not there */
	var indexForHome = _.findIndex(branches, function(b){
		return b.branchCode == homebranchCode;
	})

	if (indexForHome == -1) {
		branches.push(homeBranch);
	}

	$scope.branchSwitch.allowedBranches = branches;
	$scope.branchSwitch.selectedBranch = $scope.branchSwitch.currentBranch;

	/* Conversations */
	var simpleSchemaFormHtml =
'    <section class="content">                               '+
'        <div class="row">                                   '+
'            <irf-sf                                         '+
'                initialize=""                               '+
'                irf-schema="model.schema"                   '+
'                irf-form="model.form"                       '+
'                irf-actions="model.actions"                 '+
'                irf-model="model.model"                     '+
'                irf-helper="model.formHelper"               '+
'                irf-form-name="model.formName">             '+
'                <div class="cantina-loader-wrapper"><div classs="cantina-loader"></div></div>'+
'            </irf-sf>'+
'        </div>'+
'    </section>';

	var newParticipantForm = {
		"key": ["newParticipant"],
		"title": "Search for participant",
		"type": "lov",
		"inputMap": {
			"userName": {
				"key": "userName"
			},
			"login": {
				"key": "login"
			},
			"branchName": {
				"key": "branchName"
			}
		},
		"searchHelper": formHelper,
		"search": function(inputModel, form) {
			return User.query({
				userName: inputModel.userName,
				login: inputModel.login,
				branchName: inputModel.branchName
			}).$promise;
		},
		getListDisplayItem: function(data, index) {
			return [
				data.login,
				data.userName,
				data.branchName
			];
		},
		onSelect: function(valueObj, model, context){
			model.newParticipant = valueObj;
		}
	};

	var newParticipantSchema = {
		"type": "object",
		"properties": {
			"newParticipant": {
				"title": "Search for participant",
				"type": "string"
			},
			"userName": {
				"title": "User Name",
				"type": "string"
			},
			"login": {
				"title": "LOGIN",
				"type": "string"
			},
			"branchName": {
				"title": "BRANCH_NAME",
				"type": "string",
				"x-schema-form": {
					"type": "select",
					"enumCode": "branch"
				}
			},
			"messageThreads": {
				"type": "object",
				"properties": {
					"messageParticipants": {
						"type": "array",
						"items": {
							"type": "object",
							"properties": {
								"participant": {
									"type": "string",
									"title": "LOGIN"
								},
								"participant_name": {
									"type": "string",
									"title": "User Name"
								}
							}
						}
					}
				}
			}
		}
	};

	var createConversationForm = [{
		"type": "section",
		"condition": "model.errorMsg",
		"html": '<div class="callout callout-danger"><p ng-bind="model.errorMsg"></p></div>'
	}, {
		"key": "messageThreads.title",
		"title": "Conversation Title",
		"required": true,
		"type": "text"
	}, {
		"key": "messageThreads.reference_type",
		"condition": "!model.reducedAccess",
		"title": "Reference Type",
		"required": true,
		"type": "text"
	}, {
		"key": "messageThreads.reference_no",
		"condition": "!model.reducedAccess",
		"title": "Reference ID",
		"required": true,
		"type": "number"
	}, {
		"key": "messageThreads.reference_no",
		"condition": "model.reducedAccess",
		"title": "Reference",
		"titleExpr": "model.messageThreads.reference_type + ' Reference ID'",
		"readonly": true,
		"type": "number"
	}, {
		"key": "messageThreads.messageParticipants",
		"title": "Participant",
		"startEmpty": true,
		"required": true,
		//"view": "fixed",
		"type": "array",
		"items": [{
			"key": "messageThreads.messageParticipants[].participant",
			"title": "LOGIN",
			"type": "lov",
			"lovonly": true,
			"required": true,
			"inputMap": {
				"userName": {
					"key": "userName"
				},
				"login": {
					"key": "login"
				},
				"branchName": {
					"key": "branchName"
				}
			},
			"searchHelper": formHelper,
			"search": function(inputModel, form) {
				return User.query({
					userName: inputModel.userName,
					login: inputModel.login,
					branchName: inputModel.branchName
				}).$promise;
			},
			getListDisplayItem: function(data, index) {
				return [
					data.login,
					data.userName,
					data.branchName
				];
			},
			onSelect: function(valueObj, model, context){
				model.messageThreads.messageParticipants[context.arrayIndex].participant = valueObj.login;
				model.messageThreads.messageParticipants[context.arrayIndex].participant_name = valueObj.userName;
			}
		}, {
			"key": "messageThreads.messageParticipants[].participant_name",
			"title": "User Name",
			"type": "text",
			"readonly": true
		}]
	}, {
		"key": "messageThreads.message",
		"title": "Message",
		"required": true,
		"type": "textarea"
	}, {
		"type": "button",
		"title": "Create Conversation",
		"onClick": "actions.createConversation(model, formCtrl, form, $event)"
	}];

	$scope.unreadMessageCount = 0;
	$scope.userStatus = {}; // future use
	$scope.userStatus.message = "Happiness is not the absence of problems, it's the ability to deal with them";
	$scope.conv = {
		conversations: []
	};

	var userObj = {user_id: $scope.ss.session.login};

	var getUnreadMessageCount = function() {
		return Message.getUnreadMessageCount(userObj).$promise.then(function(response) {
			$scope.unreadMessageCount = Number(response.headers['unread-message-count']);
		});
	};

	var getUnreadMessageThreadList = function() {
		return Message.unreadMessageThreadList(userObj).$promise.then(function(response) {
			if (response && response.conversations && response.conversations.length) {
				for (i in response.conversations) {
					response.conversations[i].lastMessageSince = moment(response.conversations[i].created_at, 'YYYY-MM-DD HH:mm:ss').fromNow();
				}
			}
			$scope.conv = response;
		});
	};

	var getMessageList = function(conversationData) {
		return Message.messageList({thread_id: conversationData.thread_id}).$promise.then(function(response) {
			conversationData.conversations = response.conversations.reverse();
		});
	};

	var getMessageThreadParticipants = function(conversationData) {
		Message.messageThreadParticipants({thread_id: conversationData.thread_id}).$promise.then(function(response) {
			conversationData.participants = response.participants;
			conversationData.participantsMap = {};
			for (i in conversationData.participants) {
				var p = conversationData.participants[i];
				if (p.last_read_at)
					p.lastReadSince = moment(p.last_read_at, 'YYYY-MM-DD HH:mm:ss').fromNow();
				conversationData.participantsMap[p.participant] = p;
			}
		});
	};

	var addMessageParticipant = function(conversationData) {
		if (!conversationData || !conversationData.newParticipant || !conversationData.newParticipant.login || !conversationData.newParticipant.userName) {
			Utils.alert("No user selected");
			return;
		}
		Message.addMessageParticipant({
			"messageThreads": {
				"thread_id": conversationData.thread_id,
				"messageParticipants": [{
					"participant": conversationData.newParticipant.login,
					"participantName": conversationData.newParticipant.userName
				}]
			}
		}).$promise.finally(function() {
			getMessageThreadParticipants(conversationData);
		});
	};

	var addMessage = function(conversationData) {
		Message.addMessage({
			"messageThreads": {
				"thread_id": conversationData.thread_id,
				"message": conversationData.newMessage,
				"participant": conversationData.user_id
			}
		}).$promise.finally(function(response) {
			conversationData.newMessage = "";
			getMessageList(conversationData).finally(function() {
				setTimeout(function() {
					var chatBox = $(".direct-chat-messages")[0];
					chatBox.scrollTop = chatBox.scrollHeight;
				});
			});
		});
	};

	/*var closeConversation = function(conversationData) {
		return Message.closeMessage({thread_id: conversationData.thread_id, user_id: conversationData.user_id});
	};*/

	$scope.openMessageThreadListMenu = function($event) {
		if(!$($event.currentTarget).is('.open')) {
			getUnreadMessageThreadList();
		}
	};

	$scope.openConversation = function(chat, $event) {
		$event && $event.preventDefault();
		var conversationData = {
			thread_id: chat.id,
			user_id: $scope.ss.session.login,
			newParticipantForm: newParticipantForm,
			newParticipantSchema: newParticipantSchema,
			addMessageParticipant: addMessageParticipant,
			addMessage: addMessage,
			newParticipant: {},
			conversations: [],
			participants: []
		};
		var getMsgListPromise = getMessageList(conversationData);
		getMessageThreadParticipants(conversationData);
		$http.get('modules/app/templates/conversation.html', {cache: $templateCache}).then(function(response) {
			var conversationWindow = irfSimpleModal(chat.title, response.data, conversationData);
			conversationWindow.opened.then(function() {
				Message.messageRead({thread_id: chat.id, user_id: $scope.ss.session.login}).$promise.then(function() {
					getUnreadMessageCount();
				});
			});
			/*conversationData.closeConversation = function(model) {
				Utils.confirm("Are you Sure? The conversation will be closed & won't be visible to any participants").then(function() {
					closeConversation(model).$promise.finally(function() {
						conversationWindow.close();
					});
				});
			};*/
			$q.all([getMsgListPromise, conversationWindow.opened]).finally(function() {
				setTimeout(function() {
					var chatBox = $(".direct-chat-messages")[0];
					chatBox.scrollTop = chatBox.scrollHeight;
				});
			});
		});
	};

	$scope.createConversation = function(initModel, reducedAccess) {
		var model = initModel || {};
		model.reducedAccess = !!reducedAccess;
		var createConversationModel = {
			"formName": "createConversationForm",
			"formHelper": formHelper,
			"schema": newParticipantSchema,
			"form": createConversationForm,
			"model": model,
			"actions": {}
		};
		var createConversationWindow = irfSimpleModal('Create new conversation', simpleSchemaFormHtml, createConversationModel);

		createConversationModel.actions.createConversation = function(model, formCtrl, form, $event) {
			model.errorMsg = null;
			if (model && model.messageThreads) {
				if (!model.messageThreads.title || !model.messageThreads.reference_no) {
					model.errorMsg = "Title & reference number are required";
				} else if (!model.messageThreads.messageParticipants || !model.messageThreads.messageParticipants.length || !model.messageThreads.messageParticipants[0].participant) {
					model.errorMsg = "Atleast one participant is required";
				} else if (!model.messageThreads.message) {
					model.errorMsg = "Message is required";
				} else {
					PageHelper.showBlockingLoader("Creating Conversation");
					var isThere = false;
					for (i in model.messageThreads.messageParticipants) {
						var p = model.messageThreads.messageParticipants[i];
						if ($scope.ss.session.login == p.participant) {
							isThere = true;
							break;
						}
					}
					if (!isThere) {
						model.messageThreads.messageParticipants.push({
							participant: $scope.ss.session.login,
							participant_name: $scope.ss.getUsername()
						});
					}
					Message.createMessage(model).$promise.then(function(resp) {
						createConversationWindow.close();
						$scope.openConversation(resp.messageThreads, $event);
					}).finally(function() {
						PageHelper.hideBlockingLoader();
					});
				}
			} else {
				model.errorMsg = ":-( that's a NO!";
			}
		};
	};

	Message.openConversation = $scope.openConversation;
	Message.createConversation = $scope.createConversation;

	// Future Use
	$scope.updateStatusMessage = function($event) {
		$event.preventDefault();
		irfSimpleModal('Status Update', '<textarea ng-model="model.userStatus.message" class="form-control" style="width:100%"></textarea>', {userStatus: $scope.userStatus}).closed.then(function() {
			// update $scope.userStatus.message on server
		});
	};

	if (typeof(SessionStore.session.offline) != 'undefined' && !SessionStore.session.offline) {
		getUnreadMessageCount();
		getUnreadMessageThreadList();
		$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams, options){
			getUnreadMessageCount();
		});
	}
	/* Conversations END */

	$scope.showLogs = function() {
		var allLogs = $log.getAllLogs();
		var body = '<div class="log-div">' + allLogs + '</div>';
		irfSimpleModal('<i class="fa fa-terminal">&nbsp;</i>Console Logs', body).opened.then(function(){
			setTimeout(function() {
				$(".log-div span.object").each(function(){
					try {
						var jjson = JSON.parse($(this).text());
						$(this).html('');
						this.appendChild(renderjson.set_show_to_level(1)(jjson));
					} catch (e) {}
				});
				$('.modal-dialog button.pull-left')[0].scrollIntoView({
					behavior: "smooth",
					block: "end",
				});
			}, 500);
		});
	};

	$scope.clearLogs = function() {
		$log.clearLogs();
		irfProgressMessage.pop("logs", "Console Logs Cleared", 2500);
	};

	$scope.gotoPageEngine = function(stateParams) {
		$state.go('Page.Engine', stateParams);
	};

	$scope.logout = function() {
		var promise = authService.logout();
		promise.then(
			function(){
				$state.go("Login");
			}, function(){
				alert('Logout failed');
			}
		)
	};

	$scope.downloadFile = function(url, e) {
		e.preventDefault();
		Utils.downloadFile(url);
	};

	$scope.languages = languages;

	$scope.changeLanguage = function(lang) {
		$translate.use(lang.code);
		SessionStore.session.language = lang.code;
	};

	var dxScale = 0.1;
	$scope.changeFontSize = function(event, increase) {
		event.preventDefault();
		if (typeof(increase)=='undefined')
			initialScale = 1;
		else
			initialScale += increase ? dxScale : -dxScale;
		setFontSize(initialScale);
	};

	var setFontSize = function(scale) {
		$('meta[name="viewport"]').attr("content", "width=100, initial-scale=" + scale + ", maximum-scale=" + scale + ", user-scalable=no");
		$scope.scalePercent = Math.round(scale * 100) - 100;
		localStorage.setItem('initialScale', scale);
	};

	var initialScale = localStorage.getItem('initialScale');
	if (initialScale == null)
		initialScale = 1;
	else
		initialScale = Number(initialScale);
	setFontSize(initialScale);

	$scope.isTouchDevice = (function () {
		try {
			document.createEvent("TouchEvent");
			return true;
		} catch (e) {
			return false;
		}
	})();
}]);
