// 保費試算用的純函式，跟 src/utils/format.js 一樣不掛在元件上，
// 純粹接資料算結果，方便 store 的 getter 跟未來要加測試時直接呼叫。

export function calcAge(birthday) {
  if (!birthday) return null
  const birth = new Date(birthday)
  if (Number.isNaN(birth.getTime())) return null

  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

const GENDER_FACTOR = { male: 1.05, female: 1, other: 1 }

export function calculateEstimate(plan, basicInfo) {
  const age = calcAge(basicInfo.birthday)
  if (!plan || age === null) return null

  const ageFactor = age < 30 ? 0.9 : age <= 50 ? 1 : 1.2
  const genderFactor = GENDER_FACTOR[basicInfo.gender] ?? 1
  const monthly = Math.round(plan.monthlyRate * ageFactor * genderFactor)

  return { age, monthly, yearly: monthly * 12 }
}
