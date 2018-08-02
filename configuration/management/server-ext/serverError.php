<?php
    use App\Responses\IRFResponse;
    include_once("../bootload.php"); 

    $base = '//'.$_SERVER['HTTP_HOST'].dirname($_SERVER['PHP_SELF']);
    $id = $_GET['id'];
    if (!isset($id) &&empty($id)) {
        $max_id = DB::table('email_request')->max('id');
        header("Location: $base/serverError.php?id=$max_id");
        die();
    }
    $error = DB::table('email_request')->where('id', $id)->first();
    $file = DN::table('file_info')->where('file_id', $error->path)->first();
    $content = readfile($file->path);
    $previous = $base.'/serverError.php?id='.($id-1);
    $next = $base.'/serverError.php?id='.($id+1);
?><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Perdix Server Error</title>
</head>
<body>
    <a class="previous" href="<?= $previous ?>">Previous</a>
    <a class="next" href="<?= $next ?>">Next</a>
    <div class="subject"><?= $error->subject ?></div>
    <div class="request-time"><?= $error->request_time ?></div>
    <div class="path"><?= $error->path ?></div>
    <div class="number-of-failures"><?= $error->number_of_failures ?></div>
    <div class="content"><?= $content ?></div>
</body>
</html>