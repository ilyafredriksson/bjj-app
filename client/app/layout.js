import './globals.css'

export const metadata = {
  title: 'BJJ Träningsapp',
  description: 'Din kompletta app för Brazilian Jiu-Jitsu träning',
}

export default function RootLayout({ children }) {
  return (
    <html lang="sv">
      <body className="bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  )
}
