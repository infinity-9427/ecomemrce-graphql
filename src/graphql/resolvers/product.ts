import prisma from "../../config/prismaClient.js";

export const productResolvers = {
    Query: {
      product: async (_: any, { id }: { id: number }) => {
        const product = await prisma.product.findUnique({
          where: { id },
          include: {
            categories: {
              include: { category: true }
            }
          }
        });
        if (product) {
          return { 
            ...product, 
            categories: product.categories?.map((pc: any) => pc?.category) || []
          };
        }
        return null;
      },
      products: async (_: any, __: any) => {
        const products = await prisma.product.findMany({
          include: {
            categories: {
              include: { category: true }
            }
          }
        });
        return products.map((product: any) => ({
          ...product,
          categories: product.categories?.map((pc: any) => pc?.category) || []
        }));
      }
    },
    Mutation: {
        createProduct: async ( _: any, { input }: any ) => {
            try {
                const { title, description, price, images, categoryIds } = input;
                // Create the product.
                const newProduct = await prisma.product.create( {
                    data: {
                        title,
                        description,
                        price,
                        images, // Ensure this conforms to your JSON column.
                    }
                } );

                // Create join records if categoryIds are provided.
                if ( categoryIds && categoryIds.length > 0 ) {
                    await Promise.all(
                        categoryIds.map( ( categoryId: number ) =>
                            prisma.productCategory.create( {
                                data: {
                                    productId: newProduct.id,
                                    categoryId,
                                }
                            } )
                        )
                    );
                }

                // Fetch the product with its join data.
                const product = await prisma.product.findUnique( {
                    where: { id: newProduct.id },
                    include: {
                        categories: {
                            include: { category: true }
                        }
                    }
                } );

                // Debug logging to inspect the data shape.
                console.log( "Created product:", product );

                if ( product ) {
                    // IMPORTANT: Make sure you're accessing 'pc.category', not 'pc.product'
                    const categories = product.categories
                        ? product.categories.map( ( pc: any ) => ( pc && pc.category ? pc.category : null ) ).filter( Boolean )
                        : [];
                    return {
                        ...product,
                        categories,
                    };
                }
                return null;
            } catch ( error ) {
                console.error( "Error creating product:", error );
                throw error;
            }
        },
        updateProduct: async ( _: any, { id, input }: any ) => {
            try {
                const { title, description, price, images, categoryIds } = input;

                const updatedProduct = await prisma.product.update( {
                    where: { id },
                    data: { title, description, price, images }
                } );

                // Update categories: remove old ones and create new join records.
                await prisma.productCategory.deleteMany( { where: { productId: id } } );

                if ( categoryIds && categoryIds.length > 0 ) {
                    await Promise.all(
                        categoryIds.map( ( categoryId: number ) =>
                            prisma.productCategory.create( {
                                data: { productId: id, categoryId }
                            } )
                        )
                    );
                }

                const product = await prisma.product.findUnique( {
                    where: { id },
                    include: {
                        categories: {
                            include: { category: true }
                        }
                    }
                } );

                if ( product ) {
                    return {
                        ...product,
                        categories: product.categories?.map( ( pc: any ) => pc?.category ) || []
                    };
                }
                return null;
            } catch ( error ) {
                console.error( "Error updating product:", error );
                throw error;
            }
        },
        deleteProduct: async ( _: any, { id }: { id: number } ) => {
            try {
                await prisma.productCategory.deleteMany( { where: { productId: id } } );
                const deletedProduct = await prisma.product.delete( { where: { id } } );
                return deletedProduct;
            } catch ( error ) {
                console.error( "Error deleting product:", error );
                throw error;
            }
        }
    }
};
