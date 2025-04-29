#!/usr/bin/env bash
# ---------------------------------------------------
# Script: kandji.sh
# Purpose: Sync ActivityWatch app usage events to a server
# Author: Andy
# ---------------------------------------------------

set -euo pipefail

# -------------------------
# Configuration
# -------------------------
LOCAL_API="http://localhost:5600/api/0"
QUERY_ENDPOINT="$LOCAL_API/query/"
BUCKETS_ENDPOINT="$LOCAL_API/buckets/"
STUDENT_ACTIVITY_ENDPOINT="https://schedule-template-andyerdenes-projects.vercel.app/api/student-activity"

# -------------------------
# Utilities
# -------------------------
log_info()    { echo "[INFO] $1"; }
log_error()   { echo "[ERROR] $1" >&2; }
exit_with_error() { log_error "$1"; exit 1; }

# -------------------------
# Dates
# -------------------------
YESTERDAY=$(date -v-1d "+%Y-%m-%dT00:00:00+08:00")
TODAY=$(date "+%Y-%m-%dT00:00:00+08:00")

# -------------------------
# Fetch Buckets
# -------------------------
log_info "Fetching buckets from ActivityWatch..."

BUCKETS_JSON=$(curl -s "$BUCKETS_ENDPOINT")

WINDOW_BUCKET=$(echo "$BUCKETS_JSON" | jq -r '.[] | select(.id | startswith("aw-watcher-window_")) | .id')
AFK_BUCKET=$(echo "$BUCKETS_JSON" | jq -r '.[] | select(.id | startswith("aw-watcher-afk_")) | .id')

if [[ -z "$WINDOW_BUCKET" || -z "$AFK_BUCKET" ]]; then
  exit_with_error "Required buckets not found. Are ActivityWatch watchers running?"
fi

log_info "Found window bucket: $WINDOW_BUCKET"
log_info "Found AFK bucket: $AFK_BUCKET"

# -------------------------
# Build Flood Query Payload
# -------------------------
FLOOD_QUERY=$(cat << EOF
{
  "query": [
    "events = flood(query_bucket(find_bucket(\"$WINDOW_BUCKET\")));",
    "not_afk = flood(query_bucket(find_bucket(\"$AFK_BUCKET\")));",
    "not_afk = filter_keyvals(not_afk, \"status\", [\"not-afk\"]);",
    "events = filter_period_intersect(events, not_afk);",
    "app_events = sort_by_duration(merge_events_by_keys(events, [\"app\"]));",
    "app_events = limit_events(app_events, 100);",
    "RETURN = app_events;"
  ],
  "timeperiods": [
    "${YESTERDAY}/${TODAY}"
  ]
}
EOF
)

# -------------------------
# Query App Events
# -------------------------
log_info "Querying app events from ActivityWatch..."

APP_EVENTS_JSON=$(curl -s -X POST "$QUERY_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "$FLOOD_QUERY")

if [[ -z "$APP_EVENTS_JSON" || "$APP_EVENTS_JSON" == "null" ]]; then
  exit_with_error "No app events returned from ActivityWatch."
fi

log_info "Fetched app events successfully."

# -------------------------
# Get Student ID
# -------------------------
STUDENT_ID=$(stat -f "%Su" /dev/console)

# -------------------------
# Build Student Activity Payload
# -------------------------
STUDENT_ACTIVITY_PAYLOAD=$(cat << EOF
{
  "studentId": "${STUDENT_ID}",
  "logs": ${APP_EVENTS_JSON}
}
EOF
)

# -------------------------
# Post Student Activity
# -------------------------
log_info "Posting student activity to server..."

POST_RESPONSE=$(curl -s -X POST "$STUDENT_ACTIVITY_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "$STUDENT_ACTIVITY_PAYLOAD")

log_info "Server response: $POST_RESPONSE"

log_info "Sync completed successfully."
