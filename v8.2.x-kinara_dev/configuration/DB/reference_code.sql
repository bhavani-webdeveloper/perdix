delete from reference_code where classifier = 'constitution';
insert into reference_code(version,classifier,name,code,created_by,created_at,last_edited_by,last_edited_at) values
('1','constitution','Proprietorship','1','adminkinara',now(),'adminkinara',now()),
('1','constitution','Partnership','2','adminkinara',now(),'adminkinara',now()),
('1','constitution','Private LTD','3','adminkinara',now(),'adminkinara',now());

delete from reference_code where classifier = 'business_registered';
insert into reference_code(version,classifier,name,code,created_by,created_at,last_edited_by,last_edited_at) values 
('1','business_registered','Yes','1','adminkinara',now(),'adminkinara',now()),
('1','business_registered','No','2','adminkinara',now(),'adminkinara',now());

delete from reference_code where classifier = 'business_registration_type';
insert into reference_code(version,classifier,name,code,created_by,created_at,last_edited_by,last_edited_at) values 
('1','business_registration_type','Tin','1','adminkinara',now(),'adminkinara',now()),
('1','business_registration_type','SSI No','2','adminkinara',now(),'adminkinara',now()),
('1','business_registration_type','Vat No','3','adminkinara',now(),'adminkinara',now()),
('1','business_registration_type','Business Pan Card No','4','adminkinara',now(),'adminkinara',now()),
('1','business_registration_type','Service Tax No','5','adminkinara',now(),'adminkinara',now()),
('1','business_registration_type','DIC','6','adminkinara',now(),'adminkinara',now()),
('1','business_registration_type','MSME','7','adminkinara',now(),'adminkinara',now()),
('1','business_registration_type','S & E','8','adminkinara',now(),'adminkinara',now()),
('1','business_registration_type','PAN (mandatory if Pvt Ltd)','9','adminkinara',now(),'adminkinara',now());

delete from reference_code where classifier = 'business_history';
insert into reference_code(version,classifier,name,code,created_by,created_at,last_edited_by,last_edited_at) values 
('1','business_history','Clean - Single owner/structure','1','adminkinara',now(),'adminkinara',now()),
('1','business_history','Partnership with 2 partners','2','adminkinara',now(),'adminkinara',now()),
('1','business_history','Partnership with more than 2 partners','3','adminkinara',now(),'adminkinara',now()),
('1','business_history','Previously closed another business','4','adminkinara',now(),'adminkinara',now()),
('1','business_history','Previously dissolved partnership','5','adminkinara',now(),'adminkinara',now());

delete from reference_code where classifier = 'distance_from_centre';
insert into reference_code(version,classifier,name,code,created_by,created_at,last_edited_by,last_edited_at) values 
('1','distance_from_centre','In the spoke','1','adminkinara',now(),'adminkinara',now()),
('1','distance_from_centre','Just outside the Spoke','2','adminkinara',now(),'adminkinara',now()),
('1','distance_from_centre','5 kms from the closest spoke','3','adminkinara',now(),'adminkinara',now()),
('1','distance_from_centre','10 kms from the closest spoke','4','adminkinara',now(),'adminkinara',now()),
('1','distance_from_centre','>10 kms from the closest spoke','5','adminkinara',now(),'adminkinara',now());

delete from reference_code where classifier = 'ownership';
insert into reference_code(version,classifier,name,code,created_by,created_at,last_edited_by,last_edited_at) values 
('1','ownership','Owned','1','adminkinara',now(),'adminkinara',now()),
('1','ownership','Rented','2','adminkinara',now(),'adminkinara',now()),
('1','ownership','Leased','3','adminkinara',now(),'adminkinara',now());

delete from reference_code where classifier = 'years_in_current_area';
insert into reference_code(version,classifier,name,code,created_by,created_at,last_edited_by,last_edited_at) values 
('1','years_in_current_area','Less Than 1 Year','1','adminkinara',now(),'adminkinara',now()),
('1','years_in_current_area','1 to 2 Years','2','adminkinara',now(),'adminkinara',now()),
('1','years_in_current_area','2 to 3 Years','3','adminkinara',now(),'adminkinara',now()),
('1','years_in_current_area','3 to 5 Years','4','adminkinara',now(),'adminkinara',now()),
('1','years_in_current_area','5 to 10 Years','5','adminkinara',now(),'adminkinara',now()),
('1','years_in_current_area','Greater Than 10 Years','6','adminkinara',now(),'adminkinara',now());

delete from reference_code where classifier = 'years_in_current_address';
insert into reference_code(version,classifier,name,code,created_by,created_at,last_edited_by,last_edited_at) values 
('1','years_in_current_address','Less Than 1 Year','1','adminkinara',now(),'adminkinara',now()),
('1','years_in_current_address','1 to 3 Years','2','adminkinara',now(),'adminkinara',now()),
('1','years_in_current_address','4 to 6 Years','3','adminkinara',now(),'adminkinara',now()),
('1','years_in_current_address','6 to 10 Years','4','adminkinara',now(),'adminkinara',now()),
('1','years_in_current_address','Greater than 10 Years','5','adminkinara',now(),'adminkinara',now());

delete from reference_code where classifier = 'years_in_present_area';
insert into reference_code(version,classifier,name,code,created_by,created_at,last_edited_by,last_edited_at) values 
('1','years_in_present_area','Less than 1 Year','1','adminkinara',now(),'adminkinara',now()),
('1','years_in_present_area','1 to to 3 Years','2','adminkinara',now(),'adminkinara',now()),
('1','years_in_present_area','4 to to 6 Years','3','adminkinara',now(),'adminkinara',now()),
('1','years_in_present_area','6 to to 10 Years','4','adminkinara',now(),'adminkinara',now()),
('1','years_in_present_area','Greater than 10 Years','5','adminkinara',now(),'adminkinara',now());

delete from reference_code where classifier = 'years_of_experience';
insert into reference_code(version,classifier,name,code,created_by,created_at,last_edited_by,last_edited_at) values 
('1','years_of_experience','No experience','1','adminkinara',now(),'adminkinara',now()),
('1','years_of_experience','Less Than 4 years','2','adminkinara',now(),'adminkinara',now()),
('1','years_of_experience','4 to 7 Years','3','adminkinara',now(),'adminkinara',now()),
('1','years_of_experience','7 to 10 Years','4','adminkinara',now(),'adminkinara',now()),
('1','years_of_experience','Greater than 10 Years','5','adminkinara',now(),'adminkinara',now());

delete from reference_code where classifier = 'account_type';
insert into reference_code(version,classifier,name,code,created_by,created_at,last_edited_by,last_edited_at) values 
('1','account_type','Current','1','adminkinara',now(),'adminkinara',now()),
('1','account_type','Savings','2','adminkinara',now(),'adminkinara',now()),
('1','account_type','OD','3','adminkinara',now(),'adminkinara',now()),
('1','account_type','CC','4','adminkinara',now(),'adminkinara',now());

delete from reference_code where classifier = 'loan_type_product_scheme';
insert into reference_code(version,classifier,name,code,created_by,created_at,last_edited_by,last_edited_at) values 
('1','loan_type_product_scheme','Secured-LT','1','adminkinara',now(),'adminkinara',now()),
('1','loan_type_product_scheme','Unsecured-LT','2','adminkinara',now(),'adminkinara',now()),
('1','loan_type_product_scheme','RF-Direct','3','adminkinara',now(),'adminkinara',now());

delete from reference_code where classifier = 'sme_loan_purpose';
insert into reference_code(version,classifier,name,code,created_by,created_at,last_edited_by,last_edited_at) values 
('1','sme_loan_purpose','Machine Refinance','1','adminkinara',now(),'adminkinara',now()),
('1','sme_loan_purpose','Asset Purchase','2','adminkinara',now(),'adminkinara',now()),
('1','sme_loan_purpose','Debt Consolidation','3','adminkinara',now(),'adminkinara',now()),
('1','sme_loan_purpose','Working Capital','4','adminkinara',now(),'adminkinara',now());

delete from reference_code where classifier = 'identity_proof';
insert into reference_code(version,classifier,name,code,created_by,created_at,last_edited_by,last_edited_at) values 
('1','identity_proof','Ration Card','1','adminkinara',now(),'adminkinara',now()),
('1','identity_proof','Voter Card','2','adminkinara',now(),'adminkinara',now()),
('1','identity_proof','Passport','3','adminkinara',now(),'adminkinara',now()),
('1','identity_proof','Pan Card','4','adminkinara',now(),'adminkinara',now()),
('1','identity_proof','Adhar Card','5','adminkinara',now(),'adminkinara',now()),
('1','identity_proof','Driving Licence','6','adminkinara',now(),'adminkinara',now());

delete from reference_code where classifier = 'relationship_with_business';
insert into reference_code(version,classifier,name,code,created_by,created_at,last_edited_by,last_edited_at) values 
('1','relationship_with_business','Propritor','1','adminkinara',now(),'adminkinara',now()),
('1','relationship_with_business','Partner','2','adminkinara',now(),'adminkinara',now()),
('1','relationship_with_business','Director','3','adminkinara',now(),'adminkinara',now()),
('1','relationship_with_business','Others','4','adminkinara',now(),'adminkinara',now());

delete from reference_code where classifier = 'business_involvement';
insert into reference_code(version,classifier,name,code,created_by,created_at,last_edited_by,last_edited_at) values 
('1','business_involvement','Full time','1','adminkinara',now(),'adminkinara',now()),
('1','business_involvement','Part time','2','adminkinara',now(),'adminkinara',now()),
('1','business_involvement','None','3','adminkinara',now(),'adminkinara',now());

delete from reference_code where classifier = 'title';
insert into reference_code(version,classifier,name,code,created_by,created_at,last_edited_by,last_edited_at) values 
('1','title','Mr.','1','adminkinara',now(),'adminkinara',now()),
('1','title','Mrs','2','adminkinara',now(),'adminkinara',now()),
('1','title','Ms','3','adminkinara',now(),'adminkinara',now());

delete from reference_code where classifier = 'gender';
insert into reference_code(version,classifier,name,code,created_by,created_at,last_edited_by,last_edited_at) values 
('1','gender','Male','1','adminkinara',now(),'adminkinara',now()),
('1','gender','Female','2','adminkinara',now(),'adminkinara',now()),
('1','gender','Un-Specified','3','adminkinara',now(),'adminkinara',now());

delete from reference_code where classifier = 'marital_status';
insert into reference_code(version,classifier,name,code,created_by,created_at,last_edited_by,last_edited_at) values 
('1','marital_status','Divorced/Separated','1','adminkinara',now(),'adminkinara',now()),
('1','marital_status','Married','2','adminkinara',now(),'adminkinara',now()),
('1','marital_status','Single','3','adminkinara',now(),'adminkinara',now()),
('1','marital_status','Widow','4','adminkinara',now(),'adminkinara',now());

delete from reference_code where classifier = 'education_level';
insert into reference_code(version,classifier,name,code,created_by,created_at,last_edited_by,last_edited_at) values 
('1','education_level','Below SSLC','1','adminkinara',now(),'adminkinara',now()),
('1','education_level','SSLC','2','adminkinara',now(),'adminkinara',now()),
('1','education_level','HSC','3','adminkinara',now(),'adminkinara',now()),
('1','education_level','Graduate/Diploma/ITI','4','adminkinara',now(),'adminkinara',now()),
('1','education_level','Professional Degree','5','adminkinara',now(),'adminkinara',now()),
('1','education_level','Others','6','adminkinara',now(),'adminkinara',now());

delete from reference_code where classifier = 'religion';
insert into reference_code(version,classifier,name,code,created_by,created_at,last_edited_by,last_edited_at) values 
('1','religion','Hindu','1','adminkinara',now(),'adminkinara',now()),
('1','religion','Muslim','2','adminkinara',now(),'adminkinara',now()),
('1','religion','Christian','3','adminkinara',now(),'adminkinara',now()),
('1','religion','Jain','4','adminkinara',now(),'adminkinara',now()),
('1','religion','Buddhism','5','adminkinara',now(),'adminkinara',now()),
('1','religion','Others','6','adminkinara',now(),'adminkinara',now());

delete from reference_code where classifier = 'type_of_address';
insert into reference_code(version,classifier,name,code,created_by,created_at,last_edited_by,last_edited_at) values 
('1','type_of_address','Present Address','1','adminkinara',now(),'adminkinara',now()),
('1','type_of_address','Permanent Address','2','adminkinara',now(),'adminkinara',now());

delete from reference_code where classifier = 'relationship';
insert into reference_code(version,classifier,name,code,created_by,created_at,last_edited_by,last_edited_at) values 
('1','relationship','Spouse ','1','adminkinara',now(),'adminkinara',now()),
('1','relationship','Sibling','2','adminkinara',now(),'adminkinara',now()),
('1','relationship','Parent','3','adminkinara',now(),'adminkinara',now()),
('1','relationship','Child','4','adminkinara',now(),'adminkinara',now()),
('1','relationship','Friend','5','adminkinara',now(),'adminkinara',now()),
('1','relationship','Other','6','adminkinara',now(),'adminkinara',now());

delete from reference_code where classifier = 'promise_to_pay';
insert into reference_code(version,classifier,name,code,created_by,created_at,last_edited_by,last_edited_at) values 
('1','promise_to_pay','Willful Default','1','adminkinara',now(),'adminkinara',now()),
('1','promise_to_pay','Hardship','2','adminkinara',now(),'adminkinara',now()),
('1','promise_to_pay','Able To Pay','3','adminkinara',now(),'adminkinara',now()),
('1','promise_to_pay','Others','4','adminkinara',now(),'adminkinara',now());

delete from reference_code where classifier = 'payment_mode';
insert into reference_code(version,classifier,name,code,created_by,created_at,last_edited_by,last_edited_at) values 
('1','payment_mode','Cash','1','adminkinara',now(),'adminkinara',now()),
('1','payment_mode','Cheque','2','adminkinara',now(),'adminkinara',now()),
('1','payment_mode','NEFT','3','adminkinara',now(),'adminkinara',now());
