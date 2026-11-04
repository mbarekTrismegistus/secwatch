package com.secwatch.model;
import jakarta.persistence.*;
import java.time.Instant;
@Entity
@Table(name="app_users", uniqueConstraints=@UniqueConstraint(columnNames="email"))
public class User {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
    @Column(nullable=false, length=100) public String fullName;
    @Column(nullable=false, length=254) public String email;
    @Column(nullable=false) public String password;
    @Enumerated(EnumType.STRING) @Column(nullable=false) public Role role = Role.EMPLOYEE;
    @Column(nullable=false) public boolean enabled = true;
    @Column(nullable=false, updatable=false) public Instant createdAt = Instant.now();
    @Column(nullable=false) public long tokenVersion = 0;

    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public Role getRole() { return role; }
    public boolean isEnabled() { return enabled; }
    public Instant getCreatedAt() { return createdAt; }
}
