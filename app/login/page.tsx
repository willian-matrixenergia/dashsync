import { signIn } from '@/src/lib/auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

// Em Next.js 14+, searchParams é async e deve ser aguardado
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error = params?.error;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#151B1C] relative px-4">
      {/* Ruído abstrato para profundidade e textura técnica */}
      <div className="absolute inset-0 bg-noise pointer-events-none opacity-[0.03] mix-blend-overlay" />

      <div className="z-10 flex flex-col items-center gap-8 w-full max-w-md">
        <Image
          src="/logo-matrix.svg"
          alt="Matrix Energia"
          width={200}
          height={50}
          priority
          className="h-12 w-auto opacity-90 brightness-0 invert"
        />

        <Card className="w-full border-white/10 bg-[#1a2123]/80 backdrop-blur-md shadow-2xl">
          <CardHeader className="space-y-2 text-center pb-6">
            <CardTitle className="text-2xl font-bold tracking-tight text-white">
              Dashboard Executivo
            </CardTitle>
            <CardDescription className="text-sm text-gray-400">
              Acesso restrito a colaboradores Matrix Energia
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error === 'AccessDenied' && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md flex items-center gap-2 text-red-500 text-sm">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>
                  Acesso negado. Apenas e-mails institucionais (@matrixenergia.com) são permitidos.
                </span>
              </div>
            )}
            {error && error !== 'AccessDenied' && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md flex items-center gap-2 text-red-500 text-sm">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>E-mail corporativo ou senha incorretos.</span>
              </div>
            )}

            {/* Formulário de E-mail / Senha com Server Action corrigida */}
            <form
              action={async (formData: FormData) => {
                'use server';
                // No next-auth v5, signIn com credentials lança redirect em caso de sucesso
                // e CredentialsSignIn em caso de falha. O padrão correto é:
                // - Deixar o redirect de sucesso passar (throw error com is_redirect)
                // - Capturar apenas os erros verdadeiros para redirecionar para /login?error=
                try {
                  await signIn('credentials', {
                    email: formData.get('email'),
                    password: formData.get('password'),
                    redirectTo: '/',
                  });
                } catch (err: unknown) {
                  // next/navigation redirect lança um erro especial que deve ser propagado
                  // Verificar se é um redirect do Next.js (tem digest)
                  if (err && typeof err === 'object' && 'digest' in err) {
                    throw err; // Deixa o redirect de sucesso passar
                  }
                  // Qualquer outro erro: credenciais inválidas
                  redirect('/login?error=CredentialsSignin');
                }
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  E-mail Corporativo
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="nome.sobrenome@matrixenergia.com"
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  Senha
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-11"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#FF4A00] hover:bg-[#D14217] text-white font-semibold rounded-lg h-11 mt-2 transition-colors"
              >
                Entrar
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#1a2123] px-2 text-gray-400 rounded-sm">
                  ou continuar com
                </span>
              </div>
            </div>

            <form
              action={async () => {
                'use server';
                await signIn('google', { redirectTo: '/' });
              }}
            >
              <Button
                type="submit"
                variant="outline"
                className="w-full bg-transparent border-white/10 hover:bg-white/5 text-white font-medium rounded-lg h-11"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  aria-hidden="true"
                  focusable="false"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512"
                >
                  <path
                    fill="currentColor"
                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                  ></path>
                </svg>
                Google Corporativo
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center pb-8">
            <Link
              href="mailto:helpdesk@matrixenergia.com?subject=Solicitação de Acesso - SyncDash"
              className="text-sm text-gray-400 hover:text-[#FF4A00] transition-colors"
            >
              Não tem conta? Solicitar acesso
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
