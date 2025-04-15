
import React, { useEffect, useState } from "react";
import { supabase } from "./components/auth/supabaseClient";
import { Select, SelectTrigger, SelectContent, SelectItem } from "./components/ui/select";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

const stageOptions = ["Inbound Deals", "Initial Call", "Deal Review", "Partner Call", "Memo", "IC", "Investment", "Freezer", "Dumpster"];
const sourcerOptions = ["Seth", "Cole", "Jameson"];
const partnerOptions = ["Seth", "Cole", "Jameson"];

export default function CRMBoard() {
  const [deals, setDeals] = useState([]);
  const [newCompany, setNewCompany] = useState("");

  const fetchDeals = async () => {
    const { data } = await supabase.from("deals").select("*").order("stage", { ascending: true });
    setDeals(data || []);
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const addDeal = async () => {
    if (!newCompany) return;
    await supabase.from("deals").insert([{ company: newCompany, stage: "Inbound Deals" }]);
    setNewCompany("");
    fetchDeals();
  };

  const deleteDeal = async (id) => {
    await supabase.from("deals").delete().eq("id", id);
    fetchDeals();
  };

  const updateDeal = async (id, field, value) => {
    await supabase.from("deals").update({ [field]: value, last_updated: new Date() }).eq("id", id);
    fetchDeals();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">VC CRM Board</h1>
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Add new company..."
          value={newCompany}
          onChange={(e) => setNewCompany(e.target.value)}
        />
        <Button onClick={addDeal}>Add Deal</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-left text-sm border">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 border-b">Company</th>
              <th className="p-3 border-b">Stage</th>
              <th className="p-3 border-b">Last Updated</th>
              <th className="p-3 border-b">Partner</th>
              <th className="p-3 border-b">Sourcer</th>
              <th className="p-3 border-b">Notes</th>
              <th className="p-3 border-b">Delete</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((deal) => (
              <tr key={deal.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{deal.company}</td>
                <td className="p-3">
                  <Select
                    value={deal.stage}
                    onValueChange={(val) => updateDeal(deal.id, "stage", val)}
                  >
                    <SelectTrigger>{deal.stage}</SelectTrigger>
                    <SelectContent>
                      {stageOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-3 text-gray-500">
                  {new Date(deal.last_updated).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <Select
                    value={deal.partner || ""}
                    onValueChange={(val) => updateDeal(deal.id, "partner", val)}
                  >
                    <SelectTrigger>{deal.partner || "Select"}</SelectTrigger>
                    <SelectContent>
                      {partnerOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-3">
                  <Select
                    value={deal.sourcer || ""}
                    onValueChange={(val) => updateDeal(deal.id, "sourcer", val)}
                  >
                    <SelectTrigger>{deal.sourcer || "Select"}</SelectTrigger>
                    <SelectContent>
                      {sourcerOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-3 w-[300px]">
                  <Input
                    value={deal.notes || ""}
                    onChange={(e) => updateDeal(deal.id, "notes", e.target.value)}
                  />
                </td>
                <td className="p-3">
                  <Button variant="outline" className="text-red-600" onClick={() => deleteDeal(deal.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
