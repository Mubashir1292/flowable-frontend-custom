"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, FileText, Edit, Trash2 } from "lucide-react";

// Mock data for now
const mockModels = [
  {
    id: "1",
    name: "Employee Onboarding",
    key: "emp-onboarding",
    version: 1,
    category: "HR",
  },
  {
    id: "2",
    name: "Leave Approval",
    key: "leave-approval",
    version: 3,
    category: "HR",
  },
  {
    id: "3",
    name: "Purchase Order",
    key: "purchase-order",
    version: 1,
    category: "Finance",
  },
];

export default function ModelerHomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const modelerRef = useRef(null);

  const filteredModels = mockModels.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  // In your main modeler page component
  const createConnection = (sourceElement: any, targetElement: any) => {
    if (!modelerRef.current) return;

    try {
      const modeling = (modelerRef.current as any).get("modeling") as any;
      const elementFactory = (modelerRef.current as any).get("elementFactory") as any;

      // Create sequence flow
      const connection = elementFactory.createConnection({
        type: "bpmn:SequenceFlow",
      });

      modeling.connect(sourceElement, targetElement, connection);
    } catch (err) {
      console.error("Error creating connection:", err);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Business Process Models
          </h1>
          <p className="text-gray-500 mt-1">{filteredModels.length} models</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Import Process</Button>
          <Button
            onClick={() => router.push("/editor?new=true")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" /> Create Process
          </Button>
        </div>
      </div>

      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search models..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModels.map((model) => (
          <Card key={model.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">{model.name}</CardTitle>
                  <p className="text-xs text-gray-500 font-mono">{model.key}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Badge variant="secondary">v{model.version}</Badge>
                {model.category && (
                  <Badge variant="outline">{model.category}</Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => router.push(`/editor?id=${model.id}`)}
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
