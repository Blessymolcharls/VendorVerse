import { useNavigate, Link } from 'react-router-dom';
import { registerVendor, registerBuyer } from '../services/api';
import { useAuth } from '../context/AuthContext';
import InteractiveJourney from '../components/InteractiveJourney';

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const getRegisterSteps = (formData) => {
      const activeRole = formData.role || 'buyer';
      
      const commonStart = [
          { id: 'role', type: 'role-selection', prompt: "Join VendorVerse. Are you a Buyer or a Vendor?" }
      ];
      
      const commonEnd = [
          { id: 'email', label: 'Email Address', type: 'email', required: true, prompt: "What's your email?" },
          { id: 'password', label: 'Password', type: 'password', required: true, prompt: 'Choose a secure password' },
          { id: 'phone', label: 'Phone Number', type: 'tel', required: false, prompt: 'What is your phone number?' },
          { id: 'address', label: 'Address', type: 'text', required: false, prompt: 'Where are you located?' }
      ];

      if (activeRole === 'vendor') {
          return [
              ...commonStart,
              { id: 'businessName', label: 'Business Name', type: 'text', required: true, prompt: "What's the name of your business?" },
              { id: 'description', label: 'Business Description', type: 'textarea', required: false, prompt: "Describe what you sell" },
              ...commonEnd
          ];
      } else {
          return [
              ...commonStart,
              { id: 'name', label: 'Full Name', type: 'text', required: true, prompt: "What's your full name?" },
              ...commonEnd
          ];
      }
  };

  const handleRegisterSubmit = async (formData) => {
    const activeRole = formData.role || 'buyer';
    const fn = activeRole === 'vendor' ? registerVendor : registerBuyer;
    
    // We now correctly await the backend database to actually create the user.
    // InteractiveJourney will catch any errors and display them.
    const { data } = await fn(formData);
    
    // Once successful, save the token. InteractiveJourney will handle 
    // the origami animation and navigation.
    login(data.user, data.token);

    // Give the origami animation time to cover the screen before redirecting
    setTimeout(() => {
        navigate(activeRole === 'vendor' ? '/dashboard' : '/');
    }, 3000);
  };

  const TopContent = (
    <div style={{ position: 'absolute', top: '-1rem', right: '0' }}>
      <Link to="/login" style={{ padding: '0.5rem 1rem', color: 'var(--secondary)', textDecoration: 'none', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 600 }}>
          Already have an account? Sign In
      </Link>
    </div>
  );

  return (
    <InteractiveJourney 
      steps={getRegisterSteps}
      onSubmit={handleRegisterSubmit}
      topContent={TopContent}
      ctaText="Create Account"
    />
  );
}
