type PageElement = number | "..."

export const getPaginationRange = (current: number, total: number, siblingCount = 1): PageElement[] => {
    const curr = Math.max(1, Math.min(current, total))

    const totalNumbers = siblingCount * 2 + 5
    if (total <= totalNumbers) {
        return Array.from({ length: total }, (_, i) => i + 1)
    }

    const leftSibling = Math.max(curr - siblingCount, 2)
    const rightSibling = Math.min(curr + siblingCount, total - 1)

    const showLeftEllipsis = leftSibling > 2
    const showRightEllipsis = rightSibling < total - 1

    const range: PageElement[] = [1]
    if (showLeftEllipsis) range.push("...")

    for (let i = leftSibling; i <= rightSibling; i++) {
        range.push(i)
    }

    if (showRightEllipsis) range.push("...")
    range.push(total)

    return range
}