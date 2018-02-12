irf.models.factory('Journal', ["$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "Upload", "$q", "PageHelper",
	function($resource, $httpParamSerializer, BASE_URL, searchResource, Upload, $q, PageHelper) {

		var endpoint = BASE_URL + '/api/maintenance';
		//var endpoint2 = BASE_URL + '/api/journalPosting';

		var resource = $resource(endpoint, null, {
			createJournal: {
				method: 'POST',
				url: endpoint + '/journalMaintenance'
			},
			updateJournal: {
				method: 'PUT',
				url: endpoint + '/journalMaintenance'
			},
			createJournalEntry: {
				method: 'POST',
				url: BASE_URL + '/api/journalPosting/doubleEntry'
			},
			updateJournalEntry: {
				method: 'PUT',
				url: BASE_URL + '/api/journalPosting/doubleEntry'
			},
			closeJournal: {
				method: 'PUT',
				url: endpoint + '/journalMaintenance/close'
			},
			journalSearch: searchResource({
				method: 'GET',
				url: endpoint + '/journalMaintenance/find'
			}),
			journalEntrySearch: searchResource({
				method: 'GET',
				url: BASE_URL + '/api/maintenance/doubleEntry/find'
			}),
			get: {
				method: 'GET',
				url: endpoint + '/journalMaintenance/:id'
			},
			getJournalEntry: {
				method: 'GET',
				url: BASE_URL + '/api/journalPosting/doubleEntry/:id'
			},
		});

		resource.JournalEntryUpload = function(file, progress) {
			var deferred = $q.defer();
			Upload.upload({
				url: BASE_URL + "/api/feed/journalEntryUpload",
				data: {
					file: file,
					currentStage:"journalEntry",
					action:"SAVE"
				}
			}).then(function(resp) {
				PageHelper.showProgress("page-init", "successfully uploaded.", 2000);
				deferred.resolve(resp);
			}, function(errResp) {
				PageHelper.showErrors(errResp);
				deferred.reject(errResp);
			}, progress);
			return deferred.promise;
		};
		
		return resource;
	}
]);