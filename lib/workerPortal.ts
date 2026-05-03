export type WorkerOnboardingStepKey =
  | "profile"
  | "kyc"
  | "photo"
  | "bank"
  | "location"
  | "assignment";

export type WorkerDashboardActionKey =
  | "ACCEPT"
  | "SHARE_LOCATION"
  | "ON_THE_WAY"
  | "ARRIVED"
  | "IN_PROGRESS"
  | "COMPLETED";

export type WorkerBankBranch = {
  bank: string;
  state: string;
  city: string;
  branch: string;
  ifsc: string;
};

export const workerOnboardingSteps: Array<{
  key: WorkerOnboardingStepKey;
  title: string;
  shortTitle: string;
  description: string;
}> = [
  {
    key: "profile",
    title: "Worker profile",
    shortTitle: "Profile",
    description: "Name, phone, service skills, and work zone.",
  },
  {
    key: "kyc",
    title: "Government KYC",
    shortTitle: "KYC",
    description: "DigiLocker Aadhaar and PAN consent-based verification.",
  },
  {
    key: "photo",
    title: "Photo capture",
    shortTitle: "Photo",
    description: "Camera photo or upload for field identity.",
  },
  {
    key: "bank",
    title: "Bank details",
    shortTitle: "Bank",
    description: "Bank name, account number, IFSC search, and validation.",
  },
  {
    key: "location",
    title: "Live location",
    shortTitle: "Location",
    description: "Current coordinates for nearest-job assignment.",
  },
  {
    key: "assignment",
    title: "Booking configuration",
    shortTitle: "Booking",
    description: "Worker ID, reference number, contact, and job steps.",
  },
];

export const workerServiceOptions = [
  "Home Cleaning",
  "Electrician",
  "Plumbing",
  "AC Service",
  "Appliance Repair",
  "Fan Installation",
  "Painting",
  "Carpentry",
  "Pest Control",
  "Water Purifier",
  "Home Inspection",
  "Furniture Assembly",
];

export const workerCityOptions = [
  "Bengaluru",
  "Kolkata",
  "Mumbai",
  "Delhi NCR",
  "Hyderabad",
  "Chennai",
  "Pune",
];

export const indianStateOptions = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Delhi",
  "Gujarat",
  "Haryana",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "West Bengal",
];

export const indianBankOptions = [
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Punjab National Bank",
  "Bank of Baroda",
  "Canara Bank",
  "Union Bank of India",
  "Kotak Mahindra Bank",
  "IndusInd Bank",
  "Yes Bank",
  "IDFC FIRST Bank",
  "Federal Bank",
  "Indian Bank",
  "Indian Overseas Bank",
  "UCO Bank",
  "Bank of India",
  "Central Bank of India",
  "IDBI Bank",
  "RBL Bank",
  "Bandhan Bank",
  "AU Small Finance Bank",
  "Karur Vysya Bank",
  "City Union Bank",
  "South Indian Bank",
  "Tamilnad Mercantile Bank",
  "Karnataka Bank",
  "DCB Bank",
  "Jammu and Kashmir Bank",
  "Punjab and Sind Bank",
];

export const knownIfscBranches: WorkerBankBranch[] = [
  {
    bank: "State Bank of India",
    state: "West Bengal",
    city: "Kolkata",
    branch: "Park Street",
    ifsc: "SBIN0001500",
  },
  {
    bank: "HDFC Bank",
    state: "West Bengal",
    city: "Kolkata",
    branch: "Salt Lake Sector V",
    ifsc: "HDFC0000041",
  },
  {
    bank: "ICICI Bank",
    state: "West Bengal",
    city: "Kolkata",
    branch: "Ballygunge",
    ifsc: "ICIC0000006",
  },
  {
    bank: "Axis Bank",
    state: "Karnataka",
    city: "Bengaluru",
    branch: "Indiranagar",
    ifsc: "UTIB0000139",
  },
  {
    bank: "HDFC Bank",
    state: "Karnataka",
    city: "Bengaluru",
    branch: "Koramangala",
    ifsc: "HDFC0000053",
  },
  {
    bank: "ICICI Bank",
    state: "Karnataka",
    city: "Bengaluru",
    branch: "MG Road",
    ifsc: "ICIC0000002",
  },
  {
    bank: "State Bank of India",
    state: "Maharashtra",
    city: "Mumbai",
    branch: "Fort",
    ifsc: "SBIN0000300",
  },
  {
    bank: "HDFC Bank",
    state: "Maharashtra",
    city: "Mumbai",
    branch: "Andheri East",
    ifsc: "HDFC0000240",
  },
  {
    bank: "Axis Bank",
    state: "Maharashtra",
    city: "Mumbai",
    branch: "Bandra West",
    ifsc: "UTIB0000230",
  },
  {
    bank: "Punjab National Bank",
    state: "Delhi",
    city: "Delhi NCR",
    branch: "Connaught Place",
    ifsc: "PUNB0011200",
  },
  {
    bank: "State Bank of India",
    state: "Delhi",
    city: "Delhi NCR",
    branch: "Connaught Circus",
    ifsc: "SBIN0000691",
  },
  {
    bank: "ICICI Bank",
    state: "Telangana",
    city: "Hyderabad",
    branch: "Banjara Hills",
    ifsc: "ICIC0000008",
  },
  {
    bank: "HDFC Bank",
    state: "Telangana",
    city: "Hyderabad",
    branch: "Hitech City",
    ifsc: "HDFC0001999",
  },
  {
    bank: "Indian Bank",
    state: "Tamil Nadu",
    city: "Chennai",
    branch: "T Nagar",
    ifsc: "IDIB000T001",
  },
  {
    bank: "HDFC Bank",
    state: "Tamil Nadu",
    city: "Chennai",
    branch: "Anna Nagar",
    ifsc: "HDFC0001860",
  },
  {
    bank: "Bank of Baroda",
    state: "Maharashtra",
    city: "Pune",
    branch: "Shivajinagar",
    ifsc: "BARB0SHIVAJ",
  },
  {
    bank: "Axis Bank",
    state: "Maharashtra",
    city: "Pune",
    branch: "Kalyani Nagar",
    ifsc: "UTIB0001057",
  },
];

export const workerBookingFlow = [
  {
    key: "BOOKED",
    title: "Customer booking received",
    description: "Booking ID and reference number are generated after checkout.",
  },
  {
    key: "TECHNICIAN_ASSIGNED",
    title: "Verified worker matched",
    description: "Only active KYC-verified workers are considered for assignment.",
  },
  {
    key: "WORKER_CONFIRMED",
    title: "Worker accepts appointment",
    description: "Worker confirms job, customer details, slot, and service scope.",
  },
  {
    key: "LOCATION_SHARED",
    title: "Live location shared",
    description: "Worker location is attached to the booking for tracking.",
  },
  {
    key: "ON_THE_WAY",
    title: "Worker on the way",
    description: "Customer and operations can see ETA and contact number.",
  },
  {
    key: "ARRIVED",
    title: "Arrived at customer location",
    description: "Worker confirms arrival before starting work.",
  },
  {
    key: "IN_PROGRESS",
    title: "Service in progress",
    description: "Photos, notes, and material updates can be attached.",
  },
  {
    key: "COMPLETED",
    title: "Service completed",
    description: "Completion, payment settlement, and rating close the booking.",
  },
];

export const workerDashboardActions: Array<{
  key: WorkerDashboardActionKey;
  label: string;
  description: string;
}> = [
  {
    key: "ACCEPT",
    label: "Accept appointment",
    description: "Acknowledge the assigned booking and confirm the visit window.",
  },
  {
    key: "SHARE_LOCATION",
    label: "Share live location",
    description: "Push the latest worker coordinates to customer and operations.",
  },
  {
    key: "ON_THE_WAY",
    label: "Mark on the way",
    description: "Update the booking once travel to the customer has started.",
  },
  {
    key: "ARRIVED",
    label: "Mark arrived",
    description: "Confirm arrival at the service location before starting work.",
  },
  {
    key: "IN_PROGRESS",
    label: "Start work",
    description: "Move the booking into active service progress.",
  },
  {
    key: "COMPLETED",
    label: "Complete booking",
    description: "Finish the task and close the appointment lifecycle.",
  },
];

export function normalizeWorkerSearch(value: string) {
  return value.trim().toLowerCase();
}
