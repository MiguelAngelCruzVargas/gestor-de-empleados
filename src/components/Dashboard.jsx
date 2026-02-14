import React, { useState } from 'react';
import {
    User, Plus, LogOut, Briefcase, Trash2,
    ExternalLink, QrCode, Activity, Loader2,
    Search, Filter, MoreVertical, Copy, Check, X, ShieldCheck, PenLine
} from 'lucide-react';

export default function Dashboard({
    employees,
    loading,
    onAdd,
    onEdit,
    onLogout,
    onDelete,
    onViewCard,
    onRefresh,
    showNotification
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [copyingId, setCopyingId] = useState(null);

    const handleCopyLink = (id) => {
        const realUrl = `${window.location.origin}${window.location.pathname}?id=${id}`;
        navigator.clipboard.writeText(realUrl);
        setCopyingId(id);
        showNotification('Enlace copiado al portapapeles');
        setTimeout(() => setCopyingId(null), 2000);
    };

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen w-full bg-[#020617] text-slate-100 flex font-sans overflow-x-hidden">
            {/* Sidebar */}
            <aside className="hidden lg:flex w-72 flex-col bg-[#010409] border-r border-white/5 sticky top-0 h-screen z-30">
                <div className="p-8">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20 text-white">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="font-black text-xl tracking-tighter block leading-none uppercase italic text-white">Admin<span className="text-indigo-500">Suite</span></span>
                            <span className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em] mt-1.5 block">Security Core</span>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        <button className="w-full flex items-center gap-4 px-4 py-3 bg-white/5 text-white rounded-xl font-bold border border-white/5 transition-all text-sm group">
                            <User className="w-4 h-4 text-indigo-500" /> Gestión Personal
                        </button>
                    </nav>
                </div>

                <div className="mt-auto p-8 border-t border-white/5">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all font-bold text-sm"
                    >
                        <LogOut className="w-4 h-4" /> Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-h-screen bg-[#020617]">
                <header className="px-8 md:px-16 py-8 flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/5 bg-[#010409]/60 backdrop-blur-3xl sticky top-0 z-20">
                    <div className="flex flex-col">
                        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic">Control Operativo</h1>
                        <p className="text-slate-500 mt-1 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" /> Sincronización en Tiempo Real
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onRefresh}
                            className="p-4 bg-white/5 text-slate-400 rounded-xl hover:bg-white/10 transition border border-white/5"
                        >
                            <Loader2 className={`w-5 h-5 ${loading ? 'animate-spin text-indigo-500' : ''}`} />
                        </button>
                        <button
                            onClick={onAdd}
                            className="bg-white text-black px-8 py-3.5 rounded-xl shadow-2xl hover:bg-slate-200 flex items-center gap-3 font-black uppercase tracking-widest text-xs transition-transform active:scale-95"
                        >
                            <Plus className="w-4 h-4" /> Registrar Nuevo
                        </button>
                    </div>
                </header>

                <div className="px-8 md:px-16 py-10">
                    {/* Stats */}
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-12">
                        <div className="xl:col-span-3 bg-[#010409] p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                                <User className="w-32 h-32 text-indigo-500" />
                            </div>
                            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1.5">Personal Activo</p>
                            <span className="text-5xl font-black text-white tracking-tighter">{employees.length}</span>
                        </div>

                        <div className="xl:col-span-9 flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre, puesto o ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full h-full bg-[#010409] border border-white/5 text-white pl-14 pr-6 py-4 rounded-2xl focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-800 font-bold"
                                />
                            </div>
                            <button className="px-8 py-4 bg-white/5 text-slate-500 rounded-2xl border border-white/5 flex items-center justify-center gap-3 hover:text-white transition font-black uppercase tracking-widest text-[10px]">
                                <Filter className="w-4 h-4" /> Filtros
                            </button>
                        </div>
                    </div>

                    {/* Gallery */}
                    {loading && employees.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-40">
                            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                            <p className="text-slate-600 font-black uppercase tracking-widest text-xs">Accediendo a base de datos...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                            {filteredEmployees.map((employee) => (
                                <div key={employee.id} className="group relative">
                                    <div className="absolute inset-0 bg-indigo-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                                    <div className="bg-[#010409] rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 p-6 h-full flex flex-col shadow-xl relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="relative">
                                                <img
                                                    src={employee.photo_url || employee.photo}
                                                    alt={employee.name}
                                                    className="w-20 h-20 rounded-xl object-cover border border-white/10 group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-4 h-4 rounded-full border-[3px] border-[#010409]" />
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[8px] font-black tracking-widest text-emerald-500 uppercase bg-emerald-500/5 px-2 py-1 rounded border border-emerald-500/10 mb-2">Activo</div>
                                                <div className="text-[9px] font-bold text-slate-600 font-mono">#{employee.id}</div>
                                            </div>
                                        </div>

                                        <div className="mb-6 flex-1">
                                            <h3 className="font-black text-xl text-white tracking-tighter uppercase italic leading-tight group-hover:text-indigo-400 transition-colors">
                                                {employee.name}
                                            </h3>
                                            <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.1em] mt-1.5 flex items-center gap-2">
                                                <Briefcase className="w-3 h-3 text-indigo-500" /> {employee.position}
                                            </p>
                                        </div>

                                        <div className="mb-8 flex gap-2 overflow-hidden">
                                            <div className="bg-white/[0.02] p-2.5 rounded-lg border border-white/5 flex-1 min-w-0">
                                                <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest block mb-1">Empresa</span>
                                                <span className="text-white font-black text-[10px] uppercase block italic tracking-tight leading-none">{employee.company || 'S/E'}</span>
                                            </div>
                                            <div className="bg-white/[0.02] p-2.5 rounded-lg border border-white/5 min-w-[60px]">
                                                <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest block mb-1">Rh</span>
                                                <span className="text-white font-black text-[10px]">{employee.bloodType || '--'}</span>
                                            </div>
                                        </div>

                                        <div className="mt-auto flex items-stretch gap-2">
                                            <button
                                                onClick={() => onViewCard(employee)}
                                                className="flex-[2] bg-white hover:bg-slate-200 text-black font-black py-3 rounded-lg transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" /> Ver
                                            </button>
                                            <button
                                                onClick={() => onEdit(employee)}
                                                className="flex-1 bg-white/5 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/5 rounded-lg border border-white/5 transition-all flex items-center justify-center"
                                                title="Editar"
                                            >
                                                <PenLine className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleCopyLink(employee.id)}
                                                className="flex-1 bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg border border-white/5 transition-all flex items-center justify-center"
                                                title="Copiar Link"
                                            >
                                                {copyingId === employee.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                            </button>
                                            <button
                                                onClick={() => onDelete(employee.id)}
                                                className="flex-1 bg-white/5 text-slate-700 hover:text-red-400 hover:bg-red-500/5 rounded-lg border border-white/5 transition-all flex items-center justify-center"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
