-- phpMyAdmin SQL Dump
-- version 4.0.10.14
-- http://www.phpmyadmin.net
--
-- Host: localhost:3306
-- Generation Time: Aug 29, 2016 at 01:15 PM
-- Server version: 5.5.50-cll
-- PHP Version: 5.4.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `geocoin_app`
--
CREATE DATABASE IF NOT EXISTS `geocoin_app` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `geocoin_app`;

--
-- Dumping data for table `wallets`
--

INSERT INTO `wallets` (`id`, `wallet`, `status`, `confirmed`, `unconfirmed`) VALUES
(1, 'userWallet_1', 'used', 0.0203, 0),
(2, 'userWallet_2', 'used', 0.0205, -0.0205),
(3, 'userWallet_3', 'used', 0.0001, 0),
(4, 'userWallet_4', 'used', 0, 0.0001),
(5, 'userWallet_5', 'used', 0.0001, 0.0065),
(6, 'userWallet_6', 'used', 0, 0),
(7, 'userWallet_7', 'used', 0, 0),
(8, 'userWallet_8', 'used', 0.0001, 0),
(9, 'userWallet_9', 'used', 0.01658, -0.00834),
(10, 'userWallet_10', 'used', 0.00195, 0),
(11, 'userWallet_11', 'used', 0, 0),
(12, 'userWallet_12', 'used', 0, 0),
(13, 'userWallet_13', 'used', 0.0001, 0),
(14, 'userWallet_14', 'used', 0, 0),
(15, 'userWallet_15', 'used', 0.0082, 0),
(16, 'userWallet_16', 'used', 0, 0),
(17, 'userWallet_17', 'used', 0.0001, 0),
(18, 'userWallet_18', 'used', 0.008375, -0.0002),
(19, 'userWallet_19', 'used', 0.00155, -0.00155),
(20, 'userWallet_20', 'used', 0.0051074, 0),
(21, 'userWallet_21', 'used', 0, 0),
(22, 'userWallet_22', 'used', 0.000112, 0),
(23, 'userWallet_23', 'used', 0, 0),
(24, 'userWallet_24', 'used', 0, 0),
(25, 'userWallet_25', 'used', 0, 0),
(26, 'userWallet_26', 'used', 0, 0),
(27, 'userWallet_27', 'used', 0.00035, 0),
(28, 'userWallet_28', 'used', 0.0001, 0),
(29, 'userWallet_29', 'used', 0, 0),
(30, 'userWallet_30', 'used', 0, 0),
(31, 'userWallet_31', 'used', 0, 0),
(32, 'userWallet_32', 'used', 0.0005, 0),
(33, 'userWallet_33', 'used', 0, 0),
(34, 'userWallet_34', 'used', 0.0001, 0),
(35, 'userWallet_35', 'used', 0.0007, -0.0007),
(36, 'userWallet_36', 'used', 0.0001, 0),
(37, 'userWallet_37', 'cursor', 0, 0),
(38, 'userWallet_38', 'used', 0.0006, -0.0006),
(39, 'userWallet_39', 'used', 0.0001, 0.0005),
(40, 'userWallet_40', 'used', 0, 0),
(41, 'userWallet_41', 'used', 0, 0),
(42, 'userWallet_42', 'used', 0, 0),
(43, 'userWallet_43', 'used', 0.0001, 0),
(44, 'userWallet_44', 'used', 0.0001, 0),
(45, 'userWallet_45', 'used', 0.00365, 0);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
