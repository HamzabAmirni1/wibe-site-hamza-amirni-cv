import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/dashboard/")({
  beforeLoad: ({ location }) => {
    throw redirect({ 
      to: "/app/dashboard/resumes",
      hash: location.hash || window.location.hash.replace('#', '')
    });
  }
});
