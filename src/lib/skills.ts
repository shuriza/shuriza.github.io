import type { IconType } from "react-icons";
import {
  SiDocker,
  SiFramer,
  SiGit,
  SiLaravel,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPhp,
  SiReact,
  SiSqlite,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVite,
} from "react-icons/si";
import { TbApi } from "react-icons/tb";
import { VscVscode } from "react-icons/vsc";

export const SKILL_CATEGORIES = ["Frontend", "Backend", "Tools"] as const;
export type SkillCategory = (typeof SKILL_CATEGORIES)[number];

export const SKILL_ICON_OPTIONS = {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiLaravel,
  SiPhp,
  SiMysql,
  SiSqlite,
  SiGit,
  SiDocker,
  SiVercel,
  SiNodedotjs,
  SiFramer,
  SiVite,
  TbApi,
  VscVscode,
} satisfies Record<string, IconType>;

export type SkillIconName = keyof typeof SKILL_ICON_OPTIONS;

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  icon: SkillIconName;
  color: string;
  published: boolean;
  sort_order: number;
}

export const fallbackSkills: Skill[] = [
  [
    ["React", "SiReact", "#61DAFB"],
    ["Next.js", "SiNextdotjs", "#ffffff"],
    ["TypeScript", "SiTypescript", "#3178C6"],
    ["Tailwind CSS", "SiTailwindcss", "#06B6D4"],
    ["Framer Motion", "SiFramer", "#0055FF"],
    ["Vite", "SiVite", "#646CFF"],
  ].map(([name, icon, color], index) => ({
    id: `frontend-${index}`,
    name,
    category: "Frontend" as const,
    icon: icon as SkillIconName,
    color,
    published: true,
    sort_order: index,
  })),
  [
    ["Laravel", "SiLaravel", "#FF2D20"],
    ["PHP", "SiPhp", "#777BB4"],
    ["Node.js", "SiNodedotjs", "#339933"],
    ["MySQL", "SiMysql", "#4479A1"],
    ["SQLite", "SiSqlite", "#003B57"],
    ["REST API", "TbApi", "#22d3ee"],
  ].map(([name, icon, color], index) => ({
    id: `backend-${index}`,
    name,
    category: "Backend" as const,
    icon: icon as SkillIconName,
    color,
    published: true,
    sort_order: index,
  })),
  [
    ["Git", "SiGit", "#F05032"],
    ["Docker", "SiDocker", "#2496ED"],
    ["Vercel", "SiVercel", "#ffffff"],
    ["VS Code", "VscVscode", "#007ACC"],
  ].map(([name, icon, color], index) => ({
    id: `tools-${index}`,
    name,
    category: "Tools" as const,
    icon: icon as SkillIconName,
    color,
    published: true,
    sort_order: index,
  })),
].flat();
