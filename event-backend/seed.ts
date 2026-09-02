import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { EventModel, EventCategory } from './models/event.model';

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/event_db';
  try {
    await mongoose.connect(mongoUri);
    console.log('[Seed]: Successfully connected to MongoDB at', mongoUri);
  } catch (error) {
    console.error('[Seed Database Connection Error]: Failed to connect to MongoDB.', (error as Error).message);
    process.exit(1);
  }
};

const now = Date.now();
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const getSampleEvents = (): Array<{
  title: string;
  description: string;
  date: Date;
  location: string;
  category: EventCategory;
  capacity: number;
  organizer: string;
}> => [
  {
    title: 'Kathmandu Tech Summit 2026',
    description: 'Nepal’s premier technology conference bringing together developers, founders, and innovators.',
    date: new Date(now - 7 * DAY),
    location: 'Bhrikutimandap, Kathmandu',
    category: 'Conference',
    capacity: 500,
    organizer: 'TechNepal Community',
  },
  {
    title: 'Pokhara AI & Machine Learning Workshop',
    description: 'Hands-on workshop exploring LLMs, computer vision, and AI applications in Nepal.',
    date: new Date(now - 2 * DAY),
    location: 'Lakeside Convention Center, Pokhara',
    category: 'Workshop',
    capacity: 120,
    organizer: 'Pokhara AI Club',
  },
  {
    title: 'Lalitpur Heritage & Open Source Hackathon',
    description: 'A 24-hour hackathon focused on building open-source tools for cultural preservation and local civic tech.',
    date: new Date(now - 1 * DAY),
    location: 'Patan Durbar Square, Lalitpur',
    category: 'Technology',
    capacity: 200,
    organizer: 'Code for Nepal',
  },
  {
    title: 'Chitwan Startup & Founders Meetup',
    description: 'Networking and pitch session for early-stage founders and investors in central Nepal.',
    date: new Date(now - 10 * MINUTE),
    location: 'Bharatpur City Hall, Chitwan',
    category: 'Meetup',
    capacity: 80,
    organizer: 'Chitwan Tech Hub',
  },
  {
    title: 'Live Flash AI Demo (Transitions to Past in ~10s)',
    description: 'Watch this event live transition from Upcoming to Past on your dashboard in 10 seconds!',
    date: new Date(now + 10 * SECOND),
    location: 'Virtual Event Hall, Kathmandu',
    category: 'Technology',
    capacity: 300,
    organizer: 'Live Demo Nepal',
  },
  {
    title: 'Pokhara Cloud Micro-Meetup (Transitions in ~30s)',
    description: 'Watch this event transition to Past live in 30 seconds!',
    date: new Date(now + 30 * SECOND),
    location: 'Lakeside Co-working Space, Pokhara',
    category: 'Meetup',
    capacity: 50,
    organizer: 'Pokhara Cloud Devs',
  },
  {
    title: 'Bhaktapur CyberSecurity & Cloud Expo',
    description: 'Keynotes and live red-teaming demonstrations by Nepal’s top cybersecurity experts.',
    date: new Date(now + 60 * SECOND),
    location: 'Heritage Hall, Bhaktapur',
    category: 'Conference',
    capacity: 300,
    organizer: 'Cyber Security Nepal',
  },
  {
    title: 'Dharan DevOps & Infrastructure Bootcamp',
    description: 'Deep dive into Kubernetes, Terraform, and modern CI/CD pipelines.',
    date: new Date(now + 3 * MINUTE),
    location: 'BPKIHS Auditorium, Dharan',
    category: 'Workshop',
    capacity: 150,
    organizer: 'Eastern Tech Collective',
  },
  {
    title: 'Butwal Web Development & Next.js Meetup',
    description: 'Learn modern full-stack web development with Next.js, React 19, and Tailwind v4.',
    date: new Date(now + 10 * MINUTE),
    location: 'Traffic Chowk Tech Park, Butwal',
    category: 'Meetup',
    capacity: 90,
    organizer: 'Lumbini Devs',
  },
  {
    title: 'Biratnagar Agritech & IoT Summit',
    description: 'Exploring smart farming, sensor networks, and IoT solutions tailored for Eastern Nepal.',
    date: new Date(now + 30 * MINUTE),
    location: 'IT Park Plaza, Biratnagar',
    category: 'Conference',
    capacity: 250,
    organizer: 'AgriTech Nepal',
  },
  {
    title: 'Hetauda Game Development Masterclass',
    description: 'Introduction to Unity and Unreal Engine game mechanics and 3D modeling.',
    date: new Date(now + 1 * HOUR),
    location: 'Makwanpur Innovation Hub, Hetauda',
    category: 'Workshop',
    capacity: 60,
    organizer: 'Nepal GameDev Guild',
  },
  {
    title: 'Kathmandu Python & Data Science Gathering',
    description: 'Monthly meetup covering pandas, PyTorch, and real-world data pipelines.',
    date: new Date(now + 5 * HOUR),
    location: 'Thamel Tech Hub, Kathmandu',
    category: 'Meetup',
    capacity: 100,
    organizer: 'Python Nepal',
  },
  {
    title: 'Jhapa Digital Marketing & E-Commerce Fair',
    description: 'Strategies for scaling digital storefronts and local export businesses in Jhapa.',
    date: new Date(now + 1 * DAY),
    location: 'Birtamode Expo Center, Jhapa',
    category: 'General',
    capacity: 180,
    organizer: 'Jhapa Biz Forum',
  },
  {
    title: 'Janakpur Smart City & Civic Tech Forum',
    description: 'Discussion on digital governance, open data, and smart city infrastructure.',
    date: new Date(now + 3 * DAY),
    location: 'Railway Plaza Conference Hall, Janakpur',
    category: 'Conference',
    capacity: 220,
    organizer: 'Madhesh Tech Initiative',
  },
  {
    title: 'Mustang EcoTech & High-Altitude Innovation Forum',
    description: 'Sustainable energy, solar microgrids, and high-altitude drone research.',
    date: new Date(now + 7 * DAY),
    location: 'Jomsom Community Center, Mustang',
    category: 'Technology',
    capacity: 75,
    organizer: 'Himalayan Climate Tech',
  },
  {
    title: 'Gorkha Robotics & STEM Expo for Youth',
    description: 'Robotics competitions, Arduino workshops, and science exhibits for students.',
    date: new Date(now + 14 * DAY),
    location: 'Gorkha High School Ground, Gorkha',
    category: 'Workshop',
    capacity: 350,
    organizer: 'STEM Nepal Foundation',
  },
  {
    title: 'Kathmandu Women in Tech Symposium',
    description: 'Empowering women engineers, leaders, and founders in the Nepali tech ecosystem.',
    date: new Date(now + 30 * DAY),
    location: 'Hotel Soaltee, Kathmandu',
    category: 'Conference',
    capacity: 400,
    organizer: 'Women in Tech Nepal',
  },
  {
    title: 'Pokhara Freelancers & Remote Workers Meetup',
    description: 'Casual networking, digital nomad tips, and tax guidance for Nepali remote professionals.',
    date: new Date(now + 45 * DAY),
    location: 'Pardi Lakeside Cafe, Pokhara',
    category: 'Meetup',
    capacity: 65,
    organizer: 'Pokhara Nomad Club',
  },
  {
    title: 'Birganj Logistics & Blockchain Workshop',
    description: 'Implementing supply chain tracking and smart contracts for cross-border trade.',
    date: new Date(now + 60 * DAY),
    location: 'Power House Chowk, Birganj',
    category: 'Workshop',
    capacity: 110,
    organizer: 'Nepal Freight Tech',
  },
  {
    title: 'Dhulikhel Open Source HealthTech Hackathon',
    description: 'Building telemetry and electronic health record tools for rural Nepal clinics.',
    date: new Date(now + 90 * DAY),
    location: 'Kathmandu University, Dhulikhel',
    category: 'Technology',
    capacity: 250,
    organizer: 'KU Computer Club',
  },
];

const seedDB = async () => {
  try {
    await connectDB();

    await EventModel.deleteMany({});
    console.log('[Seed]: Cleared existing events');

    const sampleEvents = getSampleEvents();
    const created = await EventModel.insertMany(sampleEvents);
    console.log(`[Seed]: Successfully seeded ${created.length} events with relative real-time timestamps!`);

    await mongoose.connection.close();
    console.log('[Seed]: Closed MongoDB connection');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Execution Error]:', (error as Error).message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

seedDB();
