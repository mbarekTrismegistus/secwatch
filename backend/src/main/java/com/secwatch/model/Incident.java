package com.secwatch.model;
import jakarta.persistence.*;
import java.time.Instant;
@Entity
public class Incident {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
    @Column(nullable=false, length=160) public String title;
    @Column(nullable=false, length=5000) public String description;
    @Enumerated(EnumType.STRING) @Column(nullable=false) public Category category;
    @Enumerated(EnumType.STRING) @Column(nullable=false) public Priority priority;
    @Enumerated(EnumType.STRING) @Column(nullable=false) public Status status = Status.OPEN;
    @Column(nullable=false, updatable=false) public Instant createdAt = Instant.now();
    @Column(nullable=false) public Instant updatedAt = Instant.now();
    @ManyToOne(fetch=FetchType.LAZY, optional=false) @JoinColumn(name="created_by", nullable=false) public User createdBy;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="assigned_to") public User assignedTo;
    @Version public long version;
}
