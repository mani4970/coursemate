import { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import DirectInput from './pages/DirectInput'
import LocationSelect from './pages/LocationSelect'
import OccasionSelect from './pages/OccasionSelect'
import CourseSelect from './pages/CourseSelect'
import BudgetSelect from './pages/BudgetSelect'
import CuisineSelect from './pages/CuisineSelect'
import RestaurantList from './pages/RestaurantList'
import CafeList from './pages/CafeList'
import FinalCourse from './pages/FinalCourse'
import './App.css'

const HOTSPOTS = [
  { id: 'gangnam_station', name: '강남역', emoji: '🏙️', lat: 37.4979, lng: 127.0276 },
  { id: 'sinnonhyeon', name: '신논현/논현', emoji: '🍽️', lat: 37.5045, lng: 127.0249 },
  { id: 'apgujeong_rodeo', name: '압구정로데오', emoji: '✨', lat: 37.527, lng: 127.0403 },
  { id: 'cheongdam', name: '청담', emoji: '🥂', lat: 37.5248, lng: 127.0493 },
  { id: 'garosugil', name: '신사 가로수길', emoji: '🛍️', lat: 37.5209, lng: 127.0227 },
  { id: 'banpo', name: '반포/서래마을', emoji: '🥐', lat: 37.504, lng: 126.9944 },
  { id: 'jamsil_tower', name: '잠실(롯데타워)', emoji: '🎡', lat: 37.5131, lng: 127.1025 },
  { id: 'songridan', name: '송리단길', emoji: '☕', lat: 37.5055, lng: 127.104 },
  { id: 'konkuk', name: '건대입구', emoji: '🎯', lat: 37.5404, lng: 127.0693 },
  { id: 'seongsu', name: '성수', emoji: '🧁', lat: 37.5446, lng: 127.0567 },
  { id: 'hongdae', name: '홍대입구', emoji: '🎶', lat: 37.5572, lng: 126.9245 },
  { id: 'yeonnam', name: '연남동', emoji: '🌿', lat: 37.5637, lng: 126.9268 },
  { id: 'hapjeong_sangsu', name: '합정/상수', emoji: '🍻', lat: 37.5496, lng: 126.9139 },
  { id: 'mangwon', name: '망원동', emoji: '🎨', lat: 37.5556, lng: 126.9026 },
  { id: 'itaewon', name: '이태원', emoji: '🌎', lat: 37.5345, lng: 126.9946 },
  { id: 'hannam', name: '한남동', emoji: '🪄', lat: 37.5349, lng: 127.0001 },
  { id: 'yongsan_station', name: '용산', emoji: '🧭', lat: 37.5299, lng: 126.9647 },
  { id: 'jongno_ikseon', name: '종로/익선동', emoji: '🏮', lat: 37.5724, lng: 126.9904 },
  { id: 'gwanghwamun', name: '광화문', emoji: '🏛️', lat: 37.5759, lng: 126.9769 },
  { id: 'yeouido', name: '여의도', emoji: '🌆', lat: 37.5219, lng: 126.9246 },
  { id: 'wangsimni', name: '왕십리', emoji: '🚇', lat: 37.5615, lng: 127.0371 },
  { id: 'seoul_forest', name: '서울숲', emoji: '🌳', lat: 37.5442, lng: 127.0377 },
  { id: 'oksu', name: '옥수/금호', emoji: '🌉', lat: 37.5397, lng: 127.0186 },
  { id: 'mullae', name: '문래동', emoji: '🏭', lat: 37.5176, lng: 126.8952 },
  { id: 'ttukseom', name: '뚝섬/자양', emoji: '🎪', lat: 37.5479, lng: 127.0676 },
]

function App() {
  const [flowType, setFlowType] = useState(null)
  const [step, setStep] = useState(0)
  const [isSharedCourse, setIsSharedCourse] = useState(false)
  const [directInputNextType, setDirectInputNextType] = useState(null)
  const [courseOrder, setCourseOrder] = useState([])
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0)
  const [selectedPlaces, setSelectedPlaces] = useState([])

  const [selections, setSelections] = useState({
    hotspot: null,
    occasion: null,
    courseOrder: [],
    budget: null,
    restaurantCuisine: 'all',
    cafeCuisine: 'all',
    barCuisine: 'all',
    restaurant: null,
    cafe: null,
    cafe2: null,
  })

  // --- share link handling ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const shareParam = params.get('s') || params.get('share')

    const b64DecodeUnicode = (str) => {
      try {
        // Works for most unicode payloads
        return decodeURIComponent(escape(atob(str)))
      } catch {
        try {
          return atob(str)
        } catch {
          return null
        }
      }
    }

    if (shareParam) {
      try {
        const raw = b64DecodeUnicode(shareParam)
        if (!raw) return
        const decoded = JSON.parse(raw)

        setSelections({
          hotspot: { name: decoded.h || '서울' },
          occasion: '',
          courseOrder: [],
          budget: null,
          restaurantCuisine: 'all',
          cafeCuisine: 'all',
          barCuisine: 'all',
          restaurant: decoded.r
            ? {
                name: decoded.r.n,
                lat: decoded.r.x,
                lng: decoded.r.y,
                kakaoMapUrl:
                  'https://map.kakao.com/link/search/' + encodeURIComponent(decoded.r.n),
              }
            : null,
          cafe: decoded.c
            ? {
                name: decoded.c.n,
                lat: decoded.c.x,
                lng: decoded.c.y,
                kakaoMapUrl:
                  'https://map.kakao.com/link/search/' + encodeURIComponent(decoded.c.n),
              }
            : null,
          cafe2: decoded.b
            ? {
                name: decoded.b.n,
                lat: decoded.b.x,
                lng: decoded.b.y,
                kakaoMapUrl:
                  'https://map.kakao.com/link/search/' + encodeURIComponent(decoded.b.n),
              }
            : null,
        })

        setIsSharedCourse(true)
        setFlowType('guided')
        setStep(100)
        window.history.replaceState({}, '', window.location.pathname)
      } catch (e) {
        console.error('Invalid share link', e)
      }
    }
  }, [])

  const update = (key, value) => setSelections((prev) => ({ ...prev, [key]: value }))
  const next = () => setStep((prev) => prev + 1)
  const back = () => setStep((prev) => prev - 1)

  const restart = () => {
    setStep(0)
    setFlowType(null)
    setIsSharedCourse(false)
    setDirectInputNextType(null)
    setCourseOrder([])
    setCurrentOrderIndex(0)
    setSelectedPlaces([])
    setSelections({
      hotspot: null,
      occasion: null,
      courseOrder: [],
      budget: null,
      restaurantCuisine: 'all',
      cafeCuisine: 'all',
      barCuisine: 'all',
      restaurant: null,
      cafe: null,
      cafe2: null,
    })
  }

  // keep preferences but clear any previously selected places (useful when switching flows)
  const resetPlacesOnly = () => {
    setIsSharedCourse(false)
    setDirectInputNextType(null)
    setCourseOrder([])
    setCurrentOrderIndex(0)
    setSelectedPlaces([])
    setSelections((prev) => ({
      ...prev,
      courseOrder: [],
      restaurant: null,
      cafe: null,
      cafe2: null,
    }))
  }

  function handleDirectInputSelect(data) {
    setDirectInputNextType(data.nextType)

    if (data.restaurant) {
      setSelections((prev) => ({
        ...prev,
        restaurant: data.restaurant,
        hotspot: data.restaurant.hotspot || prev.hotspot || { name: '서울' },
        courseOrder:
          data.nextType === 'both'
            ? ['restaurant', 'cafe', 'bar']
            : data.nextType === 'cafe'
              ? ['restaurant', 'cafe']
              : data.nextType === 'bar'
                ? ['restaurant', 'bar']
                : data.nextType === 'restaurant'
                  ? ['restaurant', 'restaurant']
                  : [],
      }))

      if (data.nextType === 'cafe') setStep(200)
      else if (data.nextType === 'bar') setStep(202)
      else if (data.nextType === 'both') setStep(200)
      else if (data.nextType === 'restaurant') setStep(201)
    } else if (data.cafe) {
      // direct flow can start with cafe (cafe -> restaurant)
      setSelections((prev) => ({
        ...prev,
        cafe: data.cafe,
        hotspot: data.cafe.hotspot || prev.hotspot || { name: '서울' },
        courseOrder: ['cafe', 'restaurant'],
      }))
      setStep(201)
    }
  }

  function handleCourseOrderSelect(data) {
    setCourseOrder(data.courseOrder)
    setSelections((prev) => ({ ...prev, courseOrder: data.courseOrder }))
    setCurrentOrderIndex(0)
    setSelectedPlaces([])
    next()
  }

  function handlePlaceSelect(place) {
    const newSelectedPlaces = [...selectedPlaces, place]
    setSelectedPlaces(newSelectedPlaces)

    const placeType = courseOrder[currentOrderIndex]

    if (placeType === 'restaurant') {
      update('restaurant', place)
    } else if (placeType === 'cafe') {
      if (!selections.cafe) update('cafe', place)
      else update('cafe2', place)
    } else if (placeType === 'bar') {
      // store bar into cafe2 (or cafe if cafe is empty)
      if (!selections.cafe) update('cafe', place)
      else update('cafe2', place)
    }

    if (currentOrderIndex < courseOrder.length - 1) {
      setCurrentOrderIndex((prev) => prev + 1)
      next()
    } else {
      setStep(100)
    }
  }

  function getReferencePoint() {
    if (currentOrderIndex === 0) return selections.hotspot
    return selectedPlaces[currentOrderIndex - 1]
  }

  // back should also remove the last picked place (so it doesn't "stick")
  function handleBack() {
    if (currentOrderIndex === 0) {
      back()
      return
    }

    const lastIndex = currentOrderIndex - 1
    const lastPlaceType = courseOrder[lastIndex]

    // clear the corresponding selection slot
    if (lastPlaceType === 'restaurant') {
      update('restaurant', null)
    } else if (lastPlaceType === 'cafe' || lastPlaceType === 'bar') {
      if (selections.cafe2) update('cafe2', null)
      else update('cafe', null)
    }

    setCurrentOrderIndex((prev) => prev - 1)
    setSelectedPlaces((prev) => prev.slice(0, -1))
    back()
  }

  // shared course view
  if (isSharedCourse && step === 100) {
    return (
      <div className="app">
        <FinalCourse selections={selections} onRestart={restart} onBack={null} />
      </div>
    )
  }

  const showSummary = step !== 0 && step !== 100 && flowType

  return (
    <div className="app">
      {/* Step summary (neutral colors: no orange) */}
      {showSummary && (
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 20,
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(8px)',
            borderBottom: '1px solid #f0f0f0',
            padding: '10px 16px',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {selections.hotspot?.name && (
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#444',
                  background: '#f5f5f5',
                  borderRadius: '999px',
                  padding: '4px 10px',
                }}
              >
                📍 {selections.hotspot.name}
              </span>
            )}
            {selections.occasion && (
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#444',
                  background: '#f5f5f5',
                  borderRadius: '999px',
                  padding: '4px 10px',
                }}
              >
                👥 {selections.occasion}
              </span>
            )}
            {Array.isArray(selections.courseOrder) && selections.courseOrder.length > 0 && (
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#444',
                  background: '#f5f5f5',
                  borderRadius: '999px',
                  padding: '4px 10px',
                }}
              >
                {selections.courseOrder
                  .map((t) => (t === 'restaurant' ? '🍽️' : t === 'cafe' ? '☕' : '🍺'))
                  .join(' → ')}
              </span>
            )}
            {selections.budget && (
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#444',
                  background: '#f5f5f5',
                  borderRadius: '999px',
                  padding: '4px 10px',
                }}
              >
                💰 {selections.budget}
              </span>
            )}

            {selections.restaurant?.name && (
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#444',
                  background: '#f5f5f5',
                  borderRadius: '999px',
                  padding: '4px 10px',
                }}
              >
                🍽️ {selections.restaurant.name}
              </span>
            )}
            {selections.cafe?.name && (
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#444',
                  background: '#f5f5f5',
                  borderRadius: '999px',
                  padding: '4px 10px',
                }}
              >
                ☕ {selections.cafe.name}
              </span>
            )}
            {selections.cafe2?.name && (
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#444',
                  background: '#f5f5f5',
                  borderRadius: '999px',
                  padding: '4px 10px',
                }}
              >
                🍺 {selections.cafe2.name}
              </span>
            )}
          </div>
        </div>
      )}

      {step === 0 && !flowType && (
        <LandingPage
          onStartGuided={() => {
            resetPlacesOnly()
            setFlowType('guided')
            setStep(1)
          }}
          onStartDirect={() => {
            resetPlacesOnly()
            setFlowType('direct')
            setStep(50)
          }}
        />
      )}

      {/* Direct flow */}
      {flowType === 'direct' && step === 50 && (
        <DirectInput onNext={handleDirectInputSelect} onBack={restart} />
      )}
      {flowType === 'direct' && step === 200 && (
        <CafeList
          selections={selections}
          type="cafe"
          referencePoint={selections.restaurant}
          onNext={(value) => {
            update('cafe', value)
            if (directInputNextType === 'both') setStep(202)
            else setStep(100)
          }}
          onBack={() => setStep(50)}
        />
      )}
      {flowType === 'direct' && step === 201 && (
        <RestaurantList
          selections={selections}
          referencePoint={selections.restaurant || selections.cafe}
          onNext={(value) => {
            if (directInputNextType === 'restaurant') {
              // NOTE: second restaurant stored in cafe slot (legacy). We'll fix properly with restaurant2 later.
              update('cafe', value)
            } else {
              update('restaurant', value)
            }
            setStep(100)
          }}
          onBack={() => setStep(50)}
        />
      )}
      {flowType === 'direct' && step === 202 && (
        <CafeList
          selections={selections}
          type="bar"
          referencePoint={selections.cafe}
          onNext={(value) => {
            setSelections((prev) => ({ ...prev, cafe2: value }))
            setStep(100)
          }}
          onBack={() => (directInputNextType === 'both' ? setStep(200) : setStep(50))}
        />
      )}

      {/* Guided flow */}
      {flowType === 'guided' && step === 1 && (
        <LocationSelect
          hotspots={HOTSPOTS}
          onNext={(value) => {
            update('hotspot', value)
            next()
          }}
          onBack={() => {
            setStep(0)
            setFlowType(null)
          }}
        />
      )}
      {flowType === 'guided' && step === 2 && (
        <OccasionSelect
          location={selections.hotspot?.name}
          onNext={(value) => {
            update('occasion', value)
            next()
          }}
          onBack={back}
        />
      )}
      {flowType === 'guided' && step === 3 && (
        <CourseSelect selections={selections} onNext={handleCourseOrderSelect} onBack={back} onHome={restart} />
      )}
      {flowType === 'guided' && step === 4 && (
        <BudgetSelect
          selections={selections}
          onNext={(value) => {
            update('budget', value)
            next()
          }}
          onBack={back}
          onHome={restart}
        />
      )}
      {flowType === 'guided' && step === 5 && (
        <CuisineSelect
          selections={selections}
          onNext={(value) => {
            setSelections(value)
            next()
          }}
          onBack={back}
          onHome={restart}
        />
      )}
      {flowType === 'guided' && step >= 6 && step < 100 && (
        <>
          {courseOrder[currentOrderIndex] === 'restaurant' && (
            <RestaurantList
              selections={selections}
              referencePoint={getReferencePoint()}
              onNext={handlePlaceSelect}
              onBack={handleBack}
            />
          )}
          {(courseOrder[currentOrderIndex] === 'cafe' || courseOrder[currentOrderIndex] === 'bar') && (
            <CafeList
              selections={selections}
              type={courseOrder[currentOrderIndex]}
              referencePoint={getReferencePoint()}
              onNext={handlePlaceSelect}
              onBack={handleBack}
            />
          )}
        </>
      )}

      {/* Final */}
      {((flowType === 'guided' && step === 100) || (flowType === 'direct' && step === 100)) && (
        <FinalCourse
          selections={selections}
          onRestart={restart}
          onBack={() => {
            if (flowType === 'direct') {
              if (directInputNextType === 'both') setStep(202)
              else if (directInputNextType === 'cafe') setStep(200)
              else if (directInputNextType === 'bar') setStep(202)
              else if (directInputNextType === 'restaurant') setStep(201)
            } else {
              setCurrentOrderIndex(courseOrder.length - 1)
              setSelectedPlaces((prev) => prev.slice(0, -1))
              setStep(5 + courseOrder.length)
            }
          }}
        />
      )}
    </div>
  )
}

export default App
