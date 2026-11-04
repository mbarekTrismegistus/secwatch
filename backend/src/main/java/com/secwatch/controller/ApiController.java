package com.secwatch.controller;
import com.secwatch.dto.*;import com.secwatch.model.*;import com.secwatch.service.AppService;import jakarta.validation.Valid;import org.springframework.security.access.prepost.PreAuthorize;import org.springframework.web.bind.annotation.*;import java.security.Principal;import java.util.*;
@RestController public class ApiController {
 final AppService s; public ApiController(AppService s){this.s=s;}
 @PostMapping("/auth/register") public Views.AuthView register(@Valid @RequestBody Requests.Register r){return s.register(r);}
 @PostMapping("/auth/login") public Views.AuthView login(@Valid @RequestBody Requests.Login r){return s.login(r);}
 @GetMapping("/api/profile") public Views.UserView profile(Principal p){return s.profile(p.getName());}
 @PutMapping("/api/profile") public Views.UserView profile(Principal p,@Valid @RequestBody Requests.Profile r){return s.updateProfile(p.getName(),r);}
 @PutMapping("/api/profile/password") public Map<String,String> password(Principal p,@Valid @RequestBody Requests.Password r){s.password(p.getName(),r);return Map.of("message","Mot de passe modifié.");}
 @PostMapping("/api/incidents") @PreAuthorize("hasRole('EMPLOYEE')") public Views.IncidentView create(Principal p,@Valid @RequestBody Requests.NewIncident r){return s.create(p.getName(),r);}
 @GetMapping("/api/incidents/my") @PreAuthorize("hasRole('EMPLOYEE')") public List<Views.IncidentView> mine(Principal p){return s.mine(p.getName());}
 @GetMapping("/api/incidents/assigned") @PreAuthorize("hasRole('TECHNICIAN')") public List<Views.IncidentView> assigned(Principal p){return s.assigned(p.getName());}
 @GetMapping("/api/incidents") @PreAuthorize("hasRole('ADMIN')") public List<Views.IncidentView> all(){return s.all();}
 @GetMapping("/api/admin/dashboard") @PreAuthorize("hasRole('ADMIN')") public Views.AdminDashboard adminDashboard(){return s.adminDashboard();}
 @GetMapping("/api/incidents/{id}") public Views.Detail detail(Principal p,@PathVariable Long id){return s.detail(p.getName(),id);}
 @PutMapping("/api/incidents/{id}/status") @PreAuthorize("hasAnyRole('TECHNICIAN','ADMIN')") public Views.IncidentView status(Principal p,@PathVariable Long id,@Valid @RequestBody Requests.ChangeStatus r){return s.status(p.getName(),id,r.status());}
 @PutMapping("/api/incidents/{id}/assign/{technicianId}") @PreAuthorize("hasRole('ADMIN')") public Views.IncidentView assign(Principal p,@PathVariable Long id,@PathVariable Long technicianId){return s.assign(p.getName(),id,technicianId);}
 @PostMapping("/api/incidents/{id}/comments") @PreAuthorize("hasAnyRole('TECHNICIAN','ADMIN')") public Views.CommentView comment(Principal p,@PathVariable Long id,@Valid @RequestBody Requests.Comment r){return s.comment(p.getName(),id,r);}
 @GetMapping("/api/admin/users") @PreAuthorize("hasRole('ADMIN')") public List<Views.UserView> users(){return s.userList();}
 @PutMapping("/api/admin/users/{id}/enable") @PreAuthorize("hasRole('ADMIN')") public Views.UserView enable(@PathVariable Long id){return s.enable(id,true);}
 @PutMapping("/api/admin/users/{id}/disable") @PreAuthorize("hasRole('ADMIN')") public Views.UserView disable(@PathVariable Long id){return s.enable(id,false);}
 @GetMapping("/api/admin/statistics") @PreAuthorize("hasRole('ADMIN')") public Map<String,Long> stats(){return s.stats();}
}
