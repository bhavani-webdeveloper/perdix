<?php
include_once("bootload.php");
use Illuminate\Database\Capsule\Manager as DB;

$globalSettings = DB::table('global_settings')->select('name', 'value')->whereIn('name', array('cordova.latest_apk_url', 'siteCode'))->get()->toArray();

header("Content-Type: text/html");
?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Download Perdix APK for Witfin</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.4/css/bulma.min.css">
    <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>
  </head>
  <body>
  <section class="section">
    <div class="container has-text-centered" >
      <?php if(count($globalSettings)!=2) { ?>
      <h2 class="subtitle">
        <strong>Oops!!</strong>, Kindly contact us.
      </h2>
    <?php } else { ?>
      <h1 class="title">
        Perdix APK for <?php echo ucfirst($globalSettings[1]->value); ?>
      </h1>
      <p class="buttons is-centered">
      	<a href="<?php  echo $globalSettings[0]->value; ?>" class="button is-large is-primary">
            <span class="icon">
              <i class="fas fa-download"></i>
            </span>
            <span>Click to download</span>
        </a>
      </p>
    <?php } ?>
    </div>
  </section>
  </body>
</html>
