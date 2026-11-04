package com.secwatch.model;
import jakarta.persistence.*;
import java.time.Instant;
@Entity
public class IncidentHistory {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
    @ManyToOne(fetch=FetchType.LAZY, optional=false) public Incident incident;
    @ManyToOne(fetch=FetchType.LAZY, optional=false) public User actor;
    @Column(nullable=false, length=500) public String message;
    @Column(nullable=false) public Instant createdAt = Instant.now();
}
