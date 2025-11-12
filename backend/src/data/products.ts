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
        imageUrls: ['/merch/basic-tee/basic-tee-front.png', '/merch/basic-tee/basic-tee-left.png'],
        title: 'Basic Tee',
        price: '349',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        description: 'Classic basic tee in premium cotton',
    },
    {
        id: '2',
        imageUrls: ['/merch/tour-hoodie/tour-hoodie-back.png', '/merch/tour-hoodie/tour-hoodie-front.png', '/merch/tour-hoodie/tour-hoodie-left.png'],
        title: 'Tour Hoodie',
        price: '649',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        description: 'Comfortable hoodie perfect for cold race days',
    },
    {
        id: '3',
        imageUrls: ['/merch/tour-basic/tour-basic-tee-back.png', '/merch/tour-basic/tour-basic-tee-front.png', '/merch/tour-basic/tour-basic-tee-left.png'],
        title: 'Basic Tour Tee',
        price: '399',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        description: 'Tour edition basic tee with special design',
    },
    {
        id: '4',
        imageUrls: ['/merch/premium-tee/premium-tee-front.png', '/merch/premium-tee/premium-tee-left.png'],
        title: 'Premium Tee',
        price: '449',
        sizes: ['S', 'M', 'L', 'XL'],
        description: 'Premium quality t-shirt for true fans',
    },
    {
        id: '5',
        imageUrls: ['/merch/bear/bear-front.png', '/merch/bear/bear-back.png'],
        title: 'Bamse',
        price: '299',
        sizes: ['One Size'],
        description: 'Adorable teddy bear mascot',
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
        id: '69',
        imageUrls: ['/merch/west/west_front.png', '/merch/west/west_back.png'],
        title: 'Møller Vest',
        price: '449',
        sizes: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
        description: 'The vest is back, bluer then ever.',
    },
];