// 검색결과 정렬: 구글시트 순서(order 오름차순) + 이름에 "(옵션)" 붙은 항목은 맨 뒤로.
// "(옵션)" 표기는 한국어 base name(name)에만 있으므로 base name으로 판정(다국어 사이트 공통).
export const isOptionItem = (name?: string | null) => (name ?? "").includes("(옵션)")

export const byOrderOptionsLast = (
  a: { name?: string | null; order?: number | null },
  b: { name?: string | null; order?: number | null },
) => {
  const aOpt = isOptionItem(a.name) ? 1 : 0
  const bOpt = isOptionItem(b.name) ? 1 : 0
  if (aOpt !== bOpt) return aOpt - bOpt
  return (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER)
}
