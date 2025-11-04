import {sanityClient} from '@/lib/sanityClient'
import {type PortableTextBlock} from '@sanity/types'
import imageUrlBuilder from '@sanity/image-url'

export interface BlogPostImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
}

export interface BlogPostThumbnailData {
  slug: string
  thumbnailTitle: string
  date: string
  excerpt: string
  imageUrl: string
}

export interface BlogPostFullData extends BlogPostThumbnailData {
  title: string
  content: PortableTextBlock[]
  imageAlt?: string
}

interface SanityBlogPost {
  _id: string
  title: string
  slug: {
    current: string
  }
  thumbnailTitle?: string
  publishedAt: string
  excerpt: string
  mainImage: BlogPostImage
  content: PortableTextBlock[]
  order?: number
}

const imageBuilder = imageUrlBuilder(sanityClient)

/**
 * Convert Sanity image reference to URL
 */
function getImageUrl(image: BlogPostImage, width?: number): string {
  if (!image?.asset?._ref) {
    return ''
  }
  const builder = imageBuilder.image(image)
  if (width) {
    builder.width(width)
  }
  return builder.url()
}

/**
 * Format date from ISO string to Norwegian format
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('no-NO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Convert Sanity blog post to frontend format
 */
function transformPost(post: SanityBlogPost): BlogPostFullData {
  const thumbnailTitle = post.thumbnailTitle || post.title
  // Use full-width image for hero, can be optimized later if needed
  const imageUrl = getImageUrl(post.mainImage)

  return {
    slug: post.slug.current,
    title: post.title,
    thumbnailTitle,
    date: formatDate(post.publishedAt),
    excerpt: post.excerpt,
    imageUrl,
    imageAlt: post.mainImage.alt || post.title,
    content: post.content,
  }
}

/**
 * Convert full blog post to thumbnail format
 */
export function toThumbnailData(post: BlogPostFullData): BlogPostThumbnailData {
  return {
    slug: post.slug,
    thumbnailTitle: post.thumbnailTitle,
    date: post.date,
    excerpt: post.excerpt,
    imageUrl: post.imageUrl,
  }
}

export const blogService = {
  /**
   * Get all blog posts, ordered by published date (newest first)
   */
  async getAllPosts(): Promise<BlogPostFullData[]> {
    const query = `*[_type == "blogPost"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      thumbnailTitle,
      publishedAt,
      excerpt,
      mainImage,
      content,
      order
    }`

    const posts = await sanityClient.fetch<SanityBlogPost[]>(query)
    return posts.map(transformPost)
  },

  /**
   * Get a single blog post by slug
   */
  async getPostBySlug(slug: string): Promise<BlogPostFullData | null> {
    const query = `*[_type == "blogPost" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      thumbnailTitle,
      publishedAt,
      excerpt,
      mainImage,
      content,
      order
    }`

    const post = await sanityClient.fetch<SanityBlogPost | null>(query, {slug})
    return post ? transformPost(post) : null
  },

  /**
   * Get blog posts for thumbnails (ordered by order field, then by date)
   */
  async getThumbnails(): Promise<BlogPostThumbnailData[]> {
    const query = `*[_type == "blogPost"] | order(order asc, publishedAt desc) {
      _id,
      title,
      slug,
      thumbnailTitle,
      publishedAt,
      excerpt,
      mainImage,
      order
    }`

    const posts = await sanityClient.fetch<SanityBlogPost[]>(query)
    return posts.map((post) => toThumbnailData(transformPost(post)))
  },
}

