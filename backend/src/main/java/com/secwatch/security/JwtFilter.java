package com.secwatch.security;
import com.secwatch.repository.UserRepository;
import io.jsonwebtoken.Claims;
import jakarta.servlet.*; import jakarta.servlet.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component; import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException; import java.util.List;

@Component public class JwtFilter extends OncePerRequestFilter {
 private final JwtService jwt; private final UserRepository users;
 public JwtFilter(JwtService jwt, UserRepository users){this.jwt=jwt;this.users=users;}
 @Override protected void doFilterInternal(HttpServletRequest req,HttpServletResponse res,FilterChain chain)throws ServletException,IOException{
  String h=req.getHeader("Authorization");
  if(h!=null&&h.startsWith("Bearer ")) try { Claims c=jwt.parse(h.substring(7)); var u=c.get("uid",Number.class)==null?users.findByEmailIgnoreCase(c.getSubject()).orElse(null):users.findById(c.get("uid",Number.class).longValue()).orElse(null); if(u!=null&&u.enabled&&((Number)c.get("ver",Number.class)).longValue()==u.tokenVersion){var a=new UsernamePasswordAuthenticationToken(u.email,null,List.of(new SimpleGrantedAuthority("ROLE_"+u.role.name()))); SecurityContextHolder.getContext().setAuthentication(a);} } catch(Exception ignored) { }
  chain.doFilter(req,res);
 }
}
