import { NavLink, Outlet } from 'react-router-dom'
import { useState } from 'react'
import { useTheme } from './ThemeContext'

const navItems = [
  { to: '/', label: 'Tổng quan', icon: '📋' },
  { to: '/vong-1', label: 'Vòng 1', icon: '🟢' },
  { to: '/vong-2', label: 'Vòng 2', icon: '🧮' },
  { to: '/quiz', label: 'Kiểm tra', icon: '📝' },
  { to: '/lo-trinh', label: 'Lộ trình', icon: '🗓️' },
  { to: '/chu-de', label: 'Chủ đề', icon: '🔑' },
  { to: '/hoi-dap', label: 'Hỏi đáp', icon: '💬' },
]

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { dark, toggle } = useTheme()

  return (
    <div className="min-h-screen bg-surface text-ink">
      <nav className="sticky top-0 z-50 bg-white/92 dark:bg-[#1a1d2e]/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
          <NavLink to="/" className="flex items-center gap-2 font-heading font-bold text-primary-dark dark:text-primary text-[15px] no-underline">
            🎯 Thi Công Chức
          </NavLink>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggle}
              className="p-2 rounded-lg bg-surface dark:bg-[#252840] hover:bg-gray-200 dark:hover:bg-[#2f3352] transition-colors border border-border"
              title={dark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
            >
              {dark ? (
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#252840]"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-[13px] font-semibold no-underline transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-muted hover:bg-primary-light dark:hover:bg-[#252840] hover:text-primary'
                  }`
                }
              >
                {item.icon} {item.label}
              </NavLink>
            ))}
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden border-t border-border bg-white dark:bg-[#1a1d2e] px-4 py-2">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2.5 rounded-lg text-[13px] font-semibold no-underline ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-muted hover:bg-primary-light dark:hover:bg-[#252840] hover:text-primary'
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

      <footer className="text-center text-muted text-[12px] py-8 border-t border-border mt-12">
        <p>🎯 Ôn thi Viên chức 2026 — Kế toán · Phường Cát Lái, TP.HCM</p>
        <p className="mt-1">Nguồn: Thư viện Pháp luật · Cổng TTĐT Chính phủ · LuatVietnam</p>
      </footer>
    </div>
  )
}
