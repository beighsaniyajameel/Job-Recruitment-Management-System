/**
 * Seeds MongoDB with the sample data provided by the database teammate
 * (database/users.json, companies.json, jobs.json, applications.json).
 *
 * The original users.json has no password field (it was exported before
 * auth existed), so every seeded user is given the default password
 * below. Change it, or update users afterwards via the API.
 *
 * Usage:  npm run seed
 */
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const connectDB = require('../config/db');
const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');

const DEFAULT_PASSWORD = process.env.SEED_DEFAULT_PASSWORD || 'Password123';

const readJson = (filename) => {
  const filePath = path.join(__dirname, '..', 'database', filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
};

// Strip the Extended JSON $oid wrapper mongoexport uses; Mongoose will
// generate its own ObjectIds instead.
const stripOid = (doc) => {
  const { _id, ...rest } = doc;
  return rest;
};

const seed = async () => {
  await connectDB();

  console.log('Clearing existing collections...');
  await Promise.all([
    User.deleteMany({}),
    Company.deleteMany({}),
    Job.deleteMany({}),
    Application.deleteMany({})
  ]);

  console.log('Seeding companies...');
  const companies = readJson('companies.json').map(stripOid);
  await Company.insertMany(companies);

  console.log('Seeding jobs...');
  const jobs = readJson('jobs.json').map(stripOid);
  await Job.insertMany(jobs);

  console.log(`Seeding users (default password: "${DEFAULT_PASSWORD}")...`);
  const users = readJson('users.json').map(stripOid);
  // Use .create() one-by-one (not insertMany) so the pre-save password
  // hashing hook actually runs for every user.
  for (const user of users) {
    await User.create({ ...user, password: DEFAULT_PASSWORD });
  }

  console.log('Seeding applications...');
  const applications = readJson('applications.json').map(stripOid);
  await Application.insertMany(applications);

  console.log('Seed complete.');
  console.log(`- ${companies.length} companies`);
  console.log(`- ${jobs.length} jobs`);
  console.log(`- ${users.length} users (all with password "${DEFAULT_PASSWORD}")`);
  console.log(`- ${applications.length} applications`);

  process.exit(0);
};

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
