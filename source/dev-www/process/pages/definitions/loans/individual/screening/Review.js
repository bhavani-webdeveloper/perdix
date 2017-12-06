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

					var currentStage = _.findLastKey(model.loanSummary, {'action': 'PROCEED' });
					model.loanSummary[currentStage].isCurrentStage = true;
					model.loanSummary[currentStage]._conversationExpand = true;					
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
					item._titleHtml = '<div class="row"><div class="col-sm-2"><small>User ID</small><br><strong>'+item.userId+'</strong></div> ';
					item._titleHtml += '<div class="col-sm-2"><small>Action</small><br><strong>';
					if (item.action == 'SAVE') {
						item._titleHtml += 'Saved';
					} else {
						item._titleHtml += 'Proceed';
					}
					item._titleHtml += '</strong></div>';
					item._titleHtml += '<div class="col-sm-2"><small>From stage</small><br><strong>'+item.preStage+'</strong></div>';
					item._titleHtml += '<div class="col-sm-2"><small>To stage</small><br><strong>'+item.postStage+'</strong></div>';
					item._titleHtml += '<div class="col-sm-2"><small>Time taken</small><br><strong>'+item._timeSpent+'</strong></div>';
					item._titleHtml += '<div class="col-sm-2"></div>';
				}
				item._bodyHtml = '<div class="row"><div class="col-sm-4">Loan Amount: <b>'+irfCurrencyFilter(item.loanAmount)+'</b></div>';
				item._bodyHtml += '<div class="col-sm-4">Interest Rate: <b>'+item.interestRate+'</b></div>';
				item._bodyHtml += '<div class="col-sm-4">Tenure: <b>'+item.tenure+'</b></div></div>';
				if (item.status)
					item._bodyHtml += '<b>Status:</b> '+item.status+'<br>';
				item._footerHtml = '<b>Remarks:</b> <div style="white-space: pre-wrap;">'+(item.remarks?item.remarks:'--')+'</div>';
				if (item.action == 'PROCEED') {
					item._footerHtml += '<hr><a href="" style="display: inherit;text-align: center;" ng-if="!model.loanSummary['+index+']._conversationExpand" ng-click="model.loanSummary['+index+']._conversationExpand=true" class="color-theme">{{\'VIEW_CONVERSATION\'|translate}}</a>'
						+'<irf-messaging process-id="model.loanAccount.id" sub-process-id="model.loanSummary['+index+'].id" conversation="model.loanSummary['+index+'].conversation" expand="model.loanSummary['+index+']._conversationExpand" readonly="!model.loanSummary['+index+'].isCurrentStage"></irf-messaging>';
				}

				return moment(item.createdDate, "YYYY-MM-DD[T]hh:mm:ss[Z]");
			}
		}],
		schema: function() {
			return SchemaResource.getLoanAccountSchema().$promise;
		},
		actions: {}
	};
}]);
