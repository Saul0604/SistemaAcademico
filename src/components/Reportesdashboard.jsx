import { useState, useEffect } from 'react';
import './ReportesDashboard.css';

const API_URL = 'http://localhost:3000';

export default function ReportesDashboard() {
    const [alumnos, setAlumnos] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [calificaciones, setCalificaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [ra, rm, rc] = await Promise.all([
                    fetch(`${API_URL}/alumnos`).then(r => r.json()),
                    fetch(`${API_URL}/materias`).then(r => r.json()),
                    fetch(`${API_URL}/calificaciones`).then(r => r.json()),
                ]);
                setAlumnos(Array.isArray(ra) ? ra : ra.data ?? []);
                setMaterias(Array.isArray(rm) ? rm : rm.data ?? []);
                setCalificaciones(Array.isArray(rc) ? rc : rc.data ?? []);
            } catch (e) {
                setError('No se pudieron cargar los datos. Verifica que el servidor esté corriendo.');
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    // ── Métricas generales ─────────────────────────────────────
    const totalAlumnos = alumnos.length;
    const totalMaterias = materias.length;
    const totalCalificaciones = calificaciones.length;

    const promedioGeneral = totalCalificaciones > 0
        ? (calificaciones.reduce((s, c) => s + c.calificacion, 0) / totalCalificaciones).toFixed(1)
        : null;

    const maxCal = totalCalificaciones > 0 ? Math.max(...calificaciones.map(c => c.calificacion)) : null;
    const minCal = totalCalificaciones > 0 ? Math.min(...calificaciones.map(c => c.calificacion)) : null;

    // ── Top alumnos por promedio ───────────────────────────────
    // alumnoId viene como objeto poblado: { _id, nombre, matricula }
    const promediosPorAlumno = (() => {
        const map = {};
        calificaciones.forEach(c => {
            const alumno = c.alumnoId;
            const key = alumno?._id ?? String(alumno);
            if (!map[key]) map[key] = { nombre: alumno?.nombre ?? '?', matricula: alumno?.matricula ?? '', total: 0, suma: 0 };
            map[key].suma += c.calificacion;
            map[key].total += 1;
        });
        return Object.values(map)
            .map(a => ({ ...a, promedio: a.suma / a.total }))
            .sort((a, b) => b.promedio - a.promedio);
    })();

    // ── Promedio por materia ───────────────────────────────────
    // materiaId viene como objeto poblado: { _id, nombre, semestre }
    const promPorMateria = (() => {
        const map = {};
        calificaciones.forEach(c => {
            const materia = c.materiaId;
            const key = materia?._id ?? String(materia);
            if (!map[key]) map[key] = { nombre: materia?.nombre ?? '?', semestre: materia?.semestre ?? '?', total: 0, suma: 0 };
            map[key].suma += c.calificacion;
            map[key].total += 1;
        });
        return Object.values(map)
            .map(m => ({ ...m, promedio: m.suma / m.total }))
            .sort((a, b) => b.promedio - a.promedio);
    })();

    // ── Distribución de calificaciones (escala 0-100) ─────────
    const rangos = [
        { label: '0-5', min: 0, max: 5, color: '#ef4444' },
        { label: '6', min: 6, max: 6, color: '#f97316' },
        { label: '7', min: 7, max: 7, color: '#f59e0b' },
        { label: '8', min: 8, max: 8, color: '#8b5cf6' },
        { label: '9', min: 9, max: 9, color: '#3b82f6' },
        { label: '10', min: 10, max: 10, color: '#10b981' },
    ];
    const distribucion = rangos.map(r => ({
        ...r,
        count: calificaciones.filter(c => c.calificacion >= r.min && c.calificacion <= r.max).length
    }));
    const maxDist = Math.max(...distribucion.map(d => d.count), 1);

    // ── Materias por semestre ──────────────────────────────────
    const porSemestre = materias.reduce((acc, m) => {
        acc[m.semestre] = (acc[m.semestre] || 0) + 1;
        return acc;
    }, {});
    const semestres = Object.entries(porSemestre).sort((a, b) => a[0] - b[0]);

    if (loading) return (
        <div className="dash-loading">
            <div className="dash-spinner" />
            <p>Cargando datos...</p>
        </div>
    );

    if (error) return (
        <div className="dash-error">
            <span>⚠️</span><p>{error}</p>
        </div>
    );

    return (
        <div className="dash">
            <div className="dash-header">
                <h2>📈 Reportes</h2>
                <p>Resumen general del sistema académico</p>
            </div>

            {/* ── KPIs ── */}
            <div className="dash-kpis">
                <KpiCard icon="🎓" label="Alumnos" value={totalAlumnos} color="blue" delay="0s" />
                <KpiCard icon="📚" label="Materias" value={totalMaterias} color="purple" delay="0.07s" />
                <KpiCard icon="📝" label="Calificaciones" value={totalCalificaciones} color="teal" delay="0.14s" />
                <KpiCard icon="⭐" label="Promedio General" value={promedioGeneral ?? '—'} color="amber" delay="0.21s" />
                <KpiCard icon="🏆" label="Calificación Máxima" value={maxCal ?? '—'} color="green" delay="0.28s" />
                <KpiCard icon="📉" label="Calificación Mínima" value={minCal ?? '—'} color="red" delay="0.35s" />
            </div>

            <div className="dash-grid">

                {/* Distribución de calificaciones */}
                <div className="dash-card">
                    <h3>Distribución de Calificaciones</h3>
                    {totalCalificaciones === 0
                        ? <p className="dash-empty">Sin calificaciones registradas</p>
                        : (
                            <div className="bar-chart">
                                {distribucion.map((d, i) => (
                                    <div className="bar-col" key={i}>
                                        <span className="bar-value">{d.count}</span>
                                        <div className="bar-fill" style={{
                                            height: `${Math.max((d.count / maxDist) * 140, d.count > 0 ? 8 : 2)}px`,
                                            background: d.color,
                                            animationDelay: `${i * 0.07}s`
                                        }} />
                                        <span className="bar-label">{d.label}</span>
                                    </div>
                                ))}
                            </div>
                        )
                    }
                </div>

                {/* Top alumnos */}
                <div className="dash-card">
                    <h3>🏅 Top Alumnos por Promedio</h3>
                    {promediosPorAlumno.length === 0
                        ? <p className="dash-empty">Sin datos suficientes</p>
                        : (
                            <div className="rank-list">
                                {promediosPorAlumno.slice(0, 6).map((a, i) => (
                                    <div className="rank-row" key={i} style={{ animationDelay: `${i * 0.06}s` }}>
                                        <span className={`rank-num rank-n${Math.min(i + 1, 4)}`}>{i + 1}</span>
                                        <div className="rank-info">
                                            <span className="rank-name">{a.nombre}</span>
                                            <span className="rank-sub">{a.matricula} · {a.total} calif.</span>
                                        </div>
                                        <div className="rank-bar-wrap">
                                            <div className="rank-bar" style={{
                                                width: `${a.promedio}%`,
                                                animationDelay: `${i * 0.06 + 0.2}s`
                                            }} />
                                        </div>
                                        <span className="rank-score">{a.promedio.toFixed(1)}</span>
                                    </div>
                                ))}
                            </div>
                        )
                    }
                </div>

                {/* Promedio por materia */}
                <div className="dash-card dash-card-wide">
                    <h3>📊 Promedio por Materia</h3>
                    {promPorMateria.length === 0
                        ? <p className="dash-empty">Sin calificaciones por materia aún</p>
                        : (
                            <div className="hbar-chart">
                                {promPorMateria.map((m, i) => (
                                    <div className="hbar-row" key={i} style={{ animationDelay: `${i * 0.07}s` }}>
                                        <div className="hbar-meta">
                                            <span className="hbar-label">{m.nombre}</span>
                                            <span className="hbar-sub">Semestre {m.semestre} · {m.total} registros</span>
                                        </div>
                                        <div className="hbar-track">
                                            <div className="hbar-fill" style={{
                                                width: `${m.promedio}%`,
                                                background: m.promedio >= 7
                                                    ? 'linear-gradient(90deg,#10b981,#3b82f6)'
                                                    : 'linear-gradient(90deg,#f97316,#ef4444)',
                                                animationDelay: `${i * 0.07 + 0.15}s`
                                            }} />
                                        </div>
                                        <span className="hbar-value">{m.promedio.toFixed(1)}</span>
                                    </div>
                                ))}
                            </div>
                        )
                    }
                </div>

                {/* Materias por semestre */}
                {semestres.length > 0 && (
                    <div className="dash-card dash-card-wide">
                        <h3>📅 Materias por Semestre</h3>
                        <div className="sem-grid">
                            {semestres.map(([sem, count], i) => (
                                <div className="sem-chip" key={i} style={{ animationDelay: `${i * 0.05}s` }}>
                                    <span className="sem-num">Semestre {sem}</span>
                                    <span className="sem-count">{count} {count === 1 ? 'materia' : 'materias'}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

function KpiCard({ icon, label, value, color, delay }) {
    return (
        <div className={`kpi-card kpi-${color}`} style={{ animationDelay: delay }}>
            <span className="kpi-icon">{icon}</span>
            <div>
                <p className="kpi-label">{label}</p>
                <p className="kpi-value">{value}</p>
            </div>
        </div>
    );
}