'use client';

export default function LinksPage() {
    const categories = [
        {
            title: "Sustainable Organizations",
            links: [
                { name: "Michigan Sustainable Business Forum", url: "#" },
                { name: "EcoWorks Detroit", url: "#" },
                { name: "Michigan Environmental Council", url: "#" },
            ],
        },
        {
            title: "Career Resources",
            links: [
                { name: "Green Job Interview Tips", url: "#" },
                { name: "Sustainable Resume Writing", url: "#" },
                { name: "Eco-Certification Guide", url: "#" },
            ],
        },
        {
            title: "Community",
            links: [
                { name: "Michigan Green Networking", url: "#" },
                { name: "Spartans in Sustainability", url: "#" },
                { name: "Greenify Support Discord", url: "#" },
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-green-50 p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Useful Links</h1>
                    <p className="text-xl text-gray-600">
                        Curated resources for the Michigan green professional.
                    </p>
                </header>

                <div className="grid md:grid-cols-2 gap-8">
                    {categories.map((category) => (
                        <div key={category.title} className="bg-white p-8 rounded-2xl shadow-sm border border-green-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">{category.title}</h2>
                            <ul className="space-y-3">
                                {category.links.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.url}
                                            className="text-green-700 hover:text-green-900 font-medium hover:underline transition-all"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
