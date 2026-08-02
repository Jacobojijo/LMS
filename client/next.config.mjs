import withFlowbiteReact from "flowbite-react/plugin/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Redirect Vercel subdomain to main domain
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "lms-eta-one-30.vercel.app",
          },
        ],
        destination: "https://www.heritage-languageschool.com/:path*",
        permanent: true,
      },
      // Redirect non-www to www
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "heritage-languageschool.com",
          },
        ],
        destination: "https://www.heritage-languageschool.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "index, follow",
          },
        ],
      },
    ];
  },
};

export default withFlowbiteReact(nextConfig);
