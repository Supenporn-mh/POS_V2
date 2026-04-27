import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx-js-style'

export const XLSX_ACCEPT = '.xlsx,.xls'

export function downloadAsXlsx(
    headers: string[],
    rows: (string | number | boolean | null | undefined)[][],
    filename: string
): void {
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

    const colWidths = headers.map((h, i) => {
        const maxLen = Math.max(h.length, ...rows.map((row) => String(row[i] ?? '').length))
        return { wch: Math.min(maxLen + 2, 50) }
    })
    ws['!cols'] = colWidths

    const xlsxBuffer = XLSX.write(wb, { type: 'array', bookType: 'xlsx' })
    const blob = new Blob([xlsxBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    const name = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`
    saveAs(blob, name)
}

export function downloadJsonAsXlsx(rows: Record<string, unknown>[], filename: string, sheetName = 'Sheet1'): void {
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, sheetName)
    const buffer = XLSX.write(wb, { type: 'array', bookType: 'xlsx' })
    const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    const name = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`
    saveAs(blob, name)
}

export function parseXlsxFile(file: File, sheetMatcher?: (name: string) => boolean): Promise<Record<string, string>[]> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const data = e.target?.result
                if (!data) {
                    reject(new Error('Failed to read file'))
                    return
                }
                const wb = XLSX.read(data, { type: 'array', cellDates: false })
                const sheetName =
                    (sheetMatcher && wb.SheetNames.find(sheetMatcher)) || wb.SheetNames[0]
                const sheet = wb.Sheets[sheetName]
                const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, {
                    raw: false,
                    defval: '',
                })
                resolve(rows)
            } catch (error) {
                reject(error)
            }
        }
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsArrayBuffer(file)
    })
}

// Excel serial date → JS Date, or pass-through string parser
export function parseExcelDate(value: unknown): Date {
    if (!value) return new Date()
    const num = Number(value)
    if (!isNaN(num) && num > 40000 && num < 100000) {
        return new Date((num - 25569) * 86400 * 1000)
    }
    const str = String(value).trim()
    if (!str) return new Date()
    const parts = str.split('/')
    if (parts.length === 3) {
        let [a, b, c] = parts.map(Number)
        if (c < 100) c = c + 2000
        if (a > 12) return new Date(c, b - 1, a)
        return new Date(c, a - 1, b)
    }
    return new Date(str)
}
