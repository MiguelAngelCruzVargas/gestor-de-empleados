import React, { useState, useEffect } from 'react';
import { User, X, Mail, Phone, Activity, MapPin, Briefcase, Loader2, UploadCloud, ArrowLeft, Globe, Building2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function AddEmployee({ employee, onCancel, onRefresh, showNotification }) {
    const isEditing = !!employee;
    const [isSaving, setIsSaving] = useState(false);
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(employee?.photo_url || employee?.photo || null);

    const [formData, setFormData] = useState({
        name: employee?.name || '',
        position: employee?.position || '',
        company: employee?.company || '', // Start empty or with existing
        email: employee?.email || '',
        bloodType: employee?.bloodType || '',
        phone: employee?.phone || '',
        address: employee?.address || ''
    });

    // Sync form data if the employee prop changes (e.g. clicking different edit buttons)
    useEffect(() => {
        if (employee) {
            setFormData({
                name: employee.name || '',
                position: employee.position || '',
                company: employee.company || '',
                email: employee.email || '',
                bloodType: employee.bloodType || '',
                phone: employee.phone || '',
                address: employee.address || ''
            });
            setPhotoPreview(employee.photo_url || employee.photo);
        }
    }, [employee]);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhotoFile(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        const targetId = isEditing ? employee.id : `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
        let photo_url = photoPreview;

        try {
            if (photoFile) {
                const fileExt = photoFile.name.split('.').pop();
                const fileName = `${targetId}-${Date.now()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('employee-photos')
                    .upload(filePath, photoFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('employee-photos')
                    .getPublicUrl(filePath);

                photo_url = publicUrl;
            } else if (!isEditing && !photoPreview) {
                photo_url = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=020617&color=fff&size=512`;
            }

            const employeeData = {
                name: formData.name.trim(),
                position: formData.position.trim(),
                company: formData.company.trim(), // Limpiar espacios y asegurar texto completo
                email: formData.email.trim(),
                bloodType: formData.bloodType,
                phone: formData.phone.trim(),
                address: formData.address.trim(),
                photo_url,
                active: true,
                updated_at: new Date().toISOString()
            };

            // LOG DE SEGURIDAD PARA VER QUÉ SE ENVÍA
            console.log("DATOS A ENVIAR A SUPABASE:", employeeData);

            if (isEditing && employee?.id) {
                // EXPLICIT LOG FOR DEBUGGING
                console.log('UPDATING EMPLOYEE:', employee.id, employeeData);

                const { error } = await supabase
                    .from('employees')
                    .update(employeeData)
                    .eq('id', employee.id);

                if (error) throw error;
                showNotification('Perfil actualizado exitosamente');
            } else if (!isEditing) {
                const { error } = await supabase
                    .from('employees')
                    .insert([{ id: targetId, ...employeeData, created_at: new Date().toISOString() }]);

                if (error) throw error;
                showNotification('Perfil creado exitosamente');
            } else {
                throw new Error('ID de empleado no encontrado para actualización');
            }

            onRefresh();
            onCancel();
        } catch (error) {
            console.error('Error saving employee:', error.message);
            showNotification('Error al guardar: ' + error.message, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#020617] text-slate-100 flex font-sans overflow-x-hidden">
            {/* Left Decor / Info Panel */}
            <div className="hidden lg:flex w-96 flex-col justify-between p-12 bg-[#0a0f1d] border-r border-white/5 relative overflow-hidden">
                <div className="relative z-10">
                    <button
                        onClick={onCancel}
                        className="flex items-center gap-3 text-slate-500 hover:text-white transition-colors font-black uppercase tracking-widest text-xs mb-20"
                    >
                        <ArrowLeft className="w-4 h-4" /> Volver al Panel
                    </button>

                    <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none mb-6">
                        {isEditing ? 'Editar' : 'Nuevo'} <br />
                        <span className="text-indigo-500">Miembro.</span>
                    </h2>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed">
                        Configura la identidad y la empresa asignada a este usuario en el núcleo del sistema.
                    </p>
                </div>

                <div className="relative z-10 space-y-6">
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Sincronización Activa</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">Los cambios se verán reflejados al instante en el gaffete digital.</p>
                    </div>
                </div>

                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px]" />
            </div>

            {/* Form Section */}
            <main className="flex-1 min-h-screen overflow-y-auto px-8 md:px-24 py-16 bg-gradient-to-br from-transparent to-indigo-950/20">
                <div className="max-w-3xl">
                    <header className="mb-12 text-center md:text-left">
                        <h1 className="text-4xl font-black text-white tracking-tight uppercase italic mb-2">
                            {isEditing ? 'Edición de Perfil' : 'Registro Operativo'}
                        </h1>
                        <div className="h-1 w-20 bg-indigo-600 rounded-full mx-auto md:mx-0"></div>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        {/* Photo Dropzone */}
                        <div className="relative group">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="absolute inset-0 opacity-0 cursor-pointer z-20"
                            />
                            <div className={`
                                flex flex-col md:flex-row items-center gap-8 p-8 bg-slate-900/40 rounded-[2.5rem] border border-white/5 transition-all
                                group-hover:border-indigo-500/30 group-hover:bg-slate-900/60
                            `}>
                                <div className="relative flex-shrink-0">
                                    {photoPreview ? (
                                        <img src={photoPreview} alt="Preview" className="w-32 h-32 rounded-[2rem] object-cover border-4 border-slate-800 shadow-2xl" />
                                    ) : (
                                        <div className="w-32 h-32 bg-slate-950 rounded-[2.5rem] flex items-center justify-center border-2 border-dashed border-slate-800 group-hover:border-indigo-500/50 transition-colors">
                                            <UploadCloud className="w-10 h-10 text-slate-700 group-hover:text-indigo-500 transition-colors" />
                                        </div>
                                    )}
                                </div>
                                <div className="text-center md:text-left flex-1">
                                    <h4 className="text-xl font-black text-white uppercase italic">Fotografía de Identidad</h4>
                                    <p className="text-slate-500 text-sm font-medium mt-1">Sube el retrato oficial para el gaffete digital.</p>
                                    <div className="mt-4 inline-flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-widest bg-indigo-500/10 px-3 py-1.5 rounded-full">
                                        Subir Archivo
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Nombre Completo</label>
                                <input required type="text" className="w-full bg-[#0a0f1d] border border-white/5 text-white px-8 py-5 rounded-2xl focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-800 font-bold" placeholder="Escribe el nombre..." value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Cargo / Posición</label>
                                <input required type="text" className="w-full bg-[#0a0f1d] border border-white/5 text-white px-8 py-5 rounded-2xl focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-800 font-bold" placeholder="Ej. Arquitecto Senior" value={formData.position} onChange={e => setFormData({ ...formData, position: e.target.value })} />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] ml-1">Nombre de la Empresa</label>
                                <div className="relative">
                                    <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500/50" />
                                    <input
                                        required
                                        type="text"
                                        className="w-full bg-indigo-500/5 border border-indigo-500/20 text-white pl-14 pr-8 py-5 rounded-2xl focus:border-indigo-500 outline-none transition-all placeholder:text-slate-800 font-black italic uppercase"
                                        placeholder="Escribe la empresa..."
                                        value={formData.company}
                                        onChange={e => setFormData({ ...formData, company: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Tipo de Sangre</label>
                                <select required className="w-full bg-[#0a0f1d] border border-white/5 text-white px-8 py-5 rounded-2xl focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold cursor-pointer appearance-none" value={formData.bloodType} onChange={e => setFormData({ ...formData, bloodType: e.target.value })}>
                                    <option value="">Seleccione...</option>
                                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Email Organizador</label>
                                <input required type="email" className="w-full bg-[#0a0f1d] border border-white/5 text-white px-8 py-5 rounded-2xl focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-800 font-bold" placeholder="correo@zamo.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Contacto Directo</label>
                                <input required type="tel" className="w-full bg-[#0a0f1d] border border-white/5 text-white px-8 py-5 rounded-2xl focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-800 font-bold" placeholder="+52 ..." value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                            </div>

                            <div className="space-y-3 md:col-span-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Ubicación / Oficina</label>
                                <input required type="text" className="w-full bg-[#0a0f1d] border border-white/5 text-white px-8 py-5 rounded-2xl focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-800 font-bold" placeholder="Ej. Matriz - Piso 4" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6 pt-10">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="flex-[2] bg-indigo-600 text-white font-black py-6 rounded-3xl shadow-2xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-widest text-lg"
                            >
                                {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <>{isEditing ? 'Actualizar Perfil' : 'Finalizar Registro'}</>}
                            </button>
                            <button
                                type="button"
                                onClick={onCancel}
                                className="flex-1 bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 font-bold py-6 rounded-3xl border border-white/5 transition-all text-lg"
                                disabled={isSaving}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
