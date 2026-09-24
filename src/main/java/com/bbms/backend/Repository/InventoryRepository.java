package com.bbms.backend.Repository;

import com.bbms.backend.entity.Inventory;
import com.bbms.backend.entity.BloodComponent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    @Query("SELECT SUM(i.quantity) FROM Inventory i")
    Double sumAllUnits();

    @Query("SELECT i.bloodGroup, SUM(i.quantity) FROM Inventory i GROUP BY i.bloodGroup")
    List<Object[]> getUnitsByBloodGroup();

    List<Inventory> findByBloodGroup(String bloodGroup);

    List<Inventory> findByComponentType(BloodComponent.ComponentType componentType);

    List<Inventory> findByBloodGroupAndComponentType(
            String bloodGroup,
            BloodComponent.ComponentType componentType
    );
}