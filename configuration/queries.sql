customers.list=select last_edited_at from customer where id=:id
loanCollectionDepositSum.list=SELECT SUM(`demand_amount`) FROM loan_collections where bank_deposit_summary_id=:bank_deposit_summary_id
loanaccounts.list=select l.* from loan_accounts l,jlg_account_details jlg where jlg.account_number = l.account_number and l.bank_id =:bank_id and jlg.group_code =:group_code and l.partner_code = :partner_code and l.is_closed = 0
loanAccount.list=select * from loan_accounts where account_number=:account_number and branch_id=:branch_id
loanAccountIn.list=select l.*, c.first_name, c.customer_type, c.mobile_phone, c.email from loan_accounts l left join customer c on (l.customer_id = c.id) where l.account_number IN (:account_numbers)
customersLimit.list=select * from customer
userRole.get=SELECT * FROM roles r, user_roles u WHERE u.role_id = r.id AND u.user_id = :userId
userpages.list=select p.uri, p.title, p.short_title shortTitle, p.icon_class iconClass, p.direct_access directAccess, p.offline, p.state, p.page_name pageName, p.page_id pageId, p.addl_params addlParams, rpa.page_config pageConfig from pages p, role_page_access rpa where p.id = rpa.page_id and rpa.role_id in (select role_id from user_roles where user_id = :user_id)
account.list=select * from loan_accounts
pincode.list=SELECT p.pincode, p.division, p.region, p.taluk, p.district, p.state FROM pincode_master p WHERE p.pincode like concat(:pincode,'%') AND LOWER(p.division) LIKE concat(LOWER(:division), '%') AND LOWER(p.region) LIKE concat(LOWER(:region), '%') AND LOWER(p.taluk) like concat(LOWER(:taluk),'%') AND LOWER(p.district) LIKE concat(LOWER(:district), '%') AND LOWER(p.state) like concat(LOWER(:state),'%')
loan_products.list=SELECT * from loan_account_documents where product_code = :product_code and process = :process and stage = :stage
globalSettings.one=SELECT * from global_settings where name = :name
globalSettings.list=SELECT * from global_settings
customerBankAccounts.list=SELECT * from customer_bank_accounts where customer_id = :customer_id
bankAccounts.list=SELECT * from bank_account_master
bankAccountsByPartnerCode.list=SELECT * from bank_account_master where partner_code=:partner_code
bankAccountsByProductCode.list=SELECT * from bank_account_master where partner_code= (select partner_code from loan_products where product_code = :product_code) and allow_disbursement in (:allow_disbursement) and allow_collection in (:allow_collection)
latestLoanRepayments.list=SELECT lr.branch_name, lr.account_number, c.urn_no, c.first_name, lr.transaction_id, lr.repayment_type, lr.repayment_date, ROUND(lr.repayment_amount_in_paisa/100) repayment_amount FROM loan_repayment_details lr, customer c WHERE lr.enrollment_id = c.enrollment_id AND lr.reverse_flag = 'N' AND lr.repayment_type NOT LIKE '%_REV' AND lr.account_number = :account_number ORDER BY lr.created_at DESC
depositstage.list=select * from loan_collections where current_stage = 'Deposit' and created_by = :deposit_user
customerBasicDetails.list=select first_name, customer_branch_id, centre_id, urn_no, id, mobile_phone from customer where id IN (:ids) OR urn_no IN (:urns)
loan_doc_reject_reasons.list=SELECT document_code, reject_reason FROM loan_doc_reject_reasons WHERE process_name=:process_name
loanpurpose1.list=select distinct lm.loan_purpose_first_level purpose1 from loan_purpose_mapping_master lm, loan_products lp where lp.product_code = :product and lp.all_loan_purposes_applicable = 1 union select distinct purpose1 from loan_product_purposes where product_code = :product
loanpurpose2.list=select distinct lm.loan_purpose_second_level purpose2 from loan_purpose_mapping_master lm, loan_products lp where lp.product_code = :product and lp.all_loan_purposes_applicable = 1 and lm.loan_purpose_first_level = :purpose1 union select distinct purpose2 from loan_product_purposes where product_code = :product and purpose1 = :purpose1
loanpurpose3.list=select distinct loan_purpose from loan_purpose_mapping_master where loan_purpose_first_level = :purpose1 and loan_purpose_second_level = :purpose2
achregistrationloanaccount.list= select l.id, l.account_number, l.loan_amount, l.loan_type, l.product_code, l.process_type, c.first_name from loan_accounts l left join customer c on (c.id = l.customer_id) where l.current_stage='Completed' and l.branch_id = :branchId and l.account_number like concat(:accountNumber, '%') and l.account_number is not null and account_number not in (select loan_account_number from ach_registration where mandate_status <> IF(:mandate_status='','',:mandate_status)) order by l.created_at desc
customersBankAccounts.list=SELECT cb.*, c.urn_no, c.first_name, c.email, c.mobile_phone from customer_bank_accounts cb left join customer c on (c.id =cb.customer_id) where customer_id in (:customer_ids) or customer_id in (select customer.id from customer where urn_no in (:customer_urns))
loanCustomerRelations.list=select l.urn, l.relation, c.first_name from loan_customer_relation l left join customer c on (l.urn = c.urn_no) where l.loan_id = (select id from loan_accounts where account_number = :accountNumber)
collectionsBranchSet.list=select * from collections_branch_set
cbsBanks.list=select b.*, now() current_system_date from cbs_banks b
unApprovedPaymentForAccount.list=SELECT id, account_number, current_stage, repayment_amount from loan_collections where account_number=:account_number and current_stage not in ('Completed', 'Rejected')
Allloanpurpose1.list=SELECT DISTINCT lm.loan_purpose_first_level purpose1 FROM loan_purpose_mapping_master lm where lm.loan_purpose_first_level NOT IN ('Line of credit','Debt Consolidation')
Allloanpurpose2.list=SELECT DISTINCT lm.loan_purpose_second_level purpose2 FROM loan_purpose_mapping_master lm WHERE lm.loan_purpose_first_level = :purpose1
loanParameters.list=SELECT p.ParameterDisplayName AS `Parameter`, ci.UserInput AS `Deviation`, (select GROUP_CONCAT(mitigant SEPARATOR '|') from sc_mitigants scm where scm.ParameterName = p.ParameterName) as `Mitigant`, (0.0+ci.ParamterScore) AS `ParameterScore`, ci.mitigant as `MitigantStored` FROM sc_calculation_inputs ci LEFT JOIN sc_parameters p on (ci.ParameterName = p.ParameterName and p.ScoreName = :score) WHERE ci.score_calc_id=(select max(id) from sc_calculation where ApplicationId = :loanId and ScoreName = :score) AND (0 < (select count(1) from sc_mitigants scm_1 where scm_1.ParameterName = p.ParameterName )) AND (ci.ParamterScore + 0)<4 AND CHAR_LENGTH(ci.UserInput) > 0
loanMitigants.list=SELECT DISTINCT lm.mitigant mitigant FROM sc_mitigants lm WHERE lm.ParameterName = :mitigant
searchLoanForPsychometric=SELECT * FROM loan_accounts la WHERE (la.psychometric_completed IS NULL OR la.psychometric_completed != 'Completed') AND la.customer_id in (SELECT c.id FROM customer c LEFT JOIN enterprise e ON c.enterprise_id = e.id WHERE c.id = la.customer_id AND (:pincode IS NULL OR :pincode = '' OR e.pincode = :pincode) AND c.first_name LIKE CONCAT(:first_name, '%') AND (:area = '' OR c.area LIKE CONCAT(:area, '%')) AND (:village_name = '' OR c.village_name LIKE CONCAT(:village_name, '%')))
userBranches.list=SELECT u.branch_id, u.user_id, b.branch_name, b.branch_code, b.bank_id from user_branches u left join branch_master b on (u.branch_id = b.id) where user_id = :user_id
loanAccountsByAccountNumber=SELECT * from loan_accounts where account_number = :accountNumber
queryForScore1=select (select ss.score from score_segment ss  where ss.score_name = 'PLSCORE' and ss.customer_id = (SELECT customer_id from loan_customer_relation lcr where lcr.loan_id = :loanId and lcr.relation = 'Applicant') ORDER BY ss.score_date desc limit 1) as cbScore, (select ecr.business_involvement from enterprise_customer_relations ecr where ecr.linked_to_customer_id= (SELECT customer_id from loan_customer_relation lcr where lcr.loan_id = :loanId and lcr.relation = 'Applicant') and ecr.customer_id = (select customer_id from loan_accounts where id = :loanId)ORDER BY `id` DESC limit 1) as businessInvolvement
familyMembers.list=select fa.family_member_first_name as nomineeFirstName, fa.gender as nomineeGender, fa.date_of_birth as nomineeDOB, fa.relationship as nomineeRelationship from family_details fa, loan_customer_relation lcr where lcr.loan_id = :loanId and fa.customer_id = lcr.customer_id and lcr.relation != 'Guarantor' and relationship != 'self'
globalSettingsIn.list=SELECT * from global_settings where name in (:names)
enterpriseRelations.list= (SELECT id,`first_name` as firstName FROM `customer` WHERE `urn_no`in (SELECT `urn` FROM `loan_customer_relation` WHERE `loan_id`in (SELECT id FROM `loan_accounts` WHERE `customer_id`=:customerId)) )union(SELECT id,`first_name` as firstName FROM `customer` WHERE `id`in (SELECT `linked_to_customer_id` FROM `enterprise_customer_relations` WHERE `customer_id`=:customerId)) 
LoanRepayBankAccountsByPartnerCode.list=SELECT * from bank_account_master where allow_collection = 1 and partner_code LIKE :partner_code 
loanProductCode.list= SELECT lp.product_code as productCode, lp.tenure_from, lp.tenure_to, lp.frequency FROM `loan_products` lp LEFT JOIN `module_config_master` mcm ON (mcm.module_name = lp.product_code and mcm.bank_id = :bankId) WHERE lp.product_category =:productCategory AND lp.partner_code =:partner AND lp.frequency =:frequency AND mcm.module_status = 1
loanTypeProductCode.list=SELECT `product_code` as productCode, tenure_from, tenure_to, frequency,loan_type FROM `loan_products` WHERE `product_category`=:productCategory and `partner_code`=:partner and `frequency`=:frequency and `loan_type`=:loanType
UserList.list=select user_name as user_id from oauth_access_token where user_name != :userId
CBCheck.customerList=select max(created_at) as created_at, customer_id from highmark_interface where customer_id in (:customerIds) and status = 'PROCESSED' group by customer_id
groupProcess.remarksHistory = SELECT pre_stage as stage, actions as action, group_remarks as remarks, created_by as updatedBy, created_at as updatedOn  FROM jlg_groups_snapshot where group_id = :groupId and group_remarks IS NOT NULL 
groupLoanProductsByPartner.list=SELECT product_name as productName, `product_code` as productCode, tenure_from, tenure_to, frequency FROM `loan_products` WHERE `partner_code`=:partner and loan_type = 'JLG'
feesFormMapping.list = select * from invoice_form_mapping
dedupe.list = SELECT d.id, d.customer_id, d.duplicate_above_threshold_count, d.status FROM dedupe_request d INNER JOIN customer c ON (c.id = d.customer_id AND d.created_at >= c.last_edited_at) where d.customer_id in (:ids) and d.id = (select max(id) from dedupe_request dr where dr.customer_id = d.customer_id)
enterpriseCustomer=select e.customer_id from  enterprise_customer_relations e where e.linked_to_customer_id = :individualCustomerId
loanCustomerDetails.list=select c.urn_no, IFNULL(lcr.relation, IF(c.id=l.customer_id, 'Loan Customer', 'NA')) `relation`, lcr.relationship_with_applicant, c.first_name, c.mobile_phone, c.landline_no, c.mobile_number_2 `alternate_mobile_number` from customer c left join loan_accounts l on (l.customer_id = c.id) left join loan_customer_relation lcr on (lcr.customer_id = c.id) where l.id = :loanId or lcr.loan_id = :loanId
nextInstallmentDate= SELECT MIN(installment_date) as min_date FROM `repayment_reminder` where loan_id in (select id from loan_accounts where product_code in (select product_code from loan_products where repayment_reminder_enabled = 1)) and DATE(installment_date) > CURDATE()
allusers.list=select u.user_id i, u.user_name n, ur.role_id r, bm.id b from users u, user_roles ur, branch_master bm where u.user_id = ur.user_id and u.branch_name = bm.branch_name
vehicleViability.list = SELECT * from vehicle_viability_master
AllLoanPurposeMapping.list = select loan_purpose_first_level as purpose1,loan_purpose_second_level as purpose2,loan_purpose as purpose3 from loan_purpose_mapping_master
PDCDemands.list= select repayment_amount, cheque_number from repayment_batch_details  where account_number=:accountNumber and repayment_type='PDC' and processing_status='FAILURE' order by id desc limit 1
loanAccountsByUrnAndStage.list = Select l.account_Number as accountNumber, l.id as loanId, l.current_stage as currentStage from loan_accounts l where l.urn_no = :urn and l.current_stage IN (:currentStage)
LookUpCodeByFrequency.list = select distinct lookup_code from `equated_installment_lookup_master` where frequency=:frequency
physicalAssets.list= select * from asset_master
profileSummary.list = select * from `customer_profile_summary` where current_stage='PendingVerification'
activeLoansCountByProduct = select count(*) as count from loan_accounts l where l.product_code = :product_code and (l.urn_no = :urn_no or l.applicant = :applicant) and l.id != :loan_id and l.account_number is NOT NULL and l.is_closed = 0 
loanAccountsByLikeAccountNumber.list=select distinct l.account_number, c.first_name as `customer`, applicant.first_name as `applicant` from loan_accounts l left join customer c on (c.id = l.customer_id) left join customer applicant on (l.applicant = applicant.urn_no) where l.account_number like concat('%', :account_number, '%') and l.account_number is not null
groupDetailsByGroupCode.list = select * from jlg_groups where group_code IN (:group_code)
pincodeMaster.list= SELECT p.pincode,p.division, p.region, p.taluk, p.district, p.state,s.id as 'state_id', d.id as 'district_id' FROM pincode_master p left join state_master s on p.state= s.state_name left join district_master d on p.district= d.district  WHERE p.pincode like concat(:pincode,'%')  AND LOWER(p.division) LIKE concat(LOWER(:division), '%') AND LOWER(p.region) LIKE concat(LOWER(:region), '%') AND LOWER(p.taluk) like concat(LOWER(:taluk),'%') AND LOWER(p.district) LIKE concat(LOWER(:district), '%') AND LOWER(p.state) like concat(LOWER(:state),'%')
deseaseDetails = select * from desease_details where customer_id = :customer_id
vehicleSchemeCodeDetails.list = select * from vehicle_loan_scheme_master where DATE(`valid_till`)>= CURDATE() and `status`="Active" and `branch`= :branch_name and `dealer`=:centre_name
LoanRepayBankAccountByPartnerCode.list=SELECT * from bank_account_master where allow_collection = 1 and partner_code LIKE :partner_code and bank_name in ('HDFC Bank','RBL Bank')
questionnaireDetails.list=SELECT qm.party_type, qm.question, qm.input_type, qdm.value  FROM questions_master qm LEFT JOIN questionnaire_dropdown_master qdm ON qm.id = qdm.questions_master_id WHERE qm.module_code=:module_code AND qm.process=:process AND qm.stage=:stage
ReadyToDisburseAccountDetails.list = SELECT l.id as loanId ,l.account_number as accountNumber, l.loan_amount as loanAmount ,c.first_name as customerName FROM loan_accounts l LEFT JOIN customer c ON (c.urn_no = :urn_no) WHERE loan_disbursement_date IS NULL AND l.urn_no = :urn_no UNION SELECT l.id as loanId ,l.account_number as accountNumber, l.loan_amount as loanAmount ,c.first_name as customerName FROM loan_accounts l LEFT JOIN customer c ON (c.urn_no = :urn_no) WHERE loan_disbursement_date IS NULL AND l.current_stage = 'Completed' AND (l.urn_no = :urn_no or l.applicant = :urn_no)
loanProductDetails.list = SELECT co_borrower_required,expiry_date,number_of_guarantors,amount_from,amount_to,product_name,`product_code` as productCode, tenure_from, tenure_to, frequency,loan_type,min_interest_rate,max_interest_rate FROM `loan_products` WHERE loan_type = :loanType and partner_code = :partnerCode and frequency = :frequency and expiry_date >= now()
LTV.list = SELECT vvvm.value FROM vehicle_viability_master vvm LEFT JOIN vehicle_viability_vintage_master vvvm ON vvvm.vehicle_viability_master_id = vvm.id WHERE vvm.manufacturer = :make AND vvm.model = :vehicle_model AND vvm.state_code = substr(:registration_number, 1, 2) AND vvvm.age = (YEAR(CURDATE())-:year_of_manufacture) order by vvvm.age ASC LIMIT 1

accountOverrideStatus.list= select override_status,account_number,urn_no,product from account_override_status where account_number = :accountNo and urn_no = :urnNo 

machineDescription.list=SELECT distinct machine_description as `machineDescription` from machine_master 
machineName.list=SELECT distinct m.machine_name as `machineName` from machine_master m where m.machine_name like  concat('%', :machineName, '%')
machineType.list=SELECT distinct machine_type as `machineType`,depreciation_percentage as `depreciationPercentage`  from machine_master where  machine_name = :machineName
machineWorkProcess.list=SELECT distinct work_process as `workProcess` from machine_master where  machine_name = :machineName and machine_type = :machineType
machineModel.list=SELECT distinct model as `machineModel` from machine_master where machine_name = :machineName and machine_type = :machineType and work_process = :workProcess
machineDepreciation.list=SELECT distinct depreciation_percentage as `depreciationPercentage` from machine_master where machine_name = :machineName and machine_type = :machineType
machineMaster.list=SELECT machine_name as `machineName`, machine_type as `machineType`,work_process as `workProcess`, model as `model`, depreciation_percentage as `depreciation`, year_of_manufacturing as `yearOfManufacturing` from machine_master


goldRateDetails = SELECT gold_rate_in_paisa as `goldRate` from jewel_loan_parameter_master LIMIT 1

reassignment.list = SELECT l.id AS loanId,l.screening_date AS screeningDate,c.first_name AS applicantName,CUSENT.first_name AS customerName,bm.branch_name AS branchName,cm.centre_name AS centreName FROM loan_accounts l INNER JOIN loan_customer_relation lcr ON ( lcr.loan_id = l.id AND lcr.relation = 'APPLICANT' ) INNER JOIN customer c ON ( c.id = lcr.customer_id ) INNER JOIN customer CUSENT ON ( CUSENT.id = l.customer_id AND CUSENT.customer_type = 'Enterprise' ) INNER JOIN branch_master bm ON ( bm.id = l.branch_id ) INNER JOIN loan_centre lc ON ( lc.loan_id = l.id ) INNER JOIN centre_master cm ON ( cm.id = lc.centre_id ) WHERE  ( loan_purpose_1 IN( 'Purchase - Used Vehicle', 'Refinance' ) AND l.current_stage IN( 'FieldInvestigation1', 'FieldInvestigation2', 'FieldInvestigation3','TeleVerification' )) AND ( :branch_name = ''  OR bm.branch_name= :branch_name )

loginDetails.one = SELECT id FROM login_details WHERE user_id = :userId order by id desc limit 1

loanIdByloanCollectionId.one=  select id from loan_accounts where account_number in (select account_number from loan_collections where id = :id)
getCustomerGroups.list= SELECT j.group_id,g.group_code,g.group_name,g.group_category,g.partner_code,g.branch_id FROM jlg_group_members j left join jlg_groups g on j.group_id=g.id WHERE j.urn_no=:urn_no and g.group_status='1'
customer.list =  SELECT urn_no as `urnNo` , id as `customerId`, first_name as `firstName`, last_name as `last_name`, date_of_birth as `dateOfBirth`, gender as `gender`, customer_bank_id as `customerBankId`, customer_branch_id as `customerBranchId`, centre_id as `centreId`, mobile_phone as `mobilePhone` from customer where urn_no like concat(:urnNo,'%') AND LOWER(first_name) like concat(LOWER(:customerName),'%')
customerFamilyMembers.list = SELECT family_member_first_name as `familyMemberFirstName`, family_member_last_name as familyMemberLastName, `gender` as gender, date_of_birth as `dateOfBirth`, relationship as `realtionShip`, enrollment_id as `enrollmentId` from family_details where customer_id = (select if( parent_customer_id != 0, parent_customer_id, id ) as  id from customer where id =:customerId)
customerNomineeMembers.list = SELECT family_member_first_name as `familyMemberFirstName`, family_member_last_name as familyMemberLastName, `gender` as gender, date_of_birth as `dateOfBirth`, relationship as `realtionShip`, enrollment_id as `enrollmentId` from family_details where customer_id = (select if( parent_customer_id != 0, parent_customer_id, id ) as  id from customer where id =:customerId) and relationship not in (:relationShip) and relationship in ('Father','Brother','Mother','Self','Son','Daughter','Sister','Wife','Husband')
insuranceProducts.list = select distinct im.product_code as `productCode`, im.partner_code as `partnerCode`,m.id as `moduleConfigId`, im.insurance_type as insuranceType, im.premium_rate_code as `premiumRateCode` from  insurance_product_master im  inner join module_config_master m on m.module_name = im.product_code and m.bank_id = :bankId inner join product_type_master pm on m.module_name = pm.product_name inner join product_configuration pc on pc.product_id = pm.id where pc.bank_id = :bankId and branch_id = :branchId and insurance_type = :insuranceType
customerLoanAccount.list=SELECT account_number from loan_accounts where customer_id = :customer_id
getBankName = SELECT bank_name from bank_master where id =:bankId
getInsuranceFormName = SELECT product_code, document_code as `FormName`,is_mandatory from insurance_documents_master where product_code = :productCode
getInsuranceDocuments = SELECT product_code as `productCode`,document_code as `document_code`,is_mandatory as `isMandatory` where product_code = :productCode
getTelecallingSnapshotId = SELECT max(telecalling_details_id) as `telecalling_id` from telecalling_details_snapshot where process_type = 'CUSTOMER' and customer_id = :customer_id