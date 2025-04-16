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
import { Popover, PopoverTrigger, PopoverContent } from "./components/ui/popover";
import { Checkbox } from "./components/ui/checkbox";
import { Button } from "./components/ui/button";
import { createClient } from "@supabase/supabase-js";
import { Description } from "@radix-ui/react-dialog";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const stageOptions = [
  "Inbound Deals",
  "Initial Call",
  "Deal Review",
  "IC",
  "Partner Call",
  "Memo",
  "Investment",
  "Freezer",
  "Dumpster",
];
const sourcerOptions = ["Tom", "Stephen", "Ben", "Jameson", "Intern", "Other"];
const partnerOptions = ["Tom", "Stephen", "Ben", "TBD"];

const stageColors = {
  "Inbound Deals": "bg-lime-300 text-lime-800",
  "Initial Call": "bg-yellow-300 text-yellow-800",
  "Deal Review": "bg-orange-300 text-orange-800",
  "Partner Call": "bg-purple-300 text-purple-800",
  Memo: "bg-teal-300 text-teal-800",
  IC: "bg-fuchsia-300 text-fuchsia-800",
  Investment: "bg-lime-600 text-green-900",
  Freezer: "bg-blue-100 text-blue-800",
  Dumpster: "bg-red-400 text-red-800",
};

export default function CRMBoard() {
  const [deals, setDeals] = useState([]);
  const [newDeal, setNewDeal] = useState({
    company: "",
    stage: stageOptions[0],
    sourcer: sourcerOptions[0],
    partner: partnerOptions[0],
    notes: "",
    Description: "",
  });
  const [open, setOpen] = useState(false);
  const defaultStages = stageOptions.filter(
    (stage) => stage !== "Dumpster" && stage !== "Freezer"
  );
  const [editingDeal, setEditingDeal] = useState(null);
  const [filterStages, setFilterStages] = useState(defaultStages);
  

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

  async function saveEditedDeal() {
    if (!editingDeal) return;
    const { id, company, sourcer, partner, notes, Description } = editingDeal;
    const { error } = await supabase
      .from("deals")
      .update({
        company,
        sourcer,
        partner,
        notes,
        Description,
        last_updated: new Date().toISOString(),
      })
      .eq("id", id);
    if (!error) {
      setEditingDeal(null);
      fetchDeals();
    }
  }  

  const filteredDeals =
  filterStages.length > 0
    ? [...deals]
        .filter((deal) => filterStages.includes(deal.stage))
        .sort((a, b) => {
          const stageA = stageOptions.indexOf(a.stage);
          const stageB = stageOptions.indexOf(b.stage);
          if (stageA !== stageB) return stageA - stageB;
          return a.company.localeCompare(b.company);
        })
    : [...deals].sort((a, b) => {
        const stageA = stageOptions.indexOf(a.stage);
        const stageB = stageOptions.indexOf(b.stage);
        if (stageA !== stageB) return stageA - stageB;
        return a.company.localeCompare(b.company);
      });

      const deleteDeal = 
        async (id) => { 
          const confirmed = window.confirm("Are you sure you want to delete this deal?"); 
          if (!confirmed) return; 
          const { error } = 
          await supabase.from("deals").delete().eq("id", id); 
          if (error) { 
            console.error("Error deleting deal:", error.message); 
          } 
          else { 
            setDeals((prev) => prev.filter((deal) => deal.id !== id)); 
            } 
          };

  return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2 text-center">Ollin Ventures Deal Tracker</h1>
      <div className="flex gap-4 mb-4 justify-center">
      <Popover>
  <PopoverTrigger asChild>
    <Button variant="outline" className="w-[200px] justify-start text-left">
      {filterStages.length > 0
        ? `Filtering ${filterStages.length} stage${filterStages.length > 1 ? "s" : ""}`
        : "Filter by Stage"}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-[220px]">
    <div className="grid gap-2">
      {stageOptions.map((stage) => (
        <div key={stage} className="flex items-center gap-2">
          <Checkbox
            id={stage}
            checked={filterStages.includes(stage)}
            onCheckedChange={(checked) => {
              setFilterStages((prev) =>
                checked
                  ? [...prev, stage]
                  : prev.filter((s) => s !== stage)
              );
            }}
          />
          <label htmlFor={stage} className="text-sm">
            {stage}
          </label>
        </div>
      ))}
      <Button
        variant="ghost"
        className="mt-2 text-xs underline"
        onClick={() =>
          setFilterStages(
            stageOptions.filter(
              (stage) => stage !== "Dumpster" && stage !== "Freezer"
            )
          )
        }
      >
        Reset to Default
      </Button>
    </div>
  </PopoverContent>
</Popover>

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
            <Input 
              placeholder="Description"
              value={newDeal.Description}
              onChange={(e) =>
                setNewDeal({ ...newDeal, Description: e.target.value})
              }
            />
            <Button onClick={addDeal}>Submit</Button>
          </DialogContent>
        </Dialog>
        <Dialog open={!!editingDeal} onOpenChange={() => setEditingDeal(null)}>
  <DialogContent>
    <DialogTitle>Edit Deal</DialogTitle>
    <Input
      placeholder="Company Name"
      value={editingDeal?.company || ""}
      onChange={(e) =>
        setEditingDeal((prev) => ({ ...prev, company: e.target.value }))
      }
    />
    <Select
      value={editingDeal?.sourcer}
      onValueChange={(val) =>
        setEditingDeal((prev) => ({ ...prev, sourcer: val }))
      }
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
      value={editingDeal?.partner}
      onValueChange={(val) =>
        setEditingDeal((prev) => ({ ...prev, partner: val }))
      }
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
      value={editingDeal?.notes || ""}
      onChange={(e) =>
        setEditingDeal((prev) => ({ ...prev, notes: e.target.value }))
      }
    />
    <Input 
              placeholder="Description"
              value={editingDeal?.Description || ""}
              onChange={(e) =>
                setEditingDeal((prev) => ({ ...prev, Description: e.target.value}))
              }
            />
    <div className="flex justify-end gap-2">
      <Button variant="ghost" onClick={() => setEditingDeal(null)}>
        Cancel
      </Button>
      <Button onClick={saveEditedDeal}>Save</Button>
    </div>
  </DialogContent>
</Dialog>
      </div>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 w-150 text-center">Company</th>
            <th className="p-2 text-center">Stage</th>
            <th className="p-2 text-center w-40">Last Updated</th>
            <th className="p-2 text-center">Sourcer</th>
            <th className="p-2 text-center">Partner</th>
            <th className="p-2 text-center">Notes</th>
            <th className="p-2 text-center">Description</th>
            <th className="p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDeals.map((deal) => (
            <tr key={deal.id} className="border-t">
              <td className="p-2 w-150 font-semibold text-center">{deal.company}</td>
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

              <td className="py-2 w-40">
                {new Date(deal.last_updated).toLocaleDateString()}
              </td>
              <td className="p-2">
                {deal.sourcer}
              </td>
              <td className="p-2">
                {deal.partner}
              </td>
              <td className="py-2 w-1/3 whitespace-pre-wrap break-words align-top">
                {deal.notes}
              </td>
              <td className="py-2 w-1/3 whitespace-pre-wrap break-words align-top">
                {deal.Description}
              </td>
              <td className="py-2 px-3 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditingDeal(deal)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => deleteDeal(deal.id)}> 
                  Delete 
                </Button> 
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
