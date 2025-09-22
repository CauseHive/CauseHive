import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO Component for managing page metadata and structured data
 * Provides comprehensive meta tags, Open Graph, Twitter Cards, and JSON-LD schema
 */
const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author,
  publishedDate,
  modifiedDate,
  cause,
  donation,
  canonicalUrl,
  noIndex = false,
  structuredData
}) => {
  // Generate structured data for causes and donations
  const generateStructuredData = () => {
    if (structuredData) {
      return structuredData;
    }

    if (cause) {
      return {
        "@context": "https://schema.org",
        "@type": "Fundraising",
        name: cause.title,
        description: cause.description,
        url: url || window.location.href,
        image: cause.image,
        targetAmount: {
          "@type": "MonetaryAmount",
          currency: "USD",
          value: cause.target_amount
        },
        amountRaised: {
          "@type": "MonetaryAmount",
          currency: "USD",
          value: cause.current_amount
        },
        startDate: cause.created_at,
        endDate: cause.end_date,
        beneficiary: {
          "@type": "Organization",
          name: cause.beneficiary?.name || "CauseHive Community"
        },
        organizer: {
          "@type": "Person",
          name: cause.creator?.name
        }
      };
    }

    if (donation) {
      return {
        "@context": "https://schema.org",
        "@type": "DonateAction",
        agent: {
          "@type": "Person",
          name: donation.donor_name
        },
        recipient: {
          "@type": "Organization",
          name: "CauseHive"
        },
        object: {
          "@type": "MonetaryAmount",
          currency: "USD",
          value: donation.amount
        },
        purpose: donation.cause?.title
      };
    }

    // Default website schema
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "CauseHive",
      description: "Empowering communities through transparent crowdfunding and social impact initiatives",
      url: "https://causehive.com",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://causehive.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    };
  };

  const fullTitle = title ? `${title} | CauseHive` : 'CauseHive - Empowering Communities Through Crowdfunding';
  const metaDescription = description || 'Join CauseHive to support meaningful causes, create fundraising campaigns, and make a positive impact in your community. Transparent, secure, and community-driven crowdfunding platform.';
  const metaKeywords = keywords || 'crowdfunding, fundraising, charity, donations, causes, community, social impact, nonprofit';
  const metaImage = image || '/images/causehive-og-image.jpg';
  const metaUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      {author && <meta name="author" content={author} />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:image:alt" content={`${title || 'CauseHive'} - Supporting communities through crowdfunding`} />
      <meta property="og:site_name" content="CauseHive" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      <meta name="twitter:image:alt" content={`${title || 'CauseHive'} - Supporting communities through crowdfunding`} />
      <meta name="twitter:site" content="@causehive" />
      <meta name="twitter:creator" content="@causehive" />

      {/* Additional Meta Tags */}
      {publishedDate && <meta property="article:published_time" content={publishedDate} />}
      {modifiedDate && <meta property="article:modified_time" content={modifiedDate} />}
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(generateStructuredData())}
      </script>

      {/* Preconnect for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Favicon and App Icons */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/png" href="/favicon.png" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />
      
      {/* Theme Color */}
      <meta name="theme-color" content="#2563eb" />
      <meta name="msapplication-TileColor" content="#2563eb" />
    </Helmet>
  );
};

export default SEO;