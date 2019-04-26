<?php

namespace App\Core\Visualization\Section;

class BalanceSheet extends AbstractVisualizationSection
{
    protected $dataSourceType;
    protected $dataSource;
    public $sectionName;
    protected $dashboardName;
    protected $object = array();
    public $parent;
    protected $result = array();
    protected $branch = array();

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

    private function formatData()
    {
        foreach ($this->data as &$sectionData) {
            $this->object = array();
            foreach ($sectionData as $key => $value) {
                $label = explode('>', $key);
                for ($i = 0; $i < \sizeof($label); $i++) {
                    if (strpos(end($label), '__TOTAL:') === 0) {
                        if (sizeof($label) > 1) {
                            if ($i == \sizeof($label) - 1 && $i > 0) {
                                $total = explode(':', end($label));
                                $this->object['title'] = 'Total ' . end($total);
                                $this->object['parent'] = end($total);
                                $this->object['data'] = $value;
                                array_push($this->result, $this->object);
                            }
                        } else {
                            $total = explode(':', end($label));
                            $this->object['title'] = 'Total ' . end($total);
                            $this->object['parent'] = end($total);
                            $this->object['data'] = $value;
                            array_push($this->result, $this->object);
                        }
                    } else {
                        if (sizeof($label) > 1) {
                            if ($i == \sizeof($label) - 1 && $i > 0) {
                                $this->object['title'] = end($label);
                                $this->object['parent'] = $label[$i - 1];
                                $this->object['data'] = $value;
                                array_push($this->result, $this->object);
                            }
                        } else {
                            $this->object['title'] = end($label);
                            $this->object['parent'] = '';
                            $this->object['data'] = $value;
                            array_push($this->result, $this->object);
                        }
                    }
                }
            }
        }
    }

    private function buildTree(array $elements, $parentId)
    {
        $branch = array();
        foreach ($elements as $element) {
            if ($element['parent'] == $parentId) {
                $children = $this->buildTree($elements, $element['title']);
                if ($children) {
                    $element['data'] = $children;
                }
                $branch[] = $element;
            }
        }
        return $branch;
    }

    private function addTotal(array $elements)
    {
        $branch = array();
        foreach ($elements as &$element) {
            $k = 0;
            foreach ($element['data'] as $parentData) {
                $i = 0;
                if (strpos($parentData['title'], 'Total') === 0) {
                    $a = array_pop($element['data']);
                    $element['total'] = $a;
                } else {
                    foreach ($parentData['data'] as $childData) {
                        if (strpos($childData['title'], 'Total') === 0) {
                            $a = $element['data'][$k]['data'][$i];
                            array_pop($element['data'][$k]['data']);
                            $element['data'][$k]['total'] = $a;

                        }
                        $i++;
                    }
                }$k++;
            }
        }
        return $elements;
    }

    public function processor()
    {
        $this->processValidation();
        $this->process();
        $this->formatData();
        $this->data = $this->buildTree($this->result, null);
        $this->data = $this->addTotal($this->data);
    }
}
?>