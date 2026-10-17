import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const PrototypeExperienceContext = createContext(null)

const steps = [
  {
    step: 1,
    title: '完成每日签到',
    description: '在页面上方找到签到区域，点击「立刻签到」。签到成功后，今日奖励将变为已领取状态，并短暂显示「签到成功」提示。',
  },
  {
    step: 2,
    title: '滑动浏览奖励',
    description: '上下滑动页面，浏览不同积分内容。在电子现金券区域左右滑动卡片，查看更多面额与兑换积分。',
  },
  {
    step: 3,
    title: '查看优惠券详情',
    description: '在「兑换奖励」区域找到屈臣氏优惠券，点击卡片进入「优惠券详情」。查看完成后，点击左上角的「×」关闭详情。',
  },
  {
    step: 4,
    title: '体验内地优惠',
    description: '点击分类栏中的「内地优惠」。左右滑动抖音及京东礼券，并向下浏览内地优惠商品。',
  },
  {
    step: 5,
    title: '查看赚积分任务',
    description: '点击顶部页签「赚积分当钱花」。查看任务进度、可获得的积分及不同类型的赚积分任务。',
  },
  {
    step: 6,
    title: '查看其他原型',
    description: '点击右上角的「切换作品」，选择「其他 Coding 内容」，前往体验其他产品原型。',
  },
]

export function PrototypeExperienceProvider({ children }) {
  const [completedSteps, setCompletedSteps] = useState(() => new Set())

  const completeStep = useCallback((step) => {
    setCompletedSteps((current) => {
      if (current.has(step)) return current
      const next = new Set(current)
      next.add(step)
      return next
    })
  }, [])

  useEffect(() => {
    let origin = window.scrollY
    let userIntendsToScroll = false
    const markScrollIntent = () => {
      userIntendsToScroll = true
      origin = window.scrollY
    }
    const markKeyboardScrollIntent = (event) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) markScrollIntent()
    }
    const handleScroll = (event) => {
      if (!event.isTrusted || !userIntendsToScroll) return
      if (Math.abs(window.scrollY - origin) < 24) return
      completeStep(2)
      userIntendsToScroll = false
      origin = window.scrollY
    }

    window.addEventListener('wheel', markScrollIntent, { passive: true })
    window.addEventListener('touchmove', markScrollIntent, { passive: true })
    window.addEventListener('keydown', markKeyboardScrollIntent)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('wheel', markScrollIntent)
      window.removeEventListener('touchmove', markScrollIntent)
      window.removeEventListener('keydown', markKeyboardScrollIntent)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [completeStep])

  const value = useMemo(() => ({ completedSteps, completeStep }), [completedSteps, completeStep])
  return <PrototypeExperienceContext.Provider value={value}>{children}</PrototypeExperienceContext.Provider>
}

export function usePrototypeExperience() {
  const value = useContext(PrototypeExperienceContext)
  if (!value) throw new Error('usePrototypeExperience must be used inside PrototypeExperienceProvider')
  return value
}

export function PrototypeGuide() {
  const { completedSteps } = usePrototypeExperience()
  const activeStep = steps.find(({ step }) => !completedSteps.has(step))?.step

  return (
    <aside className="prototype-guide" aria-label="TRY THE PROTOTYPE 体验指引">
      <p className="prototype-eyebrow">TRY THE PROTOTYPE</p>
      <h2>跟随下面步骤体验「WePoints 积分」</h2>
      <ol className="prototype-steps">
        {steps.map(({ step, title, description }) => {
          const completed = completedSteps.has(step)
          const active = activeStep === step
          return (
            <li
              className={`prototype-step ${completed ? 'completed' : ''} ${active ? 'active' : ''} ${step === 6 ? 'compact' : ''}`}
              key={step}
              aria-current={active ? 'step' : undefined}
            >
              <span className="prototype-step-marker" aria-label={completed ? `步骤 ${step} 已完成` : `步骤 ${step}`}>
                {completed ? '✓' : step}
              </span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </aside>
  )
}
