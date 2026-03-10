import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <LoginForm locale={locale} />
    </div>
  );
}
