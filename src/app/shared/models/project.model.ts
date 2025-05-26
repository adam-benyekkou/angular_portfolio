type Project = {
  id: string;
  title: string;
  status: string;
  classification: string;
  objective: string;
  statusDescription: string;
  techStack: string[];
  demoUrl?: string;
  codeUrl?: string;
  isRedacted: boolean;
  caseStudy?: {
    title: string;
    sections: CaseStudySection[];
  };
};

type CaseStudySection = {
  title: string;
  content: string;
};

export { type Project, type CaseStudySection };
