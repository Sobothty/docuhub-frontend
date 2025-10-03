// app/register/page.tsx
import RegisterForm from '@/components/auth/RegisterForm';
import { AuthProvider } from '@/contexts/AuthContext';

export default function RegisterPage() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <AuthProvider>
          <RegisterForm />
        </AuthProvider>
      </div>
    </main>
  );
}
