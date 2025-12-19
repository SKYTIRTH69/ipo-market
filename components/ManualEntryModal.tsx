import React, { useState } from 'react';
import { IPOData, IPOStatus, Registrar } from '../types';
import { REGISTRAR_OPTIONS } from '../constants';

interface ManualEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ipo: IPOData) => void;
}

const ManualEntryModal: React.FC<ManualEntryModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    registrar: Registrar.LINKINTIME,
    gmp: '',
    subscription: '',
    allotmentDate: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: `manual-${Date.now()}`,
      name: formData.name,
      registrar: formData.registrar,
      status: IPOStatus.OPEN, // Default
      gmp: formData.gmp || 'N/A',
      subscription: formData.subscription || 'N/A',
      allotmentDate: formData.allotmentDate,
      source: 'Manual'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-4">Add Missing IPO</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Company Name</label>
            <input 
              type="text" 
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Registrar</label>
            <select
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.registrar}
              onChange={e => setFormData({...formData, registrar: e.target.value as Registrar})}
            >
              {REGISTRAR_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">GMP (Est)</label>
              <input 
                type="text" 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="+50 (10%)"
                value={formData.gmp}
                onChange={e => setFormData({...formData, gmp: e.target.value})}
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Subscription</label>
              <input 
                type="text" 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="10x"
                value={formData.subscription}
                onChange={e => setFormData({...formData, subscription: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-2 flex space-x-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors"
            >
              Add IPO
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualEntryModal;