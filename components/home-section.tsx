"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FadeInView from "./animate-ui/fade-in-view";
import Link from "next/link";
import { ExternalLink, Github, Sparkles } from "lucide-react";
import { Zap, Code, Layers, Lock, Database } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  colorClass?: string;
}

const stats = [
  { title: "Total Expenses", value: "$12,345", colorClass: "bg-primary/10" },
  {
    title: "Most Spent Category",
    value: "Food",
    colorClass: "bg-secondary/10",
  },
  { title: "Average per Month", value: "$2,345", colorClass: "bg-accent/10" },
  { title: "Last Transaction", value: "$120", colorClass: "bg-destructive/10" },
];

const stack = [
  {
    name: "Next.js 15",
    icon: <Zap className="h-6 w-6 text-primary" />,
    description: "React framework for fast and scalable apps",
  },
  {
    name: "Tailwind CSS",
    icon: <Code className="h-6 w-6 text-blue-500" />,
    description: "Utility-first CSS for responsive UI",
  },
  {
    name: "Shadcn UI",
    icon: <Layers className="h-6 w-6 text-sky-500" />,
    description: "Prebuilt accessible components",
  },
  {
    name: "Prisma",
    icon: <Code className="h-6 w-6 text-indigo-500" />,
    description: "Modern ORM for database management",
  },
  {
    name: "PostgreSQL",
    icon: <Database className="h-6 w-6 text-blue-600" />,
    description: "Reliable relational database for storing data",
  },
  {
    name: "NextAuth.js",
    icon: <Lock className="h-6 w-6 text-primary" />,
    description: "Secure authentication and session management",
  },
];

export default function LandingSection() {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative space-y-6 py-12 md:py-20 lg:py-32 text-center container mx-auto">
        <FadeInView className="space-y-4 mx-auto max-w-4xl">
          <Badge className="px-4 py-1.5 text-sm font-medium flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4" />
            Expense Tracker
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
            Keep Track of Your Expenses <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Effortlessly
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground">
            Manage your spending, visualize your data, and gain insights into
            your monthly expenses.
          </p>
        </FadeInView>

        <FadeInView
          delay={0.6}
          className="flex flex-wrap items-center justify-center gap-4 mt-6"
        >
          <Button asChild size="lg">
            <Link
              href="https://github.com/your-repo/expense-tracker"
              target="_blank"
              className="flex items-center gap-2"
            >
              <Github className="h-5 w-5" />
              <span>View on GitHub</span>
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/dashboard" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              <span>Try the Demo</span>
            </Link>
          </Button>
        </FadeInView>
      </section>

      {/* Stats Cards */}
      <section className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <FadeInView
            key={i}
            delay={0.1 * i}
            className="transition-transform hover:scale-105"
          >
            <Card className={`p-6 rounded-xl shadow-md ${stat.colorClass}`}>
              <CardTitle className="text-lg font-semibold text-card-foreground">
                {stat.title}
              </CardTitle>
              <CardDescription className="mt-2 text-2xl font-bold text-foreground">
                {stat.value}
              </CardDescription>
            </Card>
          </FadeInView>
        ))}
      </section>

      {/* Tech Stack */}
      <section className="pb-20 pt-20 md:pb-32 md:pt-32 container mx-auto">
        <FadeInView className="text-center space-y-4 pb-16 mx-auto max-w-4xl">
          <Badge className="px-4 py-1.5 text-sm font-medium">Tech Stack</Badge>
          <h2 className="mx-auto mt-4 text-3xl font-bold sm:text-5xl tracking-tight">
            Built With Modern, Reliable Tech
          </h2>
          <p className="text-xl text-muted-foreground pt-1">
            Our Expense Tracker uses the latest technologies for performance,
            security, and ease of use
          </p>
        </FadeInView>

        <Card className="grid divide-x divide-y overflow-hidden rounded-3xl border border-card sm:grid-cols-2 lg:grid-cols-3 lg:divide-y-0">
          {stack.map((item, index) => (
            <FadeInView
              key={index}
              delay={0.1 * (index + 2)}
              className="group relative transition-shadow duration-300 hover:z-[1] hover:shadow-2xl hover:shadow-primary"
            >
              <div className="relative space-y-8 py-12 p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  {item.icon}
                </div>
                <div className="space-y-2">
                  <h5 className="text-xl text-muted-foreground font-semibold transition group-hover:text-primary">
                    {item.name}
                  </h5>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            </FadeInView>
          ))}
        </Card>
      </section>
    </div>
  );
}
