import type { ResumeDocument } from './resume'

const SAMPLE_RESUME: ResumeDocument = {
  version: 1,
  metadata: { title: 'Alex Rivera — Software Engineer', updatedAt: '2026-07-29T12:00:00.000Z' },
  basics: {
    name: 'Alex Rivera',
    headline: 'Software Engineer · TypeScript, Java & Distributed Systems',
    email: 'alex.rivera@example.com',
    phone: '+1 415 555 0142',
    location: 'São Paulo, Brazil · Remote',
    website: 'https://example.com',
    links: [
      { id: 'link-github', label: 'github.com/alexrivera', url: 'https://github.com' },
      { id: 'link-linkedin', label: 'linkedin.com/in/alexrivera', url: 'https://linkedin.com' },
    ],
    summary: 'Software engineer focused on dependable web platforms and developer experience. I turn complex product requirements into accessible interfaces, observable services, and maintainable systems that teams can evolve with confidence.',
  },
  experience: [
    {
      id: 'experience-northstar',
      company: 'Northstar Labs',
      role: 'Senior Software Engineer',
      location: 'Remote',
      startDate: '2022-08',
      endDate: '',
      current: true,
      highlights: [
        'Led the modernization of a high-traffic operations platform, replacing fragile workflows with typed services and a reusable React design system.',
        'Reduced release risk by introducing contract tests, incremental delivery, and production observability across critical customer journeys.',
        'Mentored engineers through architecture reviews and pairing sessions while partnering with product and design on scope and trade-offs.',
      ],
    },
    {
      id: 'experience-lumen',
      company: 'Lumen Commerce',
      role: 'Software Engineer',
      location: 'Austin, United States',
      startDate: '2019-03',
      endDate: '2022-07',
      current: false,
      highlights: [
        'Built order-management tools with Java, Spring Boot, TypeScript, and PostgreSQL for support and logistics teams.',
        'Automated recurring reconciliation work and improved incident diagnosis through structured logging and operational dashboards.',
      ],
    },
  ],
  projects: [
    {
      id: 'project-signals',
      name: 'Transit Signals',
      role: 'Creator and maintainer',
      url: 'https://github.com',
      summary: 'Open-source service that turns public transit events into reliable, queryable operational data.',
      startDate: '2024-01',
      endDate: '',
      current: true,
      highlights: ['Designed the API, ingestion pipeline, documentation, and container-first self-hosting workflow.'],
    },
  ],
  education: [
    {
      id: 'education-state',
      institution: 'State University',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      location: 'São Paulo, Brazil',
      startDate: '2015-02',
      endDate: '2018-12',
      current: false,
      highlights: [],
    },
  ],
  certifications: [
    {
      id: 'cert-cloud',
      name: 'Cloud Application Architecture',
      issuer: 'Open Technology Institute',
      date: '2025-04',
      credentialId: 'OTI-2025-1842',
      url: 'https://example.com/credential',
    },
  ],
  skills: [
    { id: 'skill-backend', name: 'Backend', keywords: ['Java', 'Spring Boot', 'Node.js', 'PostgreSQL', 'REST APIs'] },
    { id: 'skill-frontend', name: 'Frontend', keywords: ['TypeScript', 'React', 'Angular', 'Accessibility', 'Design systems'] },
    { id: 'skill-platform', name: 'Platform', keywords: ['Docker', 'Cloudflare', 'CI/CD', 'Observability', 'Testing'] },
  ],
  languages: [
    { id: 'language-english', name: 'English', level: 'Professional working proficiency' },
    { id: 'language-portuguese', name: 'Portuguese', level: 'Native' },
  ],
  settings: {
    template: 'essential',
    font: 'inter',
    fontSize: 10.5,
    lineHeight: 1.45,
    density: 'balanced',
    accent: '#0E7490',
    pageSize: 'A4',
    locale: 'en',
    sectionOrder: ['profile', 'experience', 'projects', 'education', 'certifications', 'skills', 'languages'],
    hiddenSections: [],
  },
}

export const createSampleResume = (): ResumeDocument => structuredClone(SAMPLE_RESUME)
