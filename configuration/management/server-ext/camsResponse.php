<?php
    use App\Responses\IRFResponse;
	include_once("bootload.php");
	use Illuminate\Database\Capsule\Manager as DB;

    $result = $_POST["result"];
    $resultArray= explode('|', $result);
    $ekyc =  $resultArray[0];
    $pekrn = $resultArray[1];
    $url = $_GET['url'];
    $customer_id = $GET['customer_id'];
    $status = false;
    if ($ekyc === 'Y') {
        $affected = DB::update('update customer set is_ekyc_done = ?, pekrn = ? where id = ?', ['true', $pekrn, $customer_id]);
        $status = true;
        $statusHead = "eKYC is completed successfullly";
        $statusMessage = "Proceed with mutual fund application";
    } else if ($ekyc ==='N' && substr($resultArray[2], 0, 2) ==='KS') {
        $status = true;
        $statusHead =  'eKYC Aleady done.';
        $statusMessage = $resultArray[3];
    } else {
        $status = false;
        $statusHead =  "eKYC is Failed";
        $statusMessage = $resultArray[3];
	}
	header("Content-Type: text/html");
?><html lang="en">
<head>
	<title>Perdix - CAMS</title>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link href="https://fonts.googleapis.com/css?family=Montserrat:700|Sunflower:300" rel="stylesheet">
	<style type="text/css">
        body * {
            font-family: 'Sunflower', sans-serif;
        }
		.content {
			margin: 120px auto;
			width: 600px;
			text-align: center;
		}
		h1 {
			font-family: 'Montserrat', sans-serif;
		}
		.footer {
			background-image: url('https://www.dvara.com/solutions/wp-content/uploads/2018/03/dvara_solutions.png');
			width: 125px;
			height: 91px;
			position: fixed;
			bottom: 20px;
			right: 20px;
			opacity: .6;
		}
	</style>
</head>
<body>
	<div class="content">
		<h1><?php echo $statusHead ?></h1>
		<div class="message"><?php echo $statusMessage ?></div>
		<br>
		<br><?php if ($status) { ?>
		<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Green_check.svg/240px-Green_check.svg.png" width="100">
        <?php } else { ?><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/White_X_in_red_background.svg/240px-White_X_in_red_background.svg.png" width="100">
        <?php } ?><br>
		<br>
		<br>
		<br>
		<br>
		<br>
		<div>
			Continue with MutualFund Process
		</div>
	</div>
	<div class="footer"></div>
</body>
</html>