export interface BlogPostThumbnailData {
  id: number;
  thumbnailTitle: string; // Clickbate
  date: string;
  excerpt: string;
  image: string;
}

export interface BlogPostFullData extends BlogPostThumbnailData {
  blogPageTitle: string; // Ofte mer beskrivende enn thumbnailTitle
  content: string;
}

/**
 * Alle bloggposter (inkl. tekst for BlogPage)
 */
export const blogPosts: BlogPostFullData[] = [
  {
    id: 1,
    thumbnailTitle: "Det som skjer i Sun Valley, blir i Sun Valley",
    date: "23. mars 2025",
    excerpt:
      "Fanclubben samlet seg til vinterens høydepunkt — med nye drakter, merch og mål om å fylle målområdet med rosa vester.",
    image: "/images/sunvalley_fanclub_img.JPG",
    blogPageTitle: "Sun Valley 2025",
    content: `
      Sun Valley markerte slutten på sesongen 24/25, den virkelige gjennombruddsesongen til Møller.
      Eventyret i Bormio vil vi aldri glemme.

      Mens Norge prøver å kvalifisere seg til fotball-VM, kan vi nyte norsk alpint og Møllern,
      som reiser verden rundt som et levende bevis på mange års målrettet satsing.

      For alpint er faktisk en lagidrett, noe mange glemmer. Når Møllern seirer, er det en seier for hele laget.
      Derfor har vi startet Møller Fanclub, for å kunne ta del i både oppturene og de mange nedturene som følger med denne sporten.
      Dette er ingen medgangssupporter-gjeng, men en ekte fankultur.

      Denne vinteren markerer starten på en ny æra for Møller Fanclub.
      Vi lanserer merch, samler troppene og planlegger den største fankulturen norsk alpinsport har sett siden Kjus & Aamodt.
    `,
  },
  {
    id: 2,
    thumbnailTitle: "Bormio: Toppen av seierspallen",
    date: "29. desember 2024",
    excerpt: "Møllern herjet i isrenna.",
    image: "/images/bormio-24.jpg",
    blogPageTitle: "1.!!! I Bormio gjekke'n reeent!",
    content: `
      Bormio var brutalt, som alltid. Kulda bet i kinnene, og løypa var som en glassplate.
      Flere av de tøffeste utforjernene denne verden har sett ba til arrangører om å slippe å kjøre -det er for tøft.
      Til tross for at mange mente at løypen var slagete, lå skjæret til vår man rent -det er vanskelig å tro det vi ser. 

      Dette var ikke bare en seier for norsk alpin sport, men for hele trøndelag. 
    `,
  },
];

/**
 * Kun data som trengs for BlogSection (thumbnails)
 */
export const blogThumbnails: BlogPostThumbnailData[] = blogPosts.map(
  ({ id, thumbnailTitle, date, excerpt, image }) => ({
    id,
    thumbnailTitle,
    date,
    excerpt,
    image,
  })
);
