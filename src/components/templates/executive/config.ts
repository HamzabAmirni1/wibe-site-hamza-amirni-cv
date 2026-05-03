import { ResumeTemplate } from "@/types/template";

export const executiveConfig: ResumeTemplate = {
  id: "executive",
  name: "Executive",
  description: "Premium professional design with a clean layout and elegant typography",
  thumbnail: "executive",
  layout: "executive",
  colorScheme: {
    primary: "#0f172a",
    secondary: "#64748b",
    background: "#ffffff",
    text: "#1e293b",
  },
  spacing: {
    sectionGap: 30,
    itemGap: 20,
    contentPadding: 40,
  },
  basic: {
    layout: "left",
  },
  availableSections: ["skills", "experience", "projects", "education", "selfEvaluation", "certificates"],
};
