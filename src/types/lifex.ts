export type PageId =
  | 1 // Landing Page
  | 2 // Sign Up
  | 3 // Login
  | 4 // Dashboard
  | 5 // Vehicle Selection
  | 6 // Vehicle Configuration
  | 7 // Vehicle Architecture
  | 8 // Rear Suspension Assembly
  | 9 // Rear Suspension Subsystems
  | 10 // Components (Damper System)
  | 11 // Rear Suspension component selection (approved image map)
  | 12 // Internal Parts (Shock Absorber)
  | 13 // Communications
  | 14 // Communication Summary
  | 15 // Lifecycle Documents
  | 16 // RFI Form (Example)
  | 17 // Final Engineering Report
  | 18 // Tree Navigation
  | 19 // BandView
  | 20 // Settings / User Profile
  | 21 // 404 Page
  | 22 // Ford Teardown Registry
  | 23 // Engineering Workspace Navigation
  | 24 // Component Working Limits
  | 25 // Reference Applications
  | 26 // New Application SOR Chatbot
  | 27 // Engineering Repository landing
  | 28 // Detailed Knowledge Repository
  | 29 // Global Repository browser
  | 30 // Project Details entry
  | 31 // Component repository detail: documents + Manual Entry
  | 32 // Manual Entry workflow selection
  | 33 // Project Details entry after Select Project
  | 34 // Interactive 3D vehicle overview
  | 35; // OEM selection

export interface Vehicle {
  id: string;
  name: string;
  brand: 'Ford' | 'Toyota' | 'BMW' | 'Honda' | 'Tesla' | 'Other';
  year: number;
  trim: string;
  category: 'SUV' | 'Sedan' | 'Truck' | 'EV' | 'Hybrid';
  powertrain: string;
  transmission: string;
  driveType: string;
  program: string;
  region: string;
  architectureType: string;
  subsystemsCount: number;
  componentsCount: number;
  status: 'Active' | 'Under Review' | 'Archived';
  image: string;
}

export interface Subsystem {
  id: string;
  name: string;
  componentsCount: number;
  description: string;
  iconName: string;
  status: string;
  image?: string;
}

export interface ComponentItem {
  id: string; // e.g. RS-DS-001
  name: string;
  subsystemId: string;
  supplier: string;
  material: string;
  weight: string;
  cost: string;
  lifecycleRecordsCount: number;
  status: 'Active' | 'Pending Review' | 'Obsolete';
  description: string;
  dimensions: string;
  image?: string;
}

export interface CommunicationThread {
  id: string;
  stage: 'Customer' | 'Engineering' | 'Validation' | 'Supplier';
  title: string;
  team: string;
  date: string;
  preview: string;
  fullText: string;
  unread?: boolean;
}

export interface LifecycleDoc {
  id: string;
  code: string;
  name: string;
  subtext: string;
  recordsCount: number;
  status: 'Completed' | 'In Progress' | 'Pending Review';
}
