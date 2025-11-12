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
        imageUrls: ['/merch/moooller/moooller_front.png', '/merch/moooller/moooller_back.png'],
        title: 'Møøller',
        price: '399',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL'],
        description: '- Normalt snitt for optimal passform\n - Fargetilpasset jersey-nakkebånd\n - Dobbelt søm i livet og på ermene\n - Elastisk 1x1 ribbestrikket krage\n - Satengetikett innsydd på siden\n - Nøytral størrelsesetikett\n - Gjennomsnittlig Stoffkvalitet: 200 g/m²\n - Materiale: 100 % kjemmet økologisk bomull (gråmelert & antrasitt melert: 60% viskose, 40% polyester)',
    },
    {
        id: '69',
        imageUrls: ['/merch/west/west_front.png', '/merch/west/west_back.png'],
        title: 'Møller Vest',
        price: '449',
        sizes: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
        description: 'The vest is back, bluer then ever.',
    },
];