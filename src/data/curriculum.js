export const curriculumModules = [
  {
    id: "module-1",
    title: "Module 1: Foundations of Language Teaching & Learning Theories",
    summary:
      "Core principles of second-language acquisition and effective teaching methodologies.",
    topics: [
      "Introduction to second-language acquisition (SLA) theory",
      "Approaches and methods in language teaching",
      "Learner motivation and learning styles",
    ],
  },
  {
    id: "module-2",
    title: "Module 2: Language Skills",
    summary: "Practical techniques for teaching the four core language skills.",
    topics: ["Reading", "Writing", "Listening", "Speaking"],
  },
  {
    id: "module-3",
    title: "Module 3: Language Systems",
    summary: "Building learners' command of the underlying systems of English.",
    topics: ["Grammar", "Vocabulary", "Phonology"],
  },
  {
    id: "module-4",
    title: "Module 4: Lesson Planning & Classroom Management",
    summary:
      "Designing effective lessons and maintaining a productive classroom environment.",
    topics: [
      "Lesson plan structure and objectives",
      "Classroom management strategies",
      "Managing mixed-ability groups",
    ],
  },
  {
    id: "module-5",
    title: "Module 5: Assessment, Materials Design & EdTech Integration",
    summary:
      "Evaluating learner progress and integrating modern tools into the classroom.",
    topics: [
      "Formative and summative assessment",
      "Designing teaching materials",
      "Integrating educational technology",
    ],
  },
];

export const assessmentCriteria = [
  {
    id: "pass",
    level: "Pass",
    description:
      "Demonstrates satisfactory understanding of core TESOL principles and meets minimum practicum requirements.",
  },
  {
    id: "merit",
    level: "Merit",
    description:
      "Demonstrates strong understanding of TESOL principles with consistently effective teaching practice.",
  },
  {
    id: "distinction",
    level: "Distinction",
    description:
      "Demonstrates outstanding command of TESOL theory and consistently excellent, reflective teaching practice.",
  },
];

// Placeholder schedule data — replace with confirmed weekly timetables.
export const scheduleOptions = [
  {
    id: "full-time",
    label: "Full-Time",
    duration: "6 weeks",
    description: "Classes held weekday mornings, ideal for focused, in-depth study.",
    sessions: [
      { day: "Monday – Friday", time: "9:00 AM – 1:00 PM", focus: "Core Modules" },
      { day: "Wednesday", time: "2:00 PM – 5:00 PM", focus: "Teaching Practicum" },
    ],
  },
  {
    id: "intensive",
    label: "Intensive",
    duration: "4 weeks",
    description: "An accelerated schedule for candidates who need to certify quickly.",
    sessions: [
      { day: "Monday – Saturday", time: "9:00 AM – 3:00 PM", focus: "Core Modules" },
      { day: "Friday", time: "3:30 PM – 6:00 PM", focus: "Teaching Practicum" },
    ],
  },
];
