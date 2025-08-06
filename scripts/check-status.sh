#!/bin/bash

echo "=== CauseHive Container Apps Status ==="
echo ""

SERVICES=("user-service" "cause-service" "donation-processing-service" "admin-reporting-service" "withdrawal-service")

for service in "${SERVICES[@]}"; do
    echo "🔍 Checking $service..."
    az containerapp show \
        --name $service \
        --resource-group causehive-rg \
        --query "{name:name, status:properties.runningStatus, revision:properties.latestRevisionName, url:properties.configuration.ingress.fqdn}" \
        --output table
    echo ""
done

echo "=== Quick Health Check ==="
echo "You can also test the endpoints directly:"
echo "• User Service: https://user-service.grayocean-5aa1da5f.ukwest.azurecontainerapps.io"
echo "• Cause Service: https://cause-service.grayocean-5aa1da5f.ukwest.azurecontainerapps.io"
echo "• Donation Processing: https://donation-processing-service.grayocean-5aa1da5f.ukwest.azurecontainerapps.io"
echo "• Admin Reporting: https://admin-reporting-service.grayocean-5aa1da5f.ukwest.azurecontainerapps.io"
echo "• Withdrawal Service: https://withdrawal-service.grayocean-5aa1da5f.ukwest.azurecontainerapps.io" 