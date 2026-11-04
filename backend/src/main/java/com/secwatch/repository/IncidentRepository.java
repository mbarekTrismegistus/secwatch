package com.secwatch.repository;
import com.secwatch.model.Incident;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;
public interface IncidentRepository extends JpaRepository<Incident,Long> {
    @Query("select i from Incident i left join fetch i.createdBy left join fetch i.assignedTo where i.id = :id")
    Optional<Incident> findWithUsersById(@Param("id") Long id);
    @EntityGraph(attributePaths = {"createdBy", "assignedTo"})
    List<Incident> findByCreatedByIdOrderByCreatedAtDesc(Long id);
    @EntityGraph(attributePaths = {"createdBy", "assignedTo"})
    List<Incident> findByAssignedToIdOrderByCreatedAtDesc(Long id);
}
