define({
	pageUID: "base.dashboard.loans.individual.screening.detail.PortfolioAnalyticsView",
	pageType: "Engine",
	dependencies: ["$log", "IndividualLoan", "SessionStore"],
	$pageFn: function ($log, IndividualLoan, SessionStore) {
		var htmlSections = {
			incomeTables: `
<div class="col-md-6 col-sm-6">
	<table class="table table-condensed table-bordered table-sm table-responsive">
		<colgroup><col width="33%"><col width="33%"><col width="33%"></colgroup>
		<tbody>
			<tr class="table-sub-header" style="font-size: 30px;"><th class="text-center" colspan="2">{{model.portfolioAnalytics.emiProfitPercentage.toFixed(2)}}%</th><th><div ng-style="model.portfolioAnalytics.emiProfitPercentage<=model.emiProfitThreshold?{\'background-color\':\'#18c118\'}:{\'background-color\':\'#FFBF00\'}">&nbsp;</div></th></tr>
			<tr class="table-sub-header"><th <td class="text-center">{{"% Time & Above" | translate}}</th><th class="text-center">{{"Income" | translate}}</th><th class="text-center">{{"Ability to Pay" | translate}}</th></tr>
			<tr><td class="text-center">{{model.emiProfitThreshold}}%</td><td class="text-center">{{model.portfolioAnalytics.incomeAverage.toLocaleString("en-in")}}</td><td class="text-center">{{model.portfolioAnalytics.ability.toLocaleString("en-in")}}</td></tr>
		</tbody>
	</table>
	<table class="table table-bordered table-condensed table-sm table-responsive">
		<colgroup><col width="65%"><col width="35%"></colgroup>
		<tbody>
			<tr><td>{{"Avarage" | translate}}</td><td style="text-align:right">{{model.portfolioAnalytics.incomeAverage.toLocaleString("en-in")}}</td></tr>
			<tr><td>{{"Std Dev" | translate}}</td><td style="text-align:right">{{model.portfolioAnalytics.incomeStdDev.toLocaleString("en-in")}}</td></tr>
			<tr><td>{{model.portfolioAnalytics.incomeSimulationRange}}%</td><td style="text-align:right">{{model.portfolioAnalytics.incomePercentile.toLocaleString("en-in")}}</td></tr>
			<tr><td>{{"Ability" | translate}}</td><td style="text-align:right">{{model.portfolioAnalytics.ability.toLocaleString("en-in")}}</td></tr>
			<tr><td>{{"Kinara EMI" | translate}}</td><td style="text-align:right">{{model.portfolioAnalytics.emi.toLocaleString("en-in")}}</td></tr>
			<tr><td>{{"Kinara EMI % to Net Income" | translate}}</td><td style="text-align:right">{{model.portfolioAnalytics.emiProfitPercentage.toFixed(3)}}</td></tr>
		</tbody>
	</table>
</div>`,
			incomeChart: `
<div class="col-md-6 col-sm-6">
	<style>
		.bar rect {
			fill: steelblue;
		}
		.bar text {
			fill: #fff;
			font: 10px sans-serif;
		}
		.axis path, .axis line {
			fill: none;
			stroke: #000;
			shape-rendering: crispEdges;
		}
	</style>
	<svg id="simulatedIncome" ng-init="model.init('simulatedIncome')"></svg>
</div>`,
			bankBalanceTables: `
<div class="col-md-6 col-sm-6">
	<table class="table table-bordered table-sm table-responsive table-condensed">
		<colgroup><col width="33%"><col width="33%"><col width="33%"></colgroup>
		<tbody>
			<tr class="table-sub-header" style="font-size: 30px;"><th class="text-center" colspan="2">{{model.portfolioAnalytics.emiBankBalancePercentage.toFixed(2)}}%</th><th><div ng-style="model.portfolioAnalytics.emiBankBalancePercentage<=model.emiBankBalanceThreshold?{\'background-color\':\'#18c118\'}:{\'background-color\':\'#FFBF00\'}">&nbsp;</div></th></tr>
			<tr class="table-sub-header"><th class="text-center">{{"% Time & Above" | translate}}</th><th class="text-center">{{"Income" | translate}}</th><th >{{"Ability to Pay" | translate}}</th></tr>
			<tr><td class="text-center">{{model.emiBankBalanceThreshold}}%</td><td class="text-center">{{model.portfolioAnalytics.bankBalancePercentile.toLocaleString("en-in")}}</td><td class="text-center">{{model.portfolioAnalytics.bankBalancePercentile.toLocaleString("en-in")}}</td></tr>
		</tbody>
	</table>
	<table class="table table-condensed table-bordered table-sm table-responsive">
		<colgroup><col width="65%"><col width="35%"></colgroup>
		<tbody>
			<tr><td>{{"Avarage" | translate}}</td><td style="text-align:right">{{model.portfolioAnalytics.bankBalanceAverage.toLocaleString("en-in")}}</td></tr>
			<tr><td>{{"Std Dev" | translate}}</td><td style="text-align:right">{{model.portfolioAnalytics.bankBalanceStdDev.toLocaleString("en-in")}}</td></tr>
			<tr><td>{{model.portfolioAnalytics.bankBalanceSimulationRange}}%</td><td style="text-align:right">{{model.portfolioAnalytics.bankBalancePercentile.toLocaleString("en-in")}}</td></tr>
			<tr><td>{{"Kinara EMI" | translate}}</td><td style="text-align:right">{{model.portfolioAnalytics.emi.toLocaleString("en-in")}}</td></tr>
			<tr><td>{{"Kinara EMI % to MC ABB" | translate}}</td><td style="text-align:right">{{model.portfolioAnalytics.emiBankBalancePercentage.toFixed(3)}}</td></tr>
		</tbody>
	</table>
</div>`,
			bankBalanceChart: `
<div class="col-md-6 col-sm-6">
	<style>
		.bar rect {
			fill: steelblue;
		}
		.bar text {
			fill: #fff;
			font: 10px sans-serif;
		}
		.axis path, .axis line {
			fill: none;
			stroke: #000;
			shape-rendering: crispEdges;
		}
	</style>
	<svg id="simulatedBankBalance" ng-init="model.init('simulatedBankBalance')"></svg>
</div>`
		};
		return {
			"type": "schema-form",
			"title": "PORTFOLIO_ANALYTICS",
			initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
				var self = this;
				self.form = [{
					"type": "section",
					"html": '<br><div style="text-align:center">Waiting for summary..<br><br><ripple-loader></ripple-loader></div>'
				}];
				model.emiProfitThreshold = SessionStore.getGlobalSetting("portfolioAnalytics.emiProfitThreshold");
				model.emiBankBalanceThreshold = SessionStore.getGlobalSetting("portfolioAnalytics.emiBankBalanceThreshold");
				model.portfolioAnalytics = [];
				model.portfolioAnalyticsSimulations = [];
				model.portfolioData = IndividualLoan.getPortfolioAnalytics({ "loanId": model.loanId }).$promise.then(function (resp) {
					model.portfolioAnalytics = resp.portfolioAnalytics;
					model.portfolioAnalyticsSimulations = resp.portfolioAnalyticsSimulations;
					self.form = [{
						"type": "box",
						"colClass": "col-sm-12",
						"title": "Net Income Vs Kinara EMI",
						"items": [{
							"type": "section",
							"html": htmlSections.incomeTables
						}, {
							"type": "section",
							"html": htmlSections.incomeChart
						}]
					}, {
						"type": "box",
						"colClass": "col-sm-12",
						"title": "Avg Bank Balance Vs Kinara EMI",
						"items": [{
							"type": "section",
							"html": htmlSections.bankBalanceTables
						}, {
							"type": "section",
							"html": htmlSections.bankBalanceChart
						}]
					}];
				}, function (err) {
					self.form = [{
						"type": "section",
						"html": '<br><div style="text-align:center">Failed: ' + err.data.error + '</div>'
					}];
				});
				model.initSvg = function (svgId) {

				};
				model.init = function (svgId) {
					var data = [];
					for (var i = 0; i < model.portfolioAnalyticsSimulations.length; i++) {
						data.push(model.portfolioAnalyticsSimulations[i][svgId]);
					}
					var formatCount = d3.format(",.0f");
					var width = ((window.innerWidth < 1200) ? ((window.innerWidth < 700) ? 200 : 250) : 450),
						height = ((window.innerWidth < 1200) ? ((window.innerWidth < 700) ? 200 : 250) : 300);
					var svg = d3.select("#" + svgId)
						.attr("width", width)
						.attr("height", height);
					var margin = { top: 10, right: 30, bottom: 30, left: 30 };
					var width = width - margin.left - margin.right;
					var height = height - margin.top - margin.bottom;
					var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
					var max = d3.max(data)
					var min = d3.min(data)
					var x = d3.scale.linear()
						.domain([min, max])
						.range([0, width]);
					var xAxis = d3.svg.axis()
						.scale(x)
						.orient("bottom");

					var bin = d3.layout.histogram()
						.bins(x.ticks(20))
						(data);
					var yMax = d3.max(bin, function (d) { return d.length })
					var yMin = d3.min(bin, function (d) { return d.length })

					var y = d3.scale.linear()
						.domain([0, yMax])
						.range([height - 20, 0]);
					var yAxis = d3.svg.axis()
						.scale(y)
						.orient("left");

					var bar = g.selectAll(".bar")
						.data(bin)
						.enter().append("g")
						.attr("class", "bar")
						.attr("transform", function (d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

					bar.append("rect")
						.attr("x", 1)
						.attr("width", x(bin[0].dx) - x(0) - 1)
						.attr("height", function (d) { return (height - 20) - y(d.y); })
						.on("mouseover", function (d) {
							var xPosition = 50;
							var yPosition = 30;
							svg.append("text")
								.attr("id", "tooltip")
								.attr("x", xPosition)
								.attr("y", yPosition)
								.attr("text-anchor", "middle")
								.text(d.y);
						})
						.on("mouseout", function (d) {
							d3.select('#tooltip').remove();
						});
					if (window.innerWidth > 960) {
						bar.append("text")
							.attr("dy", ".75em")
							.attr("y", 6)
							.attr("x", (x(bin[0].dx) - x(0)) / 2)
							.attr("text-anchor", "middle")
							.text(function (d) { return formatCount(d.y); });
					}
					g.append("g")
						.attr("class", "axis axis--x")
						.attr("transform", "translate(0," + (height - 20) + ")")
						.call(xAxis)
						.selectAll("text")
						.attr("dx", "-.8em")
						.attr("dy", ".35em")
						.attr("transform", "rotate(45 -10 10)")
						.style("text-anchor", "start");
					g.append("g")
						.attr("class", "axis")
						.attr("transform", "translate(0," + height - 20 + ")")
						.call(yAxis);
				}
			},
			form: [],
			schema: { "type": "object", "properties": { "a": { "type": "string" } } },
			actions: {}
		};
	}
});