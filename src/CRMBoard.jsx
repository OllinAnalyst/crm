import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const stages = ["Inbound Deals", "Initial Call", "Deal Review", "Partner Call", "Memo", "IC", "Investment", "Freezer", "Dumpster"];

export default function CRMBoard() {
  const [deals, setDeals] = useState([]);
  const [formData, setFormData] = useState({ company: "", stage: "Inbound Deals", notes: "" });

  useEffect(() => {
    const fetchDeals = async () => {
      const { data } = await supabase.from("deals").select("*");
      setDeals(data || []);
    };
    fetchDeals();
  }, []);

  const addDeal = async () => {
    const { data } = await supabase.from("deals").insert([formData]).select();
    if (data) {
      setDeals((prev) => [...prev, ...data]);
      setFormData({ company: "", stage: "Inbound Deals", notes: "" });
    }
  };

  const updateDeal = async (id, field, value) => {
    await supabase.from("deals").update({ [field]: value }).eq("id", id);
    setDeals((prev) => prev.map((deal) => (deal.id === id ? { ...deal, [field]: value } : deal)));
  };

  const deleteDeal = async (id) => {
    await supabase.from("deals").delete().eq("id", id);
    setDeals((prev) => prev.filter((deal) => deal.id !== id));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">VC CRM</h1>
      <div className="mb-4 space-x-2">
        <input
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          placeholder="Company"
          className="border px-2 py-1"
        />
        <select
          value={formData.stage}
          onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
          className="border px-2 py-1"
        >
          {stages.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <button onClick={addDeal} className="bg-blue-600 text-white px-4 py-1 rounded">
          Add Deal
        </button>
      </div>
      <div className="space-y-4">
        {deals.map((deal) => (
          <div key={deal.id} className="border p-4 rounded bg-white shadow">
            <input
              defaultValue={deal.company}
              onBlur={(e) => updateDeal(deal.id, "company", e.target.value)}
              className="border-b w-full mb-2"
            />
            <select
              value={deal.stage}
              onChange={(e) => updateDeal(deal.id, "stage", e.target.value)}
              className="border px-2 py-1 w-full mb-2"
            >
              {stages.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <textarea
              defaultValue={deal.notes}
              onBlur={(e) => updateDeal(deal.id, "notes", e.target.value)}
              className="border w-full mb-2"
            />
            <button onClick={() => deleteDeal(deal.id)} className="bg-red-500 text-white px-4 py-1 rounded">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
