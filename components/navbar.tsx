"use client";

import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import SignOutForm from "./sign-out-form";
import { useUser } from "@/context/UserContext";
import { User, Plus, Menu, X } from "lucide-react";

export default function Navbar() {
  const user = useUser();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuHeight, setMenuHeight] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (menuRef.current) {
      setMenuHeight(menuRef.current.scrollHeight);
    }
  }, [mobileOpen, menuRef]);

  const navItems = user
    ? [
        { href: "/dashboard", label: "Dashboard" },
        {
          href: "/expenses",
          label: "Expenses",
          icon: <Plus className="h-4 w-4 mr-1" />,
        },
      ]
    : [];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur shadow-sm">
      <div className="container mx-auto flex items-center justify-between py-2 px-4">
        {/* Logo */}
        <Link href="/">
          <span
            className="text-2xl font-bold tracking-tight"
            style={{
              background:
                "linear-gradient(90deg, var(--chart-1), var(--chart-2), var(--chart-3), var(--chart-4), var(--chart-5))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-block",
            }}
          >
            mint
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive(item.href) ? "default" : "outline"}
                className={
                  isActive(item.href)
                    ? "bg-primary text-primary-foreground"
                    : ""
                }
              >
                {item.icon && <>{item.icon}</>}
                {item.label}
              </Button>
            </Link>
          ))}

          {user ? (
            <>
              <Link href="/profile">
                <Button variant="outline">
                  <User />
                </Button>
              </Link>
              <SignOutForm />
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="outline">Login</Button>
              </Link>
              <Button asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-muted/20 transition"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile nav */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300`}
        style={{ maxHeight: mobileOpen ? menuHeight : 0 }}
      >
        <div ref={menuRef} className="flex flex-col gap-2 px-4 py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
            >
              <Button
                variant={isActive(item.href) ? "default" : "outline"}
                className="w-full justify-start"
              >
                {item.icon && <>{item.icon}</>}
                {item.label}
              </Button>
            </Link>
          ))}

          {user ? (
            <>
              <Link href="/profile" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full justify-start">
                  <User />
                  Profile
                </Button>
              </Link>
              <SignOutForm />
            </>
          ) : (
            <>
              <Link href="/sign-in" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full justify-start">
                  Login
                </Button>
              </Link>
              <Button asChild className="w-full">
                <Link href="/sign-up" onClick={() => setMobileOpen(false)}>
                  Sign Up
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
