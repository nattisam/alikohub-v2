# Aliko Events API Gateway

This module exposes the Events microservice functionality through RESTful endpoints.

## Public Endpoints

### List Upcoming Events
```
GET /events
```
Returns all events with a future datetime.

### Get Event Details
```
GET /events/{event_id}
```

### Register for an Event
```
POST /events/{event_id}/register
```
Requires global user email (already registered via auth-service).
Prevents duplicate registration per event.

### Get News & Updates
```
GET /updates
```

## Organizer Endpoints

All organizer endpoints require a JWT token from the global auth-service and the user must have the ORGANIZER role in the Events subdomain.

### Create Event
```
POST /admin/events
```

### Update Event
```
PUT /admin/events/{event_id}
```

### Delete Event
```
DELETE /admin/events/{event_id}
```

### View Attendees
```
GET /admin/events/{event_id}/registrations
```

### Remove Registration
```
DELETE /admin/events/{event_id}/registrations/{registration_id}
```

### Post Update
```
POST /admin/updates
```

### Update Update
```
PUT /admin/updates/{update_id}
```

### Delete Update
```
DELETE /admin/updates/{update_id}
```

### Assign Role
```
POST /events/assign-role
```
Allows a user to request or be assigned a role (USER or ORGANIZER).