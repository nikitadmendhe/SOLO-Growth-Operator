export interface Service {
  id: string;
  title: string;
  shortDescription: string;
  deliverables: string[];
}

export interface Step {
  number: string;
  title: string;
  description: string;
  detail: string;
}

export interface TargetClient {
  id: string;
  title: string;
  description: string;
  painPoint: string;
  solution: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  metrics: string;
}

export interface ContactFormInput {
  name: string;
  email: string;
  handle: string;
  revenue: string;
  message: string;
}
