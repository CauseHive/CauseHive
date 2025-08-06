#!/bin/bash

echo "Updating each service to use its own database..."

# Azure Database connection details
DB_HOST="causehive-dba.postgres.database.azure.com"
DB_USER="user_niicommey"
DB_PORT="5432"

# You'll need to provide the actual password
echo "Please enter your Azure database password:"
read -s DB_PASSWORD

# Update user-service to use user_service database
echo "Updating user-service to use user_service database..."
az containerapp update \
  --name user-service \
  --resource-group causehive-rg \
  --set-env-vars \
  DEBUG=false \
  DB_NAME=user_service \
  DB_USER=$DB_USER \
  DB_PASSWORD=$DB_PASSWORD \
  DB_HOST=$DB_HOST \
  DB_PORT=$DB_PORT \
  SECRET_KEY=django-insecure-your-secret-key-here-change-in-production \
  ADMIN_SERVICE_API_KEY=your-admin-api-key-here \
  FRONTEND_URL=https://your-frontend-url.com \
  BACKEND_URL=https://your-backend-url.com

# Update cause-service to use cause_service database
echo "Updating cause-service to use cause_service database..."
az containerapp update \
  --name cause-service \
  --resource-group causehive-rg \
  --set-env-vars \
  DEBUG=false \
  DB_NAME=cause_service \
  DB_USER=$DB_USER \
  DB_PASSWORD=$DB_PASSWORD \
  DB_HOST=$DB_HOST \
  DB_PORT=$DB_PORT \
  SECRET_KEY=django-insecure-your-secret-key-here-change-in-production \
  ADMIN_SERVICE_API_KEY=your-admin-api-key-here \
  FRONTEND_URL=https://your-frontend-url.com \
  BACKEND_URL=https://your-backend-url.com

# Update donation-processing-service to use donation_processing_service database
echo "Updating donation-processing-service to use donation_processing_service database..."
az containerapp update \
  --name donation-processing-service \
  --resource-group causehive-rg \
  --set-env-vars \
  DEBUG=false \
  DB_NAME=donation_processing_service \
  DB_USER=$DB_USER \
  DB_PASSWORD=$DB_PASSWORD \
  DB_HOST=$DB_HOST \
  DB_PORT=$DB_PORT \
  SECRET_KEY=django-insecure-your-secret-key-here-change-in-production \
  ADMIN_SERVICE_API_KEY=your-admin-api-key-here \
  FRONTEND_URL=https://your-frontend-url.com \
  BACKEND_URL=https://your-backend-url.com

# Update admin-reporting-service to use admin_reporting_service database
echo "Updating admin-reporting-service to use admin_reporting_service database..."
az containerapp update \
  --name admin-reporting-service \
  --resource-group causehive-rg \
  --set-env-vars \
  DEBUG=false \
  DB_NAME=admin_reporting_service \
  DB_USER=$DB_USER \
  DB_PASSWORD=$DB_PASSWORD \
  DB_HOST=$DB_HOST \
  DB_PORT=$DB_PORT \
  SECRET_KEY=django-insecure-your-secret-key-here-change-in-production \
  ADMIN_SERVICE_API_KEY=your-admin-api-key-here \
  FRONTEND_URL=https://your-frontend-url.com \
  BACKEND_URL=https://your-backend-url.com

# Update withdrawal-service to use withdrawal_service database (will be created when needed)
echo "Updating withdrawal-service to use withdrawal_service database..."
az containerapp update \
  --name withdrawal-service \
  --resource-group causehive-rg \
  --set-env-vars \
  DEBUG=false \
  DB_NAME=withdrawal_service \
  DB_USER=$DB_USER \
  DB_PASSWORD=$DB_PASSWORD \
  DB_HOST=$DB_HOST \
  DB_PORT=$DB_PORT \
  SECRET_KEY=django-insecure-your-secret-key-here-change-in-production \
  ADMIN_SERVICE_API_KEY=your-admin-api-key-here \
  FRONTEND_URL=https://your-frontend-url.com \
  BACKEND_URL=https://your-backend-url.com

echo ""
echo "Database assignments updated successfully!"
echo ""
echo "Service Database Mapping:"
echo "- user-service → user_service"
echo "- cause-service → cause_service"
echo "- donation-processing-service → donation_processing_service"
echo "- admin-reporting-service → admin_reporting_service"
echo "- withdrawal-service → withdrawal_service (will be created when code is ready)" 