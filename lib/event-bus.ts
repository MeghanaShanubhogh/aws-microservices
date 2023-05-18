import { EventBus, Rule } from "aws-cdk-lib/aws-events";
import { LambdaFunction, SqsQueue } from "aws-cdk-lib/aws-events-targets";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { IQueue, Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

interface EventBusProps{
    publisherFunction: IFunction,
    //targetFunction: IFunction,
    targetQueue: IQueue
}
export class SwnEventBus extends Construct {
    constructor(scope: Construct, id: string, props: EventBusProps) {
        super(scope, id);
        //eventbus
        const bus = new EventBus(this, 'SwnEventBus', {
            eventBusName: 'SwnEventBus'
        });
    
        const checkoutBasketRule = new Rule(this, 'CheckoutBasketRule', {
            eventBus: bus,
            enabled: true,
            description: 'When Basket microservice checkout the basket',
            eventPattern: {
                source: ['com.swn.basket.checkoutbasket'],
                detailType: ['CheckoutBasket']
            },
            ruleName: 'CheckoutBasketRule'
        });
    
        // need to pass target to Ordering Lambda service
        checkoutBasketRule.addTarget(new SqsQueue(props.targetQueue)); 
        
        bus.grantPutEventsTo(props.publisherFunction);
            // AccessDeniedException - is not authorized to perform: events:PutEvents
    }
}