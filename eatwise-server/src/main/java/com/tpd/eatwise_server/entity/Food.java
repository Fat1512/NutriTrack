package com.tpd.eatwise_server.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "food")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Food {
    @Id
    private String id;
    private String name;
    private LocalDateTime createdAt;
    private List<IngredientFood> ingredients;
    private String image;
    private double totalCal;
    private double totalProtein;
    private double totalFat;
    private double totalCarb;

    public void addIngredient(Ingredient ingredient, double weight) {
        if (this.ingredients == null)
            this.ingredients = new ArrayList<>();

        IngredientFood ingredientFood = IngredientFood.builder()
                .cal(ingredient.getCal())
                .fat(ingredient.getFat())
                .protein(ingredient.getProtein())
                .carb(ingredient.getCarb())
                .weight(weight)
                .name(ingredient.getName())
                .build();

        this.ingredients.add(ingredientFood);

    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @SuperBuilder
    public static class IngredientFood extends Ingredient {
        private double weight;
    }
}
