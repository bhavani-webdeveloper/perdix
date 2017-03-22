-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Aug 19, 2016 at 06:49 PM
-- Server version: 5.5.44-0ubuntu0.14.04.1
-- PHP Version: 5.5.9-1ubuntu4.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `encoredb`
--

-- --------------------------------------------------------

--
-- Table structure for table `configuration_properties`
--

CREATE TABLE IF NOT EXISTS `configuration_properties` (
  `id` int(4) unsigned NOT NULL AUTO_INCREMENT,
  `tenant_code` varchar(10) NOT NULL,
  `module_code` varchar(10) NOT NULL,
  `property_name` varchar(45) DEFAULT NULL,
  `property_value` varchar(200) DEFAULT NULL,
  `version` int(4) NOT NULL DEFAULT '0',
  `created_by` varchar(45) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `last_edited_by` varchar(45) DEFAULT NULL,
  `last_edited_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tenant_code` (`tenant_code`,`module_code`,`property_name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=36 ;

--
-- Dumping data for table `configuration_properties`
--

INSERT INTO `configuration_properties` (`tenant_code`, `module_code`, `property_name`, `property_value`, `version`, `created_by`, `created_at`, `last_edited_by`, `last_edited_at`) VALUES
('KGFS', 'Loans', 'InterestBookingInterval', '1', 0, 'admin', '2012-10-30 18:33:25', NULL, NULL),
('KGFS', 'Customer', 'MaturityAge', '18', 0, 'admin', '2012-10-30 18:33:25', NULL, NULL),
('KGFS', 'Base', 'ManualEod', 'false', 111, 'SYSTEM', '2013-07-24 22:02:04', 'admin', '2016-06-17 15:34:05'),
('KGFS', 'Base', 'EodEmailId', 'srinit@sen-sei.in,rimjhim@sen-sei.in', 3, 'SYSTEM', '2013-07-24 22:02:04', 'admin', '2013-09-15 20:51:56'),
('KGFS', 'Base', 'MaximumInactiveDaysForAccount', '15', 0, 'SYSTEM', '2013-07-24 22:02:07', NULL, NULL),
('KGFS', 'Base', 'Tag', 'Rahul', 3, 'SYSTEM', '2014-01-21 15:11:41', 'testuser', '2014-11-27 17:26:01'),
('KGFS', 'Base', 'TemplateLoanOdProduct', 'T401', 0, 'admin', '2014-03-01 12:09:38', NULL, NULL),
('KGFS', 'Base', 'TemplateCasaProduct', 'C100', 0, 'admin', '2014-03-01 12:09:39', NULL, NULL),
('MG', 'Loans', 'InterestBookingInterval', '1', 0, 'admin', '2014-04-11 11:40:26', NULL, NULL),
('MG', 'Customer', 'MaturityAge', '18', 0, 'admin', '2014-04-11 11:40:26', NULL, NULL),
('MG', 'Base', 'ManualEod', 'false', 4, 'admin', '2014-04-11 11:40:26', 'admin', '2014-04-18 10:34:17'),
('MG', 'Base', 'EodEmailId', 'rimjhim@sen-sei.in', 0, 'admin', '2014-04-11 11:40:26', NULL, NULL),
('MG', 'Base', 'MaximumInactiveDaysForAccount', '999', 0, 'admin', '2014-04-11 11:40:26', NULL, NULL),
('MG', 'Base', 'Tag', '', 0, 'admin', '2014-04-11 11:40:26', NULL, NULL),
('MG', 'Base', 'TemplateLoanOdProduct', 'T100', 0, 'admin', '2014-04-11 11:40:26', NULL, NULL),
('MG', 'Base', 'TemplateCasaProduct', 'C100', 0, 'admin', '2014-04-11 11:40:26', NULL, NULL),
('KGFS', 'Base', 'PreEodDumpEnabled', 'false', 0, 'admin', '2014-06-24 13:31:40', NULL, NULL),
('MG', 'Base', 'PreEodDumpEnabled', 'false', 0, 'admin', '2015-01-11 21:04:43', NULL, NULL),
('KGFS', 'Customer', 'IdentityProofRequired', 'false', 0, 'admin', '2015-01-23 18:04:14', NULL, NULL),
('KGFS', 'Customer', 'AddressProofRequired', 'false', 0, 'admin', '2015-01-23 18:04:14', NULL, NULL),
('KGFS', 'Customer', 'PANRequired', 'false', 0, 'admin', '2015-01-23 18:04:14', NULL, NULL),
('KGFS', 'Customer', 'PhotoRequired', 'false', 0, 'admin', '2015-01-23 18:04:14', NULL, NULL),
('KGFS', 'Base', 'DefaultCurrencyCode', 'INR', 0, 'admin', '2016-03-18 17:16:55', NULL, NULL),
('KGFS', 'Base', 'UseDirectQuery', 'true', 2, 'admin', '2016-07-21 15:30:57', 'admin', '2016-07-21 16:02:01');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `configuration_properties`
--
ALTER TABLE `configuration_properties`
  ADD CONSTRAINT `configuration_properties_ibfk_1` FOREIGN KEY (`tenant_code`) REFERENCES `tenants` (`tenant_code`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
