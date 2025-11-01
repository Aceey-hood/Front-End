
import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

// NOTE: This single-file starter is intended to be App.jsx in a Tailwind + Vite React project.
// Replace the placeholder logo at ./public/logo.png and wire up a backend or persistence later.

const SAMPLE_CARDS = [
  { id: 1, name: "Personal Visa", type: "Visa", last4: "4242", country: "Kenya" },
  { id: 2, name: "Work PayPal", type: "PayPal", last4: "—", country: "USA" },
];

const SAMPLE_TRANSACTIONS = [
  { id: 1, date: "2025-10-28", desc: "Groceries", cat: "Food", amount: -12.45 },
  { id: 2, date: "2025-10-27", desc: "Salary", cat: "Income", amount: 1200.0 },
  { id: 3, date: "2025-10-25", desc: "Uber", cat: "Transport", amount: -5.6 },
  { id: 4, date: "2025-10-23", desc: "Electricity Bill", cat: "Bills", amount: -40.0 },
];

const COLORS = ["#6366F1", "#06B6D4", "#F59E0B", "#EF4444", "#10B981"];

function Navbar({ userName = "Brayo" }) {
  return (
    <nav className="flex items-center justify-between p-4 bg-[#f3f9f2] backdrop-blur-sm border-b">
      <div className="flex items-center gap-3">
        <img
  src="logo.png"
  alt="PesaPulse logo"
  className="w-40 h-40 rounded-full object-cover"
/>
        <div>
          <div className="text-xs text-slate-800">Smart expense tracking</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="px-3 py-1 rounded-md bg-indigo-600 text-white">+ Add Card</button>
        <div className="text-sm">{userName} 👋</div>
      </div>
    </nav>
  );
}

function Greeting({ userName = "Brian" }) {
  const hour = new Date().getHours();
  let greet = "Hello";
  if (hour < 12) greet = "Good Morning";
  else if (hour < 18) greet = "Good Afternoon";
  else greet = "Good Evening";
  return (
    <div className="mb-4">
      <h1 className="text-2xl font-bold">{greet}, {userName} 👋</h1>
      <p className="text-sm text-slate-500">Here’s your PesaPulse snapshot for this month.</p>
    </div>
  );
}

function SummaryCards({ transactions }) {
  const income = transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const balance = income - expenses;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="p-4 bg-white rounded-lg shadow-sm">
        <div className="text-sm text-slate-500">Balance</div>
        <div className="text-xl font-semibold">${balance.toFixed(2)}</div>
      </div>
      <div className="p-4 bg-white rounded-lg shadow-sm">
        <div className="text-sm text-slate-500">Income (This month)</div>
        <div className="text-xl font-semibold">${income.toFixed(2)}</div>
      </div>
      <div className="p-4 bg-white rounded-lg shadow-sm">
        <div className="text-sm text-slate-500">Expenses (This month)</div>
        <div className="text-xl font-semibold text-red-600">-${expenses.toFixed(2)}</div>
      </div>
    </div>
  );
}

function CardManager({ cards, onAdd, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", type: "Visa", last4: "", country: "Kenya" });

  function submit(e) {
    e.preventDefault();
    if (!form.name) return;
    onAdd({ ...form, id: Date.now() });
    setForm({ name: "", type: "Visa", last4: "", country: "Kenya" });
    setShowForm(false);
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold">Your Cards</h3>
        <button onClick={() => setShowForm(s => !s)} className="text-sm px-2 py-1 rounded-md bg-indigo-600 text-white">{showForm ? "Close" : "Add Card"}</button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="mb-4 space-y-2">
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Card name (e.g. Personal Visa)" className="w-full p-2 border rounded" />
          <div className="grid grid-cols-2 gap-2">
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="p-2 border rounded">
              <option>Visa</option>
              <option>Mastercard</option>
              <option>PayPal</option>
            </select>
            <input value={form.last4} onChange={e => setForm(f => ({ ...f, last4: e.target.value }))} placeholder="Last 4 digits" className="p-2 border rounded" />
          </div>
          <select value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} className="w-full p-2 border rounded">
            <option>Kenya</option>
            <option>USA</option>
            <option>UK</option>
            <option>Germany</option>
          </select>
          <div className="flex justify-end">
            <button type="submit" className="px-3 py-1 rounded-md bg-green-600 text-white">Save Card</button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {cards.map(c => (
          <div key={c.id} className="flex items-center justify-between p-2 border rounded">
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 bg-slate-100 rounded flex items-center justify-center">{c.type}</div>
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-slate-500">{c.type} • {c.last4}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onDelete(c.id)} className="text-sm px-2 py-1 rounded bg-red-100 text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SpendingAnalytics({ transactions }) {
  // prepare category data
  const catAgg = useMemo(() => {
    const agg = {};
    transactions.forEach(t => {
      const c = t.cat || "Other";
      agg[c] = (agg[c] || 0) + (t.amount < 0 ? Math.abs(t.amount) : 0);
    });
    return Object.entries(agg).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const monthly = useMemo(() => {
    // aggregate by day for a small line chart example
    const dayMap = {};
    transactions.forEach(t => {
      const d = t.date;
      dayMap[d] = (dayMap[d] || 0) + t.amount;
    });
    return Object.entries(dayMap).map(([date, amt]) => ({ date, amt }));
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="p-4 bg-white rounded-lg shadow-sm">
        <h4 className="font-semibold mb-2">Spending by Category</h4>
        <div style={{ width: "100%", height: 240 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={catAgg} dataKey="value" nameKey="name" outerRadius={80} fill="#8884d8">
                {catAgg.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-4 bg-white rounded-lg shadow-sm">
        <h4 className="font-semibold mb-2">Monthly Trend (sample)</h4>
        <div style={{ width: "100%", height: 240 }}>
          <ResponsiveContainer>
            <LineChart data={monthly}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amt" stroke="#6366F1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Transactions({ transactions }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Recent Transactions</h3>
        <div className="text-sm text-slate-500">Showing {transactions.length}</div>
      </div>

      <div className="space-y-2">
        {transactions.map(t => (
          <div key={t.id} className="flex items-center justify-between p-2 border rounded">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center">{t.cat?.charAt(0)}</div>
              <div>
                <div className="font-medium">{t.desc}</div>
                <div className="text-xs text-slate-500">{t.date} • {t.cat}</div>
              </div>
            </div>
            <div className={`font-semibold ${t.amount < 0 ? "text-red-600" : "text-green-600"}`}>{t.amount < 0 ? `-${Math.abs(t.amount).toFixed(2)}` : `+${t.amount.toFixed(2)}`}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [cards, setCards] = useState(SAMPLE_CARDS);
  const [transactions, setTransactions] = useState(SAMPLE_TRANSACTIONS);

  function addCard(c) {
    setCards(s => [c, ...s]);
  }

  function deleteCard(id) {
    setCards(s => s.filter(x => x.id !== id));
  }

  return (
    <div className="min-h-screen bg-[#008B8B] text-slate-800">
      <Navbar userName={"Brayo"} />
      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Greeting userName={"Brian"} />
          <SummaryCards transactions={transactions} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <CardManager cards={cards} onAdd={addCard} onDelete={deleteCard} />

              <SpendingAnalytics transactions={transactions} />
            </div>

            <div className="space-y-4">
              <Transactions transactions={transactions} />

              <div className="p-4 bg-white rounded-lg shadow-sm">
                <h4 className="font-semibold mb-2">Quick Actions</h4>
                <div className="flex flex-col gap-2">
                  <button className="p-2 rounded-md bg-indigo-600 text-white">Add Transaction</button>
                  <button className="p-2 rounded-md border">Export CSV</button>
                  <button className="p-2 rounded-md border">Settings</button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="p-4 text-center text-xs text-slate-500">© PesaPulse — <div className="flex justify-center my-6">
  <img
    src="logo.png"
    alt="PesaPulse logo"
    className="w-60 h-60 rounded-full object-cover"
  />
</div>

</footer>
    </div>
  );
}
