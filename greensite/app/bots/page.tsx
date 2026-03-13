'use client';

export default function BotsPage() {
    return (
        <div className="min-h-screen bg-green-50 p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Bots</h1>
                    <p className="text-xl text-gray-600">
                        Automating the search for a sustainable future.
                    </p>
                </header>

                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-green-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">The Scraper Bot</h2>
                        <p className="text-gray-600 mb-4">
                            Visits 100+ Michigan job boards daily, extracting and classifying roles using natural language processing.
                        </p>
                        <div className="flex items-center space-x-2 text-green-700 font-medium">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span>Status: Active</span>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-green-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">The Matching Engine</h2>
                        <p className="text-gray-600 mb-4">
                            Compares your resume against tens of thousands of roles to find the perfect cultural and skill-based fit.
                        </p>
                        <div className="flex items-center space-x-2 text-green-700 font-medium">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span>Status: Active</span>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-green-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Discord Notify Bot</h2>
                        <p className="text-gray-600 mb-4">
                            Pushes personalized job alerts directly to your Discord server the moment they are discovered.
                        </p>
                        <div className="flex items-center space-x-2 text-green-700 font-medium">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span>Status: Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
