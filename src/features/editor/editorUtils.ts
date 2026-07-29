export const moveEntry = <T,>(items: T[], index: number, direction: -1 | 1): void => {
  const target = index + direction
  if (target < 0 || target >= items.length) return
  const [item] = items.splice(index, 1)
  if (item !== undefined) items.splice(target, 0, item)
}
