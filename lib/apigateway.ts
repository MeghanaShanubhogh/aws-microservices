import { Resource } from "aws-cdk-lib";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
interface SwnApiGatewayProps{
    productMicroservice: IFunction,
    basketMicroservice: IFunction,
    orderMicroservice: IFunction
}

export class SwnApiGateWay extends Construct {

    constructor(scope: Construct, id: string,props: SwnApiGatewayProps) {
      super(scope, id);
        //Api Development
      this.createProductApiGateway(props.productMicroservice);
      this.createBasketApiGateway(props.basketMicroservice);
      this.createOrderApiGateway(props.orderMicroservice);
    }
     private createProductApiGateway(productMicroservice : IFunction): LambdaRestApi
     {
        const productApiGateway = new LambdaRestApi(this, 'productApi',{
            handler: productMicroservice,
            restApiName: 'Product Service',
            proxy: false
          });
      
          //root name - /product
          //Get /product
          //POST /product
          const products = productApiGateway.root.addResource('product');
          products.addMethod('GET');  // GET /product
          products.addMethod('POST'); // POST /product
          
          //Get /product/{id}
          //Post /product/{id}
          //Delete /product/{id}
          const product = products.addResource('{product_id}');
          product.addMethod('GET');   // GET /product/{product_id}
          product.addMethod('PUT');   // POST /product/{product_id}
          product.addMethod('DELETE');   // DELETE /product/{product_id}

          return productApiGateway;
     } 
     private createBasketApiGateway(basketMicroservice : IFunction)
     {
        // Basket microservices api gateway
        // root name = basket

        // GET /basket
        // POST /basket

        // // Single basket with userName parameter - resource name = basket/{userName}
        // GET /basket/{userName}
        // DELETE /basket/{userName}

        // checkout basket async flow
        // POST /basket/checkout
        const basketApiGateway = new LambdaRestApi(this, 'basketApi',{
            handler: basketMicroservice,
            restApiName: 'Basket Service',
            proxy: false
          });
      
          //root name - /basket
          //Get /basket
          //POST /basket
          const baskets = basketApiGateway.root.addResource('basket');
          baskets.addMethod('GET');  // GET /basket
          baskets.addMethod('POST'); // POST /basket
          
          const basket = baskets.addResource('{userName}');
          basket.addMethod('GET');   // GET /product/{userName}
          basket.addMethod('DELETE');   // DELETE /product/{userName}

          const basketCheckout = baskets.addResource('checkout');
          basketCheckout.addMethod('POST'); // POST /basket/checkout
          // expected request payload : { userName : swn }
          
     } 
     private createOrderApiGateway(OrderMicroservice : IFunction): Resource
     {
        const OrderApiGateway = new LambdaRestApi(this, 'OrderApi',{
            handler: OrderMicroservice,
            restApiName: 'Order Service',
            proxy: false
          });
      
          // Ordering microservices api gateway
        // root name = order
        // GET /order
	    // GET /order/{userName}
        // expected request : xxx/order/swn?orderDate=timestamp
        // ordering ms grap input and query parameters and filter to dynamo db

          const order = OrderApiGateway.root.addResource('order');
          order.addMethod('GET');  // GET /order
          
          //Get /product/{id}
          //Post /product/{id}
          //Delete /product/{id}
          const singleOrder = order.addResource('{userName}');
          singleOrder.addMethod('GET');  
          // GET /order/{userName}
            // expected request : xxx/order/swn?orderDate=timestamp
            // ordering ms grap input and query parameters and filter to dynamo db
          return singleOrder;
     } 
}  