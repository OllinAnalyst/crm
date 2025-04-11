import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const defaultStages = [
  "Inbound Deals",
  "Initial Call",
  "Deal Review",
  "Partner Call",
  "Memo",
  "IC",
  "Investment",
  "Freezer",
  "Dumpster",
];

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const stageColors = {
  "Inbound Deals": "bg-gray-100",
  "Initial Call": "bg-blue-100",
  "Deal Review": "bg-yellow-100",
  "Partner Call": "bg-orange-100",
  Memo: "bg-green-100",
  IC: "bg-indigo-100",
  Investment: "bg-purple-100",
  Freezer: "bg-neutral-200",
  Dumpster: "bg-red-100",
};

const initialDeals = [
  { company: "Yipy", stage: "Initial Call" },
  { company: "Cashmere", stage: "IC" },
  { company: "Annie", stage: "Memo" },
  { company: "Link X", stage: "Memo" },
  { company: "Dappier", stage: "Memo" },
];

export default function App() {
  const [deals, setDeals] = useState(initialDeals);
  const [stages, setStages] = useState(defaultStages);
  const [activeStage, setActiveStage] = useState("All");

  const handleStageChange = (index, newStage) => {
    const updatedDeals = [...deals];
    updatedDeals[index].stage = newStage;
    setDeals(updatedDeals);
  };

  const filteredDeals = activeStage === "All" ? deals : deals.filter((deal) => deal.stage === activeStage);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">VC Deal Tracker</h1>

      <Tabs defaultValue="All" onValueChange={setActiveStage} className="mb-4">
        <TabsList className="flex flex-wrap gap-2">
          <TabsTrigger value="All">All</TabsTrigger>
          {stages.map((stage, idx) => (
            <TabsTrigger key={idx} value={stage}>
              {stage}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 gap-4">
        {filteredDeals.map((deal, idx) => (
          <Card
            key={idx}
            className={`flex items-center justify-between p-4 rounded-xl shadow-md ${stageColors[deal.stage]}`}
          >
            <CardContent className="w-full flex items-center justify-between gap-4">
              <Input
                className="w-1/5"
                defaultValue={deal.company}
                onChange={(e) => {
                  const updated = [...deals];
                  updated[idx].company = e.target.value;
                  setDeals(updated);
                }}
              />
              <Select
                value={deal.stage}
                onValueChange={(value) => handleStageChange(idx, value)}
              >
                <SelectTrigger className="w-1/5" />
                <SelectContent>
                  {stages.map((stage, sidx) => (
                    <SelectItem key={sidx} value={stage}>
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select className="w-1/5">
                <SelectTrigger />
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="Scout A">Scout A</SelectItem>
                  <SelectItem value="Scout B">Scout B</SelectItem>
                </SelectContent>
              </Select>
              <Select className="w-1/5">
                <SelectTrigger />
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="Partner X">Partner X</SelectItem>
                  <SelectItem value="Partner Y">Partner Y</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}