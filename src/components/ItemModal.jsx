import React, { useState, useEffect } from 'react';
import { X, Save, Plus, ShieldCheck, Package, Layers, User, ChevronDown, CheckCircle2, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InputField = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-1.5 focus-within:text-indigo-600 transition-colors">
    <label className="text-xs font-semibold text-slate-600">
      {label}
    </label>
    <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
        <input 
            {...props}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-medium text-sm placeholder:text-slate-400 transition-all shadow-sm"
        />
    </div>
  </div>
);

const SelectField = ({ label, icon: Icon, options, value, onChange, name }) => (
  <div className="space-y-1.5 focus-within:text-indigo-600 transition-colors">
    <label className="text-xs font-semibold text-slate-600">
      {label}
    </label>
    <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
        <select 
            name={name}
            value={value}
            onChange={onChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-10 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-medium text-sm appearance-none cursor-pointer shadow-sm transition-all text-slate-700"
        >
            <option value="" disabled>Select Department...</option>
            {options.map(opt => (
                <option key={opt} value={opt} className="text-slate-900">{opt}</option>
            ))}
            <option value="Custom / Other..." className="text-indigo-600 font-medium">Custom Department...</option>
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                      <div className="w-12 h-12 gradient-bg rounded-lg shadow-sm flex items-center justify-center text-white">
                        <Package size={24} />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-800">
                            {editingItem ? 'Update Stock Item' : 'Add New Stock'}
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {editingItem ? 'Modify existing inventory details' : 'Enter details for the new inventory item'}
                        </p>
                      </div>
                  </div>
                  <button 
                    onClick={onClose} 
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
                  >
                    <X size={20} />
                  </button>
              </div>

            {/* Form Body + Footer Combined for proper submission */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
                <div className="flex-grow overflow-y-auto px-6 py-6 sm:px-8 space-y-6 custom-scrollbar bg-white">
                
                {/* Compact Grid Structure for Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    {/* Full Width Row */}
                    <div className="md:col-span-2">
                        <InputField 
                            label="Item Name" 
                            icon={Package} 
                            name="name"
                            required
                            placeholder="e.g. MacBook Pro M3"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    
                    {/* Numerical Data */}
                    <div>
                        <InputField 
                            label="Quantity" 
                            icon={Layers} 
                            type="number"
                            name="quantity"
                            required
                            min="0"
                            value={formData.quantity}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="md:col-span-2 border-t border-slate-100 pt-5 mt-2">
                        <h3 className="text-sm font-bold text-slate-800 mb-4">Assignment Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                            <SelectField 
                                label="Department" 
                                icon={Layers} 
                                name="department"
                                options={departments}
                                value={formData.department}
                                onChange={handleChange}
                            />
                            <InputField 
                                label="Assigned Personnel" 
                                icon={User} 
                                name="assignee"
                                placeholder="Enter name (optional)..."
                                value={formData.assignee}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    
                    <AnimatePresence>
                        {(isCustom || formData.department === 'AI Lab') && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="md:col-span-2 space-y-5 overflow-hidden"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mt-5">
                                    {isCustom && (
                                        <InputField 
                                            label="Custom Department Name" 
                                            icon={Plus} 
                                            name="customDepartment"
                                            required
                                            placeholder="Enter department name..."
                                            value={formData.customDepartment}
                                            onChange={handleChange}
                                        />
                                    )}
                                    {formData.department === 'AI Lab' && (
                                        <InputField 
                                            label="Secondary Assignee" 
                                            icon={User} 
                                            name="assignTo"
                                            placeholder="Secondary assignee..."
                                            value={formData.assignTo}
                                            onChange={handleChange}
                                        />
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                </div>

                {/* Action Footer */}
                <div className="px-6 py-4 sm:px-8 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-end gap-3">
                    <button 
                    type="button" 
                    onClick={onClose}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all font-semibold text-sm text-slate-600 order-2 sm:order-1"
                    >
                        Cancel
                    </button>
                    <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    className="w-full sm:w-auto px-8 py-3 rounded-xl gradient-bg gradient-bg-hover text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md order-1 sm:order-2"
                    >
                    <Save size={18} />
                    {editingItem ? 'Save Changes' : 'Add Stock'}
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
