<?php

namespace App\Core\Visualization\Section;

use App\Models\Visualization\Dashboard\QueriesMaster;
use App\Models\Visualization\Dashboard\QueryParameters;
use Illuminate\Database\Capsule\Manager as DB;

abstract class AbstractVisualizationSection
{
    protected $sectionName;
    public $type;
    protected $requestParameters;
    protected $queryData;
    protected $sectionParameters;
    protected $query;
    public $width;

    public function __construct($section, $requestParameters)
    {
        $this->type = $section['view_name'];
        $this->sectionName = $section['section_name'];
        $this->width = $section['width'];
        if ($this->width == '') {
            $this->width = 'col3';
        }
        $this->requestParameters = $requestParameters;
    }

    protected function getQuery()
    {
        $this->queryData = QueriesMaster::where('query_name', $this->dataSource)
            ->get()
            ->toarray();
        if (count($this->queryData) == 0) {
            throw new \Exception("Query is not found");
        } else {
            return $this->queryData[0]['query'];
        }
    }

    protected function getParameter()
    {
        $parameters = QueryParameters::where('query_name', $this->dataSource)
            ->get()
            ->toarray();
        $sectionParameters = [];
        if (count($parameters) > 0) {
            foreach ($parameters as $parameter) {
                if ($parameter['parameter_id'] != null && !empty($parameter['parameter_id']) && array_key_exists($parameter['parameter_id'], $this->requestParameters)) {
                    $sectionParameters["{$parameter['parameter_id']}"] = $this->requestParameters["{$parameter['parameter_id']}"];
                } else {
                    throw new \Exception('Parameter is not matched from request');
                    break;
                }
            }
        } else {
            throw new \Exception('Parameter is not available in table');
        }
        return $sectionParameters;
    }

    protected function getQueryData()
    {
        $this->query = $this->getQuery();
        $this->sectionParameters = $this->getParameter();
        return DB::select($this->query, $this->sectionParameters);
    }

    protected function process()
    {
        switch ($this->dataSourceType) {
            case 'query':
                $this->data = $this->getQueryData();
                break;
            case 'api':
                $this->data = $this->getAPIData();
                break;
            default:
                throw new \Exception('View name is not available');
        }
    }

    abstract public function processor();
    abstract protected function processValidation();
}
?>