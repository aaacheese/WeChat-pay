import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import './hero.css'
import './checkin.css'
import './rewards.css'
import './earn.css'
import './mainland.css'
import './project-switcher.css'

const A = '/assets/'

const mainlandDouyinItems = Array.from({ length: 4 }, () => ({ merchant: '抖音', value: 2, points: 2500, width: 98 }))
const mainlandJdItems = [
  { merchant: '京東', value: 2, points: 2500, width: 107 },
  { merchant: '京東', value: 5, points: 5000, width: 106 },
  { merchant: '京東', value: 1, points: 500, width: 106 },
]

function StatusBar() {
  return (
    <div className="statusbar">
      <b>9:41</b>
      <div className="status-icons"><span className="signal">▮▮▮▮</span><span className="wifi">◒</span><span className="battery"><i /></span></div>
    </div>
  )
}

function Header() {
  return (
    <header className="header">
      <button className="icon-button close" aria-label="關閉" type="button" />
      <strong style={{ fontWeight: 500 }}>WePoints積分</strong>
      <button className="icon-button more" aria-label="更多" type="button"><i /><i /><i /></button>
    </header>
  )
}

function PointsHero() {
  return (
    <section className="points-hero">
      <img className="hero-shape" src={`${A}hero-panel.svg`} alt="" />
      <div className="hero-decoration" aria-hidden="true"><div className="hero-decoration-crop"><img src={`${A}hero-coins.png`} alt="" /></div></div>
      <div className="hero-content">
        <div className="hero-balance">
          <div className="hero-balance-title">我的積分<img src={`${A}hero-arrow-dark.svg`} alt="" /></div>
          <div className="hero-balance-row">
            <div className="points-total"><img src={`${A}hero-coin.png`} alt="" /><b>609</b></div>
            <span className="hero-rate">消费 HK$1=赚 1 积分</span>
          </div>
        </div>
        <div className="hero-bottom">
          <div className="earn-pill">
            <span className="earn-pill-brand">We<span>Points</span><sup>TM</sup></span>
            <span className="earn-pill-copy">积分当钱花，付款直接抵</span>
          </div>
          <span className="claimed-coupons">已領優惠券<img src={`${A}hero-arrow.svg`} alt="" /></span>
        </div>
        <div className="hero-hand-wrap" aria-hidden="true"><img className="hero-hand" src={`${A}hero-hand.png`} alt="" /></div>
      </div>
    </section>
  )
}

const checkins = [10, 10, 50, 30, 50, 50, 100]

function CheckinCard() {
  const [reminder, setReminder] = useState(false)
  const [checkedIn, setCheckedIn] = useState(false)
  const [showCheckinToast, setShowCheckinToast] = useState(false)
  const toastTimer = useRef(null)

  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  const handleCheckin = () => {
    if (checkedIn) return
    setCheckedIn(true)
    setShowCheckinToast(true)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setShowCheckinToast(false), 1000)
  }

  return (
    <section className="card checkin-card">
      <div className="card-head">
        <b>已連續簽到 <em>{checkedIn ? 2 : 1}</em> 天</b>
        <div className="checkin-actions"><span>簽到提醒</span><button className={`switch ${reminder ? 'on' : ''}`} onClick={() => setReminder(v => !v)} aria-label="簽到提醒"><i /></button><button className={`success ${checkedIn ? 'signed' : ''}`} onClick={handleCheckin} disabled={checkedIn}>{checkedIn ? '簽到成功' : '立刻簽到'}</button></div>
      </div>
      <div className="checkin-days">
        {checkins.map((value, index) => (
          <div className={`day ${index === 1 ? 'active' : ''} ${checkedIn && index === 0 ? 'muted' : ''} ${checkedIn && index === 2 ? 'earned' : ''}`} key={index}>
            <div className="day-icon">{index === 1 || (checkedIn && index === 2) ? <span>✓</span> : <img src={index === 6 ? `${A}raw-04.png` : `${A}raw-09.png`} alt="" />}<small>+{value}</small></div>
            <span>{index === 2 ? '今天' : `第${index + 1}天`}</span>
          </div>
        ))}
      </div>
      <div className="checkin-foot"><span className="note-dot">▣</span><span>【限時】指定線上消費得5倍積分</span><button type="button">查看更多 ›</button></div>
      {showCheckinToast && <div className="checkin-toast" role="status" aria-live="polite">簽到成功</div>}
    </section>
  )
}

function SpendingCard() {
  const stripRef = useRef(null)
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0 })
  const coupons = [
    { value: 5, points: 10, special: true },
    { value: 1, points: 2000 },
    { value: 2, points: 2500 },
    { value: 40, points: 50 },
    { value: 40, points: 50 },
    { value: 40, points: 50 },
    { value: 40, points: 50 },
    { value: 40, points: 50 },
  ]

  const beginDrag = (event) => {
    const strip = stripRef.current
    if (!strip) return
    dragRef.current = { active: true, startX: event.clientX, scrollLeft: strip.scrollLeft }
    strip.setPointerCapture(event.pointerId)
    event.preventDefault()
  }

  const moveDrag = (event) => {
    const strip = stripRef.current
    if (!strip || !dragRef.current.active) return
    strip.scrollLeft = dragRef.current.scrollLeft - (event.clientX - dragRef.current.startX)
    event.preventDefault()
  }

  const endDrag = (event) => {
    dragRef.current.active = false
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  return (
    <section className="card spending-card">
      <div className="section-row"><b>消費越多，換領更多獎勵</b><button type="button">查看更多 ›</button></div>
      <div
        className="coupon-strip"
        aria-label="優惠券，可橫向滑動"
        ref={stripRef}
        onPointerDown={beginDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDragStart={(event) => event.preventDefault()}
      >
        {coupons.map(({ value, points, special }, index) => (
          <article className="coupon-ticket" key={`${value}-${index}`}>
            <img className="coupon-layer coupon-bg" src={`${A}coupon-bg.svg`} alt="" />
            <img className="coupon-layer coupon-line" src={`${A}coupon-line.svg`} alt="" />
            <img className="coupon-layer coupon-top" src={`${A}${special ? 'coupon-top-special.svg' : 'coupon-top.svg'}`} alt="" />
            {special && <b className="coupon-special">特邀用戶專享</b>}
            <div className="coupon-brand"><img src={`${A}coupon-wechat.svg`} alt="" />WeChat Pay</div>
            <div className="coupon-value"><span>HK$</span><b>{value}</b></div>
            <p>電子現金</p>
            <div className="coupon-price">
              {special && <del>5000</del>}
              <b>{points}</b>
              <img src={`${A}coupon-coin.png`} alt="積分" />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function RewardCard({ kind = 'watsons', showLimited = true }) {
  const green = kind === 'wechat'
  return (
    <article className={`reward-card ${green ? 'wechat' : 'watsons'}`}>
      <div className="reward-visual">
        {green ? (
          <div className="reward-wechat-art">
            <div className="reward-wechat-glass" />
            <img src={`${A}reward-wechat.svg`} alt="WeChat Pay HK" />
            <span>WeChat Pay HK</span>
          </div>
        ) : (
          <>
            <img className="reward-watsons-art" src={`${A}reward-watsons.svg`} alt="Watsons 屈臣氏" />
            {showLimited && <span className="limited">限時優惠</span>}
          </>
        )}
      </div>
      <div className="reward-body">
        <div className="reward-description"><small>屈臣氏</small><p>屈臣氏HK$5專屬電子現金券</p></div>
        <div className="reward-action-row">
          <div className="reward-price"><span>HK$</span><b>5</b></div>
          <button className="reward-redeem" type="button" aria-label="使用 2500 積分搶購">
            <span className="reward-points">2500<img src={`${A}reward-coin.png`} alt="積分" /></span>
            <span className="reward-claim"><img src={`${A}reward-cta.svg`} alt="" /><i>搶</i></span>
          </button>
        </div>
      </div>
    </article>
  )
}

function MerchantIcon({ kind }) {
  if (kind === 'jd') return <img className="mainland-jd-icon" src={`${A}mainland-jd.svg`} alt="京東" />

  return (
    <span className="mainland-douyin-icon" aria-hidden="true">
      <img className="douyin-full" src={`${A}mainland-douyin-frame.svg`} alt="" />
      <img className="douyin-vector-a" src={`${A}mainland-douyin-vector-a.svg`} alt="" />
      <img className="douyin-vector-b" src={`${A}mainland-douyin-vector-b.svg`} alt="" />
      <img className="douyin-full" src={`${A}mainland-douyin-mark.svg`} alt="" />
      <img className="douyin-mark-a" src={`${A}mainland-douyin-mark-a.svg`} alt="" />
      <img className="douyin-mark-b" src={`${A}mainland-douyin-mark-b.svg`} alt="" />
      <img className="douyin-mark-c" src={`${A}mainland-douyin-mark-c.svg`} alt="" />
    </span>
  )
}

function MerchantVoucher({ merchant, value, points, width }) {
  return (
    <article className="merchant-voucher" style={{ width, flexBasis: width }}>
      <div className="merchant-voucher-value">
        <small>專屬電子現金券</small>
        <div><span>HK$</span><b>{value}</b></div>
      </div>
      <p>{merchant}專屬電子現金券</p>
      <button type="button" className="merchant-voucher-points" aria-label={`${points} 積分`}>
        <span>{points}</span><img src={`${A}reward-coin.png`} alt="積分" />
      </button>
    </article>
  )
}

function MerchantVoucherGroup({ kind, title, items }) {
  const trackRef = useRef(null)
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0 })

  const beginDrag = (event) => {
    const track = trackRef.current
    if (!track) return
    dragRef.current = { active: true, startX: event.clientX, scrollLeft: track.scrollLeft }
    track.setPointerCapture(event.pointerId)
    event.preventDefault()
  }

  const moveDrag = (event) => {
    const track = trackRef.current
    if (!track || !dragRef.current.active) return
    track.scrollLeft = dragRef.current.scrollLeft - (event.clientX - dragRef.current.startX)
    event.preventDefault()
  }

  const endDrag = (event) => {
    dragRef.current.active = false
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  return (
    <section className={`merchant-voucher-group ${kind}`}>
      <div className="merchant-voucher-head">
        <div><MerchantIcon kind={kind} /><b>{title}</b></div>
        <button type="button">查看更多<img src={`${A}mainland-arrow.svg`} alt="" /></button>
      </div>
      <div
        className="merchant-voucher-track"
        ref={trackRef}
        onPointerDown={beginDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDragStart={(event) => event.preventDefault()}
        aria-label={`${title}，可橫向滑動`}
      >
        {items.map((item, index) => <MerchantVoucher {...item} key={`${kind}-${index}`} />)}
      </div>
    </section>
  )
}

function MainlandRewards() {
  return (
    <div className="mainland-rewards" id="redeem-rewards-panel" role="tabpanel" aria-labelledby="redeem-rewards-tab">
      <MerchantVoucherGroup kind="douyin" title="抖音禮券" items={mainlandDouyinItems} />
      <MerchantVoucherGroup kind="jd" title="京東禮券" items={mainlandJdItems} />
      <div className="mainland-large-cards"><RewardCard showLimited={false} /><RewardCard kind="wechat" /></div>
    </div>
  )
}

function EarnTask({ signup = false }) {
  return (
    <div className="earn-task-block">
      <div className="earn-task">
        <div className="earn-task-main">
          <div className="earn-task-icon"><img src={`${A}earn-fubon.svg`} alt="富邦信用卡" /></div>
          <div className="earn-task-copy">
            <p>富邦信用卡賺3倍積分（限香港）</p>
            <div><span>3 x</span><img src={`${A}reward-coin.png`} alt="積分" /></div>
          </div>
        </div>
        {signup ? <button type="button" className="earn-signup">報名</button> : <span className="earn-remaining">剩餘48天</span>}
      </div>
      <img className="earn-divider" src={`${A}earn-divider.svg`} alt="" />
    </div>
  )
}

function EarnPointsPanel() {
  return (
    <div className="earn-panel-content" id="earn-points-panel" role="tabpanel" aria-labelledby="earn-points-tab">
      <div className="earn-mission">
        <span className="earn-exclusive">內地用戶尊享</span>
        <div className="earn-mission-card">
          <div className="earn-mission-row">
            <div className="earn-mission-copy"><span>內地商戶消費5筆</span><span className="earn-mission-points"><img src={`${A}reward-coin.png`} alt="積分" />+15000</span></div>
            <span className="earn-orders-left">還差2單</span>
          </div>
          <img className="earn-progress" src={`${A}earn-progress.svg`} alt="已完成 3 筆，還差 2 筆" />
        </div>
      </div>
      <div className="earn-category-crop" aria-label="精選 7、內地 5、本港 6、迎新賞 11">
        <img src={`${A}earn-tabs.png`} alt="" />
      </div>
      <div className="earn-task-list">
        <EarnTask />
        <EarnTask signup />
        <EarnTask />
        <EarnTask />
        <EarnTask />
        <EarnTask />
      </div>
    </div>
  )
}

function Rewards() {
  const [mode, setMode] = useState('redeem')
  const [tab, setTab] = useState(0)
  const labels = ['限時搶購', '我能兌換', '內地優惠', '本港優惠', '匯款/繳費']
  return (
    <section className={`rewards ${mode === 'earn' ? 'earn-mode' : ''} ${mode === 'redeem' && tab === 2 ? 'mainland-mode' : ''}`}>
      <img className="rewards-panel" src={`${A}${mode === 'earn' ? 'earn-panel.svg' : 'reward-panel.svg'}`} alt="" />
      <div className="reward-mode-tabs" role="tablist" aria-label="積分功能">
        <button id="redeem-rewards-tab" className={`reward-mode-tab reward-mode-redeem ${mode === 'redeem' ? 'active' : ''}`} type="button" role="tab" aria-selected={mode === 'redeem'} aria-controls="redeem-rewards-panel" onClick={() => setMode('redeem')}>
          <span>兌換獎勵</span>{mode === 'redeem' && <img src={`${A}reward-underline.svg`} alt="" />}
        </button>
        <button id="earn-points-tab" className={`reward-mode-tab reward-mode-earn ${mode === 'earn' ? 'active' : ''}`} type="button" role="tab" aria-selected={mode === 'earn'} aria-controls="earn-points-panel" onClick={() => setMode('earn')}>
          <span>賺積分當錢花</span>{mode === 'earn' && <img src={`${A}earn-underline.svg`} alt="" />}
        </button>
      </div>
      {mode === 'redeem' ? <>
        <div className="tabs">{labels.map((label, i) => <button type="button" className={tab === i ? 'selected' : ''} onClick={() => setTab(i)} key={label}>{label}</button>)}</div>
        {tab === 2 ? <MainlandRewards /> : <div className="reward-rows" id="redeem-rewards-panel" role="tabpanel" aria-labelledby="redeem-rewards-tab">
          <div className="reward-row"><RewardCard /><RewardCard kind="wechat" /></div>
          <div className="reward-row reward-row-second"><RewardCard /><RewardCard kind="wechat" /></div>
        </div>}
      </> : <EarnPointsPanel />}
    </section>
  )
}

function ProjectSwitcher() {
  const [open, setOpen] = useState(false)
  const switcherRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const closeOnOutsidePress = (event) => {
      if (!switcherRef.current?.contains(event.target)) setOpen(false)
    }
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', closeOnOutsidePress)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePress)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  return (
    <aside className={`project-switcher ${open ? 'open' : ''}`} ref={switcherRef}>
      <button
        className="project-switcher-trigger"
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls="project-switcher-menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span><small>切換作品</small><strong>WePoints 積分</strong></span>
        <i aria-hidden="true">⌄</i>
      </button>
      {open && (
        <nav className="project-switcher-menu" id="project-switcher-menu" aria-label="作品切換" role="menu">
          <span className="project-switcher-item current" role="menuitem" aria-current="page">
            <span><strong>WePoints 積分</strong><small>目前作品</small></span><b aria-hidden="true">✓</b>
          </span>
          <a className="project-switcher-item" href="https://other.tangxinyi.fun/" role="menuitem">
            <span><strong>其他 Coding 內容</strong><small>蹲個後續</small></span><b aria-hidden="true">↗</b>
          </a>
        </nav>
      )}
    </aside>
  )
}

function App() {
  return (
    <>
      <ProjectSwitcher />
      <main className="phone">
        <div className="top-gradient"><StatusBar /><Header /><div className="content"><PointsHero /><CheckinCard /><SpendingCard /><div className="promo"><b>百佳門店增值滿HK$1,000</b><span>可得HK$5百佳優惠券1張</span><strong>HK$<em>5</em></strong></div></div></div>
        <Rewards />
      </main>
    </>
  )
}

createRoot(document.getElementById('root')).render(<App />)
