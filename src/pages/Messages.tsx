import { useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Send, BadgeCheck } from 'lucide-react'
import { sellers } from '../data/sellers'

interface ChatMessage {
  from: 'buyer' | 'seller'
  text: string
}

const openers = [
  'Hi! Is this robot still available?',
  'Could you share more details about the battery life?',
  'Does this ship internationally?',
]

const autoReplies = [
  "Thanks for reaching out! Yes, it's currently in stock and ready to ship.",
  "Great question — I'll get you the full spec sheet shortly.",
  "We ship to most countries; shipping cost is calculated at checkout.",
]

export default function Messages() {
  const [searchParams] = useSearchParams()
  const sellerSlug = searchParams.get('seller')
  const seller = sellers.find((s) => s.slug === sellerSlug) ?? sellers[0]

  const [threads, setThreads] = useState<Record<string, ChatMessage[]>>({})
  const [draft, setDraft] = useState('')

  const activeThread = threads[seller.id] ?? []

  const send = (text: string) => {
    if (!text.trim()) return
    setThreads((prev) => ({
      ...prev,
      [seller.id]: [...(prev[seller.id] ?? []), { from: 'buyer', text }],
    }))
    setDraft('')
    // Simulated seller auto-reply
    setTimeout(() => {
      const reply = autoReplies[Math.floor(Math.random() * autoReplies.length)]
      setThreads((prev) => ({
        ...prev,
        [seller.id]: [...(prev[seller.id] ?? []), { from: 'seller', text: reply }],
      }))
    }, 900)
  }

  const otherSellers = useMemo(() => sellers.filter((s) => s.id !== seller.id).slice(0, 6), [seller])

  return (
    <div className="mx-auto max-w-5xl px-5 lg:px-8 py-10">
      <h1 className="font-display text-2xl font-semibold text-ink mb-6">Messages</h1>
      <div className="grid lg:grid-cols-[260px_1fr] gap-6 rounded-2xl border border-line overflow-hidden">
        {/* Conversation list */}
        <div className="border-b lg:border-b-0 lg:border-r border-line bg-mist/50">
          <Link
            to={`/messages?seller=${seller.slug}`}
            className="flex items-center gap-3 p-4 bg-white border-b border-line"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mist font-display text-sm font-semibold text-teal-800">
              {seller.logoInitial}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink truncate flex items-center gap-1">
                {seller.name} {seller.verified && <BadgeCheck size={12} className="text-teal-600" />}
              </p>
              <p className="text-xs text-slate truncate">{activeThread.length > 0 ? activeThread[activeThread.length - 1].text : 'Start a conversation'}</p>
            </div>
          </Link>
          <div className="hidden lg:block">
            {otherSellers.map((s) => (
              <Link
                key={s.id}
                to={`/messages?seller=${s.slug}`}
                className="flex items-center gap-3 p-4 hover:bg-white transition-colors"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white font-display text-sm font-semibold text-teal-800">
                  {s.logoInitial}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{s.name}</p>
                  <p className="text-xs text-slate truncate">{s.country}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Chat panel */}
        <div className="flex flex-col h-[520px]">
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {activeThread.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-3">
                <p className="text-sm text-slate">Ask {seller.name} a question to get started.</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {openers.map((o) => (
                    <button
                      key={o}
                      onClick={() => send(o)}
                      className="rounded-full border border-line px-3 py-1.5 text-xs text-ink hover:bg-mist"
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              activeThread.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === 'buyer' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.from === 'buyer' ? 'bg-teal-600 text-white' : 'bg-mist text-ink'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))
            )}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              send(draft)
            }}
            className="flex items-center gap-2 border-t border-line p-4"
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write a message..."
              className="input"
            />
            <button
              type="submit"
              aria-label="Send"
              className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-white hover:bg-teal-700 transition-colors"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate">Seller replies are simulated in this prototype.</p>
    </div>
  )
}
