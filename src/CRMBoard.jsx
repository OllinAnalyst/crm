import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// ✅ Configure Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const stages = [
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

export default function CRMBoard() {
  const [deals, setDeals] = useState([]);
  const [newDeal, setNewDeal] = useState({
    company: "",
    stage: "Inbound Deals",
    sourcer: "",
    partner: "",
    notes: "",
  });

  // ✅ Load deals on mount
  useEffect(() => {
    const loadDeals = async () => {
      const { data, error } = await supabase.from("deals").select("*").order("stage");
      if (!error) setDeals(data);
    };
    loadDeals();
  }, []);

  // ✅ Add a new deal
  const addDeal = async () => {
    const { data, error } = await supabase.from("deals").insert([newDeal]).select();
    if (!error && data) {
      setDeals((prev) => [...prev, ...data]);
      setNewDeal({
        company: "",
        stage: "Inbound Deals",
        sourcer: "",
        partner: "",
        notes: "",
      });
    }
  };

  // ✅ Update deal field
  const updateDeal = async (id, field, value) => {
    await supabase.from("deals").update({ [field]: value }).eq("id", id);
    setDeals((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  };

  // ✅ Delete a deal
  const deleteDeal = async (id) => {
    await supabase.from("deals").delete().eq("id", id);
    setDeals((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">VC CRM</h1>

      {/* Add Deal Form */}
      <Card className="mb-8 p-4">
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            placeholder="Company"
            value={newDeal.company}
            onChange={(e) => setNewDeal({ ...newDeal, company: e.target.value })}
          />
          <Select
            value={newDeal.stage}
            onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value })}
          >
            {stages.map((stage) => (
              <SelectItem key={stage} value={stage}>
                {stage}
              </SelectItem>
            ))}
          </Select>
          <Input
            placeholder="Sourcer"
            value={newDeal.sourcer}
            onChange={(e) => setNewDeal({ ...newDeal, sourcer: e.target.value })}
          />
          <Input
            placeholder="Partner"
            value={newDeal.partner}
            onChange={(e) => setNewDeal({ ...newDeal, partner: e.target.value })}
          />
          <textarea
            className="border p-2 col-span-1 sm:col-span-2 rounded"
            placeholder="Notes"
            value={newDeal.notes}
            onChange={(e) => setNewDeal({ ...newDeal, notes: e.target.value })}
          />
          <button
            className="bg-blue-600 text-white rounded px-4 py-2 col-span-1 sm:col-span-2"
            onClick={addDeal}
          >
            Add Deal
          </button>
        </CardContent>
      </Card>

      {/* Deal List */}
      <div className="space-y-4">
        {deals.map((deal) => (
          <Card key={deal.id}>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                value={deal.company}
                onChange={(e) => updateDeal(deal.id, "company", e.target.value)}
              />
              <Select
                value={deal.stage}
                onChange={(e) => updateDeal(deal.id, "stage", e.target.value)}
              >
                {stages.map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {stage}
                  </SelectItem>
                ))}
              </Select>
              <Input
                value={deal.sourcer}
                onChange={(e) => updateDeal(deal.id, "sourcer", e.target.value)}
              />
              <Input
                value={deal.partner}
                onChange={(e) => updateDeal(deal.id, "partner", e.target.value)}
              />
              <textarea
                className="border p-2 col-span-1 sm:col-span-2 rounded"
                value={deal.notes}
                onChange={(e) => updateDeal(deal.id, "notes", e.target.value)}
              />
              <button
                onClick={() => deleteDeal(deal.id)}
                className="bg-red-600 text-white px-4 py-2 rounded col-span-1 sm:col-span-2"
              >
                Delete
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
