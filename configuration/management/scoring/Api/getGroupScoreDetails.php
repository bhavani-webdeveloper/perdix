<?php
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

    include_once('../includes/db.php');
    include_once('../includes/ConfigureDbs.php');

    $error_log = "";

    $ScoreName = $_GET['ScoreName'];
    $GroupId = $_GET['GroupId'];
    $isScoringOptimizationEnabled = isset($_GET['isScoringOptimizationEnabled']) ? $_GET['isScoringOptimizationEnabled'] : false;
    echo $loanQuery = "SELECT jad.loan_id FROM $perdix_db.jlg_groups jgr JOIN $perdix_db.jlg_account_details jad
    ON jgr.group_code = jad.group_code  WHERE jgr.id = ". $GroupId;
    try {
        $db = ConnectDb();
        $LoanParams = $db->prepare($loanQuery);
        $LoanParams->execute();
        $LoanDetails = $LoanParams->fetchAll(PDO::FETCH_ASSOC);
        $db = null;
        echo "<pre>";
        print_r($LoanDetails);
        echo json_encode($LoanDetails);
        $domain = $_SERVER['HTTP_HOST'];
        $prefix = isset($_SERVER['HTTPS']) ? 'https://' : 'http://';
        if(count($LoanDetails) > 0) {
            foreach($LoanDetails as $SingleLoanData) {
                //call getScoreDetails.php with loanId
                $LoanUrl = $prefix . $domain . "/management/scoring/Api/getScoreDetails.php?LoanId=". $SingleLoanData['loan_id'] ."&ScoreName=". $ScoreName . "&isScoringOptimizationEnabled=". $isScoringOptimizationEnabled;
                $curl= curl_init(); 
                curl_setopt($curl,CURLOPT_URL,$LoanUrl);
                curl_setopt($curl,CURLOPT_RETURNTRANSFER,true);
                curl_setopt($curl,CURLOPT_HEADER, false); 
                $response=curl_exec($curl);
                curl_close($curl);
                return $response;                
            }
        } else {
            exit();
        }
    } catch (PDOException $e) {
       // $error_log['loanQuery'] = $e->getMessage();
        goto EndExecution;
    }
    EndExecution:
    print_r($error_log);
}
?>