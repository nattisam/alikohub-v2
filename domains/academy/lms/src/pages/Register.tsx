import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRegister, useUser } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AuthLayout from "@/components/auth/AuthLayout";
import PasswordInput from "@/components/auth/PasswordInput";

const registerSchema = zod.object({
  firstname: zod.string().min(2, "First name must be at least 2 characters"),
  lastname: zod.string().min(2, "Last name must be at least 2 characters"),
  email: zod.string().email("Invalid email address"),
  password: zod.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormValues = zod.infer<typeof registerSchema>;

const passwordChecks = [
  { label: "At least 6 characters", test: (p: string) => p.length >= 6 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /\d/.test(p) },
];

const RegisterPage = () => {
  const { mutate: register, isPending } = useRegister();
  const { data: user } = useUser();
  const navigate = useNavigate();
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (user.globalRole === "ADMIN") {
        navigate("/admin");
      } else if (user.academyActiveRole === "instructor") {
        navigate("/instructor");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    },
  });

  const passwordValue = form.watch("password");

  const onSubmit = (values: RegisterFormValues) => {
    if (!captchaValue) return;
    register({ ...values, captchaToken: captchaValue });
  };

  return (
    <AuthLayout
      heading="Create your account"
      subheading="Join 1,200+ learners already on Aliko Academy"
    >
      <Form {...form}>
        <motion.form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          {/* First & Last Name row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input
                      id="firstname"
                      placeholder="John"
                      autoComplete="given-name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input
                      id="lastname"
                      placeholder="Doe"
                      autoComplete="family-name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    id="signup-password"
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />

                {/* Password strength checklist */}
                {passwordValue.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="space-y-1 pt-1"
                  >
                    {passwordChecks.map((c) => (
                      <div
                        key={c.label}
                        className="flex items-center gap-2 text-xs"
                      >
                        <CheckCircle2
                          className={`h-3.5 w-3.5 transition-colors ${
                            c.test(passwordValue)
                              ? "text-primary"
                              : "text-muted-foreground/40"
                          }`}
                        />
                        <span
                          className={
                            c.test(passwordValue)
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }
                        >
                          {c.label}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </FormItem>
            )}
          />

          {/* ReCAPTCHA */}
          <div className="flex justify-center py-1">
            <ReCAPTCHA
              sitekey={
                import.meta.env.VITE_RECAPTCHA_SITE_KEY ||
                "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              }
              onChange={(value) => setCaptchaValue(value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11 font-semibold"
            disabled={isPending || !captchaValue}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Create account"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </motion.form>
      </Form>
    </AuthLayout>
  );
};

export default RegisterPage;
