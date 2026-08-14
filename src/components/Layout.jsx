import { NavLink, Outlet } from 'react-router-dom'
import { useState } from 'react'

const navItems = [
  { to: '/', label: 'Tổng quan', icon: '📋' },
  { to: '/vong-1', label: 'Vòng 1', icon: '🟢' },
  { to: '/vong-2', label: 'Vòng 2', icon: '🧮' },
  { to: '/quiz', label: 'Kiểm tra', icon: '📝' },
  { to: '/lo-trinh', label: 'Lộ trình', icon: '🗓️' },
  { to: '/chu-de', label: 'Chủ đề', icon: '🔑' },
]

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-surface">
      <nav className="sticky top-0 z-50 bg-white/92 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
          <NavLink to="/" className="flex items-center gap-2 font-bold text-primary-dark text-lg no-underline">
            🎯 Thi Công Chức
          </NavLink>
          
          <button 
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen 
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-semibold no-underline transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-muted hover:bg-primary-light hover:text-primary'
                  }`
                }
              >
                {item.icon} {item.label}
              </NavLink>
            ))}
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden border-t border-border bg-white px-4 py-2">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2.5 rounded-lg text-sm font-semibold no-underline ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-muted hover:bg-primary-light hover:text-primary'
                  }`
                }
              >
                {item.icon} {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>

      <footer className="text-center text-muted text-xs py-8 border-t border-border mt-12">
        <p>🎯 Ôn thi Viên chức 2026 — Kế toán · Phường Cát Lái, TP.HCM</p>
        <p className="mt-1">Nguồn: Thư viện Pháp luật · Cổng TTĐT Chính phủ · LuatVietnam</p>
      </footer>
    </div>
  )
}
