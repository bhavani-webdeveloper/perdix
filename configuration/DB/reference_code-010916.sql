-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Sep 01, 2016 at 07:10 AM
-- Server version: 5.6.31-0ubuntu0.14.04.2
-- PHP Version: 5.5.9-1ubuntu4.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `financialForms`
--

-- --------------------------------------------------------

--
-- Table structure for table `reference_code`
--

CREATE TABLE `reference_code` (
  `id` bigint(20) NOT NULL,
  `version` int(11) NOT NULL DEFAULT '0',
  `classifier` varchar(30) NOT NULL,
  `name` varchar(100) NOT NULL,
  `code` varchar(50) NOT NULL,
  `parent_classifier` varchar(30) DEFAULT NULL,
  `parent_reference_code` varchar(50) DEFAULT NULL,
  `field1` varchar(100) DEFAULT NULL,
  `field2` varchar(100) DEFAULT NULL,
  `field3` varchar(100) DEFAULT NULL,
  `field4` varchar(100) DEFAULT NULL,
  `field5` varchar(100) DEFAULT NULL,
  `created_by` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_edited_by` varchar(50) DEFAULT NULL,
  `last_edited_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `reference_code`
--

INSERT INTO `reference_code` (`id`, `version`, `classifier`, `name`, `code`, `parent_classifier`, `parent_reference_code`, `field1`, `field2`, `field3`, `field4`, `field5`, `created_by`, `created_at`, `last_edited_by`, `last_edited_at`) VALUES
(1, 1, 'bank', 'Kinara', '1', NULL, NULL, 'Kinara', NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-30 05:33:45', NULL, '2016-08-30 05:33:45'),
(3, 0, 'branch', 'Bommasandra', '2', 'bank', '1', '1002', NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-20 20:23:37', 'adminkinara', '2016-08-20 20:23:37'),
(6, 1, 'branch', 'Bangalore', '1', 'bank', '1', '1001', NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-30 05:33:45', NULL, '2016-08-30 05:33:45'),
(7, 0, 'village', 'Indira Nagar', '3523', 'branch', '1', '560038001', NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-21 07:27:53', 'adminkinara', '2016-08-21 07:27:53'),
(8, 0, 'centre', 'Bommasandra Centre', '1002-01', 'branch', '2', '2', 'ACTIVE', NULL, NULL, '1002-01', 'adminkinara', '2016-08-23 10:02:46', 'adminkinara', '2016-08-23 10:02:46'),
(13, 0, 'collateral_type', 'Two Wheeler', 'Two Wheeler', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'migration', '2016-08-30 05:33:45', NULL, '2016-08-30 05:33:45'),
(14, 0, 'collateral_type', 'Four Wheeler', 'Four Wheeler', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'migration', '2016-08-30 05:33:45', NULL, '2016-08-30 05:33:45'),
(15, 0, 'collateral_type', 'House', 'House', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'migration', '2016-08-30 05:33:45', NULL, '2016-08-30 05:33:45'),
(16, 0, 'collateral_type', 'Shop', 'Shop', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'migration', '2016-08-30 05:33:45', NULL, '2016-08-30 05:33:45'),
(158, 1, 'partner', 'Kinara', 'Kinara', NULL, NULL, NULL, '1', NULL, NULL, NULL, 'adminkinara', '2016-08-20 05:18:53', NULL, '2016-08-20 05:18:53'),
(159, 1, 'loan_product', 'Kinara Test Product', '1', 'partner', 'Kinara', 'T901', NULL, 'OWN', 'EQ', NULL, 'adminkinara', '2016-08-30 05:33:45', 'adminkinara', '2016-08-30 05:33:45'),
(483, 1, 'constitution', 'Proprietorship', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(484, 1, 'constitution', 'Partnership', '2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(485, 1, 'constitution', 'Private LTD', '3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(486, 1, 'business_registered', 'Yes', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(487, 1, 'business_registered', 'No', '2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(488, 1, 'business_registration_type', 'Tin', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(489, 1, 'business_registration_type', 'SSI No', '2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(490, 1, 'business_registration_type', 'Vat No', '3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(491, 1, 'business_registration_type', 'Business Pan Card No', '4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(492, 1, 'business_registration_type', 'Service Tax No', '5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(493, 1, 'business_registration_type', 'DIC', '6', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(494, 1, 'business_registration_type', 'MSME', '7', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(495, 1, 'business_registration_type', 'S & E', '8', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(496, 1, 'business_registration_type', 'PAN (mandatory if Pvt Ltd)', '9', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(497, 1, 'business_history', 'Clean - Single owner/structure', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(498, 1, 'business_history', 'Partnership with 2 partners', '2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(499, 1, 'business_history', 'Partnership with more than 2 partners', '3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(500, 1, 'business_history', 'Previously closed another business', '4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(501, 1, 'business_history', 'Previously dissolved partnership', '5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(502, 1, 'distance_from_centre', 'In the spoke', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(503, 1, 'distance_from_centre', 'Just outside the Spoke', '2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(504, 1, 'distance_from_centre', '5 kms from the closest spoke', '3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(505, 1, 'distance_from_centre', '10 kms from the closest spoke', '4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(506, 1, 'distance_from_centre', '>10 kms from the closest spoke', '5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(507, 1, 'ownership', 'Owned', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(508, 1, 'ownership', 'Rented', '2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(509, 1, 'ownership', 'Leased', '3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(510, 1, 'years_in_current_area', 'Less Than 1 Year', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(511, 1, 'years_in_current_area', '1 to 2 Years', '2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(512, 1, 'years_in_current_area', '2 to 3 Years', '3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(513, 1, 'years_in_current_area', '3 to 5 Years', '4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(514, 1, 'years_in_current_area', '5 to 10 Years', '5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(515, 1, 'years_in_current_area', 'Greater Than 10 Years', '6', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(516, 1, 'years_in_current_address', 'Less Than 1 Year', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(517, 1, 'years_in_current_address', '1 to 3 Years', '2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(518, 1, 'years_in_current_address', '4 to 6 Years', '3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(519, 1, 'years_in_current_address', '6 to 10 Years', '4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(520, 1, 'years_in_current_address', 'Greater than 10 Years', '5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(521, 1, 'years_in_present_area', 'Less than 1 Year', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(522, 1, 'years_in_present_area', '1 to to 3 Years', '2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(523, 1, 'years_in_present_area', '4 to to 6 Years', '3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(524, 1, 'years_in_present_area', '6 to to 10 Years', '4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(525, 1, 'years_in_present_area', 'Greater than 10 Years', '5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(526, 1, 'years_of_experience', 'No experience', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(527, 1, 'years_of_experience', 'Less Than 4 years', '2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(528, 1, 'years_of_experience', '4 to 7 Years', '3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(529, 1, 'years_of_experience', '7 to 10 Years', '4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(530, 1, 'years_of_experience', 'Greater than 10 Years', '5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(531, 1, 'account_type', 'Current', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(532, 1, 'account_type', 'Savings', '2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(533, 1, 'account_type', 'OD', '3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(534, 1, 'account_type', 'CC', '4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(542, 1, 'identity_proof', 'Ration Card', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(543, 1, 'identity_proof', 'Voter Card', '2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(544, 1, 'identity_proof', 'Passport', '3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(545, 1, 'identity_proof', 'Pan Card', '4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(546, 1, 'identity_proof', 'Aadhar Card', '5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(547, 1, 'identity_proof', 'Driving Licence', '6', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(548, 1, 'relationship_with_business', 'Propritor', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(549, 1, 'relationship_with_business', 'Partner', '2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(550, 1, 'relationship_with_business', 'Director', '3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(551, 1, 'relationship_with_business', 'Others', '4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(552, 1, 'business_involvement', 'Full time', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(553, 1, 'business_involvement', 'Part time', '2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(554, 1, 'business_involvement', 'None', '3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(555, 1, 'title', 'Mr.', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(556, 1, 'title', 'Mrs', '2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(557, 1, 'title', 'Ms', '3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(558, 1, 'gender', 'MALE', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(559, 1, 'gender', 'FEMALE', '2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(560, 1, 'gender', 'Un-Specified', '3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(561, 1, 'marital_status', 'Divorced/Separated', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(562, 1, 'marital_status', 'MARRIED', '2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(563, 1, 'marital_status', 'SINGLE', '3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(564, 1, 'marital_status', 'WIDOW', '4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(565, 1, 'education', 'Below SSLC', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(566, 1, 'education', 'SSLC', '2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(567, 1, 'education', 'HSC', '3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(568, 1, 'education', 'Graduate/Diploma/ITI', '4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(569, 1, 'education', 'Professional Degree', '5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(570, 1, 'education', 'Others', '6', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(571, 1, 'religion', 'Hindu', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(572, 1, 'religion', 'Muslim', '2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(573, 1, 'religion', 'Christian', '3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(574, 1, 'religion', 'Jain', '4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(575, 1, 'religion', 'Buddhism', '5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(576, 1, 'religion', 'Others', '6', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(577, 1, 'type_of_address', 'Present Address', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(578, 1, 'type_of_address', 'Permanent Address', '2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(579, 1, 'relation', 'Spouse ', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(580, 1, 'relation', 'Sibling', '2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(581, 1, 'relation', 'Parent', '3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(582, 1, 'relation', 'Child', '4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(583, 1, 'relation', 'Friend', '5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(584, 1, 'relation', 'HUSBAND', '6', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(585, 1, 'promise_to_pay', 'Willful Default', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(586, 1, 'promise_to_pay', 'Hardship', '2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(587, 1, 'promise_to_pay', 'Able To Pay', '3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(588, 1, 'promise_to_pay', 'Others', '4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(589, 1, 'payment_mode', 'Cash', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(590, 1, 'payment_mode', 'Cheque', '2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(591, 1, 'payment_mode', 'NEFT', '3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(592, 1, 'loan_purpose_1', 'Machine Refinance', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 16:53:31', 'adminkinara', '2016-08-29 16:53:31'),
(593, 1, 'loan_purpose_1', 'Asset Purchase', '2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 16:53:31', 'adminkinara', '2016-08-29 16:53:31'),
(594, 1, 'loan_purpose_1', 'Debt Consolidation', '3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 16:53:31', 'adminkinara', '2016-08-29 16:53:31'),
(595, 1, 'loan_purpose_1', 'Working Capital', '4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 16:53:31', 'adminkinara', '2016-08-29 16:53:31'),
(596, 1, 'loan_purpose_1', 'Business Development', '5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 16:53:31', 'adminkinara', '2016-08-29 16:53:31'),
(602, 1, 'district', 'Hubli', 'Hubli', NULL, NULL, '', NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-30 05:33:45', NULL, '2016-08-30 05:33:45'),
(606, 1, 'enrolledAs', 'CUSTOMER', 'CUSTOMER', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-30 10:46:47', 'adminkinara', '2016-08-30 10:46:47'),
(607, 1, 'enrolledAs', 'EMPLOYEE', 'EMPLOYEE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-30 10:46:47', 'adminkinara', '2016-08-30 10:46:47'),
(608, 1, 'enrolledAs', 'AGENT', 'AGENT', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-30 10:46:47', 'adminkinara', '2016-08-30 10:46:47'),
(614, 1, 'frequency', 'Monthly', '1', NULL, NULL, 'M', 'All', NULL, NULL, NULL, 'adminkinara', '2016-08-30 11:06:32', 'adminkinara', '2016-08-30 11:06:32'),
(615, 1, 'frequency', 'Yearly', '2', NULL, NULL, 'W', 'All', NULL, NULL, NULL, 'adminkinara', '2016-08-30 11:06:32', 'adminkinara', '2016-08-30 11:06:32'),
(616, 1, 'frequency', 'Daily', '4', NULL, NULL, NULL, 'All', NULL, NULL, NULL, 'adminkinara', '2016-08-30 11:06:32', 'adminkinara', '2016-08-30 11:06:32'),
(617, 1, 'frequency', 'Weekly', '5', NULL, NULL, 'W', 'All', NULL, NULL, NULL, 'adminkinara', '2016-08-30 11:06:32', 'adminkinara', '2016-08-30 11:06:32'),
(618, 1, 'frequency', 'Fortnightly', '6', NULL, NULL, 'F', 'All', NULL, NULL, NULL, 'adminkinara', '2016-08-30 11:06:32', 'adminkinara', '2016-08-30 11:06:32'),
(619, 1, 'expenditure', 'expenditure', '1', NULL, NULL, 'Domestic', NULL, NULL, NULL, NULL, 'saijaadmin', '2016-06-08 13:11:21', NULL, NULL),
(620, 1, 'relation', 'Self', '7', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(642, 1, 'loan_product', 'Business Development- Unsecured', '2', 'partner', 'Kinara', 'TLBDU', NULL, 'OWN', 'EQ', NULL, 'adminkinara', '2016-08-30 05:33:45', 'adminkinara', '2016-08-30 05:33:45'),
(643, 1, 'loan_product', 'LOC- RFID- Unsecured', '3', 'partner', 'Kinara', 'LCRIU', NULL, 'OWN', 'EQ', NULL, 'adminkinara', '2016-08-30 05:33:45', 'adminkinara', '2016-08-30 05:33:45'),
(644, 1, 'loan_product', 'LOC- RFD-Unsecured', '4', 'partner', 'Kinara', 'LCRDU', NULL, 'OWN', 'EQ', NULL, 'adminkinara', '2016-08-30 05:33:45', 'adminkinara', '2016-08-30 05:33:45'),
(645, 1, 'loan_product', 'Asset Purchase- Secured', '5', 'partner', 'Kinara', 'TLAPS', NULL, 'OWN', 'EQ', NULL, 'adminkinara', '2016-08-30 05:33:45', 'adminkinara', '2016-08-30 05:33:45'),
(646, 1, 'loan_product', 'Working Capital - Secured', '6', 'partner', 'Kinara', 'TLWCS', NULL, 'OWN', 'EQ', NULL, 'adminkinara', '2016-08-30 05:33:45', 'adminkinara', '2016-08-30 05:33:45'),
(647, 1, 'loan_product', 'Working Capital -Unsecured', '7', 'partner', 'Kinara', 'TLWCU', NULL, 'OWN', 'EQ', NULL, 'adminkinara', '2016-08-30 05:33:45', 'adminkinara', '2016-08-30 05:33:45'),
(648, 1, 'loan_product', 'Machine Refinance- Secured', '8', 'partner', 'Kinara', 'TLMFS', NULL, 'OWN', 'EQ', NULL, 'adminkinara', '2016-08-30 05:33:45', 'adminkinara', '2016-08-30 05:33:45'),
(649, 1, 'loan_product', 'Business Development- Secured', '9', 'partner', 'Kinara', 'TLBDS', NULL, 'OWN', 'EQ', NULL, 'adminkinara', '2016-08-30 05:33:45', 'adminkinara', '2016-08-30 05:33:45'),
(650, 1, 'loan_product', 'LOC- RFD-Secured', '10', 'partner', 'Kinara', 'LCRDS', NULL, 'OWN', 'EQ', NULL, 'adminkinara', '2016-08-30 05:33:45', 'adminkinara', '2016-08-30 05:33:45'),
(651, 1, 'loan_product', 'LOC RFID- Secured', '11', 'partner', 'Kinara', 'LCRIS', NULL, 'OWN', 'EQ', NULL, 'adminkinara', '2016-08-30 05:33:45', 'adminkinara', '2016-08-30 05:33:45'),
(652, 0, 'loan_purpose_2', 'Machine Refinance', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-30 13:12:55', 'adminkinara', '2016-08-30 13:12:55'),
(653, 0, 'loan_purpose_2', 'Asset Purchase', '2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-30 13:12:55', 'adminkinara', '2016-08-30 13:12:55'),
(654, 0, 'loan_purpose_2', 'Debt Consolidation', '3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-30 13:12:55', 'adminkinara', '2016-08-30 13:12:55'),
(655, 0, 'loan_purpose_2', 'Working Capital', '4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-30 13:12:55', 'adminkinara', '2016-08-30 13:12:55'),
(656, 0, 'loan_purpose_2', 'Business Development', '5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-30 13:12:55', 'adminkinara', '2016-08-30 13:12:55'),
(659, 0, 'loan_purpose_3', 'Machine Refinance', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-30 13:15:33', 'adminkinara', '2016-08-30 13:15:33'),
(660, 0, 'loan_purpose_3', 'Asset Purchase', '2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-30 13:15:33', 'adminkinara', '2016-08-30 13:15:33'),
(661, 0, 'loan_purpose_3', 'Debt Consolidation', '3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-30 13:15:33', 'adminkinara', '2016-08-30 13:15:33'),
(662, 0, 'loan_purpose_3', 'Working Capital', '4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-30 13:15:33', 'adminkinara', '2016-08-30 13:15:33'),
(663, 0, 'loan_purpose_3', 'Business Development', '5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-30 13:15:33', 'adminkinara', '2016-08-30 13:15:33'),
(666, 0, 'branch', 'Belgaum', '3', 'bank', '1', '1003', NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-30 13:27:12', 'adminkinara', '2016-08-30 13:27:12'),
(667, 0, 'branch', 'Mysore', '4', 'bank', '1', '1004', NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-30 13:31:11', 'adminkinara', '2016-08-30 13:31:11'),
(668, 0, 'relationship_type', 'Proprietor', 'Proprietor', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'migration', '2016-08-30 14:13:13', NULL, NULL),
(669, 0, 'relationship_type', 'Partner', 'Partner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'migration', '2016-08-30 14:13:13', NULL, NULL),
(670, 0, 'relationship_type', 'Director', 'Director', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'migration', '2016-08-30 14:13:13', NULL, NULL),
(671, 0, 'relationship_type', 'Others', 'Others', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'migration', '2016-08-30 14:13:13', NULL, NULL),
(673, 0, 'centre', 'Udyambagh', '100301', 'branch', '3', '2', 'ACTIVE', NULL, NULL, '1003-01', 'adminkinara', '2016-08-30 14:37:30', 'adminkinara', '2016-08-30 14:37:30'),
(685, 0, 'referredBy', 'Direct Source', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-31 03:07:13', NULL, NULL),
(686, 0, 'businessType', 'Manufacturing', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-31 12:42:37', NULL, NULL),
(687, 1, 'businessLine', 'Job work', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-31 12:43:57', NULL, NULL),
(688, 1, 'businessSector', 'Auto Components', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-31 12:44:37', NULL, NULL),
(689, 1, 'businessSubSector', 'Air Compressors', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-31 12:47:34', NULL, NULL),
(690, 0, 'relationship', 'Neighbour', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-09-01 05:21:55', NULL, NULL),
(691, 0, 'relationship', 'Relative', '2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-09-01 05:22:19', NULL, NULL),
(692, 1, 'address_proof', 'Ration Card', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(693, 1, 'address_proof', 'Voter Card', '2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(694, 1, 'address_proof', 'Passport', '3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(695, 1, 'address_proof', 'Pan Card', '4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(696, 1, 'address_proof', 'Aadhar Card', '5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17'),
(697, 1, 'address_proof', 'Driving Licence', '6', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adminkinara', '2016-08-29 15:19:17', 'adminkinara', '2016-08-29 15:19:17');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `reference_code`
--
ALTER TABLE `reference_code`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_classifier_code` (`classifier`,`code`),
  ADD KEY `fk_parent_reference_code_classifier` (`parent_classifier`,`parent_reference_code`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `reference_code`
--
ALTER TABLE `reference_code`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `reference_code`
--
ALTER TABLE `reference_code`
  ADD CONSTRAINT `fk_parent_reference_code_classifier` FOREIGN KEY (`parent_classifier`,`parent_reference_code`) REFERENCES `reference_code` (`classifier`, `code`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
