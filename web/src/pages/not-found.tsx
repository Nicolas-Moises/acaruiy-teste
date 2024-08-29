import { Link } from 'react-router-dom'

import AcaruiyLogo from '@/assets/acaruiy-logo.png'

export function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <img src={AcaruiyLogo} alt="Acaruiy logotipo" className="size-12 rounded-lg" />
      <h1 className="text-4xl font-bold tracking-tight">Página não encontrada</h1>
      <p className="text-accent-foreground">
        Voltar para a{' '}
        <Link to="/" className="text-sky-600 dark:text-sky-400">
          Home
        </Link>
      </p>
    </div>
  )
}