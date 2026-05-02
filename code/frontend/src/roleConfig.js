const roleConfig = {
  ADMIN: [
    "dashboard", "users", "hospitals", "donorApproval",
    "screening", "donation", "inventory","donorManagement",
    "bloodIssue", "alerts", "audit", "reports"
  ],

  HOSPITAL_STAFF: [
    "dashboard", "donorApproval",
    "screening", "donation", "donorManagement",
    "bloodRequests", "bloodIssue", "reports"
  ],

  LAB_STAFF: [
    "dashboard", "bloodTesting", "bloodComponents", "alerts","donorManagement", 
  ],

  RECEPTION_STAFF: [
    "dashboard", "donorApproval", "donorRegistration", "donorManagement"
  ]
};

export default roleConfig;