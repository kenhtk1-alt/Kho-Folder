import React, { useState } from 'react';
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
  Trash2,
  Activity,
  UploadCloud,
  FileCode,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VirtualFolder } from '../types';
import { cn } from '../lib/utils';

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
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [showHidden, setShowHidden] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const currentFolder = folders.find(f => f.id === selectedFolderId);

  const filteredFolders = folders.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase()) && 
    (showHidden || !f.isHidden || search.length > 0)
  );

  const handleLock = async (id: string, name: string, isLocked: boolean) => {
    try {
      // @ts-ignore
      if (window.electronAPI) {
        // @ts-ignore
        await window.electronAPI.lockFolder(`C:\\Protected\\${name}`);
      }
      onLockToggle(id);
      showNotification(`${isLocked ? 'Đã mở khoá' : 'Đã khoá'} thành công thư mục ${name}`);
    } catch (e) {
      showNotification(`Lỗi hệ thống khi truy cập folder!`);
    }
  };

  const handleHide = async (id: string, name: string, isHidden: boolean) => {
    try {
      // @ts-ignore
      if (window.electronAPI) {
        const path = `C:\\Protected\\${name}`; // In real app, this would be the actual path
        // @ts-ignore
        if (isHidden) await window.electronAPI.unhideFolder(path);
        // @ts-ignore
        else await window.electronAPI.hideFolder(path);
      }
      onHideToggle(id);
      showNotification(`${isHidden ? 'Đã hiện' : 'Đã ẩn'} thực thể ${name} khỏi hệ thống Windows`);
    } catch (e) {
      showNotification(`Không thể truy cập quyền hệ thống (Thử chạy Admin)`);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      onAddFolder(newFolderName.trim());
      setNewFolderName('');
      setIsAdding(false);
      showNotification(`Đã thêm thư mục bảo vệ ${newFolderName}`);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const name = files[0].name;
      onAddFolder(name);
      showNotification(`Đã nhập và bảo vệ: ${name}`);
    }
  };

  return (
    <div 
      className="flex h-screen bg-page-bg text-text-main overflow-hidden font-sans"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="absolute top-8 left-1/2 -translate-x-1/2 z-[60] bg-slate-900 border border-slate-700 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[300px]"
          >
            <ShieldCheck className="w-6 h-6 text-brand-blue" />
            <span className="font-bold text-sm uppercase tracking-tight">{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drag overlay */}
      <AnimatePresence>
        {isDragging && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-brand-blue/90 flex flex-col items-center justify-center text-white p-12"
          >
            <div className="absolute inset-8 border-8 border-dashed border-white/30 rounded-[3rem] animate-pulse" />
            <UploadCloud className="w-32 h-32 mb-8 animate-bounce" />
            <h2 className="text-5xl font-black uppercase italic tracking-tighter">THẢ ĐỂ BẢO VỆ</h2>
            <p className="text-white/70 font-bold mt-4 text-xl">Dữ liệu sẽ được đưa vào vùng ảo ngay lập tức</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className="w-[260px] bg-sidebar-bg text-white flex flex-col border-r border-slate-800 shrink-0">
        <div className="p-8 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-blue rounded-2xl flex items-center justify-center shadow-2xl shadow-brand-blue/20">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black leading-none tracking-tight">VANGUARD</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1.5">Security x64</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-8">
          <div 
            onClick={() => setSelectedFolderId(null)}
            className={cn(
              "px-8 py-4 flex items-center gap-4 text-sm cursor-pointer transition-all border-l-4",
              !selectedFolderId ? "bg-white/10 text-white border-brand-blue font-bold" : "text-slate-500 border-transparent hover:bg-white/5 hover:text-white"
            )}
          >
            <Activity className="w-4 h-4" />
            Bảng điều khiển
          </div>
          <div className="px-8 py-4 flex items-center gap-4 text-sm text-slate-500 hover:bg-white/5 hover:text-white cursor-pointer transition-all border-l-4 border-transparent">
            <Folder className="w-4 h-4" />
            Thư mục bảo vệ
          </div>
          <div className="px-8 py-4 flex items-center gap-4 text-sm text-slate-500 hover:bg-white/5 hover:text-white cursor-pointer transition-all border-l-4 border-transparent">
            <Lock className="w-4 h-4" />
            Kho mã hoá
          </div>
          <div className="px-8 py-4 flex items-center gap-4 text-sm text-slate-500 hover:bg-white/5 hover:text-white cursor-pointer transition-all border-l-4 border-transparent">
            <Settings className="w-4 h-4" />
            Cài đặt hệ thống
          </div>
        </nav>

        <div className="p-8 mt-auto">
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Shield Status</span>
               <span className="text-[10px] text-green-400 font-black px-2 py-1 bg-green-400/10 rounded-lg">ACTIVE</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "95%" }}
                className="h-full bg-brand-blue shadow-[0_0_15px_#2563EB]" 
              />
            </div>
            <p className="text-[10px] text-slate-600 mt-4 font-bold uppercase tracking-wider">Kernel Protection Active</p>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-24 bg-white border-b border-border-subtle flex items-center justify-between px-10 shrink-0">
          <div className="flex items-center gap-6">
            {selectedFolderId && (
              <button 
                onClick={() => setSelectedFolderId(null)}
                className="w-12 h-12 flex items-center justify-center hover:bg-slate-100 rounded-2xl transition-all border border-slate-100"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
            )}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                <span>ROOT</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-brand-blue">{selectedFolderId ? "EXPLORER" : "DASHBOARD"}</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5 uppercase">
                {selectedFolderId ? currentFolder?.name : "Folder Protector Pro"}
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowHidden(!showHidden)}
              className={cn(
                "px-5 py-2.5 text-[10px] font-black uppercase tracking-widest border rounded-2xl transition-all",
                showHidden ? "bg-slate-900 text-white border-slate-800 shadow-xl" : "bg-white text-slate-400 border-slate-100 hover:bg-slate-50"
              )}
            >
              {showHidden ? 'Đang hiện thư mục ẩn' : 'Đang ẩn thư mục ẩn'}
            </button>
            <div className="relative mr-4 hidden 2xl:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                type="text" 
                placeholder="Tìm thực thể bảo mật..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-page-bg border border-border-subtle pl-12 pr-6 py-3 rounded-2xl text-sm w-72 focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue transition-all font-bold"
              />
            </div>
            <button 
              onClick={onLogout}
              className="px-6 py-3 text-sm font-black border border-border-subtle rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-3 uppercase tracking-tighter"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
            <button 
              onClick={() => setIsAdding(true)}
              className="px-6 py-3 bg-brand-blue text-white text-sm font-black rounded-2xl hover:bg-brand-blue/90 shadow-2xl shadow-brand-blue/20 transition-all flex items-center gap-3 uppercase tracking-tighter"
            >
              <Plus className="w-4 h-4" />
              Protect
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-10 bg-[#F1F5F9]">
          <div className="max-w-7xl mx-auto">
            {!selectedFolderId ? (
              <div className="space-y-10">
                {/* Hero Status */}
                <div className="bg-slate-900 rounded-[3rem] p-10 text-white flex justify-between items-center shadow-3xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/30 to-transparent opacity-50 pointer-events-none" />
                  <div className="relative z-10">
                    <h2 className="text-4xl font-black italic tracking-tighter mb-4 uppercase">Trạng thái bảo vệ: MAX</h2>
                    <p className="text-slate-400 text-xl font-medium max-w-lg leading-relaxed">
                      Đang ảo hoá <strong className="text-white underline decoration-brand-blue decoration-4 underline-offset-8">{folders.length} thư mục</strong>. Hệ thống tự động mã hoá AES-256 các tập tin mới được thêm vào.
                    </p>
                    <div className="flex gap-4 mt-8">
                       <div className="px-5 py-2.5 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-brand-blue">Active Layer Active</div>
                       <div className="px-5 py-2.5 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-green-500">Kernel Hook Active</div>
                    </div>
                  </div>
                  <div className="text-right relative z-10 hidden md:block">
                    <div className="text-xs font-black uppercase tracking-[0.4em] text-white/40 mb-2">Protection Level</div>
                    <div className="text-6xl font-black text-brand-blue drop-shadow-[0_0_20px_rgba(37,99,235,0.5)]">S-TIER</div>
                  </div>
                </div>

                {/* Folder Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <AnimatePresence mode="popLayout">
                    {isAdding && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white border-4 border-dashed border-brand-blue/20 p-10 rounded-[2.5rem] flex flex-col justify-center items-center gap-8 min-h-[320px] shadow-2xl"
                      >
                        <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center">
                           <Folder className="w-10 h-10 text-brand-blue" />
                        </div>
                        <form onSubmit={handleCreate} className="w-full">
                          <input 
                            autoFocus
                            type="text"
                            placeholder="Nhập tên thư mục muốn bảo vệ..."
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl text-base mb-6 focus:outline-none focus:ring-8 focus:ring-brand-blue/5 focus:border-brand-blue transition-all font-bold"
                          />
                          <div className="flex gap-4">
                            <button type="submit" className="flex-1 bg-brand-blue text-white py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-brand-blue/90 shadow-xl shadow-brand-blue/20 transition-all">Protect</button>
                            <button type="button" onClick={() => setIsAdding(false)} className="flex-1 border border-slate-200 py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-slate-50 transition-all text-slate-500">Cancel</button>
                          </div>
                        </form>
                      </motion.div>
                    )}

                    {filteredFolders.map((folder) => (
                      <motion.div
                        key={folder.id}
                        layoutId={folder.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={cn(
                          "bg-white p-8 rounded-[2.5rem] shadow-xl hover:shadow-3xl transition-all flex flex-col gap-8 group cursor-pointer relative overflow-hidden border border-slate-100",
                          folder.isHidden && "opacity-40"
                        )}
                        onClick={() => !folder.isLocked && setSelectedFolderId(folder.id)}
                      >
                        <div className="flex justify-between items-start relative z-10">
                          <div className={cn(
                            "w-16 h-16 rounded-3xl flex items-center justify-center text-4xl transition-all group-hover:scale-110 shadow-sm",
                            folder.isLocked ? "bg-red-50 text-red-500 text-[2rem]" : folder.isHidden ? "bg-slate-100 text-slate-400" : "bg-blue-50 text-brand-blue"
                          )}>
                            {folder.isLocked ? "🔐" : folder.isHidden ? "📁" : "📂"}
                          </div>
                          
                          <div className="flex flex-col items-end gap-2">
                            <AnimatePresence>
                              {folder.isLocked && (
                                <motion.span 
                                  initial={{ x: 30, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  className="px-4 py-1.5 bg-red-100 text-red-700 text-[10px] font-black uppercase rounded-full shadow-lg border border-red-200"
                                >
                                  LOCKED
                                </motion.span>
                              )}
                              {folder.isHidden && (
                                <motion.span 
                                  initial={{ x: 30, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  className="px-4 py-1.5 bg-slate-200 text-slate-700 text-[10px] font-black uppercase rounded-full shadow-lg"
                                >
                                  HIDDEN
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        <div className="relative z-10">
                          <h3 className="font-black text-slate-900 text-xl group-hover:text-brand-blue transition-colors uppercase tracking-tight">{folder.name}</h3>
                          <p className="text-xs text-slate-400 mt-2 font-mono font-bold uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                            VAULT_DISK_X
                          </p>
                        </div>

                        <div className="flex gap-3 pt-4 relative z-10" onClick={e => e.stopPropagation()}>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleLock(folder.id, folder.name, folder.isLocked); }}
                            className={cn(
                              "flex-1 py-3.5 px-4 border rounded-2xl text-[10px] font-black uppercase tracking-tighter transition-all flex items-center justify-center gap-2",
                              folder.isLocked ? "bg-red-600 text-white border-red-600 shadow-xl shadow-red-200" : "bg-white border-slate-200 hover:bg-slate-50"
                            )}
                          >
                            {folder.isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                            {folder.isLocked ? 'Mở khoá' : 'Khoá'}
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleHide(folder.id, folder.name, folder.isHidden); }}
                            className={cn(
                              "flex-1 py-3.5 px-4 border rounded-2xl text-[10px] font-black uppercase tracking-tighter transition-all flex items-center justify-center gap-2",
                              folder.isHidden ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200" : "bg-white border-slate-200 hover:bg-slate-50"
                            )}
                          >
                            {folder.isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            {folder.isHidden ? 'Hiện' : 'Ẩn'}
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onDeleteFolder(folder.id); showNotification(`Đã xoá: ${folder.name}`); }}
                            className="p-3.5 text-red-500 border border-ref-50 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {folder.isLocked && (
                          <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] flex items-center justify-center pointer-events-none border-4 border-red-500/20 rounded-[2.5rem]">
                            <motion.div 
                              initial={{ scale: 3, opacity: 0 }}
                              animate={{ scale: 1.5, opacity: 0.1 }}
                              className="text-red-600"
                            >
                              <Lock className="w-64 h-64" />
                            </motion.div>
                          </div>
                        )}
                      </motion.div>
                    ))}

                    {filteredFolders.length === 0 && !isAdding && (
                      <div 
                        onClick={() => setIsAdding(true)}
                        className="col-span-full h-80 border-4 border-dashed border-slate-300 rounded-[3.5rem] flex flex-col items-center justify-center cursor-pointer hover:border-brand-blue hover:bg-white transition-all group overflow-hidden relative"
                      >
                         <div className="absolute inset-0 bg-slate-100/30 group-hover:bg-blue-50/20 transition-colors" />
                         <div className="relative z-10 flex flex-col items-center">
                            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:shadow-2xl transition-all mb-6 border border-slate-50">
                                <Plus className="w-12 h-12 text-slate-200 group-hover:text-brand-blue" />
                            </div>
                            <span className="font-black text-slate-400 group-hover:text-slate-900 transition-colors uppercase tracking-[0.3em] text-[10px]">Kéo thả tệp tin hoặc Folder</span>
                         </div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
                    <div className="flex items-center justify-between bg-white p-10 rounded-[3rem] shadow-xl border border-slate-50">
                        <div className="flex items-center gap-8">
                            <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center text-5xl shadow-2xl shadow-blue-100">
                                📂
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{currentFolder?.name}</h2>
                                <p className="text-slate-400 text-base font-bold mt-2 font-mono uppercase tracking-widest">PATH: C:\Protected_Folder\{currentFolder?.name}</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                             <button className="px-8 py-4 bg-brand-blue text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-2xl shadow-brand-blue/20 hover:scale-105 transition-all flex items-center gap-3">
                                <Plus className="w-4 h-4" /> Thêm tệp tin
                             </button>
                             <button 
                                onClick={() => setSelectedFolderId(null)}
                                className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                             >
                                Đóng
                             </button>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-2xl">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">
                                <tr>
                                    <th className="px-10 py-6">Đối tượng bảo mật</th>
                                    <th className="px-10 py-6">Kích thước</th>
                                    <th className="px-10 py-6">Ngày thêm</th>
                                    <th className="px-10 py-6 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                <tr className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-5">
                                            <div className="p-3 bg-blue-50 rounded-xl text-brand-blue">
                                                <FileCode className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-slate-800 uppercase tracking-tight">secret_key_v1.enc</div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Mã hoá AES-256</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-xs font-mono font-black text-slate-500">45 KB</td>
                                    <td className="px-10 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">14/05/2026</td>
                                    <td className="px-10 py-6 text-right">
                                        <button className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="p-20 flex flex-col items-center justify-center text-slate-300 bg-slate-50/30">
                            <div className="w-24 h-24 bg-white border border-slate-100 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                                <UploadCloud className="w-10 h-10 opacity-30 animate-pulse" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] italic">Kéo thả tệp tin vào đây để mã hoá</p>
                        </div>
                    </div>
                </div>
            )}
          </div>
        </main>

        {/* Status Bar */}
        <footer className="h-12 bg-white border-t border-border-subtle px-10 flex items-center justify-between text-[10px] text-slate-500 shrink-0 font-black uppercase tracking-[0.2em]">
          <div className="flex gap-8 items-center">
            <span className="flex items-center gap-3">
              <img src="https://img.icons8.com/color/48/windows-10.png" className="w-5 h-5" alt="Win10" />
              Windows 10 x64 Secure Environment
            </span>
            <span className="opacity-20 text-lg">/</span>
            <span className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-brand-blue" />
                V-Module: <span className="text-slate-800">VAULT:0x1F2A3B</span>
            </span>
          </div>
          <div className="flex items-center gap-10">
            <span className="font-mono text-slate-400 tracking-tighter">System Secured: 100% | VT-x Enable</span>
            <div className="flex items-center gap-2.5 text-green-600 font-black">
               <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
               </span>
               SYSTEM ENCRYPTED
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
