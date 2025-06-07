import { Mail, ArrowLeft, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button.jsx";
import { useState } from "react";
import api from "../api/axios.js";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom"
function EmailVerification() {
    const [isResending, setIsResending] = useState(false);
    const [emailSent, setEmailSent] = useState(false);;
    const location = useLocation();
    const email = location.state?.email;

    const handleResend = async () => {
    if (!email) {
        console.log(email)
     toast.error("Email is missing");
    }

  setIsResending(true);
  try {
    await api.post("/auth/resendVerification", { email }); 
    setEmailSent(true);
    toast.success("Verification email sent successfully");
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to resend email");
  } finally {
    setIsResending(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 relative">
      {/* Top progress bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>

      {/* Centered content box */}
      <div className="max-w-md w-full bg-white rounded-xl p-8 shadow-lg space-y-6 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
          <Mail className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900">Check Your Email</h1>
        <p className="text-gray-600 leading-relaxed">
          We've sent a verification link to your email address. Click the link to activate your account.
        </p>

        {emailSent && (
          <p
            role="alert"
            className="text-green-700 bg-green-100 rounded-md py-2 px-4 font-medium"
          >
            Verification email sent successfully!
          </p>
        )}

        <div className="flex items-start space-x-3 justify-center max-w-sm mx-auto">
          <div className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center mt-1 select-none">
            <span className="text-white text-xs font-bold leading-none">!</span>
          </div>
          <div className="text-left text-amber-800 max-w-xs">
            <p className="text-sm font-semibold mb-1">Can't find the email?</p>
            <p className="text-xs text-amber-700">
              Check your spam folder or try resending the verification email.
            </p>
          </div>
        </div>

        <Button
          onClick={handleResend}
          disabled={isResending}
          type="button"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70"
        >
          {isResending ? (
            <div className="flex items-center justify-center space-x-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Sending...</span>
            </div>
          ) : (
            "Resend Verification Email"
          )}
        </Button>

        <Link to="/login" className="block">
          <Button
            variant="outline"
            type="button"
            className="w-full flex items-center justify-center space-x-2 border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 py-3 rounded-xl transition-all duration-300 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </Button>
        </Link>

        <p className="text-xs text-gray-500 mt-4 max-w-xs mx-auto">
          Didn't receive an email? Contact our support team for assistance.
        </p>
      </div>
    </div>
  );
}

export default EmailVerification;
