irf.models.factory("Message", [
"$resource", "$httpParamSerializer", "SessionStore",
function($resource, $httpParamSerializer, SessionStore) {
	var endpoint = irf.MANAGEMENT_BASE_URL + '/server-ext/message';

	var resource =  $resource(endpoint, null, {
		getUnreadMessageCount: {
			method:'HEAD',
			url:endpoint+'/getUnreadMessageCount.php',
			transformResponse: function(data, headers){
				response = {
					data: data,
					headers: headers()
				};
				return response;
			}
		},
		unreadMessageThreadList: {
			method: 'GET',
			url: endpoint+'/unReadMessageThreadList.php'
		},
		messageThreadList: {
			method: 'GET',
			url: endpoint+'/messageThreadList.php'
		},
		createMessage: {
			method: 'POST',
			url: endpoint+'/createMessage.php'
		},
		messageList: {
			method: 'GET',
			url: endpoint+'/MessageList.php'
		},
		messageThreadParticipants: {
			method: 'GET',
			url: endpoint+'/MessageThreadParticipants.php'
		},
		messageRead: {
			method: 'HEAD',
			url: endpoint+'/messageRead.php'
		},
		addMessageParticipant: {
			method: 'POST',
			url: endpoint+'/addMessageParticipant.php'
		},
		addMessage: {
			method: 'POST',
			url: endpoint+'/addMessage.php'
		},
		getThreadForLoan: {
			method: 'HEAD',
			url: endpoint+'/getThreadForLoan.php',
			transformResponse: function(data, headers){
				response = {
					data: data,
					headers: headers()
				};
				return response;
			}
		}/*,
		closeMessage: {
			method: 'HEAD',
			url: endpoint+'/closeMessage.php'
		}*/
	});

	// resource.openConversation = function(chat) {} // this function is be available to use in here. no need to uncomment. this is for reference
	/*
	chat = {
		id: 1,
		title: ''
	};
	*/

	// resource.createConversation = function(initModel) {} // this function is be available to use in here. no need to uncomment. this is for reference
	/*
	initModel = {
		messageThreads: {
			title: '',
			reference_no: 0,
			messageParticipants: [{
				participant: '',
				participant_name: ''
			}],
			message: ''
		}
	};
	*/

	resource.openOrCreateConversation = function(referenceType, referenceNumber) {
		var threadId = null, threadTitle = null;
		resource.getThreadForLoan({loanId: referenceNumber}).$promise.then(function(response) {
			threadId = response.headers['thread-id'];
			threadTitle = response.headers['thread-title'];
		}).finally(function() {
			if (threadId) {
				resource.openConversation({
					id: threadId,
					title: threadTitle
				});
			} else {
				resource.createConversation({
					"messageThreads": {
						"title": "For " + referenceType + ": " + referenceNumber,
						"reference_no": Number(referenceNumber)
					}
				}, true);
			}
		});
	};

	return resource;
}]);