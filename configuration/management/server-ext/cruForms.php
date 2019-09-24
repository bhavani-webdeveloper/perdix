<?php

// error_reporting(0);
// Setting up config for PHP
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

include_once("bootload.php");
include_once('../scoring/includes/db.php');
use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use App\Models\CustomerUploadMaster;
use App\Models\CustomerUploadDetail;
use App\Services\PerdixService;
use App\Core\Settings;
use App\Models\Forms\Form;
use \Illuminate\Validation\Rule;

$perdixService= new PerdixService();
// $perdixService->login();
$settings = Settings::getInstance()->getSettings();
$outErrors = [
    'errors' => [
        'error' =>[]
    ]
];


// Validation rules
$rule = [
    'form_name' => 'required|unique:form_db.form,form_name',
    'Output' => 'required|in:PDF,HTML',
    'pdf_renderer' => 'required|in:CYAHP,NODE,NONE',
    'table_query' => 'required',
    'query' => 'required',
    'perdix_form_name' => 'required',
    'table_investor_id' => 'required',
    'form_language' => 'required',
    'override_language' => 'required',
    'table_product_id' => 'required',
    'section_name' => 'required',
    'section_html' => 'required',
    'effective_date' => 'required',
    'status' => 'required'
];


if (isset($_GET)) {
    // header("Access-Control-Allow-Headers: Content-Type, accept, Authorization, X-Requested-With");
    // header("Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT");
    // header("Access-Control-Request-Headers: Content-Type, accept");
    // header("Access-Control-Expose-Headers: X-Total-Count");
    // header('Content-Type: application/json');

    $response = get_response_obj();

    if (!empty($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
    }

    if ($_SERVER['REQUEST_METHOD'] == "OPTIONS") {
        die();
    }
    if ($_SERVER['REQUEST_METHOD'] == "GET") {
        $queryString = array_key_exists('QUERY_STRING', $_SERVER)?$_SERVER['QUERY_STRING']:'';
        $query = [];
        parse_str($queryString, $query);
        // $authHeader = "Bearer " . $settings['perdix']['token'];
        $forms = Form::whereRaw('1');

        if (array_key_exists('form_name', $query)){
            $forms = $forms->where('form_name', 'like', "%{$query['form_name']}%");
        }
        
        $forms = $forms->get();
        $response->json($forms->toArray());
    }
    if ($_SERVER['REQUEST_METHOD'] == "PUT") {
        $requestData = json_decode(rtrim(file_get_contents('php://input'), "\0"), true);
        $rule['id'] = 'required|exists:form_db.form,id';

        $rule['form_name'] = [
            'required',
            Rule::unique('form_db.form', 'form_name')->ignore($requestData['form_name'], 'form_name')
        ];

        $validator = get_validator()->make($requestData, $rule);
        if ($validator->fails()){
            $response->setStatusCode(400);
            return $response->json($validator->messages()->toArray());
        }
        $form = Form::find($requestData['id']);
        $form->fill($requestData);
        $form->save();
        return get_response_obj()->json($form->toArray());
    }
    if ($_SERVER['REQUEST_METHOD'] == "POST") {
        $requestData = json_decode(rtrim(file_get_contents('php://input'), "\0"), true);
        if (array_key_exists('id', $requestData) && !is_null($requestData['id'])){
            $outErrors['errors']['error'][] = [
                'id' => 'POST request with id is not accepted. Use PUT instead.'
            ];
            // $response->json($outErrors)->setStatusCode(400);
        }
        /* Validation here */
        $validator = get_validator()->make($requestData, $rule);
        if ($validator->fails()){
            $response->setStatusCode(400);
            return $response->json($validator->messages()->toArray());
        }

        $form = Form::create($requestData);
        $form->save();
        return get_response_obj()->json($form->toArray());
    }
}

?>
