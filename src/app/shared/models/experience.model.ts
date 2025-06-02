type Experience = {
  id: string;
  title: string;
  classification: string;
  objective: string;
  timeline: string;
  techStack: string[];
  status: 'current' | 'completed';
  statusLabel: string;
  isCurrent?: boolean;
};

export { type Experience };
