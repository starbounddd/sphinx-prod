import { redirect } from "next/navigation";

/**
 * Assessment entry point - redirects to chat
 */
export default function AssessmentPage() {
  redirect("/assessment/chat");
}
