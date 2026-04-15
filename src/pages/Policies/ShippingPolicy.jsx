import React from 'react';
import PolicyLayout from './PolicyLayout';

const ShippingPolicy = () => {
    return (
        <PolicyLayout 
            title="SHIPPING" 
            highlight="POLICY" 
            infoText="AREAS • CHARGES • DELAYS • TRACKING"
        >
            <section className="mb-12">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6 text-white border-b border-white/5 pb-2 w-fit">
                    DELIVERY AREAS
                </h2>
                <p className="text-sm font-black italic tracking-widest text-white/70 leading-relaxed uppercase mb-4">
                    Amstel Riders ships across India. We use reliable courier partners to ensure your gear reaches you safely.
                </p>
                <ul className="list-disc ml-6 mt-4 space-y-4 text-white/60">
                    <li className="text-sm font-black italic tracking-widest uppercase">
                        MAJOR CITIES: 3-7 BUSINESS DAYS.
                    </li>
                    <li className="text-sm font-black italic tracking-widest uppercase">
                        REMOTE AREAS: 7-10 BUSINESS DAYS.
                    </li>
                </ul>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6 text-white border-b border-white/5 pb-2 w-fit">
                    CHARGES (IF ANY)
                </h2>
                <p className="text-sm font-black italic tracking-widest text-white/70 leading-relaxed uppercase mb-4">
                    Shipping is free on orders above ₹1,000. For orders below that, a nominal charge of ₹50 to ₹100 may apply based on weight and location.
                </p>
                <p className="text-sm font-black italic tracking-widest text-white/70 leading-relaxed uppercase mb-4">
                    Final shipping costs will be displayed at checkout.
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6 text-white border-b border-white/5 pb-2 w-fit">
                    DELAY INFO
                </h2>
                <p className="text-sm font-black italic tracking-widest text-white/70 leading-relaxed uppercase mb-4">
                    While we strive for on-time delivery, delays may occur due to external factors like weather conditions, holidays, or courier disruptions.
                </p>
                <p className="text-sm font-black italic tracking-widest text-white/70 leading-relaxed uppercase mb-4">
                    If your shipment is significantly delayed, please contact support with your order ID.
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6 text-white border-b border-white/5 pb-2 w-fit">
                    TRACKING INFO
                </h2>
                <p className="text-sm font-black italic tracking-widest text-white/70 leading-relaxed uppercase mb-4">
                    Once your order is dispatched, you will receive an email or SMS with tracking details.
                </p>
                <p className="text-sm font-black italic tracking-widest text-white/70 leading-relaxed uppercase mb-4">
                    You can track your package directly through our courier partner's website.
                </p>
            </section>
        </PolicyLayout>
    );
};

export default ShippingPolicy;
