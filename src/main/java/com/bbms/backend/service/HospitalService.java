package com.bbms.backend.service;

import com.bbms.backend.Repository.HospitalRepository;
import com.bbms.backend.entity.Hospital;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HospitalService {

    private final HospitalRepository repo;

    public HospitalService(HospitalRepository repo) {
        this.repo = repo;
    }

    public List<Hospital> getAll() {
        return repo.findAll();
    }

    public Hospital create(Hospital hospital) {

        if (hospital.getName() == null || hospital.getName().isEmpty()) {
            throw new RuntimeException("Hospital name required");
        }

        return repo.save(hospital);
    }

    public void delete(Long id) {

        if (!repo.existsById(id)) {
            throw new RuntimeException("Hospital not found");
        }

        repo.deleteById(id);
    }
}

