<?php

//function SpecificData($AuthToken, $LoanId, $ScoreName) {
if(isset($_GET))
{
	header("Access-Control-Allow-Headers: Content-Type, accept, Authorization, X-Requested-With"); 
	header("Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT"); 
	header("Access-Control-Request-Headers: Content-Type, accept"); 
	header("Access-Control-Expose-Headers: X-Total-Count"); 
	header('Content-Type: application/json'); 

	if (!empty($_SERVER['HTTP_ORIGIN'])) { 
        header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']); 
	} 

	if ($_SERVER['REQUEST_METHOD'] == "OPTIONS") { 
        die(); 
	}
	
	include_once('../includes/db.php');
	include_once('../includes/ConfigureDbs.php');
	
	$error_log = "";
	
	$NameOfTheScore = $_GET['ScoreName'];
	$CustomerLoanId = $_GET['LoanId'];
	$ScoreName = $_GET['ScoreName'];
	$SessionUserName = "admin";
	
	//get all customer details from loan_accounts table
	$CustomerDetails = "SELECT
	'$ScoreName' AS 'ScoreName',
	l.account_number AS 'loan_accountNumber', 
	MAX(app.urn_no) AS `urn_no`, 
	MAX(coapp.id) AS `coapp_customer_id`, 
	l.customer_id AS `enterprise_cust_id`,
	MAX(app.id) AS `customer_id`,
	l.id AS 'loan_id',
	CONCAT_WS(' ', app.first_name, app.middle_name, app.last_name) AS 'enterpriseName',
	l.loan_purpose_1,
	l.loan_purpose_2,
	l.loan_type,
	e.business_type,
	IF(old_loan.id IS NULL, 'No', 'Yes') AS `existing_customer`,
	'' AS 'OverallPassValue',
	'' AS 'OverallWeightedScore',
	'' AS 'OverallPassStatus',
	'' AS 'Parameters'
	FROM $perdix_db.loan_accounts l
	LEFT JOIN $perdix_db.loan_customer_relation lcr ON l.id=lcr.loan_id
	LEFT JOIN $perdix_db.customer app ON (lcr.customer_id=app.id AND lcr.relation IN ('Sole Proprieter', 'APPLICANT'))
	LEFT JOIN $perdix_db.customer coapp ON (lcr.customer_id=coapp.id AND lcr.relation IN ('Co-Applicant', 'COAPPLICANT'))
	LEFT JOIN $perdix_db.customer c ON l.customer_id=c.id
	LEFT JOIN $perdix_db.enterprise e ON c.enterprise_id=e.id
	LEFT JOIN $perdix_db.loan_accounts old_loan ON (l.customer_id=old_loan.customer_id AND old_loan.loan_disbursement_date<CURRENT_DATE())
	WHERE l.id = :CustomerLoanId";
	
	
	try {
		$db = ConnectUAT();
		$CustomerParams = $db->prepare($CustomerDetails);
        $CustomerParams->bindParam("CustomerLoanId", $CustomerLoanId);		
		$CustomerParams->execute();		
		$AvailCustomerParams = $CustomerParams->fetch(PDO::FETCH_ASSOC);
		$db = null;
		
		$CustomerId = isset($AvailCustomerParams['customer_id']) ? $AvailCustomerParams['customer_id'] : '0';
		$CoappCustomerId = isset($AvailCustomerParams['coapp_customer_id']) ? $AvailCustomerParams['coapp_customer_id'] : '0';
		$CustomerURN = $AvailCustomerParams['urn_no'];
		$EnterpriseCustId = $AvailCustomerParams['enterprise_cust_id'];
		$loan_type = $AvailCustomerParams['loan_type'];		
		$loan_purpose_1 = $AvailCustomerParams['loan_purpose_1'];		
		$loan_purpose_2 = $AvailCustomerParams['loan_purpose_2'];		
		$business_type = $AvailCustomerParams['business_type'];		
		$existing_customer = $AvailCustomerParams['existing_customer'];		
	
	} catch(PDOException $e) {
		$error_log['CustomerDetails'] = $e->getMessage();
	}

	$non_negotiable=0;

	// Non-negotiable proxy indicator check starts
	try {
		$db = ConnectUAT();
		$nonNegotiableProxyIndicatorStatement = $db -> prepare("
			SELECT
				(IF(LOWER(bribe_offered) = 'yes', 1, 0)
					+ IF(LOWER(political_or_police_connections) = 'yes', 1, 0)
					+ IF(LOWER(challenging_cheque_bounce) = 'yes', 1, 0)) AS non_negotiable
			FROM customer
			WHERE id = :customerId
		");
        $nonNegotiableProxyIndicatorStatement -> bindParam("customerId", $EnterpriseCustId);
		$nonNegotiableProxyIndicatorStatement -> execute();
		if ($nonNegotiableProxyIndicatorRecord = $nonNegotiableProxyIndicatorStatement -> fetch(PDO::FETCH_ASSOC)) {
			$non_negotiable += $nonNegotiableProxyIndicatorRecord['non_negotiable'];
		}
		$db = null;
	} catch(PDOException $e) {
		$error_log['nonNegotiableProxyIndicatorCheck'] = $e -> getMessage();
	}
	// Non-negotiable proxy indicator check ends
	
	//Working Capital
	$working_capital_query = "SELECT 
	ROUND((MAX(IFNULL(its.total_sales,0))*(IFNULL(bd.amount,0)*30/IFNULL(its.total_sales,0))/30)-(0.25*(MAX(IFNULL(its.total_sales,0))*(IFNULL(bd.amount,0)*30/IFNULL(its.total_sales,0))/30)+IFNULL(sd.amount, 0)+IFNULL(std.amount, 0)),0) AS `Working Capital 1 - Quick Check`,
	ROUND((IFNULL(bs.balance, 0) + IFNULL(bd.amount,0) + IFNULL(MAX(e.raw_material), 0) + IFNULL(MAX(e.work_in_progress), 0) + IFNULL(MAX(e.finished_goods), 0))-(IFNULL(sd.amount, 0)+IFNULL(std.amount, 0)+IFNULL(cur_liab.current_portion, 0)),0) AS `Working Capital 2`
	FROM 
	$perdix_db.loan_accounts l
	LEFT JOIN $perdix_db.customer c ON l.customer_id=c.id
	LEFT JOIN $perdix_db.enterprise e ON c.enterprise_id=e.id
	LEFT JOIN (SELECT customer_id, IFNULL(SUM(amount), 0) AS `amount` FROM $perdix_db.supplier_details WHERE customer_id=:CustomerId) sd ON sd.customer_id=l.customer_id
	LEFT JOIN (SELECT customer_id, IFNULL(SUM(outstanding_amount_in_paisa), 0) AS `amount`, IFNULL(SUM(installment_amount_in_paisa)*12, 0) AS `current_portion` FROM $perdix_db.loans WHERE customer_id=:CustomerId) cur_liab ON cur_liab.customer_id=l.customer_id
	LEFT JOIN (SELECT customer_id, balance_as_on_15th AS `balance` FROM $perdix_db.bank_statement WHERE customer_bank_account_id NOT IN (SELECT id FROM $perdix_db.customer_bank_accounts where account_type IN ('OD', 'CC') AND customer_id=:CustomerId) AND customer_id=:CustomerId ORDER BY start_month DESC LIMIT 1) bs ON bs.customer_id=l.customer_id
	LEFT JOIN (SELECT customer_id, SUM(sanctioned_amount) AS `amount` FROM $perdix_db.customer_bank_accounts WHERE account_type IN ('OD', 'CC') AND customer_id=:CustomerId) std ON std.customer_id=l.customer_id
	LEFT JOIN (SELECT customer_id, IFNULL(SUM(receivables_outstanding), 0) AS `amount` FROM $perdix_db.buyer_details WHERE customer_id=:CustomerId) bd ON bd.customer_id=l.customer_id
	LEFT JOIN (SELECT customer_id, IFNULL(AVG(cash_sales),0) AS `cash_sales`, IFNULL(AVG(invoice_sales),0) AS `invoice_sales`, IFNULL(AVG(scrap_sales),0) AS `scrap_sales`, IFNULL(AVG(cash_sales),0)+IFNULL(AVG(invoice_sales),0)+IFNULL(AVG(scrap_sales),0) AS `total_sales` FROM (SELECT customer_id, DATE_FORMAT(income_sales_date, '%Y-%m') AS `month`, SUM(IF(income_type='Cash', amount, 0)) AS `cash_sales`, SUM(IF(income_type='Invoice', amount, 0)) AS `invoice_sales`, SUM(IF(income_type='Scrap', amount, 0)) AS `scrap_sales`, SUM(amount) AS `total_sales` FROM $perdix_db.income_through_sales WHERE customer_id=:CustomerId GROUP BY DATE_FORMAT(income_sales_date, '%Y-%m')) its_temp) its ON its.customer_id=l.customer_id
	LEFT JOIN (SELECT customer_id, IFNULL(SUM(installment_amount_in_paisa), 0) AS `amount` FROM $perdix_db.loans WHERE customer_id=:CustomerId) liab ON liab.customer_id=l.customer_id
	WHERE l.id=:CustomerLoanId
	";
	
	try {
		$db = ConnectUAT();
		$working_capital_param = $db->prepare($working_capital_query);
        $working_capital_param->bindParam("CustomerLoanId", $CustomerLoanId);		
        $working_capital_param->bindParam("CustomerId", $CustomerId);		
		$working_capital_param->execute();		
		$i=0; while($working_capital_details = $working_capital_param->fetch(PDO::FETCH_ASSOC))
		{
		$working_capital[$i]['Working Capital 1 - Quick Check']=$working_capital_details['Working Capital 1 - Quick Check'];
		$working_capital[$i]['Working Capital 2']=$working_capital_details['Working Capital 2'];
		$db = null;
		$i++;
		}
	} catch(PDOException $e) {
		$error_log['working_capital_query'] = $e->getMessage();
	}

	if($working_capital[0]['Working Capital 1 - Quick Check']<0 OR $working_capital[0]['Working Capital 2']<0) {$non_negotiable++;}
	
	
	//get all applicant and co-applicant details
	$ApplicantDetails = "
	SELECT 
	CONCAT_WS(' ', c.first_name, c.middle_name, c.last_name) AS 'relation_name',
	lcr.relation,
	c.id AS `relation_customer_id`,
	max(ecr.business_involvement) AS `business_involvement`
	FROM $perdix_db.loan_accounts l
	LEFT JOIN $perdix_db.loan_customer_relation lcr ON l.id=lcr.loan_id 
	LEFT JOIN $perdix_db.customer c ON lcr.customer_id=c.id
	LEFT JOIN $perdix_db.enterprise_customer_relations ecr ON (lcr.customer_id=ecr.linked_to_customer_id and ecr.customer_id = l.customer_id)
	WHERE
	lcr.relation in ('Co-Applicant', 'COAPPLICANT', 'Sole Proprieter', 'APPLICANT') 
	AND l.id = :CustomerLoanId
	GROUP BY c.id
	";

	$full_time=0;
	$part_time=0;
	try {
		$db = ConnectUAT();
		$ApplicantParams = $db->prepare($ApplicantDetails);
        $ApplicantParams->bindParam("CustomerLoanId", $CustomerLoanId);		
		$ApplicantParams->execute();		
		$i=0; while($AvailCustomerParams = $ApplicantParams->fetch(PDO::FETCH_ASSOC))
		{
		$applicant[$i]['relation_name']=$AvailCustomerParams['relation_name'];
		$applicant[$i]['relation']=$AvailCustomerParams['relation'];
		$applicant[$i]['relation_customer_id']=$AvailCustomerParams['relation_customer_id'];
		$applicant[$i]['business_involvement']=$AvailCustomerParams['business_involvement'];
		if($applicant[$i]['business_involvement']=='Full Time') {$full_time++;}
		if($applicant[$i]['business_involvement']=='Part Time') {$part_time++;}
		$i++;
		} 
		$total_partners=$i;
		if($full_time==$total_partners) {$involvement='full_time'; $full_involvement_weight=1;}
		if($full_time!=$total_partners) {$involvement='mix'; $full_involvement_weight=0.6; $part_involvement_weight=0.4;}
		// print_r($applicant); die();
		$db = null;

		
		
	} catch(PDOException $e) {
		$error_log['ApplicantDetails'] = $e->getMessage();
	}


	$net_business_income=0;
	$net_enterprise_income_query = "
	SELECT
	ROUND(MAX(IFNULL(its.total_sales,0))+IFNULL(obi.amount, 0)-MAX(IFNULL(rme.total_purchases,0))-IFNULL(exp.amount, 0)-IFNULL(liab.amount, 0),0) AS `Net Business Income`
	FROM $perdix_db.loan_accounts l
	LEFT JOIN (SELECT customer_id, IFNULL(AVG(cash_sales),0) AS `cash_sales`, IFNULL(AVG(invoice_sales),0) AS `invoice_sales`, IFNULL(AVG(scrap_sales),0) AS `scrap_sales`, IFNULL(AVG(cash_sales),0)+IFNULL(AVG(invoice_sales),0)+IFNULL(AVG(scrap_sales),0) AS `total_sales` FROM (SELECT customer_id, DATE_FORMAT(income_sales_date, '%Y-%m') AS `month`, SUM(IF(income_type='Cash', amount, 0)) AS `cash_sales`, SUM(IF(income_type='Invoice', amount, 0)) AS `invoice_sales`, SUM(IF(income_type='Scrap', amount, 0)) AS `scrap_sales`, SUM(amount) AS `total_sales` FROM $perdix_db.income_through_sales WHERE customer_id=$EnterpriseCustId GROUP BY DATE_FORMAT(income_sales_date, '%Y-%m')) its_temp) its ON its.customer_id=l.customer_id
	LEFT JOIN (SELECT customer_id, IFNULL(SUM(annual_expenses*(CASE frequency WHEN 'Yearly' THEN 1 WHEN 'Monthly' THEN 12 WHEN 'Fortnightly' THEN 26 WHEN 'Weekly' THEN 52 WHEN 'Daily' THEN 365 ELSE 1 END)/12), 0) AS `amount` FROM $perdix_db.expenditure_per_annum WHERE customer_id=$EnterpriseCustId) exp ON exp.customer_id=l.customer_id
	LEFT JOIN (SELECT customer_id, IFNULL(SUM(installment_amount_in_paisa), 0) AS `amount` FROM $perdix_db.loans WHERE customer_id=$EnterpriseCustId) liab ON liab.customer_id=l.customer_id
	LEFT JOIN (SELECT customer_id, AVG(total_purchases) AS `total_purchases` FROM (SELECT customer_id, DATE_FORMAT(raw_material_date, '%Y-%m') AS `month`, IFNULL(SUM(amount), 0) AS `total_purchases` FROM $perdix_db.raw_material_expenses WHERE customer_id=$EnterpriseCustId GROUP BY DATE_FORMAT(raw_material_date, '%Y-%m')) rme_temp) rme ON rme.customer_id=l.customer_id
	LEFT JOIN (SELECT customer_id, AVG(amount) AS `amount` FROM (SELECT customer_id, DATE_FORMAT(other_business_income_date, '%Y-%m') AS `month`, IFNULL(SUM(amount), 0) AS `amount` FROM $perdix_db.other_business_income WHERE customer_id=$EnterpriseCustId GROUP BY DATE_FORMAT(other_business_income_date, '%Y-%m')) obi_temp) obi ON obi.customer_id=l.customer_id
	WHERE 
	l.id = $CustomerLoanId
	";

try {
	$db = ConnectUAT();
	$enterprise_param = $db->prepare($net_enterprise_income_query);
	$enterprise_param->execute();
	while($enterprise_data = $enterprise_param->fetch(PDO::FETCH_ASSOC))
	{
	$net_business_income=$enterprise_data['Net Business Income'];
	}
	// print_r($applicant); die();
	$db = null;
	
	} catch(PDOException $e) {
		$error_log['net_enterprise_income_query'] = $e->getMessage();
	}

	//Household Income of Applicants / Co-applicants
	$household_net_income=0;
	for($a=0; $a<count($applicant); $a++)
	{
	$relation_customer_id=$applicant[$a]['relation_customer_id'];
	$net_hh_query = "SELECT 
	IFNULL(ROUND(SUM(IF(fd.relationship='Self', fd.salary, 0)), 0),0) AS `Salary from business`,
	ROUND(IFNULL(ipa.self_amount, 0),0) AS `Other Income/salaries`,
	ROUND(IFNULL(SUM(IF(fd.relationship!='Self', fd.salary, 0)),0)+IFNULL(ipa.not_self_amount, 0),0) AS `Family Member Incomes`,
	ROUND(GREATEST(IFNULL(SUM(fd.anual_education_fee)/12,0)/0.15, IFNULL(exp.amount, 0)),0) AS `Expenses Declared or based on the educational expense whichever is higher`,
	IFNULL(ROUND(IFNULL(liab.amount, 0),0),0) AS `EMI's of household liabilities`,
	ROUND(IFNULL(SUM(IF(fd.relationship='Self', fd.salary, 0)),0) + IFNULL(ipa.self_amount, 0) + IFNULL(SUM(IF(fd.relationship!='Self', fd.salary, 0)),0)+IFNULL(ipa.not_self_amount, 0) - GREATEST(IFNULL(SUM(fd.anual_education_fee)/12,0)/0.15, IFNULL(exp.amount, 0)) - IFNULL(liab.amount, 0),0) AS `Net Household Income`
	FROM 
	$perdix_db.customer app 
	LEFT JOIN (SELECT customer_id, IFNULL(SUM(annual_expenses*(CASE frequency WHEN 'Yearly' THEN 1 WHEN 'Monthly' THEN 12 WHEN 'Fortnightly' THEN 26 WHEN 'Weekly' THEN 52 WHEN 'Daily' THEN 365 ELSE 1 END)/12), 0) AS `amount` FROM $perdix_db.expenditure_per_annum WHERE customer_id= $relation_customer_id) exp ON exp.customer_id=app.id
	LEFT JOIN (SELECT customer_id, IFNULL(SUM(installment_amount_in_paisa), 0) AS `amount` FROM $perdix_db.loans WHERE customer_id= $relation_customer_id) liab ON liab.customer_id=app.id
	LEFT JOIN (SELECT i.customer_id, IFNULL(SUM(IF(f.relationship='Self',i.income_earned*(CASE i.frequency WHEN 'Yearly' THEN 1 WHEN 'Monthly' THEN 12 WHEN 'Fortnightly' THEN 26 WHEN 'Weekly' THEN 52 WHEN 'Daily' THEN 365 ELSE 1 END)/12, 0)), 0) AS `self_amount`, IFNULL(SUM(IF(f.relationship!='Self',i.income_earned*(CASE i.frequency WHEN 'Yearly' THEN 1 WHEN 'Monthly' THEN 12 WHEN 'Fortnightly' THEN 26 WHEN 'Weekly' THEN 52 WHEN 'Daily' THEN 365 ELSE 1 END)/12, 0)), 0) AS `not_self_amount` FROM $perdix_db.income_per_annum i LEFT JOIN $perdix_db.family_details f ON i.family_id=f.id WHERE i.customer_id= $relation_customer_id) ipa ON ipa.customer_id=app.id
	LEFT JOIN $perdix_db.family_details fd ON fd.customer_id=app.id
	WHERE 
	app.id = $relation_customer_id
	";

try {
	$db = ConnectUAT();
	$hh_param = $db->prepare($net_hh_query);
	$hh_param->execute();
	while($hh_data = $hh_param->fetch(PDO::FETCH_ASSOC))
	{
	$household_net_income=$household_net_income+$hh_data['Net Household Income'];
	}
	// print_r($applicant); die();
	$db = null;
	
	} catch(PDOException $e) {
		$error_log['net_hh_query'] = $e->getMessage();
	}

	}
	
	//get autoincrement value of calculation table to have all information
	$getautoincrement = "(SELECT auto_increment FROM INFORMATION_SCHEMA.TABLES
	WHERE table_name = 'sc_calculation' AND table_schema='$perdix_db')";
	
	try {
		$db = ConnectDb();
		$Autoincrement = $db->prepare($getautoincrement);
		$Autoincrement->execute();		
		$AvailAutoincrementValue = $Autoincrement->fetch(PDO::FETCH_ASSOC);
		$db = null;
		
		$AutoID = $AvailAutoincrementValue['auto_increment'];
	
	} catch(PDOException $e) {
		$error_log['getautoincrement'] = $e->getMessage();
		goto EndExecution;
	}
	
	//reserving the record for score details on calculation table
	$UpdateCalculation = "INSERT INTO sc_calculation ( ScoreName, ApplicationId, created_by, created_at) 
	VALUES ('".$NameOfTheScore."', '".$CustomerLoanId."', '".$SessionUserName."', '".date('Y-m-d H:i:s')."')";
	
	try {
		$db = ConnectDb();
		$calculationTable = $db->prepare($UpdateCalculation);
		$calculationTable->execute();
		$db = null;
	
	} catch(PDOException $e) {
		$error_log['UpdateCalculation'] = $e->getMessage();
		goto EndExecution;
	}

	$ConsolidatedArray = "";
	$WeightageValue = 0;
	$WeightagePercent = 0;
	$OverallMaxWeightedScore = 0;

	//query prepared to insert all user inputs from the perdix DB
	$InsertValues = "INSERT INTO sc_calculation_inputs 
	(score_calc_id, subscore_name, applicant_customer_id, ParameterName, CategorySelected, UserInput, ParamterScore, ParameterWeightage, WeightedScore, MaxWeightedScore, ParameterPassScore, ParameterPassStatus, mitigant, color_english, color_hexadecimal, created_by) 
	VALUES ";		

	
	$scoring_array=array('Others', 'ManagementScore');
	
	for($s=0; $s<count($scoring_array); $s++)
	{
	
	if($scoring_array[$s]=='ManagementScore')
	{
		$subscore_condition = " AND sc_parameters.subscore_name='ManagementScore' ";
		$applicant_count=COUNT($applicant);
		}
	else
	{
		$subscore_condition = " AND sc_parameters.subscore_name!='ManagementScore' ";
		$applicant_count=1;
		}

	//$al means 'applicant_loop';
	for($al=0; $al<$applicant_count; $al++)
	{
	
	$temp_CustomerId=$CustomerId;
	if($scoring_array[$s]=='ManagementScore')
	{
	$CustomerId=$applicant[$al]['relation_customer_id'];
		if($applicant[$al]['business_involvement']=='Full Time')
		{$weightage_manipulation = $full_involvement_weight/$full_time;}
		elseif($applicant[$al]['business_involvement']=='Part Time')
		{$weightage_manipulation = $full_involvement_weight/$part_time;}
		else
		{$weightage_manipulation = 0;}
	}
	else {$weightage_manipulation = 1;}
	
	//get all parameters mapped with core db and the scoring type
	$GetCustomerInputs = "SELECT 
	sc_master.OverallPassValue AS 'OverallPassValue',
	GROUP_CONCAT(concat(sc_perdixparameters.ColumnName, ' AS `', sc_perdixparameters.ParameterName,'`')) 
	AS 'column', 
	sc_perdixparameters.Database, 
	sc_perdixparameters.TableName,
	sc_perdixparameters.condition_if_any
	FROM sc_perdixparameters
	LEFT JOIN sc_parameters ON sc_perdixparameters.ParameterName=sc_parameters.ParameterName
	LEFT JOIN sc_master ON sc_parameters.ScoreName = sc_master.ScoreName
	WHERE sc_parameters.ScoreName = :ScoreName
	AND sc_parameters.status = 'ACTIVE'
	$subscore_condition
	AND (sc_parameters.loan_purpose_1='All' OR sc_parameters.loan_purpose_1 LIKE '%$loan_purpose_1%')
	AND (sc_parameters.loan_purpose_2='All' OR sc_parameters.loan_purpose_2 LIKE '%$loan_purpose_2%')
	AND (sc_parameters.business_type='All' OR sc_parameters.business_type LIKE '%$business_type%')
	AND (sc_parameters.existing_customer='All' OR sc_parameters.existing_customer LIKE '%$existing_customer%')
	AND (sc_parameters.loan_type='All' OR sc_parameters.existing_customer LIKE '%$loan_type%')
	GROUP BY sc_perdixparameters.ParameterName 
	";
	// echo $GetCustomerInputs; die();
	try {
		$db = ConnectDb();
		$QueryInputs = $db->prepare($GetCustomerInputs);
        $QueryInputs->bindParam("ScoreName", $NameOfTheScore);		
		$QueryInputs->execute();		
		$PrepareQueries = $QueryInputs->fetchAll(PDO::FETCH_ASSOC);
		
		$db = null;
		
		if(sizeof($PrepareQueries) == 0)
		{
			$error_log['Parameters'] = "No parameters has been mapped for the score ".$NameOfTheScore;
			goto EndExecution;
		}
	} catch(PDOException $e) {	    
		$error_log['GetCustomerInputs'] = $e->getMessage();
		goto EndExecution;
	}
	
	//get parameters that returns customer value
	// $ParameterDataAvail = "";
	
	foreach($PrepareQueries AS $KeyValues => $value)
	{			
		$OverallPassValue = $PrepareQueries[$KeyValues]['OverallPassValue'];
							
		//query prepared to get all user inputs from the respective DB's
		$CustomerQuery = "(SELECT ".$PrepareQueries[$KeyValues]['column']." 
		FROM ".$PrepareQueries[$KeyValues]['TableName']." 
		WHERE ".$PrepareQueries[$KeyValues]['condition_if_any']." )";
			
		eval("\$CustomerQuery = \"$CustomerQuery\";");
		
		try {
			$db = ConnectUAT();
			$parameters = $db->prepare($CustomerQuery);
			$parameters->execute();
			
			$ListParameters = $parameters->fetch(PDO::FETCH_ASSOC);
			$db = null;
		
		}catch(PDOException $e) {
			$error_log['CustomerQuery'] = $e->getMessage();
			echo $CustomerQuery;
			goto EndExecution;
		}
		
		if(is_array($ListParameters))
		{
			
		
		foreach($ListParameters AS $Column => $InputValue)
		{
		
			if($InputValue=='not_applicable'){continue;}
			
			// $ParameterDataAvail[] = $Column;
			
			//get the allocated value from sc_values					
			$ScoreValue = "(SELECT 	
 			p.ParameterPassScore,
			p.subscore_name,
			IF(v.Value >=p.ParameterPassScore AND v.Value IS NOT NULL, 'PASS','FAIL') AS 'ParameterPassStatus',
			IF(v.Value <p.ParameterPassScore OR v.Value IS NULL, GROUP_CONCAT(DISTINCT m.mitigant SEPARATOR '|'),'') AS 'mitigant',
			p.ParameterWeightage*$weightage_manipulation AS `ParameterWeightage`,
			p.ParameterDisplayName,
			p.MaxParameterScore,
			p.ParameterName,
			v.id, 
			v.CategoryValueFrom, 
			v.CategoryValueTo, 
			v.Value,
			v.non_negotiable,
			v.color_english,
			v.color_hexadecimal,
			CONCAT_WS('-', v.CategoryValueFrom, if(v.CategoryValueTo='', NULL, v.CategoryValueTo)) AS Category 
			FROM sc_values v
			LEFT JOIN sc_parameters p ON v.ParameterName = p.ParameterName
			LEFT JOIN sc_mitigants m ON (p.ParameterName=m.ParameterName AND m.status='ACTIVE')
			WHERE 
			v.status='ACTIVE'
			AND p.ScoreName=:ScoreName 
			AND p.ParameterName=:Column 
			AND	(
					(IF(:InputValue/:InputValue IS NULL AND :InputValue NOT IN ('0', '0.0', '0.00'), FALSE, :InputValue+0 between v.CategoryValueFrom+0 and v.CategoryValueTo+0 AND v.CategoryValueFrom NOT LIKE '%#%' AND v.CategoryValueTO NOT LIKE '%#%'))
					or (v.CategoryValueFrom = :InputValue AND v.CategoryValueFrom NOT LIKE '%#%' AND v.CategoryValueTO='')
					or (IF(:InputValue/:InputValue IS NULL AND :InputValue NOT IN ('0', '0.0', '0.00'), FALSE, v.CategoryValueFrom LIKE '#<#%'  AND REPLACE(v.CategoryValueFrom ,'#<#','')+0 > :InputValue+0))
					or (IF(:InputValue/:InputValue IS NULL AND :InputValue NOT IN ('0', '0.0', '0.00'), FALSE, v.CategoryValueFrom LIKE '#<=#%' AND REPLACE(v.CategoryValueFrom , '#<=#','')+0 >= :InputValue+0))
					or IF(:InputValue/:InputValue IS NULL AND :InputValue NOT IN ('0', '0.0', '0.00'), FALSE, (v.CategoryValueFrom LIKE '#>#%' AND REPLACE(v.CategoryValueFrom , '#>#', '')+0 < :InputValue+0))
					or IF(:InputValue/:InputValue IS NULL AND :InputValue NOT IN ('0', '0.0', '0.00'), FALSE, (v.CategoryValueFrom LIKE '#>=#%' AND REPLACE(v.CategoryValueFrom, '#>=#', '')+0 <= :InputValue+0))
				)
			)";
			
			try{
				
				$db = ConnectDb();
				$DefinedValue = $db->prepare($ScoreValue);
				$DefinedValue->bindParam("Column", $Column);
				$DefinedValue->bindParam("InputValue", $InputValue);
				$DefinedValue->bindParam("ScoreName", $NameOfTheScore);
				$DefinedValue->execute();
			
				$DefinedScoreValues = $DefinedValue->fetch(PDO::FETCH_ASSOC);
				$db = null;
			
			}catch(PDOException $e) {
				$error_log['ScoreValue'] = $e->getMessage();
				goto EndExecution;
			}
			
			$calculateWeightage=0;
			if($DefinedScoreValues['Value'] > 0)
			$calculateWeightage = ((($DefinedScoreValues['Value']/$DefinedScoreValues['MaxParameterScore']) * $DefinedScoreValues['ParameterWeightage'])/100);
			$calculateMaxWeightage = $DefinedScoreValues['ParameterWeightage']/100;
			if($DefinedScoreValues['non_negotiable']=='1') {$non_negotiable++;}
			
			$TempArray = "";
				
			$TempArray['score_calc_id'] = "$AutoID";
			$TempArray['subscore_name'] = $DefinedScoreValues['subscore_name'];
			$TempArray['applicant_customer_id'] = $CustomerId;
			$TempArray['ParameterName'] = $Column;
			$TempArray['Category'] = str_replace('#', '', $DefinedScoreValues['Category']);
			$TempArray['UserInput'] = $InputValue;
			$TempArray['ParamterScore'] = $DefinedScoreValues['Value'];
			$TempArray['ParameterWeightage'] = ($DefinedScoreValues['ParameterWeightage'] > 0) ? $DefinedScoreValues['ParameterWeightage']."%" : "";					
			$TempArray['WeightedScore'] = "$calculateWeightage";
			$TempArray['MaxWeightedScore'] = "$calculateMaxWeightage";
			$TempArray['ParameterPassScore'] = $DefinedScoreValues['ParameterPassScore'];
			$TempArray['ParameterPassStatus'] = $DefinedScoreValues['ParameterPassStatus'];
			$TempArray['mitigant'] = $DefinedScoreValues['mitigant'];
			$TempArray['color_english'] = $DefinedScoreValues['color_english'];
			$TempArray['color_hexadecimal'] = $DefinedScoreValues['color_hexadecimal'];
			$TempArray['created_by'] = $SessionUserName;
				
			$InsertValues .= "('".implode("','",$TempArray)."'),";			
			$TempArray['mitigant'] = explode("|", $DefinedScoreValues['mitigant']);			
			
			unset($TempArray['score_calc_id']);
			unset($TempArray['created_by']);
					
			$ConsolidatedArray[] = $TempArray;
			$WeightageValue = $WeightageValue+$calculateWeightage;
			$OverallMaxWeightedScore = $OverallMaxWeightedScore+$calculateMaxWeightage;
			
			
			//$WeightagePercent = $WeightagePercent+$DefinedScoreValues['ParameterWeightage'];
			
			//$db = null;					
		}
		}
	}
	$CustomerId=$temp_CustomerId;
	} //closing applicant_loop
	} //closing scoring_array
	//print_r($ParameterDataAvail);
	
	/*
	$getMappedParameters = "SELECT p.ScoreName, p.subscore_name, p.ParameterName, p.ParameterWeightage, p.ParameterPassScore, GROUP_CONCAT(m.mitigant SEPARATOR '|') AS `mitigant`
	FROM sc_parameters p
	LEFT JOIN sc_mitigants m ON (p.ParameterName=m.ParameterName AND m.status='ACTIVE')
	WHERE p.ScoreName = :ScoreName 
	AND p.status='ACTIVE'
	GROUP BY p.param_id";
	
	try {
		$db = ConnectDb();
		$ParameterList = $db->prepare($getMappedParameters);
        $ParameterList->bindParam("ScoreName", $NameOfTheScore);		
		$ParameterList->execute();		
		$parameterDetails = $ParameterList->fetchAll(PDO::FETCH_ASSOC);
		
		$db = null;
		
	} catch(PDOException $e) {	    
		$error_log['getMappedParameters'] = $e->getMessage();
		goto EndExecution;
	}
	
	foreach($parameterDetails AS $itr=>$Pvalues)
	{
		
		if(!in_array($parameterDetails[$itr]['ParameterName'], $ParameterDataAvail))
		{
			$TempArray = "";
				
			$TempArray['score_calc_id'] = "$AutoID";
			$TempArray['subscore_name'] = $parameterDetails[$itr]['subscore_name'];
			$TempArray['applicant_customer_id'] = '';
			$TempArray['ParameterName'] = $parameterDetails[$itr]['ParameterName'];
			$TempArray['Category'] = "";
			$TempArray['UserInput'] = "";
			$TempArray['ParamterScore'] = "";
			$TempArray['ParameterWeightage'] = $parameterDetails[$itr]['ParameterWeightage'];					
			$TempArray['WeightedScore'] = "";
			$TempArray['ParameterPassScore'] = $parameterDetails[$itr]['ParameterPassScore'];
			$TempArray['ParameterPassStatus'] = "";
			$TempArray['mitigant'] = $parameterDetails[$itr]['mitigant'];
			$TempArray['color_english'] = "";
			$TempArray['color_hexadecimal'] = "";
			$TempArray['created_by'] = $SessionUserName;
				
			$InsertValues .= "('".implode("','",$TempArray)."'),";	
			$TempArray['mitigant'] = explode("|", $parameterDetails[$itr]['mitigant']);
			unset($TempArray['score_calc_id']);
			unset($TempArray['created_by']);
					
			$ConsolidatedArray[] = $TempArray;
		}
	}
	*/
	
	if($error_log == "")
	{
		$consolidateScore = "";
	
		if($WeightageValue > 0)
		{
		$consolidateScore = ROUND(($WeightageValue/$OverallMaxWeightedScore*100),2);
		}
	
	
		//$consolidateScore = ROUND((($WeightageValue/$WeightagePercent)*100),2);
			
		if($consolidateScore >= $OverallPassValue AND $non_negotiable==0)
		$OverallPassStatus = "PASS";
		else
		$OverallPassStatus = "FAIL";
			
		$AvailCustomerParams['OverallPassValue'] = $OverallPassValue;
		$AvailCustomerParams['OverallWeightedScore'] = "$consolidateScore";
		$AvailCustomerParams['OverallPassStatus'] = $OverallPassStatus;
		$AvailCustomerParams['Parameters'] = $ConsolidatedArray;
			
		$FinalScoreResponse = '{"ScoreDetails": ['.json_encode($AvailCustomerParams).']}';
			
		echo $FinalScoreResponse;
	}	
	
	
	try {	
		//record all inputs into the table score_calculation_inputs as individual records
		$db = ConnectDb();
		$FinalInputs = $db->prepare(substr($InsertValues, 0, -1));
		$FinalInputs->execute();
		$db = null;
	}catch(PDOException $e) {
		$error_log['InsertValues'] = $e->getMessage();
		goto EndExecution;
	}
	
	$FinalScoreCalculation = "UPDATE sc_calculation
	SET CustomerId = :CustomerId, 
	AccountNumber = :AccountNumber,
	urn_no = :urn_no, 
	ScoreMagnitude = :ScoreMagnitude, 
	ScoreResponse = :ScoreResponse, 
	OverallPassValue = :OverallPassValue, 
	OverallWeightedScore = :OverallWeightedScore, 
	OverallPassStatus = :OverallPassStatus,
	updated_by = :updated_by
	WHERE id = :id
	AND ApplicationId = :ApplicationId";	
	
	try{
		$db = ConnectDb();
		$FinalDBUpdate = $db->prepare($FinalScoreCalculation);
		$FinalDBUpdate->bindParam("CustomerId", $CustomerId);
		$FinalDBUpdate->bindParam("AccountNumber", $AvailCustomerParams['loan_accountNumber']);
		$FinalDBUpdate->bindParam("urn_no", $CustomerURN);
		$FinalDBUpdate->bindParam("ScoreMagnitude", $consolidateScore);
		$FinalDBUpdate->bindParam("OverallPassValue", $OverallPassValue);
		$FinalDBUpdate->bindParam("OverallWeightedScore", $consolidateScore);
		$FinalDBUpdate->bindParam("OverallPassStatus", $OverallPassStatus);
		$json_ConsolidatedArray=json_encode($ConsolidatedArray); $FinalDBUpdate->bindParam("ScoreResponse", $json_ConsolidatedArray);
		$FinalDBUpdate->bindParam("updated_by", $SessionUserName);		
		$FinalDBUpdate->bindParam("id", $AutoID);
		$FinalDBUpdate->bindParam("ApplicationId", $CustomerLoanId);
			
		$FinalDBUpdate->execute();
		$db = null;
	}catch(PDOException $e) {
		$error_log['FinalScoreCalculation'] = $e->getMessage();
		goto EndExecution;
	}
	
	EndExecution:
	print_r($error_log);
}

?>