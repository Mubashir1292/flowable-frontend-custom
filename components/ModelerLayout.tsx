"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FileText, Database, FileSpreadsheet, Table, Package, 
  User, ChevronDown, LogOut 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navigation = [
  { name: "Processes", href: "/", icon: FileText },
  { name: "Case models", href: "/cases", icon: Database },
  { name: "Forms", href: "/forms", icon: FileSpreadsheet },
  { name: "Decision Tables", href: "/decisions", icon: Table },
  { name: "Apps", href: "/apps", icon: Package },
];

export default function ModelerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Hide sidebar/header when inside the actual BPMN editor
  const isEditorView = pathname.startsWith("/editor");

  if (isEditorView) {
    return <div className="h-screen w-screen overflow-hidden">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="bg-slate-900 border-b border-slate-800 h-14 flex items-center px-6 justify-between shrink-0">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-white font-semibold text-xl">Flowable</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2",
                    isActive ? "text-white bg-slate-800" : "text-slate-300 hover:text-white hover:bg-slate-800"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">admin Administrator</span>
            <ChevronDown className="h-4 w-4" />
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                <div className="py-1">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}