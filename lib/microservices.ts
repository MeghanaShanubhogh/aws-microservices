import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";
import { ITable, Table } from "aws-cdk-lib/aws-dynamodb";

interface SwnMicroservicesProps{
    productTable:ITable
    basketTable: ITable
    orderTable: ITable
}

export class SwnMicroservices extends Construct{
    public readonly productMicroservice: NodejsFunction;
    public readonly basketMicroservice: NodejsFunction;
    public readonly orderMicroservice: NodejsFunction;

    constructor(scope: Construct, id: string, props: SwnMicroservicesProps) {
        super(scope, id);
        
        this.productMicroservice = this.createProductMicroservice(props.productTable);
        this.basketMicroservice = this.createBasketMicroservice(props.basketTable);
        this.orderMicroservice = this.createOrderMicroservice(props.orderTable);
    }
    private createProductMicroservice(productTable: ITable): NodejsFunction
  {
        const productFunctionProps: NodejsFunctionProps = {
            bundling: {
              externalModules: [
                'aws-sdk'
              ]
            },
            environment : {
              PRIMARY_KEY: 'id',
              DYNAMODB_TABLE_NAME: productTable.tableName
            },
            runtime: Runtime.NODEJS_14_X   
          };
          const productFunction = new NodejsFunction(this, 'productLambdaFunction',  {
            entry: join(__dirname, `/../src/product/index.js`), 
            ...productFunctionProps 
          });
          productTable.grantReadWriteData(productFunction);
          return productFunction;
    }
    private createBasketMicroservice(basketTable: ITable): NodejsFunction
    {
        const basketFunctionProps: NodejsFunctionProps = {
            bundling: {
              externalModules: [
                'aws-sdk'
              ]
            },
            environment : {
              PRIMARY_KEY: 'userName',
              DYNAMODB_TABLE_NAME: basketTable.tableName,
              EVENT_SOURCE: "com.swn.basket.checkoutbasket",
              EVENT_DETAILTYPE: "CheckoutBasket",
              EVENT_BUSNAME: "SwnEventBus"
            },
            runtime: Runtime.NODEJS_14_X   
          };
          const basketFunction = new NodejsFunction(this, 'basketLambdaFunction',  {
            entry: join(__dirname, `/../src/basket/index.js`), 
            ...basketFunctionProps 
          });
          basketTable.grantReadWriteData(basketFunction);
          return basketFunction;
    }
    private createOrderMicroservice(OrderTable: ITable): NodejsFunction
  {
        const orderFunctionProps: NodejsFunctionProps = {
            bundling: {
              externalModules: [
                'aws-sdk'
              ]
            },
            environment : {
              PRIMARY_KEY: 'userName',
              SORT_KEY: 'orderDate',
              DYNAMODB_TABLE_NAME: OrderTable.tableName
            },
            runtime: Runtime.NODEJS_14_X   
          };
          const orderFunction = new NodejsFunction(this, 'orderLambdaFunction',  {
            entry: join(__dirname, `/../src/ordering/index.js`), 
            ...orderFunctionProps 
          });
          OrderTable.grantReadWriteData(orderFunction);
          return orderFunction;
    }
        
}
