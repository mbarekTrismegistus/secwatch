package com.secwatch.model;
import jakarta.persistence.*;
import java.time.Instant;
@Entity
public class IncidentComment {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
    @ManyToOne(fetch=FetchType.LAZY, optional=false) public Incident incident;
    @ManyToOne(fetch=FetchType.LAZY, optional=false) public User author;
    @Column(nullable=false, length=3000) public String content;
    @Column(nullable=false) public Instant createdAt = Instant.now();
}
