import { Link } from 'react-router-dom';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const Landing = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://img.freepik.com/free-photo/violet-watercolor-texture-background_1083-172.jpg?semt=ais_hybrid&w=740&q=80)',
        }}
      />
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-[#C8B6E2]/30" />
      
      <div className="max-w-2xl w-full text-center space-y-12 relative z-10">
        {/* Header Section */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold font-montserrat text-gradient tracking-tight">
            Welcome to Spendwise
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-xl mx-auto">
            Manage your expenses smarter and take control of your finances.
          </p>
        </div>

        {/* Action Cards */}
        <div className="flex flex-col gap-2 mt-16 max-w-md mx-auto">
          {/* Sign In Card */}
          <div className="p-4">
            <p className="text-gray-800 font-medium mb-4 text-lg">
              Already have an account?
            </p>
            <Link
              to="/signin"
              className="inline-flex items-center justify-center gap-2 w-full px-8 py-4 border-2 border-gray-800 text-gray-900 font-semibold rounded-xl hover:bg-gray-900 hover:text-white hover:shadow-lg transition-all duration-200 text-lg"
            >
              <FaSignInAlt />
              Sign In
            </Link>
          </div>

          {/* Sign Up Card */}
          <div className="p-4">
            <p className="text-text font-medium mb-4 text-lg">
              New user?
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 w-full px-8 py-4 bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg text-lg"
            >
              <FaUserPlus />
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
