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

The system implements strict **Role-Based Access Control (RBAC)** via **Spring Security** annotations and React route guards (`ProtectedRoute`). Each authenticated user is granted access according to their assigned role.

### 🔐 Authentication & Role Structure

```mermaid
flowchart TB
    A["🔐 Authentication"] --> B["👨‍💼 Administrator"]
    A --> C["🧑‍💻 Reception Staff"]
    A --> D["🧪 Laboratory Staff"]
    A --> E["🏥 Hospital Staff"]
```

| **Role** | **Main Responsibilities & System Permissions** |
| :--- | :--- |
| 🛡️ **Administrator** (`ADMIN`) | Full administrative privileges across all system modules. Manages system users, registers hospitals, approves or rejects public donor registrations, approves or rejects hospital blood requests, executes blood issues, manages alerts, accesses audit logs, and views system reports. |
| 🧑‍💼 **Reception Staff** (`RECEPTION_STAFF`) | Registers new donors, manages donor records, reviews pending registrations, performs pre-screening checks, records blood donations, monitors blood inventory, and accesses operational alerts and reports. |
| 🧪 **Laboratory Staff** (`LAB_STAFF`) | Performs pre-donation screening evaluations and laboratory testing for infectious diseases, processes blood into components such as RBC, Plasma, Platelets, Cryoprecipitate, and Whole Blood, monitors inventory, and reviews blood requests and reports. |
| 🏥 **Hospital Staff** (`HOSPITAL_STAFF`) | Views hospital information, submits routine and emergency blood requests, tracks request approval and issuance status, checks real-time blood inventory availability, and views relevant alerts. |
| 🌐 **Public Access** *(Unauthenticated)* | Allows prospective donors to register online through `/register` and check their registration verification status using NIC or email through `/status`. |

## 🧩 System Modules

The Blood Bank Management System is composed of integrated modules that support the complete blood bank workflow, from secure authentication and donor registration to blood screening, component processing, inventory management, hospital requests, blood issuance, analytics, and auditing.

### 1. Authentication & User Management

- **Security:** JWT token-based authentication is implemented through `POST /api/auth/login`.
- **User Management:** Administrators can create, update, deactivate, and delete user accounts through the admin-protected `/api/users` endpoint.
- **Role Assignment:** User accounts can be assigned the following roles: `ADMIN`, `RECEPTION_STAFF`, `LAB_STAFF`, and `HOSPITAL_STAFF`.

### 2. Donor Management

- **Public Portal:** Prospective donors can register through `POST /api/public/donors` and check their registration status through `GET /api/public/donors/status/{nic}`.
- **Administrative Approval:** Administrators can review pending registrations through `/api/admin/donors/pending` and approve (`ACTIVE`) or reject (`REJECTED`) prospective donors, with rejection reasons recorded where applicable.
- **Donor Directory:** Authorized staff can list, search, and manage registered donor records through `/api/donor-management`.

### 3. Donor Screening

- **Pre-Donation Screening:** Screening records are managed through `/api/screenings` based on predefined physical eligibility criteria:
  - **Weight:** Must be `≥ 50 kg`
  - **Hemoglobin:** Must be `≥ 12.5 g/dL`
  - **Temperature:** Must be `< 37.5 °C`
  - **Pulse Rate:** Must be `≤ 100 bpm`
- **Automatic Eligibility Assessment:** Based on the screening criteria, the system automatically assigns either `ELIGIBLE` or `TEMPORARILY_DEFERRED`.

### 4. Donation Management

- **Donation Recording:** Blood collection records are created through `POST /api/donations/{donorId}/{screeningId}`.
- **Validation:** The system verifies that the donor is `ACTIVE` and that the associated screening status is `ELIGIBLE`.
- **Duplicate Prevention:** The system prevents duplicate donation records for the same screening event.

### 5. Laboratory Testing

- **Laboratory Test Entry:** Blood test results are recorded through `/api/blood-tests` for five mandatory disease panels:
  - HIV
  - Hepatitis B
  - Hepatitis C
  - Malaria
  - Syphilis
- **Automated Safety Assessment:** The overall blood safety status is calculated according to the following rules:
  - If **any** test result is `POSITIVE` → Overall result = `UNSAFE`
  - If no test is positive but **any** test result is `PENDING` → Overall result = `PENDING`
  - If **all** test results are `NEGATIVE` → Overall result = `SAFE`

### 6. Blood Component Processing & Inventory Synchronization

- **Component Creation:** Blood components are created through `/api/components` and are restricted to donations with a verified `SAFE` blood test result.
- **Automatic Shelf-Life Calculation:** The system calculates component expiration dates based on the collection date.

| **Blood Component** | **Shelf Life** |
| :--- | :--- |
| `RBC` (Red Blood Cells) | Collection Date + 42 Days |
| `PLASMA` | Collection Date + 365 Days |
| `PLATELETS` | Collection Date + 5 Days |
| `CRYOPRECIPITATE` | Collection Date + 365 Days |
| `WHOLE_BLOOD` | Collection Date + 35 Days |

- **Inventory Synchronization:** Upon successful component creation, the corresponding component is automatically inserted into the `inventory` table.

### 7. Hospital Management & Blood Requests

- **Hospital Registration:** Partner hospitals can be registered through `/api/hospitals`.
- **Blood Requests:** Hospital staff can create blood requests through `/api/requests` with the urgency levels `ROUTINE`, `URGENT`, and `EMERGENCY`.
- **Emergency Alerts:** Submitting an `EMERGENCY` request automatically triggers an immediate system alert.
- **Administrative Review:** Blood requests follow a controlled workflow:

`PENDING` → `APPROVED` / `REJECTED`

### 8. Blood Issue & Inventory Deduction

- **Blood Issuance:** Approved hospital requests are processed through `POST /api/blood-issues`.
- **Stock Matching:** The system matches approved requests against available blood inventory.
- **Automatic Stock Deduction:** Before issuing blood, the system validates the available quantity and automatically deducts the issued units from the relevant `inventory` records.

### 9. System Alerts, Dashboard Analytics & Audit Logs

- **Expiry Alerts:** Automated background checks identify blood units approaching their expiration dates through `/api/alerts`.
- **Dashboard Analytics:** The `/api/dashboard` endpoint provides key operational metrics, including:
  - Total donors
  - Pending donor approvals
  - Total blood units
  - Pending blood requests
  - Inventory distribution by blood group
  - Donor status statistics
- **Audit Logging:** The `/api/audit-logs` endpoint maintains a system-wide activity trail to record relevant user and administrative actions.
## 🔄 System Workflows

### Donor Registration to Usable Inventory Workflow

```mermaid
flowchart TD
    A[Public Donor Registration] -->|Status: PENDING_VERIFICATION| B[Admin Review & Verification]
    B -->|Approved| C[Donor Status: ACTIVE]
    B -->|Rejected| D[Donor Status: REJECTED]
    C --> E[Pre-Donation Screening Check]
    E -->|Weight >= 50kg, Hb >= 12.5| F[Screening: ELIGIBLE]
    E -->|Metrics Below Threshold| G[Screening: TEMPORARILY_DEFERRED]
    F --> H[Record Blood Donation]
    H --> I[Laboratory Infectious Disease Screening]
    I -->|HIV, HBV, HCV, Syphilis, Malaria NEGATIVE| J[Overall Result: SAFE]
    I -->|Any Test POSITIVE| K[Overall Result: UNSAFE - Unit Discarded]
    J --> L[Blood Component Processing]
    L --> M[Auto-Calculate Expiry Date]
    M --> N[Sync to Usable Blood Inventory]
```

### Hospital Blood Request & Issuing Workflow

```mermaid
flowchart TD
    A[Hospital Staff Logs Blood Request] --> B{Urgency Level?}
    B -->|EMERGENCY| C[Trigger System Emergency Alert]
    B -->|ROUTINE / URGENT| D[Status: PENDING]
    C --> D
    D --> E[Administrator Review]
    E -->|Reject| F[Status: REJECTED]
    E -->|Approve| G[Status: APPROVED]
    G --> H[Admin Executes Blood Issue]
    H --> I{Sufficient Stock Available?}
    I -->|No| J[Issue Failed - Low Stock Alert]
    I -->|Yes| K[Create Blood Issue Record]
    K --> L[Deduct Units from Inventory Stock]
    L --> M[Fulfillment Complete]
```

## 🛠️ Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | `^19.2.5` | User Interface & Single-Page Application (SPA) architecture |
| **Routing** | React Router DOM | `^7.14.2` | Client-side routing with role-based route guards |
| **Data Visualization** | Recharts | `^3.8.1` | Dashboard metrics, inventory bar charts, pie charts |
| **HTTP Client** | Fetch API (`api.js`) | Native | Centralized API utility with automatic Bearer token headers |
| **Backend Framework** | Spring Boot | `3.5.11` | Application backend framework & dependency injection |
| **Language** | Java | `21` | Core backend programming language (LTS) |
| **Security & Auth** | Spring Security + JJWT | `0.12.7` | Stateless JWT authentication & role-based authorization |
| **Data Persistence** | Spring Data JPA / Hibernate | 3.x | Object-Relational Mapping (ORM) and data repositories |
| **Database** | MySQL | `8.x` | Production relational database for persistent storage |
| **Utility Libraries** | Lombok | Included | Code boilerplate reduction (`@Getter`, `@Setter`, etc.) |
| **Build Tools** | Apache Maven / npm | Maven 3.x / Node 20+ | Backend and frontend build automation & package management |
| **Hosting & Cloud** | Railway & Vercel | Production Cloud | Cloud deployment platform for Spring Boot API, MySQL, and React SPA |

## 🏗️ System Architecture

The application follows a standard **Tiered Web Architecture** with decoupled presentation and application layers communicating via RESTful JSON APIs.

```mermaid
flowchart TB
    subgraph Client Layer ["Client Layer (Presentation)"]
        UI["React 19 SPA (Vercel)"]
        Router["React Router DOM (Protected Routes)"]
        Chart["Recharts Dashboard Views"]
    end

    subgraph API & Security Layer ["Application Layer (Spring Boot 3 - Railway)"]
        CORS["CORS Policy Configuration"]
        Security["Spring Security Filter Chain"]
        JWT["JWT Authentication Filter"]
        
        subgraph Controllers ["REST Controllers (/api/*)"]
            AuthCtrl["AuthController"]
            UserCtrl["UserController"]
            DonorCtrl["Admin / Public / Donor Controllers"]
            ScreenCtrl["DonorScreeningController"]
            DonationCtrl["DonationController"]
            TestCtrl["BloodTestController"]
            CompCtrl["BloodComponentController"]
            InvCtrl["InventoryController"]
            ReqCtrl["BloodRequestController"]
            IssueCtrl["BloodIssueController"]
            AlertCtrl["AlertController"]
            ReportCtrl["ReportController"]
        end
        
        subgraph Services ["Business Logic Layer"]
            UserService["UserService"]
            DonorService["DonorService"]
            AlertService["AlertService"]
            ReportService["ReportService"]
            HospitalService["HospitalService"]
        end
    end

    subgraph Data Layer ["Database Layer (MySQL - Railway)"]
        JPA["Spring Data JPA Repositories"]
        DB[("MySQL Relational Database")]
    end

    UI -->|HTTP Requests / REST API| CORS
    CORS --> Security
    Security --> JWT
    JWT --> Controllers
    Controllers --> Services
    Services --> JPA
    JPA --> DB
```

