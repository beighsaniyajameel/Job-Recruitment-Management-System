# MongoDB Database Setup

Database Name: job_recruitment_db

Collections:
- users
- companies
- jobs
- applications

Document Count:
- users: 12
- companies: 5
- jobs: 12
- applications: 15

Importing the Database:

Import these JSON files from the database folder into MongoDB Compass:
- users.json
- companies.json
- jobs.json
- applications.json

Index:

An ascending index was created on the location field in the jobs collection.

To create the index:

use job_recruitment_db

db.jobs.createIndex({ location: 1 })

Index name: location_1

Aggregation:

Applications can be grouped according to their status using:

db.applications.aggregate([
  {
    $group: {
      _id: "$status",
      count: { $sum: 1 }
    }
  }
])

This gives the number of applications for each status, such as Applied, Shortlisted, Interview, Selected and Rejected.

MongoDB Concepts Used:
- NoSQL data modelling
- CRUD operations
- Queries and filtering
- Aggregation
- Indexing