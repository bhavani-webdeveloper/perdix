<?php
include_once("bootload.php");
use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use App\Models\Leads;
use App\Models\LeadsSnapshot;

$etl_file=basename(__FILE__);
$config_details=DB::connection("bi_db")->select("SELECT * FROM eod_process_master WHERE process_file='$etl_file'");

// Mail content
$to=$config_details[0]->email;
$subject=$etl_file." Successful";
$headers="From: ".$_SERVER['SERVER_NAME']."@dvara.com";
$mail_body="";

$start_time=date("Y-m-d h:i:s A");
$mail_body.="\nStarting Time: ".$start_time."\n";


$bi_db = $settings['bi_db']['database'];
$encore_db = $settings['encore_db']['database'];
$perdix_db = $settings['db']['database'];

$currentDate = DB::connection("default")->table("cbs_banks")->select("current_working_date")->get();
$currentDate = $currentDate->toArray();

$cbsTableName = "cbs__".strtoupper(date("dMY", strtotime("{$currentDate[0]->current_working_date} -1 days")));

$customers = DB::connection("default")->select("
SELECT 
l.customer_id, 
l.branch_id, 
l.bank_id, 
bm.bank_name, 
brm.branch_name,
cem.centre_name, 
applicant.first_name AS lead_name,  
applicant.area, 
applicant.door_no AS address_line1, 
applicant.street AS address_line2, 
applicant.village_name AS city_town_village, 
applicant.pincode, 
applicant.state, 
applicant.district, 
applicant.locality AS location, 
applicant.centre_id, 
applicant.gender, 
applicant.mobile_phone AS mobile_no,
applicant.mobile_number_2 AS alternate_mobile_no, 
applicant.date_of_birth AS dob, 
applicant.marital_status,
applicant.id AS applicant_customer_id, 
c.first_name AS business_name, 
enp.enterprise_type AS business_type, 
enp.business_activity, 
enp.company_operating_since, 
enp.ownership, 
enp.is_company_registered,
cfm.education_status,
l.loan_purpose_1 AS loan_purpose1, 
l.loan_purpose_2 AS loan_purpose2, 
l.loan_purpose_3 AS loan_purpose3,
l.loan_amount_requested_in_paisa AS loan_amount_requested,
l.account_number AS linked_account_number,
IFNULL(l.base_loan_account, l.account_number) AS base_loan_account,
'Enterprise' AS 'customer_type',
0 AS 'version',
'Renewal' AS transaction_type,
'SYSTEM' as created_by,
NOW() as created_at,
'Asset' AS 'product_category',
'Loan' AS 'product_sub_category',
'YES' AS 'interested_in_product',
'YES' AS 'eligible_for_product',
'FollowUp' AS 'lead_status',
'Assignment Pending' AS 'current_stage',
COUNT(d.account_id) AS EMICount,
COUNT(r.account_id) AS paidEMI,
gl.value
FROM $perdix_db.loan_accounts l
INNER JOIN $perdix_db.customer c ON c.id = l.customer_id 
INNER JOIN $bi_db.$cbsTableName cb ON cb.AccountNumber = l.account_number
INNER JOIN $perdix_db.bank_master bm ON l.bank_id = bm.id 
INNER JOIN $perdix_db.branch_master brm ON l.branch_id = brm.id 
INNER JOIN $perdix_db.loan_centre lc ON l.id = lc.loan_id 
INNER JOIN $perdix_db.centre_master cem ON lc.centre_id = cem.id 
LEFT JOIN $perdix_db.customer applicant ON applicant.urn_no = l.applicant 
LEFT JOIN $perdix_db.family_details cfm ON cfm.customer_id = applicant.id AND cfm.relationship = 'self'
LEFT JOIN $perdix_db.enterprise enp ON c.enterprise_id = enp.id 
LEFT JOIN $perdix_db.global_settings gl ON gl.name = 'LOCEMILimitForLeadPopulation'
LEFT JOIN $encore_db.loan_od_demands d ON d.account_id = l.account_number AND d.tenant_code = 'KGFS' AND scheduled_demand = 1
LEFT JOIN $encore_db.loan_od_repayments r ON r.account_id = d.account_id AND r.last_satisfied_demand_num=(
      -- get the satisfied demand num
      SELECT MIN(last_satisfied_demand_num) FROM $encore_db.loan_od_repayments WHERE last_satisfied_demand_num>=d.demand_num AND account_id = d.account_id AND tenant_code = 'KGFS'
) AND r.tenant_code = 'KGFS'

WHERE 
l.loan_purpose_1 = 'Line of credit' AND 
l.account_number IS NOT NULL
AND l.account_number NOT IN (select linked_account_number  FROM $perdix_db.leads WHERE linked_account_number IS NOT NULL) GROUP BY l.account_number
HAVING (EMICount = gl.value AND gl.value-3 <= paidEMI)");

foreach($customers as $customer){
	unset($customer->EMICount);
	unset($customer->paidEMI);
	unset($customer->value);
	$customer = (array)$customer;
	$leadinsert = Leads::create($customer);
	
	if($leadinsert->id){
		$customer['lead_id'] = $leadinsert->id;
		$leadinsert = LeadsSnapshot::create($customer);
	}
}

$mail_body.= "\n\nEnd Time = ".date("Y-m-d h:i:s A")."\n";
mail($to, $subject, $mail_body, $headers);
