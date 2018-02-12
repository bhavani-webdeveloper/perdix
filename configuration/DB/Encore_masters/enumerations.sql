-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Aug 19, 2016 at 06:47 PM
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
-- Table structure for table `enumerations`
--

CREATE TABLE IF NOT EXISTS `enumerations` (
  `id` int(4) unsigned NOT NULL AUTO_INCREMENT,
  `version` int(4) NOT NULL DEFAULT '0',
  `tenant_code` varchar(10) NOT NULL,
  `classifier` varchar(45) DEFAULT NULL,
  `code` varchar(50) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `reference` varchar(20) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `last_edited_at` datetime DEFAULT NULL,
  `last_edited_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tenant_code` (`tenant_code`,`classifier`,`code`),
  KEY `tenant_code_2` (`tenant_code`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=61 ;

--
-- Dumping data for table `enumerations`
--

INSERT INTO `enumerations` (`version`, `tenant_code`, `classifier`, `code`, `name`, `reference`, `created_at`, `created_by`, `last_edited_at`, `last_edited_by`) VALUES
(0, 'KGFS', 'LoanPurpose', 'JW', 'Jewel', NULL, '2012-11-22 16:15:01', 'admin', NULL, NULL),
(0, 'KGFS', 'LoanPurpose', 'OT', 'Others', NULL, '2012-11-22 16:15:01', 'admin', NULL, NULL),
(0, 'KGFS', 'LoanPurpose', 'WC', 'Working Capital', NULL, '2012-11-22 16:15:01', 'admin', NULL, NULL),
(0, 'KGFS', 'Gender', 'F', 'Female', NULL, '2012-11-22 16:15:01', 'admin', NULL, NULL),
(0, 'KGFS', 'Gender', 'M', 'Male', NULL, '2012-11-22 16:15:01', 'admin', NULL, NULL),
(0, 'KGFS', 'Salutation', 'Mr', 'Mister', NULL, '2012-11-22 16:15:01', 'admin', NULL, NULL),
(0, 'KGFS', 'Salutation', 'Mrs', 'Mrs', NULL, '2012-11-22 16:15:01', 'admin', NULL, NULL),
(0, 'KGFS', 'Salutation', 'Ms', 'Miss', NULL, '2012-11-22 16:15:01', 'admin', NULL, NULL),
(0, 'KGFS', 'DomicileStatus', 'INDIAN', 'INDIAN', NULL, '2012-11-22 16:15:01', 'admin', NULL, NULL),
(0, 'KGFS', 'DomicileStatus', 'NRI', 'NRI', NULL, '2012-11-22 16:15:01', 'admin', NULL, NULL),
(0, 'KGFS', 'GLHead', 'Loans', 'Loans', NULL, '2012-11-22 16:15:01', 'admin', NULL, NULL),
(0, 'KGFS', 'GLHead', 'Deposits', 'Deposits', NULL, '2012-11-22 16:15:01', 'admin', NULL, NULL),
(0, 'KGFS', 'GLHead', 'Internal', 'Internal', NULL, '2012-11-22 16:15:01', 'admin', NULL, NULL),
(0, 'KGFS', 'RelationshipWithCustomer', 'Father', 'Father', NULL, '2012-11-22 16:15:01', 'admin', NULL, NULL),
(0, 'KGFS', 'RelationshipWithCustomer', 'Mother', 'Mother', NULL, '2012-11-22 16:15:01', 'admin', NULL, NULL),
(0, 'KGFS', 'RelationshipWithCustomer', 'Uncle', 'Uncle', NULL, '2012-11-22 16:15:01', 'admin', NULL, NULL),
(0, 'KGFS', 'Collateral', 'Unsecured', 'Unsecured', NULL, '2012-11-22 16:15:01', 'admin', NULL, NULL),
(0, 'KGFS', 'Collateral', 'Secured', 'Secured', NULL, '2012-11-22 16:15:01', 'admin', NULL, NULL),
(0, 'KGFS', 'GLSubheadGroupCode', 'Asset', 'Asset', NULL, '2013-03-07 11:12:23', 'admin', NULL, NULL),
(0, 'KGFS', 'GLSubheadGroupCode', 'Liability', 'Liability', NULL, '2013-03-07 11:12:23', 'admin', NULL, NULL),
(0, 'KGFS', 'GLSubheadGroupCode', 'Income', 'Income', NULL, '2013-03-07 11:12:23', 'admin', NULL, NULL),
(0, 'KGFS', 'GLSubheadGroupCode', 'Expense', 'Expense', NULL, '2013-03-07 11:12:23', 'admin', NULL, NULL),
(0, 'KGFS', 'GLHead', 'Casa', 'Casa', NULL, '2014-03-01 12:09:39', 'admin', NULL, NULL),
(0, 'MG', 'LoanPurpose', 'JW', 'Jewel', NULL, '2014-04-11 11:41:15', 'admin', NULL, NULL),
(0, 'MG', 'LoanPurpose', 'OT', 'Others', NULL, '2014-04-11 11:41:15', 'admin', NULL, NULL),
(0, 'MG', 'LoanPurpose', 'WC', 'Working Capital', NULL, '2014-04-11 11:41:15', 'admin', NULL, NULL),
(0, 'MG', 'Gender', 'F', 'Female', NULL, '2014-04-11 11:41:15', 'admin', NULL, NULL),
(0, 'MG', 'Gender', 'M', 'Male', NULL, '2014-04-11 11:41:15', 'admin', NULL, NULL),
(0, 'MG', 'Salutation', 'Mr', 'Mister', NULL, '2014-04-11 11:41:15', 'admin', NULL, NULL),
(0, 'MG', 'Salutation', 'Mrs', 'Mrs', NULL, '2014-04-11 11:41:15', 'admin', NULL, NULL),
(0, 'MG', 'Salutation', 'Ms', 'Miss', NULL, '2014-04-11 11:41:15', 'admin', NULL, NULL),
(0, 'MG', 'DomicileStatus', 'INDIAN', 'INDIAN', NULL, '2014-04-11 11:41:15', 'admin', NULL, NULL),
(0, 'MG', 'DomicileStatus', 'NRI', 'NRI', NULL, '2014-04-11 11:41:15', 'admin', NULL, NULL),
(0, 'MG', 'GLHead', 'Loans', 'Loans', NULL, '2014-04-11 11:41:15', 'admin', NULL, NULL),
(0, 'MG', 'GLHead', 'Deposits', 'Deposits', NULL, '2014-04-11 11:41:15', 'admin', NULL, NULL),
(0, 'MG', 'GLHead', 'Internal', 'Internal', NULL, '2014-04-11 11:41:15', 'admin', NULL, NULL),
(0, 'MG', 'RelationshipWithCustomer', 'Father', 'Father', NULL, '2014-04-11 11:41:15', 'admin', NULL, NULL),
(0, 'MG', 'RelationshipWithCustomer', 'Mother', 'Mother', NULL, '2014-04-11 11:41:15', 'admin', NULL, NULL),
(0, 'MG', 'RelationshipWithCustomer', 'Uncle', 'Uncle', NULL, '2014-04-11 11:41:15', 'admin', NULL, NULL),
(0, 'MG', 'Collateral', 'Unsecured', 'Unsecured', NULL, '2014-04-11 11:41:15', 'admin', NULL, NULL),
(0, 'MG', 'Collateral', 'Secured', 'Secured', NULL, '2014-04-11 11:41:15', 'admin', NULL, NULL),
(0, 'MG', 'GLSubheadGroupCode', 'Asset', 'Asset', NULL, '2014-04-11 11:41:15', 'admin', NULL, NULL),
(0, 'MG', 'GLSubheadGroupCode', 'Liability', 'Liability', NULL, '2014-04-11 11:41:15', 'admin', NULL, NULL),
(0, 'MG', 'GLSubheadGroupCode', 'Income', 'Income', NULL, '2014-04-11 11:41:15', 'admin', NULL, NULL),
(0, 'MG', 'GLSubheadGroupCode', 'Expense', 'Expense', NULL, '2014-04-11 11:41:15', 'admin', NULL, NULL),
(0, 'MG', 'GLHead', 'Casa', 'Casa', NULL, '2014-04-11 11:41:15', 'admin', NULL, NULL),
(0, 'KGFS', 'IdentityProofType', 'PAN', 'PAN', NULL, '2015-01-23 18:04:15', 'admin', NULL, NULL),
(0, 'KGFS', 'IdentityProofType', 'Passport', 'Passport', NULL, '2015-01-23 18:04:15', 'admin', NULL, NULL),
(0, 'KGFS', 'IdentityProofType', 'Aadhaar', 'Aadhaar', NULL, '2015-01-23 18:04:15', 'admin', NULL, NULL),
(0, 'KGFS', 'IdentityProofType', 'RC', 'Ration Card', NULL, '2015-01-23 18:04:15', 'admin', NULL, NULL),
(0, 'KGFS', 'IdentityProofType', 'DL', 'Driving License', NULL, '2015-01-23 18:04:15', 'admin', NULL, NULL),
(0, 'KGFS', 'AddressProofType', 'Passport', 'Passport', NULL, '2015-01-23 18:04:15', 'admin', NULL, NULL),
(0, 'KGFS', 'AddressProofType', 'Aadhaar', 'Aadhaar', NULL, '2015-01-23 18:04:15', 'admin', NULL, NULL),
(0, 'KGFS', 'AddressProofType', 'RC', 'Ration Card', NULL, '2015-01-23 18:04:15', 'admin', NULL, NULL),
(0, 'KGFS', 'AddressProofType', 'DL', 'Driving License', NULL, '2015-01-23 18:04:15', 'admin', NULL, NULL),
(0, 'KGFS', 'FeeName', 'Processing Fee', 'Processing Fee', NULL, '2016-01-01 10:14:35', 'admin', NULL, NULL),
(0, 'KGFS', 'FeeName', 'AdHoc Fee', 'AdHoc Fee', NULL, '2016-01-01 10:14:35', 'admin', NULL, NULL),
(0, 'KGFS', 'FeeName', 'Portfolio Insurance Premium', 'Portfolio Insurance Premium', NULL, '2016-01-01 10:14:35', 'admin', NULL, NULL),
(0, 'KGFS', 'FeeName', 'Operational Fee', 'Operational Fee', NULL, '2016-02-22 17:18:41', 'admin', NULL, NULL);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `enumerations`
--
ALTER TABLE `enumerations`
  ADD CONSTRAINT `enumerations_ibfk_1` FOREIGN KEY (`tenant_code`) REFERENCES `tenants` (`tenant_code`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
