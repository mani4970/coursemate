import { useEffect, useState } from 'react'

function CourseMateLogo({ size = 32, white = false }) {
  const textColor = white ? 'white' : '#1a1a1a'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{
        width: size, height: size,
        background: 'linear-gradient(135deg, #f0f0f0, #FF9A6C)',
        borderRadius: size * 0.28,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(255,107,53,0.35)',
        flexShrink: 0,
      }}>
        <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24" fill="none">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="white"/>
          <circle cx="12" cy="9" r="2.5" fill="#f0f0f0"/>
        </svg>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '1px' }}>
        <span style={{
          fontFamily: "'Nunito', 'Noto Sans KR', sans-serif",
          fontWeight: '800', fontSize: size * 0.65,
          color: textColor, letterSpacing: '-0.5px',
        }}>Course</span>
        <span style={{
          fontFamily: "'Nunito', 'Noto Sans KR', sans-serif",
          fontWeight: '800', fontSize: size * 0.65,
          color: '#666', letterSpacing: '-0.5px',
        }}>Mate</span>
      </div>
    </div>
  )
}

export default function LandingPage({ onStartGuided, onStartDirect }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 80)
  }, [])

  const features = [
    { emoji: '📍', title: '25개 서울 핫스팟', desc: '강남, 홍대, 성수 등 핫플 완벽 커버' },
    { emoji: '⭐', title: '구글 평점 기반', desc: '실제 리뷰 수천 개 분석, 진짜 맛집만' },
    { emoji: '🗺️', title: '카카오맵 연동', desc: '동선을 카카오맵으로 바로 확인' },
    { emoji: '💬', title: '카카오톡 공유', desc: '완성된 코스를 친구에게 한 번에 공유' },
  ]

  const steps = [
    { emoji: '📍', label: '지역 선택', desc: '강남, 홍대, 성수 등' },
    { emoji: '👥', label: '모임 종류', desc: '데이트, 친구, 가족' },
    { emoji: '🍽️', label: '코스 & 예산', desc: '식사+카페, 예산 설정' },
    { emoji: '🎉', label: '코스 완성!', desc: '지도 + 길찾기 제공' },
  ]

  const fadeUp = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(20px)',
    transition: `all 0.7s ease ${delay}s`,
  })

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FFFAF7',
      fontFamily: "'Nunito', 'Noto Sans KR', sans-serif",
      overflowX: 'hidden',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Noto+Sans+KR:wght@400;700;900&display=swap" rel="stylesheet" />

      {/* 배경 도형들 */}
      <div style={{
        position: 'fixed', top: '-80px', right: '-80px',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'rgba(255,107,53,0.06)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', top: '200px', left: '-60px',
        width: '200px', height: '200px', borderRadius: '50%',
        background: 'rgba(255,154,108,0.08)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative' }}>
        {/* 헤더 */}
        <div style={{
          padding: '18px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(255,250,247,0.9)',
          backdropFilter: 'blur(10px)',
          position: 'sticky', top: 0, zIndex: 100,
          borderBottom: '1px solid rgba(255,107,53,0.08)',
        }}>
          <CourseMateLogo size={36} />
        </div>

        {/* 히어로 섹션 */}
        <div style={{
          padding: '52px 24px 40px',
          textAlign: 'center',
          ...fadeUp(0),
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: '#FFF0EA', border: '1px solid #FFD4C2',
            borderRadius: '20px', padding: '6px 14px',
            fontSize: '13px', color: '#666',
            fontWeight: '700', marginBottom: '20px',
          }}>
            <span>✨</span>
            <span>서울 데이트 코스 추천 앱</span>
          </div>

          <h1 style={{
            fontSize: '36px', fontWeight: '900',
            lineHeight: '1.25', marginBottom: '14px',
            color: '#1a1a1a', letterSpacing: '-0.5px',
          }}>
            오늘 어디 가지? 🤔<br />
            <span style={{ color: '#666' }}>CourseMate</span>한테<br />
            물어봐요!
          </h1>

          <p style={{
            color: '#888', fontSize: '15px',
            lineHeight: '1.8', marginBottom: '32px',
          }}>
            구글 평점 기반으로<br />
            딱 맞는 데이트 코스를 추천해드려요 🗺️
          </p>

          {/* 두 가지 시작 옵션 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '12px' }}>
            <button
              onClick={onStartGuided}
              style={{
                background: 'linear-gradient(135deg, #f0f0f0, #FF8C5A)',
                color: 'white', border: 'none',
                padding: '18px 24px', borderRadius: '18px',
                fontSize: '17px', fontWeight: '800',
                cursor: 'pointer', width: '100%',
                boxShadow: '0 8px 24px rgba(255,107,53,0.35)',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              <span>🔍</span>
              <span>추천받기 (지역부터 선택)</span>
            </button>

            <button
              onClick={onStartDirect}
              style={{
                background: 'white',
                color: '#666', border: '2px solid #f0f0f0',
                padding: '16px 24px', borderRadius: '18px',
                fontSize: '16px', fontWeight: '800',
                cursor: 'pointer', width: '100%',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              <span>📝</span>
              <span>직접 입력하기 (이미 정한 곳 있어요)</span>
            </button>
          </div>

          <p style={{ color: '#bbb', fontSize: '12px', marginTop: '10px' }}>
            회원가입 없이 바로 시작 • 완전 무료
          </p>
        </div>

        {/* 미리보기 카드 */}
        <div style={{ padding: '0 24px 48px', ...fadeUp(0.1) }}>
          <div style={{
            background: 'white',
            borderRadius: '24px', padding: '20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
            border: '1px solid rgba(255,107,53,0.08)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <p style={{ fontWeight: '800', fontSize: '14px', color: '#1a1a1a' }}>
                🎉 추천 코스 예시
              </p>
              <span style={{
                background: '#FFF0EA', color: '#666',
                borderRadius: '10px', padding: '3px 10px',
                fontSize: '11px', fontWeight: '700'
              }}>강남역 · 데이트</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                background: '#FFF8F5', borderRadius: '14px', padding: '12px'
              }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: '#f0f0f0', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px', flexShrink: 0,
                }}>🍽️</div>
                <div>
                  <p style={{ fontWeight: '800', fontSize: '14px', color: '#1a1a1a' }}>스시 오마카세</p>
                  <p style={{ color: '#666', fontSize: '12px', marginTop: '2px' }}>⭐ 4.8 · 🍣 일식 · 350m</p>
                </div>
              </div>
              <div style={{ textAlign: 'center', color: '#ccc', fontSize: '13px' }}>
                ↓ 🚶 도보 5분 (320m)
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                background: '#FFF8F5', borderRadius: '14px', padding: '12px'
              }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: '#f0f0f0', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px', flexShrink: 0,
                }}>☕</div>
                <div>
                  <p style={{ fontWeight: '800', fontSize: '14px', color: '#1a1a1a' }}>감성 루프탑 카페</p>
                  <p style={{ color: '#666', fontSize: '12px', marginTop: '2px' }}>⭐ 4.6 · ☕ 카페 · 670m</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 기능 소개 */}
        <div style={{ padding: '0 24px 48px', ...fadeUp(0.2) }}>
          <h2 style={{
            fontSize: '22px', fontWeight: '900',
            color: '#1a1a1a', marginBottom: '6px', textAlign: 'center'
          }}>
            왜 CourseMate인가요? 🤩
          </h2>
          <p style={{ color: '#aaa', fontSize: '13px', textAlign: 'center', marginBottom: '20px' }}>
            고민 없이 완벽한 코스를 만들어드려요
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {features.map((f, i) => (
              <div key={i} style={{
                background: 'white', borderRadius: '18px',
                padding: '18px 14px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                border: '1px solid rgba(255,107,53,0.06)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '30px', marginBottom: '8px' }}>{f.emoji}</div>
                <p style={{ fontWeight: '800', fontSize: '13px', color: '#1a1a1a', marginBottom: '4px' }}>{f.title}</p>
                <p style={{ color: '#aaa', fontSize: '11px', lineHeight: '1.5' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 사용 방법 */}
        <div style={{ padding: '0 24px 48px', ...fadeUp(0.3) }}>
          <h2 style={{
            fontSize: '22px', fontWeight: '900',
            color: '#1a1a1a', marginBottom: '6px', textAlign: 'center'
          }}>
            이렇게 쉬워요! 😊
          </h2>
          <p style={{ color: '#aaa', fontSize: '13px', textAlign: 'center', marginBottom: '20px' }}>
            딱 4단계면 완성
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {steps.map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                background: 'white', borderRadius: '16px', padding: '14px 16px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                border: '1px solid rgba(255,107,53,0.06)',
              }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '14px',
                  background: i === steps.length - 1
                    ? 'linear-gradient(135deg, #f0f0f0, #FF8C5A)'
                    : '#FFF0EA',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px', flexShrink: 0,
                }}>
                  {s.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: '800', fontSize: '15px', color: '#1a1a1a' }}>{s.label}</p>
                  <p style={{ color: '#aaa', fontSize: '13px' }}>{s.desc}</p>
                </div>
                <span style={{
                  background: '#FFF0EA', color: '#666',
                  borderRadius: '10px', padding: '3px 9px',
                  fontSize: '11px', fontWeight: '800',
                }}>
                  Step {i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 CTA */}
        <div style={{ padding: '0 24px 60px', ...fadeUp(0.4) }}>
          <div style={{
            background: 'linear-gradient(135deg, #f0f0f0, #FF8C5A)',
            borderRadius: '24px', padding: '32px 24px',
            textAlign: 'center',
            boxShadow: '0 12px 40px rgba(255,107,53,0.3)',
          }}>
            <div style={{ fontSize: '44px', marginBottom: '10px' }}>🎉</div>
            <h3 style={{
              fontSize: '22px', fontWeight: '900',
              color: 'white', marginBottom: '8px'
            }}>
              오늘 코스 고민 끝!
            </h3>
            <p style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '14px', marginBottom: '24px'
            }}>
              지금 바로 무료로 시작해보세요 😊
            </p>
            <button
              onClick={onStartGuided}
              style={{
                background: 'white',
                color: '#666', border: 'none',
                padding: '16px 40px', borderRadius: '14px',
                fontSize: '16px', fontWeight: '900',
                cursor: 'pointer', width: '100%',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              코스 만들러 가기 →
            </button>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginTop: '10px' }}>
              회원가입 없이 바로 시작
            </p>
          </div>
        </div>

        {/* 푸터 */}
        <div style={{
          padding: '20px 24px 40px',
          borderTop: '1px solid #f0f0f0',
          textAlign: 'center',
        }}>
          <CourseMateLogo size={28} />
          <p style={{ color: '#ccc', fontSize: '12px', marginTop: '12px' }}>
            © 2026 CourseMate · 서울 데이트 코스 추천
          </p>
        </div>
      </div>
    </div>
  )
}

export { CourseMateLogo }
