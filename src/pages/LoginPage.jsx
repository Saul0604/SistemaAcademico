import { useState } from 'react';
import { loginUser, registerUser } from '../services/userService';
import './LoginPage.css';

function LoginPage({ onLogin }) {
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            if (mode === 'login') {
                const user = await loginUser(form.email, form.password);
                onLogin(user);
            } else {
                if (!form.name.trim()) throw new Error('El nombre es requerido');
                await registerUser(form.name, form.email, form.password);
                setSuccess('¡Cuenta creada exitosamente! Ahora inicia sesión.');
                setMode('login');
                setForm({ name: '', email: '', password: '' });
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        setForm({ name: '', email: '', password: '' });
        setError('');
        setSuccess('');
    };

    return (
        <div className="login-bg">
            <div className="login-card">
                {/* Left panel */}
                <div className="login-left">
                    <div className="login-left-shapes">
                        <div className="shape shape-1" />
                        <div className="shape shape-2" />
                        <div className="shape shape-3" />
                    </div>
                    <div className="login-left-tabs">
                        <button
                            className={`tab-btn ${mode === 'login' ? 'tab-active' : ''}`}
                            onClick={() => switchMode('login')}
                        >
                            LOGIN
                        </button>
                        <button
                            className={`tab-btn ${mode === 'register' ? 'tab-active' : ''}`}
                            onClick={() => switchMode('register')}
                        >
                            REGISTRO
                        </button>
                    </div>

                </div>

                {/* Right panel */}
                <div className="login-right">
                    <div className="login-icon-wrap">
                        <svg viewBox="0 0 24 24" fill="none" className="login-icon-svg">
                            <circle cx="12" cy="8" r="4" stroke="white" strokeWidth="2" />
                            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <h2 className="login-title">{mode === 'login' ? 'LOGIN' : 'REGISTRO'}</h2>

                    <form className="login-form" onSubmit={handleSubmit}>
                        {mode === 'register' && (
                            <div className="input-group">
                                <span className="input-icon">
                                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                                        <circle cx="12" cy="8" r="4" stroke="#aaa" strokeWidth="2" />
                                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#aaa" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Nombre completo"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    autoComplete="name"
                                />
                            </div>
                        )}

                        <div className="input-group">
                            <span className="input-icon">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                                    <circle cx="12" cy="12" r="9" stroke="#aaa" strokeWidth="2" />
                                    <path d="M8 12l2.5 2.5L16 9" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div className="input-group">
                            <span className="input-icon">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                                    <rect x="5" y="11" width="14" height="10" rx="2" stroke="#aaa" strokeWidth="2" />
                                    <path d="M8 11V7a4 4 0 018 0v4" stroke="#aaa" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </span>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                            />
                        </div>

                        {error && <p className="login-error">{error}</p>}
                        {success && <p className="login-success">{success}</p>}

                        {mode === 'login' && (
                            <div className="forgot-row">
                                <button type="submit" className="submit-btn" disabled={loading}>
                                    {loading ? '...' : 'LOGIN'}
                                </button>
                            </div>
                        )}

                        {mode === 'register' && (
                            <button type="submit" className="submit-btn submit-btn-full" disabled={loading}>
                                {loading ? 'Registrando...' : 'CREAR CUENTA'}
                            </button>
                        )}
                    </form>

                    {mode === 'login' && (
                        <div className="login-alt">
                            <span>¿No tienes cuenta?</span>
                            <button className="alt-link" onClick={() => switchMode('register')}>
                                Regístrate
                            </button>
                        </div>
                    )}
                    {mode === 'register' && (
                        <div className="login-alt">
                            <span>¿Ya tienes cuenta?</span>
                            <button className="alt-link" onClick={() => switchMode('login')}>
                                Inicia sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
