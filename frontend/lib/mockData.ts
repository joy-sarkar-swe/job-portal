import { Job } from "@/components/JobCard";

export const mockJobTitles = [
  "Senior Frontend Developer",
  "Backend Engineer",
  "Full Stack Developer",
  "UI/UX Designer",
  "DevOps Engineer",
  "Product Manager",
  "Data Scientist",
  "Mobile Developer",
  "Security Engineer",
  "QA Engineer",
  "Software Architect",
  "Cloud Engineer",
];

export const mockCompanies = [
  "Tech Corp",
  "StartUp Inc",
  "Digital Solutions",
  "Creative Agency",
  "Cloud Systems",
  "Innovation Labs",
  "Data Dynamics",
  "Mobile First",
  "Secure Tech",
  "Quality Works",
];

export const mockLocations = [
  "New York, NY",
  "San Francisco, CA",
  "Austin, TX",
  "Los Angeles, CA",
  "Seattle, WA",
  "Boston, MA",
];

export const mockJobTypes = ["Full-time", "Remote", "Part-time", "Contract"];

export const mockDescriptions = [
  "We are seeking a talented professional to join our innovative team. In this role, you will be responsible for developing and maintaining high-quality applications, collaborating with cross-functional teams, and contributing to our technical vision.\n\nKey Responsibilities:\n• Design and implement scalable solutions\n• Write clean, maintainable code\n• Participate in code reviews and technical discussions\n• Mentor junior team members\n• Stay current with industry trends and best practices\n\nRequirements:\n• 5+ years of relevant experience\n• Strong problem-solving skills\n• Excellent communication abilities\n• Bachelor's degree in Computer Science or related field\n• Experience with modern development tools and practices\n\nWe offer a collaborative work environment, competitive compensation, comprehensive benefits, and opportunities for professional growth.",
  "Join our dynamic startup and help shape the future of technology. We're looking for passionate individuals who thrive in fast-paced environments and love solving complex problems.\n\nWhat You'll Do:\n• Build innovative features from the ground up\n• Work closely with product and design teams\n• Optimize application performance\n• Contribute to architectural decisions\n• Help establish engineering best practices\n\nWhat We're Looking For:\n• 3+ years of professional experience\n• Strong technical foundation\n• Self-motivated and proactive\n• Team player with great interpersonal skills\n• Passion for learning and continuous improvement\n\nBenefits include competitive salary, equity options, flexible work arrangements, health insurance, and unlimited PTO.",
  "Exciting opportunity to work on cutting-edge projects with a talented team of professionals. We value innovation, creativity, and a commitment to excellence.\n\nYour Role:\n• Lead technical initiatives and drive project success\n• Collaborate with stakeholders across the organization\n• Implement best practices and coding standards\n• Troubleshoot and resolve technical issues\n• Document systems and processes\n\nIdeal Candidate:\n• 4+ years of industry experience\n• Proven track record of successful project delivery\n• Strong analytical and critical thinking skills\n• Experience with agile methodologies\n• Excellent written and verbal communication\n\nWe provide a supportive work culture, professional development opportunities, competitive benefits package, and work-life balance.",
  "Be part of a mission-driven organization that values diversity, inclusion, and innovation. We're looking for a skilled professional to contribute to meaningful projects that make a real impact.\n\nResponsibilities:\n• Develop and maintain robust applications\n• Participate in the full software development lifecycle\n• Collaborate with remote and distributed teams\n• Ensure code quality through testing and reviews\n• Stay updated with emerging technologies\n\nQualifications:\n• 3-5 years of relevant experience\n• Strong understanding of software engineering principles\n• Ability to work independently and in teams\n• Problem-solving mindset\n• Bachelor's degree or equivalent experience\n\nPerks include remote work options, professional development budget, health and wellness programs, 401(k) matching, and generous vacation policy.",
];

export const mockSalaryRanges = [
  "$80,000 - $120,000",
  "$100,000 - $150,000",
  "$90,000 - $130,000",
  "$70,000 - $110,000",
  "$120,000 - $180,000",
];

export function generateMockJob(id: number): Job {
  const index = (id - 1) % mockJobTitles.length;
  return {
    id,
    title: mockJobTitles[index],
    company: mockCompanies[(id - 1) % mockCompanies.length],
    location: mockLocations[(id - 1) % mockLocations.length],
    jobType: mockJobTypes[(id - 1) % mockJobTypes.length],
    description: mockDescriptions[(id - 1) % mockDescriptions.length],
    salaryRange: mockSalaryRanges[(id - 1) % mockSalaryRanges.length],
  };
}

export function generateMockJobs(count: number, offset: number): Job[] {
  return Array.from({ length: count }, (_, i) =>
    generateMockJob(offset + i + 1)
  );
}

// Mock user authentication
export interface User {
  isLoggedIn: boolean;
  role: "jobseeker" | "employer" | null;
  id: number;
  name?: string;
  email?: string;
}

export function getCurrentUser(): User {
  // TODO: Replace with actual auth logic from your authentication system
  // For now, returning a mock jobseeker user
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("mockUser");
    if (userStr) {
      return JSON.parse(userStr);
    }
  }

  return {
    isLoggedIn: true,
    role: "jobseeker",
    id: 1,
    name: "John Doe",
    email: "john@example.com",
  };
}

// Mock application tracking
export function hasUserApplied(userId: number, jobId: number): boolean {
  // TODO: Replace with actual API call
  if (typeof window !== "undefined") {
    const appliedJobs = localStorage.getItem("appliedJobs");
    if (appliedJobs) {
      const jobs = JSON.parse(appliedJobs);
      return jobs.includes(jobId);
    }
  }
  return false;
}

export function markJobAsApplied(jobId: number): void {
  if (typeof window !== "undefined") {
    const appliedJobs = localStorage.getItem("appliedJobs");
    const jobs = appliedJobs ? JSON.parse(appliedJobs) : [];
    if (!jobs.includes(jobId)) {
      jobs.push(jobId);
      localStorage.setItem("appliedJobs", JSON.stringify(jobs));
    }
  }
}
