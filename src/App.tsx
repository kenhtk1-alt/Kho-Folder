import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Unlock, Key, Terminal, ArrowRight, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VaultState, VirtualFolder } from './types';
import { Vault } from './components/Vault';
import { cn } from './lib/utils';

const App: React.FC = () => {
  const [appState, setAppState] = useState<VaultState>('locked');
  const [masterPassword, setMasterPassword] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [folders, setFolders] = useState<VirtualFolder[]>([]);

  // Load state from local storage on mount
  useEffect(() => {
    const savedPassword = localStorage.getItem('vault_master_pwd');
    const savedFolders = localStorage.getItem('vault_folders');
    
    if (!savedPassword) {
      setAppState('setup');
    } else {
      setMasterPassword(savedPassword);
      setAppState('locked');
    }

    if (savedFolders) {
      setFolders(JSON.parse(savedFolders));
    } else {
      // Default initial folders
      const initial: VirtualFolder[] = [
        { id: '1', name: 'Personal Records', type: 'folder', isLocked: true, isHidden: false, items: [], createdAt: Date.now() },
        { id: '2', name: 'Work Project X', type: 'folder', isLocked: false, isHidden: true, items: [], createdAt: Date.now() - 86400000 },
      ];
      setFolders(initial);
      localStorage.setItem('vault_folders', JSON.stringify(initial));
    }
  }, []);

  const saveFolders = (newFolders: VirtualFolder[]) => {
    setFolders(newFolders);
    localStorage.setItem('vault_folders', JSON.stringify(newFolders));
  };

  const handleSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    localStorage.setItem('vault_master_pwd', passwordInput);
    setMasterPassword(passwordInput);
    setAppState('unlocked');
    setPasswordInput('');
    setError(null);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === masterPassword) {
      setAppState('unlocked');
      setPasswordInput('');
      setError(null);
    } else {
      setError('AUTHENTICATION FAILED: ACCESS DENIED');
      setPasswordInput('');
    }
  };

  const handleLockToggle = (folderId: string) => {
    const newFolders = folders.map(f => 
      f.id === folderId ? { ...f, isLocked: !f.isLocked } : f
    );
    saveFolders(newFolders);
  };

  const handleHideToggle = (folderId: string) => {
    const newFolders = folders.map(f => 
      f.id === folderId ? { ...f, isHidden: !f.isHidden } : f
    );
    saveFolders(newFolders);
  };

  const handleAddFolder = (name: string) => {
    const newFolder: VirtualFolder = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      type: 'folder',
      isLocked: false,
      isHidden: false,
      items: [],
      createdAt: Date.now()
    };
    saveFolders([newFolder, ...folders]);
  };

  const handleDeleteFolder = (folderId: string) => {
    saveFolders(folders.filter(f => f.id !== folderId));
  };

  if (appState === 'unlocked') {
    return (
      <Vault 
        folders={folders}
        onLockToggle={handleLockToggle}
        onHideToggle={handleHideToggle}
        onAddFolder={handleAddFolder}
        onDeleteFolder={handleDeleteFolder}
        onLogout={() => setAppState('locked')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-page-bg text-text-main flex items-center justify-center p-6 font-sans">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#cbd5e1_0%,transparent_100%)]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="flex flex-col items-center mb-10 text-center">
          <motion.div 
            animate={{ 
              y: [0, -4, 0]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 bg-white rounded-2xl mb-4 shadow-xl shadow-brand-blue/10 flex items-center justify-center border border-border-subtle"
          >
            <ShieldCheck className="w-10 h-10 text-brand-blue" />
          </motion.div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Vanguard Shield</h1>
          <p className="text-[11px] font-bold tracking-widest text-text-muted uppercase mt-1">Enterprise Solution • v2.4.0</p>
        </div>

        <div className="bg-white border border-border-subtle p-8 rounded-2xl shadow-xl shadow-slate-200/50">
          <AnimatePresence mode="wait">
            {appState === 'setup' ? (
              <motion.div 
                key="setup"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-subtle">
                  <Key className="w-5 h-5 text-brand-blue" />
                  <h2 className="text-sm font-bold text-slate-800">Initial Configuration</h2>
                </div>
                <p className="text-xs text-text-muted leading-relaxed mb-6">
                  Create your master encryption key. This key is used to generate the virtual filesystem layer.
                </p>
                <form onSubmit={handleSetup} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-text-muted mb-2">Master Codephrase</label>
                    <input 
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full bg-page-bg border border-border-subtle p-3 rounded-xl text-sm focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 focus:outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 text-red-600 text-[11px] font-semibold rounded-lg">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      {error}
                    </div>
                  )}
                  <button type="submit" className="w-full bg-brand-blue text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-brand-blue/20 hover:bg-brand-blue/90 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 group">
                    Initialize System
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div 
                key="locked"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-subtle">
                  <Lock className="w-5 h-5 text-slate-800" />
                  <h2 className="text-sm font-bold text-slate-800">Identity Verification</h2>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-text-muted mb-2">Electronic Signature</label>
                    <div className="relative">
                      <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input 
                        autoFocus
                        type="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="Enter password"
                        className="w-full bg-page-bg border border-border-subtle pl-11 pr-4 py-3 rounded-xl text-sm focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 focus:outline-none transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 text-red-600 text-[11px] font-semibold rounded-lg">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      {error}
                    </div>
                  )}
                  <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-slate-900/10 hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2">
                    Unlock Resources
                    <Unlock className="w-4 h-4" />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 text-center flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-white border border-border-subtle rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Kernel Protection Active</span>
            </div>
            <p className="text-[10px] font-medium text-text-muted uppercase tracking-[.2em]">OS Version: Win10-x64-ENT</p>
        </div>
      </motion.div>
    </div>
  );
};

export default App;
