<?php

include_once("bootload.php");
use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use App\Services\PerdixService;
use App\Core\Settings;

$perdixService = new PerdixService();
$response = get_response_obj();
$settings = Settings::getInstance()->getSettings();
$perdix_db = $settings['db']['database'];
$guarantor_is_required = true;
$defaultDb = DB::connection("default");
$encore_db = $settings['encore_db']['database'];
$psychometric_db = $settings['psychometric']['database'];

if (isset($_GET)) {
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

    $error_log = "";
    $CustomerLoanId = $_GET['LoanId'];
    $authInfo = 'Bearer '.$_GET['auth_token'];
    $SessionUserName = "admin";
    $userInfo = $perdixService->accountInfo($authInfo);
    $partnerCode = $userInfo['partnerCode'] == '' ?  'Self':  $userInfo['partnerCode'];
    $isScoringOptimizationEnabled = $_GET['isScoringOptimizationEnabled'];

    //get all customer details from loan_accounts table
    $CustomerDetails = "SELECT
                l.account_number AS 'loan_accountNumber',
                l.current_stage,
                l.version,
                MAX(app.urn_no) AS `urn_no`,
                MAX(coapp.id) AS `coapp_customer_id`,
                MAX(guarantor.id) AS `guarantor_customer_id`,
                l.customer_id AS `enterprise_cust_id`,
                MAX(app.id) AS `customer_id`,
                l.id AS 'loan_id',
                CONCAT_WS(' ', app.first_name, app.middle_name, app.last_name) AS 'enterpriseName',
                l.loan_purpose_1,
                l.loan_purpose_2,
                l.loan_type,
                e.business_type,
                IF(old_loan.id IS NULL, 'NO', 'YES') AS `existing_customer`,
                '' AS 'OverallPassValue',
                '' AS 'OverallWeightedScore',
                '' AS 'OverallPassStatus',
                '' AS 'Parameters',
                app.customer_category
                FROM $perdix_db.loan_accounts l
                LEFT JOIN $perdix_db.loan_customer_relation lcr ON l.id=lcr.loan_id
                LEFT JOIN $perdix_db.customer app ON (lcr.customer_id=app.id AND LOWER(lcr.relation) IN ('Sole Proprieter', 'APPLICANT'))
                LEFT JOIN $perdix_db.customer coapp ON (lcr.customer_id=coapp.id AND LOWER(lcr.relation) IN ('Co-Applicant', 'COAPPLICANT'))
                LEFT JOIN $perdix_db.customer guarantor ON (lcr.customer_id=guarantor.id AND LOWER(lcr.relation) = 'guarantor')
                LEFT JOIN $perdix_db.customer c ON l.customer_id=c.id
                LEFT JOIN $perdix_db.enterprise e ON c.enterprise_id=e.id
                LEFT JOIN $perdix_db.loan_accounts old_loan ON (l.customer_id=old_loan.customer_id AND old_loan.loan_disbursement_date<CURRENT_DATE())
                WHERE l.id = $CustomerLoanId";

    $AvailCustomerParams = (array) collect($defaultDb->select($CustomerDetails))->first(); 
    $CustomerId = isset($AvailCustomerParams['customer_id']) ? $AvailCustomerParams['customer_id'] : '0';
    $CoappCustomerId = isset($AvailCustomerParams['coapp_customer_id']) ? $AvailCustomerParams['coapp_customer_id'] : '0';
    $GuarantorCustomerId = isset($AvailCustomerParams['guarantor_customer_id']) ? $AvailCustomerParams['guarantor_customer_id'] : '0';
    $CustomerURN = $AvailCustomerParams['urn_no'];
    $EnterpriseCustId = $AvailCustomerParams['enterprise_cust_id'];
    $loan_type = $AvailCustomerParams['loan_type'];
    $loan_purpose_1 = $AvailCustomerParams['loan_purpose_1'];
    $loan_purpose_2 = $AvailCustomerParams['loan_purpose_2'];
    $business_type = $AvailCustomerParams['business_type'];
    $existing_customer = $AvailCustomerParams['existing_customer'];
    $customer_category = $AvailCustomerParams['customer_category'];
    $currentStage = $AvailCustomerParams['current_stage'];
    $loanVersion = $AvailCustomerParams['version'];

    $scoreCriteriaDetails = "
        SELECT m.ScoreName, m.order, m.partner_or_self, c.CriteriaName, c.CriteriaValue
            FROM score_master m, score_criteria c
            WHERE m.ScoreName = c.ScoreName
            AND m.status = 'ACTIVE'
            AND c.status = 'ACTIVE'
            AND m.Stage = '$currentStage'
            AND LOWER(m.partner_or_self) = LOWER('$partnerCode')
            ORDER by m.Order ASC";

    $scoreToCriteriaDetails = $defaultDb->select($scoreCriteriaDetails);
    $scoreToCriteriaInfo = array();

    foreach ($scoreToCriteriaDetails as $scoreToCriteriaDetail) {
        $scoreToCriteriaDetail = (array) $scoreToCriteriaDetail;
        $criteria = isset($scoreToCriteriaInfo[$scoreToCriteriaDetail['ScoreName']]) ? $scoreToCriteriaInfo[$scoreToCriteriaDetail['ScoreName']] : array();
        $criteria[$scoreToCriteriaDetail['CriteriaName']] = $scoreToCriteriaDetail['CriteriaValue'];
        $scoreToCriteriaInfo[$scoreToCriteriaDetail['ScoreName']] = $criteria;
    }
    
    // Find ScoreName that matches criteria
    $ScoreName = null; 
    foreach ($scoreToCriteriaInfo as $score => $criterias) { 
 
        if (sizeof($criterias) == 0)
            continue;

        if (key_exists('loan_purpose_1', $criterias))
            if ($loan_purpose_1 != $criterias['loan_purpose_1'] && $criterias['loan_purpose_1'] != 'All')
                continue;
        if (key_exists('loan_purpose_2', $criterias))
            if ($loan_purpose_2 != $criterias['loan_purpose_2'] && $criterias['loan_purpose_2'] != 'All')
                continue;
        if (key_exists('business_type', $criterias))
            if ($business_type != $criterias['business_type'] && $criterias['business_type'] != 'All' )
                continue;
        if (key_exists('existing_customer', $criterias))
            if ($existing_customer != $criterias['existing_customer'] && $criterias['existing_customer'] != 'All' )
                continue;
        if (key_exists('customer_category', $criterias))
            if ($customer_category != $criterias['customer_category'] && $criterias['customer_category'] != 'All' )
                continue;

        $ScoreName = $score;
        break;
    }

    $msg  = "score found for criteria loan_purpose_1=".
    "$loan_purpose_1|loan_purpose_2=$loan_purpose_2|business_type=$business_type|existing_customer=$existing_customer|customer_category=$customer_category|";
    
    if( ! $ScoreName ) {
        http_response_code(404);
        $response->json([ 'error' => 'no '.$msg]);
        exit();
    } 

    if($isScoringOptimizationEnabled == 'true' ){
        $ScoreCalcCheckQuery = "SELECT ScoreName, ApplicationId, loanVersion, PartnerSelf 
            FROM sc_calculation
            WHERE
            ApplicationId='$CustomerLoanId'
            AND loanVersion = $loanVersion
            AND LOWER(PartnerSelf) = LOWER('$partnerCode')
            AND ScoreName = '$ScoreName'
            AND ApiVersion = '2'
        ";

        $row = (array) collect($defaultDb->select($ScoreCalcCheckQuery))->first();

        if(sizeof($row) > 0 ){
            $response->setStatusCode(200)->json([ 'ScoreDetails' => [ 'ScoreName' => $ScoreName] ]);
            exit();
        }
    }

    $non_negotiable = 0;

    // Non-negotiable proxy indicator check starts
    $nonNegotiableProxyIndicatorQuery = "
        SELECT
            (IF(LOWER(bribe_offered) = 'yes', 1, 0)
                            + IF(LOWER(political_or_police_connections) = 'yes', 1, 0)
                            + IF(LOWER(challenging_cheque_bounce) = 'yes', 1, 0)) AS non_negotiable
        FROM customer
        WHERE id = $EnterpriseCustId";

    $nonNegotiableProxyIndicatorRecord = (array) collect($defaultDb->select($nonNegotiableProxyIndicatorQuery))->first();
    $nonNegotiableProxyIndicatorRecord = (array) $nonNegotiableProxyIndicatorRecord;
    $non_negotiable += $nonNegotiableProxyIndicatorRecord['non_negotiable'];
    
    // Non-negotiable proxy indicator check ends
    // Working Capital
    $working_capital_query = "SELECT
                ROUND((MAX(IFNULL(its.total_sales,0))*(IFNULL(bd.amount,0)*30/IFNULL(its.total_sales,0))/30)-(0.25*(MAX(IFNULL(its.total_sales,0))*(IFNULL(bd.amount,0)*30/IFNULL(its.total_sales,0))/30)+IFNULL(sd.amount, 0)+IFNULL(std.amount, 0)),0) AS `Working Capital 1 - Quick Check`,
                ROUND((IFNULL(bs.balance, 0) + IFNULL(bd.amount,0) + IFNULL(MAX(e.raw_material), 0) + IFNULL(MAX(e.work_in_progress), 0) + IFNULL(MAX(e.finished_goods), 0))-(IFNULL(sd.amount, 0)+IFNULL(std.amount, 0)+IFNULL(cur_liab.current_portion, 0)),0) AS `Working Capital 2`
                FROM
                $perdix_db.loan_accounts l
                LEFT JOIN $perdix_db.customer c ON l.customer_id=c.id
                LEFT JOIN $perdix_db.enterprise e ON c.enterprise_id=e.id
                LEFT JOIN (SELECT customer_id, IFNULL(SUM(amount), 0) AS `amount` FROM $perdix_db.supplier_details WHERE customer_id=$CustomerId) sd ON sd.customer_id=l.customer_id
                LEFT JOIN (SELECT customer_id, IFNULL(SUM(outstanding_amount_in_paisa), 0) AS `amount`, IFNULL(SUM(installment_amount_in_paisa)*12, 0) AS `current_portion` FROM $perdix_db.loans WHERE customer_id=$CustomerId) cur_liab ON cur_liab.customer_id=l.customer_id
                LEFT JOIN (SELECT customer_id, balance_as_on_15th AS `balance` FROM $perdix_db.bank_statement WHERE customer_bank_account_id NOT IN (SELECT id FROM $perdix_db.customer_bank_accounts where account_type IN ('OD', 'CC') AND customer_id=$CustomerId) AND customer_id=$CustomerId ORDER BY start_month DESC LIMIT 1) bs ON bs.customer_id=l.customer_id
                LEFT JOIN (SELECT customer_id, SUM(sanctioned_amount) AS `amount` FROM $perdix_db.customer_bank_accounts WHERE account_type IN ('OD', 'CC') AND customer_id=$CustomerId) std ON std.customer_id=l.customer_id
                LEFT JOIN (SELECT customer_id, IFNULL(SUM(receivables_outstanding), 0) AS `amount` FROM $perdix_db.buyer_details WHERE customer_id=$CustomerId) bd ON bd.customer_id=l.customer_id
                LEFT JOIN (SELECT customer_id, IFNULL(AVG(cash_sales),0) AS `cash_sales`, IFNULL(AVG(invoice_sales),0) AS `invoice_sales`, IFNULL(AVG(scrap_sales),0) AS `scrap_sales`, IFNULL(AVG(cash_sales),0)+IFNULL(AVG(invoice_sales),0)+IFNULL(AVG(scrap_sales),0) AS `total_sales` FROM (SELECT customer_id, DATE_FORMAT(income_sales_date, '%Y-%m') AS `month`, SUM(IF(income_type='Cash', amount, 0)) AS `cash_sales`, SUM(IF(income_type='Invoice', amount, 0)) AS `invoice_sales`, SUM(IF(income_type='Scrap', amount, 0)) AS `scrap_sales`, SUM(amount) AS `total_sales` FROM $perdix_db.income_through_sales WHERE customer_id=$CustomerId GROUP BY DATE_FORMAT(income_sales_date, '%Y-%m')) its_temp) its ON its.customer_id=l.customer_id
                LEFT JOIN (SELECT customer_id, IFNULL(SUM(installment_amount_in_paisa), 0) AS `amount` FROM $perdix_db.loans WHERE customer_id=$CustomerId) liab ON liab.customer_id=l.customer_id
                WHERE l.id=$CustomerLoanId
                ";

    $working_capital_details= (array) collect($defaultDb->select($working_capital_query))->first();
    $working_capital[$i]['Working Capital 1 - Quick Check'] = $working_capital_details['Working Capital 1 - Quick Check'];
    $working_capital[$i]['Working Capital 2'] = $working_capital_details['Working Capital 2'];

    if ($working_capital[0]['Working Capital 1 - Quick Check'] < 0 OR $working_capital[0]['Working Capital 2'] < 0) {
        $non_negotiable++;
    }

    $partiesSql = "select * from $perdix_db.global_settings where name = 'IndividualScoringParties'";
    $relations = [];
    $results = $defaultDb->select($partiesSql);
    foreach ($results as $row) {
        $row = (array) $row;
        $name = $row['name'];
        $criterias = $row['value'];
    }
    $partiesArray = explode(",", $criterias);
    if (!is_null($criterias)) {
        if (in_array('Applicant', $partiesArray)) {
            array_push($relations, "'applicant'", "'sole proprieter'");
        }
        if (in_array('Co-Applicant', $partiesArray)) {
            array_push($relations, "'coapplicant'", "'Co-Applicant'");
        }
        if (in_array('Guarantor', $partiesArray)) {
            array_push($relations, "'Guarantor'");
        }
    } else
        array_push($relations, "'Applicant'", "'Co-Applicant'");

    $relationsStr = implode(',', $relations);

    //get all applicant and co-applicant details
    if ($guarantor_is_required) {
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
            LOWER(lcr.relation) in ('co-applicant', 'coapplicant', 'sole proprieter', 'applicant', 'guarantor')
            AND l.id = $CustomerLoanId
            GROUP BY c.id
            ";
    } else {
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
            LOWER(lcr.relation) in ( $relationsStr )
            AND l.id = $CustomerLoanId
            GROUP BY c.id
            ";
    }
    
    $full_time = 0;
    $part_time = 0;
    $ApplicantParams = $defaultDb->select($ApplicantDetails);
    
    $i = 0;
    foreach ($ApplicantParams as $AvailCustomerParams) {
        $AvailCustomerParams = (array) $AvailCustomerParams;
        $applicant[$i]['relation_name'] = $AvailCustomerParams['relation_name'];
        $applicant[$i]['relation'] = $AvailCustomerParams['relation'];
        $applicant[$i]['relation_customer_id'] = $AvailCustomerParams['relation_customer_id'];
        $applicant[$i]['business_involvement'] = $AvailCustomerParams['business_involvement'];
        if ($applicant[$i]['business_involvement'] == 'Full Time') {
            $full_time++;
        }
        if ($applicant[$i]['business_involvement'] == 'Part Time') {
            $part_time++;
        }
        $i++;
    }
    $total_partners = $i;
    if ($full_time == $total_partners) {
        $involvement = 'full_time';
        $full_involvement_weight = 1;
    }
    if ($full_time != $total_partners) {
        $involvement = 'mix';
        $full_involvement_weight = 0.6;
        $part_involvement_weight = 0.4;
    }
    
    $net_business_income = 0;
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

    $enterprise_datas = $defaultDb->select($net_enterprise_income_query);
    foreach ($enterprise_datas as $enterprise_data) {
        $enterprise_data = (array) $enterprise_data;
        $net_business_income = $enterprise_data['Net Business Income'];
   }

    //Household Income of Applicants / Co-applicants
    $household_net_income = 0;
    for ($a = 0; $a < count($applicant); $a++) {
        $relation_customer_id = $applicant[$a]['relation_customer_id'];
        $net_hh_query = 
            "SELECT
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
                app.id = $relation_customer_id";

        $hh_datas = $defaultDb->select($net_hh_query);
        foreach ($hh_datas as $hh_data) {
            $hh_data = (array) $hh_data;
            $household_net_income = $household_net_income + $hh_data['Net Household Income'];
        }
    }

    //get autoincrement value of calculation table to have all information
    $getautoincrement = "(SELECT auto_increment FROM INFORMATION_SCHEMA.TABLES
                WHERE table_name = 'sc_calculation' AND table_schema='$perdix_db')";

    $AutoincrementValues = (array) collect($defaultDb->select($getautoincrement))->first();
    $AutoID = $AutoincrementValues['auto_increment'];
    
    //reserving the record for score details on calculation table
    $UpdateCalculation = "INSERT INTO sc_calculation ( ScoreName, ApplicationId, created_by, created_at)
                VALUES ('" . $ScoreName . "', '" . $CustomerLoanId . "', '" . $SessionUserName . "', '" . date('Y-m-d H:i:s') . "')";
    
    $defaultDb->insert($UpdateCalculation);
    
    $ConsolidatedArray = array();
    $WeightageValue = 0;
    $WeightagePercent = 0;
    $OverallMaxWeightedScore = 0;
    
    //query prepared to insert all user inputs from the perdix DB
    $InsertValues = "INSERT INTO sc_calculation_inputs
                (score_calc_id, subscore_name, applicant_customer_id, ParameterName, CategorySelected, UserInput, ParamterScore, ParameterWeightage, WeightedScore, MaxWeightedScore, ParameterPassScore, ParameterPassStatus, mitigant, color_english, color_hexadecimal, created_by)
                VALUES ";

    $CurrentParameters = [];
    // management score and others isIndividualScore = 1/isIndividualScore = 0
   for ($s = 0; $s < 2; $s++) {

       if( $s == 1 ){
            $subscore_condition = " AND score_subscore.isIndividualScore = 1";
            $applicant_count = COUNT($applicant);
        } else {
            $subscore_condition = " AND score_subscore.isIndividualScore != 1";
            $applicant_count = 1;
        }
        
        for ($al = 0; $al < $applicant_count; $al++) {
            $temp_CustomerId = $CustomerId;
            if ($s == 1) {
                $CustomerId = $applicant[$al]['relation_customer_id'];
                if ($applicant[$al]['business_involvement'] == 'Full Time') {
                    $weightage_manipulation = $full_involvement_weight / $full_time;
                } elseif ($applicant[$al]['business_involvement'] == 'Part Time') {
                    $weightage_manipulation = $full_involvement_weight / $part_time;
                } else {
                    $weightage_manipulation = 0;
                }
            } else {
                $weightage_manipulation = 1;
            }

            //get all parameters mapped with core db and the scoring type
            $GetCustomerInputs = "SELECT
                score_master.OverallPassValue AS 'OverallPassValue',
                GROUP_CONCAT(concat(sc_perdixparameters.ColumnName, ' AS `', sc_perdixparameters.ParameterName,'`'))
                AS 'column',
                sc_perdixparameters.Database,
                sc_perdixparameters.TableName,
                sc_perdixparameters.condition_if_any
                FROM sc_perdixparameters
                INNER JOIN score_subscore
                LEFT JOIN score_parameters ON sc_perdixparameters.ParameterName = score_parameters.ParameterName                
                LEFT JOIN score_master ON score_master.ScoreName = score_subscore.ScoreName                
                WHERE score_parameters.status = 'ACTIVE'
                AND score_subscore.ScoreName = '$ScoreName'
                AND score_subscore.status = 'ACTIVE'
                AND score_subscore.id = score_parameters.subscoreid
                $subscore_condition
               GROUP BY sc_perdixparameters.ParameterName ORDER BY score_subscore.id, score_parameters.id ASC
                ";

            $PrepareQueries = $defaultDb->select($GetCustomerInputs);
            
            foreach ($PrepareQueries AS $KeyValues => $criterias) {
                $criterias = (array)$criterias;
                $OverallPassValue = $criterias['OverallPassValue'];

                //query prepared to get all user inputs from the respective DB's
                $CustomerQuery = "(SELECT " . $criterias['column'] . "
                               FROM " . $criterias['TableName'] . "
                                WHERE " . $criterias['condition_if_any'] . " )";

                eval("\$CustomerQuery = \"$CustomerQuery\";");

                $ListParameters = (array) collect($defaultDb->select($CustomerQuery))->first();

                if (is_array($ListParameters)) {

                    foreach ($ListParameters AS $Column => $InputValue) {

                        if ($InputValue == 'not_applicable') {
                            continue;
                        }

                        // $ParameterDataAvail[] = $Column;
                        //get the allocated value from sc_values
                        $ScoreValue = "(SELECT DISTINCT
                    p.ParameterPassScore,
                    s.subscoreName,
                    IF(v.Value >=p.ParameterPassScore AND v.Value IS NOT NULL, 'PASS','FAIL') AS 'ParameterPassStatus',
                    IF(v.Value <p.ParameterPassScore OR v.Value IS NULL, GROUP_CONCAT(DISTINCT m.mitigant SEPARATOR '|'),'') AS 'mitigant',
                    p.ParameterWeightage*$weightage_manipulation AS `ParameterWeightage`,
                    p.MaxParameterScore,
                    p.ParameterName,
                    v.id,
                    v.CategoryValueFrom,
                    v.CategoryValueTo,
                    v.Value,
                    v.nonNegotiable,
                    v.colorEnglish,
                    v.colorHexadecimal,
                    CONCAT_WS('-', v.CategoryValueFrom, if(v.CategoryValueTo='', NULL, v.CategoryValueTo)) AS Category
                    FROM score_parameters p
                    LEFT JOIN score_subscore s on s.scoreName = '$ScoreName'                    
                    LEFT JOIN score_values v ON v.ParameterName = p.ParameterName
                    LEFT JOIN sc_mitigants m ON (p.ParameterName=m.ParameterName AND m.status='ACTIVE')
                    WHERE
                    v.status='ACTIVE'
                    AND s.id = p.subscoreid
                    AND v.scoreName = s.ScoreName
                    AND s.status = 'ACTIVE'
                    AND v.subscoreName = s.subscoreName
                    AND p.ParameterName='$Column'
                    AND (
                        (IF('$InputValue'/'$InputValue' IS NULL AND '$InputValue' NOT IN ('0', '0.0', '0.00'), FALSE, '$InputValue'+0 between v.CategoryValueFrom+0 and v.CategoryValueTo+0 AND v.CategoryValueFrom NOT LIKE '%#%' AND v.CategoryValueTO NOT LIKE '%#%'))
                        or (v.CategoryValueFrom = '$InputValue' AND v.CategoryValueFrom NOT LIKE '%#%' AND v.CategoryValueTO='')
                        or (IF('$InputValue'/'$InputValue' IS NULL AND '$InputValue' NOT IN ('0', '0.0', '0.00'), FALSE, v.CategoryValueFrom LIKE '#<#%'  AND REPLACE(v.CategoryValueFrom ,'#<#','')+0 > '$InputValue'+0))
                        or (IF('$InputValue'/'$InputValue' IS NULL AND '$InputValue' NOT IN ('0', '0.0', '0.00'), FALSE, v.CategoryValueFrom LIKE '#<=#%' AND REPLACE(v.CategoryValueFrom , '#<=#','')+0 >= '$InputValue'+0))
                        or IF('$InputValue'/'$InputValue' IS NULL AND '$InputValue' NOT IN ('0', '0.0', '0.00'), FALSE, (v.CategoryValueFrom LIKE '#>#%' AND REPLACE(v.CategoryValueFrom , '#>#', '')+0 < '$InputValue'+0))
                        or IF('$InputValue'/'$InputValue' IS NULL AND '$InputValue' NOT IN ('0', '0.0', '0.00'), FALSE, (v.CategoryValueFrom LIKE '#>=#%' AND REPLACE(v.CategoryValueFrom, '#>=#', '')+0 <= '$InputValue'+0))
                        )

                        GROUP BY p.ParameterPassScore, s.subscoreName, ParameterPassStatus, mitigant, ParameterWeightage,
                    p.MaxParameterScore, p.ParameterName, v.id, v.CategoryValueFrom,
                    v.CategoryValueTo,
                    v.Value,
                    v.nonNegotiable,
                    v.colorEnglish,
                    v.colorHexadecimal,Category 

                    ) ";

                        $calculateWeightage = 0;

                        $DefinedScoreValue = $defaultDb->select($ScoreValue);

                        foreach(  $DefinedScoreValue as $DefinedScoreValues){        
                            $DefinedScoreValues = (array) $DefinedScoreValues;
                            if ($DefinedScoreValues['Value'] > 0){
                                $calculateWeightage = ((($DefinedScoreValues['Value'] / $DefinedScoreValues['MaxParameterScore']) * $DefinedScoreValues['ParameterWeightage']) / 100);
                            }
                            $calculateMaxWeightage = $DefinedScoreValues['ParameterWeightage'] / 100;
                            if ($DefinedScoreValues['non_negotiable'] == '1') {
                                $non_negotiable++;
                            }
                            
                            $TempArray = array();

                            $TempArray['score_calc_id'] = "$AutoID";
                            $TempArray['subscore_name'] = $DefinedScoreValues['subscoreName'];
                            $TempArray['applicant_customer_id'] = $CustomerId;
                            $TempArray['ParameterName'] = $Column;
                            $TempArray['Category'] = str_replace('#', '', $DefinedScoreValues['Category']);
                            $TempArray['UserInput'] = $InputValue;
                            $TempArray['ParamterScore'] = $DefinedScoreValues['Value'];
                            $TempArray['ParameterWeightage'] = ($DefinedScoreValues['ParameterWeightage'] > 0) ? $DefinedScoreValues['ParameterWeightage'] . "%" : "";
                            $TempArray['WeightedScore'] = "$calculateWeightage";
                            $TempArray['MaxWeightedScore'] = "$calculateMaxWeightage";
                            $TempArray['ParameterPassScore'] = $DefinedScoreValues['ParameterPassScore'];
                            $TempArray['ParameterPassStatus'] = $DefinedScoreValues['ParameterPassStatus'];
                            $TempArray['mitigant'] = $DefinedScoreValues['mitigant'];
                            $TempArray['color_english'] = $DefinedScoreValues['colorEnglish'];
                            $TempArray['color_hexadecimal'] = $DefinedScoreValues['colorHexadecimal'];
                            $TempArray['created_by'] = $SessionUserName;

                            $CurrentParameters[$CustomerId][$TempArray['ParameterName']] = $TempArray;
                            $InsertValues .= "('" . implode("','", $TempArray) . "'),";
                            $TempArray['mitigant'] = explode("|", $DefinedScoreValues['mitigant']);

                            unset($TempArray['score_calc_id']);
                            unset($TempArray['created_by']);

                            array_push($ConsolidatedArray, $TempArray);
                            $WeightageValue = $WeightageValue + $calculateWeightage;
                            $OverallMaxWeightedScore = $OverallMaxWeightedScore + $calculateMaxWeightage;
                        }
                    }
                }
            }
            $CustomerId = $temp_CustomerId;
        } //closing applicant_loop
    } //closing scoring_array

    $consolidateScore = "";

    if ($WeightageValue > 0) {
        $consolidateScore = ROUND(($WeightageValue / $OverallMaxWeightedScore * 100), 2);
    }

    if ($consolidateScore >= $OverallPassValue AND $non_negotiable == 0)
        $OverallPassStatus = "PASS";
    else
        $OverallPassStatus = "FAIL";

    $AvailCustomerParams['ScoreName'] = $ScoreName;
    $AvailCustomerParams['CurrentStage'] = $currentStage;
    $AvailCustomerParams['OverallPassValue'] = $OverallPassValue;
    $AvailCustomerParams['OverallWeightedScore'] = "$consolidateScore";
    $AvailCustomerParams['OverallPassStatus'] = $OverallPassStatus;
    $AvailCustomerParams['Parameters'] = $ConsolidatedArray;

    $defaultDb->insert(substr($InsertValues, 0, -1));
    // sub score calculation
    $insertSubScoreCalc = "INSERT INTO sc_subscore_calculation(`sc_calculation_id`, `subscore_name`, `score`, `max_score`) SELECT
    c.id AS 'sc_calculation_id',
    ci.subscore_name AS 'subscore_name',
    IFNULL(ROUND(SUM(ci.WeightedScore)/SUM(ci.MaxWeightedScore)*MAX(s.subscoreWeightage), 2), 0) AS 'score',
    MAX(s.subscoreWeightage) AS `max_score`
    FROM
    sc_calculation_inputs ci, sc_calculation c, score_parameters p, score_subscore s
    WHERE
    c.id=ci.score_calc_id AND p.ParameterName=ci.ParameterName 
    AND s.ScoreName = '$ScoreName' 
    AND ci.subscore_name IS NOT NULL 
    AND ci.subscore_name != '' 
    AND s.id = p.subscoreid
    AND c.id=$AutoID group by ci.subscore_name";

    $defaultDb->insert($insertSubScoreCalc);
    
    $json_ConsolidatedArray = json_encode($ConsolidatedArray);
    $AccountNumber = $AvailCustomerParams['loan_accountNumber'];
    
    $FinalScoreCalculation = "UPDATE sc_calculation
                SET CustomerId = '$CustomerId',
                AccountNumber = '$AccountNumber',
                urn_no = '$CustomerURN',
                ScoreMagnitude = '$consolidateScore',
                ScoreResponse = '$json_ConsolidatedArray',
                OverallPassValue = '$OverallPassValue',
                OverallWeightedScore = '$consolidateScore',
                OverallPassStatus = '$OverallPassStatus',
                updated_by = '$SessionUserName',
                loanVersion = $loanVersion,
                PartnerSelf = '$partnerCode',
                apiVersion = '2'
                WHERE id = $AutoID
                AND ApplicationId = '$CustomerLoanId'";
    
    $defaultDb->update($FinalScoreCalculation);
    $response->setStatusCode(200)->json([ 'ScoreDetails' => $AvailCustomerParams ]);
    exit();
}
?>

