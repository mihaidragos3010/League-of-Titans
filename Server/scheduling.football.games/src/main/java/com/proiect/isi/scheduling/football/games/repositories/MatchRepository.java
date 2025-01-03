package com.proiect.isi.scheduling.football.games.repositories;

import com.proiect.isi.scheduling.football.games.entities.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Repository
public interface MatchRepository extends JpaRepository<Match, UUID> {

    @Query("SELECT m FROM Match m WHERE m.startDate = :startDate")
    List<Match> findByStartDate(@Param("startDate") Date startDate);

    List<Match> findByEndDate(Date startDate);

    @Query("SELECT m FROM Match m WHERE (m.startDate BETWEEN :startDate AND :endDate) OR (m.endDate BETWEEN :startDate AND :endDate)")
    List<Match> findMatchesWithinRange(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

}
