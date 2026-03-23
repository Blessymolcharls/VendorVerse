import { useNavigate, Link } from 'react-router-dom';
import { loginVendor, loginBuyer } from '../services/api';
import { useAuth } from '../context/AuthContext';
import InteractiveJourney from '../components/InteractiveJourney';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const journeySteps = [
    { id: 'role', type: 'role-selection', prompt: "Welcome to VendorVerse. Are you a Buyer or a Vendor?" },
    { id: 'email', label: 'Email Address', type: 'email', required: true, prompt: "What's your email?" },
    { id: 'password', label: 'Password', type: 'password', required: true, prompt: 'Enter your password' }
  ];

  const handleLoginSubmit = async (formData) => {
    const activeRole = formData.role || 'buyer';
    const fn = activeRole === 'vendor' ? loginVendor : loginBuyer;
    
    // Accurately await the database response. InteractiveJourney will catch errors.
    const { data } = await fn({ email: formData.email, password: formData.password });
    
    login(data.user, data.token);
    
    // We delay the navigation to allow the 1s flight    // Give animation time to play
    setTimeout(() => {
        navigate('/browse');
    }, 3000);
  };

  const TopContent = (
    <div style={{ position: 'absolute', top: '-1rem', right: '0' }}>
      <Link to="/register" style={{ padding: '0.5rem 1rem', color: 'var(--text-main)', textDecoration: 'none', background: 'var(--glass-bg)', backdropFilter: 'blur(10px)', borderRadius: '8px', border: '1px solid var(--glass-border)', fontWeight: 600 }}>
          Create an Account
      </Link>
    </div>
  );

  return (
    <InteractiveJourney 
      steps={journeySteps}
      onSubmit={handleLoginSubmit}
      topContent={TopContent}
      ctaText="Sign In"
    />
  );
}
