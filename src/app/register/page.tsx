import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <RegisterForm />
      </div>
    </main>
  );
}

