import { useEffect } from 'react';
import { supabase } from '../supabaseClient';

/**
 * KeepAlive Component
 * 
 * Este componente envía un "pulso" a Supabase y al servidor (Render) cada 10 minutos
 * para evitar que entren en modo de pausa por inactividad.
 */
export default function KeepAlive() {
    useEffect(() => {
        // Definimos el intervalo
        // IMPORTANTE: Render Free suspende la app tras 15 MINUTOS de inactividad global.
        // Supabase Free pausa el proyecto tras 7 DÍAS de inactividad.
        // Si quieres que Render NO se duerma nunca, usa 10 minutos. 
        // Si solo te importa Supabase, 24 horas está bien.
        const INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 Horas

        const sendPulse = async () => {
            try {
                const startTime = Date.now();

                // 1. Pulso a Supabase: Una consulta simple y rápida
                const { error } = await supabase.from('admin_config').select('id').limit(1);

                // 2. Pulso a Render: Autopetición a la URL base
                // Esto mantiene el "Web Service" de Render activo si no es un Static Site
                await fetch(window.location.origin, { mode: 'no-cors' });

                if (error) {
                    console.warn('[KeepAlive] Error en pulso Supabase:', error.message);
                } else {
                    console.log(`[KeepAlive] Pulso exitoso (${Date.now() - startTime}ms) - ${new Date().toLocaleTimeString()}`);
                }
            } catch (err) {
                console.error('[KeepAlive] Error en sistema de pulso:', err);
            }
        };

        // Ejecutar inmediatamente al cargar
        sendPulse();

        // Configurar el intervalo
        const interval = setInterval(sendPulse, INTERVAL_MS);

        return () => clearInterval(interval);
    }, []);

    return null; // Componente invisible
}
