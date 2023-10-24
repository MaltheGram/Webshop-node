import swaggerJsdoc from "swagger-jsdoc"


const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'Webshop API for Database Course',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./docs/swaggerDocs.json'], // This location would depend on where your route files are.
};

const specs = swaggerJsdoc(options);

export default {
    specs
}
