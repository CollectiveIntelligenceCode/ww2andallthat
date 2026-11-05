"use client";
import { usePathname } from "next/navigation";
import SignInEnhancer from "./SignInEnhancer";
import SearchEnhancer from "./SearchEnhancer";
import QuizEnhancer from "./QuizEnhancer";
import GiftEnhancer from "./GiftEnhancer";
import AccountEnhancer from "./AccountEnhancer";
import ReadTracker from "./ReadTracker";

// Adds real behaviour to wireframe pages that need it. Each enhancer wires up
// the static markup in place (forms, inputs) and renders nothing itself.
export default function Enhancers() {
  const path = usePathname();
  if (path.startsWith("/account")) return <><SignInEnhancer /><AccountEnhancer /></>;
  if (path.startsWith("/sign-in")) return <SignInEnhancer />;
  if (path.startsWith("/quizzes")) return <QuizEnhancer />;
  if (path.startsWith("/gift")) return <GiftEnhancer />;
  if (path.startsWith("/essays/")) return <ReadTracker />;
  if (path.startsWith("/search")) return <SearchEnhancer />;
  return null;
}
