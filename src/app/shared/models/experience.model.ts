type Experience = {
  readonly id: string;
  readonly title: string;
  readonly classification: string;
  readonly objective: string;
  readonly timeline: string;
  readonly techStack: readonly string[];
  readonly status: 'current' | 'completed';
  readonly statusLabel: string;
  readonly isCurrent?: boolean;
};

export { type Experience };
