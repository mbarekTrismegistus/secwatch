package com.secwatch.security;
import com.secwatch.model.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
    private final SecretKey key; private final long ttl;
    public JwtService(@Value("${app.jwt-secret}") String secret, @Value("${app.jwt-ttl-seconds:300}") long ttl) {
        this.key=Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)); this.ttl=ttl;
    }
    public String generate(User user) { Instant now=Instant.now(); return Jwts.builder().subject(user.email).issuedAt(Date.from(now)).expiration(Date.from(now.plusSeconds(ttl))).claim("role",user.role.name()).claim("uid",user.id).claim("ver",user.tokenVersion).signWith(key).compact(); }
    public Claims parse(String token) { return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload(); }
    public long ttl() { return ttl; }
}
