#!/bin/bash

concurrently \
"cd backend/cafe-app && ./mvnw spring-boot:run" \
"cd cafe-frontend && npm start"
