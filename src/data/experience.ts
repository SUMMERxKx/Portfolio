export type ExperienceEntry = {
  company: string;
  title: string;
  duration: string;
  location: string;
  logo: string;
  highlights: string[];
};

export const experienceData: ExperienceEntry[] = [
  {
    company: 'WorkSafeBC',
    title: 'Technical Analyst (Co-op)',
    duration: 'Sep 2025 – Present · 3 mos',
    location: 'Richmond, BC · Hybrid',
    logo: '/worksafe.jpeg',
    highlights: [
      'Manage and govern SharePoint Online sites across departments',
      'Oversee permissions, Power Apps/Automate workflows, and site migrations',
      'Collaborate with business units to modernize legacy content',
      'Operate within Agile sprints on enterprise-scale digital solutions',
    ],
  },
  {
    company: 'Thompson Rivers University',
    title: 'Web Developer (Co-op)',
    duration: 'May 2025 – Aug 2025 · 4 mos',
    location: 'Kamloops, BC · On-site',
    logo: '/thompson_rivers_university_logo.jpeg',
    highlights: [
      'Supported WordPress and Pressbooks OER platforms',
      'Created and maintained accessible learning materials for faculty',
      'Authored documentation and step-by-step technical guides',
      'Delivered live support sessions for faculty and staff',
    ],
  },
  {
    company: 'Thompson Rivers University',
    title: 'Media Analyst (Co-op)',
    duration: 'Jan 2025 – Apr 2025 · 4 mos',
    location: 'Kamloops, BC · On-site',
    logo: '/thompson_rivers_university_logo.jpeg',
    highlights: [
      'Audited 300+ classroom A/V systems and reconciled inventory',
      'Cleaned and normalized 2,000+ Excel data rows for asset tracking',
      'Documented standards, cutting resolution time by ~20%',
      'Delivered real-time classroom support with 95% satisfaction',
    ],
  },
  {
    company: 'TRU WolfPack',
    title: 'Camera Operator (Part-time Contract)',
    duration: 'Aug 2024 – Apr 2025 · 9 mos',
    location: 'Kamloops, BC · On-site',
    logo: '/wolfpack.png',
    highlights: [
      'Filmed live sports events including soccer, basketball, and volleyball',
      'Worked with production teams to ensure high-quality event footage',
      'Developed strong understanding of live broadcasting workflows',
    ],
  },
  {
    company: 'Club Demonstration Services',
    title: 'Sales Marketing Advisor (Permanent Part-time)',
    duration: 'Nov 2022 – Aug 2025 · 2 yrs 10 mos',
    location: 'Kamloops, BC · On-site',
    logo: '/club_demonstration_services_logo.jpeg',
    highlights: [
      'Delivered engaging product demonstrations and marketing events',
      'Trained new team members and maintained in-store engagement quality',
      'Built communication and customer service skills in a fast-paced environment',
    ],
  },
  {
    company: 'Tim Hortons',
    title: 'Crew Member (Permanent Part-time)',
    duration: 'Sep 2022 – Nov 2022 · 3 mos',
    location: 'Kamloops, BC · On-site',
    logo: '/tims.jpeg',
    highlights: [
      'Ensured daily operations and customer satisfaction',
      'Balanced teamwork and multitasking in a high-volume environment',
      'Developed strong communication and service experience',
    ],
  },
];


