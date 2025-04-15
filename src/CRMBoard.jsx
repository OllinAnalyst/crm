// CRMBoard.jsx

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "./components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./components/ui/select";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const stageOptions = [
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
const sourcerOptions = ["Tom", "Stephen", "Ben", "Jameson", "Intern"];
const partnerOptions = ["Tom", "Stephen", "Ben"];

const stageColors = {
  "Inbound Deals": "bg-blue-100 text-blue-800",
  "Initial Call": "bg-yellow-100 text-yellow-800",
  "Deal Review": "bg-purple-100 text-purple-800",
  "Partner Call": "bg-orange-100 text-orange-800",
  Memo: "bg-green-100 text-green-800",
  IC: "bg-red-100 text-red-800",
  Investment: "bg-indigo-100 text-indigo-800",
  Freezer: "bg-gray-100 text-gray-800",
  Dumpster: "bg-black text-white",
};

export default function CRMBoard() {
  const [deals, setDeals] = useState([]);
  const [newDeal, setNewDeal] = useState({
    company: "",
    stage: stageOptions[0],
    sourcer: sourcerOptions[0],
    partner: partnerOptions[0],
    notes: "",
  });
  const [open, setOpen] = useState(false);
  const [filterStage, setFilterStage] = useState("all");

  useEffect(() => {
    fetchDeals();
  }, []);

  async function fetchDeals() {
    const { data } = await supabase.from("deals").select("*");
    setDeals(data);
  }

  async function addDeal() {
    const { error } = await supabase.from("deals").insert([
      {
        ...newDeal,
        last_updated: new Date().toISOString(),
      },
    ]);
    if (!error) {
      fetchDeals();
      setOpen(false);
    }
  }

  async function updateDeal(id, field, value) {
    const { error } = await supabase
      .from("deals")
      .update({ [field]: value, last_updated: new Date().toISOString() })
      .eq("id", id);
    if (!error) fetchDeals();
  }

  const filteredDeals =
  filterStage && filterStage !== "all"
    ? [...deals]
        .filter((deal) => deal.stage === filterStage)
        .sort(
          (a, b) =>
            stageOptions.indexOf(a.stage) - stageOptions.indexOf(b.stage)
        )
    : [...deals].sort(
        (a, b) =>
          stageOptions.indexOf(a.stage) - stageOptions.indexOf(b.stage)
      );

  return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">Ollin Ventures Deal Tracker</h1>

      <div className="flex gap-4 mb-4">
        <Select onValueChange={setFilterStage} value={filterStage}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {stageOptions.map((stage) => (
              <SelectItem key={stage} value={stage}>
                {stage}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add New Deal</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>New Deal</DialogTitle>
            <Input
              placeholder="Company Name"
              value={newDeal.company}
              onChange={(e) =>
                setNewDeal({ ...newDeal, company: e.target.value })
              }
            />
            <Select
              onValueChange={(val) => setNewDeal({ ...newDeal, stage: val })}
              defaultValue={newDeal.stage}
            >
              <SelectTrigger>
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent>
                {stageOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={(val) => setNewDeal({ ...newDeal, sourcer: val })}
              defaultValue={newDeal.sourcer}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sourcer" />
              </SelectTrigger>
              <SelectContent>
                {sourcerOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={(val) => setNewDeal({ ...newDeal, partner: val })}
              defaultValue={newDeal.partner}
            >
              <SelectTrigger>
                <SelectValue placeholder="Partner" />
              </SelectTrigger>
              <SelectContent>
                {partnerOptions.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Notes"
              value={newDeal.notes}
              onChange={(e) =>
                setNewDeal({ ...newDeal, notes: e.target.value })
              }
            />
            <Button onClick={addDeal}>Submit</Button>
          </DialogContent>
        </Dialog>
      </div>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Company</th>
            <th className="p-2 text-left">Stage</th>
            <th className="p-2 text-left">Last Updated</th>
            <th className="p-2 text-left">Partner</th>
            <th className="p-2 text-left">Sourcer</th>
            <th className="p-2 text-left">Notes</th>
          </tr>
        </thead>
        <tbody>
          {filteredDeals.map((deal) => (
            <tr key={deal.id} className="border-t">
              <td className="p-2">{deal.company}</td>
              <td className="p-2">
  <Select
    defaultValue={deal.stage}
    onValueChange={(val) => updateDeal(deal.id, "stage", val)}
  >
    <SelectTrigger className={`font-medium ${stageColors[deal.stage] || ""}`}>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {stageOptions.map((stage) => (
        <SelectItem key={stage} value={stage}>
          {stage}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</td>

              <td className="p-2">
                {new Date(deal.last_updated).toLocaleDateString()}
              </td>
              <td className="p-2">
                <Select
                  defaultValue={deal.partner}
                  onValueChange={(val) => updateDeal(deal.id, "partner", val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {partnerOptions.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </td>
              <td className="p-2">
                <Select
                  defaultValue={deal.sourcer}
                  onValueChange={(val) => updateDeal(deal.id, "sourcer", val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sourcerOptions.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </td>
              <td className="p-2">
                <Input
                  value={deal.notes || ""}
                  onChange={(e) =>
                    updateDeal(deal.id, "notes", e.target.value)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
