package com.secwatch.dto;
import com.secwatch.model.*;
import jakarta.validation.constraints.*;
public final class Requests {
    private Requests() {}
    public record Register(@NotBlank @Size(max=100) String fullName, @NotBlank @Email @Size(max=254) String email, @NotBlank @Size(min=8,max=72) String password) {}
    public record Login(@NotBlank @Email String email, @NotBlank String password) {}
    public record Profile(@NotBlank @Size(max=100) String fullName, @NotBlank @Email @Size(max=254) String email) {}
    public record Password(@NotBlank String oldPassword, @NotBlank @Size(min=8,max=72) String newPassword, @NotBlank String confirmation) {}
    public record NewIncident(@NotBlank @Size(max=160) String title, @NotBlank @Size(max=5000) String description, @NotNull Category category, @NotNull Priority priority) {}
    public record ChangeStatus(@NotNull Status status) {}
    public record Comment(@NotBlank @Size(max=3000) String content) {}
}
