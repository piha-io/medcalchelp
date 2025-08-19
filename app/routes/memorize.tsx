import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Brain, Calculator, Target, Timer, Trophy, Zap, Book, ArrowRight } from 'lucide-react';

export const Route = createFileRoute("/memorize")({
  component: MemorizePage,
});

function MemorizePage() {
  return (
    <Outlet />
  );
}

