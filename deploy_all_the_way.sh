#!/bin/bash
SCRIPT_ID="1QBvAvDZv4qmbGlpQ-XF7f-Ae5WlmC3OAO3KSOkkCqxHOAhZUIPI53ZEa"

# Parse command line arguments
for arg in "$@"; do
    if [ "$arg" == "--testecho" ]; then
        TEST_MODE=true
    fi
done

# Prompt the user for input
read -p "Enter the new version number and description (e.g., '1.2.3 published'): " VERSION

# Extract the version number and description from the user input
NEW_VERSION=$(echo "$VERSION" | cut -d ' ' -f 1)
DESCRIPTION=$(echo "$VERSION" | cut -d ' ' -f 2-)


# Deploy the add-on
echo "Deploying the add-on..."
if [ "$TEST_MODE" = true ]; then
  echo "clasp deploy --description '$DESCRIPTION' --version '$NEW_VERSION'"
else
  DEPLOYMENT_ID=$(clasp deploy --description "$DESCRIPTION" --version "$NEW_VERSION" | sed -nE 's/^.*deploymentId=([0-9]+).*$/\1/p')
fi

# Update the deployment status
echo "Updating the deployment status to '$NEW_VERSION'..."
if [ "$TEST_MODE" = true ]; then
  echo 'curl --request PUT \
  --url https://script.googleapis.com/v1/projects/'"$SCRIPT_ID"'/deployments/'"$DEPLOYMENT_ID"' \
  --header "authorization: Bearer '$ACCESS_TOKEN'" \
  --header "content-type: application/json" \
  --data "{\"deploymentConfig\": {\"version\": \"$NEW_VERSION\"}}"'
else
  SCRIPT_ID=$(clasp status | grep -E "^scriptId: " | sed -E 's/^scriptId: (.+)$/\1/')
  ACCESS_TOKEN=$(gcloud auth application-default print-access-token)
  curl --request PUT \
    --url https://script.googleapis.com/v1/projects/$SCRIPT_ID/deployments/$DEPLOYMENT_ID \
    --header "authorization: Bearer $ACCESS_TOKEN" \
    --header "content-type: application/json" \
    --data "{\"deploymentConfig\": {\"version\": \"$NEW_VERSION\"}}"
fi

echo "Done!"
