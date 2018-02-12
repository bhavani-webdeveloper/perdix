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
-- Table structure for table `cities`
--

CREATE TABLE IF NOT EXISTS `cities` (
  `version` int(4) NOT NULL DEFAULT '0',
  `id` int(4) unsigned NOT NULL AUTO_INCREMENT,
  `tenant_code` varchar(10) NOT NULL,
  `city_code` varchar(50) NOT NULL,
  `city_name` varchar(50) NOT NULL,
  `state_code` varchar(50) NOT NULL,
  `country_code` varchar(50) NOT NULL,
  `created_at` datetime NOT NULL,
  `created_by` varchar(45) NOT NULL,
  `last_edited_at` datetime DEFAULT NULL,
  `last_edited_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tenant_code` (`tenant_code`,`country_code`,`state_code`,`city_code`),
  KEY `tenant_code_2` (`tenant_code`,`state_code`),
  KEY `tenant_code_3` (`tenant_code`,`country_code`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=74 ;

--
-- Dumping data for table `cities`
--

INSERT INTO `cities` (`version`, `tenant_code`, `city_code`, `city_name`, `state_code`, `country_code`, `created_at`, `created_by`, `last_edited_at`, `last_edited_by`) VALUES
(0, 'KGFS', 'Thanjavur', 'Thanjavur', 'Tamilnadu', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'Thiruvarur', 'Thiruvarur', 'Tamilnadu', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'MAHESANA', 'MAHESANA', 'Gujarat', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'Tehri Garhwal', 'Tehri Garhwal', 'Uttarakhand', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'Pudukkottai', 'Pudukkottai', 'Tamilnadu', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'Dehradun', 'Dehradun', 'Uttarakhand', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'Ghansali', 'Ghansali', 'Uttarakhand', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'Uttarkashi', 'Uttarkashi', 'Uttarakhand', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'KHURDA', 'KHURDA', 'Uttarakhand', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'KORAPUT', 'KORAPUT', 'Uttarakhand', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'PURI', 'PURI', 'Uttarakhand', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'JAUNPUR', 'JAUNPUR', 'Uttarakhand', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'JAJPUR', 'JAJPUR', 'Uttarakhand', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'Ariyalur', 'Ariyalur', 'Tamilnadu', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'Pudukottai', 'Pudukottai', 'Tamilnadu', 'IN', '2012-09-27 11:13:11', 'admin', NULL, NULL),
(0, 'KGFS', 'Ganjam', 'Ganjam', 'Odisha', 'IN', '2013-04-01 14:12:03', 'SYSTEM', '2013-04-01 14:12:03', 'SYSTEM'),
(0, 'KGFS', 'Rudraprayag', 'Rudraprayag', 'Uttarakhand', 'IN', '2013-08-06 12:03:50', 'admin', NULL, NULL),
(0, 'KGFS', 'Chamoli', 'Chamoli', 'Uttarakhand', 'IN', '2013-08-06 17:48:34', 'admin', NULL, NULL),
(0, 'KGFS', 'Krishnagiri', 'Krishnagiri', 'Tamilnadu', 'IN', '2013-12-12 18:00:22', 'admin', NULL, NULL),
(0, 'MG', '1', 'Bangalore', '1', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '2', 'Hassan', '1', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '3', 'Kamrup', '3', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '4', 'Margaon', '3', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '5', 'Deoghar', '4', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '6', 'Ranebennur', '1', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '7', 'Hirekeruru', '1', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '8', 'Siddapura', '1', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '9', 'Mysore', '1', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '10', 'Kollegal', '1', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '11', 'Denkanikottai', '1', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '12', 'Sirsi', '1', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '13', 'Hubli', '1', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '14', 'Bangalore South', '1', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '15', 'Attibele', '1', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '16', 'Siggoan', '1', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '17', 'Hanagal', '1', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '18', 'Yadagiri', '1', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '19', 'Navalgunda', '1', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '20', 'Naragunda', '1', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '21', 'Shahapur', '1', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '22', 'Koppal', '1', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '23', 'Byadagi', '1', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '24', 'Kundagola', '1', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '25', 'Raychur', '1', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '26', 'Bidar', '1', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '27', 'Gadag', '1', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '28', 'Bhagevadi', '1', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '29', 'Kalaghatagi', '1', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '30', 'Haveri', '1', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '31', 'Thirthalli', '1', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '32', 'Vedasandar Taluk', '2', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '33', 'Kurur', '2', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '34', 'Trichy', '2', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '35', 'Manupparai', '2', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '36', 'Madurai', '2', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '37', 'Dindigul', '2', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '38', 'Bagalkot', '1', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '39', 'Bijapur', '1', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '40', 'Shivmogga', '1', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '41', 'Uttar kannada', '1', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '42', 'Dharwad', '1', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '43', 'Gulbarga', '1', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'MG', '44', 'Belgaum', '1', '1', '2014-04-11 11:40:13', 'admin', NULL, NULL),
(0, 'KGFS', '0124', 'Gurgaon', 'Haryana', 'IN', '2014-11-14 16:32:55', 'testuser', NULL, NULL),
(0, 'KGFS', 'SC', 'Santa Clara', 'CA', 'US', '2015-01-09 18:45:46', 'admin', NULL, NULL),
(0, 'KGFS', 'Chennai', 'Chennai', 'Tamilnadu', 'IN', '2016-05-11 18:48:11', 'admin', NULL, NULL),
(0, 'KGFS', '2740001', 'Deoria', 'Bihar', 'IN', '2016-06-11 15:13:00', 'admin', NULL, NULL),
(0, 'KGFS', 'Deoria', 'Deoria', 'Uttar Pradesh', 'IN', '2016-06-11 19:56:22', 'admin', NULL, NULL),
(0, 'KGFS', 'Patna', 'Patna', 'Bihar', 'IN', '2016-06-12 16:56:16', 'admin', NULL, NULL),
(0, 'KGFS', 'Deoria', 'Deoria', 'Bihar', 'IN', '2016-06-12 18:22:03', 'admin', NULL, NULL),
(0, 'KGFS', 'PURI', 'PURI', 'Tamilnadu', 'IN', '2016-07-26 20:56:30', 'admin', NULL, NULL),
(0, 'KGFS', 'Tehri Garhwal', 'Tehri Garhwal', 'Tamilnadu', 'IN', '2016-07-26 20:56:49', 'admin', NULL, NULL);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cities`
--
ALTER TABLE `cities`
  ADD CONSTRAINT `cities_ibfk_1` FOREIGN KEY (`tenant_code`, `country_code`, `state_code`) REFERENCES `states` (`tenant_code`, `country_code`, `state_code`),
  ADD CONSTRAINT `cities_ibfk_2` FOREIGN KEY (`tenant_code`) REFERENCES `tenants` (`tenant_code`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
