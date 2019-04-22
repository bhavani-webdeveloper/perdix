<?php

namespace App\Core\Visualization\Section;

class Grid extends AbstractVisualizationSection
{
    protected $dataSourceType;
    protected $dataSource;
    public $sectionName;
    protected $dashboardName;
    public $parent;

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

    public function processor()
    {
        $this->processValidation();
        $this->process();

    }
}
?>