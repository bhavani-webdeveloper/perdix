<?php

namespace App\Core\Visualization\Section;

class Table extends AbstractVisualizationSection
{
    protected $dataSourceType;
    protected $dataSource;
    public $sectionName;
    protected $dashboardName;
    public $parent;
    private $result;

    public function __construct($section, $requestParameters)
    {
        parent::__construct($section, $requestParameters);
        $this->dataSourceType = $section['data_source_type'];
        $this->dataSource = $section['data_source'];
        $this->sectionName = $section['section_name'];
        $this->dashboardName = $section['dashboard_name'];
        $this->parent = $section['parent_section_name'];

    }

    protected function processValidation()
    {
        if ($this->dataSourceType == null && empty($this->dataSourceType)) {
            throw new \Exception('Data source type is not available');
        }
    }

    private function formatData($elements)
    {
        $this->result['columns'] = array();
        $this->result['data'] = $elements;
        $keyCheck = [];
        foreach ($elements as $element) {
            $k = 0;
            foreach ($element as $key => $value) {
                if (!in_array($key, $keyCheck)) {
                    array_push($keyCheck, $key);
                    $this->result['columns'][$k]['title'] = $key;
                    $this->result['columns'][$k]['data'] = $key;
                    $k++;
                }
            }
        }
        return $this->result;
    }

    public function processor()
    {
        $this->processValidation();
        $this->process();
        $this->data = $this->formatData($this->data);

    }
}
?>