import { useEffect, useState } from "react";
import { apiPost } from "../../utils/apiHelper";
import { Input, Button, Alert } from "antd";
import "../../styles/otpform.css"; // Import CSS file

const OTPForm = () => {
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedUserId = localStorage.getItem("user_id");

    if (storedEmail) setEmail(storedEmail);
    if (storedUserId) setUserId(storedUserId);
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  useEffect(() => {
    const updateTheme = () => {
      setDarkMode(localStorage.getItem("theme") === "dark");
    };

    window.addEventListener("themeChange", updateTheme);
    window.addEventListener("storage", updateTheme);

    return () => {
      window.removeEventListener("themeChange", updateTheme);
      window.removeEventListener("storage", updateTheme);
    };
  }, []);

  const handleSendOTP = async () => {
    setLoading(true);
    setError("");

    const response = await apiPost("auth/generate-otp", { user_id: userId });

    setLoading(false);

    if (response.success) {
      setOtpSent(true);
      setResendTimer(60);
      setCanResend(false);
    } else {
      setError(response.message || "Failed to send OTP.");
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setLoading(true);
    setError("");

    const response = await apiPost("auth/resend-otp", { user_id: userId });

    setLoading(false);

    if (response.success) {
      setResendTimer(60);
      setCanResend(false);
    } else {
      setError(response.message || "Failed to resend OTP.");
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setError("");
  
    const otpCode = otp.join("");
  
    const otpResponse = await apiPost("auth/verify-otp", { user_id: userId, otp: otpCode });
  
    setLoading(false);
  
    if (otpResponse.success) {
      // Dispatch the OTP verified event
      window.dispatchEvent(new CustomEvent("otpVerified"));
    } else {
      setError(otpResponse.message || "OTP Verification Failed.");
    }
  };

  const handleOTPChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  return (
    <div className={`otp-container ${darkMode ? "otp-dark" : "otp-light"}`}>
    <h2 className="otp-title">Enter OTP</h2>

    {error && <Alert message={error} type="error" showIcon className="otp-alert" />}

    {!otpSent ? (
        <>
        <p className="otp-text">
            The OTP will be sent to this email: <strong>{email}</strong>
        </p>
        <Button
            type="primary"
            className="otp-button otp-button-primary"
            size="large"
            onClick={handleSendOTP}
            loading={loading}
        >
            Send OTP
        </Button>
        </>
    ) : (
        <>
        <p className="otp-text">
            OTP sent to: <strong>{email}</strong>
        </p>

        <div className="flex justify-center gap-2 mb-4">
            {otp.map((digit, index) => (
            <Input
                key={index}
                id={`otp-${index}`}
                value={digit}
                onChange={(e) => handleOTPChange(index, e.target.value)}
                maxLength={1}
                className={`otp-input ${darkMode ? "otp-input-dark" : "otp-input-light"}`}
            />
            ))}
        </div>

        <div className="otp-button-group">
        <Button
        type="default"
        disabled={!canResend}
        onClick={handleResendOTP}
        className={`otp-resend ${canResend ? "otp-resend-enabled" : "otp-resend-disabled"}`}
        >
        Resend OTP {canResend ? "" : `(${resendTimer}s)`}
        </Button>

            <Button
            type="primary"
            onClick={handleVerifyOTP}
            loading={loading}
            className="otp-button otp-button-primary"
            >
            Verify OTP
            </Button>
        </div>
        </>
    )}
    </div>
    );
};

export default OTPForm;
