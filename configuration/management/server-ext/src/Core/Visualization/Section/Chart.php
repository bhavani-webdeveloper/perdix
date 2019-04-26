<?php
namespace App\Core\Visualization\Section;

error_reporting(0);
// or error_reporting(E_ALL & ~E_NOTICE); to show errors but not notices
ini_set("display_errors", 0);
class Chart extends AbstractVisualizationSection
{
    protected $dataSourceType;
    protected $dataSource;
    public $sectionName;
    protected $dashboardName;
    public $parent;
    private $result;
    public $subType;
    protected $style;
    protected $keyCheck = [];
    protected $total = array();
    protected $final = array();
    private $colors = array(
        "blue" => "hsla(224, 75%, 50%, 0.5)",
        "green" => "hsla(75, 75%, 50%, 0.5)",
        "red" => "hsla(356, 75%, 50%, 0.5)",
        "cyan" => "hsla(184,75%,50%,0.5)",
        "purple" => "hsla(275, 75%, 50%, 0.5)",
        "magenta" => "hsla(300, 75%, 50%, 0.5)",
        "orange" => "hsla(45, 75%, 50%, 0.5)",
        "peach" => "hsla(34, 75%, 50%, 0.5)",
        "mint" => "hsla(110, 75%, 50%, 0.5)",
        "yellow" => "hsla(54, 75%, 50%, 0.5)",
    );
    public function __construct($section, $requestParameters)
    {
        parent::__construct($section, $requestParameters);
        $this->dataSourceType = $section['data_source_type'];
        $this->dataSource = $section['data_source'];
        $this->sectionName = $section['section_name'];
        $this->dashboardName = $section['dashboard_name'];
        $this->parent = $section['parent_section_name'];
        $this->subType = $section['sub_type'];
        $this->style = \json_decode($section['style_source']);

    }

    protected function processValidation()
    {
        if ($this->dataSourceType == null && empty($this->dataSourceType)) {
            throw new \Exception('Data source type is not available');
        }
    }

    private function formatData($elements)
    {
        $this->result['XLabels'] = array();
        $this->result['dataset'] = array();
        $k = 0;
        $p = 0;
        $label;
        $Xlabel;
        foreach ($elements as $element) {
            foreach ($element as $key => $value) {
                $content = explode(':', $key);
                if ($content[0] == 'X') {
                    $Xlabel = $value;
                    if (!in_array($value, $this->result['XLabels'])) {
                        array_push($this->result['XLabels'], $value);
                    }
                } else if ($content[0] == 'Y') {
                    $label = $value;
                    if (!in_array($value, $this->keyCheck) || empty($this->keyCheck)) {
                        array_push($this->keyCheck, $value);
                        $this->result['dataset'][$k]['label'] = $value;
                        $k++;
                    }
                } else if ($content[0] == 'A' && in_array($label, $this->keyCheck)) {
                    // $i = array_search($label, $this->keyCheck);
                    // $this->result['dataset'][$i]['data'][] = $value;
                    array_push($this->total, array("Xlabel" => $Xlabel, "label" => $label, "amount" => $value));
                }
                if (($this->subType == 'pie' || $this->subType == 'doughnut') && $content[0] == 'A') {
                    if ($p < count($this->result['XLabels'])) {
                        $this->result['dataset'][0]['backgroundColor'][] = 'hsla(' . rand(0, 360) . ', 75%, 50%, 0.5)';
                        $this->result['dataset'][0]['label'] = end($content);
                        $this->result['dataset'][0]['data'][] = $value;
                        $p++;
                    }
                } else {
                    foreach ($this->style->style as $style) {
                        if ($style->label == $label && in_array($label, $this->keyCheck)) {
                            $i = array_search($label, $this->keyCheck);
                            if (ctype_digit($style->color)) {
                                $this->result['dataset'][$i]['backgroundColor'] = "hsla(" . $style->color . ",75%,50%,0.5)";
                                $this->result['dataset'][$i]['borderColor'] = "hsla(" . $style->color . ",75%,50%,0.5)";
                            } else if (array_key_exists($style->color, $this->colors)) {
                                $this->result['dataset'][$i]['backgroundColor'] = $this->colors[$style->color];
                                $this->result['dataset'][$i]['borderColor'] = $this->colors[$style->color];
                            }
                        }
                    }
                }
            }
        }
        if (!($this->subType == 'pie' || $this->subType == 'doughnut')) {
            $i = 0;
            foreach ($this->result['XLabels'] as $Xlabels) {
                $x = 0;
                foreach ($this->keyCheck as $keys) {
                    $value = $this->total[$i];
                    if ($value['Xlabel'] == $Xlabels) {
                        if ($value['label'] == $keys) {
                            array_push($this->final, array("Xlabel" => $Xlabels, "label" => $keys, "amount" => $value['amount']));
                            $i++;
                        } else {
                            array_push($this->final, array("Xlabel" => $Xlabels, "label" => $keys, "amount" => '0'));
                        }
                    } else {
                        $value = $this->total[$i - 1];
                        if ($value['Xlabel'] == $Xlabels) {
                            if ($value['label'] == $keys) {
                                array_push($this->final, array("Xlabel" => $Xlabels, "label" => $keys, "amount" => $value['amount']));
                                $i++;
                            } else {
                                array_push($this->final, array("Xlabel" => $Xlabels, "label" => $keys, "amount" => '0'));
                            }
                        }

                    }

                }

            }
        }
        $k = 0;
        foreach ($this->final as $final) {
            foreach ($final as $key => $value) {
                if ($key != 'Xlabel') {
                    if($key == 'label') {
                        $label = $value;
                    }
                    if (in_array($label, $this->keyCheck) && $key != 'label') {
                        $i = array_search($label, $this->keyCheck);
                        $this->result['dataset'][$i]['data'][] = $value;
                    } 
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
