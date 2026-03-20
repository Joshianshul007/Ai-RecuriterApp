"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../auth.module.css";

type Role = "jobseeker" | "employer";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("jobseeker");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Send role in the payload if needed
    if (role === "jobseeker") {
      data.role = "jobseeker";
    }

    const endpoint =
      role === "employer" ? "/api/v1/auth/hr/register" : "/api/v1/auth/register";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || "Registration failed");
      }

      if (role === "employer") {
        alert("Registration successful! Your account is pending admin approval.");
        router.push("/login");
      } else {
        localStorage.setItem("token", resData.token);
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.registerContainer}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>
            {role === "jobseeker"
              ? "Join AAIRecruiter and find your dream job"
              : "Register as an HR Recruiter and start hiring"}
          </p>
        </div>

        {/* Role Toggle */}
        <div className={styles.toggleContainer}>
          <button
            type="button"
            onClick={() => setRole("jobseeker")}
            className={role === "jobseeker" ? styles.toggleButtonActive : styles.toggleButton}
          >
            Job Seeker
          </button>
          <button
            type="button"
            onClick={() => setRole("employer")}
            className={role === "employer" ? styles.toggleButtonActive : styles.toggleButton}
          >
            Employer / HR
          </button>
        </div>

        {/* ── JOB SEEKER FORM ── */}
        {role === "jobseeker" && (
          <form className={styles.form} onSubmit={onSubmit}>
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}
            <div className={styles.grid2}>
              <Field label="First Name" type="text" name="firstName" placeholder="John" />
              <Field label="Last Name" type="text" name="lastName" placeholder="Doe" />
            </div>
            <Field label="Email Address" type="email" name="email" placeholder="you@example.com"
              icon={<EmailIcon />} />
            <div className={styles.grid2}>
              <Field label="Phone Number" type="tel" name="phone" placeholder="+1 (555) 000-0000"
                icon={<PhoneIcon />} />
              <Field label="Password" type="password" name="password" placeholder="••••••••"
                icon={<LockIcon />} />
            </div>
            <Field label="Confirm Password" type="password" name="confirmPassword" placeholder="••••••••"
              icon={<ShieldIcon />} />
            <TermsCheck />
            <SubmitButton label="Create Account" loading={loading} />
          </form>
        )}

        {/* ── EMPLOYER / HR FORM ── */}
        {role === "employer" && (
          <form className={styles.form} onSubmit={onSubmit}>
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}
            <div className={styles.grid2}>
              <Field label="First Name" type="text" name="firstName" placeholder="Jane" />
              <Field label="Last Name" type="text" name="lastName" placeholder="Smith" />
            </div>
            <div className={styles.grid2}>
              <Field label="Email Address" type="email" name="email" placeholder="hr@company.com"
                icon={<EmailIcon />} />
              <Field label="Phone Number" type="tel" name="phone" placeholder="+1 (555) 000-0000"
                icon={<PhoneIcon />} />
            </div>
            {/* Company fields */}
            <Field label="Company Name" type="text" name="companyName" placeholder="Acme Corp"
              icon={<BuildingIcon />} required />
            <div className={styles.grid2}>
              <Field label="Designation" type="text" name="designation" placeholder="HR Manager"
                icon={<BadgeIcon />} />
              <div>
                <label className={styles.label}>
                  Company Size
                </label>
                <select
                  name="companySize"
                  defaultValue=""
                  className={styles.select}
                >
                  <option value="" disabled className={styles.optionPlaceholder}>Select size</option>
                  {["1-10","11-50","51-200","201-500","501-1000","1000+"].map((s) => (
                    <option key={s} value={s} className={styles.option}>{s} employees</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.grid2}>
              <Field label="Industry" type="text" name="industry" placeholder="Technology" />
              <Field label="Company Website" type="url" name="companyWebsite" placeholder="https://company.com" />
            </div>
            <div className={styles.grid2}>
              <Field label="Password" type="password" name="password" placeholder="••••••••"
                icon={<LockIcon />} />
              <Field label="Confirm Password" type="password" name="confirmPassword" placeholder="••••••••"
                icon={<ShieldIcon />} />
            </div>
            <TermsCheck />
            <SubmitButton label="Register as Employer" loading={loading} />
          </form>
        )}

        {/* Footer */}
        <p className={styles.footerText}>
          Already have an account?{" "}
          <Link href="/login" className={styles.link}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

// ─── Reusable Field ───────────────────────────────────────
function Field({
  label, type, name, placeholder, icon, required = false,
}: {
  label: string;
  type: string;
  name: string;
  placeholder?: string;
  icon?: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label className={styles.label}>{label}</label>
      <div className={styles.inputWrapper}>
        {icon && (
          <span className={styles.inputIconWrapper}>{icon}</span>
        )}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          required={required}
          className={icon ? styles.input : styles.inputNoIcon}
        />
      </div>
    </div>
  );
}

function TermsCheck() {
  return (
    <label className={styles.checkboxWrapper}>
      <input type="checkbox" required className={styles.checkbox} />
      <span className={styles.checkboxText}>
        I agree to the{" "}
        <Link href="/terms" className={styles.link}>Terms of Service</Link>
        {" "}and{" "}
        <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
      </span>
    </label>
  );
}

function SubmitButton({ label, loading }: { label: string; loading?: boolean }) {
  return (
    <button type="submit" disabled={loading} className={styles.submitButton}>
      {loading ? "Please wait..." : label}
    </button>
  );
}

// ─── Icon helpers ─────────────────────────────────────────
const EmailIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const PhoneIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);
const LockIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);
const ShieldIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);
const BuildingIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
  </svg>
);
const BadgeIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);
