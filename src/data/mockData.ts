import { 
  User, Mentor, Researcher, Team, Project, EventItem, 
  ResearchPublication, CampusStory, AskQuestion, Certificate, 
  MentorshipRequest, NotificationItem, MentorshipCertificate, 
  InstitutionInfo, ResearchConference, DirectMessage, 
  OrganizerAccount, SuperAdminAccount, EventRegistrationItem, 
  QRCheckInRecord, EventProjectSubmission, EvaluationCriterion, 
  JudgeAccount, JudgeAssignment, EvaluationScore, EventWinnerRecord, 
  CertificateTemplate, EventAnnouncement, AuditLogEntry 
} from '../types';

export const MOCK_INDIAN_STATES = [
  'All India',
  'Karnataka',
  'Maharashtra',
  'Delhi-NCR',
  'Tamil Nadu',
  'Telangana',
  'Andhra Pradesh',
  'West Bengal',
  'Gujarat',
  'Uttar Pradesh',
  'Kerala',
  'Rajasthan',
  'Punjab'
];

export const MOCK_INDIAN_CITIES = [
  'All Cities',
  'Bengaluru',
  'Mumbai',
  'New Delhi',
  'Chennai',
  'Hyderabad',
  'Pune',
  'Kuppam',
  'Kolkata',
  'Ahmedabad',
  'Surathkal',
  'Vellore',
  'Pilani',
  'Coimbatore'
];

export const INITIAL_CURRENT_USER: User = {
  id: 'usr-std-001',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@nitk.edu.in',
  mobile: '+91 98765 43210',
  studentId: '2023CSB1042',
  institution: 'National Institute of Technology Karnataka (NITK)',
  university: 'NITK Surathkal',
  department: 'Artificial Intelligence & Machine Learning',
  course: 'B.Tech in AI & Data Engineering',
  year: '3rd Year (Class of 2027)',
  state: 'Karnataka',
  city: 'Surathkal',
  verifiedStudent: true,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  innovationScore: 840,
  skills: ['PyTorch', 'Computer Vision', 'Edge AI', 'ROS2', 'TypeScript', 'FastAPI', 'TensorRT'],
  badges: ['Innovator', 'Hackathon Winner', 'Team Player', 'Verified Student', 'Research Contributor'],
  bio: 'AI/ML undergraduate researching edge computer vision for precision agriculture & autonomous micro-drones. National Finalist at Smart India Hackathon 2026.',
  interests: ['Precision Agriculture', 'Edge Computing', 'Autonomous UAVs', 'Embedded Systems'],
  github: 'https://github.com/aarav-ai',
  linkedin: 'https://linkedin.com/in/aarav-sharma-ai',
  idCardVerifiedAt: '2025-08-14T10:30:00Z',
  role: 'student',
  connectionsCount: 48,
  connectedUserIds: ['usr-std-002', 'usr-std-003', 'usr-std-004', 'mnt-001', 'res-001'],
  savedItemIds: ['ev-001', 'proj-002', 'mnt-002'],
  privacy: {
    emailPublic: true,
    phonePublic: false,
    showProjectsToPublic: true
  },
  status: 'active'
};

export const MOCK_STUDENTS: User[] = [
  INITIAL_CURRENT_USER,
  {
    id: 'usr-std-002',
    name: 'Pooja Iyer',
    email: 'pooja.iyer@ceg.annauniv.edu',
    mobile: '+91 98451 12345',
    studentId: '2023ECE088',
    institution: 'College of Engineering, Guindy',
    university: 'Anna University',
    department: 'Electronics & Communication Engineering',
    course: 'B.E. Electronics & Communication',
    year: '3rd Year',
    state: 'Tamil Nadu',
    city: 'Chennai',
    verifiedStudent: true,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    innovationScore: 790,
    skills: ['Embedded C', 'PCB Design', 'ESP32', 'LoRaWAN', 'FPGA (Verilog)', 'Circuit Simulation'],
    badges: ['Hardware Wizard', 'Verified Student', 'Project Builder'],
    bio: 'Hardware developer designing ultra low-power IoT telemetry boards and sensor nodes for agricultural micro-climate monitoring.',
    interests: ['Edge IoT', 'Bio-Sensors', 'Satellite Communication'],
    role: 'student',
    connectionsCount: 34,
    connectedUserIds: ['usr-std-001', 'usr-std-003'],
    privacy: { emailPublic: true, phonePublic: false, showProjectsToPublic: true },
    status: 'active'
  },
  {
    id: 'usr-std-003',
    name: 'Vikramaditya Deshmukh',
    email: 'vikram.d@vjti.ac.in',
    mobile: '+91 98200 67890',
    studentId: '2023MECH014',
    institution: 'Veermata Jijabai Technological Institute',
    university: 'VJTI Mumbai',
    department: 'Mechanical Engineering',
    course: 'B.Tech in Mechanical & Robotics',
    year: '3rd Year',
    state: 'Maharashtra',
    city: 'Mumbai',
    verifiedStudent: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    innovationScore: 810,
    skills: ['SolidWorks', 'FEA Analysis', 'ANSYS Fluent', 'Carbon-Fiber Aerodynamics', 'CNC Machining', '3D Printing'],
    badges: ['Mechatronics Lead', 'Robotics Finalist', 'Verified Student'],
    bio: 'CAD specialist and robotic airframe designer focused on lightweight UAV structures and micro-dosing spray mechanism integration.',
    interests: ['Drone Aerodynamics', 'Structural Simulation', 'Robotic Arm End-Effectors'],
    role: 'student',
    connectionsCount: 42,
    connectedUserIds: ['usr-std-001', 'usr-std-002'],
    privacy: { emailPublic: true, phonePublic: false, showProjectsToPublic: true },
    status: 'active'
  },
  {
    id: 'usr-std-004',
    name: 'Ananya Sen',
    email: 'ananya.sen@nid.edu',
    mobile: '+91 99112 33445',
    studentId: '2023DES042',
    institution: 'National Institute of Design (NID Ahmedabad)',
    university: 'NID Ahmedabad',
    department: 'Human-Centered Interaction Design',
    course: 'B.Des in Interaction & Product UI',
    year: '4th Year',
    state: 'Gujarat',
    city: 'Ahmedabad',
    verifiedStudent: true,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    innovationScore: 760,
    skills: ['Figma', 'Farmer Usability Research', 'Design Systems', 'Voice-First UX', 'Accessibility (WCAG)', 'Flutter UI'],
    badges: ['UI/UX Specialist', 'Design Thinker', 'Verified Student'],
    bio: 'Interaction designer conducting field user studies with rural farmers across Karnataka and Maharashtra to create zero-literacy multilingual agricultural interfaces.',
    interests: ['Vernacular UI', 'Multilingual Interaction', 'Field Ethnography'],
    role: 'student',
    connectionsCount: 29,
    connectedUserIds: ['usr-std-001'],
    privacy: { emailPublic: true, phonePublic: false, showProjectsToPublic: true },
    status: 'active'
  }
];

export const MOCK_MENTORS: Mentor[] = [
  {
    id: 'mnt-001',
    name: 'Dr. Arvind Rao',
    email: 'arvind.rao@iitb.ac.in',
    mobile: '+91 98201 54321',
    title: 'Professor & Head of Edge Computing Lab',
    designation: 'Professor & Dean of Research Collaborations',
    qualification: 'Ph.D. in Computer Vision & Robotics (IISc / Stanford Postdoc)',
    institution: 'Indian Institute of Technology Bombay (IIT Bombay)',
    department: 'Department of Computer Science & Engineering',
    specialization: 'Edge Computer Vision, TensorRT Optimization, Autonomous Drones',
    yearsExperience: 14,
    academicExp: '9 Years at IIT Bombay (Principal Investigator)',
    industryExp: '5 Years Principal AI Scientist at NVIDIA Research',
    researchAreas: ['Low-Power Real-Time Vision', 'Embedded TensorRT Quantization', 'ROS2 Micro-Air Vehicle Swarms'],
    projectsGuided: 38,
    certifications: ['NVIDIA Deep Learning Institute Lead', 'IEEE Senior Member', 'National AI Mission Fellow'],
    mentoringInterests: ['Smart India Hackathon Teams', 'DeepTech Startups', 'Autonomous Robotics', 'Precision Agriculture'],
    preferredDomains: ['AI / ML & Edge Systems', 'Robotics & Mechatronics', 'Agritech'],
    availability: 'Available',
    maxTeams: 4,
    activeTeamsCount: 2,
    mentorshipSlots: 2,
    completedMentorshipsCount: 21,
    verifiedMentor: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 4.96,
    reviewsCount: 38,
    bio: 'Guiding collegiate teams to transition lab vision prototypes into field-tested, production-ready systems capable of winning national hackathons and seed fellowships.',
    state: 'Maharashtra',
    city: 'Mumbai',
    linkedin: 'https://linkedin.com/in/dr-arvind-rao-iitb',
    status: 'active'
  },
  {
    id: 'mnt-002',
    name: 'Dr. Priya Sundaram',
    email: 'priya.sundaram@iisc.ac.in',
    mobile: '+91 98450 99887',
    title: 'Associate Professor & Flight Control Specialist',
    designation: 'Associate Professor of Aerospace Systems',
    qualification: 'Ph.D. in Flight Dynamics & Autonomous Navigation (MIT / IISc)',
    institution: 'Indian Institute of Science (IISc Bangalore)',
    department: 'Department of Aerospace & Autonomous Systems',
    specialization: 'Autonomous UAV Guidance, Non-Linear Control, PX4 Autopilot',
    yearsExperience: 11,
    academicExp: '7 Years IISc Faculty',
    industryExp: '4 Years Drone Systems Architect at ISRO Telemetry',
    researchAreas: ['Autonomous Micro-UAV Navigation in GPS-Denied Environments', 'Precision Agricultural Spray Dynamics', 'PX4 Custom Extended Kalman Filter'],
    projectsGuided: 24,
    certifications: ['DGCA Drone Instructor', 'AIAA Associate Fellow'],
    mentoringInterests: ['Hardware Prototype Validation', 'FMEA Safety Directives', 'Defense Hackathons'],
    preferredDomains: ['Robotics & Mechatronics', 'Agritech', 'Aerospace'],
    availability: 'Available',
    maxTeams: 3,
    activeTeamsCount: 1,
    mentorshipSlots: 2,
    completedMentorshipsCount: 14,
    verifiedMentor: true,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    rating: 4.92,
    reviewsCount: 29,
    bio: 'Dedicated to helping student hardware teams design safe, fault-tolerant UAV aerodynamics and precision micro-dosing systems for SIH Grand Finales.',
    state: 'Karnataka',
    city: 'Bengaluru',
    linkedin: 'https://linkedin.com/in/dr-priya-sundaram',
    status: 'active'
  }
];

export const MOCK_RESEARCHERS: Researcher[] = [
  {
    id: 'res-001',
    name: 'Kavya Ramanathan (PhD)',
    email: 'kavya.r@iisc.ac.in',
    scholarId: 'IISC-CS-PHD-2022-041',
    university: 'Indian Institute of Science (IISc Bangalore)',
    institution: 'IISc Bangalore',
    department: 'Department of Computational and Data Sciences',
    researchArea: 'Privacy-Preserving Federated Learning & Edge Quantization',
    specialization: 'Decentralized Machine Learning & Secure Aggregation',
    researchTopics: ['Federated Learning', 'Differential Privacy', 'Healthcare AI', 'Model Compression'],
    interests: ['Federated Learning', 'Differential Privacy', 'Healthcare AI', 'Model Compression'],
    guide: 'Prof. Chiranjib Bhattacharyya',
    publicationsCount: 6,
    citationsCount: 142,
    hIndex: 4,
    datasets: ['OpenMIMI-Federated-ECG', 'IndianAgri-Pest-10K'],
    verifiedResearcher: true,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    openForCollab: true,
    bio: 'Investigating lightweight encryption schemes for decentralized gradient aggregation on resource-constrained edge devices.',
    state: 'Karnataka',
    city: 'Bengaluru',
    status: 'active'
  }
];

export const MOCK_ORGANIZER_ACCOUNTS: OrganizerAccount[] = [
  {
    id: 'KEC-DEMO-001',
    institutionId: 'inst-kec-001',
    institutionName: 'Kuppam Engineering College',
    officialEmail: 'organizer.demo@campusnet-demo.in',
    coordinatorName: 'Demo Event Coordinator',
    designation: 'Dean of Innovation & Hackathons',
    mobile: '+91 94401 23456',
    department: 'Department of Computer Science & Innovation Council',
    state: 'Andhra Pradesh',
    city: 'Kuppam',
    role: 'institution_admin',
    verificationStatus: 'verified',
    isDevelopmentDemo: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    lastLoginAt: '2026-02-18T09:30:00Z',
    eventsCreatedCount: 4
  },
  {
    id: 'CNU-DEMO-002',
    institutionId: 'inst-cnu-002',
    institutionName: 'CampusNet Demo University',
    officialEmail: 'events@campusnet-demo.in',
    coordinatorName: 'Prof. Sudhir Sen',
    designation: 'Convener National Technical Conclave',
    mobile: '+91 98801 98765',
    department: 'Academic Affairs & Inter-Collegiate Competitions',
    state: 'Karnataka',
    city: 'Bengaluru',
    role: 'institution_admin',
    verificationStatus: 'verified',
    isDevelopmentDemo: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    lastLoginAt: '2026-02-17T14:15:00Z',
    eventsCreatedCount: 3
  },
  {
    id: 'IITB-ORG-003',
    institutionId: 'inst-001',
    institutionName: 'Indian Institute of Technology Bombay',
    officialEmail: 'techfest.coord@iitb.ac.in',
    coordinatorName: 'Rohan Varma',
    designation: 'Overall Coordinator - National Techfest',
    mobile: '+91 98200 11223',
    department: 'Student Technical Activities Council',
    state: 'Maharashtra',
    city: 'Mumbai',
    role: 'institution_admin',
    verificationStatus: 'verified',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    eventsCreatedCount: 8
  }
];

export const MOCK_SUPER_ADMIN_ACCOUNT: SuperAdminAccount = {
  id: 'adm-001',
  username: 'superadmin.demo',
  email: 'superadmin@campusnet-demo.in',
  name: 'National Chief Administrator',
  role: 'super_admin',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  mfaEnabled: true,
  lastLoginAt: '2026-02-18T10:00:00Z',
  isDevelopmentDemo: true
};

export const MOCK_INSTITUTIONS_DATA: InstitutionInfo[] = [
  {
    id: 'inst-kec-001',
    name: 'Kuppam Engineering College',
    shortName: 'KEC Kuppam',
    type: 'Engineering College',
    state: 'Andhra Pradesh',
    city: 'Kuppam',
    district: 'Chittoor',
    logo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=100&auto=format&fit=crop&q=80',
    studentCount: 3400,
    mentorCount: 110,
    projectsCount: 320,
    eventsCount: 12,
    verified: true,
    website: 'https://www.kec.ac.in',
    officialDomain: 'kec.ac.in',
    pincode: '517425'
  },
  {
    id: 'inst-001',
    name: 'Indian Institute of Technology Bombay',
    shortName: 'IIT Bombay',
    type: 'IIT',
    state: 'Maharashtra',
    city: 'Mumbai',
    logo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=100&auto=format&fit=crop&q=80',
    studentCount: 12400,
    mentorCount: 380,
    projectsCount: 1420,
    eventsCount: 45,
    nirfRank: 3,
    verified: true,
    website: 'https://www.iitb.ac.in',
    officialDomain: 'iitb.ac.in'
  },
  {
    id: 'inst-002',
    name: 'Indian Institute of Science Bangalore',
    shortName: 'IISc Bangalore',
    type: 'Research Institute',
    state: 'Karnataka',
    city: 'Bengaluru',
    logo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=100&auto=format&fit=crop&q=80',
    studentCount: 4500,
    mentorCount: 520,
    projectsCount: 2100,
    eventsCount: 28,
    nirfRank: 1,
    verified: true,
    website: 'https://iisc.ac.in',
    officialDomain: 'iisc.ac.in'
  },
  {
    id: 'inst-003',
    name: 'National Institute of Technology Karnataka, Surathkal',
    shortName: 'NITK Surathkal',
    type: 'NIT',
    state: 'Karnataka',
    city: 'Surathkal',
    logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=100&auto=format&fit=crop&q=80',
    studentCount: 7800,
    mentorCount: 240,
    projectsCount: 890,
    eventsCount: 32,
    nirfRank: 12,
    verified: true,
    website: 'https://www.nitk.ac.in',
    officialDomain: 'nitk.edu.in'
  }
];

export const MOCK_EVENTS: EventItem[] = [
  {
    id: 'ev-001',
    code: 'SIH-2026-NAT',
    title: 'Smart India Hackathon 2026 (SIH) — Hardware & Software Grand Finale',
    organizer: 'Ministry of Education Innovation Cell & AICTE',
    organizerId: 'MOE-SIH-001',
    organizerType: 'government',
    eventType: 'Government Challenge',
    category: 'National Hackathon',
    theme: 'AI, Agritech, Defense & Clean Energy',
    date: 'April 18 - 20, 2026',
    startDate: '2026-04-18T08:00:00Z',
    endDate: '2026-04-20T18:00:00Z',
    registrationOpenDate: '2026-01-15T00:00:00Z',
    registrationCloseDate: '2026-03-31T23:59:59Z',
    venue: 'IISc Nodal Innovation Center, Bengaluru',
    address: 'CV Raman Rd, Bengaluru',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    city: 'Bengaluru',
    pincode: '560012',
    mode: 'Hybrid',
    description: 'The premier national innovation challenge for Indian engineering colleges. Student teams develop functional hardware and software prototypes for central ministries.',
    rules: [
      'Each team must comprise exactly 6 verified students with at least 1 female team member.',
      'All team members must present authenticated College ID cards and register biometric GPS attendance at designated nodal centers.',
      'Hardware prototypes must pass official FMEA safety inspection before live field trials.',
      'Plagiarized or pre-built commercial kits are strictly disqualified.'
    ],
    tracks: [
      'Smart Agriculture & Micro-Climate Drones',
      'Renewable Energy & Battery Management Systems',
      'Disaster Robotics & Sub-Surface Exploration',
      'Healthcare AI & Clinical Decision Support'
    ],
    prizes: [
      { rank: '1st Prize (Ministry Track)', amount: '₹1,00,000', description: 'Cash Prize per problem statement + Seed Incubation Grant' },
      { rank: '2nd Prize (Runner-Up)', amount: '₹75,000', description: 'National Citation & Prototyping Support' },
      { rank: '3rd Prize (Special Innovation)', amount: '₹50,000', description: 'Fast-Track Incubation Entry' }
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    registeredTeamsCount: 142,
    participantLimit: 200,
    maxTeamSize: 6,
    minTeamSize: 6,
    deadline: 'March 31, 2026',
    deadlineStatus: 'upcoming',
    status: 'published',
    approvalStatus: 'approved',
    coordinatorName: 'Dr. Mohit Gambhir',
    coordinatorEmail: 'sih-nodal@aicte-india.org',
    coordinatorPhone: '+91 11 2958 1000',
    eligibility: 'Bonafide B.Tech / M.Tech / PhD students in recognized Indian universities',
    eligibleDepartments: ['All Engineering Disciplines', 'Design', 'Applied Sciences'],
    registrationFee: 'Free (Government Funded)',
    attendanceWindow: {
      start: '2026-04-18T08:00:00Z',
      end: '2026-04-18T11:00:00Z',
      targetLat: 13.0163,
      targetLng: 77.5649,
      allowedRadiusMeters: 450
    },
    submissionRequirements: ['Project Proposal (PDF)', 'Working GitHub Repository', 'Hardware Demo Video (MP4)', 'FMEA Safety Checklist'],
    isRegistered: true,
    isSaved: true
  },
  {
    id: 'ev-kec-001',
    code: 'KEC-AI26-HACK',
    title: 'KEC National AI & Smart Robotics Hackathon 2026',
    organizer: 'Kuppam Engineering College',
    organizerId: 'KEC-DEMO-001',
    organizerType: 'college',
    eventType: 'Hackathon',
    category: 'National College Hackathon',
    theme: 'AI, IoT, Drone Robotics & Agritech',
    date: 'May 10 - 12, 2026',
    startDate: '2026-05-10T09:00:00Z',
    endDate: '2026-05-12T17:00:00Z',
    registrationOpenDate: '2026-02-01T00:00:00Z',
    registrationCloseDate: '2026-04-30T23:59:59Z',
    venue: 'KEC Central Auditorium & Robotics Innovation Complex',
    address: 'KES Nagar, Kuppam, Chittoor Dist',
    district: 'Chittoor',
    state: 'Andhra Pradesh',
    city: 'Kuppam',
    pincode: '517425',
    mode: 'Offline',
    description: 'Annual national flagship hackathon hosted by Kuppam Engineering College. Brings together 100+ collegiate teams to construct autonomous drones, smart agriculture sensor meshes, and edge vision prototypes.',
    rules: [
      'Teams of 3 to 6 students permitted across any Indian recognized university.',
      'Live hardware demonstration required on final evaluation day.',
      'Organizers provide lab facilities, 3D printing access, and high-speed Wi-Fi.'
    ],
    tracks: ['Smart Agriculture Automation', 'Healthcare Micro-Sensors', 'AI & Edge Vision', 'Clean Energy Microgrids'],
    prizes: [
      { rank: 'Grand Champion', amount: '₹1,50,000', description: 'Cash Award + KEC Technology Incubation Center Seed Support' },
      { rank: '1st Runner Up', amount: '₹75,000', description: 'Cash Prize + Hardware Prototyping Voucher' },
      { rank: '2nd Runner Up', amount: '₹35,000', description: 'Cash Prize + Merit Citation' }
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    registeredTeamsCount: 48,
    participantLimit: 80,
    maxTeamSize: 6,
    minTeamSize: 3,
    deadline: 'April 30, 2026',
    deadlineStatus: 'upcoming',
    status: 'published',
    approvalStatus: 'approved',
    coordinatorName: 'Demo Event Coordinator',
    coordinatorEmail: 'organizer.demo@campusnet-demo.in',
    coordinatorPhone: '+91 94401 23456',
    registrationFee: 'Free',
    attendanceWindow: {
      start: '2026-05-10T08:30:00Z',
      end: '2026-05-10T11:30:00Z',
      targetLat: 12.7533,
      targetLng: 78.3496,
      allowedRadiusMeters: 500
    },
    submissionRequirements: ['Project Deck', 'GitHub Source Code', 'Working Video Demonstration'],
    isRegistered: false
  },
  {
    id: 'ev-kec-002',
    code: 'KEC-IOT26-EXPO',
    title: 'KEC Inter-Collegiate IoT & Embedded Systems Project Expo',
    organizer: 'Kuppam Engineering College',
    organizerId: 'KEC-DEMO-001',
    organizerType: 'college',
    eventType: 'Project Expo',
    category: 'Hardware Expo',
    theme: 'Embedded Systems & Industrial IoT',
    date: 'June 5, 2026',
    startDate: '2026-06-05T09:00:00Z',
    endDate: '2026-06-05T18:00:00Z',
    venue: 'ECE Department Labs, KEC Campus',
    state: 'Andhra Pradesh',
    city: 'Kuppam',
    mode: 'Offline',
    description: 'Hardware exhibition showcasing capstone and research student prototypes to industry evaluators.',
    rules: ['Working PCB or hardware breadboard demonstration required.'],
    tracks: ['Industrial Automation', 'Automotive Telemetry', 'Smart Metering'],
    prizes: [
      { rank: 'Best Project Award', amount: '₹30,000', description: 'Industry Seed Award' },
      { rank: 'Innovative Design', amount: '₹15,000', description: 'Hardware Kit Award' }
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    registeredTeamsCount: 0,
    maxTeamSize: 4,
    minTeamSize: 2,
    deadline: 'May 20, 2026',
    deadlineStatus: 'upcoming',
    status: 'draft',
    approvalStatus: 'pending',
    coordinatorName: 'Demo Event Coordinator',
    coordinatorEmail: 'organizer.demo@campusnet-demo.in',
    attendanceWindow: {
      start: '2026-06-05T08:30:00Z',
      end: '2026-06-05T10:30:00Z',
      targetLat: 12.7533,
      targetLng: 78.3496,
      allowedRadiusMeters: 500
    },
    submissionRequirements: ['Schematic PDF', 'Firmware Code']
  },
  {
    id: 'ev-cnu-001',
    code: 'CNU-ROBO26-IDE',
    title: 'National Swarm Robotics & Autonomous Systems Ideathon',
    organizer: 'CampusNet Demo University',
    organizerId: 'CNU-DEMO-002',
    organizerType: 'university',
    eventType: 'Ideathon',
    category: 'National Ideathon',
    theme: 'Swarm Robotics, Subsea Autonomy & ROS2',
    date: 'July 15 - 16, 2026',
    startDate: '2026-07-15T09:00:00Z',
    endDate: '2026-07-16T18:00:00Z',
    venue: 'CampusNet Virtual Arena & Bengaluru Hub',
    state: 'Karnataka',
    city: 'Bengaluru',
    mode: 'Hybrid',
    description: 'National ideation challenge seeking novel multi-agent coordination architectures for disaster relief and oceanic search.',
    rules: ['Original algorithms and simulation proof-of-concept required.'],
    tracks: ['Disaster Relief Swarms', 'Subsea Mapping', 'Space Robotics'],
    prizes: [
      { rank: '1st Prize', amount: '₹1,00,000', description: 'Research Fellowship' },
      { rank: '2nd Prize', amount: '₹50,000', description: 'Simulation Grant' }
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
    registeredTeamsCount: 16,
    maxTeamSize: 4,
    minTeamSize: 2,
    deadline: 'June 30, 2026',
    deadlineStatus: 'upcoming',
    status: 'review',
    approvalStatus: 'pending',
    coordinatorName: 'Prof. Sudhir Sen',
    coordinatorEmail: 'events@campusnet-demo.in',
    attendanceWindow: {
      start: '2026-07-15T08:30:00Z',
      end: '2026-07-15T10:30:00Z',
      targetLat: 12.9716,
      targetLng: 77.5946,
      allowedRadiusMeters: 500
    },
    submissionRequirements: ['Architecture Whitepaper', 'Gazebo / Webots Simulation Video']
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-001',
    title: 'AgriVision AI — Edge Micro-Drone for Autonomous Orchard Spraying',
    problemStatement: 'Manual pesticide application in Indian mango & citrus orchards exposes farmers to toxic inhalation and causes 40% pesticide runoff due to non-uniform manual pressure.',
    proposedSolution: 'An autonomous micro-quadcopter running TensorRT quantized YOLOv11 on an onboard NVIDIA Jetson Orin Nano, executing real-time pest segmentation with precision pulse-width modulated micro-dosing spray nozzles.',
    domain: 'AI, Agritech & Drone Robotics',
    technologies: ['PyTorch', 'TensorRT', 'ROS2 Humble', 'PX4 Autopilot', 'SolidWorks', 'ESP32 LoRaWAN'],
    requiredSkills: ['Computer Vision', 'Embedded C', 'Airframe FEA', 'Farmer UI/UX'],
    teamId: 'team-001',
    teamName: 'Team AgriVision AI (SIH-2026)',
    teamMembersCount: 4,
    institution: 'NITK Surathkal & Cross-College Consortium',
    state: 'Karnataka',
    city: 'Surathkal',
    mentor: 'Dr. Arvind Rao (IIT Bombay)',
    mentorId: 'mnt-001',
    mentorTitle: 'Professor & Head of Edge Computing Lab',
    mentorStatus: 'accepted',
    status: 'Prototype',
    progressPercent: 78,
    githubUrl: 'https://github.com/campusnet-projects/agrivision-edge-ai',
    demoUrl: 'https://campusnet.network/demo/agrivision-live',
    documentationUrl: 'https://campusnet.network/docs/agrivision-whitepaper.pdf',
    objectives: [
      'Achieve 30+ FPS edge pest inference under variable sunlight',
      'Reduce chemical runoff by 35% through pulse-width micro-dosing',
      'Ensure fail-safe return-to-launch within 1.5m accuracy'
    ],
    seekingRoles: ['Embedded Telemetry Lead (Anna Univ)', 'Flight Testing Pilot'],
    coverImage: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=80',
    papersCount: 1,
    milestones: [
      { id: 'm1', title: 'Dataset Collection (10K annotated pest images)', description: 'Curated 10,000 high-res pest leaf images across Karnataka orchards.', status: 'approved', dueDate: '2025-11-30', approvedByMentor: true, mentorFeedback: 'Excellent dataset diversity and class balance across leaf-miner species.' },
      { id: 'm2', title: 'Airframe CFD & Carbon-Fiber Fabrication', description: 'Completed wind tunnel simulation and carbon-fiber arm layup in VJTI workshop.', status: 'approved', dueDate: '2026-01-15', approvedByMentor: true, mentorFeedback: 'Vibration damping mounts verified up to 8000 RPM motor load.' },
      { id: 'm3', title: 'Jetson Orin Nano TensorRT INT8 Optimization', description: 'Quantize model to achieve 34 FPS at 8.2W power draw on Jetson Orin Nano.', status: 'in_progress', dueDate: '2026-03-10' },
      { id: 'm4', title: 'Autonomous 5-Acre Field Spraying Validation', description: 'Execute field trial with GPS geofencing and micro-dosing validation.', status: 'pending', dueDate: '2026-04-05' }
    ],
    tasks: [
      { id: 't1', title: 'Calibrate TensorRT INT8 entropy cache on 500 test images', assignee: 'Aarav Sharma', status: 'in_progress', priority: 'high' },
      { id: 't2', title: 'Solder custom ESP32 telemetry daughter-board with LoRaWAN antenna', assignee: 'Pooja Iyer', status: 'done', priority: 'high' },
      { id: 't3', title: 'Run ANSYS stress simulation on 3D-printed nozzle mount bracket', assignee: 'Vikramaditya', status: 'done', priority: 'medium' },
      { id: 't4', title: 'Conduct Kannada & Marathi usability tests with 10 farmers', assignee: 'Ananya Sen', status: 'in_progress', priority: 'medium' }
    ],
    createdAt: '2025-09-01T10:00:00Z',
    likes: 184
  }
];

export const MOCK_TEAMS: Team[] = [
  {
    id: 'team-001',
    name: 'Team AgriVision AI',
    projectId: 'proj-001',
    projectName: 'AgriVision AI — Edge Micro-Drone for Autonomous Orchard Spraying',
    domain: 'Agritech & Autonomous UAVs',
    leaderId: 'usr-std-001',
    leaderName: 'Aarav Sharma',
    members: [
      { userId: 'usr-std-001', name: 'Aarav Sharma', department: 'AI & Data Eng', college: 'NITK Surathkal', role: 'AI & Vision Lead', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', verified: true, isLeader: true, studentId: '2023CSB1042', email: 'aarav.sharma@nitk.edu.in', mobile: '+91 98765 43210' },
      { userId: 'usr-std-002', name: 'Pooja Iyer', department: 'ECE', college: 'CEG Anna Univ', role: 'Hardware & Telemetry', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', verified: true, studentId: '2023ECE088', email: 'pooja.iyer@ceg.annauniv.edu', mobile: '+91 98451 12345' },
      { userId: 'usr-std-003', name: 'Vikramaditya Deshmukh', department: 'Mechanical', college: 'VJTI Mumbai', role: 'Airframe & Robotics', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', verified: true, studentId: '2023MECH014', email: 'vikram.d@vjti.ac.in', mobile: '+91 98200 67890' },
      { userId: 'usr-std-004', name: 'Ananya Sen', department: 'Interaction Design', college: 'NID Ahmedabad', role: 'Farmer UX & Usability', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', verified: true, studentId: '2023DES042', email: 'ananya.sen@nid.edu', mobile: '+91 99112 33445' }
    ],
    maxMembers: 6,
    requiredRoles: [
      { role: 'AI & Vision Lead', departmentHint: 'CSE / AIML', filled: true, filledBy: 'Aarav Sharma' },
      { role: 'Hardware & Telemetry', departmentHint: 'ECE', filled: true, filledBy: 'Pooja Iyer' },
      { role: 'Airframe & Robotics', departmentHint: 'Mechanical', filled: true, filledBy: 'Vikramaditya' },
      { role: 'Farmer UX & Usability', departmentHint: 'Design / UI', filled: true, filledBy: 'Ananya Sen' },
      { role: 'Cloud Backend Specialist', departmentHint: 'CSE / IT', filled: false },
      { role: 'Safety & Field Compliance Lead', departmentHint: 'Agritech / Bio', filled: false }
    ],
    status: 'active',
    mentorId: 'mnt-001',
    mentorName: 'Dr. Arvind Rao (IIT Bombay)',
    mentorStatus: 'accepted',
    createdAt: '2025-09-01T10:00:00Z',
    eventId: 'ev-001',
    eventTitle: 'Smart India Hackathon 2026'
  }
];

export const MOCK_EVENT_REGISTRATIONS: EventRegistrationItem[] = [
  {
    id: 'reg-kec-001',
    eventId: 'ev-kec-001',
    eventTitle: 'KEC National AI & Smart Robotics Hackathon 2026',
    participantId: 'usr-std-001',
    participantName: 'Aarav Sharma',
    studentId: '2023CSB1042',
    institution: 'National Institute of Technology Karnataka (NITK)',
    department: 'Artificial Intelligence & Machine Learning',
    year: '3rd Year',
    email: 'aarav.sharma@nitk.edu.in',
    phone: '+91 98765 43210',
    teamId: 'team-001',
    teamName: 'Team AgriVision AI',
    registrationStatus: 'confirmed',
    paymentStatus: 'free',
    attendanceStatus: 'checked_in',
    checkInTimestamp: '2026-02-18T09:45:00Z',
    checkInMethod: 'qr_scanner',
    checkedInBy: 'Demo Event Coordinator (KEC)',
    submissionStatus: 'submitted',
    certificateStatus: 'generated',
    certificateId: 'CN-KEC-AI26-PART-000101',
    registeredAt: '2026-02-05T11:20:00Z'
  },
  {
    id: 'reg-kec-002',
    eventId: 'ev-kec-001',
    eventTitle: 'KEC National AI & Smart Robotics Hackathon 2026',
    participantId: 'usr-std-002',
    participantName: 'Pooja Iyer',
    studentId: '2023ECE088',
    institution: 'College of Engineering, Guindy (Anna Univ)',
    department: 'Electronics & Communication',
    year: '3rd Year',
    email: 'pooja.iyer@ceg.annauniv.edu',
    phone: '+91 98451 12345',
    teamId: 'team-001',
    teamName: 'Team AgriVision AI',
    registrationStatus: 'confirmed',
    paymentStatus: 'free',
    attendanceStatus: 'checked_in',
    checkInTimestamp: '2026-02-18T09:46:12Z',
    checkInMethod: 'qr_scanner',
    checkedInBy: 'Demo Event Coordinator (KEC)',
    submissionStatus: 'submitted',
    certificateStatus: 'generated',
    certificateId: 'CN-KEC-AI26-PART-000102',
    registeredAt: '2026-02-05T11:25:00Z'
  },
  {
    id: 'reg-kec-003',
    eventId: 'ev-kec-001',
    eventTitle: 'KEC National AI & Smart Robotics Hackathon 2026',
    participantId: 'usr-std-003',
    participantName: 'Vikramaditya Deshmukh',
    studentId: '2023MECH014',
    institution: 'Veermata Jijabai Technological Institute (VJTI)',
    department: 'Mechanical Engineering',
    year: '3rd Year',
    email: 'vikram.d@vjti.ac.in',
    phone: '+91 98200 67890',
    teamId: 'team-001',
    teamName: 'Team AgriVision AI',
    registrationStatus: 'confirmed',
    paymentStatus: 'free',
    attendanceStatus: 'checked_in',
    checkInTimestamp: '2026-02-18T09:47:00Z',
    checkInMethod: 'qr_scanner',
    checkedInBy: 'Demo Event Coordinator (KEC)',
    submissionStatus: 'submitted',
    certificateStatus: 'generated',
    certificateId: 'CN-KEC-AI26-PART-000103',
    registeredAt: '2026-02-05T11:30:00Z'
  },
  {
    id: 'reg-kec-004',
    eventId: 'ev-kec-001',
    eventTitle: 'KEC National AI & Smart Robotics Hackathon 2026',
    participantId: 'usr-std-005',
    participantName: 'Rahul Verma',
    studentId: '2023KEC045',
    institution: 'Kuppam Engineering College',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    email: 'rahul.verma@kec.ac.in',
    phone: '+91 94411 55667',
    teamName: 'Team NeuralMesh KEC',
    registrationStatus: 'confirmed',
    paymentStatus: 'free',
    attendanceStatus: 'checked_in',
    checkInTimestamp: '2026-02-18T10:02:00Z',
    checkInMethod: 'manual_override',
    checkedInBy: 'Demo Event Coordinator (KEC)',
    submissionStatus: 'submitted',
    certificateStatus: 'pending',
    registeredAt: '2026-02-08T14:10:00Z'
  }
];

export const MOCK_QR_CHECKINS: QRCheckInRecord[] = [
  {
    id: 'chk-001',
    eventId: 'ev-kec-001',
    registrationId: 'reg-kec-001',
    participantId: 'usr-std-001',
    participantName: 'Aarav Sharma',
    institution: 'NITK Surathkal',
    timestamp: '2026-02-18T09:45:00Z',
    organizerId: 'KEC-DEMO-001',
    organizerName: 'Demo Event Coordinator',
    method: 'qr_scan',
    deviceInfo: 'KEC Registration Terminal #1',
    latitude: 12.7533,
    longitude: 78.3496,
    verified: true
  },
  {
    id: 'chk-002',
    eventId: 'ev-kec-001',
    registrationId: 'reg-kec-002',
    participantId: 'usr-std-002',
    participantName: 'Pooja Iyer',
    institution: 'Anna University',
    timestamp: '2026-02-18T09:46:12Z',
    organizerId: 'KEC-DEMO-001',
    organizerName: 'Demo Event Coordinator',
    method: 'qr_scan',
    deviceInfo: 'KEC Registration Terminal #1',
    latitude: 12.7533,
    longitude: 78.3496,
    verified: true
  }
];

export const MOCK_PROJECT_SUBMISSIONS: EventProjectSubmission[] = [
  {
    id: 'sub-001',
    eventId: 'ev-kec-001',
    teamId: 'team-001',
    teamName: 'Team AgriVision AI',
    projectTitle: 'AgriVision AI — Edge Micro-Drone for Autonomous Orchard Spraying',
    description: 'Real-time pest detection and autonomous micro-dosing spray mechanism with TensorRT on NVIDIA Jetson Orin Nano.',
    problemStatement: 'Manual spray causes high chemical wastage and health hazards in orchard farming.',
    solution: 'Autonomous vision drone with sub-second pest targeting and micro-nozzle actuation.',
    techStack: ['PyTorch', 'TensorRT', 'ROS2', 'ESP32', 'PX4'],
    githubUrl: 'https://github.com/campusnet-projects/agrivision-edge-ai',
    demoUrl: 'https://campusnet.network/demo/agrivision-live',
    presentationUrl: 'https://campusnet.network/docs/agrivision-presentation.pdf',
    videoUrl: 'https://campusnet.network/videos/agrivision-demo.mp4',
    submittedAt: '2026-02-18T14:30:00Z',
    status: 'winner',
    finalScore: 94.5,
    rank: 'Winner (1st Place)'
  },
  {
    id: 'sub-002',
    eventId: 'ev-kec-001',
    teamId: 'team-002',
    teamName: 'Team NeuralMesh KEC',
    projectTitle: 'Solar-Powered Smart Aquaponics Sensor Node',
    description: 'Energy-harvesting water quality monitoring telemetry with edge anomaly detection.',
    problemStatement: 'Fish mortality in rural aquaculture due to sudden dissolved oxygen drops.',
    solution: 'LoRaWAN dissolved oxygen and pH sensor grid with solar battery management.',
    techStack: ['Embedded C', 'ESP32', 'LoRaWAN', 'FastAPI'],
    githubUrl: 'https://github.com/kec-innovations/aquamesh',
    submittedAt: '2026-02-18T15:10:00Z',
    status: 'evaluated',
    finalScore: 88.0,
    rank: 'Runner-Up (2nd Place)'
  }
];

export const MOCK_EVALUATION_CRITERIA: EvaluationCriterion[] = [
  {
    id: 'crit-001',
    eventId: 'ev-kec-001',
    name: 'Technical Innovation & Architecture',
    description: 'Novelty of approach, edge optimization, and hardware/software integration depth.',
    maxScore: 30,
    weightagePercent: 30
  },
  {
    id: 'crit-002',
    eventId: 'ev-kec-001',
    name: 'Working Prototype Execution & Demo',
    description: 'Real-time stability, latency, accuracy, and physical mechanism performance.',
    maxScore: 30,
    weightagePercent: 30
  },
  {
    id: 'crit-003',
    eventId: 'ev-kec-001',
    name: 'Real-World Impact & Viability',
    description: 'Commercial feasibility, cost-effectiveness, and practical utility in Indian context.',
    maxScore: 20,
    weightagePercent: 20
  },
  {
    id: 'crit-004',
    eventId: 'ev-kec-001',
    name: 'Code Quality, Safety & Presentation',
    description: 'Documentation, modularity, fail-safe protocols, and team defense.',
    maxScore: 20,
    weightagePercent: 20
  }
];

export const MOCK_JUDGES: JudgeAccount[] = [
  {
    id: 'jdg-001',
    name: 'Dr. Arvind Rao',
    email: 'arvind.rao@iitb.ac.in',
    institution: 'IIT Bombay',
    designation: 'Professor of Edge Vision',
    assignedEventId: 'ev-kec-001',
    assignedSubmissionIds: ['sub-001', 'sub-002'],
    accessKey: 'JUDGE-KEC-RAO-99'
  },
  {
    id: 'jdg-002',
    name: 'Dr. Priya Sundaram',
    email: 'priya.sundaram@iisc.ac.in',
    institution: 'IISc Bangalore',
    designation: 'Associate Professor of Aerospace',
    assignedEventId: 'ev-kec-001',
    assignedSubmissionIds: ['sub-001'],
    accessKey: 'JUDGE-KEC-PRIYA-88'
  }
];

export const MOCK_EVALUATION_SCORES: EvaluationScore[] = [
  {
    id: 'sc-001',
    eventId: 'ev-kec-001',
    submissionId: 'sub-001',
    judgeId: 'jdg-001',
    judgeName: 'Dr. Arvind Rao',
    criteriaScores: [
      { criterionId: 'crit-001', criterionName: 'Technical Innovation', score: 29, maxScore: 30 },
      { criterionId: 'crit-002', criterionName: 'Working Demo', score: 28, maxScore: 30 },
      { criterionId: 'crit-003', criterionName: 'Real-World Impact', score: 19, maxScore: 20 },
      { criterionId: 'crit-004', criterionName: 'Code Quality', score: 19, maxScore: 20 }
    ],
    totalWeightedScore: 95.0,
    comments: 'Exceptional edge TensorRT calibration with 34 FPS latency. Nozzle actuation timing is highly precise.',
    recommendation: 'strong_accept',
    submittedAt: '2026-02-18T16:00:00Z'
  }
];

export const MOCK_EVENT_WINNERS: EventWinnerRecord[] = [
  {
    id: 'win-001',
    eventId: 'ev-kec-001',
    submissionId: 'sub-001',
    teamId: 'team-001',
    teamName: 'Team AgriVision AI',
    projectTitle: 'AgriVision AI — Edge Micro-Drone for Autonomous Orchard Spraying',
    members: [
      { name: 'Aarav Sharma', college: 'NITK Surathkal', role: 'AI Lead' },
      { name: 'Pooja Iyer', college: 'Anna University', role: 'Hardware Lead' },
      { name: 'Vikramaditya Deshmukh', college: 'VJTI Mumbai', role: 'Airframe Lead' },
      { name: 'Ananya Sen', college: 'NID Ahmedabad', role: 'UX Lead' }
    ],
    category: 'Winner',
    prizeAmount: '₹1,50,000',
    certificateGenerated: true,
    certificateId: 'CN-KEC-AI26-WIN-000001',
    finalRank: 1,
    score: 94.5
  },
  {
    id: 'win-002',
    eventId: 'ev-kec-001',
    submissionId: 'sub-002',
    teamId: 'team-002',
    teamName: 'Team NeuralMesh KEC',
    projectTitle: 'Solar-Powered Smart Aquaponics Sensor Node',
    members: [
      { name: 'Rahul Verma', college: 'Kuppam Engineering College', role: 'Lead Developer' }
    ],
    category: 'Runner-Up',
    prizeAmount: '₹75,000',
    certificateGenerated: true,
    certificateId: 'CN-KEC-AI26-RUN-000002',
    finalRank: 2,
    score: 88.0
  }
];

export const MOCK_CERTIFICATE_TEMPLATES: CertificateTemplate[] = [
  {
    id: 'tpl-kec-part',
    institutionId: 'inst-kec-001',
    eventId: 'ev-kec-001',
    title: 'KEC National Hackathon Participation Certificate',
    category: 'Participation',
    accentColor: '#123B7A',
    bannerTitle: 'KUPPAM ENGINEERING COLLEGE',
    subTitle: 'Certificate of Active Participation & Technical Contribution',
    bodyTemplate: 'This is to certify that {recipientName} from {institution} has actively participated in the {eventTitle} held at Kuppam Engineering College.',
    authorizedSignatories: [
      { name: 'Dr. S. K. Reddy', title: 'Principal', organization: 'Kuppam Engineering College' },
      { name: 'Demo Event Coordinator', title: 'Convener', organization: 'KEC Innovation Council' }
    ],
    isActive: true
  },
  {
    id: 'tpl-kec-win',
    institutionId: 'inst-kec-001',
    eventId: 'ev-kec-001',
    title: 'KEC National Hackathon Winner Certificate of Merit',
    category: 'Winner',
    accentColor: '#B8292F',
    bannerTitle: 'KUPPAM ENGINEERING COLLEGE',
    subTitle: 'Certificate of Excellence & Grand Championship',
    bodyTemplate: 'This prestigious award is presented to {recipientName} for securing {achievement} in the {eventTitle}.',
    authorizedSignatories: [
      { name: 'Dr. S. K. Reddy', title: 'Principal', organization: 'Kuppam Engineering College' },
      { name: 'Dr. Arvind Rao', title: 'Chief Jury', organization: 'IIT Bombay' }
    ],
    isActive: true
  }
];

export const MOCK_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-001',
    certificateNumber: 'CN-2025-WIN-7841-9021',
    recipientName: 'Aarav Sharma',
    recipientRole: 'Winner',
    eventTitle: 'Smart India Ideathon 2025 — National Finale',
    eventId: 'ev-001',
    eventOrganizer: 'Ministry of Education Innovation Cell & AICTE',
    issueDate: 'December 12, 2025',
    qrCodeData: 'https://campusnet.network/verify/certificate/CN-2025-WIN-7841-9021',
    rank: '1st Prize (All India Hardware Category)',
    achievement: '1st Prize Champion',
    verified: true,
    institution: 'NITK Surathkal',
    type: 'event',
    status: 'valid'
  },
  {
    id: 'cert-kec-001',
    certificateNumber: 'CN-KEC-AI26-WIN-000001',
    recipientName: 'Aarav Sharma',
    recipientRole: 'Winner',
    eventTitle: 'KEC National AI & Smart Robotics Hackathon 2026',
    eventId: 'ev-kec-001',
    eventOrganizer: 'Kuppam Engineering College',
    organizerInstitutionId: 'inst-kec-001',
    issueDate: 'February 18, 2026',
    qrCodeData: 'https://campusnet.network/verify/certificate/CN-KEC-AI26-WIN-000001',
    rank: 'Grand Champion (1st Place)',
    achievement: 'Grand Champion (1st Place)',
    verified: true,
    institution: 'NITK Surathkal',
    type: 'event',
    status: 'valid'
  },
  {
    id: 'cert-kec-002',
    certificateNumber: 'CN-KEC-AI26-PART-000101',
    recipientName: 'Pooja Iyer',
    recipientRole: 'Participant',
    eventTitle: 'KEC National AI & Smart Robotics Hackathon 2026',
    eventId: 'ev-kec-001',
    eventOrganizer: 'Kuppam Engineering College',
    organizerInstitutionId: 'inst-kec-001',
    issueDate: 'February 18, 2026',
    qrCodeData: 'https://campusnet.network/verify/certificate/CN-KEC-AI26-PART-000101',
    achievement: 'Certified Hardware Participant',
    verified: true,
    institution: 'Anna University',
    type: 'event',
    status: 'valid'
  }
];

export const MOCK_MENTORSHIP_CERTIFICATES: MentorshipCertificate[] = [
  {
    id: 'ment-cert-001',
    certificateNumber: 'CN-2026-MNT-8F2A-3914',
    mentorId: 'mnt-001',
    mentorName: 'Dr. Arvind Rao',
    mentorDesignation: 'Professor & Head of Edge Computing Lab',
    mentorInstitution: 'IIT Bombay',
    teamId: 'team-001',
    teamName: 'Team AgriVision AI',
    studentNames: ['Aarav Sharma', 'Pooja Iyer', 'Vikramaditya Deshmukh', 'Ananya Sen'],
    studentInstitutions: ['NITK Surathkal', 'Anna University', 'VJTI Mumbai', 'NID Ahmedabad'],
    projectTitle: 'AgriVision AI — Edge Micro-Drone for Autonomous Orchard Spraying',
    projectDomain: 'Agritech & Autonomous UAVs',
    startDate: 'September 2025',
    completionDate: 'February 2026',
    durationWeeks: 24,
    mentorContribution: 'Conducted weekly technical reviews on TensorRT quantization, failsafe PX4 telemetry, and physical wind tunnel validation.',
    milestonesGuided: 4,
    skillsCovered: ['Edge TensorRT', 'ROS2 Navigation', 'CFD Aerodynamics', 'Fail-Safe Protocols'],
    projectOutcome: 'Demonstrated 34 FPS edge inference with sub-2% pesticide variance on 5-acre trial plot.',
    qrCodeData: 'https://campusnet.network/verify/certificate/CN-2026-MNT-8F2A-3914',
    verified: true,
    issuedAt: '2026-02-15T18:00:00Z',
    status: 'valid',
    authorizedSignatures: [
      { name: 'Dr. Arvind Rao', title: 'Faculty Guide', organization: 'IIT Bombay' },
      { name: 'Prof. K. Narayanan', title: 'Dean of Research', organization: 'National Innovation Registry' }
    ]
  }
];

export const MOCK_EVENT_ANNOUNCEMENTS: EventAnnouncement[] = [
  {
    id: 'anc-001',
    eventId: 'ev-kec-001',
    eventTitle: 'KEC National AI & Smart Robotics Hackathon 2026',
    organizerId: 'KEC-DEMO-001',
    title: 'Hardware Lab Check-in & Power Supply Guidelines',
    message: 'All registered teams must bring their official College ID cards and check in at Auditorium Desk A. Standard 12V 5A bench supplies are provided.',
    audience: 'all',
    createdAt: '2026-02-17T18:00:00Z'
  }
];

export const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-001',
    actorId: 'KEC-DEMO-001',
    actorName: 'Demo Event Coordinator (KEC)',
    actorRole: 'institution_admin',
    action: 'CREATE_EVENT',
    targetType: 'event',
    targetId: 'ev-kec-001',
    targetName: 'KEC National AI & Smart Robotics Hackathon 2026',
    timestamp: '2026-02-01T10:00:00Z',
    ipAddress: '103.24.18.92',
    details: 'Event draft created with 4 tracks and ₹2.6L prize pool.'
  },
  {
    id: 'aud-002',
    actorId: 'adm-001',
    actorName: 'National Chief Administrator',
    actorRole: 'super_admin',
    action: 'APPROVE_EVENT',
    targetType: 'event',
    targetId: 'ev-kec-001',
    targetName: 'KEC National AI & Smart Robotics Hackathon 2026',
    timestamp: '2026-02-02T14:30:00Z',
    ipAddress: '14.139.128.5',
    details: 'Verified institution bonafide and approved event for public CampusNet discovery.'
  },
  {
    id: 'aud-003',
    actorId: 'KEC-DEMO-001',
    actorName: 'Demo Event Coordinator (KEC)',
    actorRole: 'institution_admin',
    action: 'GENERATE_CERTIFICATES',
    targetType: 'certificate',
    targetId: 'ev-kec-001',
    targetName: 'KEC National AI & Smart Robotics Hackathon 2026',
    timestamp: '2026-02-18T17:30:00Z',
    ipAddress: '103.24.18.92',
    details: 'Generated 4 verified winner and participant certificates with tamper-proof QR verification codes.'
  }
];

export const MOCK_RESEARCH_CONFERENCES: ResearchConference[] = [
  {
    id: 'conf-001',
    title: 'IEEE International Conference on Advanced Robotics & AI (ICARAI 2026)',
    organizer: 'IEEE India Council & IISc Bangalore',
    venue: 'IISc National Science Complex',
    city: 'Bengaluru',
    state: 'Karnataka',
    dates: 'July 24 - 26, 2026',
    submissionDeadline: 'April 15, 2026',
    tracks: ['Edge AI for UAVs', 'Surgical Robotics', 'Federated Learning'],
    mode: 'Hybrid',
    indexType: 'IEEE Xplore / Scopus Indexed',
    registrationUrl: 'https://icarai2026.org/submit'
  },
  {
    id: 'conf-002',
    title: 'National Symposium on Agritech & Clean Power 2026',
    organizer: 'ICAR & IIT Madras',
    venue: 'IITM Research Park',
    city: 'Chennai',
    state: 'Tamil Nadu',
    dates: 'August 12 - 14, 2026',
    submissionDeadline: 'May 30, 2026',
    tracks: ['Precision Agriculture Sensors', 'Micro-Grid Energy Storage'],
    mode: 'Offline',
    indexType: 'Springer LNCS Indexed',
    registrationUrl: 'https://agripower2026.iitm.ac.in'
  }
];

export const MOCK_PUBLICATIONS: ResearchPublication[] = [
  {
    id: 'pub-001',
    title: 'Lightweight Quantized Vision Transformers for Real-Time Pest Localization on Resource-Constrained Drones',
    authors: ['Aarav Sharma', 'Dr. Arvind Rao', 'Kavya Ramanathan (PhD)'],
    journal: 'IEEE Robotics and Automation Letters (RA-L)',
    year: 2026,
    doi: '10.1109/LRA.2026.3412901',
    abstract: 'We present a 4-bit integer quantized Vision Transformer achieving 34.2 FPS on a 10W NVIDIA Jetson Orin Nano with 91.4% mAP on sub-centimeter agricultural crop pests, outperforming baseline YOLOv8 by 4.2x latency improvement.',
    datasetLink: 'https://doi.org/10.5281/zenodo.1084219',
    tags: ['Edge-AI', 'Quantization', 'Precision-Agriculture', 'UAV-Navigation'],
    citations: 18,
    collabOpen: true,
    institution: 'IIT Bombay & NITK Surathkal'
  }
];

export const MOCK_STORIES: CampusStory[] = [
  {
    id: 'st-001',
    title: 'Watch Team AgriVision Test Jetson Orin Nano Pest Spraying Drone in Karnataka Orchard',
    creatorName: 'Aarav Sharma',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    creatorDept: 'AI & Data Eng',
    creatorCollege: 'NITK Surathkal',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-drone-flying-over-a-green-forest-42861-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600&auto=format&fit=crop&q=80',
    category: 'Project',
    likesCount: 342,
    commentsCount: 28,
    duration: '0:45',
    isLiked: false,
    tags: ['Drone', 'PrecisionAgri', 'EdgeAI', 'NITK']
  }
];

export const MOCK_QUESTIONS: AskQuestion[] = [
  {
    id: 'q-001',
    title: 'How to prevent INT8 quantization accuracy drop in TensorRT for small pest object detection?',
    body: 'When generating the INT8 calibration cache using TensorRT IInt8EntropyCalibrator2, our mAP on small insect pests drops by 6.4%. What image augmentation and batch size strategies preserve fine spatial resolution?',
    authorName: 'Aarav Sharma',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    authorRole: 'Student (AI & Data Eng)',
    authorCollege: 'NITK Surathkal',
    tags: ['TensorRT', 'Edge-AI', 'Quantization', 'YOLOv11'],
    upvotes: 29,
    answersCount: 1,
    hasAcceptedAnswer: false,
    createdAt: '2026-02-16T18:00:00Z',
    isUpvoted: true,
    answers: [
      {
        id: 'ans-002',
        authorName: 'Dr. Arvind Rao',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        authorRole: 'Professor, IIT Bombay',
        authorBadge: 'Verified Mentor',
        body: 'For small targets (<32x32 px), use `IInt8MinMaxCalibrator` instead of EntropyCalibrator, and ensure you disable quantization on the first 3 backbone stem convolution layers and the final regression head layers using layer-wise precision constraints (`setPrecision(nvinfer1::DataType::kHALF)`). This retains high precision gradients where spatial localization is most sensitive.',
        upvotes: 31,
        isAccepted: false,
        createdAt: '2026-02-16T20:30:00Z'
      }
    ]
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-001',
    title: 'Mentorship Request Accepted',
    description: 'Dr. Arvind Rao (IIT Bombay) has officially accepted to mentor Team AgriVision AI on CampusNet.',
    type: 'mentor',
    timestamp: '2 hours ago',
    read: false,
    linkAction: 'workspace'
  },
  {
    id: 'notif-002',
    title: 'New Milestone Review Feedback',
    description: 'Mentor approved Milestone #3: Edge TensorRT Calibration with 91.2% accuracy.',
    type: 'mentor',
    timestamp: '5 hours ago',
    read: false,
    linkAction: 'workspace'
  },
  {
    id: 'notif-003',
    title: 'Smart India Hackathon 2026 Deadline',
    description: 'Final submission deadline is March 31, 2026. Complete your 6-member team verification.',
    type: 'event',
    timestamp: '1 day ago',
    read: true,
    linkAction: 'events'
  },
  {
    id: 'notif-004',
    title: 'Verifiable Digital Certificate Issued',
    description: 'Your Smart India Ideathon 2025 digital certificate (ID: CN-2025-WIN-7841-9021) is verified.',
    type: 'certificate',
    timestamp: '3 days ago',
    read: true,
    linkAction: 'certificates'
  }
];

export const MOCK_DIRECT_MESSAGES: DirectMessage[] = [
  {
    id: 'dm-001',
    senderId: 'mnt-001',
    senderName: 'Dr. Arvind Rao',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    senderRole: 'mentor',
    receiverId: 'usr-std-001',
    receiverName: 'Aarav Sharma',
    text: 'Aarav, please ensure your Jetson Orin Nano TensorRT INT8 entropy calibrator is evaluated on 500 uncompressed orchard frames.',
    timestamp: '10:30 AM',
    read: true
  }
];

export const MOCK_INSTITUTIONS_LIST = [
  'Kuppam Engineering College',
  'National Institute of Technology Karnataka (NITK)',
  'Indian Institute of Technology Bombay (IIT Bombay)',
  'Indian Institute of Technology Madras (IIT Madras)',
  'Indian Institute of Technology Delhi (IIT Delhi)',
  'Indian Institute of Science (IISc Bangalore)',
  'College of Engineering, Guindy (Anna University)',
  'Veermata Jijabai Technological Institute (VJTI Mumbai)',
  'National Institute of Design (NID Ahmedabad)',
  'Delhi Technological University (DTU)',
  'BITS Pilani (Pilani, Goa, Hyderabad)',
  'RV College of Engineering (RVCE Bangalore)',
  'PSG College of Technology (Coimbatore)',
  'All India Institute of Medical Sciences (AIIMS Delhi)',
  'National Institute of Technology Trichy (NITT)'
];

export const MOCK_DEPARTMENTS_LIST = [
  'Artificial Intelligence & Machine Learning',
  'Computer Science & Engineering',
  'Electronics & Communication Engineering (ECE)',
  'Electrical & Electronics Engineering (EEE)',
  'Mechanical & Mechatronics Engineering',
  'Human-Centered Design & UI/UX',
  'Biomedical Engineering & Bio-Informatics',
  'Aerospace & Aeronautical Engineering',
  'Civil & Environmental Engineering',
  'Chemical & Nanotechnology',
  'Agro-Informatics & Precision Agriculture',
  'Data Science & Analytics',
  'Information Technology & Cybersecurity'
];
