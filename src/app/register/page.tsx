// app/register/page.tsx
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image - Light Mode */}
      <div className="fixed inset-0 w-full h-full dark:hidden">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/img/backgroundimage.jpg')" }}
        />
      </div>

      {/* Background - Dark Mode */}
      <div className="hidden dark:block fixed inset-0 w-full h-full">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/img/backgroundimage.jpg')" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-center">
        <RegisterForm />
      </div>
    </div>
  );
}
