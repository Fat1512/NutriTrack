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
