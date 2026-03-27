require('dotenv').config();
const mongoose = require('mongoose');
const Mechanic = require('./models/Mechanic.model');
const Customer = require('./models/Customer.model');
const Vehicle = require('./models/Vehicle.model');
const JobCard = require('./models/JobCard.model');
const { generateJobId } = require('./services/jobId.service');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/garage_management';

const mechanics = [
  { name: 'Rajesh Kumar', phone: '9876543210', specialization: 'Engine Repair', isActive: true },
  { name: 'Sunil Patil', phone: '9876543211', specialization: 'Electrical Systems', isActive: true },
  { name: 'Arun Sharma', phone: '9876543212', specialization: 'Body Work', isActive: true },
  { name: 'Vikram Singh', phone: '9876543213', specialization: 'General Service', isActive: true },
];

const customers = [
  { name: 'Amit Patel', phone: '9988776655', email: 'amit@example.com' },
  { name: 'Priya Desai', phone: '9988776656', email: 'priya@example.com' },
  { name: 'Rahul Gupta', phone: '9988776657', email: 'rahul@example.com' },
];

const vehicles = [
  { licensePlate: 'MH01AB1234', make: 'Maruti', model: 'Swift', year: 2022, color: 'White' },
  { licensePlate: 'MH02CD5678', make: 'Hyundai', model: 'Creta', year: 2023, color: 'Blue' },
  { licensePlate: 'MH03EF9012', make: 'Tata', model: 'Nexon', year: 2021, color: 'Red' },
  { licensePlate: 'GJ05GH3456', make: 'Honda', model: 'City', year: 2020, color: 'Silver' },
  { licensePlate: 'DL10JK7890', make: 'Toyota', model: 'Innova', year: 2019, color: 'Black' },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI, { tls: true, tlsAllowInvalidCertificates: false });
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Promise.all([
      Mechanic.deleteMany({}),
      Customer.deleteMany({}),
      Vehicle.deleteMany({}),
      JobCard.deleteMany({}),
    ]);
    console.log('Cleared existing data.');

    const createdMechanics = await Mechanic.insertMany(mechanics);
    const createdCustomers = await Customer.insertMany(customers);
    const createdVehicles = await Vehicle.insertMany(vehicles);
    console.log(`Seeded ${createdMechanics.length} mechanics, ${createdCustomers.length} customers, ${createdVehicles.length} vehicles.`);

    // Create sample job cards
    const statuses = ['INTAKE', 'DIAGNOSIS', 'IN_SERVICE', 'QC_CHECK', 'READY'];
    const serviceTypes = ['GENERAL_SERVICE', 'REPAIR', 'INSPECTION', 'CUSTOM'];
    const priorities = ['NORMAL', 'URGENT', 'EXPRESS'];
    const issues = [
      'Engine making unusual noise during acceleration',
      'AC not cooling properly, needs inspection',
      'Brake pads worn out, squeaking sound',
      'Regular 10,000 km service due',
      'Transmission jerks while shifting gears',
    ];

    for (let i = 0; i < 5; i++) {
      const jobId = await generateJobId();
      const status = statuses[i];
      const history = [{ stage: 'INTAKE', note: 'Job created', updatedBy: 'system', timestamp: new Date(Date.now() - (5 - i) * 86400000) }];

      // Add intermediate stages
      const stageOrder = ['INTAKE', 'DIAGNOSIS', 'IN_SERVICE', 'QC_CHECK', 'READY'];
      const statusIdx = stageOrder.indexOf(status);
      for (let s = 1; s <= statusIdx; s++) {
        history.push({
          stage: stageOrder[s],
          note: `Moved to ${stageOrder[s]}`,
          updatedBy: 'staff',
          timestamp: new Date(Date.now() - (5 - i) * 86400000 + s * 3600000),
        });
      }

      await JobCard.create({
        jobId,
        vehicle: createdVehicles[i]._id,
        customer: createdCustomers[i % 3]._id,
        assignedMechanic: createdMechanics[i % 4]._id,
        serviceType: serviceTypes[i % 4],
        priority: priorities[i % 3],
        status,
        odometer: 15000 + i * 5000,
        reportedIssues: issues[i],
        stageHistory: history,
      });
    }

    console.log('Seeded 5 job cards.');
    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
