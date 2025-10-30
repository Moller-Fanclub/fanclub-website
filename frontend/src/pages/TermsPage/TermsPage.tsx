import React from 'react';
import PageContainer from '../../components/PageContainer';
import { ExternalLinks } from '@/Routes';

const TermsPage: React.FC = () => {
    return (
        <PageContainer maxWidth="4xl">
            <h1 className="mb-8 text-center text-4xl font-bold text-white drop-shadow-lg">
                Salgsvilkår
            </h1>

            <div className="rounded-xl bg-white/10 backdrop-blur-md border-2 border-white/20 p-8 shadow-xl">
                    <div className="prose prose-invert max-w-none text-sm">
                        
                        {/* Innledning */}
                        <section className="mb-8">
                            <h2 className="mb-4 text-2xl font-semibold text-white">
                                Innledning
                            </h2>
                            <p className="text-white/90 mb-3">
                                Dette kjøpet er regulert av de nedenstående standard salgsbetingelser for forbrukerkjøp av varer over Internett. Forbrukerkjøp over internett reguleres hovedsakelig av avtaleloven, forbrukerkjøpsloven, markedsføringsloven, angrerettloven og ehandelsloven, og disse lovene gir forbrukeren ufravikelige rettigheter. Lovene er tilgjengelig på{' '}
                                <a href={ExternalLinks.lovdata} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    www.lovdata.no
                                </a>
                                . Vilkårene i denne avtalen skal ikke forstås som noen begrensning i de lovbestemte rettighetene, men oppstiller partenes viktigste rettigheter og plikter for handelen.
                            </p>
                            <p className="text-white/90">
                                Salgsbetingelsene er utarbeidet og anbefalt av Forbrukertilsynet.
                            </p>
                        </section>

                        {/* 1. Avtalen */}
                        <section className="mb-8">
                            <h2 className="mb-4 text-2xl font-semibold text-white">
                                1. Avtalen
                            </h2>
                            <p className="text-white/90 mb-3">
                                Avtalen består av disse salgsbetingelsene, opplysninger gitt i bestillingsløsningen og eventuelt særskilt avtalte vilkår. Ved eventuell motstrid mellom opplysningene, går det som særskilt er avtalt mellom partene foran, så fremt det ikke strider mot ufravikelig lovgivning.
                            </p>
                            <p className="text-white/90">
                                Avtalen vil i tillegg bli utfylt av relevante lovbestemmelser som regulerer kjøp av varer mellom næringsdrivende og forbrukere.
                            </p>
                        </section>

                        {/* 2. Partene */}
                        <section className="mb-8">
                            <h2 className="mb-4 text-2xl font-semibold text-white">
                                2. Partene
                            </h2>
                            <div className="text-white/90 space-y-2">
                                <p>
                                    <strong>Selger:</strong> Møller Fanclub, Haldens Gate 15, 7014 Trondheim
                                </p>
                                <p>E-post: kontakt@mollerfan.club</p>
                                <p>Organisasjonsnummer: 836220692</p>
                                <p className="mt-3">
                                    <strong>Kjøper</strong> er den forbrukeren som foretar bestillingen.
                                </p>
                            </div>
                        </section>



                        {/* 3. Pris */}
                        <section className="mb-8">
                            <h2 className="mb-4 text-2xl font-semibold text-white">
                                3. Pris
                            </h2>
                            <p className="text-white/90">
                                Den oppgitte prisen for varen og tjenester er den totale prisen kjøper skal betale. Denne prisen inkluderer alle avgifter og tilleggskostnader. Ytterligere kostnader som selger før kjøpet ikke har informert om, skal kjøper ikke bære.
                            </p>
                        </section>

                        {/* 4. Avtaleinngåelse */}
                        <section className="mb-8">
                            <h2 className="mb-4 text-2xl font-semibold text-white">
                                4. Avtaleinngåelse
                            </h2>
                            <p className="text-white/90 mb-3">
                                Avtalen er bindende for begge parter når kjøperen har sendt sin bestilling til selgeren.
                            </p>
                            <p className="text-white/90">
                                Avtalen er likevel ikke bindende hvis det har forekommet skrive- eller tastefeil i tilbudet fra selgeren i bestillingsløsningen i nettbutikken eller i kjøperens bestilling, og den annen part innså eller burde ha innsett at det forelå en slik feil.
                            </p>
                        </section>

                        {/* 5. Betalingen */}
                        <section className="mb-8">
                            <h2 className="mb-4 text-2xl font-semibold text-white">
                                5. Betalingen
                            </h2>
                            <p className="text-white/90 mb-3">
                                Selgeren kan kreve betaling for varen fra det tidspunkt den blir sendt fra selgeren til kjøperen.
                            </p>
                            <p className="text-white/90 mb-3">
                                Dersom kjøperen bruker kredittkort eller debetkort ved betaling, kan selgeren reservere kjøpesummen på kortet ved bestilling. Kortet blir belastet samme dag som varen sendes.
                            </p>
                            <p className="text-white/90 mb-3">
                                Ved betaling med faktura, blir fakturaen til kjøperen utstedt ved forsendelse av varen. Betalingsfristen fremgår av fakturaen og er på minimum 14 dager fra mottak.
                            </p>
                            <p className="text-white/90">
                                Kjøpere under 18 år kan ikke betale med etterfølgende faktura.
                            </p>
                        </section>

                        {/* 6. Levering */}
                        <section className="mb-8">
                            <h2 className="mb-4 text-2xl font-semibold text-white">
                                6. Levering
                            </h2>
                            <p className="text-white/90 mb-3">
                                Levering er skjedd når kjøperen, eller hans representant, har overtatt tingen.
                            </p>
                            <p className="text-white/90 mb-3">
                                Hvis ikke leveringstidspunkt fremgår av bestillingsløsningen, skal selgeren levere varen til kjøper uten unødig opphold. Varen skal leveres hos kjøperen med mindre annet er særskilt avtalt mellom partene.
                            </p>

                        </section>

                        {/* 7. Risikoen for varen */}
                        <section className="mb-8">
                            <h2 className="mb-4 text-2xl font-semibold text-white">
                                7. Risikoen for varen
                            </h2>
                            <p className="text-white/90">
                                Risikoen for varen går over på kjøper når han, eller kjøpers representant, har fått varene levert i tråd med punkt 7.
                            </p>
                        </section>

                        {/* 8. Angrerett */}
                        <section className="mb-8">
                            <h2 className="mb-4 text-2xl font-semibold text-white">
                                8. Angrerett
                            </h2>
                            <p className="text-white/90 mb-3">
                                Med mindre avtalen er unntatt fra angrerett, kan kjøperen angre kjøpet av varen i henhold til angrerettloven.
                            </p>
                            <p className="text-white/90 mb-3">
                                Kjøperen må gi selger melding om bruk av angreretten innen 14 dager fra fristen begynner å løpe. I fristen inkluderes alle kalenderdager. Dersom fristen ender på en lørdag, helligdag eller høytidsdag forlenges fristen til nærmeste virkedag.
                            </p>
                            <p className="text-white/90 mb-3">
                                Angrefristen anses overholdt dersom melding er sendt før utløpet av fristen. Kjøper har bevisbyrden for at angreretten er blitt gjort gjeldende, og meldingen bør derfor skje skriftlig (angrerettskjema, e-post eller brev).
                            </p>
                            
                            <p className="text-white/90 mb-2"><strong>Angrefristen begynner å løpe:</strong></p>
                            <ul className="list-disc ml-6 text-white/90 space-y-2 mb-3">
                                <li>Ved kjøp av enkeltstående varer vil angrefristen løpe fra dagen etter varen(e) er mottatt.</li>
                                <li>Selges et abonnement, eller innebærer avtalen regelmessig levering av identiske varer, løper fristen fra dagen etter første forsendelse er mottatt.</li>
                                <li>Består kjøpet av flere leveranser, vil angrefristen løpe fra dagen etter siste leveranse er mottatt.</li>
                            </ul>

                            <p className="text-white/90 mb-3">
                                Angrefristen utvides til 12 måneder etter utløpet av den opprinnelige fristen dersom selger ikke før avtaleinngåelsen opplyser om at det foreligger angrerett og standardisert angreskjema. Tilsvarende gjelder ved manglende opplysning om vilkår, tidsfrister og fremgangsmåte for å benytte angreretten. Sørger den næringsdrivende for å gi opplysningene i løpet av disse 12 månedene, utløper angrefristen likevel 14 dager etter den dagen kjøperen mottok opplysningene.
                            </p>

                            <p className="text-white/90 mb-3">
                                Ved bruk av angreretten må varen leveres tilbake til selgeren uten unødig opphold og senest 14 dager fra melding om bruk av angreretten er gitt. Kjøper dekker de direkte kostnadene ved å returnere varen, med mindre annet er avtalt eller selger har unnlatt å opplyse om at kjøper skal dekke returkostnadene. Selgeren kan ikke fastsette gebyr for kjøperens bruk av angreretten.
                            </p>

                            <p className="text-white/90 mb-3">
                                Kjøper kan prøve eller teste varen på en forsvarlig måte for å fastslå varens art, egenskaper og funksjon, uten at angreretten faller bort. Dersom prøving eller test av varen går utover hva som er forsvarlig og nødvendig, kan kjøperen bli ansvarlig for eventuell redusert verdi på varen.
                            </p>

                            <p className="text-white/90">
                                Selgeren er forpliktet til å tilbakebetale kjøpesummen til kjøperen uten unødig opphold, og senest 14 dager fra selgeren fikk melding om kjøperens beslutning om å benytte angreretten. Selger har rett til å holde tilbake betalingen til han/hun har mottatt varene fra kjøperen, eller til kjøper har lagt frem dokumentasjon for at varene er sendt tilbake.
                            </p>
                        </section>

                        {/* 9. Forsinkelse og manglende levering */}
                        <section className="mb-8">
                            <h2 className="mb-4 text-2xl font-semibold text-white">
                                9. Forsinkelse og manglende levering - kjøperens rettigheter og frist for å melde krav
                            </h2>
                            <p className="text-white/90 mb-3">
                                Dersom selgeren ikke leverer varen eller leverer den for sent i henhold til avtalen mellom partene, og dette ikke skyldes kjøperen eller forhold på kjøperens side, kan kjøperen i henhold til reglene i forbrukerkjøpslovens kapittel 5 etter omstendighetene holde kjøpesummen tilbake, kreve oppfyllelse, heve avtalen og/eller kreve erstatning fra selgeren.
                            </p>
                            <p className="text-white/90 mb-3">
                                Ved krav om misligholdsbeføyelser bør meldingen av bevishensyn være skriftlig (for eksempel e-post).
                            </p>

                            <h3 className="text-lg font-semibold text-white mt-4 mb-2">Oppfyllelse</h3>
                            <p className="text-white/90 mb-3">
                                Kjøper kan fastholde kjøpet og kreve oppfyllelse fra selger. Kjøper kan imidlertid ikke kreve oppfyllelse dersom det foreligger en hindring som selgeren ikke kan overvinne, eller dersom oppfyllelse vil medføre en så stor ulempe eller kostnad for selger at det står i vesentlig misforhold til kjøperens interesse i at selgeren oppfyller. Skulle vanskene falle bort innen rimelig tid, kan kjøper likevel kreve oppfyllelse.
                            </p>
                            <p className="text-white/90 mb-3">
                                Kjøperen taper sin rett til å kreve oppfyllelse om han eller hun venter urimelig lenge med å fremme kravet.
                            </p>

                            <h3 className="text-lg font-semibold text-white mt-4 mb-2">Heving</h3>
                            <p className="text-white/90 mb-3">
                                Dersom selgeren ikke leverer varen på leveringstidspunktet, skal kjøperen oppfordre selger til å levere innen en rimelig tilleggsfrist for oppfyllelse. Dersom selger ikke leverer varen innen tilleggsfristen, kan kjøperen heve kjøpet.
                            </p>
                            <p className="text-white/90 mb-3">
                                Kjøper kan imidlertid heve kjøpet umiddelbart hvis selger nekter å levere varen. Tilsvarende gjelder dersom levering til avtalt tid var avgjørende for inngåelsen av avtalen, eller dersom kjøperen har underrettet selger om at leveringstidspunktet er avgjørende.
                            </p>
                            <p className="text-white/90 mb-3">
                                Leveres tingen etter tilleggsfristen forbrukeren har satt eller etter leveringstidspunktet som var avgjørende for inngåelsen av avtalen, må krav om heving gjøres gjeldende innen rimelig tid etter at kjøperen fikk vite om leveringen.
                            </p>

                            <h3 className="text-lg font-semibold text-white mt-4 mb-2">Erstatning</h3>
                            <p className="text-white/90">
                                Kjøperen kan kreve erstatning for lidt tap som følge av forsinkelsen. Dette gjelder imidlertid ikke dersom selgeren godtgjør at forsinkelsen skyldes hindring utenfor selgers kontroll som ikke med rimelighet kunne blitt tatt i betraktning på avtaletiden, unngått, eller overvunnet følgene av.
                            </p>
                        </section>

                        {/* 10. Mangel ved varen */}
                        <section className="mb-8">
                            <h2 className="mb-4 text-2xl font-semibold text-white">
                                10. Mangel ved varen - kjøperens rettigheter og reklamasjonsfrist
                            </h2>
                            <p className="text-white/90 mb-3">
                                Hvis det foreligger en mangel ved varen må kjøper innen rimelig tid etter at den ble oppdaget eller burde ha blitt oppdaget, gi selger melding om at han eller hun vil påberope seg mangelen. Kjøper har alltid reklamert tidsnok dersom det skjer innen 2 mnd. fra mangelen ble oppdaget eller burde blitt oppdaget. Reklamasjon kan skje senest to år etter at kjøper overtok varen. Dersom varen eller deler av den er ment å vare vesentlig lenger enn to år, er reklamasjonsfristen fem år.
                            </p>
                            <p className="text-white/90 mb-3">
                                Dersom varen har en mangel og dette ikke skyldes kjøperen eller forhold på kjøperens side, kan kjøperen i henhold til reglene i forbrukerkjøpsloven kapittel 6 etter omstendighetene holde kjøpesummen tilbake, velge mellom retting og omlevering, kreve prisavslag, kreve avtalen hevet og/eller kreve erstatning fra selgeren.
                            </p>
                            <p className="text-white/90 mb-3">
                                Reklamasjon til selgeren bør skje skriftlig.
                            </p>

                            <h3 className="text-lg font-semibold text-white mt-4 mb-2">Retting eller omlevering</h3>
                            <p className="text-white/90 mb-3">
                                Kjøperen kan velge mellom å kreve mangelen rettet eller levering av tilsvarende ting. Selger kan likevel motsette seg kjøperens krav dersom gjennomføringen av kravet er umulig eller volder selgeren urimelige kostnader. Retting eller omlevering skal foretas innen rimelig tid. Selger har i utgangspunktet ikke rett til å foreta mer enn to avhjelpsforsøk for samme mangel.
                            </p>

                            <h3 className="text-lg font-semibold text-white mt-4 mb-2">Prisavslag</h3>
                            <p className="text-white/90 mb-3">
                                Kjøper kan kreve et passende prisavslag dersom varen ikke blir rettet eller omlevert. Dette innebærer at forholdet mellom nedsatt og avtalt pris svarer til forholdet mellom tingens verdi i mangelfull og kontraktsmessig stand. Dersom særlige grunner taler for det, kan prisavslaget i stedet settes lik mangelens betydning for kjøperen.
                            </p>

                            <h3 className="text-lg font-semibold text-white mt-4 mb-2">Heving</h3>
                            <p className="text-white/90">
                                Dersom varen ikke er rettet eller omlevert, kan kjøperen også heve kjøpet når mangelen ikke er uvesentlig.
                            </p>
                        </section>

                        {/* 11. Selgerens rettigheter ved kjøperens mislighold */}
                        <section className="mb-8">
                            <h2 className="mb-4 text-2xl font-semibold text-white">
                                11. Selgerens rettigheter ved kjøperens mislighold
                            </h2>
                            <p className="text-white/90 mb-3">
                                Dersom kjøperen ikke betaler eller oppfyller de øvrige pliktene etter avtalen eller loven, og dette ikke skyldes selgeren eller forhold på selgerens side, kan selgeren i henhold til reglene i forbrukerkjøpsloven kapittel 9 etter omstendighetene holde varen tilbake, kreve oppfyllelse av avtalen, kreve avtalen hevet samt kreve erstatning fra kjøperen. Selgeren vil også etter omstendighetene kunne kreve renter ved forsinket betaling, inkassogebyr og et rimelig gebyr ved uavhentede varer.
                            </p>

                            <h3 className="text-lg font-semibold text-white mt-4 mb-2">Oppfyllelse</h3>
                            <p className="text-white/90 mb-3">
                                Selger kan fastholde kjøpet og kreve at kjøperen betaler kjøpesummen. Er varen ikke levert, taper selgeren sin rett dersom han venter urimelig lenge med å fremme kravet.
                            </p>

                            <h3 className="text-lg font-semibold text-white mt-4 mb-2">Heving</h3>
                            <p className="text-white/90 mb-3">
                                Selger kan heve avtalen dersom det foreligger vesentlig betalingsmislighold eller annet vesentlig mislighold fra kjøperens side. Selger kan likevel ikke heve dersom hele kjøpesummen er betalt. Fastsetter selger en rimelig tilleggsfrist for oppfyllelse og kjøperen ikke betaler innen denne fristen, kan selger heve kjøpet.
                            </p>

                            <h3 className="text-lg font-semibold text-white mt-4 mb-2">Renter ved forsinket betaling/inkassogebyr</h3>
                            <p className="text-white/90 mb-3">
                                Dersom kjøperen ikke betaler kjøpesummen i henhold til avtalen, kan selger kreve renter av kjøpesummen etter forsinkelsesrenteloven. Ved manglende betaling kan kravet, etter forutgående varsel, bli sendt til inkasso. Kjøper kan da bli holdt ansvarlig for gebyr etter inkassoloven.
                            </p>

                            <h3 className="text-lg font-semibold text-white mt-4 mb-2">Gebyr ved uavhentede ikke-forskuddsbetalte varer</h3>
                            <p className="text-white/90">
                                Dersom kjøperen unnlater å hente ubetalte varer, kan selger belaste kjøper med et gebyr. Gebyret skal maksimalt dekke selgerens faktiske utlegg for å levere varen til kjøperen. Et slikt gebyr kan ikke belastes kjøpere under 18 år.
                            </p>
                        </section>

                        {/* 12. Garanti */}
                        <section className="mb-8">
                            <h2 className="mb-4 text-2xl font-semibold text-white">
                                12. Garanti
                            </h2>
                            <p className="text-white/90">
                                Garanti som gis av selgeren eller produsenten, gir kjøperen rettigheter i tillegg til de kjøperen allerede har etter ufravikelig lovgivning. En garanti innebærer dermed ingen begrensninger i kjøperens rett til reklamasjon og krav ved forsinkelse eller mangler etter punkt 10 og 11.
                            </p>
                        </section>

                        {/* 13. Personopplysninger */}
                        <section className="mb-8">
                            <h2 className="mb-4 text-2xl font-semibold text-white">
                                13. Personopplysninger
                            </h2>
                            <p className="text-white/90">
                                Behandlingsansvarlig for innsamlede personopplysninger er selger. Med mindre kjøperen samtykker til noe annet, kan selgeren, i tråd med personopplysningsloven, kun innhente og lagre de personopplysninger som er nødvendig for at selgeren skal kunne gjennomføre forpliktelsene etter avtalen. Kjøperens personopplysninger vil kun bli utlevert til andre hvis det er nødvendig for at selger skal få gjennomført avtalen med kjøperen, eller i lovbestemte tilfelle.
                            </p>
                        </section>

                        {/* 14. Konfliktløsning */}
                        <section className="mb-8">
                            <h2 className="mb-4 text-2xl font-semibold text-white">
                                14. Konfliktløsning
                            </h2>
                            <p className="text-white/90 mb-3">
                                Klager rettes til selger innen rimelig tid, jf. punkt 9 og 10. Partene skal forsøke å løse eventuelle tvister i minnelighet. Dersom dette ikke lykkes, kan kjøperen ta kontakt med Forbrukertilsynet for mekling. Forbrukertilsynet er tilgjengelig på telefon 23 400 600 eller{' '}
                                <a href={ExternalLinks.forbrukertilsynet} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    www.forbrukertilsynet.no
                                </a>
                                .
                            </p>
                            <p className="text-white/90">
                                Europa-Kommisjonens klageportal kan også brukes hvis du ønsker å inngi en klage. Det er særlig relevant, hvis du er forbruker bosatt i et annet EU-land. Klagen inngis her:{' '}
                                <a href={ExternalLinks.europaKommisjonensKlageportal} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    http://ec.europa.eu/odr
                                </a>
                                .
                            </p>
                        </section>

                        <p className="text-sm text-white/70 mt-8 text-center">
                            Sist oppdatert: 26/10/2025
                        </p>
                    </div>
                </div>
        </PageContainer>
    );
};

export default TermsPage;
