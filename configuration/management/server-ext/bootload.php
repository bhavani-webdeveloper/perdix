<?php
ob_start("ob_gzhandler");

require_once __DIR__.'/vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as DB;
use App\Core\Settings;

//header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, accept, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT,HEAD");
header("Access-Control-Request-Headers: Content-Type, accept");
header("Access-Control-Expose-Headers: X-Total-Count");
header('Content-Type: application/json');

if (!empty($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}

if ($_SERVER['REQUEST_METHOD'] == "OPTIONS") {
    die();
}

$dotenv = new Dotenv\Dotenv(__DIR__);
$dotenv->load();

$settings = [
    'db' => [
        'driver' => 'mysql',
        'host' => getenv('DB_HOST'),
        'database' => getenv('DB_NAME'),
        'username' => getenv('DB_USER'),
        'password' => getenv('DB_PASSWORD'),
        'charset'   => 'utf8',
        'collation' => 'utf8_unicode_ci',
        'prefix'    => '',
        'options' => [
            PDO::ATTR_EMULATE_PREPARES => true,
        ],
    ],
    'bi_db' => [
        'driver' => 'mysql',
        'host' => getenv('DB_HOST'),
        'database' => getenv('BI_DB_NAME'),
        'username' => getenv('DB_USER'),
        'password' => getenv('DB_PASSWORD'),
        'charset'   => 'utf8',
        'collation' => 'utf8_unicode_ci',
        'prefix'    => '',
    ],
    'bietl_db' => [
        'driver' => 'mysql',
        'host' => getenv('BIETL_DB_HOST'),
        'database' => getenv('BIETL_DB_NAME'),
        'username' => getenv('BIETL_DB_USER'),
        'password' => getenv('BIETL_DB_PASSWORD'),
        'charset'   => 'utf8',
        'collation' => 'utf8_unicode_ci',
        'prefix'    => '',
    ],
    'encore_db' => [
        'driver' => 'mysql',
        'host' => getenv('DB_HOST'),
        'database' => getenv('ENCORE_DB_NAME'),
        'username' => getenv('DB_USER'),
        'password' => getenv('DB_PASSWORD'),
        'charset'   => 'utf8',
        'collation' => 'utf8_unicode_ci',
        'prefix'    => '',
    ],
    'psychometric' => [
        'driver' => 'mysql',
        'host' => getenv('DB_HOST'),
        'database' => getenv('PSYCHOMETRIC_DB_NAME'),
        'username' => getenv('DB_USER'),
        'password' => getenv('DB_PASSWORD'),
        'charset'   => 'utf8',
        'collation' => 'utf8_unicode_ci',
        'prefix'    => '',       
    ],
    'perdix' => [
        'v8_url' => getenv('PERDIX_V8_BASE_URL'),
        'username' => getenv('PERDIX_USERNAME'),
        'password' => getenv('PERDIX_PASSWORD'),
        'disbursement_base_dir' => getenv('DISBURSEMENT_BASE_DIR'),
        'customer_upload_path' => getenv('CUSTOMER_UPLOAD_BASE_DIR'),
        'loan_collection_upload_path' => getenv('COLLECTION_UPLOAD_BASE_DIR'),
        'partner_upload_path' => getenv('PARTNER_UPLOAD_BASE_DIR'),
        'kyc_upload_path' => getenv('KYC_UPLOAD_BASE_DIR'),
        'individual_loan_upload_path' => getenv('LOAN_UPLOAD_BASE_DIR'),
        'par_upload_path' => getenv('PAR_UPLOAD_PATH')
    ],
    'bi_report' => [
        'bi_base_url' => getenv('BI_BASE_URL')
    ],
    'mail_sender' => [
        'name' => getenv('MAIL_SENDER_NAME'),
        'mail' => getenv('MAIL_SENDER')
    ],
    'paths' => [
        'sms_template_path' => getenv('SMS_TEMPLATE_PATH')
    ],
    'form_db' => [
        'driver' => 'mysql',
        'host' => getenv('FORM_DB_HOST'),
        'database' => getenv('FORM_DB_NAME'),
        'username' => getenv('FORM_DB_USER'),
        'password' => getenv('FORM_DB_PASSWORD'),
        'charset'   => 'utf8',
        'collation' => 'utf8_unicode_ci',
        'prefix'    => '',
        'options' => [
            PDO::ATTR_EMULATE_PREPARES => true,
        ]
    ]
];

$bi_etl = getenv('BIETL_DB_NAME', 'bietl');
$bi = getenv('BI_DB_NAME', 'bi');
$encore = getenv('ENCORE_DB_NAME', 'encore');
$perdix = getenv('DB_NAME', 'financialForms');
$form_db=getenv('DB_FORM_NAME', 'financialForms');

Settings::getInstance()->setSettings($settings);

header("Access-Control-Request-Method: GET");

include_once(__DIR__.'/global_functions.php');

$capsule = new \Illuminate\Database\Capsule\Manager;
$capsule->addConnection($settings['db'], 'default');
$capsule->addConnection($settings['bi_db'], 'bi_db');
$capsule->addConnection($settings['encore_db'], 'encore_db');
$capsule->addConnection($settings['form_db'], 'form_db');
$capsule->setAsGlobal();
$capsule->bootEloquent();


