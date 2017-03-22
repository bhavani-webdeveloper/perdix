-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Aug 19, 2016 at 06:16 PM
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
-- Table structure for table `tenants`
--

CREATE TABLE IF NOT EXISTS `tenants` (
  `version` int(4) NOT NULL DEFAULT '0',
  `id` int(4) unsigned NOT NULL AUTO_INCREMENT,
  `tenant_code` varchar(10) NOT NULL,
  `tenant_name` varchar(50) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `created_by` varchar(45) NOT NULL,
  `last_edited_at` datetime DEFAULT NULL,
  `last_edited_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tenant_code` (`tenant_code`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `tenants`
--

INSERT INTO `tenants` (`version`, `tenant_code`, `tenant_name`, `created_at`, `created_by`, `last_edited_at`, `last_edited_by`) VALUES
(0, 'KGFS', 'KGFS', '2012-10-30 18:33:23', 'admin', NULL, NULL),
(0, 'HDFC', 'HDFC Bank', '2012-10-30 18:33:24', 'admin', NULL, NULL),
(0, 'ICICI', 'ICICI Bank', '2012-10-30 18:33:24', 'admin', NULL, NULL),
(0, 'MG', 'MG', '2014-04-11 11:33:08', 'admin', NULL, NULL);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
