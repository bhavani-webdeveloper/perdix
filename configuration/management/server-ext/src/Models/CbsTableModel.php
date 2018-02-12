<?php
namespace App\Models;

use Illuminate\Database\Capsule\Manager as DB;

class CbsTableModel extends \Illuminate\Database\Eloquent\Model {

    public function __construct($datearg) {
        parent::__construct([]);

        $date = $datearg ? date_format($datearg, 'dMY') : date('dMY');
        $date = strtoupper($date);
        $this->setTable("cbs__".$date);
    }

    protected $connection = 'bi_db';
    public $timestamps = false;

}