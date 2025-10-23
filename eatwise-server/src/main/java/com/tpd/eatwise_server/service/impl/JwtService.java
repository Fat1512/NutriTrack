/*
 * Copyright 2025 NutriTrack
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.tpd.eatwise_server.service.impl;

import com.tpd.eatwise_server.dto.TokenDTO;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

@Service
public class JwtService {
    @Value(value = "${app.token.secret}")
    private String SECRET_KEY;

    @Value(value = "${app.token.expirationTime}")
    private int expirationTime;

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

    }

    private String generateToken(Map<String, Object> extraClaims, String username, Date expirationTime) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(expirationTime)
                .signWith(getSignInKey())
                .compact();
    }

    public TokenDTO generateToken(String username, String userKey) {
        Date now = new Date();

        UUID uuid = UUID.randomUUID();
        Map<String, Object> extraClaims = new HashMap<>() {{
            put("uuid", uuid);
            put("userKey", userKey);
        }};

        Date accessTokenExpirationTime = new Date(now.getTime() * expirationTime);

        String accessToken = generateToken(extraClaims, username, accessTokenExpirationTime);

        return TokenDTO.builder()
                .accessToken(accessToken)
                .build();
    }

    public String extractToken(String token) {
        return token.split(" ")[1];
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Boolean validateToken(String token) {
        if(token == null || token.trim().isEmpty()) return false;

        String username = extractUsername(token);
        return !(username == null || username.isEmpty() || isTokenExpired(token));
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64URL.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}