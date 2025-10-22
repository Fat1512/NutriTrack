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
package com.tpd.eatwise_server.utils;

public enum APIResponseMessage {
    SUCCESSFULLY_CREATED("Successfully created"),
    SUCCESSFULLY_UPDATED("Successfully updated"),
    SUCCESSFULLY_DELETED("Successfully deleted"),
    SUCCESSFULLY_RETRIEVED("Successfully retrieved"),

    SUCCESSFULLY_LOGIN("Successfully login"),
    SUCCESSFULLY_REGISTER("Successfully register"),
    SUCCESSFULLY_LOGOUT("Successfully logout");

    final String message;
    APIResponseMessage(String message) {
        this.message = message;
    }
}
