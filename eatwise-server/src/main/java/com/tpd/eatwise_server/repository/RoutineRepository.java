package com.tpd.eatwise_server.repository;

import com.tpd.eatwise_server.dto.response.MessageResponse;
import com.tpd.eatwise_server.entity.Routine;
import com.tpd.eatwise_server.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface RoutineRepository extends MongoRepository<Routine, String> {
    @Query("{ 'userId': ?0, 'pickedDate': ?1 }")
    Optional<Routine> findRoutinePickedDate(String userId, LocalDate pickedDate);
}
