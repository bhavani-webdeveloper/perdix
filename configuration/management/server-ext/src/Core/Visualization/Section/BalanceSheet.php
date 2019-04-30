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
    protected $bsData = array();

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

    private function _getNode($nodeKeyArray){

    }

    /**
     * TODO-1
     * 1. $key will be of format "A>B>C>D". Validate the format, if not valid (use regex), throw error.
     * 2. Seperate key by '>'
     * 3. 
     */
    private function _createOrExistingNode($key, $value = null){
        // TODO-1 Add validation here

        $keys = explode('>', $key);

        $existingNode = $this->_getNode($keys);
        if ($existingNode){
            return $existingNode;
        } 
        
        $lastKey = $keys[count($keys)-1];

        if ($value == null){
            $node = [
                'title' => $lastKey,
                'data' => []
            ];
        } else {
            $node = [
                'title' => $lastKey,
                'data' => $value
            ];
        }

        if (count($keys) > 1){
            array_pop($keys);
            $parentKey = join('>', $keys);
            $parentNode = $this->_createOrExistingNode($parentKey, null);
            $parentNode['data'][] = $node;
        } else {
            $this->bsData[] = $node;
        }
        return $node;
    }

    /**
     * TODO-1
     * 1. Fidn the node based on the key (remove the _TOTAL and send here)
     * 2. Add total object to the node
     */
    public function _appendTotalToNode($key, $value){

    }

    /**
     * 1. Start with a tree (with a single node)
     * 2. 
     * 
     */
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