import React from 'react';
import NavigationBar from '../../components/NavigationBar';

const ContactPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#FFFAF0]">
            <NavigationBar />
            <div className="mx-auto max-w-4xl px-4 py-24">
                <h1 className="mb-8 text-center text-4xl font-bold text-gray-800">
                    Om oss
                </h1>

                <div className="rounded-xl bg-white p-8 shadow-lg">
                    {/* Bedriftsinformasjon */}
                    <section className="mb-8">
                        <h2 className="mb-4 text-2xl font-semibold text-gray-800">
                            Om oss
                        </h2>
                    <section className="mb-6">
                        <div className="space-y-4 text-gray-700">
                            <p>
                                Vi er en frivillig forening som støtter Fredrik Møller. Vi liker egentlig ikke å drive butikk, men gjør dette for at flest mulig skal få mulighet til å vise sin støtte gjennom våre produkter.
                            </p>
                            <p>
                                Siden vi tross alt er en fanclub, setter vi pris på at vi kan bruke minst mulig tid på administrasjon av nettbutikken og heller bruke tiden på å heie på Fredrik. Vennligst vurder om det er nødvendig å kontakte oss før du bestiller.
                            </p>
                            <p className="font-medium">
                                Ingen tjener penger på dette — vi er kun en frivillig forening. Ingen får betalt for å svare på henvendelser eller drive butikken, i motsetning til kommersielle aktører.
                            </p>
                        </div>
                    </section>
                        <div className="space-y-3 text-gray-700">
                            <div className="flex flex-col sm:flex-row">
                                <span className="font-semibold min-w-[180px]">Organisasjonsnavn:</span>
                                <span>Møller Fanclub</span>
                            </div>
                            <div className="flex flex-col sm:flex-row">
                                <span className="font-semibold min-w-[180px]">Organisasjonsnummer:</span>
                                <span>836220692</span>
                            </div>
                            <div className="flex flex-col sm:flex-row">
                                <span className="font-semibold min-w-[180px]">Adresse:</span>
                                <span>Haldens Gate 15, 7014 Trondheim</span>
                            </div>
                            <div className="flex flex-col sm:flex-row">
                                <span className="font-semibold min-w-[180px]">E-post:</span>
                                <a href="mailto:kontakt@mollerfanclub.no" className="text-blue-600 hover:underline">
                                    kontakt@mollerfanclub.no
                                </a>
                            </div>

                        </div>
                    </section>
                    
                 </div>
                  </div>
        </div>
    );
};

export default ContactPage;
