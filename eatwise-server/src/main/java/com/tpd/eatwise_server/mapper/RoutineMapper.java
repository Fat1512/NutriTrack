package com.tpd.eatwise_server.mapper;

import com.tpd.eatwise_server.dto.response.RoutineResponse;
import com.tpd.eatwise_server.entity.Routine;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoutineMapper {
    RoutineResponse convertToResponse(Routine routine);
}
