import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

type AuthLayoutProps = {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  step?: { current: number; total: number }
}

const AuthLayout = ({ title, subtitle, children, footer, step }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-md">
        <Link
          to="/"
          className="inline-block text-sm text-amber-600 hover:text-amber-700 font-medium"
        >
          ← Back to Recipe Hub
        </Link>

        {step && (
          <p className="text-xs font-medium uppercase tracking-wide text-amber-600">
            Step {step.current} of {step.total}
          </p>
        )}

        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        {children}
        {footer}
      </div>
    </div>
  )
}

export const AuthLink = ({
  to,
  children,
}: {
  to: string
  children: ReactNode
}) => (
  <Link to={to} className="text-amber-600 hover:text-amber-700 text-sm font-medium">
    {children}
  </Link>
)

export default AuthLayout
