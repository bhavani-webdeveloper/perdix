<?php
namespace App\Services;

use App\Factory\Visualization\SectionFactory;
use App\Models\Visualization\Dashboard\Sections;
use Illuminate\Database\Capsule\Manager as DB;

class DashboardService
{
    public $dashboardData = [];
    public $parameters = [];
    protected $_sections = [];
    protected $tree = [];
    private function load($dashboardName, $parameter)
    {
        $this->parameters = $parameter;
        $querySection = Sections::where('dashboard_name', $dashboardName)
            ->get()
            ->toarray();
        $this->dashboardData = $querySection;
        if (\count($this->dashboardData) > 0) {
            foreach ($this->dashboardData as $section) {
                $this->_loadSection($section);
            }
        } else {
            // TODO-1 Handle this using exceptions
            echo ('Data is not available for ' . $dashboardName . '.');
            die();
        }
    }

    private function _loadSection($options)
    {
        try {
            $section = SectionFactory::getSection($options, $this->parameters);
            $section->processor();
        } catch (\Exception $e) {
            $section->status = 'Failed';
            $section->message = $e->getMessage();
        }
        $this->_sections['dashboard_name'] = $options["dashboard_name"];
        $this->_sections['sections'][] = $section;
    }

    public function validate($section)
    {
        if ($section['data_source'] == 'query') {
            if ($section['query'] != null && !empty($section['query'])) {
                $section['status'] = "Success";
            } else {
                throw new \Exception("Initial query not found");
            }
        } else if (empty($section['dara_source_type']) && $section['display_name'] == null) {
            throw new \Exception("Display name is missing");
        }

    }

    public function getParameter($section)
    {
        $queryParameter = DB::table('pvtm_query_parameters')
            ->where('query_name', '=', $section['data_source'])
            ->get()
            ->toarray();

        $parameters = [];
        if (count($queryParameter) > 0) {
            foreach ($queryParameter as $parameter) {
                if ($parameter->parameter_id != null && !empty($parameter->parameter_id) && array_key_exists($parameter->parameter_id, $this->parameters)) {
                    $parameters["$parameter->parameter_id"] = $this->parameters[$parameter->parameter_id];
                } else {
                    throw new Exception('Parameter is not matched from request');
                    break;
                }
            }
        } else {
            throw new Exception('Parameter is not available in table');
        }
        return $parameters;
    }

    public function toJson()
    {
        return \json_encode($this->_sections);
    }

    public function buildTree(array $elements, $parentId)
    {
        $branch = array();
        foreach ($elements as $element) {
            if ($element->parent == $parentId) {
                $children = $this->buildTree($elements, $element->sectionName);
                if ($children) {
                    $element->section = $children;
                }
                $branch[] = $element;
            }
        }
        return $branch;
    }

    public function process($dashboardName, $parameter)
    {
        $this->load($dashboardName, $parameter);
        $this->_sections['sections'] = $this->buildTree($this->_sections['sections'], null);
        return $this->_sections;
    }
}
