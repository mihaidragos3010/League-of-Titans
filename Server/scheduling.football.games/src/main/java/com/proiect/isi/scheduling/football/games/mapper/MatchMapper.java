package com.proiect.isi.scheduling.football.games.mapper;

import com.proiect.isi.scheduling.football.games.dto.MatchDto;
import com.proiect.isi.scheduling.football.games.entities.Location;
import com.proiect.isi.scheduling.football.games.entities.Match;
import com.proiect.isi.scheduling.football.games.services.LocationService;
import jakarta.persistence.EntityNotFoundException;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.UUID;

@Mapper(componentModel = "spring")
public abstract class MatchMapper {

    @Autowired
    private LocationService locationService;

    @Mapping(target = "location", source = "locationId", qualifiedByName = "mapLocationIdToLocation")
    public abstract Match convertMatchDtoToMatch(MatchDto matchDto);

    @Mapping(target = "locationId", source = "location", qualifiedByName = "mapLocationToLocationId")
    public abstract MatchDto convertMatchToMatchDto(Match match);

    @Named("mapLocationIdToLocation")
    protected Location mapLocationIdToLocation(UUID locationId) {
        return locationService.findLocationById(locationId)
                .orElseThrow(() -> new EntityNotFoundException("Location not found with ID: " + locationId));
    }

    @Named("mapLocationToLocationId")
    protected UUID mapLocationToLocationId(Location location) {
        return location.getId();
    }
}
