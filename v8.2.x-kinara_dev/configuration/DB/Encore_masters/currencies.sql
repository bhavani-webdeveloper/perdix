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
-- Table structure for table `currencies`
--

CREATE TABLE IF NOT EXISTS `currencies` (
  `version` int(4) NOT NULL DEFAULT '0',
  `id` int(4) unsigned NOT NULL AUTO_INCREMENT,
  `tenant_code` varchar(10) NOT NULL,
  `currency_code` varchar(3) NOT NULL,
  `currency_name` varchar(45) DEFAULT NULL,
  `integer_digits` int(4) DEFAULT NULL,
  `fraction_digits` int(4) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `created_by` varchar(45) NOT NULL,
  `last_edited_at` datetime DEFAULT NULL,
  `last_edited_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tenant_code` (`tenant_code`,`currency_code`),
  KEY `tenant_code_2` (`tenant_code`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `currencies`
--

INSERT INTO `currencies` (`version`, `tenant_code`, `currency_code`, `currency_name`, `integer_digits`, `fraction_digits`, `created_at`, `created_by`, `last_edited_at`, `last_edited_by`) VALUES
(0, 'KGFS', 'INR', 'Indian Rupee', 8, 2, '2012-03-15 10:22:12', 'admin', NULL, NULL),
(0, 'MG', 'INR', 'Indian Rupee', 8, 2, '2014-04-11 11:40:36', 'admin', NULL, NULL);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `currencies`
--
ALTER TABLE `currencies`
  ADD CONSTRAINT `currencies_ibfk_1` FOREIGN KEY (`tenant_code`) REFERENCES `tenants` (`tenant_code`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
