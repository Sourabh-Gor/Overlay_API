# Livestream Overlay App

## Overview

The Livestream Overlay App allows users to manage overlays on a live video stream. It supports CRUD operations (Create, Read, Update, Delete) for overlays, providing flexibility in content, position, and size adjustments.

## API Documentation

### 1. Create Overlay

**Endpoint:** `POST /api/overlays`

**Description:** Create a new overlay.

**Request Format:**
json
{
  "content": "Overlay Content",
  "position": {
    "top": 0,
    "left": 0
  },
  "size": {
    "width": 100,
    "height": 50
  }
}

**Response Format:**

json
{
  "_id": "GeneratedOverlayId",
  "content": "Overlay Content",
  "position": {
    "top": 0,
    "left": 0
  },
  "size": {
    "width": 100,
    "height": 50
  }
}
### 2. Get Overlay ID
Endpoint: GET /api/overlays/{overlay_id}

Description: Retrieve details of a specific overlay.

**Response Format:**

json
{
  "_id": "OverlayId",
  "content": "Overlay Content",
  "position": {
    "top": 0,
    "left": 0
  },
  "size": {
    "width": 100,
    "height": 50
  }
}

### 3. Update Overlay

Endpoint: PUT /api/overlays/{overlay_id}

Description: Update the content, position, or size of an existing overlay.

**Request Format:**

json
{
  "content": "New Overlay Content",
  "position": {
    "top": 10,
    "left": 20
  },
  "size": {
    "width": 150,
    "height": 75
  }
}
**Response Format:**

json
{
  "_id": "OverlayId",
  "content": "New Overlay Content",
  "position": {
    "top": 10,
    "left": 20
  },
  "size": {
    "width": 150,
    "height": 75
  }
}

### 4. Delete Overlay
Endpoint: DELETE /api/overlays/{overlay_id}

Description: Delete an overlay by its ID.

**Response Format:**

json
Copy code
{
  "message": "Overlay deleted successfully"
}

## User Documentation

### App Setup and Usage
**Setting up the App**

Ensure that you have the necessary dependencies installed.
Clone the app repository from [GitHub Repository URL].
Install the required packages using npm install or yarn install.
**Inputting RTSP URL**

Launch the app.
Locate the input field for the RTSP URL.
Enter the RTSP URL of the video stream you want to overlay.
**Managing Overlays**

Creating an Overlay:

Enter the content, position (top, left), and size (width, height) in the respective input fields.
Click the "Create Overlay" button.
Updating an Overlay:

Click the "Update" button next to the overlay you want to modify.
Enter the updated content, position, or size in the provided input fields.
Click the "Save" button.
Deleting an Overlay:

Click the "Delete" button next to the overlay you want to remove.
Saving Changes

Any changes made to overlays are automatically saved. No additional steps are required.
By following these instructions, users should be able to set up the app, input the RTSP URL, and manage overlays effectively.
