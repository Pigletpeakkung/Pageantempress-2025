export default async (request, context) => {
    const response = await context.next();
    
    // Add performance headers
    response.headers.set('X-Robots-Tag', 'index, follow');
    response.headers.set('X-DNS-Prefetch-Control', 'on');
    
    return response;
};

export const config = {
    path: "/*"
};
