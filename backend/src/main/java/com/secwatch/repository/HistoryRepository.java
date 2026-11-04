package com.secwatch.repository;
import com.secwatch.model.IncidentHistory;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface HistoryRepository extends JpaRepository<IncidentHistory,Long> {
    @EntityGraph(attributePaths = {"actor"})
    List<IncidentHistory> findByIncidentIdOrderByCreatedAtAscIdAsc(Long id);
}
