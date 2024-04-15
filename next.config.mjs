/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "utfs.io"
        ]
    },
    // Добавление опции transpilePackages для транспиляции пакета next-auth
    transpilePackages: ['next-auth'],
};

export default nextConfig;
