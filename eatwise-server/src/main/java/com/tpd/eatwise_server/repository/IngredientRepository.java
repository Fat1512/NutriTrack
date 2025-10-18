package com.tpd.eatwise_server.repository;

import com.tpd.eatwise_server.entity.Ingredient;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IngredientRepository extends MongoRepository<Ingredient, Integer> {

    Optional<Ingredient> findByName(String name);
}
