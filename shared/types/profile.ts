export interface Experience {
  role: string
  company: string
  location: string
  period: string
  /** One line about the company or context. */
  context?: string
  highlights: string[]
  stack: string[]
}

export interface SkillGroup {
  title: string
  skills: string[]
}

export interface Stat {
  value: number
  prefix?: string
  suffix?: string
  label: string
}

export interface Education {
  degree: string
  school: string
  location: string
  period: string
}

export interface Language {
  name: string
  level: string
  /** 0–100, drives the progress bar. */
  proficiency: number
}
