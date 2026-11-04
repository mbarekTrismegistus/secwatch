package com.secwatch.repository;
import com.secwatch.model.IncidentComment;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface CommentRepository extends JpaRepository<IncidentComment,Long> {
    @EntityGraph(attributePaths = {"author"})
    List<IncidentComment> findByIncidentIdOrderByCreatedAtAscIdAsc(Long id);
}
