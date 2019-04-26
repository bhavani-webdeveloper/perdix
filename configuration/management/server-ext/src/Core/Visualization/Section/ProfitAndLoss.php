<?php

namespace App\Core\Visualization\Section;

class ProfitAndLoss extends AbstractVisualizationSection
{
    protected $dataSourceType;
    protected $dataSource;
    public $sectionName;
    protected $dashboardName;
    public $parent;
    private $result = [];

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

    private function formatData($element)
    {
        $this->result['XLabels'] = array();
        $this->result['dataset'] = array();
        $k = 0;
        foreach ($element as &$sectionData) {
            foreach ($sectionData as $key => $value) {

                if ($key == 'range') {
                    $this->result['XLabels'][] = $value;
                    $k = 0;
                } else {
                    $label = explode('>', $key);
                    for ($i = 0; $i < \sizeof($label); $i++) {
                        if (strpos(end($label), '__Total:') === 0) {
                            $total = explode(':', $key);
                            $this->result['dataset'][$k]['label'] = "Total " . end($total);
                            $this->result['dataset'][$k]['parent'] = end($total);
                            $content = explode(',', $value);
                            if (\sizeof(($content)) < 2) {
                                $this->result['dataset'][$k]['data'][] = end($content);
                            } else {
                                $this->result['dataset'][$k]['data'][] = $content[0];
                                $content = explode(':', $content[1]);
                                $this->result['dataset'][$k]['style'][str_replace('__', '', $content[0])] = $content[1];
                            }
                            $k++;
                        } else {
                            if (sizeof($label) > 1) {
                                if ($i == \sizeof($label) - 1 && $i > 0) {
                                    $content = explode(',', $value);
                                    $this->result['dataset'][$k]['label'] = end($label);
                                    $this->result['dataset'][$k]['parent'] = $label[$i - 1];
                                    if (\sizeof(($content)) < 2) {
                                        $this->result['dataset'][$k]['data'][] = end($content);
                                    } else {
                                        $this->result['dataset'][$k]['data'][] = $content[0];
                                        $content = explode(':', $content[1]);
                                        $this->result['dataset'][$k]['style'][str_replace('__', '', $content[0])] = $content[1];
                                    }
                                    $k++;
                                }
                            } else {
                                $content = explode(',', $value);
                                $this->result['dataset'][$k]['label'] = end($label);
                                $this->result['dataset'][$k]['parent'] = '';
                                if (\sizeof(($content)) < 2) {
                                    $this->result['dataset'][$k]['data'][] = end($content);
                                } else {
                                    $this->result['dataset'][$k]['data'][] = $content[0];
                                    $content = explode(':', $content[1]);
                                    $this->result['dataset'][$k]['style'][str_replace('__', '', $content[0])] = $content[1];
                                }
                                $k++;
                            }
                        }
                    }
                }
            }
        }
        $this->result['dataset'] = $this->buildTree($this->result['dataset'], null);
        return $this->result;

    }

    private function buildTree(array $elements, $parentId)
    {
        $branch = array();
        foreach ($elements as $element) {
            if ($element['parent'] == $parentId) {
                $children = $this->buildTree($elements, $element['label']);
                if ($children) {
                    $element['data'] = $children;
                }
                $branch[] = $element;
            }
        }
        return $branch;
    }

    public function processor()
    {
        $this->processValidation();
        $this->process();
        $this->data = $this->formatData($this->data);

    }
}
?>