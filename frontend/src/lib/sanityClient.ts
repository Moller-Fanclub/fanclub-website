import {createClient} from '@sanity/client'

export const sanityClient = createClient({
  projectId: 'xgm785qx',
  dataset: 'production',
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: '2025-11-04', // use current date (YYYY-MM-DD) to target the latest API version
})

