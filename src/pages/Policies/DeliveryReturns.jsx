import React from 'react';
import PolicyLayout from './PolicyLayout';

const DeliveryReturns = () => {
    return (
        <PolicyLayout 
            title="DELIVERY &" 
            highlight="RETURNS" 
            infoText="SHIPPING TIMES • RETURNS POLICY • EASY STEPS"
        >
            <section className="mb-12">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6 text-white border-b border-white/5 pb-2 w-fit">
                    DELIVERY TIME
                </h2>
                <p className="text-sm font-black italic tracking-widest text-white/70 leading-relaxed uppercase mb-4">
                    Orders are typically processed within 24-48 hours. Most deliveries to major cities arrive within 3–7 business days from the date of dispatch.
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6 text-white border-b border-white/5 pb-2 w-fit">
                    RETURN POLICY
                </h2>
                <p className="text-sm font-black italic tracking-widest text-white/70 leading-relaxed uppercase mb-4">
                    Strictly No Returns. All sales are final.
                </p>
                <p className="text-sm font-black italic tracking-widest text-white/60 uppercase leading-relaxed">
                    WE PROVIDE THE HIGHEST QUALITY PREMIUM GEAR. DUE TO THE SPECIFIC NATURE OF OUR PRODUCTS AND FOR HYGIENE REASONS, WE DO NOT ACCEPT ANY RETURNS OR EXCHANGES ONCE AN ORDER HAS BEEN PROCESSED AND DELIVERED.
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6 text-white border-b border-white/5 pb-2 w-fit">
                    IMPORTANT NOTE
                </h2>
                <p className="text-sm font-black italic tracking-widest text-white/70 leading-relaxed uppercase mb-4">
                    Please ensure you have selected the correct size and model before placing your order. If you need assistance with sizing, please contact our support hub.
                </p>
            </section>
        </PolicyLayout>
    );
};

export default DeliveryReturns;
