import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authApi } from "../../api/auth.api";

const LoginSchema = z.object({
  password: z.string().min(1, "La contraseña es requerida"),
});
type LoginForm = z.infer<typeof LoginSchema>;

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
  });

  async function onSubmit({ password }: LoginForm) {
    setLoading(true);
    setServerError(null);
    try {
      const { token } = await authApi.login(password);
      localStorage.setItem("admin_token", token);
      navigate("/admin/dashboard");
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { status?: number };
      };
      const status = axiosErr?.response?.status;
      if (status === 401) {
        setServerError("Contraseña incorrecta");
      } else if (status === 429) {
        setServerError("Demasiados intentos. Espera 5 minutos.");
      } else {
        setServerError("Error de conexión. Inténtalo de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  }

  const errorMessage = errors.password?.message ?? serverError;

  return (
    <main
      className="min-h-dvh flex items-center justify-center p-4 grain"
      style={{
        background:
          "radial-gradient(ellipse at 30% 40%, rgba(242,196,160,0.35) 0%, transparent 55%), " +
          "radial-gradient(ellipse at 75% 65%, rgba(122,158,126,0.18) 0%, transparent 50%), " +
          "#FAF6F0",
      }}
    >
      {/* Background decorative circles */}
      <div
        aria-hidden="true"
        className="fixed top-[-80px] right-[-80px] w-[320px] h-[320px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(201,131,106,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="fixed bottom-[-60px] left-[-60px] w-[260px] h-[260px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(122,158,126,0.1) 0%, transparent 70%)",
        }}
      />

      <div
        className="w-full max-w-sm animate-scale-in"
        style={{
          background: "#FDFAF6",
          borderRadius: "24px",
          boxShadow: "var(--shadow-warm-xl)",
          border: "1px solid rgba(242,196,160,0.35)",
          padding: "40px 36px",
        }}
      >
        {/* Logo area */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{
              background: "linear-gradient(135deg, #F2C4A0, #C9836A)",
              boxShadow: "0 4px 16px rgba(201,131,106,0.35)",
            }}
          >
            <span className="text-2xl" aria-hidden="true">🧶</span>
          </div>
          <h1
            className="font-display text-3xl font-bold"
            style={{ color: "#3D2B1F" }}
          >
            Panel Admin
          </h1>
          <p
            className="font-body text-sm mt-1"
            style={{ color: "#9E7055" }}
          >
            AmigurumiShop
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block font-body text-sm font-medium mb-2"
              style={{ color: "#6B3E2C" }}
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPass ? "text" : "password"}
                autoComplete="current-password"
                aria-describedby={errorMessage ? "password-error" : undefined}
                aria-invalid={!!errorMessage}
                {...register("password")}
                className="w-full font-body text-sm focus:outline-none pr-10"
                style={{
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: errorMessage
                    ? "1.5px solid #DC2626"
                    : "1.5px solid rgba(201,131,106,0.35)",
                  background: "#FAF6F0",
                  color: "#3D2B1F",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onFocus={(e) => {
                  if (!errorMessage) {
                    e.currentTarget.style.borderColor = "#C9836A";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(201,131,106,0.15)";
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errorMessage
                    ? "#DC2626"
                    : "rgba(201,131,106,0.35)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 font-body text-xs"
                style={{ color: "#9E7055" }}
                tabIndex={-1}
                aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPass ? "ocultar" : "ver"}
              </button>
            </div>
            {errorMessage && (
              <p
                id="password-error"
                role="alert"
                className="mt-2 font-body text-sm"
                style={{ color: "#DC2626" }}
              >
                {errorMessage}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="w-full font-body font-medium text-sm ripple transition-all duration-200"
            style={{
              padding: "13px 0",
              borderRadius: "12px",
              background: loading
                ? "rgba(201,131,106,0.5)"
                : "linear-gradient(135deg, #C9836A, #B8654A)",
              color: "#FAF6F0",
              boxShadow: loading
                ? "none"
                : "0 3px 14px rgba(201,131,106,0.4)",
              cursor: loading ? "not-allowed" : "pointer",
              border: "none",
            }}
          >
            {loading ? "Ingresando..." : "Ingresar al panel"}
          </button>
        </form>

        <p
          className="font-body text-xs text-center mt-6"
          style={{ color: "#BFA090" }}
        >
          Acceso exclusivo para administradores
        </p>
      </div>
    </main>
  );
}
