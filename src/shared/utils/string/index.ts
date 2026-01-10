/**
 * Capitalize first letter of a string
 * 
 * @param str - Input string
 * @returns String with first letter capitalized
 */
export function capitalize(str: string): string
{
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Base year for copyright
 */
const COPYRIGHT_START_YEAR = 2022

/**
 * Get copyright year string
 * 
 * Returns the year for copyright display:
 * - If current year equals start year: returns "2025"
 * - If current year is greater: returns "2025-{currentYear}"
 * 
 * @returns Formatted copyright year string
 * 
 * @example
 * // If current year is 2025
 * getCopyrightYear() // returns '2025'
 * 
 * // If current year is 2026
 * getCopyrightYear() // returns '2025-2026'
 */
export function getCopyrightYear(): string
{
    const currentYear = new Date().getFullYear()
    
    if (currentYear <= COPYRIGHT_START_YEAR) {
        return String(COPYRIGHT_START_YEAR)
    }
    
    return `${COPYRIGHT_START_YEAR}-${currentYear}`
}

/**
 * Format a date string to a localized, readable format
 * 
 * @param dateString - Date string in ISO format (e.g., "2025-12-09")
 * @param locale - Locale for formatting (default: 'en-US')
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string (e.g., "December 9, 2025")
 * 
 * @example
 * formatDateString('2025-12-09') // returns 'December 9, 2025'
 * formatDateString('2025-12-09', 'id-ID') // returns '9 Desember 2025'
 */
export function formatDateString(
    dateString: string,
    locale: string = 'en-US',
    options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
): string
{
    if (!dateString) return ''
    
    const date = new Date(dateString)
    
    // Check for invalid date
    if (isNaN(date.getTime())) return dateString
    
    return date.toLocaleDateString(locale, options)
}
