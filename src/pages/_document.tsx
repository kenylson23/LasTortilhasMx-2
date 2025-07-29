import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="pt">
      <Head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Theme color */}
        <meta name="theme-color" content="#006847" />
        
        {/* OpenGraph default meta tags */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Las Tortillas Mexican Grill" />
        <meta property="og:locale" content="pt_AO" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@lastortillas" />
        
        {/* Additional meta tags */}
        <meta name="author" content="Las Tortillas Mexican Grill" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        
        {/* Structured data for local business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Restaurant',
              'name': 'Las Tortillas Mexican Grill',
              'description': 'O único restaurante mexicano com ambiente 100% familiar em Luanda',
              'url': 'https://lastortillas.com',
              'telephone': '+244949639932',
              'address': {
                '@type': 'PostalAddress',
                'streetAddress': 'Ilha de Luanda',
                'addressLocality': 'Luanda',
                'addressCountry': 'Angola'
              },
              'openingHours': [
                'Mo-Th 11:00-23:00',
                'Fr-Su 11:00-01:00'
              ],
              'servesCuisine': 'Mexican',
              'priceRange': '$$',
              'foundingDate': '2018-02-14',
              'image': 'https://lastortillas.com/images/restaurant-logo.png',
              'sameAs': [
                'https://www.facebook.com/lastortillas',
                'https://www.instagram.com/lastortillas',
              ]
            })
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}