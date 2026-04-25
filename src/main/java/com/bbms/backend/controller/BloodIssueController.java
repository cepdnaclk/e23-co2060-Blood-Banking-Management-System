package com.bbms.backend.controller;

import com.bbms.backend.entity.BloodIssue;
import com.bbms.backend.entity.BloodRequest;
import com.bbms.backend.Repository.BloodIssueRepository;
import com.bbms.backend.Repository.BloodRequestRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
@CrossOrigin
public class BloodIssueController {

    private final BloodIssueRepository issueRepo;
    private final BloodRequestRepository requestRepo;

    public BloodIssueController(BloodIssueRepository issueRepo,
                                BloodRequestRepository requestRepo) {
        this.issueRepo = issueRepo;
        this.requestRepo = requestRepo;
    }

    // ISSUE BLOOD
    @PostMapping("/{requestId}")
    public String issue(@PathVariable Long requestId) {

        BloodRequest req = requestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (req.getStatus() != BloodRequest.Status.APPROVED) {
            return "Cannot issue - request not approved";
        }

        BloodIssue issue = new BloodIssue();
        issue.setRequestId(req.getRequestId());
        issue.setHospitalName(req.getHospitalName());
        issue.setBloodGroup(req.getBloodGroup());
        issue.setComponentType(req.getComponentType());
        issue.setQuantity(req.getQuantity());

        issueRepo.save(issue);

        return "Blood issued successfully";
    }

    // VIEW ALL ISSUES
    @GetMapping
    public List<BloodIssue> getAll() {
        return issueRepo.findAll();
    }
}
