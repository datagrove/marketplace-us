// 1. Import utilities from `astro:content`
import { z, defineCollection } from 'astro:content';
// 2. Define your collection(s)
const policiesCollection = defineCollection({
    type: 'content',
    schema: z.object({
    }),
});

const aboutCollection = defineCollection({
    type: 'content',
    schema: z.object({
    }),
})

export const collections = {
    'policies': policiesCollection,
    'about': aboutCollection
}