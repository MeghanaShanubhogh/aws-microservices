import { RemovalPolicy } from "aws-cdk-lib";
import { AttributeType, BillingMode, ITable, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class SwnDatabase extends Construct{
    public readonly productTable: ITable;
    public readonly basketTable: ITable;
    public readonly orderTable: ITable;
    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.productTable = this.createProductTable();
        this.basketTable = this.createBasketTable();
        this.orderTable = this.createOrderTable();
    }

    private createProductTable(): ITable {
        //Product DynamoDb Creation
        const productTable = new Table(this, "product",{
            partitionKey: { 
              name: "product_id",
              type: AttributeType.STRING
            },
            tableName : "product",
            removalPolicy: RemovalPolicy.DESTROY,
            billingMode: BillingMode.PAY_PER_REQUEST
          });
          return productTable;
    }
    private createBasketTable(): ITable{
        // Basket DynamoDb Table Creation
        // basket : PK: userName -- items (SET-MAP object) 
          // item1 - { quantity - color - price - productId - productName }
          // item2 - { quantity - color - price - productId - productName }
        const basketTable = new Table(this, "basket",{
            partitionKey: { 
              name: "userName",
              type: AttributeType.STRING
            },
            tableName : "basket",
            removalPolicy: RemovalPolicy.DESTROY,
            billingMode: BillingMode.PAY_PER_REQUEST
          });
        return basketTable;
    }
    private createOrderTable(): ITable{
      // Order DynamoDb Table Creation
    // order : PK: userName - SK: orderDate 
    //-- totalPrice - firstName - lastName - email - address - paymentMethod - cardInfo
      const OrderTable = new Table(this, "Order",{
          partitionKey: { 
            name: "userName",
            type: AttributeType.STRING
          },
          sortKey:{
            name: "orderDate",
            type: AttributeType.NUMBER
          },
          tableName : "Order",
          removalPolicy: RemovalPolicy.DESTROY,
          billingMode: BillingMode.PAY_PER_REQUEST
        });
      return OrderTable;
  }
}