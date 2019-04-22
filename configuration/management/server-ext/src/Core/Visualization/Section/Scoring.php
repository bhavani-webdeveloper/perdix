<?php

namespace App\Core\Visualization\Section;

use Illuminate\Database\Capsule\Manager as DB;

class Scoring extends AbstractVisualizationSection
{
    protected $dataSourceType;
    protected $dataSource;
    public $sectionName;
    protected $dashboardName;
    public $parent;
    protected $max_sc_calc_id;
    protected $score_name;

    public function __construct($section, $requestParameters)
    {
        parent::__construct($section, $requestParameters);
        $this->dataSourceType = $section['data_source_type'];
        $this->dataSource = $section['data_source'];
        $this->sectionName = $section['section_name'];
        $this->dashboardName = $section['dashboard_name'];
        $this->parent = $section['parent_section_name'];
    }

    protected function processValidation()
    {
        if ($this->dataSourceType == null && empty($this->dataSourceType)) {
            throw new \Exception('Data source type is not available');
        }
    }

    private function getData()
    {

        $scoreArr = [
            'SubscoreDetails' => [],
            'SubscoreScores' => [],
        ];
        $scoreArr['ScoreCalculationDetails'] = DB::select("select id, OverAllWeightedScore, OverAllPassStatus, ScoreName, CustomerId, IFNULL(apiVersion,'1') as apiVersion from sc_calculation where id = $this->max_sc_calc_id");
        $scoringAPIVersion = $scoreArr['ScoreCalculationDetails'][0]->apiVersion;

        if ($scoringAPIVersion == "2") {
            $subscoreDetailsSQL = DB::select("
			SELECT
			    CONCAT(ROUND(SUM(sci.WeightedScore) /
							SUM(sci.MaxWeightedScore) *
							MAX(ss.SubscoreWeightage), 2),'/', MAX(ss.SubscoreWeightage))AS Score,
				ss.SubscoreName As subscore_name
			FROM
				score_parameters p
				LEFT JOIN score_subscore ss ON (p.subscoreid = ss.id and p.Status = 'ACTIVE' and ss.Status = 'ACTIVE')
				LEFT JOIN sc_calculation_inputs sci ON (sci.ParameterName = p.ParameterName)
				LEFT JOIN sc_calculation sc ON (sci.score_calc_id = sc.id and sc.ScoreName = ss.ScoreName)
			WHERE sc.id = $this->max_sc_calc_id
			GROUP BY ss.SubscoreName");
        } else {
            $subscoreDetailsSQL = DB::select("
			SELECT
			    CONCAT(ROUND(SUM(ci.WeightedScore) /
						SUM(ci.MaxWeightedScore) *
						MAX(p.subscore_weightage), 2),'/', MAX(p.subscore_weightage)) as Score,
				ci.subscore_name
			FROM
				sc_calculation_inputs ci
				LEFT JOIN sc_parameters p ON (ci.ParameterName = p.ParameterName)
			WHERE ci.score_calc_id = $this->max_sc_calc_id and p.ScoreName in ('$this->score_name')
			AND IFNULL(ci.subscore_name,'') <> ''
			GROUP BY ci.subscore_name");
        }
        if (count($subscoreDetailsSQL) > 0) {
            foreach ($subscoreDetailsSQL as $subscore) {
                $scoreArr['SubscoreScores'][$subscore->subscore_name] = $subscore->Score;
            }
        } else {
            throw new \Exception('No subScore Name and Score Found in database');
        }
        if ($scoringAPIVersion == "2") {
            $scoringDetailsSQL = DB::select("
            SELECT
                sc.OverallPassStatus,
                sc.AccountNumber,
                sc.ApplicationId,
                sc.CustomerId,
                sc.OveralApprovers,
                sc.OverallPassStatus,
                sc.OverallPassValue,
                sc.OverallWeightedScore,
                sc.ScoreMagnitude,
                sc.ScoreName,
                pt.isIndividualScore      AS `IsIndividualScore`,
                sci.applicant_customer_id AS `IndividualCustomerId`,
                c.first_name              AS `CustomerName`,
                pt.relation               AS `LoanRelation`,
                pt.SubscoreName           AS `SubscoreName`,
                pt.ParameterDisplayName   AS `Parameter`,
                sci.UserInput             AS `Actual Value`,
                (0.0 + sci.ParamterScore) AS `ParameterScore`,
                sci.color_english,
                sci.color_hexadecimal
            FROM (SELECT
                            p.ParameterName,
                            pm.ParameterDisplayName,
                            ss.SubscoreName,
                            ss.isIndividualScore,
                            lcr.customer_id,
                            lcr.relation
                        FROM
                            score_parameters p
                            LEFT JOIN score_subscore ss ON (p.subscoreid = ss.id and ss.Status = 'ACTIVE')
                            LEFT JOIN score_parameters_master pm ON (p.ParameterName = pm.ParameterName and pm.Status = 'ACTIVE' )
                            LEFT JOIN loan_customer_relation lcr ON (ss.isIndividualScore = 1 AND lcr.loan_id = (SELECT sc.ApplicationId
                                                                                                                            FROM sc_calculation sc
                                                                                                                            WHERE sc.id = $this->max_sc_calc_id))
                        WHERE ss.ScoreName = '$this->score_name') pt
                LEFT JOIN sc_calculation_inputs sci
                    ON (sci.ParameterName = pt.ParameterName AND sci.subscore_name = pt.SubscoreName AND sci.score_calc_id = $this->max_sc_calc_id AND
                            (sci.applicant_customer_id = pt.customer_id OR pt.customer_id IS NULL))
                LEFT JOIN sc_calculation sc ON (sci.score_calc_id = sc.id)
                LEFT JOIN customer c ON (c.id = pt.customer_id)
            ");

        } else {
            /** Legacy Scoring Version */
            $scoringDetailsSQL = DB::select("SELECT
                sc.OverallPassStatus,
                sc.AccountNumber,
                sc.ApplicationId,
                sc.CustomerId,
                sc.OveralApprovers,
                sc.OverallPassStatus,
                sc.OverallPassValue,
                sc.OverallWeightedScore,
                sc.ScoreMagnitude,
                sc.ScoreName,
                sci.applicant_customer_id as `IndividualCustomerId`,
                c.first_name as `CustomerName`,
                lcr.relation as `LoanRelation`,
                p.subscore_name as `SubscoreName`,
                p.ParameterDisplayName as `Parameter`,
                sci.UserInput as `Actual Value`,
                (0.0+sci.ParamterScore) AS `ParameterScore`,
                sci.color_english,
                sci.color_hexadecimal
            FROM sc_calculation_inputs sci
                LEFT JOIN sc_calculation sc ON (sc.id = sci.score_calc_id)
                LEFT JOIN sc_parameters p on (p.ParameterName = sci.ParameterName)
                LEFT JOIN loan_customer_relation lcr on (lcr.customer_id = sci.applicant_customer_id and lcr.loan_id=sc.ApplicationId)
                LEFT JOIN customer c on (c.id = lcr.customer_id)
            WHERE sc.id = $this->max_sc_calc_id  and IFNULL(p.subscore_name,'') <> '' AND p.ScoreName IN ('$this->score_name')
            ORDER BY lcr.relation");
        }
        if (count($scoringDetailsSQL) > 0) {
            $scoreSummary = null;
            $CustomerIds = [];
            foreach ($scoringDetailsSQL as $scoringDetails) {
                $subScoreName = $scoringDetails->SubscoreName;

                if (!isset($scoreArr['SubscoreDetails'][$subScoreName])) {
                    $scoreArr['SubscoreDetails'][$subScoreName] = [];
                }

                $subscoreArr = &$scoreArr['SubscoreDetails'][$subScoreName];

                if (($subScoreName == 'ManagementScore' && $scoringAPIVersion == "1") ||
                    ($scoringAPIVersion == "2" && $output['IsIndividualScore'] === 1)) {
                    $subscoreArr['__isIndividualScore'] = "YES";
                    if (!isset($subscoreArr[$scoringDetails->IndividualCustomerId])) {
                        $subscoreArr[$scoringDetails->IndividualCustomerId] = [
                            'CustomerDetails' => [
                                'Name' => $scoringDetails->CustomerName,
                                'Relation' => $scoringDetails->LoanRelation,
                            ],
                            'data' => [],
                        ];
                        $CustomerIds[] = $scoringDetails->IndividualCustomerId;
                    }
                    if (!isset($subscoreArr['CustomerIds'])) {
                        $subscoreArr['CustomerIds'] = [];
                    }

                    if (!in_array($scoringDetails->IndividualCustomerId, $subscoreArr['CustomerIds'])) {
                        $subscoreArr['CustomerIds'][] = $scoringDetails->IndividualCustomerId;
                    }

                    $subscoreArr[$scoringDetails->IndividualCustomerId]['data'][] = $scoringDetails;
                } else {
                    $subscoreArr[] = $scoringDetails;
                }
            }
        } else {
            throw new \Exception('No Scoring Datails Found in database');
        }
        return $scoreArr;
    }

    public function processor()
    {
        $this->processValidation();
        $this->process();
        // $this->max_sc_calc_id = 10562;
        $this->max_sc_calc_id = $this->data[0]->max_id;
        $this->score_name = $this->data[0]->score_name;
        $this->data = $this->getData();

    }
}
?>