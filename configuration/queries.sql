customers.list=select * from customer where id=:id
loanaccounts.list=select l.* from loan_accounts l,jlg_account_details jlg where jlg.account_number = l.account_number and l.bank_id =:bank_id and jlg.group_code =:group_code and l.partner_code = :partner_code and l.is_closed = 0
loanAccount.list=select * from loan_accounts where account_number=:account_number and branch_id=:branch_id
loanAccountIn.list=select l.*, c.first_name, c.customer_type from loan_accounts l left join customer c on (l.customer_id = c.id) where l.account_number IN (:account_numbers)
customersLimit.list=select * from customer
userRole.get=SELECT * FROM roles r, user_roles u WHERE u.role_id = r.id AND u.user_id = :userId
userpages.list=select p.uri, p.title, p.short_title shortTitle, p.icon_class iconClass, p.direct_access directAccess, p.offline, p.state, p.page_name pageName, p.page_id pageId, p.addl_params addlParams, rpa.page_config pageConfig from pages p, role_page_access rpa where p.id = rpa.page_id and rpa.role_id in (select role_id from user_roles where user_id = :user_id)
account.list=select * from loan_accounts
pincode.list=SELECT p.pincode, p.division, p.region, p.taluk, p.district, p.state FROM pincode_master p WHERE p.pincode like concat(:pincode,'%') AND LOWER(p.district) LIKE concat(LOWER(:district), '%') AND LOWER(p.state) like concat(LOWER(:state),'%')
translations.list=SELECT label_code code, en, hi, ta FROM translations
loan_products.list=SELECT * from loan_account_documents where product_code = :product_code and process = :process and stage = :stage
globalSettings.list=SELECT * from global_settings where name = :name
customerBankAccounts.list=SELECT * from customer_bank_accounts where customer_id = :customer_id
bankAccounts.list=SELECT * from bank_account_master
bankAccountsByPartnerCode.list=SELECT * from bank_account_master where partner_code=:partner_code
bankAccountsByProductCode.list=SELECT * from bank_account_master where partner_code= (select partner_code from loan_products where product_code = :product_code) and allow_disbursement in (:allow_disbursement) and allow_collection in (:allow_collection)
latestLoanRepayments.list=SELECT lr.branch_name, lr.account_number, c.urn_no, c.first_name, lr.transaction_id, lr.repayment_type, lr.repayment_date, ROUND(lr.repayment_amount_in_paisa/100) repayment_amount FROM loan_repayment_details lr, customer c WHERE lr.enrollment_id = c.enrollment_id AND lr.reverse_flag = 'N' AND lr.repayment_type NOT LIKE '%_REV' AND lr.account_number = :account_number ORDER BY lr.created_at DESC
depositstage.list=select * from loan_collections where current_stage = 'Deposit' and created_by = :deposit_user
customerBasicDetails.list=select first_name, customer_branch_id, centre_id, urn_no, id, mobile_phone from customer where id IN (:ids) OR urn_no IN (:urns)
loan_doc_reject_reasons.list=SELECT document_code, reject_reason FROM loan_doc_reject_reasons
loanpurpose1.list=select distinct lm.loan_purpose_first_level purpose1 from loan_purpose_mapping_master lm, loan_products lp where lp.product_code = :product and lp.all_loan_purposes_applicable = 1 union select distinct purpose1 from loan_product_purposes where product_code = :product
loanpurpose2.list=select distinct lm.loan_purpose_second_level purpose2 from loan_purpose_mapping_master lm, loan_products lp where lp.product_code = :product and lp.all_loan_purposes_applicable = 1 and lm.loan_purpose_first_level = :purpose1 union select distinct purpose2 from loan_product_purposes where product_code = :product and purpose1 = :purpose1
achregistrationloanaccount.list= select l.id, l.account_number, l.loan_amount, l.loan_type, l.product_code, l.process_type, c.first_name from loan_accounts l left join customer c on (c.id = l.customer_id) where l.current_stage='Completed' and l.branch_id = :branchId and l.account_number like concat(:accountNumber, '%') and l.account_number is not null and account_number not in (select loan_account_number from ach_registration where mandate_status <> IF(:mandate_status='','',:mandate_status)) order by l.created_at desc
customersBankAccounts.list=SELECT cb.*, c.urn_no, c.first_name from customer_bank_accounts cb left join customer c on (c.id =cb.customer_id) where customer_id in (:customer_ids) or customer_id in (select customer.id from customer where urn_no in (:customer_urns))
loanCustomerRelations.list=select l.urn, l.relation, c.first_name from loan_customer_relation l left join customer c on (l.urn = c.urn_no) where l.loan_id = (select id from loan_accounts where account_number = :accountNumber)
collectionsBranchSet.list=select * from collections_branch_set
cbsBanks.list=select * from cbs_banks
userbank.list=select * from bank_master where bank_name= :bankName
unApprovedPaymentForAccount.list=SELECT id, account_number, current_stage, repayment_amount from loan_collections where account_number=:account_number and current_stage not in ('Completed', 'Rejected')
Allloanpurpose1.list=SELECT DISTINCT lm.loan_purpose_first_level purpose1 FROM loan_purpose_mapping_master lm where lm.loan_purpose_first_level NOT IN ('Line of credit','Debt Consolidation')
Allloanpurpose2.list=SELECT DISTINCT lm.loan_purpose_second_level purpose2 FROM loan_purpose_mapping_master lm WHERE lm.loan_purpose_first_level = :purpose1
loanParameters.list=SELECT p.ParameterDisplayName AS `Parameter`, ci.UserInput AS `Deviation`, (select GROUP_CONCAT(mitigant SEPARATOR '|') from sc_mitigants scm where scm.ParameterName = p.ParameterName) as `Mitigant`, (0.0+ci.ParamterScore) AS `ParameterScore`, ci.mitigant as `MitigantStored` FROM sc_calculation_inputs ci LEFT JOIN sc_parameters p on (ci.ParameterName = p.ParameterName and p.ScoreName = :score) WHERE ci.score_calc_id=(select max(id) from sc_calculation where ApplicationId = :loanId and ScoreName = :score) AND (0 < (select count(1) from sc_mitigants scm_1 where scm_1.ParameterName = p.ParameterName )) AND (ci.ParamterScore + 0)<4 AND CHAR_LENGTH(ci.UserInput) > 0
loanMitigants.list=SELECT DISTINCT lm.mitigant mitigant FROM sc_mitigants lm WHERE lm.ParameterName = :mitigant
searchLoanForPsychometric=SELECT * FROM loan_accounts la WHERE (la.psychometric_completed IS NULL OR la.psychometric_completed != 'Completed') AND la.customer_id in (SELECT c.id FROM customer c LEFT JOIN enterprise e ON c.enterprise_id = e.id WHERE c.id = la.customer_id AND (:pincode IS NULL OR :pincode = '' OR e.pincode = :pincode) AND c.first_name LIKE CONCAT(:first_name, '%') AND (:area = '' OR c.area LIKE CONCAT(:area, '%')) AND (:village_name = '' OR c.village_name LIKE CONCAT(:village_name, '%')))
userBranches.list=SELECT u.branch_id, u.user_id, b.branch_name, b.branch_code from user_branches u left join branch_master b on (u.branch_id = b.id) where user_id = :user_id
loanAccountsByAccountNumber=SELECT * from loan_accounts where account_number = :accountNumber
queryForScore1=select (select ss.score from score_segment ss  where ss.score_name = 'PLSCORE' and ss.customer_id = (SELECT customer_id from loan_customer_relation lcr where lcr.loan_id = :loanId and lcr.relation = 'Applicant')) as cbScore, (select ecr.business_involvement from enterprise_customer_relations ecr where ecr.linked_to_customer_id= (SELECT customer_id from loan_customer_relation lcr where lcr.loan_id = :loanId and lcr.relation = 'Applicant') and ecr.customer_id = (select customer_id from loan_accounts where id = :loanId)) as businessInvolvement
familyMembers.list=select fa.family_member_first_name as nomineeFirstName, fa.gender as nomineeGender, fa.date_of_birth as nomineeDOB from family_details fa, loan_customer_relation lcr where lcr.loan_id = :loanId and fa.customer_id = lcr.customer_id and lcr.relation != 'Guarantor' and relationship != 'self'
globalSettingsIn.list=SELECT * from global_settings where name in (:names)
enterpriseRelations.list= (SELECT id,`first_name` as firstName FROM `customer` WHERE `urn_no`in (SELECT `urn` FROM `loan_customer_relation` WHERE `loan_id`in (SELECT id FROM `loan_accounts` WHERE `customer_id`=:customerId)) )union(SELECT id,`first_name` as firstName FROM `customer` WHERE `id`in (SELECT `linked_to_customer_id` FROM `enterprise_customer_relations` WHERE `customer_id`=:customerId)) 
LoanRepayBankAccountsByPartnerCode.list=SELECT * from bank_account_master where allow_collection = 1 and partner_code LIKE :partner_code
UserList.list=select user_name as user_id from oauth_access_token where user_name != :userId

