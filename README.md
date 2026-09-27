# 🩸 Blood Banking Management System

[![Status](https://img.shields.io/badge/STATUS-COMPLETED-success?style=for-the-badge)](https://github.com/cepdnaclk/e23-co2060-Blood-Banking-Management-System)
[![Team](https://img.shields.io/badge/TEAM-CODECRUSH-red?style=for-the-badge)](https://github.com/cepdnaclk/e23-co2060-Blood-Banking-Management-System)
[![Frontend](https://img.shields.io/badge/FRONTEND-REACT.js-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Backend](https://img.shields.io/badge/BACKEND-SPRING%20BOOT-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Database](https://img.shields.io/badge/DATABASE-MYSQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com)
[![Security](https://img.shields.io/badge/SECURITY-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io)

> A full-stack, enterprise-grade web application developed to digitize, streamline, and audit blood bank operations—including donor registration, pre-donation screening, blood collection, laboratory infectious disease testing, blood component separation, shelf-life inventory tracking, hospital blood requests, and issuing processes.

<p align="center">
  <a href="https://github.com/cepdnaclk/e23-co2060-Blood-Banking-Management-System/issues">🐛 Report Bug</a>
  ·
  <a href="https://github.com/cepdnaclk/e23-co2060-Blood-Banking-Management-System/issues">✨ Request Feature</a>
  ·
  <a href="https://github.com/cepdnaclk/e23-co2060-Blood-Banking-Management-System">📖 Documentation</a>
</p>

<p align="center">
  <a href="https://github.com/Akshi2618">👩‍💻 Akshi2618</a>
</p>

## 📖 About the Project
The Blood Bank Management System (BBMS) is an integrated, multi-role web platform designed to automate and modernise the end-to-end operational lifecycle of a regional blood bank. Traditional blood bank systems heavily rely on manual logbooks, paper screening forms, and fragmented records, leading to potential data inaccuracies, untracked inventory expiration, and delayed responses during medical emergencies.

BBMS addresses these critical operational bottlenecks by implementing a centralized, data-driven management system. Built with a high-performance Java 21 / Spring Boot 3 REST API backend and a responsive React 19 single-page frontend, BBMS guarantees data integrity, operational traceability, automated stock allocation, and real-time alert dispatch for critical blood stock levels and pending hospital requests.

## 🎯 Project Objectives

- **Digitize Donor Management:** Maintain comprehensive profiles, medical history, screening results, and donation histories for all registered donors.
Enforce Safety & Compliance: Require mandatory laboratory testing for five major infectious diseases (HIV, Hepatitis B, Hepatitis C, Syphilis, and Malaria) before any collected blood is marked SAFE and allocated to usable inventory.

- **Automate Component Processing & Expiry Tracking:** Automatically derive component-specific shelf life (RBC: 42 days, Plasma: 365 days, Platelets: 5 days, Cryoprecipitate: 365 days, Whole Blood: 35 days) and calculate stock updates upon processing.
  
- **Optimize Hospital Blood Request Workflows:** Provide hospital staff with a direct portal to log blood requests, tag emergency requests to trigger immediate system-wide alerts, and track fulfillment status.
  
- **Ensure Stock & Transactional Traceability:** Maintain an immutable audit trail mapping every issued unit back through component processing, laboratory verification, donation collection, and pre-screening to the original donor.
  
- **Role-Based Operational Access:** Enforce strict permission boundaries across system administrators, receptionists, laboratory technicians, and hospital representatives using JSON Web Tokens (JWT) and Spring Security RBAC.

 ## ✨ Key Features & Functionalities

| **Feature** | **Description** |
| :--- | :--- |
| **Donor Management** | Public self-registration, administrator verification and approval workflow, donor profile management, eligibility date calculations, and status tracking (`PENDING_VERIFICATION`, `ACTIVE`, `REJECTED`). |
| **Donor Screening** | Pre-donation health assessment including weight, hemoglobin, blood pressure, temperature, pulse rate, and medical history, with automated eligibility evaluation (`ELIGIBLE`, `TEMPORARILY_DEFERRED`). |
| **Donation Recording** | Links completed blood collections with screened donors, validates minimum donation volume, and prevents duplicate donation records for a single screening. |
| **Laboratory Screening** | Records laboratory test results for HIV, HBV, HCV, Syphilis, and Malaria. The system automatically determines the overall safety status (`SAFE`, `UNSAFE`, `PENDING`). |
| **Blood Component Separation** | Processes safe blood into Red Blood Cells (RBC), Plasma, Platelets, Cryoprecipitate, or Whole Blood, with automated expiry-date calculation and inventory synchronization. |
| **Inventory Management** | Provides real-time blood stock tracking by blood group and component type, monitors stock levels, and generates alerts for low-stock and near-expiry units. |
| **Hospital Management** | Supports hospital registration, profile and contact management, and mapping of hospital staff user accounts to their respective hospitals. |
| **Blood Request Workflow** | Enables hospital staff to submit routine and emergency blood requests, with administrative review, approval, and priority management. |
| **Blood Issue & Stock Deduction** | Matches approved hospital requests with available blood stock, automatically deducts issued units from inventory, and maintains issue records and receipts. |
| **Alerts & Notifications** | Generates dynamic notifications for emergency blood requests, low-stock conditions, and approaching blood-unit expiry dates. |
| **Reports & Dashboards** | Provides interactive dashboards and analytical reports using Recharts, including inventory distribution by blood group, donor status distributions, and aggregated operational statistics. |
| **Audit Logging** | Maintains administrative logs of system activities, record modifications, and user actions to support accountability, traceability, and regulatory requirements. |



## 👥 User Roles

The system implements strict **Role-Based Access Control (RBAC)** using **Spring Security** annotations and React route guards (`ProtectedRoute`). Each authenticated user is granted access according to their assigned role.

## 👥 User Roles

The system implements strict **Role-Based Access Control (RBAC)** using **Spring Security** annotations and React route guards (`ProtectedRoute`). Each authenticated user is granted access according to their assigned role.

```mermaid
flowchart TB
    A["🔐 Authentication"] --> B["👨‍💼 Administrator"]
    A --> C["👤 Reception Staff"]
    A --> D["🧪 Laboratory Staff"]
    A --> E["🏥 Hospital Staff"]

 

| **Role** | **Main Responsibilities & System Permissions** |
| :--- | :--- |
| 🛡️ **Administrator** (`ADMIN`) | Full administrative privileges across all system modules. Manages system users, registers hospitals, approves or rejects public donor registrations, approves or rejects hospital blood requests, executes blood issues, manages alerts, accesses audit logs, and views system reports. |
| 🧑‍💼 **Reception Staff** (`RECEPTION_STAFF`) | Registers new donors, manages donor records, reviews pending registrations, performs pre-screening checks, records blood donations, monitors blood inventory, and accesses operational alerts and reports. |
| 🧪 **Laboratory Staff** (`LAB_STAFF`) | Performs pre-donation screening evaluations and laboratory testing for infectious diseases, processes blood into components such as RBC, Plasma, Platelets, Cryoprecipitate, and Whole Blood, monitors inventory, and reviews blood requests and reports. |
| 🏥 **Hospital Staff** (`HOSPITAL_STAFF`) | Views hospital information, submits routine and emergency blood requests, tracks request approval and issuance status, checks real-time blood inventory availability, and views relevant alerts. |
| 🌐 **Public Access** *(Unauthenticated)* | Allows prospective donors to register online through `/register` and check their registration verification status using NIC or email through `/status`. |

## 🛠️ Tech Stack

| Component | Technology | Description |
|----------|-----------|------------|
| Frontend | ![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB) | Interactive UI |
| Backend | ![Spring Boot](https://img.shields.io/badge/SpringBoot-6DB33F?style=flat-square&logo=springboot&logoColor=white) | REST API |
| Database | ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white) | Data storage |
| API | REST | Communication |

---

## 🏗️ Architecture

- Frontend (React): UI and user interactions  
- Backend (Spring Boot): Business logic  
- Database (MySQL): Data storage  

---

## 🚀 Getting Started

### Prerequisites
- React.js & npm  
- Java (JDK 17+)  
- MySQL  

### Clone Repository
```bash
git clone https://github.com/cepdnaclk/e23-co2060-Blood-Banking-Management-System.git
cd e23-co2060-Blood-Banking-Management-System
# e23-co2060-Blood-Banking-Management-System
