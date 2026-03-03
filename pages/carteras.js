import { useState } from 'react'
import Layout from '../components/Layout'
import { useStore } from '../store/useStore'
import withAuth from '../src/guards/withAuth'

function Carteras() {
  const { accounts } = useStore()
  const [walletName, setWalletName] = useState('')
  const [initialAmount, setInitialAmount] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('savings')
  const [openMenuId, setOpenMenuId] = useState(null)
  const [walletToDelete, setWalletToDelete] = useState(null)
  const [hiddenWallets, setHiddenWallets] = useState([])
  const [editingWallet, setEditingWallet] = useState(null)
  const [walletUpdates, setWalletUpdates] = useState({})
  const [newWallets, setNewWallets] = useState([])
  const [nextId, setNextId] = useState(100)

  // Opciones de iconos disponibles
  const iconOptions = [
    { icon: 'savings', bg: 'bg-blue-100 text-blue-600', label: 'Ahorros' },
    { icon: 'account_balance', bg: 'bg-green-100 text-green-600', label: 'Banco' },
    { icon: 'credit_card', bg: 'bg-indigo-100 text-indigo-600', label: 'Tarjeta' },
    { icon: 'payments', bg: 'bg-emerald-100 text-emerald-600', label: 'Pagos' },
    { icon: 'business_center', bg: 'bg-purple-100 text-purple-600', label: 'Negocio' },
    { icon: 'flight', bg: 'bg-orange-100 text-orange-600', label: 'Viajes' },
    { icon: 'shopping_cart', bg: 'bg-pink-100 text-pink-600', label: 'Compras' },
    { icon: 'home', bg: 'bg-cyan-100 text-cyan-600', label: 'Hogar' },
  ]

  const baseWallets = [
    { id: 1, name: 'Ahorros Personal', balance: 4200, goal: 5000, icon: 'savings', iconBg: 'bg-blue-100 text-blue-600' },
    { id: 2, name: 'Gastos de Negocio', balance: 6800, goal: 10000, icon: 'business_center', iconBg: 'bg-purple-100 text-purple-600' },
    { id: 3, name: 'Fondo de Viajes', balance: 1450, goal: 3000, icon: 'flight', iconBg: 'bg-orange-100 text-orange-600' },
  ]

  // Combinar carteras base con nuevas y aplicar actualizaciones
  const allWallets = [...baseWallets, ...newWallets].map(w => ({
    ...w,
    ...(walletUpdates[w.id] || {})
  }))

  const wallets = allWallets.filter(w => !hiddenWallets.includes(w.id))
  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0)

  const handleDeleteClick = (wallet) => {
    setOpenMenuId(null)
    setWalletToDelete(wallet)
  }

  const handleEditClick = (wallet) => {
    setOpenMenuId(null)
    setEditingWallet(wallet)
    setWalletName(wallet.name)
    setInitialAmount(wallet.balance.toString())
    setSelectedIcon(wallet.icon)
  }

  const cancelEdit = () => {
    setEditingWallet(null)
    setWalletName('')
    setInitialAmount('')
    setSelectedIcon('savings')
  }

  const confirmEdit = (e) => {
    e.preventDefault()
    if (editingWallet) {
      const iconOption = iconOptions.find(i => i.icon === selectedIcon)
      setWalletUpdates({
        ...walletUpdates,
        [editingWallet.id]: {
          name: walletName,
          balance: parseFloat(initialAmount) || 0,
          icon: selectedIcon,
          iconBg: iconOption?.bg || 'bg-blue-100 text-blue-600'
        }
      })
      cancelEdit()
    }
  }

  const handleCreateWallet = (e) => {
    e.preventDefault()
    if (!walletName.trim()) return

    const iconOption = iconOptions.find(i => i.icon === selectedIcon)
    const newWallet = {
      id: nextId,
      name: walletName,
      balance: parseFloat(initialAmount) || 0,
      goal: (parseFloat(initialAmount) || 0) * 1.5 || 1000,
      icon: selectedIcon,
      iconBg: iconOption?.bg || 'bg-blue-100 text-blue-600'
    }

    setNewWallets([...newWallets, newWallet])
    setNextId(nextId + 1)
    setWalletName('')
    setInitialAmount('')
    setSelectedIcon('savings')
  }

  const confirmDelete = () => {
    if (walletToDelete) {
      setHiddenWallets([...hiddenWallets, walletToDelete.id])
      setWalletToDelete(null)
    }
  }

  return (
    <Layout title="Carteras - Mi Finanzas">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 sticky top-0 z-10">
        <h2 className="text-xl font-bold tracking-tight">Mis Carteras</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
            <input
              className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary w-64"
              placeholder="Buscar carteras..."
              type="text"
            />
          </div>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPqiPuXkFo3de2Ksww4MM4161qqzqgoKaO4nwkRynti9sQt3YREeDIpbTkRcPlhH5SDdnMKIqkK_fYNN9b6XNDGuIoRwQ_2l8vQ_LKWqXIbKdANeGjT5Ct-Iu-NSHDfmEGkV_hrJ8_g5zOaNMglNR69QntQz96qIEfwYEt9LU16qm4GzP_pxzFiy9JL3aL8JIeKEw-N09UOR2II0ub5RabS06Ww2SsY4a-thKwss6-yCLKCpXzUVfSy3NkoECqQ1bh_AUUlVEa0eAf"
              alt="User"
            />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-8 space-y-8 overflow-auto flex-1">
        {/* Hero Balance Card */}
        <div className="bg-primary rounded-xl p-8 text-white shadow-lg shadow-primary/20 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm font-medium opacity-90">Balance Total Combinado</p>
            <h3 className="text-4xl font-bold mt-1">${totalBalance.toLocaleString()}.00</h3>
            <div className="flex items-center gap-2 mt-4 bg-white/20 w-fit px-3 py-1 rounded-full text-sm backdrop-blur-md">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>+5.2% este mes</span>
            </div>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
          <span className="material-symbols-outlined absolute -right-8 -bottom-8 text-[160px] opacity-10 rotate-12">account_balance</span>
        </div>

        {/* Create/Edit Wallet Section */}
        <section className="max-w-2xl">
          <div className={`bg-white p-8 rounded-xl border shadow-sm ${editingWallet ? 'border-primary border-2' : 'border-dashed border-slate-300'}`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${editingWallet ? 'bg-amber-100 text-amber-600' : 'bg-primary/10 text-primary'}`}>
                  <span className="material-symbols-outlined">{editingWallet ? 'edit' : 'add_circle'}</span>
                </div>
                <h3 className="text-lg font-bold">
                  {editingWallet ? `Editar: ${editingWallet.name}` : 'Crear Nueva Cartera'}
                </h3>
              </div>
              {editingWallet && (
                <button
                  type="button"
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={cancelEdit}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              )}
            </div>
            <form className="space-y-6" onSubmit={editingWallet ? confirmEdit : handleCreateWallet}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Nombre de la Cartera</label>
                  <input
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="Ej. Ahorros Navidad"
                    type="text"
                    value={walletName}
                    onChange={(e) => setWalletName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">{editingWallet ? 'Balance Actual' : 'Monto Inicial'}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                    <input
                      className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="0.00"
                      type="number"
                      value={initialAmount}
                      onChange={(e) => setInitialAmount(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Icon Selector */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Icono</label>
                <div className="flex flex-wrap gap-2">
                  {iconOptions.map((opt) => (
                    <button
                      key={opt.icon}
                      type="button"
                      onClick={() => setSelectedIcon(opt.icon)}
                      className={`p-3 rounded-lg transition-all ${
                        selectedIcon === opt.icon
                          ? `${opt.bg} ring-2 ring-primary ring-offset-2`
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                      title={opt.label}
                    >
                      <span className="material-symbols-outlined">{opt.icon}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                {editingWallet && (
                  <button
                    type="button"
                    className="px-6 py-3 rounded-lg font-bold text-slate-600 hover:text-slate-900 border border-slate-200 transition-all"
                    onClick={cancelEdit}
                  >
                    Cancelar
                  </button>
                )}
                <button
                  className={`flex items-center gap-2 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-md ${editingWallet ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' : 'bg-primary hover:bg-primary/90 shadow-primary/20'}`}
                  type="submit"
                >
                  <span className="material-symbols-outlined text-xl">{editingWallet ? 'check' : 'add'}</span>
                  <span>{editingWallet ? 'Confirmar Cambios' : 'Crear Cartera'}</span>
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Active Wallets */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Tus Carteras Activas</h3>
            <span className="text-sm text-slate-500">{wallets.length} carteras totales</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {wallets.map((wallet) => {
              const percent = Math.round((wallet.balance / wallet.goal) * 100)
              return (
                <div
                  key={wallet.id}
                  className="bg-white p-6 rounded-xl border border-slate-200 hover:border-primary/50 transition-all relative"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-2 rounded-lg ${wallet.iconBg}`}>
                      <span className="material-symbols-outlined">{wallet.icon}</span>
                    </div>
                    <div className="relative">
                      <button 
                        className="text-slate-400 hover:text-slate-600"
                        onClick={() => setOpenMenuId(openMenuId === wallet.id ? null : wallet.id)}
                      >
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                      
                      {/* Dropdown Menu */}
                      {openMenuId === wallet.id && (
                        <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20 min-w-[140px]">
                          <button
                            className="w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                            onClick={() => handleEditClick(wallet)}
                          >
                            <span className="material-symbols-outlined text-lg">edit</span>
                            Editar
                          </button>
                          <button
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            onClick={() => handleDeleteClick(wallet)}
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-900">{wallet.name}</h4>
                  <p className="text-2xl font-bold mt-2">${wallet.balance.toLocaleString()}.00</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-500">Meta: ${wallet.goal.toLocaleString()}.00</span>
                      <span className="text-primary">{percent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      {walletToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setWalletToDelete(null)}
          ></div>
          
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-8 text-center">
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-red-500 text-3xl">delete</span>
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                ¿Estás seguro de que deseas eliminar esta cartera?
              </h3>
              
              {/* Description */}
              <p className="text-slate-500 text-sm mb-8">
                Esta acción no se puede deshacer. Se perderán todos los registros asociados a esta cartera de forma permanente.
              </p>
              
              {/* Buttons */}
              <div className="space-y-3">
                <button
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                  onClick={confirmDelete}
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                  Eliminar Cartera
                </button>
                <button
                  className="w-full py-3 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl transition-colors"
                  onClick={() => setWalletToDelete(null)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close menu */}
      {openMenuId && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setOpenMenuId(null)}
        ></div>
      )}
    </Layout>
  )
}

export default withAuth(Carteras)
