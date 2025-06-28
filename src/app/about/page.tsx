import BackgroundGradient from "@/components/ui/BackgroundGradient";
import Image from "next/image";

export default function AboutPage() {
    const features = [
        {
            title: "Real-time Collaboration",
            description: "Edit and share notes in real-time with WebSocket integration",
            icon: "/globe.svg",
        },
        {
            title: "Rich Text Editor",
            description: "Powerful TipTap-based editor with formatting options",
            icon: "/file.svg",
        },
        {
            title: "Auto-saving",
            description: "Never lose your work with automatic saving functionality",
            icon: "/window.svg",
        },
    ];

    const technologies = [
        "Next.js 14",
        "TypeScript",
        "Node.js",
        "MongoDB",
        "WebSocket",
        "TipTap Editor",
        "Tailwind CSS",
    ];

    return (
        <main className="min-h-screen w-full py-20 px-4 sm:px-6 lg:px-8">
            <BackgroundGradient />

            {/* Hero Section */}
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    About Notes App
                </h1>
                <p className="mt-6 text-lg text-gray-300">
                    A modern note-taking application designed for seamless collaboration and productivity
                </p>
            </div>

            {/* Features Section */}
            <div className="mt-20 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-center text-white mb-12">
                    Key Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="p-6 rounded-lg bg-[#1a1a1a] border border-gray-800 hover:border-gray-700 transition-all"
                        >
                            <div className="h-12 w-12 mb-4">
                                <Image
                                    src={feature.icon}
                                    alt={feature.title}
                                    width={48}
                                    height={48}
                                    className="opacity-80"
                                />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-400">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Technologies Section */}
            <div className="mt-20 max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-center text-white mb-12">
                    Built With Modern Technologies
                </h2>
                <div className="flex flex-wrap justify-center gap-4">
                    {technologies.map((tech, index) => (
                        <span
                            key={index}
                            className="px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 text-orange-400"
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            </div>

            {/* Contact Section */}
            <div className="mt-20 max-w-2xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-white mb-6">
                    Get Started Today
                </h2>
                <p className="text-gray-400 mb-8">
                    Experience the future of note-taking with our modern, collaborative platform.
                </p>
                <a
                    href="/dashboard"
                    className="inline-block px-8 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:opacity-90 transition-opacity"
                >
                    Go to Dashboard
                </a>
            </div>
        </main>
    );
}
