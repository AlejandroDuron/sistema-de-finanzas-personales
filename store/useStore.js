import { create } from 'zustand'

export const useStore = create((set) => ({
  count: 0,
  increase: () => set((s) => ({ count: s.count + 1 })),
  decrease: () => set((s) => ({ count: s.count - 1 })),

  accounts: [
    { id: 'acc1', name: 'Caja', balance: 1200.0, type: 'Efectivo' },
    { id: 'acc2', name: 'Cuenta Banco', balance: 3400.5, type: 'Banco' }
  ],

  transactions: [
    { id: 1, date: '24 Oct 2023', description: 'Suscripción Netflix', icon: 'movie', category: 'Entretenimiento', categoryColor: 'purple', account: 'Visa Débito (...4421)', amount: -15.99 },
    { id: 2, date: '23 Oct 2023', description: 'Depósito Nómina Acme Inc.', icon: 'work', category: 'Salario', categoryColor: 'green', account: 'Cuenta Corriente', amount: 2500.00 },
    { id: 3, date: '22 Oct 2023', description: 'Supermercado Central', icon: 'shopping_cart', category: 'Alimentación', categoryColor: 'amber', account: 'Efectivo', amount: -85.40 },
    { id: 4, date: '21 Oct 2023', description: 'Pago Gimnasio Power', icon: 'fitness_center', category: 'Salud', categoryColor: 'blue', account: 'Visa Débito (...4421)', amount: -45.00 },
    { id: 5, date: '20 Oct 2023', description: 'Transferencia Bizum Recibida', icon: 'swap_horiz', category: 'Otros', categoryColor: 'slate', account: 'Cuenta Corriente', amount: 20.00 },
    { id: 6, date: '19 Oct 2023', description: 'Cena Restaurante El Olivo', icon: 'restaurant', category: 'Restauración', categoryColor: 'orange', account: 'Efectivo', amount: -32.50 },
  ],

  budgets: [
    { id: 'b1', name: 'Comida', limit: 300 },
    { id: 'b2', name: 'Transporte', limit: 100 }
  ],

  addTransaction: (tx) => set((state) => {
    const id = Date.now()
    const newTx = {
      id,
      date: tx.date || new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      description: tx.description,
      icon: tx.icon || 'payments',
      category: tx.category || 'Otros',
      categoryColor: tx.categoryColor || 'slate',
      account: tx.accountName || 'Efectivo',
      amount: tx.amount
    }
    return { transactions: [newTx, ...state.transactions] }
  })
}))
