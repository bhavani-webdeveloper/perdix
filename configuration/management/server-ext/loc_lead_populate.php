<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
include_once("bootload.php");
use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use App\Models\Leads;
use App\Models\LeadsSnapshot;

$perdix_db = "default";
$perdix_db="financialForms";
$bi_db="bi_dev";
$currentDate = DB::connection("default")->table("cbs_banks")->select("current_working_date")->get();
$currentDate = $currentDate->toArray();

$dates = explode("-",$currentDate[0]->current_working_date);

$mycbsdate = $dates[0] . strtoupper(date("M",strtotime($currentDate[0]->current_working_date))) . $dates[2];

$cbsTableName = "cbs__$mycbsdate";//"cbs_".$cwdate;
//$cbsTableName = "cbs__31MAY2017";//"cbs_".$cwdate;

$customers = DB::connection("default")->select("SELECT l.customer_id, l.branch_id, l.bank_id, bm.bank_name, brm.branch_name,
c.first_name AS lead_name, cem.centre_name, 
c.customer_type, c.area, c.door_no AS address_line1, c.street AS address_line2, c.village_name AS city_town_village, c.pincode, 
c.state, c.district, c.locality AS location, c.centre_id, c.gender, c.mobile_phone AS mobile_no,
c.mobile_number_2 AS alternate_mobile_no, c.date_of_birth AS dob, c.marital_status,
enp.business_description AS business_name, enp.enterprise_type AS business_type, enp.business_activity, enp.company_operating_since, 
enp.ownership, enp.is_company_registered,
crn.id AS applicant_customer_id, cfm.education_status,
l.loan_purpose_1 AS loan_purpose1, l.loan_purpose_2 AS loan_purpose2, l.loan_purpose_3 AS loan_purpose3,
l.loan_amount_requested_in_paisa AS loan_amount_requested,
l.account_number AS linked_loan_account_no,
(SELECT account_number FROM $perdix_db.loan_accounts where customer_id=l.customer_id ORDER BY id ASC
 LIMIT 1) AS base_loan_account,
(SELECT account_number FROM $perdix_db.loan_accounts where customer_id=l.customer_id ORDER BY id ASC
 LIMIT 1) AS parent_loan_account
 FROM $perdix_db.loan_accounts l
INNER JOIN $perdix_db.customer c ON c.id = l.customer_id 
INNER JOIN $bi_db.$cbsTableName cb ON cb.AccountNumber = l.account_number
INNER JOIN $perdix_db.bank_master bm ON l.bank_id = bm.id 
INNER JOIN $perdix_db.branch_master brm ON l.branch_id = brm.id 
INNER JOIN $perdix_db.loan_centre lc ON l.id = lc.loan_id 
INNER JOIN $perdix_db.centre_master cem ON lc.centre_id = cem.id 
LEFT JOIN $perdix_db.family_details cfm ON l.customer_id = cfm.customer_id AND cfm.relationship = 'self'
LEFT JOIN $perdix_db.customer crn ON crn.urn_no = l.urn_no 
LEFT JOIN $perdix_db.enterprise enp ON c.enterprise_id = enp.id 
LEFT JOIN $perdix_db.global_settings gl ON gl.name = 'LOCEMILimitForLeadPopulation' 
WHERE 
l.loan_purpose_1 = 'Line of credit' AND 
l.account_number IS NOT NULL
AND cb.NoOfEMI = gl.value AND gl.value-3  <= cb.EMIPaid
AND l.account_number NOT IN (select linked_loan_account_no FROM $perdix_db.leads)");

foreach($customers as $customer){
	$allInsertParameters = array();
	$allInsertParameters = array(
		'version' => 0,
		'customer_id' => $customer->customer_id,
		'bank_id' => $customer->bank_id,	
		'branch_id' => $customer->branch_id,
		'bank_name' => $customer->bank_name,
		'branch_name' => $customer->branch_name,
		'lead_name' => $customer->lead_name,
		'centre_name' => $customer->centre_name,		
		'customer_type' => $customer->customer_type,
		'area' => $customer->area,
		'address_line1' => $customer->address_line1,
		'address_line2' => $customer->address_line2,
		'city_town_village' => $customer->city_town_village,	
		'pincode' => $customer->pincode,
		'state' => $customer->state,	
		'district' => $customer->district,
		'location' => $customer->location,
		'centre_id' => $customer->centre_id,
		'gender' => $customer->gender,
		'mobile_no' => $customer->mobile_no,
		'alternate_mobile_no' => $customer->alternate_mobile_no,
		'dob' => $customer->dob,
		'marital_status' => $customer->marital_status,
		'education_status' => $customer->education_status,		
		'business_name' => $customer->business_name,	
		'business_type' => $customer->business_type,
		'business_activity' => $customer->business_activity,
		'company_operating_since' => $customer->company_operating_since,
		'ownership' => $customer->ownership,
		'is_company_registered' => $customer->is_company_registered,	
		'product_category' => 'Asset',
		'product_sub_category' => 'Loan',
		'interested_in_product' => 'YES',		
		'product_required_by' => NULL,
		'screening_date' => NULL,		
		'loan_purpose1' => $customer->loan_purpose1,
		'loan_purpose2' => $customer->loan_purpose2,
		'loan_purpose3' => $customer->loan_purpose3,
		'loan_amount_requested' => $customer->loan_amount_requested,		
		'eligible_for_product' => "YES",
		'product_accept_reason' => NULL,
		'product_accept_additinal_remarks' => NULL,
		'product_reject_reason' => NULL,
		'product_reject_additinal_remarks' => NULL,		
		'lead_status' => "FollowUp",
		'follow_up_date' => NULL,
		'udf_id' => NULL,
		'lead_category' => NULL,
		'lead_source' => NULL,
		'referred_by' => NULL,
		'occupation1' => NULL,
		'license_type' => NULL,
		'latitude' => NULL,
		'longitude' => NULL,
		'altitude' => NULL,
		'post_office' => NULL,
		'parent_loan_account' => $customer->parent_loan_account,
		'vehicle_registration_number' => NULL,
		'transaction_type' => NULL,
		'linked_loan_account_no' => $customer->linked_loan_account_no,
		'base_loan_account' => $customer->base_loan_account,
		'landmark' => "",
		'applicant_customer_id' => $customer->applicant_customer_id,
		'current_stage' => "Assignment Pending",
		'created_by' => "",//get current user id
		'created_at' => DATE("Y-m-d H:i:s"),
		'last_edited_by' => "",//get current user id
		'last_edited_at' => DATE("Y-m-d H:i:s")		
	);

	$leadinsert = Leads::create($allInsertParameters);
	if($leadinsert->id){
		$allInsertParameters['lead_id'] = $leadinsert->id;
		$allInsertParameters['version'] = 1;
		$leadinsert = LeadsSnapshot::create($allInsertParameters);
	}
	}

//	Leads::insert($allInsertParameters);
