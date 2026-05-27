"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/common/page-header";
import { AppShell } from "@/components/dashboard/app-shell";
import { useTheme } from "@/components/theme-provider";
import { languageOptions, useTranslation } from "@/i18n";
import { ApiError, getCurrentUser, getStoredUser, setStoredUser, updateCurrentUserProfile, changePassword, forgotPassword, resetPassword } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const emptyProfile = {
  name: "",
  username: "",
  email: ""
};

function getProfileErrorMessage(error, t) {
  if (error instanceof ApiError) {
    if (error.message === "Username already exists") return t("usernameAlreadyExists");
    if (error.message === "Name is required") return t("nameRequired");
    if (error.message === "Username is required") return t("usernameRequired");
    return error.message;
  }

  return t("profileUpdateFailed");
}

function SettingsContent() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useTranslation();
  const [profile, setProfile] = useState(() => getStoredUser() ?? emptyProfile);
  const [formValues, setFormValues] = useState(() => ({
    name: profile.name ?? "",
    username: profile.username ?? "",
    email: profile.email ?? ""
  }));
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const { toast } = useToast();

  // Security state
  const [securityMode, setSecurityMode] = useState("current"); // 'current' | 'otp'

  // Change with current password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState("");

  // Reset flow
  const [resetStep, setResetStep] = useState(1); // 1: send code, 2: enter code+password
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const themeOptions = [
    { value: "light", label: t("light") },
    { value: "dark", label: t("dark") }
  ];
  const isDirty = useMemo(() => (
    formValues.name !== (profile.name ?? "") ||
    formValues.username !== (profile.username ?? "")
  ), [formValues.name, formValues.username, profile.name, profile.username]);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      setIsLoadingProfile(true);
      try {
        const currentUser = await getCurrentUser();
        if (!isMounted) return;
        setProfile(currentUser);
        setStoredUser(currentUser);
        setFormValues({
          name: currentUser.name ?? "",
          username: currentUser.username ?? "",
          email: currentUser.email ?? ""
        });
      } catch (error) {
        if (!isMounted) return;
        setProfileError(error instanceof Error ? error.message : t("profileLoadFailed"));
      } finally {
        if (isMounted) setIsLoadingProfile(false);
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [t]);

  const updateField = (field, value) => {
    setProfileMessage("");
    setProfileError("");
    setFormValues((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setProfileMessage("");
    setProfileError("");
    setFormValues({
      name: profile.name ?? "",
      username: profile.username ?? "",
      email: profile.email ?? ""
    });
  };

  const clearAllSecurityFields = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setResetStep(1);
    setOtpCode("");
    setChangePasswordError("");
    setOtpError("");
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setProfileMessage("");
    setProfileError("");

    const name = formValues.name.trim();
    const username = formValues.username.trim();

    if (!name) {
      setProfileError(t("nameRequired"));
      return;
    }

    if (!username) {
      setProfileError(t("usernameRequired"));
      return;
    }

    if (username.length < 3 || username.length > 30) {
      setProfileError(t("usernameLength"));
      return;
    }

    setIsSavingProfile(true);
    try {
      const updatedUser = await updateCurrentUserProfile({ name, username });
      setProfile(updatedUser);
      setFormValues({
        name: updatedUser.name ?? "",
        username: updatedUser.username ?? "",
        email: updatedUser.email ?? ""
      });
      setProfileMessage(t("profileUpdated"));
    } catch (error) {
      setProfileError(getProfileErrorMessage(error, t));
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <section className="space-y-6">
      <PageHeader title={t("settings")} subtitle={t("settingsSubtitle")} />

      <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 space-y-4">
        <h3 className="font-semibold text-on-surface">{t("appearance")}</h3>
        <div className="flex flex-wrap gap-2">
          {themeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setTheme(option.value)}
              className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                theme === option.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-outline-variant bg-surface-container-low text-on-surface hover:bg-surface-container-high"
              }`}
              aria-pressed={theme === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 space-y-4">
        <h3 className="font-semibold text-on-surface">{t("language")}</h3>
        <div className="flex flex-wrap gap-2">
          {languageOptions.map((option) => (
            <button
              key={option.code}
              type="button"
              onClick={() => setLanguage(option.code)}
              className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                language === option.code
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-outline-variant bg-surface-container-low text-on-surface hover:bg-surface-container-high"
              }`}
              aria-pressed={language === option.code}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <form
        onSubmit={handleProfileSubmit}
        className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 space-y-5"
      >
        <div>
          <h3 className="font-semibold text-on-surface">{t("account")}</h3>
          {isLoadingProfile ? <p className="mt-1 text-sm text-on-surface-variant">{t("loading")}...</p> : null}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-on-surface">{t("name")}</span>
            <input
              type="text"
              value={formValues.name}
              onChange={(event) => updateField("name", event.target.value)}
              className="h-11 w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 text-sm text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              disabled={isSavingProfile}
              autoComplete="name"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-on-surface">{t("username")}</span>
            <input
              type="text"
              value={formValues.username}
              onChange={(event) => updateField("username", event.target.value)}
              className="h-11 w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 text-sm text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              disabled={isSavingProfile}
              autoComplete="username"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-semibold text-on-surface">{t("email")}</span>
            <input
              type="email"
              value={formValues.email}
              className="h-11 w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 text-sm text-on-surface-variant opacity-80"
              disabled
              readOnly
            />
            <span className="block text-xs text-on-surface-variant">{t("emailChangeLater")}</span>
          </label>
        </div>

        {profileMessage ? (
          <p className="rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm font-medium text-green-700 dark:text-green-300">
            {profileMessage}
          </p>
        ) : null}

        {profileError ? (
          <p className="rounded-lg border border-error/30 bg-error-container/30 px-3 py-2 text-sm font-medium text-error">
            {profileError}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={!isDirty || isSavingProfile || isLoadingProfile}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSavingProfile ? `${t("save")}...` : t("saveChanges")}
          </button>
          <button
            type="button"
            onClick={resetForm}
            disabled={!isDirty || isSavingProfile}
            className="rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("cancel")}
          </button>
        </div>
      </form>

      <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 space-y-5">
        <h3 className="font-semibold text-on-surface">Security</h3>

        {/* Change password (default) */}
        {!securityMode || securityMode === "current" ? (
          <div className="space-y-4">
            <form onSubmit={async (e) => {
              e.preventDefault();
              setChangePasswordError("");

              if (!currentPassword || !newPassword || !confirmNewPassword) {
                setChangePasswordError("All fields are required");
                return;
              }
              if (newPassword.length < 6) {
                setChangePasswordError("New password must be at least 6 characters");
                return;
              }
              if (newPassword !== confirmNewPassword) {
                setChangePasswordError("Passwords do not match");
                return;
              }

              setIsChangingPassword(true);
              try {
                await changePassword(currentPassword, newPassword, confirmNewPassword);
                clearAllSecurityFields();
                toast({ title: "Password changed", description: "Your password was updated." });
              } catch (error) {
                const message = error instanceof ApiError ? error.message : (error?.message ?? "Failed to change password");
                setChangePasswordError(message);
              } finally {
                setIsChangingPassword(false);
              }
            }} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-semibold text-on-surface">Current password</span>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="h-11 w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 text-sm text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    disabled={isChangingPassword}
                    autoComplete="current-password"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-on-surface">New password</span>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-11 w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 text-sm text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    disabled={isChangingPassword}
                    autoComplete="new-password"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-on-surface">Confirm new password</span>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="h-11 w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 text-sm text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    disabled={isChangingPassword}
                    autoComplete="new-password"
                  />
                </label>
              </div>

              {changePasswordError ? (
                <p className="rounded-lg border border-error/30 bg-error-container/30 px-3 py-2 text-sm font-medium text-error">{changePasswordError}</p>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isChangingPassword ? `Changing...` : "Change password"}
                </button>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => { setSecurityMode("reset"); setResetStep(1); setOtpError(""); }}
                  disabled={isChangingPassword}
                  className="mt-2 text-sm text-on-surface-variant underline hover:text-on-surface"
                >
                  Forgot password?
                </button>
              </div>
            </form>
          </div>
        ) : null}

        {/* Reset password flow */}
        {securityMode === "reset" ? (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-on-surface">Reset password</h4>
            <p className="text-sm text-on-surface-variant">We will send a verification code to this email.</p>

            {resetStep === 1 ? (
              <div className="space-y-3">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-on-surface">Email</span>
                  <input
                    type="email"
                    value={formValues.email}
                    className="h-11 w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 text-sm text-on-surface-variant opacity-80"
                    disabled
                    readOnly
                  />
                </label>

                {otpError ? (
                  <p className="rounded-lg border border-error/30 bg-error-container/30 px-3 py-2 text-sm font-medium text-error">{otpError}</p>
                ) : null}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={async () => {
                      setOtpError("");
                      setIsSendingOtp(true);
                      try {
                        await forgotPassword(formValues.email);
                        setResetStep(2);
                        toast({ title: "Code sent", description: "Check your email for the verification code." });
                      } catch (error) {
                        setOtpError(error instanceof ApiError ? error.message : (error?.message ?? "Failed to send code"));
                      } finally {
                        setIsSendingOtp(false);
                      }
                    }}
                    disabled={isSendingOtp}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSendingOtp ? `Sending...` : "Send code"}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setSecurityMode("current"); clearAllSecurityFields(); }}
                    className="text-sm text-on-surface-variant underline hover:text-on-surface"
                  >
                    Back to change password
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={async (e) => {
                e.preventDefault();
                setOtpError("");
                if (!/^[0-9]{6}$/.test(otpCode)) {
                  setOtpError("Verification code must be 6 digits");
                  return;
                }
                if (newPassword.length < 6) {
                  setOtpError("New password must be at least 6 characters");
                  return;
                }
                if (newPassword !== confirmNewPassword) {
                  setOtpError("Passwords do not match");
                  return;
                }

                setIsResettingPassword(true);
                try {
                  await resetPassword(formValues.email, otpCode, newPassword, confirmNewPassword);
                  clearAllSecurityFields();
                  setSecurityMode("current");
                  toast({ title: "Password reset", description: "Your password has been reset." });
                } catch (error) {
                  setOtpError(error instanceof ApiError ? error.message : (error?.message ?? "Failed to reset password"));
                } finally {
                  setIsResettingPassword(false);
                }
              }} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <label className="space-y-2 md:col-span-2">
                    <span className="text-sm font-semibold text-on-surface">Email</span>
                    <input
                      type="email"
                      value={formValues.email}
                      className="h-11 w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 text-sm text-on-surface-variant opacity-80"
                      disabled
                      readOnly
                    />
                  </label>

                  <label className="space-y-2 md:col-span-2">
                    <span className="text-sm font-semibold text-on-surface">Verification code</span>
                    <InputOTP
                      maxLength={6}
                      value={otpCode}
                      onChange={(value) => setOtpCode(value.replace(/\D/g, "").slice(0, 6))}
                      disabled={isResettingPassword}
                      containerClassName="justify-center gap-2"
                      className="!w-auto"
                    >
                      <InputOTPGroup className="gap-2">
                        <InputOTPSlot index={0} className="h-11 w-11 rounded-lg border border-outline-variant bg-surface-container-low text-base" />
                        <InputOTPSlot index={1} className="h-11 w-11 rounded-lg border border-outline-variant bg-surface-container-low text-base" />
                        <InputOTPSlot index={2} className="h-11 w-11 rounded-lg border border-outline-variant bg-surface-container-low text-base" />
                        <InputOTPSlot index={3} className="h-11 w-11 rounded-lg border border-outline-variant bg-surface-container-low text-base" />
                        <InputOTPSlot index={4} className="h-11 w-11 rounded-lg border border-outline-variant bg-surface-container-low text-base" />
                        <InputOTPSlot index={5} className="h-11 w-11 rounded-lg border border-outline-variant bg-surface-container-low text-base" />
                      </InputOTPGroup>
                    </InputOTP>
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-on-surface">New password</span>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="h-11 w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 text-sm text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      disabled={isResettingPassword}
                      autoComplete="new-password"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-on-surface">Confirm new password</span>
                    <input
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="h-11 w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 text-sm text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      disabled={isResettingPassword}
                      autoComplete="new-password"
                    />
                  </label>
                </div>

                {otpError ? (
                  <p className="rounded-lg border border-error/30 bg-error-container/30 px-3 py-2 text-sm font-medium text-error">{otpError}</p>
                ) : null}

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isResettingPassword}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isResettingPassword ? `Resetting...` : "Reset password"}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setSecurityMode("current"); clearAllSecurityFields(); }}
                    className="text-sm text-on-surface-variant underline hover:text-on-surface"
                  >
                    Back to change password
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function SettingsPage() {
  return <AppShell title="Settings"><SettingsContent /></AppShell>;
}

export default SettingsPage;
