import React from "react";
import { ResetPasswordForm } from "components/auth";

const ResetPassword = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 font-main2">
      <ResetPasswordForm />
    </div>
  );
};

export default ResetPassword;