import React, { useState, useEffect } from 'react';
import { 
  Folder, 
  ChevronRight, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Plus, 
  Search, 
  Settings, 
  LogOut, 
  ShieldCheck,
  FileText,
  Trash2,
  MoreVertical,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VirtualFolder, VirtualFile } from '../types';
import { cn, formatBytes } from '../lib/utils';
import { format } from 'date-fns';

interface VaultProps {
  folders: VirtualFolder[];
  onLockToggle: (folderId: string) => void;
  onHideToggle: (folderId: string) => void;
  onAddFolder: (name: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onLogout: () => void;
}

export const Vault: React.FC<VaultProps> = ({ 
  folders, 
  onLockToggle, 
  onHideToggle, 
  onAddFolder, 
  onDeleteFolder,
  onLogout 
}) => {
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const filteredFolders = folders.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase()) && (!f.isHidden || search.length > 0)
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      onAddFolder(newFolderName.trim());
      setNewFolderName('');
      setIsAdding(false);
    }
  };

  return (
    <div className="flex h-screen bg-page-bg text-text-main overflow-hidden">
      {/* Sidebar - Vanguard Shield Style */}
      <aside className="w-[240px] bg-sidebar-bg text-white flex flex-col border-r border-slate-800 shrink-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-[17px] font-bold leading-tight">Vanguard Shield</h1>
              <p className="text-[10px] text-slate-400 font-mono tracking-tighter mt-0.5">PROTECTED FOLDER v2.4.0</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4">
          <div className={cn("px-6 py-3 flex items-center gap-3 text-sm cursor-pointer transition-colors bg-white/10 text-white font-medium")}>
            <Activity className="w-4 h-4 opacity-70" />
            Dashboard
          </div>
          <div className="px-6 py-3 flex items-center gap-3 text-sm text-slate-400 hover:bg-white/5 hover:text-white cursor-pointer transition-colors">
            <Folder className="w-4 h-4 opacity-70" />
            Protected Folders
          </div>
          <div className="px-6 py-3 flex items-center gap-3 text-sm text-slate-400 hover:bg-white/5 hover:text-white cursor-pointer transition-colors">
            <Lock className="w-4 h-4 opacity-70" />
            Encryption Vault
          </div>
          <div className="px-6 py-3 flex items-center gap-3 text-sm text-slate-400 hover:bg-white/5 hover:text-white cursor-pointer transition-colors">
            <Settings className="w-4 h-4 opacity-70" />
            Security Logs
          </div>
        </nav>

        <div className="p-6 bg-slate-800/50 mt-auto">
          <div className="flex justify-between items-center mb-2">
             <span className="text-xs text-slate-300">Master Key Status</span>
             <span className="text-[10px] text-green-400 font-bold uppercase">Locked</span>
          </div>
          <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full w-[85%] bg-green-500 rounded-full" />
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Identity Verified</p>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-border-subtle flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-text-muted">Security Overview /</span>
            <span className="font-semibold text-text-main">Dashboard</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative mr-4 hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                type="text" 
                placeholder="Search resources..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-page-bg border border-border-subtle pl-10 pr-4 py-2 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
              />
            </div>
            <button 
              onClick={onLogout}
              className="px-4 py-2 text-sm font-medium border border-border-subtle rounded-lg hover:bg-page-bg transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Exit Secure Layer
            </button>
            <button 
              onClick={() => setIsAdding(true)}
              className="px-4 py-2 bg-brand-blue text-white text-sm font-semibold rounded-lg hover:bg-brand-blue/90 shadow-[0_1px_2px_rgba(37,99,235,0.1)] transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Protect New Folder
            </button>
          </div>
        </header>

        {/* Content Section */}
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Status Hero Card */}
            <div className="bg-brand-blue rounded-xl p-6 text-white flex justify-between items-center shadow-[0_4px_12px_rgba(37,99,235,0.15)]">
              <div>
                <h2 className="text-2xl font-bold">Protection Active</h2>
                <p className="opacity-90 mt-1 max-w-md">{folders.length} folders are currently shielded from unauthorized access with kernel-level virtualization.</p>
              </div>
              <div className="text-right">
                <div className="text-xs opacity-70 uppercase font-bold tracking-widest">System Integrity</div>
                <div className="text-2xl font-black mt-1">100% SECURE</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {isAdding && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white border-2 border-dashed border-border-subtle p-6 rounded-xl flex flex-col justify-center items-center gap-4 min-h-[220px]"
                  >
                    <div className="w-12 h-12 bg-page-bg rounded-full flex items-center justify-center">
                       <Folder className="w-6 h-6 text-brand-blue" />
                    </div>
                    <form onSubmit={handleCreate} className="w-full">
                      <input 
                        autoFocus
                        type="text"
                        placeholder="Path or Folder Name"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        className="w-full bg-page-bg border border-border-subtle p-3 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                      />
                      <div className="flex gap-2">
                        <button type="submit" className="flex-1 bg-brand-blue text-white py-2 rounded-lg text-sm font-semibold hover:bg-brand-blue/90">Protect</button>
                        <button type="button" onClick={() => setIsAdding(false)} className="flex-1 border border-border-subtle py-2 rounded-lg text-sm font-medium hover:bg-page-bg">Cancel</button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {filteredFolders.map((folder) => (
                  <motion.div
                    key={folder.id}
                    layoutId={folder.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white border border-border-subtle p-5 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col gap-4 group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="text-3xl">
                        {folder.isLocked ? "🔐" : folder.isHidden ? "📁" : "📂"}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {folder.isLocked && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[10px] font-bold uppercase rounded-full">Locked</span>
                        )}
                        {folder.isHidden && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[10px] font-bold uppercase rounded-full">Hidden</span>
                        )}
                        {!folder.isLocked && !folder.isHidden && (
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-800 text-[10px] font-bold uppercase rounded-full">Secured</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-text-main text-[15px]">{folder.name}</h3>
                      <p className="text-xs text-text-muted mt-0.5 truncate font-mono">
                        C:\Protected\{folder.name.replace(/\s+/g, '_')}
                      </p>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button 
                        onClick={() => onLockToggle(folder.id)}
                        className="flex-1 py-1.5 px-3 border border-border-subtle rounded-lg text-sm font-medium hover:bg-page-bg transition-colors"
                      >
                        {folder.isLocked ? 'Unlock' : 'Lock'}
                      </button>
                      <button 
                        onClick={() => onHideToggle(folder.id)}
                        className="flex-1 py-1.5 px-3 border border-border-subtle rounded-lg text-sm font-medium hover:bg-page-bg transition-colors"
                      >
                        {folder.isHidden ? 'Reveal' : 'Hide'}
                      </button>
                      <button 
                        onClick={() => onDeleteFolder(folder.id)}
                        className="px-2 border border-red-100 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                        title="Delete Protection"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}

                {filteredFolders.length === 0 && !isAdding && (
                  <div 
                    onClick={() => setIsAdding(true)}
                    className="col-span-full h-48 border-2 border-dashed border-border-subtle rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white transition-colors group"
                  >
                    <Plus className="w-8 h-8 text-text-muted group-hover:text-brand-blue group-hover:scale-110 transition-all mb-2" />
                    <span className="font-semibold text-text-muted group-hover:text-text-main">Protect New Folder Path</span>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>

        {/* Footer Status Bar */}
        <footer className="h-9 bg-white border-t border-border-subtle px-6 flex items-center justify-between text-[11px] text-text-muted shrink-0">
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5">
              <img src="https://img.icons8.com/color/48/windows-10.png" className="w-3.5 h-3.5" alt="Win10" />
              Windows 10 Pro 64-bit | Build 19045
            </span>
            <span className="opacity-50">|</span>
            <span>Virtualization: ENABLED (VT-x)</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 font-mono">
              CPU: 14% | RAM: 1.2GB
            </span>
            <div className="flex items-center gap-1.5 font-semibold text-green-600">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22C55E]" />
               SYSTEM ENCRYPTED
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
