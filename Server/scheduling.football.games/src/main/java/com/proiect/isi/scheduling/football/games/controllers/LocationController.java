package com.proiect.isi.scheduling.football.games.controllers;

import com.proiect.isi.scheduling.football.games.dto.LocationDto;
import com.proiect.isi.scheduling.football.games.services.LocationService;
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

    @PostMapping("/locations")
    public ResponseEntity<?> postLocation(@Valid @RequestBody LocationDto locationDto){

        UUID locationId = locationService.addLocation(locationDto);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(locationId);
    }

    @GetMapping("/locations")
    public ResponseEntity<?> getLocations(){

        List<LocationDto> locations = locationService.getAllLocations();

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(locations);
    }

    @DeleteMapping("/locations")
    public ResponseEntity<?> deleteLocation(@RequestParam UUID id){

        locationService.deleteLocation(id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

}
