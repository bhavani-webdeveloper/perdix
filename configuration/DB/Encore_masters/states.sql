-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Aug 19, 2016 at 06:18 PM
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
-- Table structure for table `states`
--

CREATE TABLE IF NOT EXISTS `states` (
  `version` int(4) NOT NULL DEFAULT '0',
  `id` int(4) unsigned NOT NULL AUTO_INCREMENT,
  `tenant_code` varchar(10) NOT NULL,
  `state_code` varchar(50) NOT NULL,
  `state_name` varchar(50) NOT NULL,
  `country_code` varchar(50) NOT NULL,
  `created_at` datetime NOT NULL,
  `created_by` varchar(45) NOT NULL,
  `last_edited_at` datetime DEFAULT NULL,
  `last_edited_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tenant_code` (`tenant_code`,`country_code`,`state_code`),
  KEY `tenant_code_2` (`tenant_code`,`country_code`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=39 ;

--
-- Dumping data for table `states`
--

INSERT INTO `states` (`version`, `tenant_code`, `state_code`, `state_name`, `country_code`, `created_at`, `created_by`, `last_edited_at`, `last_edited_by`) VALUES
(0, 'KGFS', 'Uttarakhand', 'Uttarakhand', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'Madhya Pradesh', 'Madhya Pradesh', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'Goa', 'Goa', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'Uttar Pradesh', 'Uttar Pradesh', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'Andhra Pradesh', 'Andhra Pradesh', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'Tamilnadu', 'Tamilnadu', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'Sikkim', 'Sikkim', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'Assam', 'Assam', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'West Bengal', 'West Bengal', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'Gujarat', 'Gujarat', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'Maharashtra', 'Maharashtra', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'Himachal Pradesh', 'Himachal Pradesh', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'Manipur', 'Manipur', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'Odisha', 'Odisha', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'Puducherry', 'Puducherry', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'Meghalaya', 'Meghalaya', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'Rajasthan', 'Rajasthan', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'Punjab', 'Punjab', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'Mizoram', 'Mizoram', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'Andaman & Nicobar', 'Andaman & Nicobar', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'Nagaland', 'Nagaland', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'Tripura', 'Tripura', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'Arunachal Pradesh', 'Arunachal Pradesh', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'Bihar', 'Bihar', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'Chandigarh', 'Chandigarh', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'Haryana', 'Haryana', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'New Delhi', 'New Delhi', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'Chhattisgarh', 'Chhattisgarh', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'Jharkhand', 'Jharkhand', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'Karnataka', 'Karnataka', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'Kerala', 'Kerala', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'Jammu & Kashmir', 'Jammu & Kashmir', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'Other', 'Other', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'MG', '1', 'Karnataka', '1', '2014-04-11 11:43:23', 'admin', NULL, NULL),
(0, 'MG', '2', 'Tamilnadu', '1', '2014-04-11 11:43:23', 'admin', NULL, NULL),
(0, 'MG', '3', 'Assam', '1', '2014-04-11 11:43:23', 'admin', NULL, NULL),
(0, 'MG', '4', 'Jharkhand', '1', '2014-04-11 11:43:23', 'admin', NULL, NULL),
(0, 'KGFS', 'CA', 'California', 'US', '2015-01-09 18:43:42', 'admin', NULL, NULL);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `states`
--
ALTER TABLE `states`
  ADD CONSTRAINT `states_ibfk_1` FOREIGN KEY (`tenant_code`, `country_code`) REFERENCES `countries` (`tenant_code`, `country_code`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
