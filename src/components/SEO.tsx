import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  image = 'https://bantu-realty.com/og-image.jpg',
  url = 'https://bantu-realty.com'
}) => {
  return (
    <Helmet>
      {/* Basic */}
      <title>{title} | Bantu Realty</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional */}
      <meta name="application-name" content="Bantu Realty" />
      <meta name="apple-mobile-web-app-title" content="Bantu Realty" />
      <meta name="theme-color" content="#2563eb" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          "name": "Bantu Realty",
          "description": "Find your perfect property in Rwanda",
          "url": "https://bantu-realty.com",
          "logo": "https://bantu-realty.com/logo.png",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "RW",
            "addressLocality": "Kigali"
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEO;