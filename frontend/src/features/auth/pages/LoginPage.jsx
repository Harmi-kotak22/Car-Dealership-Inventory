import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
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
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Welcome back</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Sign in to your account</h2>
        <p className="mt-3 text-sm text-slate-400">
          Access your inventory dashboard and manage dealership sales with ease.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
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

        {error ? <p className="text-sm text-rose-400">{error}</p> : null}

        <div className="pt-1">
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        New here?{' '}
        <Link to="/register" className="font-medium text-violet-300 hover:text-white">
          Create account
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;
