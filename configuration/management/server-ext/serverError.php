<?php
    use App\Responses\IRFResponse;
    include_once("bootload.php");
    use Illuminate\Database\Capsule\Manager as DB;

    $base = '//'.$_SERVER['HTTP_HOST'].dirname($_SERVER['PHP_SELF']);
    if (isset($_GET['encore'])) {
        if (empty($_GET['encore'])) {
            header("Location: $base/serverError.php?encore=100");
            die();
        }
        $encore = $_GET['encore'];
        // CREATE VIEW `encoresite` AS select '/opt/mount_point/encoresite' AS `path`
        $encoresite = DB::table('encoresite')->first();
        $encore_log = shell_exec('tail -n '.$encore.' '.$encoresite->path.'/logs/encore.log');
        header("Content-Type: text/html");

?><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <title>Encore Server Log</title>
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
            padding-top: 6px;
        }
        span.pull-right>span {
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="content"><pre><?= $encore_log ?></pre></div>
</body>
</html><?php

    } else if (!isset($_GET['id']) && empty($_GET['id'])) {
        $max_id = DB::table('email_request')->max('id');
        header("Location: $base/serverError.php?id=$max_id");
        die();
    } else {
        $id = $_GET['id'];
        header("Content-Type: text/html");
        $error = DB::table('email_request')->where('id', $id)->first();
        // $file = DB::table('file_info')->where('file_id', $error->path)->first();
        $url = getenv(PERDIX_V8_BASE_URL);
        if (empty($error->path)) {
            echo("<h4><center>OOPS..SOMETHING WENT WRONG ".json_decode('"\uD83D\uDE3F"')."</center><h4>");
        } else {
            $content = file_get_contents(getenv(PERDIX_V8_BASE_URL).'/api/stream/'.$error->path);
        }
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
</html><?php
    }