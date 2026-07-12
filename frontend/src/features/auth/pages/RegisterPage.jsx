import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import useAuthStore from '../store/authStore';
import { registerUser } from '../../../api/auth';

function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await registerUser({ name, email, password, adminCode });
      const user = response.data.data?.user || response.data.user || { name, email };
      setAuth(response.data.data?.token || response.data.token, user);
      navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to register.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Join the club</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Create your account</h2>
        <p className="mt-3 text-sm text-slate-400">
          Start managing inventory, customers, and sales from one premium dashboard.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <Input
          label="Full name"
          icon={<FiUser />}
          placeholder="Alex Carter"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <Input
          label="Email"
          icon={<FiMail />}
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <Input
          label="Password"
          icon={<FiLock />}
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <Input
          label="Admin code (optional)"
          type="text"
          placeholder="Enter admin signup code"
          value={adminCode}
          onChange={(event) => setAdminCode(event.target.value)}
        />

        {error ? <p className="text-sm text-rose-400">{error}</p> : null}

        <div className="pt-1">
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-violet-300 hover:text-white">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default RegisterPage;
