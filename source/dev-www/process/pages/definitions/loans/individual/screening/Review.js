irf.pageCollection.factory(irf.page("loans.individual.screening.Review"),
["$log", 'SchemaResource', 'PageHelper', "Utils", "IndividualLoan", "SessionStore", "irfCurrencyFilter",
function($log, SchemaResource, PageHelper, Utils, IndividualLoan, SessionStore, irfCurrencyFilter){

	return {
		"type": "schema-form",
		"title": "REVIEW",
		"subTitle": "BUSINESS",
		initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
			model.currentStage = bundleModel.currentStage;
			
			if (model.loanAccount && model.loanAccount.id) {
				PageHelper.showLoader();
				IndividualLoan.loanRemarksSummary({id: model.loanAccount.id}).$promise.then(function (resp){
					model.loanSummary = resp;
					if (_.isArray(model.loanSummary) && model.loanSummary.length > 0){
						var lastEntry = model.loanSummary[model.loanSummary.length - 1];
						var aTime = new moment(lastEntry.createdDate);
						var bTime = new moment();
						model.minutesInCurrentStage = Utils.millisecondsToStr( Math.abs(bTime.diff(aTime)) );
					}

					model.loanSummary.push({
						createdDate: moment().format("YYYY-MM-DD[T]hh:mm:ss[Z]"),
						isCurrentStage: true,
						_conversationExpand: true,
						id: 9
					});
				}).finally(PageHelper.hideLoader);
			}
		},
		offline: false,
		eventListeners: {},
		form: [{
			"type": "section",
			"htmlClass": "col-sm-12",
			"html":"<div class='callout callout-info text-white'><h1>{{ model.minutesInCurrentStage }}</h1> <p>spent in current stage.</p></div>"
		}, {
			"type": "timeline",
			"key": "loanSummary",
			"dateFormat": SessionStore.getDateFormat(),
			"sortOrder": "DESC",
			"momentFn": function(item, index) {
				item._timeSpent = moment.duration(item.timeSpent * 60 * 1000).humanize();
				if (item.isCurrentStage) {
					item._titleHtml = '';
				} else {
					item._titleHtml = '<b>'+item.userId+'</b> ';
					if (item.action == 'SAVE') {
						item._titleHtml += 'saved ';
					} else {
						item._titleHtml += 'moved from <b>'+item.preStage+'</b> to ';
					}
					item._titleHtml += '<b>'+item.postStage+'</b>, took <b>'+item._timeSpent+'</b>';
				}
				item._bodyHtml = '<div class="row"><div class="col-sm-4">Loan Amount: <b>'+irfCurrencyFilter(item.loanAmount)+'</b></div>';
				item._bodyHtml += '<div class="col-sm-4">Interest Rate: <b>'+item.interestRate+'</b></div>';
				item._bodyHtml += '<div class="col-sm-4">Tenure: <b>'+item.tenure+'</b></div></div>';
				if (item.status)
					item._bodyHtml += '<b>Status:</b> '+item.status+'<br>';
				item._footerHtml = '<b>Remarks:</b> <div style="white-space: pre-wrap;">'+(item.remarks?item.remarks:'--')+'</div><hr>';
				
				item._footerHtml += '<a href="" style="display: inherit;text-align: center;" ng-if="!model.loanSummary['+index+']._conversationExpand" ng-click="model.loanSummary['+index+']._conversationExpand=true" class="color-theme">{{\'VIEW_CONVERSATION\'|translate}}</a>'
					+'<irf-messaging process-id="model.loanAccount.id" sub-process-id="model.loanSummary['+index+'].id" conversation="model.loanSummary['+index+'].conversation" expand="model.loanSummary['+index+']._conversationExpand" readonly="!model.loanSummary['+index+'].isCurrentStage"></irf-messaging>';

				return moment(item.createdDate, "YYYY-MM-DD[T]hh:mm:ss[Z]");
			}
		}],
		schema: function() {
			return SchemaResource.getLoanAccountSchema().$promise;
		},
		actions: {}
	};
}]);
