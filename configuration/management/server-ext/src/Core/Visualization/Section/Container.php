<?php

namespace App\Core\Visualization\Section;

class Container extends AbstractVisualizationSection
{
    public $displayName;
    public $sectionName;
    protected $parentSection;
    public function __construct($section, $requestParameters)
    {
        parent::__construct($section, $requestParameters);
        $this->displayName = $section['display_name'];
        $this->sectionName = $section['section_name'];
        $this->parent = $section['parent_section_name'];
    }

    protected function processValidation()
    {
        if ($this->displayName == null && empty($this->displayName)) {
            throw new \Exception('Display name is not available');
        }

    }

    public function processor()
    {
        $this->processValidation();
    }
}
?>