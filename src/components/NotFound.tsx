import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, AlertCircle } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md mx-auto">
        {/* 404 Visual with Lucide icon */}
        <div className="mb-6 relative">
          <div className="text-9xl font-extrabold text-gray-200">404</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-white rounded-full p-4 shadow-lg">
              <AlertCircle size={64} className="text-[#624d15]" />
            </div>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. The page might have been removed or the URL might be incorrect.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate(-1)} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          
          <Button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 bg-[#624d15] hover:bg-amber-800"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
      
      {/* Rudra Trader branding */}
      <div className="mt-16 text-center">
        <h2 className="text-lg font-bold text-primary">Rudra Trader</h2>
        <p className="text-sm text-gray-500">Always at your service</p>
      </div>
    </div>
  );
};

export default NotFound;