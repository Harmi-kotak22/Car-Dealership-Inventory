import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiLogIn } from 'react-icons/fi';
import useAuthStore from '../store/authStore';
import { loginUser } from '../../../api/auth';

function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await loginUser({ email, password });
      setAuth(response.data.token, response.data.user);
      const role = response.data.user?.role;
      navigate(role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="auth-heading">Welcome back</h2>
      <p className="auth-subheading">Sign in to access your dealership dashboard.</p>

      <form onSubmit={handleSubmit}>
        <div className="auth-input-group">

          {/* Email */}
          <div className="auth-field">
            <label className="auth-label">Email address</label>
            <div className="auth-input-wrap">
              <input
                className={`auth-input ${error ? 'auth-input--error' : ''}`}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <span className="auth-input-icon"><FiUser size={16} /></span>
            </div>
          </div>

          {/* Password */}
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrap">
              <input
                className={`auth-input ${error ? 'auth-input--error' : ''}`}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <span className="auth-input-icon"><FiLock size={16} /></span>
            </div>
            <a href="#" className="auth-forgot">Forgot password?</a>
          </div>

        </div>

        {error && <p className="auth-error" style={{ marginBottom: 16 }}>{error}</p>}

        <button type="submit" className="auth-submit-btn" disabled={loading}>
          {loading ? 'Signing in…' : (<>Sign In <FiLogIn size={16} /></>)}
        </button>
      </form>

      <p className="auth-bottom-link">
        Don&apos;t have an account?{' '}
        <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default LoginPage;
