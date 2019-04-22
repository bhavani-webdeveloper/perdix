<?php

namespace App\Core\Visualization\Section;

use App\Models\Visualization\Dashboard\BoxConfig;

class Box extends AbstractVisualizationSection
{
    protected $dataSourceType;
    protected $dataSource;
    public $subType;
    public $sectionName;
    protected $dashboardName;
    protected $object;
    public $parent;
    public $displayName;
    protected $style;
    protected $result = array();

    private $fields = ["info_progress_box" => ['title', 'data', 'total'], "info_box" => ['title', 'data'], "small_box" => ['title', 'data']];
    public function __construct($section, $requestParameters)
    {
        parent::__construct($section, $requestParameters);
        $this->dataSourceType = $section['data_source_type'];
        $this->dataSource = $section['data_source'];
        $this->sectionName = $section['section_name'];
        $this->dashboardName = $section['dashboard_name'];
        $this->subType = $section['sub_type'];
        $this->parent = $section['parent_section_name'];
        $this->displayName = $section['display_name'];
        $this->style = \json_decode($section['style_source']);
    }

    protected function processValidation()
    {
        if ($this->dataSourceType == null && empty($this->dataSourceType)) {
            throw new \Exception('Data source type is not available');
        }

        if ($this->subType == null && empty($this->subType)) {
            throw new \Exception('Sub type for box is not available');
        }
    }

    private function fieldValidation()
    {
        if (count($this->data) > 0) {
            $sectionData = $this->data[0];
            if (array_key_exists($this->subType, $this->fields)) {
                foreach ($this->fields[$this->subType] as $field) {
                    if (!property_exists($sectionData, $field)) {
                        throw new \Exception("Field '" . $field . "' is not available");
                        break;
                    }
                }
            } else {
                throw new \Exception("Invalid sub type '" . $this->subType . "'.");
            }

        }
    }

    private function boxConfigData()
    {
        foreach ($this->data as &$sectionData) {
            $queryConfig = BoxConfig::select('bg_class', 'icon_class')
                ->where([
                    ['field_name', $sectionData->title],
                    ['dashboard_name', $this->dashboardName],
                    ['section_name', $this->sectionName],
                ])
                ->get()
                ->toarray();
            if (count($queryConfig) > 0) {
                $sectionData->bgClass = $queryConfig[0]['bg_class'];
                $sectionData->iconClass = $queryConfig[0]['icon_class'];
            } else {
                throw new \Exception("Box configuration detail is not available for '" . $sectionData->title . "' field.");
            }
        }
    }

    private function formatData()
    {
        foreach ($this->data as &$sectionData) {
            foreach ($sectionData as $key => $value) {
                $i = 0;
                foreach ($this->style->style as $style) {
                    $object = array();
                    if (strpos($key, '__TOTAL') === 0) {
                        $this->object['total'] = $value;
                        if ($i == 0) {
                            array_push($this->result, $this->object);
                            $i++;
                        }
                    } else if ($style->label == $key) {
                        $this->object['bgClass'] = $style->color;
                        $this->object['iconClass'] = $style->icon;
                        if ($i != 0) {
                            array_push($this->result, $this->object);
                        }
                    } else {
                        $this->object['title'] = $key;
                        $this->object['data'] = $value;
                    }
                }
            }
        }
    }

    public function processor()
    {
        $this->processValidation();
        $this->process();
        $this->formatData();
        unset($this->data);
        $this->data = $this->result;
        unset($this->result);
    }
}
?>