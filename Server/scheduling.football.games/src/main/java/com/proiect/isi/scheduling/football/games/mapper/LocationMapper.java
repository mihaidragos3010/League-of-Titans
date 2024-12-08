package com.proiect.isi.scheduling.football.games.mapper;

import com.proiect.isi.scheduling.football.games.dto.LocationDto;
import com.proiect.isi.scheduling.football.games.entities.Location;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface LocationMapper {

    public Location convertLocationDtoToLocation(LocationDto locationDto);


    public LocationDto convertLocationToLocationDto(Location location);

}
