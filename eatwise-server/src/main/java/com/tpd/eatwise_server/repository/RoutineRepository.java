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
package com.tpd.eatwise_server.repository;

import com.tpd.eatwise_server.dto.response.MessageResponse;
import com.tpd.eatwise_server.dto.response.NutrientAggregationResponse;
import com.tpd.eatwise_server.entity.Routine;
import com.tpd.eatwise_server.entity.User;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface RoutineRepository extends MongoRepository<Routine, String> {
    @Query("{ 'userId': ?0, 'pickedDate': ?1 }")
    Optional<Routine> findRoutinePickedDate(String userId, LocalDate pickedDate);

    @Aggregation(pipeline = {
            "{ $match: { userId: ?0, pickedDate: { $gte: ?1, $lte: ?2 } } }",
            "{ $project: { pickedDate: 1, allMeals: { $concatArrays: [ '$foods.BREAKFAST', '$foods.LUNCH', '$foods.DINNER' ] } } }",
            "{ $unwind: '$allMeals' }",
            "{ $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$pickedDate' } }, " +
                    "totalCal: { $sum: '$allMeals.totalCal' }, " +
                    "totalProtein: { $sum: '$allMeals.totalProtein' }, " +
                    "totalFat: { $sum: '$allMeals.totalFat' }, " +
                    "totalCarb: { $sum: '$allMeals.totalCarb' } } }",
            "{ $sort: { _id: 1 } }"
    })
    List<Map<String, Object>> staticNutrient(
            String userId,
            LocalDate startDate,
            LocalDate endDate
    );
    @Query("{ 'userId': ?0, 'pickedDate': { $gte: ?1, $lt: ?2 } }")
    List<Routine> findByUserIdAndMonth(String userId, LocalDate startOfMonth, LocalDate endOfMonth);

    @Aggregation(pipeline = {
            "{ $match: { userId: ?0, pickedDate: { $gte: ?1, $lte: ?2 } } }",
            "{ $project: { allMeals: { $concatArrays: [ '$foods.BREAKFAST', '$foods.LUNCH', '$foods.DINNER' ] } } }",
            "{ $unwind: '$allMeals' }",
            "{ $group: { _id: null, " +
                    "consumeCal: { $sum: '$allMeals.totalCal' }, " +
                    "consumeProtein: { $sum: '$allMeals.totalProtein' }, " +
                    "consumeFat: { $sum: '$allMeals.totalFat' }, " +
                    "consumeCarb: { $sum: '$allMeals.totalCarb' } } }"
    })
    Optional<NutrientAggregationResponse> findWeeklyTotal(String userId, LocalDate startDate, LocalDate endDate);

}
