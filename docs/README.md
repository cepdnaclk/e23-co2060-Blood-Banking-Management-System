---
layout: home
permalink: index.html

# Please update this with your repository name and project title
repository-name: e23-co2060-Blood-Banking-Management-System
title: Blood-Banking-Management-System
---

[comment]: # "This is the standard layout for the project, but you can clean this and use your own template, and add more information required for your own project"

<!-- Once you fill the index.json file inside /docs/data, please make sure the syntax is correct. (You can use this tool to identify syntax errors)

Please include the "correct" email address of your supervisors. (You can find them from https://people.ce.pdn.ac.lk/ )

Please include an appropriate cover page image ( cover_page.jpg ) and a thumbnail image ( thumbnail.jpg ) in the same folder as the index.json (i.e., /docs/data ). The cover page image must be cropped to 940×352 and the thumbnail image must be cropped to 640×360 . Use https://croppola.com/ for cropping and https://squoosh.app/ to reduce the file size.

If your followed all the given instructions correctly, your repository will be automatically added to the department's project web site (Update daily)

A HTML template integrated with the given GitHub repository templates, based on github.com/cepdnaclk/eYY-project-theme . If you like to remove this default theme and make your own web page, you can remove the file, docs/_config.yml and create the site using HTML. -->

# Project Title
Blood Banking Management System

## Team
-  e23157, J.Sivapriya , (mailto:e23157@eng.pdn.ac.lk)
-  e23011, P.Akshayaa, (mailto:e23011@eng.pdn.ac.lk)
-  e23162, K.Hetharani, (mailto:e23162@eng.pdn.ac.lk)
-  e23411, GW.Chavindi Heshari Veedisha , (mailto:e23411@eng.pdn.ac.lk)

<!-- Image (photo/drawing of the final hardware) should be here -->

<!-- This is a sample image, to show how to add images to your page. To learn more options, please refer [this](https://projects.ce.pdn.ac.lk/docs/faq/how-to-add-an-image/) -->

<!-- ![Sample Image](./images/sample.png) -->

#### Table of Contents
1. [Introduction](#introduction)
2. [Solution Architecture](#solution-architecture )
3. [Software Designs](#hardware-and-software-designs)
4. [Testing](#testing)
5. [Conclusion](#conclusion)
6. [Links](#links)

## Introduction
Problem Domain: 
The current challenges in traditional blood banking often stem from fragmented data and delayed communication. Without a centralized digital system, many blood banks face: 
* Inventory Inefficiency: Difficulty tracking expiration dates, leading to wastage of life-saving units.
  * Accessibility Hurdles: Patients and hospitals struggle to find specific blood types (like O-negative) in real-time during emergencies.
  * Donor Retention: Lack of a structured system to notify donors when they are eligible to donate again. 
  * Safety Risks: Manual record-keeping increases the risk of human error regarding blood screening results and donor history.

Our Proposed Solution:
The proposed Blood Bank Management System is a centralized, web-based platform designed to automate the entire lifecycle of blood donation from donor registration and health screening to inventory management and hospital distribution. By providing a real-time dashboard for administrators and a user-friendly portal for donors, the system ensures that the right blood type reaches the right patient at the right time.

## Solution Architecture
The Blood Bank Management System (BBMS) follows a three-tier architecture with separate frontend, backend, and database layers. Additional background services handle notifications and scheduled tasks to ensure timely alerts.

Frontend (React.js)
    -User interface for donors, hospitals, and admins
    -Displays dashboards, forms, alerts
    -Calls backend APIs (REST) to fetch or send data

Backend (Spring Boot)
    1.Handles business logic
      -Donor management (registration, eligibility checks)
      -Inventory management (stock, expiry, dispatch)
      -Hospital requests (submit, track, approve)
    2.Manages authentication and authorization
    3.Exposes REST APIs for the frontend
    4.Communicates with database and triggers background tasks

Database (MySQL)
  Stores donor data, blood inventory, hospital requests, lab results
  Maintains relations and constraints to ensure integrity
  Supports queries from backend services

Background Jobs / Notifications
  Scheduled tasks for:
    -Blood expiry alerts
    -Donor eligibility reminders
    -Low-stock notifications
  Uses email (SMTP) or push notifications (FCM)
  Ensures real-time responsiveness without manual intervention


## Software Designs

This section presents the software design of the Blood Bank Management System (BBMS), detailing the modules, data flow, database schema, and user interface design. It describes how the system components interact and how functionality is implemented across frontend, backend, and database.
1. Donor Management Module
2. Inventory & Lab Tracking Module
3. Hospital & Request Management Module

## Testing

Testing done on software : detailed + summarized results

## Conclusion

What was achieved, future developments, commercialization plans

## Links

- [Project Repository](https://github.com/cepdnaclk/{{e23-co2060-Bloodbank-Managing-System}})
- [Project Page](https://cepdnaclk.github.io/{{e23-co2060-Bloodbank-Managing-System}})
- [Department of Computer Engineering](http://www.ce.pdn.ac.lk/)
- [University of Peradeniya](https://eng.pdn.ac.lk/)

[//]: # (Please refer this to learn more about Markdown syntax)
[//]: # (https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)
