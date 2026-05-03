import { ResumeTemplate } from "@/types/template";

export const impactConfig: ResumeTemplate = {
  id: "impact",
  name: "Impact",
  description: "Modern, bold design with strong visual hierarchy and distinct section headers",
  thumbnail: "impact",
  layout: "impact",
  colorScheme: {
    primary: "#2563eb",
    secondary: "#475569",
    background: "#ffffff",
    text: "#0f172a",
  },
  spacing: {
    sectionGap: 35,
    itemGap: 22,
    contentPadding: 35,
  },
  basic: {
    layout: "center",
  },
  availableSections: ["skills", "experience", "projects", "education", "selfEvaluation", "certificates"],
};
