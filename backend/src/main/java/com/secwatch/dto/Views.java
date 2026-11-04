package com.secwatch.dto;
import com.secwatch.model.*;
import java.time.Instant;
import java.util.Map;
import java.util.List;
public final class Views {
    private Views() {}
    public record UserView(Long id, String fullName, String email, Role role, boolean enabled, Instant createdAt) {
        public static UserView of(User u) { return new UserView(u.getId(),u.getFullName(),u.getEmail(),u.getRole(),u.isEnabled(),u.getCreatedAt()); }
    }
    public record AuthView(String token, Role role, String fullName, UserView user, long expiresIn) {}
    public record IncidentView(Long id, String title, String description, Category category, Priority priority, Status status, Instant createdAt, Instant updatedAt, UserView createdBy, UserView assignedTo) {
        public static IncidentView of(Incident i) { return new IncidentView(i.id,i.title,i.description,i.category,i.priority,i.status,i.createdAt,i.updatedAt,i.createdBy == null ? null : UserView.of(i.createdBy),i.assignedTo == null ? null : UserView.of(i.assignedTo)); }
    }
    public record HistoryView(Long id, String message, UserView actor, Instant createdAt) {
        public static HistoryView of(IncidentHistory h) { return new HistoryView(h.id,h.message,UserView.of(h.actor),h.createdAt); }
    }
    public record CommentView(Long id, String content, UserView author, Instant createdAt) {
        public static CommentView of(IncidentComment c) { return new CommentView(c.id,c.content,UserView.of(c.author),c.createdAt); }
    }
    public record Detail(IncidentView incident, List<HistoryView> history, List<CommentView> comments) {}
    public record AdminDashboard(Map<String, Long> statistics, List<IncidentView> incidents) {}
}
