<?php

// Setting up config for PHP
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// error_reporting(0);

include_once("bootload.php");
use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use App\Models\CustomerUploadMaster;
use App\Models\CustomerUploadDetail;
use App\Services\PerdixService;
use App\Core\Settings;

$queryString = $_SERVER['QUERY_STRING'];
$query = [];
parse_str($queryString, $query);




try{
	
	$id=DB::connection("bietl_db")->select("select (case when parent_customer_id=0 then id else parent_customer_id end) as id from financialForms.customer where id=?",array($query['cid']));
	
	// Dashboard queries for customer summary
	$result_segment =DB::connection("bietl_db")->select("	select (case 

	when oc_cat.occupation_category='Agriculture' and ifnull(ifnull(ti.household_income,0)/nullif(sz.cnt,0),0)>=0 and ifnull(ifnull(ti.household_income,0)/nullif(sz.cnt,0),0)<62826  then 'agri low income'

	when oc_cat.occupation_category='Agriculture' and ifnull(ifnull(ti.household_income,0)/nullif(sz.cnt,0),0)>=62826 and ifnull(ifnull(ti.household_income,0)/nullif(sz.cnt,0),0)<121883  then 'agri mid income'


	when oc_cat.occupation_category='Agriculture' and ifnull(ifnull(ti.household_income,0)/nullif(sz.cnt,0),0)>=121883 then 'agri high income'


	when oc_cat.occupation_category='Working Abroad' and ifnull(ifnull(ti.household_income,0)/nullif(sz.cnt,0),0)>=0 and ifnull(ifnull(ti.household_income,0)/nullif(sz.cnt,0),0)<92403 and ifnull(ifnull(ai.household_income,0)/nullif(ti.household_income,0),0)>=0  and ifnull(ifnull(ai.household_income,0)/nullif(ti.household_income,0),0)<=25 then 'working abroad low income'

	when oc_cat.occupation_category='Working Abroad' and ifnull(ifnull(ti.household_income,0)/nullif(sz.cnt,0),0)>=92403 and ifnull(ifnull(ti.household_income,0)/nullif(sz.cnt,0),0)<161574 and ifnull(ifnull(ai.household_income,0)/nullif(ti.household_income,0),0)>=0  and ifnull(ifnull(ai.household_income,0)/nullif(ti.household_income,0),0)<=25 then 'working abroad mid income'


	when oc_cat.occupation_category='Working Abroad' and ifnull(ifnull(ti.household_income,0)/nullif(sz.cnt,0),0)>=161574  and ifnull(ifnull(ai.household_income,0)/nullif(ti.household_income,0),0)>=0  and ifnull(ifnull(ai.household_income,0)/nullif(ti.household_income,0),0)<=25 then 'working abroad high income'

	when oc_cat.occupation_category='Working Abroad' and ifnull(ifnull(ti.household_income,0)/nullif(sz.cnt,0),0)>=0  and ifnull(ifnull(ai.household_income,0)/nullif(ti.household_income,0),0)>25  and ifnull(ifnull(ai.household_income,0)/nullif(ti.household_income,0),0)<=100 then 'working abroad agri income'

	when oc_cat.occupation_category='Business' and ifnull(ifnull(ti.household_income,0)/nullif(sz.cnt,0),0)>=0 and ifnull(ifnull(ti.household_income,0)/nullif(sz.cnt,0),0)<80338 and ifnull(ifnull(ai.household_income,0)/nullif(ti.household_income,0),0)>=0  and ifnull(ifnull(ai.household_income,0)/nullif(ti.household_income,0),0)<=100 then 'business low income'

	when oc_cat.occupation_category='Business' and ifnull(ifnull(ti.household_income,0)/nullif(sz.cnt,0),0)>=80338 and ifnull(ifnull(ti.household_income,0)/nullif(sz.cnt,0),0)<121573 and ifnull(ifnull(ai.household_income,0)/nullif(ti.household_income,0),0)>=0  and ifnull(ifnull(ai.household_income,0)/nullif(ti.household_income,0),0)<=100 then 'business mid income'


	when oc_cat.occupation_category='Business' and ifnull(ifnull(ti.household_income,0)/nullif(sz.cnt,0),0)>=121573 and ifnull(ifnull(ai.household_income,0)/nullif(ti.household_income,0),0)>=0  and ifnull(ifnull(ai.household_income,0)/nullif(ti.household_income,0),0)<=100 then 'business high income'


	when oc_cat.occupation_category='Salary' and ifnull(ifnull(ti.household_income,0)/nullif(sz.cnt,0),0)>=0 and ifnull(ifnull(ti.household_income,0)/nullif(sz.cnt,0),0)<73623 and ifnull(ifnull(ai.household_income,0)/nullif(ti.household_income,0),0)>=0  and ifnull(ifnull(ai.household_income,0)/nullif(ti.household_income,0),0)<=25 then 'salary low income'

	when oc_cat.occupation_category='Salary' and ifnull(ifnull(ti.household_income,0)/nullif(sz.cnt,0),0)>=73623 and ifnull(ifnull(ti.household_income,0)/nullif(sz.cnt,0),0)<140605 and ifnull(ifnull(ai.household_income,0)/nullif(ti.household_income,0),0)>=0  and ifnull(ifnull(ai.household_income,0)/nullif(ti.household_income,0),0)<=25 then 'salary mid income'


	when oc_cat.occupation_category='Salary' and ifnull(ifnull(ti.household_income,0)/nullif(sz.cnt,0),0)>=140605 and ifnull(ifnull(ai.household_income,0)/nullif(ti.household_income,0),0)>=0  and ifnull(ifnull(ai.household_income,0)/nullif(ti.household_income,0),0)<=25 then 'salary high income'

	when oc_cat.occupation_category='Salary' and ifnull(ifnull(ti.household_income,0)/nullif(sz.cnt,0),0)>=0  and ifnull(ifnull(ai.household_income,0)/nullif(ti.household_income,0),0)>25  and ifnull(ifnull(ai.household_income,0)/nullif(ti.household_income,0),0)<=100 then 'salary agri income'

	when oc_cat.occupation_category='Labour' and ifnull(ifnull(ti.household_income,0)/nullif(sz.cnt,0),0)>=0 and ifnull(ifnull(ti.household_income,0)/nullif(sz.cnt,0),0)<56816 and ifnull(ifnull(ai.household_income,0)/nullif(ti.household_income,0),0)>=0  and ifnull(ifnull(ai.household_income,0)/nullif(ti.household_income,0),0)<=25 then 'labour low income'

	when oc_cat.occupation_category='Labour' and ifnull(ifnull(ti.household_income,0)/nullif(sz.cnt,0),0)>=56816 and ifnull(ifnull(ti.household_income,0)/nullif(sz.cnt,0),0)<83953 and ifnull(ifnull(ai.household_income,0)/nullif(ti.household_income,0),0)>=0  and ifnull(ifnull(ai.household_income,0)/nullif(ti.household_income,0),0)<=25 then 'labour mid income'


	when oc_cat.occupation_category='Labour' and ifnull(ifnull(ti.household_income,0)/nullif(sz.cnt,0),0)>=83953  and ifnull(ifnull(ai.household_income,0)/nullif(ti.household_income,0),0)>=0  and ifnull(ifnull(ai.household_income,0)/nullif(ti.household_income,0),0)<=25 then 'labour high income'

	when oc_cat.occupation_category='Labour' and ifnull(ifnull(ti.household_income,0)/nullif(sz.cnt,0),0)>=0  and ifnull(ifnull(ai.household_income,0)/nullif(ti.household_income,0),0)>25  and ifnull(ifnull(ai.household_income,0)/nullif(ti.household_income,0),0)<=100 then 'labour agri income' 
	
	else 'no segment' end

	) as Segment
	 from 

	(SELECT
		cs.id,sum(CEIL(LEAST((ipas.income_earned * inf.adjusted_multiple),
		(ipas.income_earned * inf.multiple * LEAST(GREATEST(inf.min_months_per_year,
		ipas.months_per_year), inf.max_months_per_year)/12)))) AS `household_income`
		FROM financialForms.family_details tfds,
		financialForms.income_per_annum ipas,
		bietl.income_frequency inf, financialForms.customer cs
		WHERE tfds.id=ipas.family_id
		AND inf.frequency = ipas.frequency
		AND inf.occupation=IF(YEAR(cs.last_edited_at)-YEAR(tfds.date_of_birth)<=5, 'Child', ipas.income_source)
		AND inf.gender=tfds.gender
		AND inf.KGFS=cs.kgfs_bank_name
		AND cs.id=tfds.customer_id
		and cs.id=?) as ti left join
	 
	 (SELECT
		cs.id,sum(CEIL(LEAST((ipas.income_earned * inf.adjusted_multiple),
		(ipas.income_earned * inf.multiple * LEAST(GREATEST(inf.min_months_per_year,
		ipas.months_per_year), inf.max_months_per_year)/12)))) AS `household_income`
		FROM financialForms.family_details tfds,
		financialForms.income_per_annum ipas,
		bietl.income_frequency inf, financialForms.customer cs
		WHERE tfds.id=ipas.family_id
		AND inf.frequency = ipas.frequency
		AND inf.occupation=IF(YEAR(cs.last_edited_at)-YEAR(tfds.date_of_birth)<=5, 'Child', ipas.income_source)
		AND inf.gender=tfds.gender
		AND inf.KGFS=cs.kgfs_bank_name
		AND ipas.income_source IN ('Goat rearing', 'Agriculture', 'Dairy', 'Fishing')
		AND cs.id=tfds.customer_id
		and cs.id=?) as ai
		on ti.id=ai.id
	 left join
	 (select oc.id,
	 (case 
	 when oc.income_source='Working Abroad' then 'Working Abroad' 
	 when oc.income_source in ('Goat rearing','Agriculture','Dairy','Fishing') then 'Agriculture'
	 when oc.income_source in ('Salaried - Govt','Salaried - Others','Retired / Pensioner') then 'Salary'
	 when oc.income_source in ('Agri Trading','Rental Income','Shop Owner','Business - Others','Driver','Small Industry','Professional') then 'Business'
	 when oc.income_source in ('Performing Arts','Labour','Migrant Labour','Unemployed','House-wife','Student') then 'Labour'
	 when oc.income_source is NULL then 'missing data'
	   end) as occupation_category from
	  
	 (SELECT
		cs.id,ipas.income_source,(CEIL(LEAST((ipas.income_earned * inf.adjusted_multiple),
		(ipas.income_earned * inf.multiple * LEAST(GREATEST(inf.min_months_per_year,
		ipas.months_per_year), inf.max_months_per_year)/12)))) AS `household_income`
		FROM financialForms.family_details tfds,
		financialForms.income_per_annum ipas,
		bietl.income_frequency inf, financialForms.customer cs
		WHERE tfds.id=ipas.family_id
		AND inf.frequency = ipas.frequency
		AND inf.occupation=IF(YEAR(cs.last_edited_at)-YEAR(tfds.date_of_birth)<=5, 'Child', ipas.income_source)
		AND inf.gender=tfds.gender
		AND inf.KGFS=cs.kgfs_bank_name
		AND cs.id=tfds.customer_id
		and cs.id=? order by household_income desc limit 1
		) oc 
	where oc.id= ?) as oc_cat 
	on ai.id=oc_cat.id 
	left join

	(select customer_id,count(*) as cnt  from financialForms.family_details where customer_id=?) as sz
	on oc_cat.id=sz.customer_id

	
	
	where  ti.id=?",array($id[0]->id,$id[0]->id,$id[0]->id,$id[0]->id,$id[0]->id,$id[0]->id));
	
	
	
	
	$result_last_edited_at=DB::connection("bietl_db")->select("select date(last_edited_at) as last_edited_at from financialForms.customer where id=?	",array($id[0]->id));
	
	$result_hh_size=DB::connection("bietl_db")->select("select count(*) as hh_size from financialForms.family_details where customer_id=?",array($id[0]->id));
	
	$result_expense=DB::connection("bietl_db")->select("select cs.id as id,sum(eps.annual_expenses * freq.multiple) as total_expense from 
								financialForms.expenditure_per_annum eps, bietl.expense_frequency freq,financialForms.customer cs   
								WHERE eps.customer_id=cs.id and freq.frequency=eps.frequency and cs.id=?",array($id[0]->id));
								
	$result_income=DB::connection("bietl_db")->select("SELECT
			cs.id,sum(CEIL(LEAST((ipas.income_earned * inf.adjusted_multiple),
			(ipas.income_earned * inf.multiple * LEAST(GREATEST(inf.min_months_per_year,
			ipas.months_per_year), inf.max_months_per_year)/12)))) AS `household_income`
			FROM financialForms.family_details tfds,
			financialForms.income_per_annum ipas,
			bietl.income_frequency inf, financialForms.customer cs
			WHERE tfds.id=ipas.family_id
			AND inf.frequency = ipas.frequency
			AND inf.occupation=IF(YEAR(cs.last_edited_at)-YEAR(tfds.date_of_birth)<=5, 'Child', ipas.income_source)
			AND inf.gender=tfds.gender
			AND inf.KGFS=cs.kgfs_bank_name
			AND cs.id=tfds.customer_id
			and cs.id=?",array($id[0]->id));
			
	$result_prime_earner =DB::connection("bietl_db")->select("select ps.family_member_first_name,ps.age,ps.household_occupation_income from (SELECT tfds.family_member_first_name, tfds.id,round(datediff(curdate(),date(tfds.date_of_birth))/365,0) as age,
	  (CEIL(LEAST((ipas.income_earned * inf.adjusted_multiple),  (ipas.income_earned * inf.multiple * LEAST(GREATEST(inf.min_months_per_year, 
	  ipas.months_per_year), inf.max_months_per_year)/12)))) AS `household_occupation_income` 
	  FROM financialForms.family_details tfds,
			financialForms.income_per_annum ipas,
			bietl.income_frequency inf, financialForms.customer cs
			WHERE tfds.id=ipas.family_id
			AND inf.frequency = ipas.frequency 
			AND inf.occupation=IF(YEAR(cs.last_edited_at)-YEAR(tfds.date_of_birth)<=5, 'Child', ipas.income_source)
			AND inf.gender=tfds.gender
			AND inf.KGFS=cs.kgfs_bank_name
			AND cs.id=tfds.customer_id
			and cs.id=? ) ps order by household_occupation_income desc limit 1",array($id[0]->id));
	
	$result_hh_comp =DB::connection("bietl_db")->select("SELECT 'Male' as Dependants,
	sum(case when (YEAR(curdate())-YEAR(tfds.date_of_birth))<18 and tfds.gender='Male' then 1 else 0 end) as dep_less_than_18,
	sum(case when (YEAR(curdate())-YEAR(tfds.date_of_birth))>27 and tfds.gender='Male' then 1 else 0 end) as dep_abv_27,
	sum(case when (YEAR(curdate())-YEAR(tfds.date_of_birth))>=18 and (YEAR(curdate())-YEAR(tfds.date_of_birth))<=27 and tfds.gender='Male' then 1 else 0 end) as dep_bet_18_27 
	
	FROM financialForms.family_details tfds, financialForms.customer cs,
	financialForms.income_per_annum ipas 
	WHERE cs.id=tfds.customer_id AND tfds.id=ipas.family_id  
	and (ipas.income_earned<=1 OR ipas.income_earned IS NULL) and cs.id=?
	
union all

SELECT 'Female' as Dependants,
	sum(case when (YEAR(curdate())-YEAR(tfds.date_of_birth))<18 and tfds.gender='Female' then 1 else 0 end) as dep_less_than_18,
	sum(case when (YEAR(curdate())-YEAR(tfds.date_of_birth))>27 and tfds.gender='Female' then 1 else 0 end) as dep_abv_27,
	sum(case when (YEAR(curdate())-YEAR(tfds.date_of_birth))>=18 and (YEAR(curdate())-YEAR(tfds.date_of_birth))<=27 and tfds.gender='Female' then 1 else 0 end) as dep_bet_18_27
	FROM financialForms.family_details tfds, financialForms.customer cs,
	financialForms.income_per_annum ipas 
	WHERE cs.id=tfds.customer_id AND tfds.id=ipas.family_id  
	and (ipas.income_earned<=1 OR ipas.income_earned IS NULL) and cs.id=?",array($id[0]->id,$id[0]->id));
	
	
	
	$result_loan_count =DB::connection("bietl_db")->select("select 'Active' As Status , 
	sum(case when apd.product like '%jlg%' and apd.principal_outstanding>0 and apd.household_id=? then 1 else 0 end) as JLG,
	sum(case when apd.product like 'MEL|Retail' and apd.principal_outstanding>0 and apd.household_id=? then 1 else 0 end) as MEL,
	sum(case when apd.product like '%Personal Loan%' and apd.principal_outstanding>0 and apd.household_id=? then 1 else 0 end)as PERSONAL,
	sum(case when apd.product  not rlike 'JLG|MEL|Retail|Personal' and apd.principal_outstanding>0 and apd.product_category='Loans' and apd.household_id=? then 1 else 0 end) as OTHERS
from bietl.`all_products_dump` apd where  apd.household_id=?
UNION ALL
	SELECT 'Closed' As Status,
	sum(case when apd.product like '%jlg%' and apd.principal_outstanding<=0 and apd.household_id=? then 1 else 0 end) as JLG,
	sum(case when apd.product like 'MEL|Retail' and apd.principal_outstanding<=0 and apd.household_id=? then 1 else 0 end) as MEL,
	sum(case when apd.product like '%Personal Loan%' and apd.principal_outstanding<=0 and apd.household_id=? then 1 else 0 end) as PERSONAL,
	sum(case when apd.product not rlike 'JLG|MEL|Retail|Personal' and apd.principal_outstanding<=0 and apd.product_category='Loans' and apd.household_id=? then 1 else 0 end) as OTHERS

	from bietl.`all_products_dump` apd where  apd.household_id=?",array($id[0]->id,$id[0]->id,$id[0]->id,$id[0]->id,$id[0]->id,$id[0]->id,$id[0]->id,$id[0]->id,$id[0]->id,$id[0]->id));
	
	$result_loan_outstanding =DB::connection("bietl_db")->select("select apd.product,apd.principal_outstanding as outstanding_amt,odm.days_overdue as overdue_days,apd.product_close_date as maturity_date
	from bietl.all_products_dump apd 
	left join  bietl.overdue_master_daily_latest_unique odm 
	on apd.product_number=odm.account_number and odm.date=curdate()-1 
	where  apd.household_id=? and apd.principal_outstanding>0
	group by apd.product_number",array($id[0]->id));


	$result_owns_shop =DB::connection("bietl_db")->select("select 
	CASE WHEN ads.customer_id IS NULL THEN 'NO'
			ELSE 'YES'
		END shop		
from 
financialForms. customer  cs
LEFT JOIN financialForms.asset_details  ads
ON  ads.customer_id = cs.id 
and ads.name_of_owned_asset='Shop' 
WHERE cs.id=?",array($id[0]->id));
	
	$result_insurance =DB::connection("bietl_db")->select("select apd.product as product, cs.first_name as customer,
	ifnull(apd.product_close_date,0) product_close_date,ifnull(datediff(apd.product_close_date,curdate()),0) as expires_in,apd.insurance_cover_amount as coverage 
	from bietl.all_products_dump apd, financialForms.customer cs where product_category='Insurance' 
	and apd.household_id=? and cs.urn_no=apd.urn order by apd.product_close_date desc limit 5;",array($id[0]->id));
	
	$result_remittance = DB::connection("bietl_db")->select("select transaction_type, transaction_amount,transaction_date,service_provider from $bi_etl.remittance_dump where household_id=? order by transaction_date desc limit 10",array($id[0]->id));

	$result_savings = DB::connection("bietl_db")->select("select transaction_date,transaction_amount from bietl.sb_account_transactions_dump where transaction_type='DEPOSIT' and household_id= ?  order by transaction_date desc limit 10",array($id[0]->id));
	
	//risk model variables
	$risk_score= 0;
	$risk_occup_cat_score=DB::connection("bietl_db")->select("
	select (case 
	when cat.occupation_category='Working Abroad' then 34
	when cat.occupation_category='Agriculture' then 4
	when cat.occupation_category='Business' then 4
	when cat.occupation_category='Salary' then 20
	when cat.occupation_category='Labour' or cat.occupation_category is NULL then 0 else 0 end
	) as occupation_category_score
	from
	(select oc.id,
	 (case 
	 when oc.income_source='Working Abroad' then 'Working Abroad' 
	 when oc.income_source in ('Goat rearing','Agriculture','Dairy','Fishing') then 'Agriculture'
	 when oc.income_source in ('Salaried - Govt','Salaried - Others','Retired / Pensioner') then 'Salary'
	 when oc.income_source in ('Agri Trading','Rental Income','Shop Owner','Business - Others','Driver','Small Industry','Professional') then 'Business'
	 when oc.income_source in ('Performing Arts','Labour','Migrant Labour','Unemployed','House-wife','Student') then 'Labour' else 'Labour' end) as occupation_category from
	 
	 (SELECT
		cs.id,ipas.income_source,(CEIL(LEAST((ipas.income_earned * inf.adjusted_multiple),
		(ipas.income_earned * inf.multiple * LEAST(GREATEST(inf.min_months_per_year,
		ipas.months_per_year), inf.max_months_per_year)/12)))) AS `household_income`
		FROM financialForms.family_details tfds,
		financialForms.income_per_annum ipas,
		bietl.income_frequency inf, financialForms.customer cs
		WHERE tfds.id=ipas.family_id
		AND inf.frequency = ipas.frequency
		AND inf.occupation=IF(YEAR(cs.last_edited_at)-YEAR(tfds.date_of_birth)<=5, 'Child', ipas.income_source)
		AND inf.gender=tfds.gender
		AND inf.KGFS=cs.kgfs_bank_name
		AND cs.id=tfds.customer_id
		and cs.id=? order by household_income desc limit 1) oc where oc.id=?) cat where cat.id=?",array($id[0]->id,$id[0]->id,$id[0]->id));
	
	
	
	$risk_score += (count($risk_occup_cat_score) > 0 && isset($risk_occup_cat_score[0]->occupation_category_score)) ? $risk_occup_cat_score[0]->occupation_category_score : 0; 
	
	$risk_ed_stat_score=DB::connection("bietl_db")->select("select (case 
	when ed.education_status='1st - 5th' or ed.education_status='6th - 8th'  then 0
	else 6 end) as edu_of_primary_income_earner_score 
	 from 
	(SELECT tfds.education_status,
	  cs.id, ipas.income_source, 
	  SUM(CEIL(LEAST((ipas.income_earned * inf.adjusted_multiple),  (ipas.income_earned * inf.multiple * LEAST(GREATEST(inf.min_months_per_year, 
	  ipas.months_per_year), inf.max_months_per_year)/12)))) AS `household_occupation_income` 
	  FROM financialForms.family_details tfds,
		financialForms.income_per_annum ipas,
		bietl.income_frequency inf, financialForms.customer cs
		WHERE tfds.id=ipas.family_id
		AND inf.frequency = ipas.frequency
		AND inf.occupation=IF(YEAR(cs.last_edited_at)-YEAR(tfds.date_of_birth)<=5, 'Child', ipas.income_source)
		AND inf.gender=tfds.gender
		AND inf.KGFS=cs.kgfs_bank_name
		AND cs.id=tfds.customer_id
		and cs.id=?) ed where ed.id=?",array($id[0]->id,$id[0]->id));
	$risk_score += (count($risk_ed_stat_score) > 0 && isset($risk_ed_stat_score[0]->edu_of_primary_income_earner_score)) ? $risk_ed_stat_score[0]->edu_of_primary_income_earner_score : 0; 
	
	$risk_net_income_per_member_score=DB::connection("bietl_db")->select("select (case 
	when  net.net_income_per_member>40000 then 14
	when  net.net_income_per_member>20000 and net.net_income_per_member<=40000 then 8
	when  net.net_income_per_member<20000 then 0 else 0 end) as net_income_per_member_score
	from
	(select ti.customer_id, ifnull((ti.household_income-tex.total_expense)/nullif(sz.hh_size,0),0) as net_income_per_member from 
	(SELECT tfds.customer_id,cs.id,
	 SUM(CEIL(LEAST((ipas.income_earned * inf.adjusted_multiple),  (ipas.income_earned * inf.multiple * LEAST(GREATEST(inf.min_months_per_year, 
	 ipas.months_per_year), inf.max_months_per_year)/12)))) AS `household_income` 
	 FROM financialForms.family_details tfds,
		financialForms.income_per_annum ipas,
		bietl.income_frequency inf, financialForms.customer cs
		WHERE tfds.id=ipas.family_id
		AND inf.frequency = ipas.frequency
		AND inf.occupation=IF(YEAR(cs.last_edited_at)-YEAR(tfds.date_of_birth)<=5, 'Child', ipas.income_source)
		AND inf.gender=tfds.gender
		AND inf.KGFS=cs.kgfs_bank_name
		AND cs.id=tfds.customer_id
		and cs.id=?) ti,
	 
	 
	(select customer_id,count(*) as hh_size from financialForms.family_details where customer_id=?) sz,


	(select cs.id as id,sum(eps.annual_expenses * freq.multiple) as total_expense from 
financialForms.expenditure_per_annum eps, bietl.expense_frequency freq,financialForms.customer cs   
WHERE eps.customer_id=cs.id and freq.frequency=eps.frequency and cs.id=?) tex

	where ti.customer_id=sz.customer_id and sz.customer_id=tex.id and ti.customer_id=?) net;",array($id[0]->id,$id[0]->id,$id[0]->id,$id[0]->id));
	$risk_score += (count($risk_net_income_per_member_score) > 0 && isset($risk_net_income_per_member_score[0]->net_income_per_member_score)) ? $risk_net_income_per_member_score[0]->net_income_per_member_score : 0; 
	
	$risk_all_loans_active_score=DB::connection("bietl_db")->select("select (case
	when lc.count_loans_active>3 then 0
	when lc.count_loans_active>2 and lc.count_loans_active<=3 then 20
	when lc.count_loans_active=2 then 23
	else 23 end
	) as all_loans_active_score from
	(SELECT apd.household_id,count(*) as count_loans_active 
	FROM bietl.`all_products_dump` apd 
	where apd.product_category='Loans' and apd.principal_outstanding>0 and apd.household_id=?) lc where lc.household_id=?",array($id[0]->id,$id[0]->id));
	
	$risk_score += (count($risk_all_loans_active_score) > 0 && isset($risk_all_loans_active_score[0]->all_loans_active_score)) ? $risk_all_loans_active_score[0]->all_loans_active_score : 0;
	
	$risk_all_loans_closed_score=DB::connection("bietl_db")->select("select (case
	when lc.count_loans_closed>7 then 11
	when lc.count_loans_closed>3 and lc.count_loans_closed<=7 then 7
	when lc.count_loans_closed>1 and lc.count_loans_closed<=3 then 0
	else 11 end
	) as all_loans_closed_score from
	(SELECT apd.customer_id,count(*) as count_loans_closed 
	FROM bietl.`all_products_dump` apd 
	where apd.product_category='Loans' and apd.principal_outstanding<=0 and apd.customer_id=?) lc where lc.customer_id=?",array($id[0]->id,$id[0]->id));
	
	$risk_score += (count($risk_all_loans_closed_score) > 0 && isset($risk_all_loans_closed_score[0]->all_loans_closed_score)) ? $risk_all_loans_closed_score[0]->all_loans_closed_score : 0;
	
	$risk_other_mfi=DB::connection("bietl_db")->select("select (case 
	when max(hm.NO_OF_OTHER_MFIS)>0 then 11
	when max(hm.NO_OF_OTHER_MFIS)<=0  then 0 else 0	
	end) as o_mfi_cnt

	from bietl.highmark_latest hm,financialForms.customer cs 


	where hm.REQUEST_MBR_ID=cs.urn_no and cs.id=?",array($id[0]->id));
	
	$risk_score += (count($risk_other_mfi) > 0 && isset($risk_other_mfi[0]->o_mfi_cnt)) ? $risk_other_mfi[0]->o_mfi_cnt : 0;
	
	$risk_delinquency_score=DB::connection("bietl_db")->select("select (case 
	when max(hm.MAX_WORST_DELEQUENCY)>3 then 1
	when max(hm.MAX_WORST_DELEQUENCY)>=0 and max(hm.MAX_WORST_DELEQUENCY)<=3 then 2
	when max(hm.MAX_WORST_DELEQUENCY)<0  then 0  else 0
	end) as o_max_worst_deliquent_score

	from bietl.highmark_latest hm,financialForms.customer cs 


	where hm.REQUEST_MBR_ID=cs.urn_no and cs.id=?",array($id[0]->id));
	
	$risk_score += (count($risk_delinquency_score) > 0 && isset($risk_delinquency_score[0]->o_max_worst_deliquent_score)) ? $risk_delinquency_score[0]->o_max_worst_deliquent_score : 0;
	
	$risk_occupation_count=DB::connection("bietl_db")->select("select (case 
	when oc.occupation_count>3 then 8
	when oc.occupation_count=3 then 8
	when oc.occupation_count=2 then 5
	when oc.occupation_count>-1 or oc.occupation_count<=1  then 0
	when oc.occupation_count<=-1 then 8 end) as occupation_count_score 
	 from 

	(SELECT cs.id ,count(*) as occupation_count
	 FROM financialForms.family_details tfds,
		financialForms.income_per_annum ipas,
		bietl.income_frequency inf, financialForms.customer cs
		WHERE tfds.id=ipas.family_id
		AND inf.frequency = ipas.frequency
		AND inf.occupation=IF(YEAR(cs.last_edited_at)-YEAR(tfds.date_of_birth)<=5, 'Child', ipas.income_source)
		AND inf.gender=tfds.gender
		AND inf.KGFS=cs.kgfs_bank_name
		AND cs.id=tfds.customer_id
		and cs.id=?) oc where oc.id=?",array($id[0]->id,$id[0]->id));
	 
	 $risk_score += (count($risk_occupation_count) > 0 && isset($risk_occupation_count[0]->occupation_count_score)) ? $risk_occupation_count[0]->occupation_count_score : 0;
	
	$risk_age_borrower=DB::connection("bietl_db")->select("select (case when (curdate()-date_of_birth)>52 then 24
	when (curdate()-date_of_birth)>44 and (curdate()-date_of_birth)<=52 then 22
	when (curdate()-date_of_birth)>30 and (curdate()-date_of_birth)<=44 then 16
	when (curdate()-date_of_birth)<30 then 0
	end ) as age_borrower_score
	from financialForms.customer cs where id=?",array($query['cid']));
	 
	 $risk_score += (count($risk_age_borrower) > 0 && isset($risk_age_borrower[0]->age_borrower_score)) ? $risk_age_borrower[0]->age_borrower_score : 0;
	 
	
	
	//urn_no
	$result_urn =DB::connection("bietl_db")->select("select urn_no from financialForms.customer where id=?",array($query['cid']));
	$cust_name=DB::select("select concat(first_name,' ',last_name) as name from financialForms.customer where id=?",array($query['cid']));
	//kgfs name
	$kgfs_name=DB::select("select kgfs_name from financialForms.customer where id=?",array($query['cid']));

	// risk score calculation
	$denom=192;
	$multiplier=1000;
	$total_risk=$risk_score/$denom;
	$result_total_risk=$total_risk*$multiplier;
	
	
	//google link
	$glink="https://docs.google.com/forms/d/e/1FAIpQLSc-X_XvO1Z0XRjkkui5x-zYx9-6-MGzwn-zrb_l_0JjxZvpZQ/viewform?entry.326955045=";
	//https://docs.google.com/forms/d/e/1FAIpQLSc-X_XvO1Z0XRjkkui5x-zYx9-6-MGzwn-zrb_l_0JjxZvpZQ/viewform?entry.326955045=cid&entry.1591633300=segment
	//https://docs.google.com/forms/d/e/1FAIpQLSc-X_XvO1Z0XRjkkui5x-zYx9-6-MGzwn-zrb_l_0JjxZvpZQ/viewform?usp=pp_url&entry.326955045=cid&entry.962142054=urn&entry.1591633300=segment
	
	$cid=$id[0]->id;
	$urn_par="&entry.962142054=";
	$urn=$result_urn[0]->urn_no;
	$segment_par="&entry.1591633300=";
	$segment_val=$result_segment[0]->Segment;
	$customer_name_par="&entry.952945995=";
	$customer_name_f=$cust_name[0]->name;
	$branch_par="&entry.902300270=";
	$branch_1=$kgfs_name[0]->kgfs_name;
	
	$form_filled=DB::select("select  (case when ? in (select household_id from bietl.cgap_pilot_survey) then 'already done' else 'yet' end) as status", array($id[0]->id));

	
	$finurl=($form_filled[0]->status=='yet')?$glink.$cid.$urn_par.$urn.$customer_name_par.$customer_name_f.$branch_par.$branch_1.$segment_par.$segment_val:"Already fllled";
	
	
	// Eligibility calculation
	
	$age=0;
	if (count($result_prime_earner)>0){
		if($result_prime_earner[0]->age>=21 && $result_prime_earner[0]->age<=60){
			$age=1;
		}
	}
	
	
	//credit history
	$result_credit_hist=DB::connection("bietl_db")->select("select (case
	when lc.count_loans_closed>=1 then 1
	else 0 end
	) as cred_hist from
	(SELECT apd.household_id,count(*) as count_loans_closed 
	FROM bietl.`all_products_dump` apd 
	where apd.product_category='Loans' and apd.product_close_date<curdate() and apd.household_id=?) lc where lc.household_id=?",array($id[0]->id,$id[0]->id));
	
	
	
	$cred_hist=0;
	$cred_hist=(count($result_credit_hist)>0 && $result_credit_hist[0]->cred_hist && $result_credit_hist[0]->cred_hist==1) ? 1 : 0;
	
	//overdue_days
	//$result_od_days=DB::connection("bietl_db")->select("select (days_overdue) from bietl.overdue_master_daily where customer_id=? and days_overdue is not null order by date desc limit 1",array($id[0]->id));
	
	//$days_overdue=0;
	//if(count($result_od_days)>0 && isset($result_od_days[0]->days_overdue)){
		
	//	if($result_od_days[0]->days_overdue<30){$days_overdue=1;
			
	//}}
	
	//owns_shop
	$shop=(count($result_owns_shop)>0 && $result_owns_shop[0]->shop && $result_owns_shop[0]->shop=="YES") ? 1 : 0;
	
	
	
	
	//owns a house
	$result_owns_house =DB::connection("bietl_db")->select("select 
	CASE WHEN ads.customer_id IS NULL THEN 'NO'
			ELSE 'YES'
		END house		
from 
financialForms. customer  cs
LEFT JOIN financialForms.asset_details  ads
ON  ads.customer_id = cs.id 
and ads.name_of_owned_asset='House' 
WHERE cs.id=?",array($id[0]->id));

	$house=(count($result_owns_house)>0 && $result_owns_house[0]->house && $result_owns_house[0]->house=="YES") ? 1 : 0;
	
	
	
	//current_loan_exposure
	
	//$current_loan_exposure=DB::connection("bietl_db")->select("select sum(principal_outstanding) as total_exposure  from bietl.overdue_master_daily where customer_id=? and date=curdate()-1;",array($id[0]->//id));
	//$exposure=0;
	//if(count($current_loan_exposure)>0 && isset($current_loan_exposure[0]->total_exposure)){
		
	//	if($current_loan_exposure[0]->total_exposure<75000){$exposure=1;
			
	//}}
	
	$mel_eligibility=0;
	if($age==1  && ($shop==1||$house==1)   && $result_total_risk>580){
		$mel_eligibility="yes";
	}
	else{$mel_eligibility="no";}
	

	//personal loan eligibility
	$personal_eligibility=0;
	if($age==1 && $cred_hist==1 && $house==1   && $result_total_risk>580){
		$personal_eligibility="yes";
	}
	else{$personal_eligibility="no";}
	
	
	//IP address
	
	if (!empty($_SERVER['HTTP_CLIENT_IP']))   
	{
		$ip_address = $_SERVER['HTTP_CLIENT_IP'];
	}
	//whether ip is from proxy
	elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))  
	{
		$ip_address = $_SERVER['HTTP_X_FORWARDED_FOR'];
	}
	//whether ip is from remote address
	else
	{
		$ip_address = $_SERVER['REMOTE_ADDR'];
	}
	
	
	function getOSBrowswer() { 

		$user_agent     =   $_SERVER['HTTP_USER_AGENT'];
	
		$os_platform    =   "Unknown OS Platform";
	
		$os_array       =   array(
								'/windows nt 6.2/i'     =>  'Windows 8',
								'/windows nt 6.1/i'     =>  'Windows 7',
								'/windows nt 6.0/i'     =>  'Windows Vista',
								'/windows nt 5.2/i'     =>  'Windows Server 2003/XP x64',
								'/windows nt 5.1/i'     =>  'Windows XP',
								'/windows xp/i'         =>  'Windows XP',
								'/windows nt 5.0/i'     =>  'Windows 2000',
								'/windows me/i'         =>  'Windows ME',
								'/win98/i'              =>  'Windows 98',
								'/win95/i'              =>  'Windows 95',
								'/win16/i'              =>  'Windows 3.11',
								'/macintosh|mac os x/i' =>  'Mac OS X',
								'/mac_powerpc/i'        =>  'Mac OS 9',
								'/linux/i'              =>  'Linux',
								'/ubuntu/i'             =>  'Ubuntu',
								'/iphone/i'             =>  'iPhone',
								'/ipod/i'               =>  'iPod',
								'/ipad/i'               =>  'iPad',
								'/android/i'            =>  'Android',
								'/blackberry/i'         =>  'BlackBerry',
								'/webos/i'              =>  'Mobile'
							);
	
		foreach ($os_array as $regex => $value) { 
	
			if (preg_match($regex, $user_agent)) {
				$os_platform    =   $value;
			}
	
		}   
	
	
	
	
		$browser        =   "Unknown Browser";
	
		$browser_array  =   array(
								'/msie/i'       =>  'MSIE',
								'/firefox/i'    =>  'Firefox',
								'/safari/i'     =>  'Safari',
								'/chrome/i'     =>  'Chrome',
								'/opera/i'      =>  'Opera',
								'/netscape/i'   =>  'Netscape',
								'/maxthon/i'    =>  'Maxthon',
								'/konqueror/i'  =>  'Konqueror',
								'/mobile/i'     =>  'Mobile'
							);
	
		foreach ($browser_array as $regex => $value) { 
	
			if (preg_match($regex, $user_agent)) {
				$browser    =   $value;
			}
	
		}
	
		// finally get the correct version number
		$known = array('Version', $browser, 'other');
		$pattern = '#(?<browser>' . join('|', $known) .
		')[/ ]+(?<version>[0-9.|a-zA-Z.]*)#';
		if (!preg_match_all($pattern, $user_agent, $matches)) {
			// we have no matching number just continue
		}
		
		// see how many we have
		$i = count($matches['browser']);
		if ($i != 1) {
			//we will have two since we are not using 'other' argument yet
			//see if version is before or after the name
			if (strripos($user_agent,"Version") < strripos($user_agent,$browser)){
				$version= $matches['version'][0];
			}
			else {
				$version= $matches['version'][1];
			}
		}
		else {
			$version= $matches['version'][0];
		}
		
		// check if we have a number
		if ($version==null || $version=="") {$version="?";}
	
		return $os_platform.' '.$browser.' '.$version;
	}


	$browser = getOSBrowswer();
	

    if(isset($_SERVER['HTTP_REFERER'])) {$previous_page = $_SERVER['HTTP_REFERER'];} else {$previous_page='';}

	
 //Log creation
DB::connection("bietl_db")->insert("INSERT INTO bietl.`fwr_page_log` (`server`, `unique_click_id`, `session_id`, `customer_id`, `household_id`, `user_id`, 
`same_branch_user`, `ip_address`, `browser`, `referred_from`, `page`, `page_id`, `start_time`, 
`end_time`, `view_time`, `time_stamp`) 

SELECT 
		'live' as server ,
		'' as unique_click_id,
		'' as session_id,
		 ? as customer_id,
		 ? as household_id,
		 '' as user_id,
		 '' as same_branch_user,
		 ? as ip_address,
		 ? as browser,
		 ? as referred_from,
		 'segmentation pilot' as page,
		 '' as page_id,
		 now() as start_time,
		 now() as end_time,
		 0 as view_time,
		 now()  as time_stamp",array($query['cid'],$id[0]->id,$ip_address,$browser,$previous_page));
 
	
	//result aggregation
	$result = [
		'Segment' => [
			'Segment'=>(isset($result_segment) && count($result_segment)>0 && isset($result_segment[0]->Segment))? $result_segment[0]->Segment." / URN: ".$urn:"no data",
			'Last_edited_date'=>(isset($result_last_edited_at) && count($result_last_edited_at)>0 && isset($result_last_edited_at[0]->last_edited_at))? $result_last_edited_at[0]->last_edited_at:"no data"
			
			],
			'Household_Composition' => [
				'Primary_income_earner'=>(isset($result_prime_earner) && count($result_prime_earner)>0 && isset($result_prime_earner[0]->family_member_first_name)) ? $result_prime_earner[0]->family_member_first_name: "no data",
				'Size_of_household'=>(isset($result_hh_size) && count($result_hh_size)>0 && isset($result_hh_size[0]->hh_size)) ? (int)$result_hh_size[0]->hh_size: 0,
				'Primary_earner_age'=>(isset($result_prime_earner) && count($result_prime_earner)>0 && isset($result_prime_earner[0]->age)) ? $result_prime_earner[0]->age: 0,
				'Total_expenses'=>(isset($result_expense) && count($result_expense)>0 && isset($result_expense[0]->total_expense)) ? (int)$result_expense[0]->total_expense: 0,
				'Total_income'=>(isset($result_income) && count($result_income)>0 && isset($result_income[0]->household_income)) ? (int)$result_income[0]->household_income : 0,
				'dependants'=>$result_hh_comp
			],
			'Loans' => [
				'Loan_count'=>$result_loan_count,
				'Outstanding_amount'=>$result_loan_outstanding,
				'Credit_score'=>$result_total_risk,
				'Owns_a_shop'=>(isset($result_owns_shop) && count($result_owns_shop)>0 && isset($result_owns_shop[0]->shop)) ? $result_owns_shop[0]->shop:"no data"
			],
			'Eligibility_Criteria'=>[
				['product'=>"MEL",'eligibility'=>$mel_eligibility],
				['product'=>"Personal",'eligibility'=>$personal_eligibility]
			],
			'Insurance' => $result_insurance,
			'savings' => $result_savings,
			'remittance' => $result_remittance,
			'google_link'=>$finurl
	];

	// create json
	get_response_obj()->json($result);

} catch (\Exception $e){
	header('Content-Type: text/html'); 
	throw $e;
}
