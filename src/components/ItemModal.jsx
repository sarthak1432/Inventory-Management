import React, { useState, useEffect } from 'react';
import { X, Save, Plus, ShieldCheck, Package, Layers, User, ChevronDown, CheckCircle2, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InputField = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-2 group">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 group-focus-within:text-indigo-600 transition-colors">
      {label}
    </label>
    <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
        <input 
            {...props}
            className="w-full glass-input rounded-2xl pl-12 pr-6 py-4 focus:outline-none font-semibold text-sm placeholder:text-slate-300 shadow-sm"
        />
    </div>
  </div>
);

const SelectField = ({ label, icon: Icon, options, value, onChange, name }) => (
  <div className="space-y-2 group">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 group-focus-within:text-indigo-600 transition-colors">
      {label}
    </label>
    <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
        <select 
            name={name}
            value={value}
            onChange={onChange}
            className="w-full glass-input rounded-2xl pl-12 pr-10 py-4 focus:outline-none font-semibold text-sm appearance-none cursor-pointer shadow-sm"
        >
            <option value="" disabled>Select Workspace...</option>
            {options.map(opt => (
                <option key={opt} value={opt} className="text-slate-900">{opt}</option>
            ))}
            <option value="Custom / Other..." className="text-indigo-600 font-bold italic">Custom Laboratory...</option>
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-indigo-600 transition-colors" size={16} />
    </div>
  </div>
);

const SectionHeader = ({ icon: Icon, title, description }) => (
    <div className="flex items-center gap-3 pb-2 border-b border-slate-100 mb-6">
        <div className="p-2 rounded-xl bg-slate-50 text-slate-500 border border-slate-100 shadow-sm">
            <Icon size={16} />
        </div>
        <div>
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">{title}</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{description}</p>
        </div>
    </div>
);

const ItemModal = ({ isOpen, onClose, onSave, editingItem, departments }) => {
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    customDepartment: '',
    quantity: 0,
    assignee: '',
    assignTo: ''
  });

  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    if (editingItem) {
      const isPredefined = departments.includes(editingItem.department);
      setFormData({
        ...editingItem,
        customDepartment: isPredefined ? '' : editingItem.department,
        department: isPredefined ? editingItem.department : "Custom / Other...",
        assignTo: editingItem.assignTo || ''
      });
      setIsCustom(!isPredefined);
    } else {
      setFormData({
        name: '',
        department: '',
        customDepartment: '',
        quantity: 0,
        assignee: '',
        assignTo: ''
      });
      setIsCustom(false);
    }
  }, [editingItem, isOpen, departments]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = { ...formData };
    if (isCustom) {
        finalData.department = formData.customDepartment || "Manual Entry";
    }
    delete finalData.customDepartment;
    onSave(finalData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'department') {
        if (value === "Custom / Other...") {
            setIsCustom(true);
        } else {
            setIsCustom(false);
        }
    }

    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-10 pointer-events-none">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md pointer-events-auto"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            className="relative w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] glass-panel rounded-[1.5rem] sm:rounded-[2.5rem] shadow-[0_25px_80px_-15px_rgba(0,0,0,0.3)] overflow-hidden pointer-events-auto flex flex-col"
          >
            {/* Header with Gradient */}
            <div className="p-6 sm:p-8 lg:p-12 relative overflow-hidden bg-white/40">
              <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-5">
                      <motion.div 
                        initial={{ rotate: -20, scale: 0.8 }}
                        animate={{ rotate: 0, scale: 1 }}
                        className="w-12 h-12 sm:w-16 sm:h-16 gradient-bg rounded-2xl sm:rounded-3xl shadow-xl shadow-indigo-500/20 flex items-center justify-center text-white"
                      >
                        <Package size={24} className="sm:hidden" />
                        <Package size={32} className="hidden sm:block" />
                      </motion.div>
                      <div>
                        <h2 className="text-lg sm:text-2xl font-black text-slate-900 leading-tight">
                            {editingItem ? 'Update Asset' : 'Registry Entry'}
                        </h2>
                        <div className="flex items-center gap-2 mt-1 px-3 py-1 bg-white/60 border border-white/80 rounded-full w-fit">
                            <ShieldCheck size={12} className="text-indigo-600" />
                            <span className="text-[10px] font-black text-indigo-700 tracking-widest uppercase">System Validation: Secured</span>
                        </div>
                      </div>
                  </div>
                  <button 
                    onClick={onClose} 
                    className="p-3 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all text-slate-400 group"
                  >
                    <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                  </button>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/30 blur-[100px] rounded-full -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-100/30 blur-[80px] rounded-full -ml-16 -mb-16" />
            </div>

            {/* Form Body + Footer Combined for proper submission */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
                <div className="flex-grow overflow-y-auto px-6 sm:px-8 lg:px-12 py-6 space-y-10 custom-scrollbar">
                
                {/* SECTION: Asset Definition */}
                <section className="space-y-6">
                    <SectionHeader icon={Plus} title="Asset Definition" description="Core identity of the resource" />
                    <div className="grid grid-cols-1 gap-6">
                    <InputField 
                            label="Asset Name" 
                            icon={Package} 
                            name="name"
                            required
                            placeholder="e.g. MacBook Pro M3"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                </section>

                {/* SECTION: Assignment & Location */}
                <section className="space-y-6">
                    <SectionHeader icon={Layers} title="Operational Context" description="Where and who manages this asset" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SelectField 
                            label="Assigned Workspace" 
                            icon={Layers} 
                            name="department"
                            options={departments}
                            value={formData.department}
                            onChange={handleChange}
                        />
                        <InputField 
                            label="Custody / Responsible" 
                            icon={User} 
                            name="assignee"
                            placeholder="Enter name..."
                            value={formData.assignee}
                            onChange={handleChange}
                        />
                    </div>
                    
                    <AnimatePresence>
                        {(isCustom || formData.department === 'AI Lab') && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0, y: -10 }}
                                animate={{ height: 'auto', opacity: 1, y: 0 }}
                                exit={{ height: 0, opacity: 0, y: -10 }}
                                className="space-y-6 overflow-hidden pt-2"
                            >
                                {isCustom && (
                                    <InputField 
                                        label="Custom Location Override" 
                                        icon={Plus} 
                                        name="customDepartment"
                                        required
                                        placeholder="Enter laboratory/office name..."
                                        value={formData.customDepartment}
                                        onChange={handleChange}
                                    />
                                )}
                                {formData.department === 'AI Lab' && (
                                    <InputField 
                                        label="Assignment Personnel" 
                                        icon={User} 
                                        name="assignTo"
                                        placeholder="Secondary assignee..."
                                        value={formData.assignTo}
                                        onChange={handleChange}
                                    />
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {/* SECTION: Quantitative Data */}
                <section className="space-y-6 pb-6">
                    <SectionHeader icon={CheckCircle2} title="Inventory Metrics" description="Availability data" />
                    <div className="grid grid-cols-1 gap-6">
                        <InputField 
                            label="Operational Quantity" 
                            icon={Package} 
                            type="number"
                            name="quantity"
                            required
                            min="0"
                            value={formData.quantity}
                            onChange={handleChange}
                        />
                    </div>
                </section>
                </div>

                {/* Action Footer - Stacking on Mobile */}
                <div className="px-6 sm:px-8 lg:px-12 py-6 sm:py-8 bg-white/40 border-t border-white/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button 
                    type="button" 
                    onClick={onClose}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-white/80 bg-white/60 hover:bg-white hover:shadow-lg transition-all font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 hover:text-slate-800 order-2 sm:order-1"
                    >
                        Discard Changes
                    </button>
                    <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    className="w-full sm:w-auto px-12 py-4 rounded-2xl gradient-bg gradient-bg-hover text-white font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-indigo-200 order-1 sm:order-2"
                    >
                    <Save size={18} />
                    {editingItem ? 'Commit Updates' : 'Sync Gateway'}
                    </motion.button>
                </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ItemModal;
