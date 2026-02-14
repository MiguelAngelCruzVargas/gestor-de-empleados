import React from 'react';
import {
    User, MapPin, Phone, Briefcase, QrCode, Mail, ShieldCheck,
    Heart, ArrowLeft, Fingerprint, Globe, CheckCircle2, Cpu, Zap, Loader2
} from 'lucide-react';

export default function PublicProfile({ employee, loading, isAuthenticated, onBack }) {
    if (loading) return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#020203]">
            <div className="relative">
                <div className="w-24 h-24 border-2 border-indigo-500/20 rounded-full animate-ping absolute inset-0"></div>
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin relative z-10" />
                <span className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-indigo-500/50 font-black text-[9px] tracking-[0.4em] uppercase whitespace-nowrap">Sincronizando...</span>
            </div>
        </div>
    );

    if (!employee) return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#020203] p-8">
            <div className="max-w-xs text-center border border-red-500/20 bg-red-500/5 p-10 rounded-[2.5rem] backdrop-blur-xl relative">
                <div className="absolute inset-0 bg-red-500/5 blur-3xl rounded-full"></div>
                <ShieldCheck className="w-16 h-16 text-red-500 mx-auto mb-6 opacity-80" />
                <h3 className="text-white font-black uppercase tracking-widest italic text-lg">Acceso Denegado</h3>
                <p className="text-red-400/50 text-[10px] mt-2 uppercase font-bold tracking-widest leading-relaxed">
                    No se encontró registro de identidad en el nodo local.
                </p>
                {isAuthenticated && (
                    <button onClick={onBack} className="mt-8 w-full py-3 bg-red-500/20 hover:bg-red-500/40 text-red-100 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">
                        Regresar
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen w-full bg-[#020203] flex items-center justify-center p-4 font-mono selection:bg-indigo-500/30 overflow-hidden relative">

            {/* BACKGROUND TECH MESH */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[120px]"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] brightness-150"></div>
                <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,102,241,0.03) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            </div>

            <div className="w-full max-w-[480px] relative z-10">

                {/* NAV LAYER */}
                {isAuthenticated && (
                    <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
                        <button
                            onClick={onBack}
                            className="group flex items-center gap-2 text-white/30 hover:text-indigo-400 transition-all uppercase text-[9px] font-black tracking-[0.3em]"
                        >
                            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                            Regresar al Sistema
                        </button>
                    </div>
                )}

                {/* MAIN HUD CONTAINER */}
                <div className="relative group perspective-1000">
                    {/* Estructura Decorativa Externa */}
                    <div className="absolute -top-3 -left-3 w-10 h-10 border-t-2 border-l-2 border-indigo-500/40 rounded-tl-2xl"></div>
                    <div className="absolute -bottom-3 -right-3 w-10 h-10 border-b-2 border-r-2 border-indigo-500/40 rounded-br-2xl"></div>

                    <div className="bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_-12px_rgba(99,102,241,0.2)]">

                        {/* Scanning Line Effect */}
                        <div className="h-[2px] w-full bg-white/5 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_15px_#6366f1] w-1/2 animate-scan"></div>
                        </div>

                        <div className="p-8">

                            {/* ROW 1: Identity Profile */}
                            <div className="flex gap-6 items-center mb-8">
                                <div className="relative group/photo shrink-0">
                                    <div className="absolute -inset-4 bg-indigo-500/20 blur-2xl rounded-full opacity-40 group-hover/photo:opacity-70 transition-opacity"></div>
                                    <div className="w-32 h-32 rounded-[2rem] overflow-hidden border-2 border-white/10 relative z-10 shadow-2xl">
                                        <img
                                            src={employee.photo_url || employee.photo}
                                            alt={employee.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover/photo:scale-110"
                                        />
                                        {/* HUD Scanline Overlay */}
                                        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]"></div>
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 z-20 bg-black border border-indigo-500/50 p-1.5 rounded-xl shadow-xl">
                                        <div className="bg-emerald-500 w-3 h-3 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Cpu className="w-3 h-3 text-indigo-500" />
                                        <span className="text-[8px] text-indigo-400 uppercase tracking-[0.4em] font-black">Verified_Subject</span>
                                    </div>
                                    <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none mb-3">
                                        {employee.name}
                                    </h1>
                                    <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-lg">
                                        <span className="text-[9px] font-black text-indigo-300 uppercase tracking-[0.15em]">{employee.position}</span>
                                    </div>
                                </div>
                            </div>

                            {/* ROW 2: Modular Biometrics */}
                            <div className="grid grid-cols-3 gap-3 mb-8">
                                {[
                                    { label: 'R_Blood', val: employee.bloodType || 'O+', icon: Heart, color: 'text-red-500' },
                                    { label: 'Status', val: employee.active ? 'ACTIVE' : 'INACTIVE', icon: Zap, color: 'text-yellow-500' },
                                    { label: 'Sector', val: employee.address?.split(' ')[0]?.toUpperCase() || 'CORE', icon: Globe, color: 'text-blue-500' }
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white/[0.03] border border-white/5 p-3 rounded-2xl flex flex-col items-center group/stat hover:bg-white/5 transition-colors">
                                        <stat.icon className={`w-3.5 h-3.5 ${stat.color} mb-2 opacity-50 group-hover/stat:opacity-100 transition-opacity`} />
                                        <span className="text-[7px] text-slate-500 uppercase font-black mb-1">{stat.label}</span>
                                        <span className="text-[10px] text-white font-black italic">{stat.val}</span>
                                    </div>
                                ))}
                            </div>

                            {/* ROW 3: Data & Connectivity */}
                            <div className="space-y-3">
                                <a
                                    href={`tel:${employee.phone}`}
                                    className="flex items-center justify-between bg-indigo-600 hover:bg-indigo-500 transition-all p-4 rounded-[1.5rem] group/btn shadow-lg shadow-indigo-600/20"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white/10 p-2 rounded-xl">
                                            <Phone className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex flex-col text-left">
                                            <span className="text-[7px] text-indigo-200 font-black uppercase tracking-widest">Encrypted Line</span>
                                            <span className="text-sm text-white font-black italic tracking-tight">{employee.phone}</span>
                                        </div>
                                    </div>
                                    <QrCode className="w-5 h-5 text-white/40 group-hover/btn:rotate-90 group-hover/btn:text-white transition-all duration-500" />
                                </a>

                                <div className="grid grid-cols-1 gap-2">
                                    <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex items-center gap-4 group/item hover:border-white/20 transition-colors">
                                        <Mail className="w-4 h-4 text-slate-600 group-hover/item:text-indigo-400" />
                                        <span className="text-[10px] text-slate-400 font-bold tracking-tight">{employee.email}</span>
                                    </div>
                                    <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex items-center gap-4 group/item hover:border-white/20 transition-colors">
                                        <MapPin className="w-4 h-4 text-slate-600 group-hover/item:text-indigo-400" />
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter truncate">{employee.address}</span>
                                    </div>
                                </div>
                            </div>

                            {/* FOOTER: System Status */}
                            <div className="mt-8 pt-6 border-t border-white/5 flex items-end justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                        <span className="text-[8px] font-black text-emerald-500/80 uppercase tracking-widest">Identity_Authenticated</span>
                                    </div>
                                    <p className="text-[7px] text-slate-600 font-bold uppercase tracking-[0.2em]">Hash: {employee.id || 'SYS-778X'}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[11px] font-black text-white italic tracking-[0.2em] uppercase">
                                        {employee.company || 'ID SYSTEM CORE'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Decorative Info */}
                <div className="mt-8 flex items-center justify-center gap-6 opacity-20">
                    <div className="h-[1px] w-12 bg-indigo-500"></div>
                    <span className="text-[8px] font-black text-white uppercase tracking-[0.6em] animate-pulse">Official Entity</span>
                    <div className="h-[1px] w-12 bg-indigo-500"></div>
                </div>
            </div>

            <style>{`
                @keyframes scan {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
                .animate-scan { animation: scan 3s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
                .perspective-1000 { perspective: 1000px; }
            `}</style>
        </div>
    );
}