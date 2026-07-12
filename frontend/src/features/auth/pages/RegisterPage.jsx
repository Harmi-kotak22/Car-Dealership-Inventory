import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiKey, FiUserPlus } from 'react-icons/fi';
import useAuthStore from '../store/authStore';
import { registerUser } from '../../../api/auth';

function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!agreed) {
      setError('Please agree to the terms & conditions to continue.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const response = await registerUser({ name, email, password, adminCode });
      const user = response.data.data?.user || response.data.user || { name, email };
      setAuth(response.data.data?.token || response.data.token, user);
      navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="auth-heading">Create account</h2>
      <p className="auth-subheading">Join Prestige Motors and start managing your inventory.</p>

      <form onSubmit={handleSubmit}>
        <div className="auth-input-group">

          {/* Full name */}
          <div className="auth-field">
            <label className="auth-label">Full name</label>
            <div className="auth-input-wrap">
              <input
                className="auth-input"
                type="text"
                placeholder="Alex Carter"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
              <span className="auth-input-icon"><FiUser size={16} /></span>
            </div>
          </div>

          {/* Email */}
          <div className="auth-field">
            <label className="auth-label">Email address</label>
            <div className="auth-input-wrap">
              <input
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <span className="auth-input-icon"><FiMail size={16} /></span>
            </div>
          </div>

          {/* Password */}
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrap">
              <input
                className="auth-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <span className="auth-input-icon"><FiLock size={16} /></span>
            </div>
          </div>

          {/* Admin code */}
          <div className="auth-field">
            <label className="auth-label">
              Admin code{' '}
              <span style={{ fontWeight: 400, color: '#9ca3af' }}>(optional)</span>
            </label>
            <div className="auth-input-wrap">
              <input
                className="auth-input"
                type="text"
                placeholder="Enter admin signup code"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                autoComplete="off"
              />
              <span className="auth-input-icon"><FiKey size={16} /></span>
            </div>
          </div>

        </div>

        {/* Terms checkbox */}
        <label className="auth-terms-row">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="auth-checkbox"
          />
          <span className="auth-terms-text">
            I agree to the{' '}
            <a href="#" className="auth-terms-link">terms &amp; conditions</a>
          </span>
        </label>

        {error && <p className="auth-error" style={{ marginBottom: 16 }}>{error}</p>}

        <button type="submit" className="auth-submit-btn" disabled={loading}>
          {loading ? 'Creating account…' : (<>Sign Up <FiUserPlus size={16} /></>)}
        </button>
      </form>

      <p className="auth-bottom-link">
        Already have an account?{' '}
        <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
