import { AdSubmissionForm } from '@/components/AdSubmissionForm';
import { useNavigate } from 'react-router-dom';

const SubmitAd = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/marketplace');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              List Your Business
            </h1>
            <p className="text-xl text-muted-foreground">
              Connect with the Muslim community and grow your halal business
            </p>
          </div>
          
          <AdSubmissionForm onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
};

export default SubmitAd;