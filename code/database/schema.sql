
CREATE DATABASE IF NOT EXISTS blood_bank_management;
USE blood_bank_management;

----------------------------------------------------
-- 1. HOSPITALS
----------------------------------------------------
CREATE TABLE hospitals (
    hospital_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    hospital_name VARCHAR(150) NOT NULL,
    address VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

----------------------------------------------------
-- 2. USERS
----------------------------------------------------
CREATE TABLE users (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    hospital_id BIGINT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN','HOSPITAL_STAFF','LAB_STAFF','RECEPTION_STAFF') NOT NULL,
    status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id)
        ON DELETE SET NULL
);

----------------------------------------------------
-- 3. DONORS
----------------------------------------------------
CREATE TABLE donors (
    donor_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    gender ENUM('MALE','FEMALE','OTHER') NOT NULL,
    dob DATE NOT NULL,
    blood_group ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-') NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) UNIQUE,
    nic VARCHAR(20) UNIQUE NOT NULL,
    address VARCHAR(255),

    -- public registration + staff verification flow
    status ENUM(
        'PENDING_VERIFICATION',
        'ACTIVE',
        'REJECTED',
        'TEMPORARILY_DEFERRED',
        'BLOCKED'
    ) DEFAULT 'PENDING_VERIFICATION',

    approved_by BIGINT NULL,
    approved_at DATETIME NULL,
    rejection_reason VARCHAR(255) NULL,

    last_donation_date DATE NULL,
    next_eligible_date DATE NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (approved_by) REFERENCES users(user_id)
        ON DELETE SET NULL
);

----------------------------------------------------
-- 4. DONOR SCREENING
----------------------------------------------------
CREATE TABLE donor_screening (
    screening_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    donor_id BIGINT NOT NULL,
    screened_by BIGINT NULL,
    weight DECIMAL(5,2),
    blood_pressure VARCHAR(20),
    hemoglobin DECIMAL(4,2),
    temperature DECIMAL(4,1),
    pulse_rate INT,
    medical_history TEXT,
    eligibility_status ENUM(
        'ELIGIBLE',
        'TEMPORARILY_DEFERRED',
        'PERMANENTLY_REJECTED'
    ) NOT NULL,
    screening_date DATE NOT NULL,
    remarks VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (donor_id) REFERENCES donors(donor_id)
        ON DELETE CASCADE,
    FOREIGN KEY (screened_by) REFERENCES users(user_id)
        ON DELETE SET NULL
);

----------------------------------------------------
-- 5. DONATIONS
----------------------------------------------------
CREATE TABLE donations (
    donation_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    donor_id BIGINT NOT NULL,
    screening_id BIGINT NOT NULL,
    recorded_by BIGINT NULL,
    donation_date DATE NOT NULL,
    units_collected DECIMAL(5,2) NOT NULL,
    donation_status ENUM('COMPLETED','CANCELLED','FAILED') DEFAULT 'COMPLETED',
    remarks VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (donor_id) REFERENCES donors(donor_id),
    FOREIGN KEY (screening_id) REFERENCES donor_screening(screening_id),
    FOREIGN KEY (recorded_by) REFERENCES users(user_id)
        ON DELETE SET NULL
);

----------------------------------------------------
-- 6. BLOOD TESTS
----------------------------------------------------
CREATE TABLE blood_tests (
    test_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    donation_id BIGINT NOT NULL,
    tested_by BIGINT NULL,

    hiv ENUM('NEGATIVE','POSITIVE','PENDING') DEFAULT 'PENDING',
    hepatitis_b ENUM('NEGATIVE','POSITIVE','PENDING') DEFAULT 'PENDING',
    hepatitis_c ENUM('NEGATIVE','POSITIVE','PENDING') DEFAULT 'PENDING',
    malaria ENUM('NEGATIVE','POSITIVE','PENDING') DEFAULT 'PENDING',
    syphilis ENUM('NEGATIVE','POSITIVE','PENDING') DEFAULT 'PENDING',

    overall_result ENUM('SAFE','UNSAFE','PENDING') DEFAULT 'PENDING',
    test_date DATE,
    remarks VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (donation_id) REFERENCES donations(donation_id),
    FOREIGN KEY (tested_by) REFERENCES users(user_id)
        ON DELETE SET NULL
);

----------------------------------------------------
-- 7. BLOOD COMPONENTS
----------------------------------------------------
CREATE TABLE blood_components (
    component_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    donation_id BIGINT NOT NULL,
    component_type ENUM(
        'WHOLE_BLOOD',
        'RBC',
        'PLASMA',
        'PLATELETS',
        'CRYOPRECIPITATE'
    ) NOT NULL,
    quantity DECIMAL(5,2) NOT NULL,
    expiry_date DATE NOT NULL,
    status ENUM(
        'AVAILABLE',
        'USED',
        'DISCARDED',
        'EXPIRED'
    ) DEFAULT 'AVAILABLE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (donation_id) REFERENCES donations(donation_id)
);

----------------------------------------------------
-- 8. INVENTORY
----------------------------------------------------
CREATE TABLE inventory (
    inventory_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    component_id BIGINT NOT NULL,
    blood_group ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-') NOT NULL,
    component_type ENUM(
        'WHOLE_BLOOD',
        'RBC',
        'PLASMA',
        'PLATELETS',
        'CRYOPRECIPITATE'
    ) NOT NULL,
    quantity DECIMAL(5,2) NOT NULL,
    reorder_level DECIMAL(5,2) DEFAULT 5,
    storage_location VARCHAR(50),
    stock_status ENUM(
        'AVAILABLE',
        'LOW_STOCK',
        'OUT_OF_STOCK',
        'RESERVED',
        'ISSUED',
        'EXPIRED'
    ) DEFAULT 'AVAILABLE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (component_id) REFERENCES blood_components(component_id)
);

----------------------------------------------------
-- 9. HOSPITAL REQUESTS
----------------------------------------------------
CREATE TABLE hospital_requests (
    request_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    hospital_id BIGINT NOT NULL,
    requested_by BIGINT NOT NULL,
    patient_name VARCHAR(100),
    blood_group ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-') NOT NULL,
    component_type ENUM(
        'WHOLE_BLOOD',
        'RBC',
        'PLASMA',
        'PLATELETS',
        'CRYOPRECIPITATE'
    ) NOT NULL,
    units_required DECIMAL(5,2) NOT NULL,
    urgency_level ENUM('LOW','MEDIUM','HIGH','EMERGENCY') DEFAULT 'MEDIUM',
    request_date DATE NOT NULL,
    request_status ENUM(
        'PENDING',
        'APPROVED',
        'REJECTED',
        'PARTIALLY_FULFILLED',
        'FULFILLED'
    ) DEFAULT 'PENDING',
    remarks VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id),
    FOREIGN KEY (requested_by) REFERENCES users(user_id)
);

----------------------------------------------------
-- 10. BLOOD ISSUES
----------------------------------------------------
CREATE TABLE blood_issues (
    issue_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    request_id BIGINT NOT NULL,
    inventory_id BIGINT NOT NULL,
    issue_date DATE NOT NULL,
    units_issued DECIMAL(5,2) NOT NULL,
    issued_by BIGINT NULL,
    issue_status ENUM(
        'ISSUED',
        'PARTIAL',
        'CANCELLED'
    ) DEFAULT 'ISSUED',
    remarks VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (request_id) REFERENCES hospital_requests(request_id),
    FOREIGN KEY (inventory_id) REFERENCES inventory(inventory_id),
    FOREIGN KEY (issued_by) REFERENCES users(user_id)
        ON DELETE SET NULL
);

----------------------------------------------------
-- 11. ALERTS
----------------------------------------------------
CREATE TABLE alerts (
    alert_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    alert_type ENUM(
        'LOW_STOCK',
        'EXPIRY',
        'NEW_REQUEST',
        'GENERAL',
        'URGENT_DONOR_NEEDED'
    ) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('ACTIVE','RESOLVED') DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

----------------------------------------------------
-- 12. ALERT RECIPIENTS
----------------------------------------------------
CREATE TABLE alert_recipients (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    alert_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at DATETIME NULL,

    FOREIGN KEY (alert_id) REFERENCES alerts(alert_id)
        ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);

----------------------------------------------------
-- 13. AUDIT LOGS
----------------------------------------------------
CREATE TABLE audit_logs (
    log_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NULL,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id BIGINT,
    description VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE SET NULL
);

----------------------------------------------------
-- INDEXES
----------------------------------------------------
CREATE INDEX idx_donors_blood_group ON donors(blood_group);
CREATE INDEX idx_donors_status ON donors(status);
CREATE INDEX idx_screening_donor_id ON donor_screening(donor_id);
CREATE INDEX idx_donations_donor_id ON donations(donor_id);
CREATE INDEX idx_blood_tests_donation_id ON blood_tests(donation_id);
CREATE INDEX idx_inventory_blood_group_component ON inventory(blood_group, component_type);
CREATE INDEX idx_requests_status ON hospital_requests(request_status);
CREATE INDEX idx_alerts_status ON alerts(status);



