-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Aug 19, 2016 at 06:41 PM
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
-- Table structure for table `districts`
--

CREATE TABLE IF NOT EXISTS `districts` (
  `id` int(4) unsigned NOT NULL AUTO_INCREMENT,
  `version` int(4) NOT NULL DEFAULT '0',
  `tenant_code` varchar(10) NOT NULL,
  `district_code` varchar(50) NOT NULL,
  `district_name` varchar(50) DEFAULT NULL,
  `state_code` varchar(50) NOT NULL,
  `country_code` varchar(50) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `last_edited_at` datetime DEFAULT NULL,
  `last_edited_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tenant_code` (`tenant_code`,`country_code`,`state_code`,`district_code`),
  KEY `tenant_code_2` (`tenant_code`,`state_code`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=30 ;

--
-- Dumping data for table `districts`
--

INSERT INTO `districts` (`version`, `tenant_code`, `district_code`, `district_name`, `state_code`, `country_code`, `created_at`, `created_by`, `last_edited_at`, `last_edited_by`) VALUES
(0, 'KGFS', 'Thanjavur', 'Thanjavur', 'Tamilnadu', 'IN', '2012-11-02 15:09:41', 'admin', NULL, NULL),
(0, 'KGFS', 'Thiruvarur', 'Thiruvarur', 'Tamilnadu', 'IN', '2012-11-02 15:09:41', 'admin', NULL, NULL),
(0, 'KGFS', 'MAHESANA', 'MAHESANA', 'Gujarat', 'IN', '2012-11-02 15:09:41', 'admin', NULL, NULL),
(0, 'KGFS', 'Ganjam', 'Ganjam', 'Odisha', 'IN', '2012-11-02 15:09:41', 'admin', NULL, NULL),
(0, 'KGFS', 'Tehri Garhwal', 'Tehri Garhwal', 'Uttarakhand', 'IN', '2012-11-02 15:09:41', 'admin', NULL, NULL),
(0, 'KGFS', 'Pudukkottai', 'Pudukkottai', 'Tamilnadu', 'IN', '2012-11-02 15:09:41', 'admin', NULL, NULL),
(0, 'KGFS', 'Dehradun', 'Dehradun', 'Uttarakhand', 'IN', '2012-11-02 15:09:41', 'admin', NULL, NULL),
(0, 'KGFS', 'Ghansali', 'Ghansali', 'Uttarakhand', 'IN', '2012-11-02 15:09:41', 'admin', NULL, NULL),
(0, 'KGFS', 'Uttarkashi', 'Uttarkashi', 'Uttarakhand', 'IN', '2012-11-02 15:09:41', 'admin', NULL, NULL),
(0, 'KGFS', 'KHURDA', 'KHURDA', 'Uttarakhand', 'IN', '2012-11-02 15:09:41', 'admin', NULL, NULL),
(0, 'KGFS', 'KORAPUT', 'KORAPUT', 'Uttarakhand', 'IN', '2012-11-02 15:09:41', 'admin', NULL, NULL),
(0, 'KGFS', 'PURI', 'PURI', 'Uttarakhand', 'IN', '2012-11-02 15:09:42', 'admin', NULL, NULL),
(0, 'KGFS', 'JAUNPUR', 'JAUNPUR', 'Uttarakhand', 'IN', '2012-11-02 15:09:42', 'admin', NULL, NULL),
(0, 'KGFS', 'JAJPUR', 'JAJPUR', 'Uttarakhand', 'IN', '2012-11-02 15:09:42', 'admin', NULL, NULL),
(0, 'KGFS', 'Ariyalur', 'Ariyalur', 'Tamilnadu', 'IN', '2012-11-02 15:09:42', 'admin', NULL, NULL),
(0, 'KGFS', 'Pudukottai', 'Pudukottai', 'Tamilnadu', 'IN', '2012-11-02 15:09:42', 'admin', NULL, NULL),
(0, 'KGFS', 'Rudraprayag', 'Rudraprayag', 'Uttarakhand', 'IN', '2013-08-06 12:03:33', 'admin', NULL, NULL),
(0, 'KGFS', 'Chamoli', 'Chamoli', 'Uttarakhand', 'IN', '2013-08-06 17:48:23', 'admin', NULL, NULL),
(0, 'KGFS', 'Krishnagiri', 'Krishnagiri', 'Tamilnadu', 'IN', '2013-12-12 18:00:05', 'admin', NULL, NULL),
(0, 'KGFS', 'Gurgaon', 'Gurgaon', 'Haryana', 'IN', '2014-11-14 17:54:43', 'testuser', NULL, NULL),
(0, 'KGFS', 'SFO', 'San Francisco', 'CA', 'US', '2015-01-09 18:45:15', 'admin', NULL, NULL),
(0, 'KGFS', 'Chennai', 'Chennai', 'Tamilnadu', 'IN', '2016-05-11 18:47:12', 'admin', NULL, NULL),
(0, 'KGFS', 'Deoria', 'Deoria', 'Bihar', 'IN', '2016-06-11 15:12:01', 'admin', NULL, NULL),
(0, 'KGFS', '274001', 'Deoria', 'Uttar Pradesh', 'IN', '2016-06-11 19:59:02', 'admin', NULL, NULL),
(0, 'KGFS', 'Patna', 'Patna', 'Bihar', 'IN', '2016-06-12 16:55:57', 'admin', NULL, NULL),
(0, 'KGFS', 'Deoria', 'Deoria', 'Uttar Pradesh', 'IN', '2016-06-17 18:00:46', 'admin', NULL, NULL),
(0, 'KGFS', 'PURI', 'PURI', 'Tamilnadu', 'IN', '2016-07-26 20:55:42', 'admin', NULL, NULL),
(0, 'KGFS', 'Tehri Garhwal', 'Tehri Garhwal', 'Tamilnadu', 'IN', '2016-07-26 20:56:08', 'admin', NULL, NULL);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `districts`
--
ALTER TABLE `districts`
  ADD CONSTRAINT `districts_ibfk_1` FOREIGN KEY (`tenant_code`, `country_code`, `state_code`) REFERENCES `states` (`tenant_code`, `country_code`, `state_code`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
