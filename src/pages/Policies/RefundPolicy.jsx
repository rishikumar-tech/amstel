import React from 'react';
import PolicyLayout from './PolicyLayout';

const RefundPolicy = () => {
    return (
        <PolicyLayout 
            title="REFUND" 
            highlight="POLICY" 
            infoText="ELIGIBILITY • TIMELINE • PAYMENT METHODS"
        >
            <section className="mb-12">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6 text-white border-b border-white/5 pb-2 w-fit">
                    REFUND POLICY
                </h2>
                <p className="text-sm font-black italic tracking-widest text-white/70 leading-relaxed uppercase mb-4">
                    Strictly No Refunds. All sales are final.
                </p>
                <p className="text-sm font-black italic tracking-widest text-white/60 uppercase leading-relaxed">
                    AMSTEL RIDERS ADHERES TO A RIGID NO-REFUND POLICY. ONCE AN ORDER IS PLACED, PAID FOR, AND DISPATCHED, WE DO NOT PROVIDE ANY REFUNDS OR STORE CREDITS. 
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6 text-white border-b border-white/5 pb-2 w-fit">
                    EXCEPTIONS
                </h2>
                <p className="text-sm font-black italic tracking-widest text-white/70 leading-relaxed uppercase mb-4">
                    THE ONLY EXCEPTIONS TO THIS POLICY ARE:
                </p>
                <ul className="list-disc ml-6 mt-4 space-y-4">
                    <li className="text-sm font-black italic tracking-widest text-white/60 uppercase">
                        IF THE PRODUCT IS DAMAGED DURING TRANSIT (PROOF REQUIRED).
                    </li>
                    <li className="text-sm font-black italic tracking-widest text-white/60 uppercase">
                        IF THE WRONG PRODUCT WAS SHIPPED BY OUR WAREHOUSE.
                    </li>
                </ul>
                <p className="text-sm font-black italic tracking-widest text-white/60 uppercase mt-8 italic">
                    IN THESE RARE CASES, WE WILL PROVIDE A REPLACEMENT OF THE SAME MODEL AND SIZE.
                </p>
            </section>
        </PolicyLayout>
    );
};

export default RefundPolicy;
