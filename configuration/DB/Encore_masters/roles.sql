-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Aug 19, 2016 at 06:50 PM
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
-- Table structure for table `roles`
--

CREATE TABLE IF NOT EXISTS `roles` (
  `version` int(4) NOT NULL DEFAULT '0',
  `id` int(4) unsigned NOT NULL AUTO_INCREMENT,
  `tenant_code` varchar(10) NOT NULL,
  `role_code` varchar(50) NOT NULL,
  `role_name` varchar(100) NOT NULL,
  `description` varchar(200) NOT NULL,
  `created_at` datetime NOT NULL,
  `created_by` varchar(45) NOT NULL,
  `last_edited_at` datetime DEFAULT NULL,
  `last_edited_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tenant_code` (`tenant_code`,`role_code`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=14 ;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`version`, `tenant_code`, `role_code`, `role_name`, `description`, `created_at`, `created_by`, `last_edited_at`, `last_edited_by`) VALUES
(0, 'KGFS', 'WM', 'Wealth Manager', 'Wealth Manager', '2012-10-30 19:36:04', 'admin', NULL, NULL),
(0, 'KGFS', 'Agent', 'Agent', 'Agent', '2012-10-30 19:36:04', 'admin', NULL, NULL),
(0, 'KGFS', 'Manager', 'Regional Manager', 'Regional Manager', '2012-10-30 19:36:04', 'admin', NULL, NULL),
(0, 'KGFS', 'Admin', 'Administrator', 'Administrator', '2012-10-30 19:36:04', 'admin', NULL, NULL),
(0, 'KGFS', 'BO', 'Batch Operator', 'Batch Operator', '2012-10-30 19:36:04', 'admin', NULL, NULL),
(0, 'MG', 'WM', 'Wealth Manager', 'Wealth Manager', '2014-04-11 11:34:11', 'admin', NULL, NULL),
(0, 'MG', 'Agent', 'Agent', 'Agent', '2014-04-11 11:34:11', 'admin', NULL, NULL),
(0, 'MG', 'Manager', 'Regional Manager', 'Regional Manager', '2014-04-11 11:34:11', 'admin', NULL, NULL),
(0, 'MG', 'Admin', 'Administrator', 'Administrator', '2014-04-11 11:34:11', 'admin', NULL, NULL),
(0, 'MG', 'BO', 'Batch Operator', 'Batch Operator', '2014-04-11 11:34:11', 'admin', NULL, NULL);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `roles`
--
ALTER TABLE `roles`
  ADD CONSTRAINT `roles_ibfk_1` FOREIGN KEY (`tenant_code`) REFERENCES `tenants` (`tenant_code`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
