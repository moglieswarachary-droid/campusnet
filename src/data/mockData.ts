import { 
  User, Mentor, Researcher, Team, Project, EventItem, 
  ResearchPublication, CampusStory, AskQuestion, Certificate, 
  MentorshipRequest, NotificationItem 
} from '../types';

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
  verifiedStudent: true,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  innovationScore: 840,
  skills: ['PyTorch', 'Computer Vision', 'Edge AI', 'ROS2', 'TypeScript', 'FastAPI'],
  badges: ['Innovator', 'Hackathon Winner', 'Team Player', 'Verified Student', 'Research Contributor'],
  bio: 'AI/ML undergraduate researching edge computer vision for precision agriculture & autonomous micro-drones. Winner of Smart India Ideathon 2025.',
  interests: ['Precision Agriculture', 'Edge Computing', 'Autonomous UAVs', 'Embedded Systems'],
  github: 'https://github.com/aarav-ai',
  linkedin: 'https://linkedin.com/in/aarav-sharma-ai',
  idCardVerifiedAt: '2025-08-14T10:30:00Z',
  role: 'student'
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
    verifiedStudent: true,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    innovationScore: 790,
    skills: ['Embedded C', 'PCB Design', 'ESP32', 'LoRaWAN', 'FPGA (Verilog)', 'Circuit Simulation'],
    badges: ['Hardware Wizard', 'Verified Student', 'Project Builder'],
    bio: 'Hardware geek designing low-power IoT telemetry boards and sensor nodes for extreme environmental sensing.',
    interests: ['Edge IoT', 'Bio-Sensors', 'Satellite Communication'],
    role: 'student'
  },
  {
    id: 'usr-std-003',
    name: 'Vikramaditya Deshmukh',
    email: 'vikram.deshmukh@vjti.ac.in',
    mobile: '+91 97654 98765',
    studentId: '2022MECH045',
    institution: 'Veermata Jijabai Technological Institute (VJTI)',
    university: 'Mumbai University',
    department: 'Mechanical & Mechatronics Engineering',
    course: 'B.Tech Mechanical Engineering',
    year: '4th Year',
    verifiedStudent: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    innovationScore: 820,
    skills: ['SolidWorks', 'ANSYS FEA', '3D Prototyping', 'Aerodynamics Simulation', 'Robotics Kinematics', 'CNC Machining'],
    badges: ['Design Master', 'Robotics Finalist', 'Verified Student'],
    bio: 'Mechanical designer specializing in lightweight carbon-fiber airframes and autonomous drone payload mechanisms.',
    interests: ['UAV Design', 'Biomechatronics', 'Rapid Prototyping'],
    role: 'student'
  },
  {
    id: 'usr-std-004',
    name: 'Ananya Roy',
    email: 'ananya.roy@nid.edu',
    mobile: '+91 98111 22334',
    studentId: '2023DES204',
    institution: 'National Institute of Design (NID)',
    university: 'NID Ahmedabad',
    department: 'Human-Centered Design & UI/UX',
    course: 'B.Des Interaction Design',
    year: '3rd Year',
    verifiedStudent: true,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    innovationScore: 860,
    skills: ['Figma', 'Design Systems', 'User Research', 'Data Visualization', 'Prototyping', 'Accessibility (a11y)'],
    badges: ['UI/UX Prodigy', 'Hackathon Designer', 'Verified Student'],
    bio: 'Interaction designer translating complex sensor telemetry and AI inference into seamless, accessible dashboard experiences.',
    interests: ['Accessible Interfaces', 'Agritech UX', 'Mission Critical Dashboards'],
    role: 'student'
  },
  {
    id: 'usr-std-005',
    name: 'Rohan Sen',
    email: 'rohan.sen@iitb.ac.in',
    mobile: '+91 99223 34455',
    studentId: '2023DS301',
    institution: 'Indian Institute of Technology Bombay (IIT Bombay)',
    university: 'IIT Bombay',
    department: 'Computer Science & Distributed Systems',
    course: 'B.Tech Computer Science',
    year: '3rd Year',
    verifiedStudent: true,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    innovationScore: 910,
    skills: ['Rust', 'Distributed Systems', 'Kubernetes', 'WebRTC', 'Zero Knowledge Proofs', 'Go'],
    badges: ['Backend Architect', 'Verified Student', 'National Finalist'],
    bio: 'Distributed systems developer building high-throughput edge streaming pipelines and fault-tolerant sensor ingestion nodes.',
    interests: ['High Performance Computing', 'Distributed Consensus', 'Decentralized Protocols'],
    role: 'student'
  },
  {
    id: 'usr-std-006',
    name: 'Dr. Sneha Paul (PhD)',
    email: 'sneha.paul@iisc.ac.in',
    mobile: '+91 98888 77766',
    studentId: 'PHD2022AG09',
    institution: 'Indian Institute of Science (IISc Bangalore)',
    university: 'IISc Bangalore',
    department: 'Center for Sustainable Technologies & Agronomy',
    course: 'PhD Agro-Informatics',
    year: '4th Year Scholar',
    verifiedStudent: true,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    innovationScore: 950,
    skills: ['Hyperspectral Imaging', 'Soil Chemistry Modeling', 'Scientific Python', 'R / Biostatistics', 'Agronomy Datasets'],
    badges: ['Domain Expert', 'Research Contributor', 'Verified Student'],
    bio: 'PhD researcher focusing on hyperspectral crop stress biomarkers and regional agro-climatic disease prediction.',
    interests: ['Precision Agriculture', 'Plant Pathology', 'Satellite Remote Sensing'],
    role: 'student'
  }
];

export const MOCK_MENTORS: Mentor[] = [
  {
    id: 'mnt-001',
    name: 'Dr. Arvind Rao',
    email: 'arvind.rao@iitb.ac.in',
    mobile: '+91 94432 10987',
    title: 'Professor & Head of Computer Vision Lab',
    qualification: 'Ph.D. in Computer Science (Stanford / IITB)',
    institution: 'Indian Institute of Technology Bombay',
    department: 'Department of Computer Science & Engineering',
    specialization: 'Computer Vision, Edge AI, Autonomous Robotics',
    yearsExperience: 14,
    academicExp: '10+ Years Teaching & Guiding PhD / Master Theses',
    industryExp: '4 Years Lead AI Scientist at NVIDIA Research',
    researchAreas: ['Edge Computer Vision', 'Visual Odometry', 'Multi-Spectral Drone Analytics', 'Deep Learning Model Compression'],
    projectsGuided: 38,
    certifications: ['IEEE Senior Member', 'ACM Distinguished Scientist', 'NVIDIA Deep Learning Institute Instructor'],
    mentoringInterests: ['Agritech AI', 'UAV Swarm Vision', 'Edge Machine Learning', 'Student Startups'],
    availability: 'Available',
    verifiedMentor: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 4.96,
    reviewsCount: 42,
    bio: 'Passionate about mentoring interdisciplinary student teams tackling real-world Indian agriculture, defense and healthcare challenges using practical edge intelligence.'
  },
  {
    id: 'mnt-002',
    name: 'Dr. Meenakshi Sundaram',
    email: 'm.sundaram@iitm.ac.in',
    mobile: '+91 94440 23456',
    title: 'Associate Professor, Embedded VLSI & IoT Lab',
    qualification: 'Ph.D. in Microelectronics (IISc Bangalore)',
    institution: 'Indian Institute of Technology Madras',
    department: 'Department of Electrical Engineering',
    specialization: 'Ultra-Low Power VLSI, Edge TinyML, LoRaWAN Networks',
    yearsExperience: 11,
    academicExp: '8 Years at IIT Madras & Anna University',
    industryExp: '3 Years Senior Hardware Systems Architect at Texas Instruments',
    researchAreas: ['Energy Harvesting Systems', 'TinyML on Microcontrollers', 'Industrial Wireless Sensor Networks'],
    projectsGuided: 27,
    certifications: ['IEEE Circuits and Systems Society Chair', 'TI Embedded Fellow'],
    mentoringInterests: ['Hardware-Software Co-design', 'Smart Metering & Grids', 'Environmental Telemetry'],
    availability: 'Available',
    verifiedMentor: true,
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    rating: 4.92,
    reviewsCount: 31,
    bio: 'Guiding hardware and firmware teams from schematic capture to multi-layer PCB tapeout, EMI testing, and field deployment.'
  },
  {
    id: 'mnt-003',
    name: 'Prof. Rajeshwar Sharma',
    email: 'rajeshwar.sharma@dtu.ac.in',
    mobile: '+91 98102 33445',
    title: 'Professor of Robotics & Mechatronics',
    qualification: 'Ph.D. in Mechanical Engineering & Robotics (DTU / MIT Postdoc)',
    institution: 'Delhi Technological University (DTU)',
    department: 'Department of Mechanical Engineering',
    specialization: 'Unmanned Aerial Vehicles (UAV), Dynamics & Control, Mechatronics',
    yearsExperience: 16,
    academicExp: '12 Years Guiding Student UAV Teams & Formula Student',
    industryExp: '4 Years Aerospace Design Consultant (DRDO / ISRO Projects)',
    researchAreas: ['Hybrid VTOL Aerodynamics', 'Lightweight Carbon Composites', 'Autonomous Drone Gimbal Stabilization'],
    projectsGuided: 52,
    certifications: ['Aeronautical Society of India Fellow', 'DGCA Drone Pilot & Master Trainer'],
    mentoringInterests: ['Autonomous Drones', 'Bio-inspired Robotics', 'Defense Innovations'],
    availability: 'Limited Slots',
    verifiedMentor: true,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    rating: 4.98,
    reviewsCount: 56,
    bio: 'Veteran mentor for national aerial robotics and aerospace competitions. Hands-on expert in structural FEA and autonomous flight controllers.'
  },
  {
    id: 'mnt-004',
    name: 'Dr. Anita Kulkarni',
    email: 'anita.kulkarni@aiims.edu',
    mobile: '+91 99300 11223',
    title: 'Lead Bio-Informatics Researcher & Medical AI Specialist',
    qualification: 'MD + Ph.D. in Computational Biology (AIIMS / Oxford)',
    institution: 'All India Institute of Medical Sciences (AIIMS Delhi)',
    department: 'Department of Biomedical Engineering & Bioinformatics',
    specialization: 'Clinical NLP, Medical Diagnostic Imaging, MedTech Devices',
    yearsExperience: 9,
    academicExp: '5 Years AIIMS Faculty',
    industryExp: '4 Years Medical AI Consultant at Philips Healthcare',
    researchAreas: ['Federated Learning in Healthcare', 'Multimodal EHR Diagnostics', 'Point-of-Care Microfluidic Biosensors'],
    projectsGuided: 19,
    certifications: ['National Medical Commission Certified', 'HIPAA & CDSCO Medical Device Regulatory Lead'],
    mentoringInterests: ['HealthTech Hackathons', 'Clinical Validation', 'Diagnostic AI'],
    availability: 'Available',
    verifiedMentor: true,
    avatar: 'https://images.unsplash.com/photo-1594824813580-04a434c442cf?w=150&auto=format&fit=crop&q=80',
    rating: 4.88,
    reviewsCount: 24,
    bio: 'Bridging engineering students with clinician needs to build FDA/CDSCO-ready diagnostic systems that save lives.'
  }
];

export const MOCK_RESEARCHERS: Researcher[] = [
  {
    id: 'res-001',
    name: 'Kavya Ramanathan',
    email: 'kavya.r@iisc.ac.in',
    scholarId: 'IISC-CS-PHD-2022-041',
    university: 'Indian Institute of Science (IISc Bangalore)',
    department: 'Department of Computational and Data Sciences',
    researchArea: 'Privacy-Preserving Federated Learning & Edge Quantization',
    interests: ['Federated Learning', 'Differential Privacy', 'Healthcare AI', 'Model Compression'],
    guide: 'Prof. Chiranjib Bhattacharyya',
    publicationsCount: 6,
    citationsCount: 142,
    hIndex: 4,
    datasets: ['OpenMIMI-Federated-ECG', 'IndianAgri-Pest-10K'],
    verifiedResearcher: true,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    openForCollab: true,
    bio: 'Investigating lightweight encryption schemes for decentralized gradient aggregation on resource-constrained edge devices.'
  },
  {
    id: 'res-002',
    name: 'Gaurav Kulkarni',
    email: 'gaurav.k@iitd.ac.in',
    scholarId: 'IITD-MECH-PHD-2023-018',
    university: 'Indian Institute of Technology Delhi',
    department: 'Department of Energy Science & Engineering',
    researchArea: 'Next-Generation Solid-State Battery Thermal Management',
    interests: ['Phase Change Materials', 'CFD Simulation', 'EV Battery Packs', 'Micro-Channel Cooling'],
    guide: 'Prof. B. Premachandran',
    publicationsCount: 4,
    citationsCount: 88,
    hIndex: 3,
    datasets: ['ThermalCycler-EV-NMC-2025'],
    verifiedResearcher: true,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    openForCollab: true,
    bio: 'Developing novel passive cooling geometries for high-density lithium cells under extreme Indian summer conditions.'
  }
];

export const MOCK_TEAMS: Team[] = [
  {
    id: 'team-agro-001',
    name: 'AgriVision Autonomous AI',
    projectId: 'proj-001',
    projectName: 'AgriVision AI — Edge Drone Crop Diagnostics & Swarm Spraying',
    domain: 'AI/ML + Precision Agriculture + Hardware Robotics',
    leaderId: 'usr-std-001',
    leaderName: 'Aarav Sharma',
    members: [
      {
        userId: 'usr-std-001',
        name: 'Aarav Sharma',
        department: 'AI & Data Engineering',
        college: 'NITK Surathkal',
        role: 'AI/ML & Vision Lead',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        verified: true,
        isLeader: true
      },
      {
        userId: 'usr-std-002',
        name: 'Pooja Iyer',
        department: 'ECE',
        college: 'College of Engineering, Guindy',
        role: 'Hardware & Sensor Telemetry',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        verified: true
      },
      {
        userId: 'usr-std-003',
        name: 'Vikramaditya Deshmukh',
        department: 'Mechanical / Mechatronics',
        college: 'VJTI Mumbai',
        role: 'Drone Airframe & Payload Mechanics',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        verified: true
      },
      {
        userId: 'usr-std-004',
        name: 'Ananya Roy',
        department: 'Human-Centered Design',
        college: 'NID Ahmedabad',
        role: 'UI/UX & Farmer Field Dashboard',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        verified: true
      },
      {
        userId: 'usr-std-005',
        name: 'Rohan Sen',
        department: 'Computer Science',
        college: 'IIT Bombay',
        role: 'Cloud Streaming & Fleet API',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        verified: true
      },
      {
        userId: 'usr-std-006',
        name: 'Dr. Sneha Paul (PhD)',
        department: 'Agro-Informatics',
        college: 'IISc Bangalore',
        role: 'Agronomy Research & Dataset Validation',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        verified: true
      }
    ],
    maxMembers: 6,
    requiredRoles: [
      { role: 'AI/ML Lead', departmentHint: 'CSE / AI', filled: true, filledBy: 'Aarav Sharma' },
      { role: 'Embedded & Sensors', departmentHint: 'ECE / EEE', filled: true, filledBy: 'Pooja Iyer' },
      { role: 'Airframe & Robotics', departmentHint: 'Mechanical', filled: true, filledBy: 'Vikramaditya Deshmukh' },
      { role: 'UI/UX Designer', departmentHint: 'Design / Human Factors', filled: true, filledBy: 'Ananya Roy' },
      { role: 'Backend & Cloud', departmentHint: 'CSE / IT', filled: true, filledBy: 'Rohan Sen' },
      { role: 'Domain Researcher', departmentHint: 'Agro-Informatics / Bio', filled: true, filledBy: 'Dr. Sneha Paul' }
    ],
    status: 'active',
    mentorId: 'mnt-001',
    mentorName: 'Dr. Arvind Rao (IIT Bombay)',
    mentorStatus: 'accepted',
    createdAt: '2026-02-10T14:00:00Z',
    eventId: 'evt-sih-2026',
    eventTitle: 'Smart India Hackathon 2026 (Ministry of Agriculture)'
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-001',
    title: 'AgriVision AI — Edge Drone Crop Diagnostics & Swarm Spraying',
    problemStatement: 'Indian farmers lose ₹45,000+ Crores annually to late pest detection and non-uniform pesticide spraying. Ground inspection is laborious and satellite imagery lacks millimeter leaf-level resolution.',
    proposedSolution: 'A multi-rotor autonomous UAV equipped with NVIDIA Jetson Orin Nano running quantized YOLOv11 + TensorRT, paired with LoRaWAN multispectral ground soil sensors to pinpoint blight in real-time and trigger targeted micro-dosing.',
    domain: 'Agriculture & IoT',
    technologies: ['PyTorch', 'TensorRT', 'YOLOv11', 'ROS2', 'ESP32', 'LoRaWAN', 'SolidWorks', 'FastAPI', 'React'],
    requiredSkills: ['Computer Vision', 'Embedded C', 'Airframe Dynamics', 'UI/UX Design', 'Plant Pathology'],
    teamId: 'team-agro-001',
    teamName: 'AgriVision Autonomous AI',
    teamMembersCount: 6,
    institution: 'Inter-Collegiate Consortium (NITK, CEG Anna Univ, VJTI, NID, IITB, IISc)',
    mentor: 'Dr. Arvind Rao',
    mentorTitle: 'Professor & Head of Computer Vision Lab, IIT Bombay',
    status: 'Prototype',
    progressPercent: 78,
    githubUrl: 'https://github.com/campuslink-org/agrivision-ai',
    demoUrl: 'https://agrivision-demo.campuslink.network',
    papersCount: 2,
    milestones: [
      {
        id: 'm1',
        title: 'Project Inception & Architecture Approval',
        description: 'Multi-institutional team formation, domain problem validation with Ministry of Agriculture dataset.',
        status: 'approved',
        dueDate: '2026-01-20',
        approvedByMentor: true,
        mentorFeedback: 'Well structured requirements. Good choice of TensorRT quantization for low latency inference on edge.'
      },
      {
        id: 'm2',
        title: 'Hardware Schematic & Airframe Aerodynamics',
        description: 'Custom ESP32 telemetry PCB design and 6-rotor carbon fiber frame FEA stress simulation.',
        status: 'approved',
        dueDate: '2026-02-05',
        approvedByMentor: true,
        mentorFeedback: 'Payload balance verified. Ensure conformal coating for field humidity resistance.'
      },
      {
        id: 'm3',
        title: 'Model Training & Jetson TensorRT Deployment',
        description: 'Train 8-class pest & foliar blight detector with 94.2% mAP50. Quantize to INT8 for 42 FPS on Orin Nano.',
        status: 'approved',
        dueDate: '2026-02-28',
        approvedByMentor: true,
        mentorFeedback: 'Outstanding inference latency: 23.8ms per 1080p frame under varying sun angles.'
      },
      {
        id: 'm4',
        title: 'Integrated Field Flight & Spray Test',
        description: 'Autonomous waypoint flight over 5-acre sugarcane test plot with real-time nozzle triggering.',
        status: 'in_progress',
        dueDate: '2026-03-25'
      },
      {
        id: 'm5',
        title: 'Final SIH National Grand Finale Submission',
        description: 'End-to-end working demonstration, farmer telemetry app, open-source dataset, and research preprint.',
        status: 'pending',
        dueDate: '2026-04-15'
      }
    ],
    tasks: [
      { id: 't1', title: 'Calibrate optical flow camera with ROS2 Nav2 node', assignee: 'Vikramaditya Deshmukh', status: 'done', priority: 'high' },
      { id: 't2', title: 'Implement farmer multi-lingual audio alerts (Hindi, Tamil, Kannada)', assignee: 'Ananya Roy', status: 'in_progress', priority: 'medium' },
      { id: 't3', title: 'Stress test LoRaWAN gateway packet drop at 2.5 km distance', assignee: 'Pooja Iyer', status: 'in_progress', priority: 'high' },
      { id: 't4', title: 'Bench test INT8 vs FP16 thermal throttling on drone chassis', assignee: 'Aarav Sharma', status: 'done', priority: 'medium' },
      { id: 't5', title: 'Draft research methodology section for IEEE Agro-Vision 2026', assignee: 'Dr. Sneha Paul (PhD)', status: 'todo', priority: 'medium' }
    ],
    createdAt: '2026-01-10T09:00:00Z',
    likes: 184
  },
  {
    id: 'proj-002',
    title: 'NeuroProsthetic — Low-Cost Bionic Hand with EMG & Haptic Feedback',
    problemStatement: 'Advanced myoelectric prosthetic hands cost over ₹8-15 Lakhs, making them inaccessible for 95% of Indian amputees. Existing low-cost models lack fine dexterity and touch sensation.',
    proposedSolution: '3D-printed lightweight prosthetic hand using flexible tendon-drive mechanisms, 8-channel dry EMG pattern recognition on STM32 Microcontroller, and vibrotactile fingertip feedback.',
    domain: 'Healthcare & Biomedical',
    technologies: ['Biomedical Signal Processing', 'STM32', 'TensorFlow Lite for Micro', 'SolidWorks', '3D Printing TPU/PLA'],
    requiredSkills: ['Biomechatronics', 'Bio-Signal Processing', 'Embedded Systems', 'Clinical Validation'],
    teamMembersCount: 4,
    institution: 'IIT Madras & AIIMS Delhi Collaborative Hub',
    mentor: 'Dr. Anita Kulkarni',
    mentorTitle: 'Medical AI Specialist, AIIMS Delhi',
    status: 'Testing',
    progressPercent: 85,
    githubUrl: 'https://github.com/campuslink-org/neuro-prosthetic',
    demoUrl: 'https://neuroprosthetic.campuslink.network',
    papersCount: 3,
    milestones: [],
    tasks: [],
    createdAt: '2025-11-15T11:20:00Z',
    likes: 245
  },
  {
    id: 'proj-003',
    title: 'VoltPulse — Smart Community EV Microgrid Dynamic Load Balancer',
    problemStatement: 'Uncoordinated charging of electric 2-wheelers and 3-wheelers in urban apartment complexes causes transformer overload, phase imbalance, and blackout risks.',
    proposedSolution: 'Edge IoT controller retrofitted to distribution boards that negotiates charge rates dynamically based on solar generation, grid tariff, and battery degradation models.',
    domain: 'Clean Energy & Smart Grid',
    technologies: ['Rust', 'MQTT', 'Modbus TCP', 'Time-Series Forecasting', 'React Dashboard', 'Grafana'],
    requiredSkills: ['Power Systems', 'Firmware', 'Cloud Streaming', 'UI/UX'],
    teamMembersCount: 5,
    institution: 'Delhi Technological University (DTU)',
    mentor: 'Dr. Meenakshi Sundaram',
    mentorTitle: 'Associate Professor, IIT Madras',
    status: 'Development',
    progressPercent: 62,
    githubUrl: 'https://github.com/campuslink-org/voltpulse-grid',
    demoUrl: 'https://voltpulse.campuslink.network',
    papersCount: 1,
    milestones: [],
    tasks: [],
    createdAt: '2025-12-01T15:45:00Z',
    likes: 132
  },
  {
    id: 'proj-004',
    title: 'AeroShield — Counter-UAV Acoustic & RF Direction Finder',
    problemStatement: 'Low-flying unauthorized consumer drones pose critical safety threats around airports, refinery facilities, and public stadiums. Radar fails at ultra-low altitudes due to ground clutter.',
    proposedSolution: 'Passive microphone phased array + SDR RF fingerprinting network providing 360° drone triangulation within 800m with zero RF emission signature.',
    domain: 'Defense & Aerospace',
    technologies: ['Software Defined Radio (GNU Radio)', 'Acoustic Beamforming', 'FPGA', 'C++', 'Python'],
    requiredSkills: ['RF Engineering', 'Signal Processing', 'Acoustics', 'Embedded Linux'],
    teamMembersCount: 4,
    institution: 'IIT Bombay & VJTI Mumbai',
    mentor: 'Prof. Rajeshwar Sharma',
    mentorTitle: 'Professor of Robotics, DTU',
    status: 'Prototype',
    progressPercent: 70,
    githubUrl: 'https://github.com/campuslink-org/aeroshield-rf',
    demoUrl: 'https://aeroshield.campuslink.network',
    papersCount: 2,
    milestones: [],
    tasks: [],
    createdAt: '2026-01-05T08:30:00Z',
    likes: 219
  }
];

export const MOCK_EVENTS: EventItem[] = [
  {
    id: 'evt-sih-2026',
    title: 'Smart India Hackathon (SIH) 2026 — Hardware & Software Edition',
    organizer: 'Ministry of Education & AICTE, Govt. of India',
    organizerType: 'government',
    eventType: 'Government Challenge',
    date: 'April 18 - 20, 2026',
    venue: 'National Nodal Centers (Hybrid & Offline Finals)',
    mode: 'Hybrid',
    description: "World's biggest open innovation model for students to solve real-world challenges formulated by Central Ministries, State Governments, and Premier National Enterprises.",
    rules: [
      'Team size must be exactly 6 members with mandatory cross-discipline gender representation.',
      'All team members must be verified bonafide students with valid institutional credentials on CampusLink.',
      'Projects must provide working hardware or software prototypes during the 36-hour continuous hackathon.'
    ],
    tracks: [
      'Smart Agriculture & Food Technology',
      'Clean & Green Energy Technologies',
      'Healthcare, Biomedical Devices & MedTech',
      'Smart Automation, Robotics & Drones',
      'Cybersecurity & Zero Trust Infrastructure',
      'Disaster Management & Heritage Preservation'
    ],
    prizes: [
      { rank: '1st Prize (Ministry Track Winner)', amount: '₹1,00,000 / Problem Statement', description: 'National Trophy + AICTE Incubation Grant + Ministry Pilot Deployment' },
      { rank: '1st Runner Up', amount: '₹75,000', description: 'Incubation Support & Hardware Grant' },
      { rank: '2nd Runner Up', amount: '₹50,000', description: 'Tech Mentorship & Cloud Credits' }
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    registeredTeamsCount: 1480,
    maxTeamSize: 6,
    deadline: '2026-03-30',
    attendanceWindow: {
      start: '2026-04-18T08:00:00Z',
      end: '2026-04-18T12:00:00Z',
      targetLat: 12.9716, // Bangalore Nodal Center
      targetLng: 77.5946,
      allowedRadiusMeters: 500
    },
    submissionRequirements: [
      'Working GitHub Repository URL',
      '3-Minute Demonstration Video (HD)',
      'Technical Architecture Document (PDF)',
      'Hardware BOM & Schematic (if hardware track)',
      'Mentor Evaluation Sign-off'
    ],
    isRegistered: true
  },
  {
    id: 'evt-univ-energy-2026',
    title: 'National Clean Energy & Mobility Innovation Ideathon',
    organizer: 'Indian Institute of Technology Madras (IITM Energy Consortium)',
    organizerType: 'university',
    eventType: 'Ideathon',
    date: 'May 04 - 06, 2026',
    venue: 'IITM Research Park, Chennai',
    mode: 'Offline',
    description: 'Inter-collegiate challenge seeking breakthroughs in high-temperature battery chemistries, grid-tied solar microinverters, and hydrogen fuel-cell auxiliary controllers.',
    rules: [
      'Open to undergraduate, postgraduate, and PhD scholars.',
      'Teams of 3 to 5 members with at least one Electrical/Mechanical student.'
    ],
    tracks: ['Battery Management Systems (BMS)', 'Renewable Microgrids', 'Hydrogen Electrolyzer Optimization'],
    prizes: [
      { rank: 'Grand Champion', amount: '₹2,50,000', description: 'IITM Incubation Entry + Prototype Seed Funding' },
      { rank: 'Innovation Excellence', amount: '₹1,00,000', description: 'Mentorship with Industry Consortium Leaders' }
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&auto=format&fit=crop&q=80',
    registeredTeamsCount: 420,
    maxTeamSize: 5,
    deadline: '2026-04-20',
    attendanceWindow: {
      start: '2026-05-04T08:30:00Z',
      end: '2026-05-04T11:00:00Z',
      targetLat: 12.9915,
      targetLng: 80.2337,
      allowedRadiusMeters: 400
    },
    submissionRequirements: ['Simulation Model (MATLAB / Ansys)', 'Technical Whitepaper', 'BOM Estimation'],
    isRegistered: false
  },
  {
    id: 'evt-health-symp-2026',
    title: 'AIIMS-IIT Interdisciplinary HealthTech Research Symposium',
    organizer: 'AIIMS Delhi & IIT Delhi Joint Biomedical School',
    organizerType: 'research',
    eventType: 'Research Symposium',
    date: 'May 22 - 24, 2026',
    venue: 'Jawaharlal Auditorium, AIIMS New Delhi',
    mode: 'Hybrid',
    description: 'Translational symposium bringing medical clinicians together with machine learning and biomedical engineering students to co-author papers and patent diagnostic inventions.',
    rules: [
      'Papers must present novel computational or sensor methodologies with IRB / ethical clearance disclosures.',
      'Presenters must be students or young researchers under 32 years.'
    ],
    tracks: ['Point-of-Care Diagnostics', 'Medical Computer Vision', 'Bio-telemetry Wearables', 'Clinical Decision Support'],
    prizes: [
      { rank: 'Best Research Paper', amount: '₹1,50,000', description: 'Springer Nature Open-Access APC Waiver + Travel Grant' },
      { rank: 'Best Clinical Prototype', amount: '₹1,00,000', description: 'AIIMS Clinical Trial Fast-Track' }
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    registeredTeamsCount: 290,
    maxTeamSize: 4,
    deadline: '2026-04-30',
    attendanceWindow: {
      start: '2026-05-22T09:00:00Z',
      end: '2026-05-22T13:00:00Z',
      targetLat: 28.5672,
      targetLng: 77.2100,
      allowedRadiusMeters: 600
    },
    submissionRequirements: ['Full Manuscript (IEEE Template)', 'Anonymized Dataset Sample', 'Video Presentation'],
    isRegistered: false
  }
];

export const MOCK_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-001',
    certificateNumber: 'CL-2025-SIH-99214',
    recipientName: 'Aarav Sharma',
    recipientRole: 'Winner',
    eventTitle: 'Smart India Ideathon 2025 (Ministry of Agriculture)',
    eventOrganizer: 'AICTE & Ministry of Education, Govt of India',
    issueDate: 'December 15, 2025',
    qrCodeData: 'https://campuslink.network/verify/CL-2025-SIH-99214',
    rank: '1st Place — National Winner (Precision Agriculture Track)',
    verified: true,
    institution: 'National Institute of Technology Karnataka (NITK)'
  },
  {
    id: 'cert-002',
    certificateNumber: 'CL-2025-IITB-04122',
    recipientName: 'Aarav Sharma',
    recipientRole: 'Participant',
    eventTitle: 'IIT Bombay Techfest Autonomous Drone Challenge',
    eventOrganizer: 'IIT Bombay Technical Affairs',
    issueDate: 'January 05, 2026',
    qrCodeData: 'https://campuslink.network/verify/CL-2025-IITB-04122',
    rank: 'Top 10 Finalist',
    verified: true,
    institution: 'NITK Surathkal'
  }
];

export const MOCK_PUBLICATIONS: ResearchPublication[] = [
  {
    id: 'pub-001',
    title: 'Sub-30ms Foliar Blight Detection on Ultra-Low-Power Edge Hardware using Quantized Neural Attentions',
    authors: ['Aarav Sharma', 'Dr. Arvind Rao', 'Dr. Sneha Paul', 'Pooja Iyer'],
    journal: 'IEEE Transactions on Agri-Food Electronics & Edge Intelligence',
    year: 2026,
    doi: '10.1109/TAGRI.2026.3489211',
    abstract: 'This paper proposes a mixed-precision 4-bit/8-bit attention network designed for real-time foliar disease localization deployed directly on 15W edge compute modules mounted on autonomous agricultural micro-UAVs.',
    datasetLink: 'https://campuslink.network/datasets/agrivision-crop-2026',
    tags: ['Edge AI', 'TensorRT', 'Agronomy', 'Computer Vision'],
    citations: 18,
    collabOpen: true
  },
  {
    id: 'pub-002',
    title: 'Decentralized Zero-Knowledge Provenance for Clinical Multi-Site Medical Image Studies',
    authors: ['Kavya Ramanathan (PhD)', 'Dr. Anita Kulkarni', 'Prof. C. Bhattacharyya'],
    journal: 'Nature Digital Medicine (Preprint)',
    year: 2025,
    doi: '10.1038/s41746-025-01429-x',
    abstract: 'We introduce a federated zk-SNARK consensus framework enabling tertiary hospitals to collaboratively audit diagnostic CT classification weights without transmitting raw patient DICOM slices.',
    datasetLink: 'https://campuslink.network/datasets/zk-med-federated',
    tags: ['Zero Knowledge', 'Federated Learning', 'Medical Imaging', 'Privacy'],
    citations: 42,
    collabOpen: true
  }
];

export const MOCK_STORIES: CampusStory[] = [
  {
    id: 'sty-001',
    title: 'Autonomous Drone Flight Test: Real-time YOLOv11 Pest Detection in Field 🌾🚁',
    creatorName: 'Aarav Sharma & Team AgriVision',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    creatorDept: 'AI & Data Engineering',
    creatorCollege: 'NITK Surathkal',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500&auto=format&fit=crop&q=80',
    category: 'Project',
    likesCount: 528,
    commentsCount: 46,
    duration: '0:48',
    isLiked: true,
    tags: ['DroneAI', 'PrecisionAgri', 'HardwareTest', 'NITK']
  },
  {
    id: 'sty-002',
    title: 'Testing 3D-Printed Tendon Bionic Arm with Patient EMG Signals 🦾⚡',
    creatorName: 'Vikramaditya Deshmukh',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    creatorDept: 'Mechatronics',
    creatorCollege: 'VJTI Mumbai',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80',
    category: 'Research',
    likesCount: 890,
    commentsCount: 92,
    duration: '0:55',
    isLiked: false,
    tags: ['Bionics', 'Prosthetics', 'Biomedical', 'VJTI']
  },
  {
    id: 'sty-003',
    title: 'Smart India Hackathon 36-Hour Midnight Sprint Moments! ☕💡',
    creatorName: 'Ananya Roy',
    creatorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    creatorDept: 'Interaction Design',
    creatorCollege: 'NID Ahmedabad',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=80',
    category: 'Hackathon',
    likesCount: 1240,
    commentsCount: 114,
    duration: '0:42',
    isLiked: true,
    tags: ['SIH2026', 'HackathonLife', 'DesignSprint']
  }
];

export const MOCK_ASK_QUESTIONS: AskQuestion[] = [
  {
    id: 'q-001',
    title: 'How to eliminate ROS2 Nav2 waypoint oscillation when operating UAV with payload weight shifts?',
    body: 'We are deploying a 6-rotor drone with a targeted liquid spray mechanism. When the liquid payload decreases from 3L to 1L during flight, the center of gravity shifts and the Nav2 local planner exhibits ±0.8m altitude oscillatory hunting. What is the optimal method to dynamically feed dynamic mass changes into the PID controller?',
    authorName: 'Vikramaditya Deshmukh',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    authorRole: 'Student (Mechatronics)',
    authorCollege: 'VJTI Mumbai',
    tags: ['ROS2', 'UAV-Dynamics', 'Robotics', 'PID-Tuning'],
    upvotes: 38,
    answersCount: 2,
    hasAcceptedAnswer: true,
    createdAt: '2026-02-14T11:30:00Z',
    isUpvoted: false,
    answers: [
      {
        id: 'ans-001',
        authorName: 'Prof. Rajeshwar Sharma',
        authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        authorRole: 'Verified Mentor & UAV Specialist',
        authorBadge: 'Verified Mentor',
        body: 'You should implement an Adaptive Gain Scheduling filter or an Extended Kalman Filter (EKF) mass estimator. Hook a flow sensor on the discharge tube to output pulses directly into your PX4 controller custom uORB topic. When flow rate intégrates mass consumed, recalculate the inertia tensor matrix in the dynamic controller instead of relying on fixed static PID gains.',
        upvotes: 45,
        isAccepted: true,
        createdAt: '2026-02-14T14:15:00Z'
      }
    ]
  },
  {
    id: 'q-002',
    title: 'Best approach for INT8 quantization calibration of YOLOv11 on NVIDIA Jetson Orin with TensorRT?',
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
    description: 'Dr. Arvind Rao (IIT Bombay) has officially accepted to mentor Team AgriVision AI for SIH 2026.',
    type: 'mentor',
    timestamp: '2 hours ago',
    read: false,
    linkAction: 'workspace'
  },
  {
    id: 'notif-002',
    title: 'New Milestone Review Feedback',
    description: 'Mentor posted guidance on Milestone #3: Model Training & Jetson TensorRT Deployment.',
    type: 'mentor',
    timestamp: '5 hours ago',
    read: false,
    linkAction: 'workspace'
  },
  {
    id: 'notif-003',
    title: 'SIH 2026 Attendance Window Announced',
    description: 'Verified GPS & Camera attendance window will open on April 18, 08:00 AM at your assigned nodal center.',
    type: 'event',
    timestamp: '1 day ago',
    read: true,
    linkAction: 'events'
  },
  {
    id: 'notif-004',
    title: 'Digital Certificate Issued',
    description: 'Your verified certificate for Smart India Ideathon 2025 is ready for QR verification & download.',
    type: 'certificate',
    timestamp: '3 days ago',
    read: true,
    linkAction: 'portfolio'
  }
];

export const MOCK_INSTITUTIONS_LIST = [
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
