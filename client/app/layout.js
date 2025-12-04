import './globals.css'
import ToastProvider from '@/components/ToastProvider'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata = {
  title: 'BJJ Träningsapp',
  description: 'Din kompletta app för Brazilian Jiu-Jitsu träning',
}

export default function RootLayout({ children }) {
  return (
    <html lang="sv" suppressHydrationWarning>
      <body className="bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <ThemeProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
