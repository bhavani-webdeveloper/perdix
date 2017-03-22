-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Aug 19, 2016 at 06:17 PM
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
-- Table structure for table `countries`
--

CREATE TABLE IF NOT EXISTS `countries` (
  `version` int(4) NOT NULL DEFAULT '0',
  `id` int(4) unsigned NOT NULL AUTO_INCREMENT,
  `tenant_code` varchar(10) NOT NULL,
  `country_code` varchar(50) NOT NULL,
  `country_name` varchar(50) NOT NULL,
  `created_at` datetime NOT NULL,
  `created_by` varchar(45) NOT NULL,
  `last_edited_at` datetime DEFAULT NULL,
  `last_edited_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tenant_code` (`tenant_code`,`country_code`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `countries`
--

INSERT INTO `countries` (`version`, `tenant_code`, `country_code`, `country_name`, `created_at`, `created_by`, `last_edited_at`, `last_edited_by`) VALUES
(0, 'KGFS', 'IN', 'India', '2012-03-15 10:22:12', 'admin', NULL, NULL),
(0, 'MG', '1', 'India', '2014-04-11 11:40:32', 'admin', NULL, NULL),
(0, 'MG', '2', 'Russia', '2014-04-11 11:40:32', 'admin', NULL, NULL),
(0, 'KGFS', 'US', 'USA', '2015-01-09 18:40:05', 'admin', NULL, NULL);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `countries`
--
ALTER TABLE `countries`
  ADD CONSTRAINT `countries_ibfk_1` FOREIGN KEY (`tenant_code`) REFERENCES `tenants` (`tenant_code`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
