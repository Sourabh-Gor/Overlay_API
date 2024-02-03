from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson import ObjectId
from flask_cors import CORS  # Import CORS from flask_cors

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

app.config['MONGO_URI'] = 'mongodb://localhost:27017/overlaydb'
mongo = PyMongo(app)

# API endpoint for creating a new overlay
@app.route('/api/overlays', methods=['POST'])
def create_overlay():
    data = request.json
    result = mongo.db.overlays.insert_one(data)
    new_overlay = mongo.db.overlays.find_one({"_id": result.inserted_id})

    # Convert ObjectId to string for JSON serialization
    new_overlay['_id'] = str(new_overlay['_id'])

    return jsonify(new_overlay), 201  # 201 Created status code

# Additional API endpoint to fetch all overlays and create a new overlay
@app.route('/api/overlays', methods=['GET', 'POST'])
def overlays():
    if request.method == 'GET':
        overlays = list(mongo.db.overlays.find())

        # Convert ObjectId to string for JSON serialization
        for overlay in overlays:
            overlay['_id'] = str(overlay['_id'])

        return jsonify(overlays)
    elif request.method == 'POST':
        data = request.json
        result = mongo.db.overlays.insert_one(data)
        new_overlay = mongo.db.overlays.find_one({"_id": result.inserted_id})

        # Convert ObjectId to string for JSON serialization
        new_overlay['_id'] = str(new_overlay['_id'])

        return jsonify(new_overlay), 201  # 201 Created status code

# Additional API endpoints for CRUD operations on overlays
@app.route('/api/overlays/<overlay_id>', methods=['GET', 'PUT', 'DELETE'])
def single_overlay(overlay_id):
    if request.method == 'GET':
        overlay = mongo.db.overlays.find_one({"_id": ObjectId(overlay_id)})

        # Convert ObjectId to string for JSON serialization
        overlay['_id'] = str(overlay['_id'])

        return jsonify(overlay)
    elif request.method == 'PUT':
        data = request.json

        # Ensure that 'data' is a dictionary containing the update information
        if not isinstance(data, dict):
            return jsonify({'error': 'Invalid data format'}), 400

        try:
            # Update the overlay fields using $set
            mongo.db.overlays.update_one({"_id": ObjectId(overlay_id)}, {"$set": data})
            updated_overlay = mongo.db.overlays.find_one({"_id": ObjectId(overlay_id)})
            updated_overlay['_id'] = str(updated_overlay['_id'])
            return jsonify(updated_overlay)

        except Exception as e:
            print(e)
            return jsonify({'error': 'Internal Server Error'}), 500
    elif request.method == 'DELETE':
        mongo.db.overlays.delete_one({"_id": ObjectId(overlay_id)})
        return jsonify({"message": "Overlay deleted successfully"})

if __name__ == '__main__':
    app.run(debug=True)
