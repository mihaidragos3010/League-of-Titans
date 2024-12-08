package com.proiect.isi.scheduling.football.games.services;

import com.proiect.isi.scheduling.football.games.dto.LocationDto;
import com.proiect.isi.scheduling.football.games.entities.Location;
import com.proiect.isi.scheduling.football.games.mapper.LocationMapper;
import com.proiect.isi.scheduling.football.games.repositories.LocationRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LocationService {

    private final LocationRepository locationRepository;
    private final LocationMapper locationMapper;

    public Optional<Location> findLocationById(UUID id){
        return locationRepository.findById(id);
    }

    public UUID addLocation(LocationDto locationDto){
        Location location = locationMapper.convertLocationDtoToLocation(locationDto);
        Location locationSaved = locationRepository.save(location);

        return locationSaved.getId();
    }


    public List<LocationDto> getAllLocations(){
        return locationRepository.findAll().stream()
                .map(locationMapper::convertLocationToLocationDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteLocation(UUID id){
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Location not found with id: " + id));

        locationRepository.delete(location);
    }

}
