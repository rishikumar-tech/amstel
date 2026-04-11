import React from 'react';
import PolicyLayout from './PolicyLayout';

const PrivacyPolicy = () => {
    return (
        <PolicyLayout 
            title="PRIVACY" 
            highlight="POLICY" 
            infoText="DATA COLLECTION • USAGE • SECURITY ASSURANCE"
        >
            <section className="mb-12">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6 text-white border-b border-white/5 pb-2 w-fit">
                    DATA COLLECTION INFO
                </h2>
                <p className="text-sm font-black italic tracking-widest text-white/70 leading-relaxed uppercase mb-4">
                    At Amstel Riders, we collect personal information you provide when you purchase, register, or sign up for newsletters.
                </p>
                <ul className="list-disc ml-6 mt-4 space-y-4 text-white/60">
                    <li className="text-sm font-black italic tracking-widest uppercase">
                        NAME, MOBILE NO, AND EMAIL ADDRESS.
                    </li>
                    <li className="text-sm font-black italic tracking-widest uppercase">
                        SHIPPING AND BILLING ADDRESSES.
                    </li>
                    <li className="text-sm font-black italic tracking-widest uppercase">
                        IP ADDRESS & COOKIES FOR ANALYTICS.
                    </li>
                </ul>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6 text-white border-b border-white/5 pb-2 w-fit">
                    USAGE OF DATA
                </h2>
                <p className="text-sm font-black italic tracking-widest text-white/70 leading-relaxed uppercase mb-4">
                    Your information is used solely for order processing, customer support, and communicating updates about our gear.
                </p>
                <p className="text-sm font-black italic tracking-widest text-white/70 leading-relaxed uppercase mb-4">
                    We do NOT sell or share your data with third parties for marketing purposes.
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6 text-white border-b border-white/5 pb-2 w-fit">
                    SECURITY ASSURANCE
                </h2>
                <p className="text-sm font-black italic tracking-widest text-white/70 leading-relaxed uppercase mb-4">
                    All data is transmitted via secure SSL encryption. We follow industry standards to protect your sensitive information.
                </p>
                <p className="text-sm font-black italic tracking-widest text-white/70 leading-relaxed uppercase mb-4">
                    Credit card and payment information is managed by our secure payment gateway partners and never stored on our servers.
                </p>
            </section>
        </PolicyLayout>
    );
};

export default PrivacyPolicy;
