export const PublicPaths = {
  base: "/",
  calender: "/calender",
  about: "/about",
  comingSoon: "/coming-soon",
  merch: "/merch",
  merchProduct: "/merch/:id",
  checkout: "/checkout",
  contact: "/contact",
  terms: "/terms",
  blog: {
    show: "/blog/:slug",
    useShow: (slug: string) => `/blog/${slug}`
    }
};

export const ExternalLinks = {
  mollerfanClubInstagram: "https://www.instagram.com/mollerfan.club",
  lovdata: "https://www.lovdata.no",
  forbrukertilsynet: "https://www.forbrukertilsynet.no",
  europaKommisjonensKlageportal: "http://ec.europa.eu/odr",
}

