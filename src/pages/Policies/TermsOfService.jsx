import React from 'react';
import PolicyLayout from './PolicyLayout';

const TermsOfService = () => {
    return (
        <PolicyLayout 
            title="TERMS OF" 
            highlight="SERVICE" 
            infoText="USER AGREEMENT • ACCEPTABLE USE • LIMITATIONS"
        >
            <section className="mb-12">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6 text-white border-b border-white/5 pb-2 w-fit">
                    USER AGREEMENT
                </h2>
                <p className="text-sm font-black italic tracking-widest text-white/70 leading-relaxed uppercase mb-4">
                    By accessing or using our website, you agree to be bound by these Terms of Service and all applicable laws.
                </p>
                <p className="text-sm font-black italic tracking-widest text-white/70 leading-relaxed uppercase mb-4">
                    If you do not agree, you should not access or use this site.
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6 text-white border-b border-white/5 pb-2 w-fit">
                    ACCEPTABLE USE
                </h2>
                <ul className="list-disc ml-6 mt-4 space-y-4 text-white/60">
                    <li className="text-sm font-black italic tracking-widest uppercase">
                        YOU MUST BE AT LEAST THE AGE OF MAJORITY IN YOUR PROVINCE.
                    </li>
                    <li className="text-sm font-black italic tracking-widest uppercase">
                        DO NOT USE OUR PRODUCTS FOR ANY ILLEGAL OR UNAUTHORIZED PURPOSES.
                    </li>
                    <li className="text-sm font-black italic tracking-widest uppercase">
                        YOU AGREE NOT TO REPRODUCE, DUPLICATE, OR COPY ANY SERVICE COMPONENTS.
                    </li>
                </ul>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6 text-white border-b border-white/5 pb-2 w-fit">
                    LIMITATIONS
                </h2>
                <p className="text-sm font-black italic tracking-widest text-white/70 leading-relaxed uppercase mb-4">
                    Amstel Riders does not guarantee that the service will be uninterrupted, timely, secure, or error-free.
                </p>
                <p className="text-sm font-black italic tracking-widest text-white/70 leading-relaxed uppercase mb-4">
                    In no case shall Amstel Riders be liable for any injury, loss, claim, or any direct/indirect damages of any kind.
                </p>
                <p className="text-sm font-black italic tracking-widest text-white/70 leading-relaxed uppercase mb-4">
                    Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the service.
                </p>
            </section>
        </PolicyLayout>
    );
};

export default TermsOfService;
