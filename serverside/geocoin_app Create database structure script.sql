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

DELIMITER $$
--
-- Procedures
--
DROP PROCEDURE IF EXISTS `archiveProporsals`$$
CREATE DEFINER=`geocoin`@`localhost` PROCEDURE `archiveProporsals`()
    NO SQL
begin

delete from mariages where proposalRef not in (select id from marriageProposals);

/*INSERT INTO marriageProposals_archive (`id`, `latitude`, `longitude`, `userId`, `timeAdded`, `zone_id`) 
SELECT `id`, `latitude`, `longitude`, `userId`, `timeAdded`, `zone_id`
FROM   marriageProposals
WHERE  `timeAdded` < DATE_SUB(NOW(), INTERVAL  5 MINUTE);
*/
delete from mariages where proposalRef in (select id  from marriageProposals
WHERE  `timeAdded` < DATE_SUB(NOW(), INTERVAL  5 MINUTE));


delete from marriageProposals
WHERE  `timeAdded` < DATE_SUB(NOW(), INTERVAL  5 MINUTE);

UPDATE `transactions` SET `status`="done" WHERE  `timeAdded` < DATE_SUB(NOW(), INTERVAL  5 MINUTE);
delete from users
WHERE  `lastLogin` < DATE_SUB(NOW(), INTERVAL  10 MINUTE);



end$$

DROP PROCEDURE IF EXISTS `divorce`$$
CREATE DEFINER=`geocoin`@`localhost` PROCEDURE `divorce`(IN `in_userId` BIGINT)
    NO SQL
begin
declare t_pId bigint default 0;

select distinct proposalRef into t_pId from mariages where user1=in_userId;
if (t_pId = 0 ) then
begin
select distinct proposalRef into t_pId from mariages where user2=in_userId;
end;
end if;
delete from users where id= in_userId;
delete from mariages where proposalRef= t_pId ;
delete from marriageProposals where id= t_pId ;

end$$

DROP PROCEDURE IF EXISTS `getMarriagesForPrint`$$
CREATE DEFINER=`geocoin`@`localhost` PROCEDURE `getMarriagesForPrint`(IN `in_printerId` INT)
    NO SQL
if (in_printerId = 1) then
begin
select m.proposalRef as pId,mp.timeAdded, u1.uniqueId as user1 ,u2.uniqueId as user2, w.confirmed, w.unconfirmed from marriageProposals mp join mariages m join users u1 join users u2 join wallets w  where mp.id=m.proposalRef and u1.id=m.user1 and u2.id=m.user2 and w.wallet = u1.walletName and (printerStatus = 0 or printerStatus = 2);
end;
else if (in_printerId = 2) then
begin
select m.proposalRef as pId,mp.timeAdded, u1.uniqueId as user1 ,u2.uniqueId as user2, w.confirmed, w.unconfirmed from marriageProposals mp join mariages m join users u1 join users u2 join wallets w  where mp.id=m.proposalRef and u1.id=m.user1 and u2.id=m.user2 and w.wallet = u1.walletName and (printerStatus = 0 or printerStatus = 1);
end;
end if;
end if$$

DROP PROCEDURE IF EXISTS `getMarriageWallet`$$
CREATE DEFINER=`geocoin`@`localhost` PROCEDURE `getMarriageWallet`(IN `in_userId` BIGINT)
    NO SQL
begin
declare pRef bigint default 0;
declare marriageId bigint default 0;
declare marriageWallet varchar(40) default "";
select proposalRef into pRef from mariages where user1 = in_userId or user2 = in_userId;

select u.walletName,mp.userId into marriageWallet,marriageId from marriageProposals mp join users u where mp.id=pRef and u.id = in_userId;


select marriageWallet,marriageId;
end$$

DROP PROCEDURE IF EXISTS `getPartners`$$
CREATE DEFINER=`geocoin`@`localhost` PROCEDURE `getPartners`(IN `in_uid` BIGINT)
    NO SQL
begin
declare pRef bigint default 0;
delete from mariages where user1=user2; 
select distinct proposalRef into pRef from mariages where user1=in_uid or user2=in_uid ;

select u.uniqueId,moo.userId,moo.longitude,moo.latitude from users u join
(SELECT m.user1 as `userId`,l.longitude as `longitude`,l.latitude as `latitude` FROM mariages m join locations l where m.proposalRef = pRef and m.user1 !=in_uid and m.user1=l.userId
UNION 
SELECT m.user2 as `userId`,l.longitude as `longitude`,l.latitude as `latitude` FROM mariages m join locations l where m.proposalRef = pRef and m.user2 !=in_uid and m.user2=l.userId) moo on moo.userId = u.id;

end$$

DROP PROCEDURE IF EXISTS `getUsersInZone`$$
CREATE DEFINER=`geocoin`@`localhost` PROCEDURE `getUsersInZone`(IN `lat` DECIMAL(10,8), IN `lon` DECIMAL(11,8), IN `rad` INT)
    NO SQL
SELECT
    *, (
      6371 * acos (
      cos ( radians(lat) )
      * cos( radians( latitude ) )
      * cos( radians( longitude ) - radians(lon) )
      + sin ( radians(lat) )
      * sin( radians( latitude ) )
    )
) AS distance
FROM locations
HAVING distance < rad
ORDER BY distance$$

DROP PROCEDURE IF EXISTS `getZonesNear`$$
CREATE DEFINER=`geocoin`@`localhost` PROCEDURE `getZonesNear`(IN `lat` DECIMAL(10,8), IN `lon` DECIMAL(11,8), IN `rad` SMALLINT)
    NO SQL
SELECT
    *, (
      6371 * acos (
      cos ( radians(lat) )
      * cos( radians( latitude ) )
      * cos( radians( longitude ) - radians(lon) )
      + sin ( radians(lat) )
      * sin( radians( latitude ) )
    )
) AS distance
FROM point_zones
HAVING distance < rad/1000
ORDER BY distance$$

DROP PROCEDURE IF EXISTS `makeMarriageTrans`$$
CREATE DEFINER=`geocoin`@`localhost` PROCEDURE `makeMarriageTrans`()
    NO SQL
begin
select 1;
end$$

DROP PROCEDURE IF EXISTS `marriageProposal`$$
CREATE DEFINER=`geocoin`@`localhost` PROCEDURE `marriageProposal`(IN `in_lat` DECIMAL(10,8), IN `in_long` DECIMAL(11,8), IN `in_userId` BIGINT, IN `in_zoneid` BIGINT)
    NO SQL
begin
declare proposerId BIGINT default 0;
declare pId BIGINT default 0;
declare fromWallet varchar(40) default "";
declare toWallet varchar(40) default "";

delete from mariages where user1=user2; 
delete from marriageProposals where `timeAdded` <= DATE_SUB(NOW(), INTERVAL  5 MINUTE) and  userId=userId;
select userId,id into proposerId,pId from marriageProposals where `timeAdded` > DATE_SUB(NOW(), INTERVAL  10 second) and  userId=userId;



if (proposerId="" or proposerId=null) then
begin
    
INSERT INTO `marriageProposals`(`latitude`, `longitude`, `userId`, `zone_id`) 
VALUES (in_lat,in_long,in_userId,in_zoneid);

end;
else
begin
if exists(select * from mariages where proposalRef=pId and (user1=in_userId or user2=in_userId )) then
begin
select 1;
end;
else
begin
INSERT INTO `mariages`(`user1`, `user2`,`proposalRef`) VALUES (proposerId,in_userId,pId);
select walletName into fromWallet from users where id=in_userId;
select walletName into toWallet from users where id=proposerId;
INSERT INTO `transactions`(`from`, `to`,`value`) values(fromWallet,toWallet,999);
end;
end if;
end;
end if;
end$$

DROP PROCEDURE IF EXISTS `registerUser`$$
CREATE DEFINER=`geocoin`@`localhost` PROCEDURE `registerUser`(IN `in_userName` VARCHAR(25))
    NO SQL
begin
declare t_walletId bigint default 0;
declare t_walletCur bigint default 0;
declare t_maxId bigint default 0;
declare t_walletName varchar(40) default "";
declare t_userRemId bigint default 0;

select id into t_walletCur from wallets where status ="cursor";
select max(id) into t_maxId from wallets;
select wallet into t_walletName from `wallets` where id=t_walletId;
select min(id) into t_walletId from wallets where id > t_walletCur;
select `wallet` into t_walletName from `wallets` where id=t_walletId;
if (t_walletCur = t_maxId) then
begin
select min(id) into t_walletId from wallets;
select id into t_userRemId from users where `walletName` = t_walletName;
select wallet into t_walletName from `wallets` where id=t_walletId;

delete from mariages where user1 = t_userRemId or user2 = t_userRemId;
delete from users where id = t_userRemId;
end;
end if;
update `wallets` set `status` = "used" where `id`=t_walletCur;
update `wallets` set `status` = "cursor" where `id`=t_walletId;
insert into `users`(`uniqueId`,`walletName`) values(in_userName,t_walletName);
select t_walletName as `walletName`,LAST_INSERT_ID() as `userId`;
end$$

DROP PROCEDURE IF EXISTS `releaseWallet`$$
CREATE DEFINER=`geocoin`@`localhost` PROCEDURE `releaseWallet`()
    NO SQL
select "check if the user is married, if so get sum of their money. divide their money. then delete their marriage. otherwise, release the wallet"$$

DROP PROCEDURE IF EXISTS `restartZones`$$
CREATE DEFINER=`geocoin`@`localhost` PROCEDURE `restartZones`(IN `lat` INT)
    NO SQL
begin
if exists(select * from point_zones where id=zoneId and status="on")then
begin
INSERT INTO `userTransactions`(`userId`, `value`,`desc`) 
VALUES (userId,10, CONCAT('user entered zone ' , zoneId));

update `point_zones` set `status` = "used" where id=zoneId;
end;
end if;

end$$

DROP PROCEDURE IF EXISTS `test`$$
CREATE DEFINER=`geocoin`@`localhost` PROCEDURE `test`()
    NO SQL
if (SELECT count(*) from point_zones where id=120 and (status="on" or status="charity" ))>0 then
BEGIN
INSERT INTO `transactions`(`userId`, `value`,`zoneId`) 
VALUES ('occupant_7',-0.1, 120);
end;
end if$$

DROP PROCEDURE IF EXISTS `updateLocation`$$
CREATE DEFINER=`geocoin`@`localhost` PROCEDURE `updateLocation`(IN `inUId` BIGINT(25), IN `inLatitude` DECIMAL(10,8), IN `inLongitude` DECIMAL(11,8), IN `inAccuracy` SMALLINT, IN `inTimest` TIMESTAMP)
    MODIFIES SQL DATA
begin
CALL `archiveProporsals` ();
if exists(select * from locations where `userId` = inUId )then
begin
    INSERT INTO locations_archive (`userId`, `longitude`, `latitude`, `accuracy`, `timeReceived`)
SELECT `userId`, `longitude`, `latitude`, `accuracy`, `timeReceived`
FROM   locations
WHERE  `userId` = inUId;

update locations set `longitude`=inLongitude,`latitude`=inLatitude
							,`accuracy`=inAccuracy,`timeReceived`=inTimest WHERE  `userId` = inUId;
end;
else
begin
insert into locations (`userId`,
                       `latitude`,
                       `longitude`,
                       `accuracy`,
                       `timeReceived`)
Values(inUId,inLatitude,inLongitude,inAccuracy,inTimest);
end;
end if;

end$$

DROP PROCEDURE IF EXISTS `userInCommunityZone`$$
CREATE DEFINER=`geocoin`@`localhost` PROCEDURE `userInCommunityZone`(IN `in_userId` VARCHAR(25), IN `in_zoneId` INT)
    NO SQL
begin
if exists(select * from point_zones where id=in_zoneId and status="on")then
begin
INSERT INTO `userTransactions`(`userId`, `value`,`desc`) 
VALUES (in_userId,2, in_zoneId);

INSERT INTO `userTransactions`(`userId`, `value`,`desc`)   
SELECT distinct(uniqueId),-1,in_zoneId;

end;
end if;

end$$

DROP PROCEDURE IF EXISTS `userInContinuesZone`$$
CREATE DEFINER=`geocoin`@`localhost` PROCEDURE `userInContinuesZone`(IN `in_userId` BIGINT, IN `in_zoneId` BIGINT, IN `in_value` FLOAT)
    NO SQL
if (SELECT count(*) from point_zones where id=in_zoneId and (status="on" or status="charity" ))>0 then
BEGIN
declare fromWallet varchar(40);
declare toWallet varchar(40);
select walletName into toWallet from users where id=in_userId;
select walletId into fromWallet from point_zones where id=in_zoneId;

INSERT INTO `transactions`(`from`, `value`,`to`) 
VALUES (fromWallet,in_value, toWallet);
end;
end if$$

DROP PROCEDURE IF EXISTS `userInOneoffZone`$$
CREATE DEFINER=`geocoin`@`localhost` PROCEDURE `userInOneoffZone`(IN `in_userId` BIGINT, IN `in_zoneId` BIGINT, IN `in_value` FLOAT)
    NO SQL
begin
if exists(select * from point_zones where id=in_zoneId and status="on")then
begin
declare fromWallet varchar(40);
declare toWallet varchar(40);
select walletName into toWallet from users where id=in_userId;
select walletId into fromWallet from point_zones where id=in_zoneId;

INSERT INTO `transactions`(`from`,`to`, `value`) 
VALUES (fromWallet,toWallet,in_value);

update `point_zones` set `status` = "used" where id=in_zoneId;
end;
end if;

end$$

DROP PROCEDURE IF EXISTS `userInPositiveZone`$$
CREATE DEFINER=`geocoin`@`localhost` PROCEDURE `userInPositiveZone`(IN `in_userId` VARCHAR(25), IN `in_zoneId` BIGINT)
    NO SQL
begin
if exists(select * from point_zones where id=in_zoneId and status="on")then
begin
INSERT INTO `userTransactions`(`userId`, `value`,`desc`) 
VALUES (in_userId,0.5, in_zoneId);

INSERT INTO `userTransactions`(`userId`, `value`,`desc`)   
SELECT distinct(uniqueId),-0.1,in_zoneId from users;

end;
end if;

end$$

DROP PROCEDURE IF EXISTS `user_inMoney`$$
CREATE DEFINER=`geocoin`@`localhost` PROCEDURE `user_inMoney`(IN `in_userId` VARCHAR(25), IN `in_zoneId` BIGINT)
    NO SQL
begin
declare zoneVal float;
if exists(select * from point_zones where id=in_zoneId and status="on")then
begin
select value into zoneVal from point_zones where id=in_zoneId;
INSERT INTO `transactions`(`userId`, `value`,`zoneId`) 
VALUES (in_userId,zoneVal,in_zoneId);

update `point_zones` set `status` = "used" where id=in_zoneId;
end;
end if;

end$$

--
-- Functions
--
DROP FUNCTION IF EXISTS `getDistance`$$
CREATE DEFINER=`geocoin`@`localhost` FUNCTION `getDistance`(`lat1` DECIMAL(10,8), `lon1` DECIMAL(11,8), `lat2` DECIMAL(10,8), `lon2` DECIMAL(11,8)) RETURNS double
    NO SQL
BEGIN
    DECLARE dist DOUBLE;
	DECLARE rlat1 DOUBLE;
	DECLARE rlat2 DOUBLE;
	DECLARE rlon1 DOUBLE;
	DECLARE rlon2 DOUBLE;
    SET rlat1 = radians( lat1 );
    SET rlat2 = radians( lat2 );
    SET rlon1 = radians( lon1 );
    SET rlon2 = radians( lon2 );
    SET dist  = ACOS( COS( rlat1 ) * COS( rlon1 ) * COS( rlat2 ) * COS( rlon2 ) + COS( rlat1 ) * SIN( rlon1 ) * COS( rlat2 ) * SIN( rlon2 ) + SIN( rlat1 ) * SIN( rlat2 ) ) * 6372.8;
    RETURN dist;
END$$

DROP FUNCTION IF EXISTS `getUserBalance`$$
CREATE DEFINER=`geocoin`@`localhost` FUNCTION `getUserBalance`(`in_userId` VARCHAR(25)) RETURNS varchar(60) CHARSET latin1
    NO SQL
begin
declare bal varchar(60);
 set bal  = (select concat(format((confirmed*1000),3),"&",format((unconfirmed*1000),3)) as balance from wallets w join users u
where u.`id`=in_userId and w.`wallet` = u.`walletName`);
return bal;
end$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `coinDrops`
--

DROP TABLE IF EXISTS `coinDrops`;
CREATE TABLE IF NOT EXISTS `coinDrops` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `userId` varchar(25) NOT NULL,
  `timeAdded` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1134 ;

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
CREATE TABLE IF NOT EXISTS `locations` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `userId` bigint(20) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `latitude` decimal(10,8) NOT NULL,
  `accuracy` smallint(6) NOT NULL,
  `timeReceived` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId_Index` (`userId`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=764 ;

-- --------------------------------------------------------

--
-- Table structure for table `locations_archive`
--

DROP TABLE IF EXISTS `locations_archive`;
CREATE TABLE IF NOT EXISTS `locations_archive` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `userId` bigint(20) NOT NULL,
  `longitude` float(11,8) NOT NULL,
  `latitude` float(10,8) NOT NULL,
  `accuracy` smallint(6) NOT NULL,
  `timeReceived` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=345162 ;

-- --------------------------------------------------------

--
-- Table structure for table `mariages`
--

DROP TABLE IF EXISTS `mariages`;
CREATE TABLE IF NOT EXISTS `mariages` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user1` bigint(20) NOT NULL,
  `user2` bigint(20) NOT NULL,
  `timeCreated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `printerStatus` int(11) NOT NULL DEFAULT '0',
  `proposalRef` bigint(20) NOT NULL,
  `duration` int(11) NOT NULL DEFAULT '10',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=659 ;

-- --------------------------------------------------------

--
-- Table structure for table `mariages_archive`
--

DROP TABLE IF EXISTS `mariages_archive`;
CREATE TABLE IF NOT EXISTS `mariages_archive` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user1` varchar(25) NOT NULL,
  `user2` int(25) NOT NULL,
  `timeCreated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `duration` int(11) NOT NULL DEFAULT '10',
  `status` varchar(20) NOT NULL DEFAULT 'new',
  `proposalRef` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `mariageTransactions`
--

DROP TABLE IF EXISTS `mariageTransactions`;
CREATE TABLE IF NOT EXISTS `mariageTransactions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `userId` varchar(25) NOT NULL,
  `value` float NOT NULL,
  `timeAdded` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `zoneId` bigint(20) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'new',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1107 ;

-- --------------------------------------------------------

--
-- Table structure for table `marriageProposals`
--

DROP TABLE IF EXISTS `marriageProposals`;
CREATE TABLE IF NOT EXISTS `marriageProposals` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `userId` bigint(20) NOT NULL,
  `timeAdded` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `zone_id` bigint(20) NOT NULL,
  `duration` int(11) NOT NULL DEFAULT '10',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1051 ;

-- --------------------------------------------------------

--
-- Table structure for table `marriageProposals_archive`
--

DROP TABLE IF EXISTS `marriageProposals_archive`;
CREATE TABLE IF NOT EXISTS `marriageProposals_archive` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `userId` bigint(20) NOT NULL,
  `timeAdded` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `zone_id` bigint(20) NOT NULL,
  `duration` int(11) NOT NULL DEFAULT '10',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=277 ;

-- --------------------------------------------------------

--
-- Table structure for table `point_zones`
--

DROP TABLE IF EXISTS `point_zones`;
CREATE TABLE IF NOT EXISTS `point_zones` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `radius` smallint(6) NOT NULL,
  `zoneType` varchar(20) NOT NULL,
  `forWho` varchar(10) NOT NULL DEFAULT 'singles',
  `value` float NOT NULL DEFAULT '0.0001',
  `status` varchar(10) NOT NULL,
  `comment` varchar(400) NOT NULL DEFAULT 'none',
  `walletId` varchar(20) NOT NULL DEFAULT 'default_wallet',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=187 ;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `from` varchar(40) NOT NULL,
  `value` float NOT NULL,
  `timeAdded` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `to` varchar(40) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'new',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3637 ;

-- --------------------------------------------------------

--
-- Table structure for table `userBalance`
--

DROP TABLE IF EXISTS `userBalance`;
CREATE TABLE IF NOT EXISTS `userBalance` (
  `userId` varchar(25) NOT NULL,
  `confirmed` float NOT NULL,
  `unconfirmed` float NOT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `uniqueId` varchar(25) NOT NULL,
  `walletName` varchar(40) NOT NULL,
  `lastLogin` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`,`uniqueId`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=830 ;

-- --------------------------------------------------------

--
-- Table structure for table `userTransactions`
--

DROP TABLE IF EXISTS `userTransactions`;
CREATE TABLE IF NOT EXISTS `userTransactions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `userId` varchar(25) NOT NULL,
  `value` float NOT NULL,
  `timeAdded` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `desc` bigint(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=76226 ;

-- --------------------------------------------------------

--
-- Table structure for table `wallets`
--

DROP TABLE IF EXISTS `wallets`;
CREATE TABLE IF NOT EXISTS `wallets` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `wallet` varchar(40) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'ready',
  `confirmed` float NOT NULL,
  `unconfirmed` float NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=47 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
