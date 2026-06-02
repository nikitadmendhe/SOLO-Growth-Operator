import { useState } from "react";
import { motion } from "motion/react";
import { TESTIMONIALS } from "../data";
import { Quote, Plus, Trash2, Edit2, Check } from "lucide-react";
import { Testimonial } from "../types";

export default function Testimonials() {
  const [list, setList] = useState<Testimonial[]>(TESTIMONIALS);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Testimonial>>({});
  const [showForm, setShowForm] = useState(false);

  // Simple CRUD sandbox to make the placeholder cards active and super valuable
  const handleEditClick = (item: Testimonial) => {
    setIsEditing(item.id);
    setEditForm(item);
  };

  const handleSave = () => {
    setList(list.map(t => t.id === isEditing ? { ...t, ...editForm } as Testimonial : t));
    setIsEditing(null);
    setEditForm({});
  };

  const handleAddNew = () => {
    const fresh: Testimonial = {
      id: "fresh-" + Date.now(),
      quote: "Insert your creator recommendation quote. Describe how they designed the systems, launched products and quieted the operational noise.",
      author: "New Creator / Brand",
      role: "e.g., 500k Subscriber Podcaster",
      metrics: "e.g., +45% Revenue Scale"
    };
    setList([...list, fresh]);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setList(list.filter(t => t.id !== id));
  };

  return (
    <section id="testimonials" className="bg-[#030303] px-6 py-24 md:px-16 lg:px-24 border-b border-b-neutral-900 relative">
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] rounded-full bg-red-950/5 blur-[100px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        
        {/* Header Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-20 items-end">
          <div className="md:col-span-8">
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white">
              Client Testimonials
            </h2>
          </div>
          <div className="md:col-span-4 md:text-right flex flex-col items-start md:items-end gap-3">
            <span className="font-mono text-xs text-neutral-500 italic block">
              // Custom Sandbox: Add, Edit, or Populate your own quotes live
            </span>
            <button
              onClick={handleAddNew}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 border border-neutral-800 hover:border-red-500/30 text-xs font-mono text-neutral-400 hover:text-white transition-all rounded-sm"
              id="add-testimonial-btn"
            >
              <Plus className="w-3.5 h-3.5 text-red-500" />
              <span>Add Custom Quote</span>
            </button>
          </div>
        </div>

        {/* Testimonials Catalog Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {list.map((item, index) => {
            const beingEdited = isEditing === item.id;
            return (
              <motion.div
                id={`testimonial-card-${item.id}`}
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#050505] border border-neutral-900 hover:border-neutral-850 p-8 md:p-10 rounded-sm relative flex flex-col justify-between group transition-all duration-300 overflow-hidden"
              >
                {/* Visual quote indicator accent line */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-red-600 opacity-20 group-hover:opacity-100 transition-opacity" />

                <div>
                  <div className="flex justify-between items-center mb-8">
                    <Quote className="w-8 h-8 text-red-600/30" />
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {beingEdited ? (
                        <button
                          onClick={handleSave}
                          className="p-1 px-2 border border-emerald-500/30 bg-emerald-950/10 text-emerald-400 font-mono text-[9px] hover:bg-emerald-550 hover:text-white rounded-sm"
                          title="Save Changes"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditClick(item)}
                            className="p-1 border border-neutral-800 bg-neutral-900 hover:border-red-500/40 text-neutral-400 hover:text-red-500 rounded-sm transition-colors"
                            title="Edit Quote"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1 border border-neutral-800 bg-neutral-900 hover:border-red-600 text-neutral-400 hover:text-red-500 rounded-sm transition-colors"
                            title="Remove Quote"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Editable Fields Sandbox */}
                  {beingEdited ? (
                    <div className="space-y-3 mb-6">
                      <div>
                        <label className="block text-[9px] font-mono text-neutral-500 uppercase mb-1">Quote Description</label>
                        <textarea
                          rows={4}
                          value={editForm.quote || ""}
                          onChange={(e) => setEditForm({ ...editForm, quote: e.target.value })}
                          className="w-full bg-[#0d0d0d] border border-neutral-800 focus:border-red-500 p-2 text-xs text-white rounded-sm focus:outline-none focus:ring-0"
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-neutral-300 text-[14px] md:text-base leading-relaxed italic mb-8 font-light relative z-10">
                      "{item.quote}"
                    </p>
                  )}
                </div>

                {/* Footer block */}
                <div className="border-t border-neutral-900 pt-6 mt-auto">
                  {beingEdited ? (
                    <div className="space-y-2 font-mono text-[11px]">
                      <div>
                        <label className="block text-[8px] font-mono text-neutral-500 uppercase">Author Name</label>
                        <input
                          type="text"
                          value={editForm.author || ""}
                          onChange={(e) => setEditForm({ ...editForm, author: e.target.value })}
                          className="w-full bg-[#0d0d0d] border border-neutral-850 p-1.5 text-xs text-white rounded-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-mono text-neutral-500 uppercase">Role / Platform Scale</label>
                        <input
                          type="text"
                          value={editForm.role || ""}
                          onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                          className="w-full bg-[#0d0d0d] border border-neutral-850 p-1.5 text-xs text-white rounded-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-mono text-neutral-500 uppercase">Verification Metric</label>
                        <input
                          type="text"
                          value={editForm.metrics || ""}
                          onChange={(e) => setEditForm({ ...editForm, metrics: e.target.value })}
                          className="w-full bg-[#0d0d0d] border border-neutral-850 p-1.5 text-xs text-white rounded-sm"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-end">
                      <div className="space-y-0.5">
                        <span className="font-display text-sm font-semibold text-neutral-100 block">{item.author}</span>
                        <span className="font-mono text-[10px] text-neutral-500 block">{item.role}</span>
                      </div>
                      
                      <span className="shrink-0 font-mono text-xs font-bold text-red-500 border border-red-500/20 bg-red-950/15 py-1 px-2.5 rounded-sm">
                        {item.metrics}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
