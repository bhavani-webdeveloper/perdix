<?php
    use App\Responses\IRFResponse;
    include_once("bootload.php");
    use Illuminate\Database\Capsule\Manager as DB;

    $base = '//'.$_SERVER['HTTP_HOST'].dirname($_SERVER['PHP_SELF']);
    $id = $_GET['id'];
    if (!isset($id) &&empty($id)) {
        $max_id = DB::table('email_request')->max('id');
        header("Location: $base/serverError.php?id=$max_id");
        die();
    }
    header("Content-Type: text/html");
    $error = DB::table('email_request')->where('id', $id)->first();
    $file = DB::table('file_info')->where('file_id', $error->path)->first();
    $content = file_get_contents($file->path);
    $previous = $base.'/serverError.php?id='.($id-1);
    $next = $base.'/serverError.php?id='.($id+1);
?><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <title>Perdix Server Error</title>
    <style>
        body {
            font-family: 'Open Sans', sans-serif;
            padding: 15px;
        }
        .subject {
            padding-top: 12px;
        }
        .request-time {
            font-size: 30px;
        }
        .content {
            margin-top: 20px;
            border-top: 1px dashed;
            padding-top: 6px;
        }
        span.pull-right>span {
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div>
        <a class="btn btn-success" href="<?= $previous ?>">Previous</a>
        &nbsp;&nbsp;
        <a class="btn btn-info" href="<?= $next ?>">Next</a>
        <div class="request-time pull-right"><?= $error->request_time ?></div>
    </div>
    <div class="subject"><?= $error->subject ?><span class="pull-right">Number of failures: <span><?= $error->number_of_failures ?></span></span></div>
    <div class="content"><?= $content ?></div>
</body>
</html>