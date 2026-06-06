import React from "react";
import { Helmet } from "react-helmet";

const SEO = ({
  title,
  description,
  path = "",
  ogImageName = "logo.png",
  schema = null,
}) => {
  const baseUrl = "https://yankit.com.au";
  const canonicalUrl = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const finalCanonical =
    canonicalUrl.endsWith("/") && canonicalUrl !== `${baseUrl}/`
      ? canonicalUrl.slice(0, -1)
      : canonicalUrl;

  const fullImageUrl = `${baseUrl}/${ogImageName}`;

  const schemasArray = schema
    ? Array.isArray(schema)
      ? schema
      : [schema]
    : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={finalCanonical} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Foxnet" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      {/* {schemasArray.map((schemaObj, index) => (
        <script key={`schema-${index}`} type="application/ld+json">
          {JSON.stringify(schemaObj)}
        </script>
      ))} */}
    </Helmet>
  );
};

export default SEO;
