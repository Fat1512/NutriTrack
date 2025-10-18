package com.tpd.eatwise_server.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;


@Document(collection = "ingredient")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Ingredient {
    @Id
    private int id;
    private String name;
    @Field("cal/g")
    private double cal;
    private double fat;
    private double carb;
    private double protein;
}
