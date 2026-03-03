import { useState } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useStore } from '../store/useStore'
import withAuth from '../src/guards/withAuth'

function Transacciones() {
  const { transactions } = useStore()
  const [filter, setFilter] = useState('Todos')

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'Ingresos') return tx.amount > 0
    if (filter === 'Gastos') return tx.amount < 0
    return true
  })

  const getCategoryClasses = (color) => {
    const colors = {
      purple: 'bg-purple-100 text-purple-800',
      green: 'bg-green-100 text-green-800',
      amber: 'bg-amber-100 text-amber-800',
      blue: 'bg-blue-100 text-blue-800',
      slate: 'bg-slate-100 text-slate-800',
      orange: 'bg-orange-100 text-orange-800',
    }
    return colors[color] || colors.slate
  }

  return (
    <Layout title="Transacciones - Mi Finanzas">
      {/* Header Section */}
      <header className="p-8 pb-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Transacciones</h2>
            <p className="text-slate-500 text-sm">Gestiona y analiza tus movimientos financieros</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
              <span className="material-symbols-outlined text-lg">download</span>
              Exportar CSV
            </button>
            <Link
              href="/nueva_transaccion"
              className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg text-sm font-bold text-white hover:bg-blue-700 transition-colors shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Nueva Transacción
            </Link>
          </div>
        </div>

        {/* Tabs & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200">
          <div className="flex gap-8">
            <button 
              onClick={() => setFilter('Todos')}
              className={`pb-4 border-b-2 text-sm font-bold transition-colors ${filter === 'Todos' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Todos
            </button>
            <button 
              onClick={() => setFilter('Ingresos')}
              className={`pb-4 border-b-2 text-sm font-bold transition-colors ${filter === 'Ingresos' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Ingresos
            </button>
            <button 
              onClick={() => setFilter('Gastos')}
              className={`pb-4 border-b-2 text-sm font-bold transition-colors ${filter === 'Gastos' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Gastos
            </button>
          </div>
          <div className="flex items-center gap-4 pb-3">
            <div className="relative">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Periodo</label>
              <div className="relative">
                <select className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-10 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-w-[160px]">
                  <option>Octubre 2023</option>
                  <option>Septiembre 2023</option>
                  <option>Agosto 2023</option>
                  <option>Últimos 90 días</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Transactions Table */}
      <div className="flex-1 overflow-auto px-8 pb-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Descripción</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Cuenta</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{tx.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-500 text-lg">{tx.icon}</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{tx.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryClasses(tx.categoryColor)}`}>
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{tx.account}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right font-bold ${tx.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.amount >= 0 ? '+' : ''}{tx.amount < 0 ? '-' : ''}${Math.abs(tx.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <p className="text-xs text-slate-500 font-medium">Mostrando 1-6 de 128 transacciones</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs font-bold border border-slate-200 rounded bg-white text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50" disabled>Anterior</button>
              <button className="px-3 py-1 text-xs font-bold border border-slate-200 rounded bg-white text-slate-600 hover:bg-slate-50 transition-colors">Siguiente</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default withAuth(Transacciones)
