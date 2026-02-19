<<<<<<< HEAD
const typeMap = {
  // 한식
  korean_restaurant: '🍚 한식',
  // 일식
  japanese_restaurant: '🍱 일식',
  sushi_restaurant: '🍣 스시',
  ramen_restaurant: '🍜 라멘',
  // 중식
  chinese_restaurant: '🥢 중식',
  // 양식
  american_restaurant: '🍔 양식',
  italian_restaurant: '🍝 이탈리안',
  french_restaurant: '🥐 프렌치',
  // 기타
  seafood_restaurant: '🦞 해산물',
  steak_house: '🥩 스테이크',
  barbecue_restaurant: '🔥 바베큐',
  chicken_restaurant: '🍗 치킨',
  pizza_restaurant: '🍕 피자',
  hamburger_restaurant: '🍔 버거',
  sandwich_shop: '🥪 샌드위치',
  cafe: '☕ 카페',
  coffee_shop: '☕ 커피',
  dessert_shop: '🍰 디저트',
  dessert_restaurant: '🍰 디저트',
  bakery: '🥐 베이커리',
  bar: '🍺 바',
  pub: '🍻 펍',
  wine_bar: '🍷 와인바',
  cocktail_bar: '🍸 칵테일바',
  restaurant: '🍽️ 레스토랑',
  food: '🍽️ 음식점',
}

export function getTypeLabel(primaryType) {
  if (!primaryType) return null
  return typeMap[primaryType] || null
=======
const typeMap = {
  // 한식
  korean_restaurant: '🍚 한식',
  // 일식
  japanese_restaurant: '🍱 일식',
  sushi_restaurant: '🍣 스시',
  ramen_restaurant: '🍜 라멘',
  // 중식
  chinese_restaurant: '🥢 중식',
  // 양식
  american_restaurant: '🍔 양식',
  italian_restaurant: '🍝 이탈리안',
  french_restaurant: '🥐 프렌치',
  // 기타
  seafood_restaurant: '🦞 해산물',
  steak_house: '🥩 스테이크',
  barbecue_restaurant: '🔥 바베큐',
  chicken_restaurant: '🍗 치킨',
  pizza_restaurant: '🍕 피자',
  hamburger_restaurant: '🍔 버거',
  sandwich_shop: '🥪 샌드위치',
  cafe: '☕ 카페',
  coffee_shop: '☕ 커피',
  dessert_shop: '🍰 디저트',
  dessert_restaurant: '🍰 디저트',
  bakery: '🥐 베이커리',
  bar: '🍺 바',
  pub: '🍻 펍',
  wine_bar: '🍷 와인바',
  cocktail_bar: '🍸 칵테일바',
  restaurant: '🍽️ 레스토랑',
  food: '🍽️ 음식점',
}

export function getTypeLabel(primaryType) {
  if (!primaryType) return null
  return typeMap[primaryType] || null
>>>>>>> 9f79ebef36aac49ae5ad3274984f10861738d2da
}