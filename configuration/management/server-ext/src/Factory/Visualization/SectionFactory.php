<?php
namespace App\Factory\Visualization;

use App\Core\Visualization\Section\BalanceSheet;
use App\Core\Visualization\Section\Box;
use App\Core\Visualization\Section\Chart;
use App\Core\Visualization\Section\Container;
use App\Core\Visualization\Section\Grid;
use App\Core\Visualization\Section\ProfitAndLoss;
use App\Core\Visualization\Section\Scoring;
use App\Core\Visualization\Section\Table;

class SectionFactory
{
    public static function getSection($section, $requestParameters)
    {
        if (!is_object($section)) {
            switch ($section['view_name']) {

                case 'box':
                    $section = new Box($section, $requestParameters);
                    break;

                case 'container':
                    $section = new Container($section, $requestParameters);
                    break;

                case 'grid':
                    $section = new Grid($section, $requestParameters);
                    break;

                case 'balance_sheet':
                    $section = new BalanceSheet($section, $requestParameters);
                    break;

                case 'pnl':
                    $section = new ProfitAndLoss($section, $requestParameters);
                    break;

                case 'chart':
                    $section = new Chart($section, $requestParameters);
                    break;

                case 'scoring':
                    $section = new Scoring($section, $requestParameters);
                    break;

                case 'table':
                    $section = new Table($section, $requestParameters);
                    break;

                default:
                    throw new \Exception("{$section['view_name']} view is not defined");
                    break;
            }
        }
        return $section;
    }
}
?>