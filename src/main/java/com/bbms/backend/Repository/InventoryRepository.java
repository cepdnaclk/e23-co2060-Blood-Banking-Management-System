package com.bbms.backend.Repository;

import com.bbms.backend.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import com.bbms.backend.entity.BloodComponent;

import java.util.List;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    List<Inventory> findByBloodGroup(String bloodGroup);
    List<Inventory> findByComponentType(BloodComponent.ComponentType componentType);
}
