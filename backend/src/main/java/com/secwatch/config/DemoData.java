package com.secwatch.config;
import com.secwatch.model.*;import com.secwatch.repository.UserRepository;import org.springframework.boot.ApplicationArguments;import org.springframework.boot.ApplicationRunner;import org.springframework.beans.factory.annotation.Value;import org.springframework.security.crypto.password.PasswordEncoder;import org.springframework.stereotype.Component;
@Component public class DemoData implements ApplicationRunner {
 private final UserRepository users;private final PasswordEncoder encoder;private final boolean enabled;
 public DemoData(UserRepository u,PasswordEncoder e,@Value("${app.seed-demo:true}") boolean enabled){users=u;encoder=e;this.enabled=enabled;}
 public void run(ApplicationArguments args){if(!enabled)return;create("Administrateur SecWatch","admin@secwatch.local",Role.ADMIN);create("Technicien SecWatch","tech@secwatch.local",Role.TECHNICIAN);create("Employée Démo","employee@secwatch.local",Role.EMPLOYEE);create("Employé Démo 2","employee2@secwatch.local",Role.EMPLOYEE);}
 void create(String name,String email,Role role){if(users.existsByEmailIgnoreCase(email))return;User u=new User();u.fullName=name;u.email=email;u.password=encoder.encode("Demo1234!");u.role=role;users.save(u);}
}
