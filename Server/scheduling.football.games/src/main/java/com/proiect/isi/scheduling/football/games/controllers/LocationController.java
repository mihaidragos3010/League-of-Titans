package com.proiect.isi.scheduling.football.games.controllers;

import com.proiect.isi.scheduling.football.games.dto.LocationDto;
import com.proiect.isi.scheduling.football.games.services.AuthService;
import com.proiect.isi.scheduling.football.games.services.LocationService;
import jakarta.servlet.http.Cookie;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("api")
public class LocationController {

    private final LocationService locationService;
    private final AuthService authService;

    @PostMapping("/locations")
    public ResponseEntity<?> postLocation(@Valid @RequestBody LocationDto locationDto,
                                            @CookieValue(name = "AuthToken") String cookie){

        if(cookie.equals("Admin")) {
            UUID locationId = locationService.addLocation(locationDto);

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(locationId);
        }

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .build();
    }

    @GetMapping("/locations")
    public ResponseEntity<?> getLocations(@CookieValue(name = "AuthToken") String cookie){

        if(cookie.equals("Admin") || cookie.equals("Player")) {
            List<LocationDto> locations = locationService.getAllLocations();

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(locations);
        }

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .build();
    }

    @DeleteMapping("/locations")
    public ResponseEntity<?> deleteLocation(@RequestParam UUID id, @CookieValue(name = "AuthToken") String cookie){

        if(cookie.equals("Admin")) {
            locationService.deleteLocation(id);

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .build();
        }

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .build();
    }

}
