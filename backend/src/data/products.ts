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
        imageUrls: ['/merch/basic-tee-front.png', '/merch/basic-tee-left.png'],
        title: 'Basic Tee',
        price: '-',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        description: 'Classic basic tee in premium cotton',
    },
    {
        id: '2',
        imageUrls: ['/merch/tour-hoodie-back.png', '/merch/tour-hoodie-front.png', '/merch/tour-hoodie-left.png'],
        title: 'Tour Hoodie',
        price: '-',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        description: 'Comfortable hoodie perfect for cold race days',
    },
    {
        id: '3',
        imageUrls: ['/merch/tour-basic-tee-back.png', '/merch/tour-basic-tee-front.png', '/merch/tour-basic-tee-left.png'],
        title: 'Basic Tour Tee',
        price: '-',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        description: 'Tour edition basic tee with special design',
    },
    {
        id: '4',
        imageUrls: ['/merch/premium-tee-front.png', '/merch/premium-tee-left.png'],
        title: 'Premium Tee',
        price: '-',
        sizes: ['S', 'M', 'L', 'XL'],
        description: 'Premium quality t-shirt for true fans',
    },
    {
        id: '5',
        imageUrls: ['/merch/bear-front.png', '/merch/bear-back.png'],
        title: 'Bamse',
        price: '-',
        sizes: ['One Size'],
        description: 'Adorable teddy bear mascot',
    },
];
