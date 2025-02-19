const admin = require("firebase-admin");

// Initialize Firebase admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

// Function to update a document in Firestore

module.exports = admin;
