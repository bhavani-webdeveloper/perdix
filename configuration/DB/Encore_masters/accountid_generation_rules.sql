-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Aug 19, 2016 at 06:52 PM
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
-- Table structure for table `accountid_generation_rules`
--

CREATE TABLE IF NOT EXISTS `accountid_generation_rules` (
  `id` int(4) unsigned NOT NULL AUTO_INCREMENT,
  `version` int(4) NOT NULL DEFAULT '0',
  `tenant_code` varchar(10) NOT NULL,
  `rule_code` varchar(45) NOT NULL,
  `padding` varchar(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `part1_type` int(11) DEFAULT NULL,
  `num_part1_digits` int(11) DEFAULT NULL,
  `part2_type` int(11) DEFAULT NULL,
  `num_part2_digits` int(11) DEFAULT NULL,
  `part3_type` int(11) DEFAULT NULL,
  `num_part3_digits` int(11) DEFAULT NULL,
  `part4_type` int(11) DEFAULT NULL,
  `num_part4_digits` int(11) DEFAULT NULL,
  `part5_type` int(11) DEFAULT NULL,
  `num_part5_digits` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `created_by` varchar(45) NOT NULL,
  `last_edited_at` datetime DEFAULT NULL,
  `last_edited_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tenant_code` (`tenant_code`,`rule_code`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `accountid_generation_rules`
--

INSERT INTO `accountid_generation_rules` (`version`, `tenant_code`, `rule_code`, `padding`, `name`, `part1_type`, `num_part1_digits`, `part2_type`, `num_part2_digits`, `part3_type`, `num_part3_digits`, `part4_type`, `num_part4_digits`, `part5_type`, `num_part5_digits`, `created_at`, `created_by`, `last_edited_at`, `last_edited_by`) VALUES
(0, 'KGFS', 'AR1', '1', 'Loan', 3, 4, 1, 3, 4, 5, 0, 0, 0, 0, '2012-10-30 18:33:28', 'admin', NULL, NULL),
(0, 'KGFS', 'AR2', '2', 'Internal', 2, 2, 4, 10, 0, 0, 0, 0, 0, 5, '2012-10-30 18:33:28', 'admin', NULL, NULL),
(0, 'KGFS', 'AR3', '3', 'Savings', 3, 4, 5, 3, 4, 5, 0, 0, 0, 0, '2012-10-30 18:33:28', 'admin', NULL, NULL),
(0, 'MG', 'AR1', '0', 'Loan', 3, 4, 1, 3, 4, 5, 0, 0, 0, 0, '2014-04-11 11:39:06', 'admin', NULL, NULL),
(0, 'MG', 'AR2', '2', 'Internal', 2, 2, 4, 10, 0, 0, 0, 0, 0, 5, '2014-04-11 11:39:06', 'admin', NULL, NULL),
(0, 'MG', 'AR3', '3', 'Savings', 3, 4, 5, 3, 4, 5, 0, 0, 0, 0, '2014-04-11 11:39:06', 'admin', NULL, NULL);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accountid_generation_rules`
--
ALTER TABLE `accountid_generation_rules`
  ADD CONSTRAINT `accountid_generation_rules_ibfk_1` FOREIGN KEY (`tenant_code`) REFERENCES `tenants` (`tenant_code`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
