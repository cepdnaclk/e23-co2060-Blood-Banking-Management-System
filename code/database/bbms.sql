-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: blood_bank_management
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alerts`
--

DROP TABLE IF EXISTS `alerts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alerts` (
  `alert_id` bigint NOT NULL AUTO_INCREMENT,
  `alert_type` enum('EMERGENCY_REQUEST','EXPIRY_WARNING','LOW_STOCK') DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `message` varchar(500) DEFAULT NULL,
  `severity` enum('CRITICAL','HIGH','LOW','MEDIUM') DEFAULT NULL,
  `status` enum('ACTIVE','RESOLVED') DEFAULT NULL,
  `inventory_id` bigint DEFAULT NULL,
  PRIMARY KEY (`alert_id`),
  KEY `fk_alert_inventory` (`inventory_id`),
  CONSTRAINT `fk_alert_inventory` FOREIGN KEY (`inventory_id`) REFERENCES `inventory` (`inventory_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alerts`
--

LOCK TABLES `alerts` WRITE;
/*!40000 ALTER TABLE `alerts` DISABLE KEYS */;
INSERT INTO `alerts` VALUES (1,'EMERGENCY_REQUEST','2026-09-24 02:08:39.764323','Emergency blood request from Hospital ID 1 for A+','CRITICAL','ACTIVE',NULL),(2,'EMERGENCY_REQUEST','2026-09-24 02:23:48.399328','Emergency blood request from Hospital ID 1 for B+','CRITICAL','ACTIVE',NULL);
/*!40000 ALTER TABLE `alerts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `audit_log_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `action` varchar(50) NOT NULL,
  `entity_type` varchar(100) NOT NULL,
  `entity_id` bigint DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`audit_log_id`),
  KEY `fk_audit_logs_user` (`user_id`),
  CONSTRAINT `fk_audit_logs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blood_components`
--

DROP TABLE IF EXISTS `blood_components`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blood_components` (
  `component_id` bigint NOT NULL AUTO_INCREMENT,
  `component_type` enum('CRYOPRECIPITATE','PLASMA','PLATELETS','RBC','WHOLE_BLOOD') DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `quantity` double DEFAULT NULL,
  `status` enum('AVAILABLE','DISCARDED','EXPIRED','USED') DEFAULT NULL,
  `donation_id` bigint NOT NULL,
  PRIMARY KEY (`component_id`),
  KEY `FKhai066pf0j3wcdmclkmkv5aoo` (`donation_id`),
  CONSTRAINT `FKhai066pf0j3wcdmclkmkv5aoo` FOREIGN KEY (`donation_id`) REFERENCES `donations` (`donation_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blood_components`
--

LOCK TABLES `blood_components` WRITE;
/*!40000 ALTER TABLE `blood_components` DISABLE KEYS */;
INSERT INTO `blood_components` VALUES (1,'RBC','2026-11-05',50,'AVAILABLE',1),(2,'RBC','2026-11-05',150,'AVAILABLE',3);
/*!40000 ALTER TABLE `blood_components` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blood_issues`
--

DROP TABLE IF EXISTS `blood_issues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blood_issues` (
  `issue_id` bigint NOT NULL AUTO_INCREMENT,
  `blood_group` varchar(255) DEFAULT NULL,
  `component_type` enum('CRYOPRECIPITATE','PLASMA','PLATELETS','RBC','WHOLE_BLOOD') DEFAULT NULL,
  `issue_date` date DEFAULT NULL,
  `quantity` double DEFAULT NULL,
  `request_id` bigint DEFAULT NULL,
  PRIMARY KEY (`issue_id`),
  KEY `fk_blood_issue_request` (`request_id`),
  CONSTRAINT `fk_blood_issue_request` FOREIGN KEY (`request_id`) REFERENCES `hospital_requests` (`request_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blood_issues`
--

LOCK TABLES `blood_issues` WRITE;
/*!40000 ALTER TABLE `blood_issues` DISABLE KEYS */;
INSERT INTO `blood_issues` VALUES (1,'B+','RBC','2026-09-24',30,2);
/*!40000 ALTER TABLE `blood_issues` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blood_tests`
--

DROP TABLE IF EXISTS `blood_tests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blood_tests` (
  `test_id` bigint NOT NULL AUTO_INCREMENT,
  `hepatitis_b` enum('NEGATIVE','PENDING','POSITIVE') DEFAULT NULL,
  `hepatitis_c` enum('NEGATIVE','PENDING','POSITIVE') DEFAULT NULL,
  `hiv` enum('NEGATIVE','PENDING','POSITIVE') DEFAULT NULL,
  `malaria` enum('NEGATIVE','PENDING','POSITIVE') DEFAULT NULL,
  `overall_result` enum('PENDING','SAFE','UNSAFE') NOT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `syphilis` enum('NEGATIVE','PENDING','POSITIVE') DEFAULT NULL,
  `test_date` date DEFAULT NULL,
  `donation_id` bigint NOT NULL,
  PRIMARY KEY (`test_id`),
  KEY `FKtbjd34twuvn062mcn6a3d3ov4` (`donation_id`),
  CONSTRAINT `FKtbjd34twuvn062mcn6a3d3ov4` FOREIGN KEY (`donation_id`) REFERENCES `donations` (`donation_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blood_tests`
--

LOCK TABLES `blood_tests` WRITE;
/*!40000 ALTER TABLE `blood_tests` DISABLE KEYS */;
INSERT INTO `blood_tests` VALUES (1,'NEGATIVE','NEGATIVE','NEGATIVE','NEGATIVE','SAFE','','NEGATIVE','2026-09-24',1),(2,'NEGATIVE','NEGATIVE','NEGATIVE','NEGATIVE','SAFE','','NEGATIVE','2026-09-24',3);
/*!40000 ALTER TABLE `blood_tests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `donations`
--

DROP TABLE IF EXISTS `donations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `donations` (
  `donation_id` bigint NOT NULL AUTO_INCREMENT,
  `donation_date` date DEFAULT NULL,
  `donation_status` enum('CANCELLED','COMPLETED','FAILED') NOT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `units_collected` double NOT NULL,
  `donor_id` bigint NOT NULL,
  `screening_id` bigint DEFAULT NULL,
  PRIMARY KEY (`donation_id`),
  UNIQUE KEY `UKsrp0q03mjx99iuysu8g2xw00t` (`screening_id`),
  KEY `FK1xqpcjicjb1juat5f8itmxj2t` (`donor_id`),
  CONSTRAINT `FK1xqpcjicjb1juat5f8itmxj2t` FOREIGN KEY (`donor_id`) REFERENCES `donors` (`donor_id`),
  CONSTRAINT `FK9th32u4ecomy6pp8eke0u1vfm` FOREIGN KEY (`screening_id`) REFERENCES `donor_screening` (`screening_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donations`
--

LOCK TABLES `donations` WRITE;
/*!40000 ALTER TABLE `donations` DISABLE KEYS */;
INSERT INTO `donations` VALUES (1,'2026-09-23','COMPLETED','',200,1,1),(2,'2026-09-23','COMPLETED','',400,2,2),(3,'2026-09-23','COMPLETED','Normally donated.',600,3,3);
/*!40000 ALTER TABLE `donations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `donor_screening`
--

DROP TABLE IF EXISTS `donor_screening`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `donor_screening` (
  `screening_id` bigint NOT NULL AUTO_INCREMENT,
  `blood_pressure` varchar(20) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `eligibility_status` enum('ELIGIBLE','PERMANENTLY_REJECTED','TEMPORARILY_DEFERRED') NOT NULL,
  `hemoglobin` double DEFAULT NULL,
  `medical_history` text,
  `pulse_rate` int DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `screening_date` date NOT NULL,
  `temperature` double DEFAULT NULL,
  `weight` double DEFAULT NULL,
  `donor_id` bigint NOT NULL,
  `screened_by` bigint DEFAULT NULL,
  PRIMARY KEY (`screening_id`),
  KEY `FK7h6uw4u13t9bkvvvberj3cgkb` (`donor_id`),
  KEY `FKc303drmbuyvlntqx7mkwr42iv` (`screened_by`),
  CONSTRAINT `FK7h6uw4u13t9bkvvvberj3cgkb` FOREIGN KEY (`donor_id`) REFERENCES `donors` (`donor_id`),
  CONSTRAINT `FKc303drmbuyvlntqx7mkwr42iv` FOREIGN KEY (`screened_by`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donor_screening`
--

LOCK TABLES `donor_screening` WRITE;
/*!40000 ALTER TABLE `donor_screening` DISABLE KEYS */;
INSERT INTO `donor_screening` VALUES (1,'118/60','2026-09-23 22:17:44.973543','ELIGIBLE',13,'',72,'','2026-09-23',37,56,1,NULL),(2,'120/60','2026-09-24 01:03:41.323820','ELIGIBLE',13.5,'',72,'','2026-09-24',37,60,2,NULL),(3,'118/60','2026-09-24 02:18:15.129982','ELIGIBLE',13,'',57,'','2026-09-24',37,55,3,NULL),(4,'118/60','2026-09-24 02:37:56.189984','TEMPORARILY_DEFERRED',14,'',72,'','2026-09-24',37,47,4,NULL);
/*!40000 ALTER TABLE `donor_screening` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `donors`
--

DROP TABLE IF EXISTS `donors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `donors` (
  `donor_id` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `approved_at` datetime(6) DEFAULT NULL,
  `blood_group` enum('AB_NEGATIVE','AB_POSITIVE','A_NEGATIVE','A_POSITIVE','B_NEGATIVE','B_POSITIVE','O_NEGATIVE','O_POSITIVE') NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `dob` date NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `full_name` varchar(100) NOT NULL,
  `gender` enum('FEMALE','MALE','OTHER') NOT NULL,
  `last_donation_date` date DEFAULT NULL,
  `next_eligible_date` date DEFAULT NULL,
  `nic` varchar(20) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `rejection_reason` varchar(255) DEFAULT NULL,
  `status` enum('ACTIVE','BLOCKED','PENDING_VERIFICATION','REJECTED','TEMPORARILY_DEFERRED') NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `approved_by` bigint DEFAULT NULL,
  PRIMARY KEY (`donor_id`),
  UNIQUE KEY `UKangwhm66wjqyk8n0x1n79wpg1` (`nic`),
  UNIQUE KEY `UKnd8hep05at6gvti74686j88t3` (`email`),
  KEY `FKeohuie3xns0rfmoohc1ru4b1j` (`approved_by`),
  CONSTRAINT `FKeohuie3xns0rfmoohc1ru4b1j` FOREIGN KEY (`approved_by`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donors`
--

LOCK TABLES `donors` WRITE;
/*!40000 ALTER TABLE `donors` DISABLE KEYS */;
INSERT INTO `donors` VALUES (1,'Kokkuvil','2026-09-23 22:16:14.485757','A_POSITIVE',NULL,'2000-02-11','kamal@gmail.com','Kamal','MALE',NULL,NULL,'200467200143','0753267222',NULL,'ACTIVE',NULL,NULL),(2,'Urelu','2026-09-23 22:16:16.503510','A_NEGATIVE',NULL,'2004-02-02','vimal@gmail.com','Vimal','MALE',NULL,NULL,'200467246143','0754267212',NULL,'ACTIVE',NULL,NULL),(3,'PointPedro','2026-09-23 22:16:18.212876','B_POSITIVE',NULL,'2001-09-24','aruna@gmail.com','Aruna','FEMALE',NULL,NULL,'200147246143','0764221212',NULL,'ACTIVE',NULL,NULL),(4,'Chunnakam','2026-09-23 23:46:53.568259','B_NEGATIVE',NULL,'1998-09-20','suresh@gmail.com','Suresh','MALE',NULL,NULL,'982347246143','0764267512',NULL,'ACTIVE',NULL,NULL),(5,'Jaffna','2026-09-23 23:46:54.825813','AB_POSITIVE',NULL,'2002-05-12','vignesh@gmail.com','Vignesh','MALE',NULL,NULL,'200298340227','0764567512',NULL,'ACTIVE',NULL,NULL);
/*!40000 ALTER TABLE `donors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hospital_requests`
--

DROP TABLE IF EXISTS `hospital_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hospital_requests` (
  `request_id` bigint NOT NULL AUTO_INCREMENT,
  `blood_group` varchar(255) DEFAULT NULL,
  `component_type` enum('CRYOPRECIPITATE','PLASMA','PLATELETS','RBC','WHOLE_BLOOD') DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `hospital_id` bigint DEFAULT NULL,
  `patient_name` varchar(255) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `request_date` date DEFAULT NULL,
  `request_status` enum('APPROVED','PENDING','REJECTED') DEFAULT NULL,
  `requested_by` bigint DEFAULT NULL,
  `units_required` double DEFAULT NULL,
  `urgency_level` enum('EMERGENCY','HIGH','LOW','MEDIUM') DEFAULT NULL,
  PRIMARY KEY (`request_id`),
  KEY `fk_hospital_request_hospital` (`hospital_id`),
  KEY `fk_hospital_request_user` (`requested_by`),
  CONSTRAINT `fk_hospital_request_hospital` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals` (`hospital_id`),
  CONSTRAINT `fk_hospital_request_user` FOREIGN KEY (`requested_by`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hospital_requests`
--

LOCK TABLES `hospital_requests` WRITE;
/*!40000 ALTER TABLE `hospital_requests` DISABLE KEYS */;
INSERT INTO `hospital_requests` VALUES (1,'A+','WHOLE_BLOOD','2026-09-24 02:08:39.608324',1,'Nivetha','','2026-09-24','REJECTED',5,20,'EMERGENCY'),(2,'B+','RBC','2026-09-24 02:23:48.358330',1,'Suki','','2026-09-24','APPROVED',5,30,'EMERGENCY');
/*!40000 ALTER TABLE `hospital_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hospitals`
--

DROP TABLE IF EXISTS `hospitals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hospitals` (
  `hospital_id` bigint NOT NULL AUTO_INCREMENT,
  `contact_number` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `hospital_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`hospital_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hospitals`
--

LOCK TABLES `hospitals` WRITE;
/*!40000 ALTER TABLE `hospitals` DISABLE KEYS */;
INSERT INTO `hospitals` VALUES (1,'0812345678','Kandy','Kandy General Hospital'),(3,'0812920678','Jaffna','Jaffna teaching hospital'),(4,'0912234567','Galle','Galle General Hospital'),(5,'0812345678','Peradeniya','Peradeniya Teaching Hospital'),(6,'0112234567','Colombo','Colombo National Hospital');
/*!40000 ALTER TABLE `hospitals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory` (
  `inventory_id` bigint NOT NULL AUTO_INCREMENT,
  `blood_group` varchar(255) DEFAULT NULL,
  `component_id` bigint DEFAULT NULL,
  `component_type` enum('CRYOPRECIPITATE','PLASMA','PLATELETS','RBC','WHOLE_BLOOD') DEFAULT NULL,
  `donation_id` bigint DEFAULT NULL,
  `quantity` double DEFAULT NULL,
  `reorder_level` double DEFAULT NULL,
  `stock_status` varchar(255) DEFAULT NULL,
  `storage_location` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`inventory_id`),
  KEY `fk_inventory_component` (`component_id`),
  KEY `fk_inventory_donation` (`donation_id`),
  CONSTRAINT `fk_inventory_component` FOREIGN KEY (`component_id`) REFERENCES `blood_components` (`component_id`),
  CONSTRAINT `fk_inventory_donation` FOREIGN KEY (`donation_id`) REFERENCES `donations` (`donation_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
INSERT INTO `inventory` VALUES (1,'A+',1,'RBC',1,50,5,NULL,NULL),(2,'B+',2,'RBC',3,120,5,'AVAILABLE',NULL);
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `hospital_id` bigint DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('ADMIN','HOSPITAL_STAFF','LAB_STAFF','RECEPTION_STAFF') DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE') DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  KEY `fk_users_hospital` (`hospital_id`),
  CONSTRAINT `fk_users_hospital` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals` (`hospital_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (3,'admin@bbms.com','System Administrator',NULL,'$2a$10$NFRtdnQ2mcPoUAA3gg5I1eF7BO7i96fziiYRfHIdz7.XzBimuE5Um','ADMIN','ACTIVE'),(4,'lab@bbms.com','Laboratory Staff',NULL,'$2a$10$MQEU5FBeDybAxb14wWP8C.ZaD4Vv7nK2jfa1vw9PxwctteTp4kDMS','LAB_STAFF','ACTIVE'),(5,'hospital@bbms.com','Hospital Staff',1,'$2a$10$UMwc57NL5pffpxCDsWAIHOs/0hQspaCTQqQQi8H8O1PxEcdYq35ni','HOSPITAL_STAFF','ACTIVE'),(6,'reception@bbms.com','Reception Staff',1,'$2a$10$VM77MJM XZBzesYnEywcA0msARZiah6ChgSF4g.pul4nUW5kAK4K','RECEPTION_STAFF','ACTIVE');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'blood_bank_management'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-24  2:56:00
