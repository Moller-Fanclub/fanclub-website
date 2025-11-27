export interface Product {
    id: string;
    imageUrls: string[];
    title: string;
    price: string;
    sizes: string[];
    description?: string;
}

export const products: Product[] = [
    {
        id: '1',
        imageUrls: ['/merch/bjoller/bjoller.png'],
        title: 'Møller Bjørn',
        price: '349',
        sizes: ['One Size'],
        description: 'Brun teddybjørn med broderte øyne og nese\n Supermyk plysjpels\n Dybde: 16 cm, bredde: 24 cm, høyde: 20 cm\n Vekt: 106 g\n Materiale bamse: 100 % polyester (resirkulert), materiale T-skjorte: 100 % polyester\n Merke: MiniFeet®',
    },
    {
        id: '2',
        imageUrls: ['/merch/tour-hoodie/tour-hoodie-back.png', '/merch/tour-hoodie/tour-hoodie-front.png', '/merch/tour-hoodie/tour-hoodie-left.png'],
        title: 'Tour Hoodie',
        price: '649',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        description: 'Unisex-snitt: Tettsittende hos menn, videre hos kvinner (bestill et nummer større eller mindre hvis du er i tvil)\n Hette med integrert snor\n Utvendig kengurulomme foran\n Behagelig og glatt stoff (280 g/m²) og myk, børstet innside\n Materiale: 80 % bomull, 20 % polyester (antrasitt: 52 % bomull, 48 % polyester)\n Merke: AWDis',
    },
    {
        id: '3',
        imageUrls: ['/merch/tour-basic/tour-basic-tee-back.png', '/merch/tour-basic/tour-basic-tee-front.png', '/merch/tour-basic/tour-basic-tee-left.png'],
        title: 'Basic Tour Tee',
        price: '449',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        description: 'Regular fit\n Myk stoffkvalitet: 153 g/m² (hvitt: 144 g/m²)\n Materiale: 100 % bomull',
    },
    {
        id: '4',
        imageUrls: ['/merch/south-tee/south-front.png'],
        title: 'South Møller Tee',
        price: '299',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        description: '- Normalt snitt for optimal passform\n - Fargetilpasset jersey-nakkebånd\n - Dobbelt søm i livet og på ermene\n - Elastisk 1x1 ribbestrikket krage\n - Satengetikett innsydd på siden\n - Nøytral størrelsesetikett\n - Gjennomsnittlig Stoffkvalitet: 200 g/m²\n - Materiale: 100 % kjemmet økologisk bomull',
    },
    {
        id: '6',
        imageUrls: ['/merch/boxer/boxer-back.png', '/merch/boxer/boxer-front.png'],
        title: 'Boxer Shorts',
        price: '299',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        description: '- Med omsluttende, fremhevet gummibånd\n - Elastisk jersey, behagelig tøybar og myk å ta på\n - Myk stoffkvalitet: 160 g/m²\n - Materiale: 95 % bomull, 5 % elastan\n - Sertifikater: Global Recycled Standard, GOTS, OEKO-TEX® STANDARD 100\n - Lettstelt: 30 °C vaskbar, kan strykes',
    },
    {
        id: '7',
        imageUrls: ['/merch/tank-top/tank-front.png', '/merch/tank-top/tank-back.png'],
        title: 'Tank Top',
        price: '299',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        description: '- Normalt snitt for optimal passform\n - 1x1 ribbestrikk i halsutsnitt og ermehull\n - Dobbelt søm i livet og på ermene\n - Fargetilpasset jersey-nakkebånd\n - Satengetikett innsydd på siden\n - Nøytral størrelsesetikett\n - Gjennomsnittlig Stoffkvalitet: 200 g/m²\n - Materiale: 100 % kjemmet økologisk bomull',
    },
    {
        id: '8',
        imageUrls: ['/merch/moooller/moooller_back.png', '/merch/moooller/moooller_front.png'],
        title: 'Møøller',
        price: '399',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        description: '- Normalt snitt for optimal passform\n - Fargetilpasset jersey-nakkebånd\n - Dobbelt søm i livet og på ermene\n - Elastisk 1x1 ribbestrikket krage\n - Satengetikett innsydd på siden\n - Nøytral størrelsesetikett\n - Gjennomsnittlig Stoffkvalitet: 200 g/m²\n - Materiale: 100 % kjemmet økologisk bomull',
    },
    {
        id: '9',
        imageUrls: ['/merch/the_botte/the_botte.png', '/merch/the_botte/the_botte_back.png'],
        title: 'The Bøtte',
        price: '349',
        sizes: ['S/M', 'L/XL'],
        description: 'Brodert logo\n 4 metallmaljer gir god luftsirkulasjon\n Klassiske dekosømmer på bremmen\n Fôret sateng-svettebånd\n Materiale: 100 % bomull\n Håndvask anbefales',
    },
    {
        id: '10',
        imageUrls: ['/merch/the_botte/the_botte_marine.png', '/merch/the_botte/the_botte_marine_back.png'],
        title: 'The Bøtte Marine',
        price: '349',
        sizes: ['S/M', 'L/XL'],
        description: 'Brodert logo\n 4 metallmaljer gir god luftsirkulasjon\n Klassiske dekosømmer på bremmen\n Fôret sateng-svettebånd\n Materiale: 100 % bomull\n Håndvask anbefales',
    },
    {
        id: '11',
        imageUrls: ['/merch/moller_pin/moller_pin.png'],
        title: '5x Møller Pin',
        price: '299',
        sizes: ['One Size'],
        description: '5-pakning\n Nål for festing på baksiden\n Diameter: 32 mm\n Materiale: Metall, kunststoff',
    },
    {
        id: '12',
        imageUrls: ['/merch/cap/cap.png', '/merch/cap_left.png', '/merch/cap_right.png', '/merch/cap_in.png'],
        title: 'Møller Cap',
        price: '349',
        sizes: ['One Size'],
        description: 'Brodert logo\n Rett skjerm og avflatet topp\n Størrelsen kan justeres på baksiden\n Skjermen er grønn på undersiden\n Materiale: 100 % polyester',
    },
    {
        id: '69',
        imageUrls: ['/merch/west/front-vest.png', '/merch/west/back-vest.png'],
        title: 'Møller Vest',
        price: '449',
        sizes: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
        description: 'The vest is back!!!\n\n CE_merket – EN 1150:1999\n Tekstil: 100% polyester \nPassform: Unisex\n Vekt: 130 g/m2\n Størrelser barn: XXS – 4/8 år, XS – 8-12 år, S 12-14 år',
    },
];