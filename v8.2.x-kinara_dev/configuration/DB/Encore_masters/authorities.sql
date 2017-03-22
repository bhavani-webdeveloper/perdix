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
-- Table structure for table `authorities`
--

CREATE TABLE IF NOT EXISTS `authorities` (
  `version` int(4) NOT NULL DEFAULT '0',
  `id` int(4) unsigned NOT NULL AUTO_INCREMENT,
  `tenant_code` varchar(10) NOT NULL,
  `authority_code` varchar(100) NOT NULL,
  `role_code` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL,
  `created_by` varchar(45) NOT NULL,
  `last_edited_at` datetime DEFAULT NULL,
  `last_edited_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tenant_code` (`tenant_code`,`authority_code`,`role_code`) USING BTREE,
  KEY `tenant_code_5` (`tenant_code`,`role_code`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=31 ;

--
-- Dumping data for table `authorities`
--

INSERT INTO `authorities` (`version`, `tenant_code`, `authority_code`, `role_code`, `created_at`, `created_by`, `last_edited_at`, `last_edited_by`) VALUES
(0, 'KGFS', 'Basic', 'Agent', '2012-10-30 18:33:25', 'admin', NULL, NULL),
(0, 'KGFS', 'LO', 'Agent', '2012-10-30 18:33:25', 'admin', NULL, NULL),
(0, 'KGFS', 'Basic', 'Manager', '2012-10-30 18:33:25', 'admin', NULL, NULL),
(0, 'KGFS', 'LM', 'Manager', '2012-10-30 18:33:25', 'admin', NULL, NULL),
(0, 'KGFS', 'Basic', 'WM', '2012-10-30 18:33:25', 'admin', NULL, NULL),
(0, 'KGFS', 'LO', 'WM', '2012-10-30 18:33:25', 'admin', NULL, NULL),
(0, 'KGFS', 'Basic', 'Admin', '2012-10-30 18:33:25', 'admin', NULL, NULL),
(0, 'KGFS', 'SA', 'Admin', '2012-10-30 18:33:25', 'admin', NULL, NULL),
(0, 'KGFS', 'LM', 'Admin', '2012-10-30 18:33:25', 'admin', NULL, NULL),
(0, 'KGFS', 'Batch', 'Admin', '2012-10-30 18:33:25', 'admin', NULL, NULL),
(0, 'KGFS', 'Basic', 'BO', '2012-10-30 18:33:25', 'admin', NULL, NULL),
(0, 'KGFS', 'Batch', 'BO', '2012-10-30 18:33:25', 'admin', NULL, NULL),
(0, 'MG', 'Basic', 'Agent', '2014-04-11 11:39:18', 'admin', NULL, NULL),
(0, 'MG', 'LO', 'Agent', '2014-04-11 11:39:18', 'admin', NULL, NULL),
(0, 'MG', 'Basic', 'Manager', '2014-04-11 11:39:18', 'admin', NULL, NULL),
(0, 'MG', 'LM', 'Manager', '2014-04-11 11:39:18', 'admin', NULL, NULL),
(0, 'MG', 'Basic', 'WM', '2014-04-11 11:39:18', 'admin', NULL, NULL),
(0, 'MG', 'LO', 'WM', '2014-04-11 11:39:18', 'admin', NULL, NULL),
(0, 'MG', 'Basic', 'Admin', '2014-04-11 11:39:18', 'admin', NULL, NULL),
(0, 'MG', 'SA', 'Admin', '2014-04-11 11:39:18', 'admin', NULL, NULL),
(0, 'MG', 'LM', 'Admin', '2014-04-11 11:39:18', 'admin', NULL, NULL),
(0, 'MG', 'Batch', 'Admin', '2014-04-11 11:39:18', 'admin', NULL, NULL),
(0, 'MG', 'Basic', 'BO', '2014-04-11 11:39:18', 'admin', NULL, NULL),
(0, 'MG', 'Batch', 'BO', '2014-04-11 11:39:18', 'admin', NULL, NULL);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `authorities`
--
ALTER TABLE `authorities`
  ADD CONSTRAINT `authorities_ibfk_1` FOREIGN KEY (`tenant_code`) REFERENCES `tenants` (`tenant_code`),
  ADD CONSTRAINT `authorities_ibfk_6` FOREIGN KEY (`tenant_code`, `role_code`) REFERENCES `roles` (`tenant_code`, `role_code`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
