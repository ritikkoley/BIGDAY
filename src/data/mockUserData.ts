// Mock user data for testing the admin user management system
// 500 realistic records with proper distribution

export interface MockUserRecord {
  full_name: string;
  residential_address: string;
  contact_number: string;
  email: string;
  admission_number?: string;
  employee_id?: string;
  date_of_admission?: string;
  date_of_joining?: string;
  current_standard?: string;
  section?: string;
  parent_guardian_name?: string;
  parent_contact_number?: string;
  emergency_contact?: string;
  accommodation_type: 'day_boarder' | 'hosteller';
  peer_group: 'pre_primary' | 'primary' | 'secondary' | 'higher_secondary' | 'staff';
  role: 'student' | 'teacher' | 'admin' | 'staff';
  department?: string;
  designation?: string;
  blood_group?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  nationality?: string;
  religion?: string;
  caste_category?: string;
  status: 'active' | 'inactive' | 'suspended' | 'graduated' | 'transferred';
}

// Helper functions for generating realistic data
const firstNames = {
  male: [
    'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
    'Shaurya', 'Atharv', 'Advik', 'Pranav', 'Rishabh', 'Aryan', 'Kabir', 'Ansh', 'Kiaan', 'Rudra',
    'Priyanshu', 'Shivansh', 'Yuvraj', 'Daksh', 'Om', 'Divyansh', 'Harsh', 'Karthik', 'Arnav', 'Ryan',
    'Devansh', 'Ayush', 'Veer', 'Arush', 'Shlok', 'Agastya', 'Dhruv', 'Samarth', 'Tanish', 'Krish',
    'Raghav', 'Aarush', 'Tejas', 'Moksh', 'Jivika', 'Advait', 'Hriday', 'Rishit', 'Vedant', 'Aadhya'
  ],
  female: [
    'Saanvi', 'Aadhya', 'Kiara', 'Diya', 'Pihu', 'Prisha', 'Ananya', 'Fatima', 'Anika', 'Kavya',
    'Aradhya', 'Ira', 'Myra', 'Sara', 'Pari', 'Avni', 'Riya', 'Siya', 'Nisha', 'Khushi',
    'Ishita', 'Tara', 'Zara', 'Aditi', 'Ahana', 'Kashvi', 'Shanaya', 'Navya', 'Drishti', 'Vanya',
    'Anvi', 'Samara', 'Larisa', 'Kimaya', 'Arya', 'Palak', 'Ritika', 'Asmi', 'Tanvi', 'Mahika',
    'Samaira', 'Tvisha', 'Kaveri', 'Mishka', 'Rhea', 'Sia', 'Mysha', 'Inaya', 'Reet', 'Avika'
  ]
};

const lastNames = [
  'Sharma', 'Verma', 'Singh', 'Kumar', 'Gupta', 'Agarwal', 'Jain', 'Bansal', 'Srivastava', 'Tiwari',
  'Mishra', 'Pandey', 'Yadav', 'Saxena', 'Arora', 'Malhotra', 'Kapoor', 'Chopra', 'Bhatia', 'Sethi',
  'Khanna', 'Goel', 'Mittal', 'Joshi', 'Nair', 'Iyer', 'Reddy', 'Rao', 'Patel', 'Shah',
  'Mehta', 'Desai', 'Modi', 'Thakur', 'Chauhan', 'Rajput', 'Bisht', 'Rawat', 'Negi', 'Bhatt',
  'Jangir', 'Sokhey', 'Koley', 'Dubey', 'Tripathi', 'Shukla', 'Chandra', 'Bhardwaj', 'Agnihotri', 'Dixit'
];

const cities = [
  'Bhilai', 'Raipur', 'Durg', 'Bilaspur', 'Korba', 'Rajnandgaon', 'Raigarh', 'Jagdalpur', 'Ambikapur', 'Dhamtari',
  'Mahasamund', 'Kanker', 'Champa', 'Janjgir', 'Sakti', 'Mungeli', 'Bemetara', 'Balod', 'Gariaband', 'Jashpur'
];

const streets = [
  'MG Road', 'Station Road', 'Civil Lines', 'Nehru Nagar', 'Gandhi Chowk', 'Sector 1', 'Sector 2', 'Sector 3',
  'Supela', 'Risali', 'Smriti Nagar', 'Vaishali Nagar', 'Hudco', 'Power House', 'Junwani', 'Khursipar',
  'Durg Road', 'Raipur Road', 'Old Bhilai', 'New Bhilai', 'Steel Plant Area', 'Township', 'Civic Center'
];

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const religions = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other'];
const castes = ['General', 'OBC', 'SC', 'ST', 'EWS'];
const departments = ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 'Computer Science', 'Physical Education', 'Arts', 'Administration'];
const designations = ['Principal', 'Vice Principal', 'Head Teacher', 'Senior Teacher', 'Teacher', 'Assistant Teacher', 'Lab Assistant', 'Librarian', 'Clerk', 'Peon'];

// Generate random date within range
const getRandomDate = (startYear: number, endYear: number): string => {
  const start = new Date(startYear, 0, 1);
  const end = new Date(endYear, 11, 31);
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(randomTime).toISOString().split('T')[0];
};

// Generate random phone number
const getRandomPhone = (): string => {
  const prefixes = ['98', '99', '97', '96', '95', '94', '93', '92', '91', '90'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const remaining = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
  return prefix + remaining;
};

// Generate admission number
const getAdmissionNumber = (index: number): string => {
  return `ADM${(index + 1).toString().padStart(4, '0')}`;
};

// Generate employee ID
const getEmployeeId = (index: number): string => {
  return `EMP${(index + 1).toString().padStart(4, '0')}`;
};

// Generate email
const generateEmail = (name: string, role: string): string => {
  const cleanName = name.toLowerCase().replace(/\s+/g, '.');
  const domain = role === 'student' ? 'student.dpsb.edu' : 'dpsb.edu';
  return `${cleanName}@${domain}`;
};

// Generate realistic user data
export const generateMockUsers = (): MockUserRecord[] => {
  const users: MockUserRecord[] = [];
  let studentCount = 0;
  let teacherCount = 0;
  let staffCount = 0;
  let adminCount = 0;

  for (let i = 0; i < 500; i++) {
    let role: 'student' | 'teacher' | 'admin' | 'staff';
    
    // Distribute roles: 400 students, 60 teachers, 25 staff, 15 admin
    if (studentCount < 400) {
      role = 'student';
      studentCount++;
    } else if (teacherCount < 60) {
      role = 'teacher';
      teacherCount++;
    } else if (staffCount < 25) {
      role = 'staff';
      staffCount++;
    } else {
      role = 'admin';
      adminCount++;
    }

    const gender = Math.random() > 0.5 ? 'male' : 'female';
    const firstName = firstNames[gender][Math.floor(Math.random() * firstNames[gender].length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${firstName} ${lastName}`;
    
    const street = streets[Math.floor(Math.random() * streets.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const houseNumber = Math.floor(Math.random() * 999) + 1;
    const address = `${houseNumber}, ${street}, ${city}, Chhattisgarh, India`;

    // Generate parent name (sometimes same last name for siblings)
    const parentFirstName = gender === 'male' ? 
      firstNames.male[Math.floor(Math.random() * firstNames.male.length)] :
      firstNames.female[Math.floor(Math.random() * firstNames.female.length)];
    const parentName = `${parentFirstName} ${lastName}`;

    let currentStandard: string | undefined;
    let section: string | undefined;
    let peerGroup: 'pre_primary' | 'primary' | 'secondary' | 'higher_secondary' | 'staff';
    let accommodationType: 'day_boarder' | 'hosteller';
    let admissionNumber: string | undefined;
    let employeeId: string | undefined;
    let dateOfAdmission: string | undefined;
    let dateOfJoining: string | undefined;
    let department: string | undefined;
    let designation: string | undefined;

    if (role === 'student') {
      // Student-specific data
      const standards = ['Nursery', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
      currentStandard = standards[Math.floor(Math.random() * standards.length)];
      section = ['A', 'B', 'C', 'D', 'E'][Math.floor(Math.random() * 5)];
      
      // Determine peer group based on standard
      if (['Nursery', 'LKG', 'UKG'].includes(currentStandard)) {
        peerGroup = 'pre_primary';
      } else if (['1', '2', '3', '4', '5'].includes(currentStandard)) {
        peerGroup = 'primary';
      } else if (['6', '7', '8', '9', '10'].includes(currentStandard)) {
        peerGroup = 'secondary';
      } else {
        peerGroup = 'higher_secondary';
      }
      
      accommodationType = Math.random() > 0.7 ? 'hosteller' : 'day_boarder';
      admissionNumber = getAdmissionNumber(studentCount - 1);
      dateOfAdmission = getRandomDate(2019, 2024);
    } else {
      // Staff/Teacher/Admin data
      peerGroup = 'staff';
      accommodationType = 'day_boarder'; // Staff typically don't stay in hostels
      employeeId = getEmployeeId(i - studentCount);
      dateOfJoining = getRandomDate(2015, 2024);
      department = departments[Math.floor(Math.random() * departments.length)];
      designation = designations[Math.floor(Math.random() * designations.length)];
    }

    const user: MockUserRecord = {
      full_name: fullName,
      residential_address: address,
      contact_number: getRandomPhone(),
      email: generateEmail(fullName, role),
      admission_number: admissionNumber,
      employee_id: employeeId,
      date_of_admission: dateOfAdmission,
      date_of_joining: dateOfJoining,
      current_standard: currentStandard,
      section: section,
      parent_guardian_name: role === 'student' ? parentName : undefined,
      parent_contact_number: role === 'student' ? getRandomPhone() : undefined,
      emergency_contact: getRandomPhone(),
      accommodation_type: accommodationType,
      peer_group: peerGroup,
      role: role,
      department: department,
      designation: designation,
      blood_group: bloodGroups[Math.floor(Math.random() * bloodGroups.length)],
      date_of_birth: getRandomDate(
        role === 'student' ? 2005 : 1970,
        role === 'student' ? 2018 : 1995
      ),
      gender: gender,
      nationality: 'Indian',
      religion: religions[Math.floor(Math.random() * religions.length)],
      caste_category: castes[Math.floor(Math.random() * castes.length)],
      status: Math.random() > 0.95 ? 
        (['inactive', 'suspended', 'graduated', 'transferred'][Math.floor(Math.random() * 4)] as any) : 
        'active'
    };

    users.push(user);
  }

  return users;
};

// Generate the actual data
export const mockUserData = generateMockUsers();

// Export CSV format for easy viewing
export const generateCSV = (): string => {
  const headers = [
    'Full Name', 'Residential Address', 'Contact Number', 'Email',
    'Admission Number', 'Employee ID', 'Date of Admission', 'Date of Joining',
    'Current Standard', 'Section', 'Parent Guardian Name', 'Parent Contact Number',
    'Emergency Contact', 'Accommodation Type', 'Peer Group', 'Role',
    'Department', 'Designation', 'Blood Group', 'Date of Birth',
    'Gender', 'Nationality', 'Religion', 'Caste Category', 'Status'
  ];

  const csvRows = mockUserData.map(user => [
    `"${user.full_name}"`,
    `"${user.residential_address}"`,
    `"${user.contact_number}"`,
    `"${user.email}"`,
    `"${user.admission_number || ''}"`,
    `"${user.employee_id || ''}"`,
    `"${user.date_of_admission || ''}"`,
    `"${user.date_of_joining || ''}"`,
    `"${user.current_standard || ''}"`,
    `"${user.section || ''}"`,
    `"${user.parent_guardian_name || ''}"`,
    `"${user.parent_contact_number || ''}"`,
    `"${user.emergency_contact || ''}"`,
    `"${user.accommodation_type}"`,
    `"${user.peer_group}"`,
    `"${user.role}"`,
    `"${user.department || ''}"`,
    `"${user.designation || ''}"`,
    `"${user.blood_group || ''}"`,
    `"${user.date_of_birth || ''}"`,
    `"${user.gender || ''}"`,
    `"${user.nationality || ''}"`,
    `"${user.religion || ''}"`,
    `"${user.caste_category || ''}"`,
    `"${user.status}"`
  ]);

  return [headers.join(','), ...csvRows].join('\n');
};

// Statistics for verification
export const getDataStatistics = () => {
  const stats = {
    total: mockUserData.length,
    byRole: mockUserData.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byPeerGroup: mockUserData.reduce((acc, user) => {
      acc[user.peer_group] = (acc[user.peer_group] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byAccommodation: mockUserData.reduce((acc, user) => {
      acc[user.accommodation_type] = (acc[user.accommodation_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byStatus: mockUserData.reduce((acc, user) => {
      acc[user.status] = (acc[user.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byGender: mockUserData.reduce((acc, user) => {
      if (user.gender) acc[user.gender] = (acc[user.gender] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    dateRange: {
      admissions: {
        earliest: Math.min(...mockUserData.filter(u => u.date_of_admission).map(u => new Date(u.date_of_admission!).getTime())),
        latest: Math.max(...mockUserData.filter(u => u.date_of_admission).map(u => new Date(u.date_of_admission!).getTime()))
      },
      joining: {
        earliest: Math.min(...mockUserData.filter(u => u.date_of_joining).map(u => new Date(u.date_of_joining!).getTime())),
        latest: Math.max(...mockUserData.filter(u => u.date_of_joining).map(u => new Date(u.date_of_joining!).getTime()))
      }
    }
  };

  return stats;
};

// Sample data for immediate use (first 20 records)
export const sampleUsers = mockUserData.slice(0, 20);