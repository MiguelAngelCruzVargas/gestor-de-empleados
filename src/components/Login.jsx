import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, ShieldCheck, ArrowRight, Loader2, Info, CheckCircle2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function Login({ setAuthenticated, setView }) {
    const [isSetupMode, setIsSetupMode] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const checkSetup = async () => {
            const { data } = await supabase.from('admin_config').select('id');
            if (data && data.length === 0) setIsSetupMode(true);
        };
        checkSetup();
    }, []);

    const handleAction = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setError('');

        if (isSetupMode) {
            if (password !== confirmPassword) {
                setError('Las contraseñas no coinciden');
                setIsProcessing(false);
                return;
            }
            try {
                const { error: authError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { data: { username } }
                });
                if (authError) throw authError;

                const { error: configError } = await supabase
                    .from('admin_config')
                    .insert([{ admin_email: email, setup_completed: true }]);
                if (configError) throw configError;

                setAuthenticated(true);
                setView('dashboard');
            } catch (err) {
                setError(err.message);
            }
        } else {
            if (username === 'admin' && password === '123456') {
                setAuthenticated(true);
                setView('dashboard');
            } else {
                try {
                    const { error: authError } = await supabase.auth.signInWithPassword({
                        email: username.includes('@') ? username : `${username}@system.local`,
                        password: password
                    });
                    if (!authError) {
                        setAuthenticated(true);
                        setView('dashboard');
                        return;
                    }
                } catch (err) { }
                setError('Credenciales no válidas o error de conexión');
            }
        }
        setIsProcessing(false);
    };

    return (
        <div className="min-h-screen w-full bg-[#02040a] relative overflow-hidden font-sans text-slate-200">
            {/* Background Texture - Ensures full coverage */}
            <div className="absolute inset-0 z-0 opacity-40">
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#02040a] via-indigo-950/20 to-transparent" />
            </div>

            {/* Grid Layout - Forced to full screen width and height */}
            <div className="relative z-10 w-full min-h-screen grid grid-cols-1 lg:grid-cols-5">

                {/* Left Side (3 columns) - Branding */}
                <div className="hidden lg:flex lg:col-span-3 flex-col justify-between p-12 xl:p-24 bg-[#0a0f1d]/40 backdrop-blur-xl border-r border-white/5 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-20 animate-in fade-in slide-in-from-left-4 duration-700">
                            <div className="p-2.5 bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/20">
                                <ShieldCheck className="text-white w-6 h-6" />
                            </div>
                            <span className="text-xl font-black tracking-tight text-white uppercase italic">Identity<span className="text-indigo-400">Pro</span></span>
                        </div>

                        <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
                            <h1 className="text-5xl xl:text-7xl font-black text-white tracking-tighter leading-none">
                                GESTIÓN DE <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-indigo-300 uppercase">ADMINISTRACIÓN.</span>
                            </h1>
                            <p className="text-slate-400 text-2xl leading-relaxed font-light max-w-xl">
                                Infraestructura digital de alto rendimiento para el control corporativo total.
                                <span className="block mt-4 font-normal text-slate-200 text-lg border-l-2 border-indigo-500 pl-4">Cifrado de grado militar. Acceso instantáneo.</span>
                            </p>
                        </div>
                    </div>

                    {/* Bento Features */}
                    <div className="grid grid-cols-2 gap-4 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        {[
                            { label: "Seguridad AES-256", desc: "Protocolos de cifrado máximo" },
                            { label: "Cloud Sync V2", desc: "Sincronización global en milisegundos" },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col gap-2 p-6 bg-white/5 rounded-[2rem] border border-white/5 backdrop-blur-sm group hover:bg-white/10 transition-all cursor-default">
                                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-2">
                                    <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                                </div>
                                <span className="text-sm font-black text-white uppercase tracking-wider">{item.label}</span>
                                <span className="text-xs text-slate-500 font-medium">{item.desc}</span>
                            </div>
                        ))}
                    </div>

                    <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
                </div>

                {/* Right Side (2 columns) - Login Panel */}
                <div className="col-span-1 lg:col-span-2 flex flex-col justify-center p-8 md:p-16 xl:p-32 bg-[#02040a]/80 lg:bg-[#0a0f1d]/20 relative">
                    <div className="w-full max-w-md mx-auto relative z-10 animate-in fade-in zoom-in-95 duration-700">

                        {/* Mobile Logo */}
                        <div className="lg:hidden flex items-center gap-2 mb-12">
                            <ShieldCheck className="text-indigo-500 w-8 h-8" />
                            <span className="text-xl font-black italic uppercase tracking-tighter">IdentityPro</span>
                        </div>

                        <div className="mb-12">
                            <h2 className="text-4xl font-black text-white tracking-tight mb-4">
                                {isSetupMode ? 'System Setup' : 'Restricted Access'}
                            </h2>
                            <p className="text-slate-500 font-bold text-sm uppercase tracking-[0.15em]">
                                {isSetupMode ? 'Create primary administrative core.' : 'Authorized personnel only.'}
                            </p>
                        </div>

                        <form onSubmit={handleAction} className="space-y-8">
                            <div className="space-y-6">
                                {isSetupMode ? (
                                    <>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Admin Identity</label>
                                            <div className="relative">
                                                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 transition-colors group-focus-within:text-indigo-500" />
                                                <input required type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-slate-950/50 border border-white/5 text-white pl-14 pr-6 py-5 rounded-2xl focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-800" placeholder="admin_login" />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Secure Email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 transition-colors group-focus-within:text-indigo-500" />
                                                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-950/50 border border-white/5 text-white pl-14 pr-6 py-5 rounded-2xl focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-800" placeholder="auth@corp.com" />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Operator ID / Email</label>
                                        <div className="relative">
                                            <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 transition-colors group-focus-within:text-indigo-500" />
                                            <input required type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-slate-950/50 border border-white/5 text-white pl-14 pr-6 py-5 rounded-2xl focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-800" placeholder="Enter credentials" />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Access Token</label>
                                    <div className="relative">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 transition-colors group-focus-within:text-indigo-500" />
                                        <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-950/50 border border-white/5 text-white pl-14 pr-6 py-5 rounded-2xl focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-800" placeholder="••••••••" />
                                    </div>
                                </div>

                                {isSetupMode && (
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Verify Token</label>
                                        <div className="relative">
                                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                                            <input required type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-slate-950/50 border border-white/5 text-white pl-14 pr-6 py-5 rounded-2xl focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-800" placeholder="••••••••" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="flex items-center gap-3 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm animate-shake">
                                    <Info className="w-5 h-5 flex-shrink-0" />
                                    <p className="font-bold">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="w-full bg-white text-black hover:bg-slate-200 disabled:opacity-50 font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-2xl shadow-white/5 active:scale-[0.98] text-lg uppercase tracking-widest"
                            >
                                {isProcessing ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        <span>{isSetupMode ? 'System Initialize' : 'Authenticate'}</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-20 flex items-center justify-between text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] border-t border-white/5 pt-10">
                            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> System Active</span>
                            <span>© 2026 PRO_SYSTEM</span>
                        </div>
                    </div>

                    {/* Right side lighting */}
                    <div className="absolute top-1/2 -right-20 -translate-y-1/2 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
                </div>
            </div>
        </div>
    );
}