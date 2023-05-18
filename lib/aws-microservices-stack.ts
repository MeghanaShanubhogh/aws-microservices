import {Stack, StackProps, RemovalPolicy} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { SwnDatabase } from './database';
import { SwnMicroservices } from './microservices';
import { SwnApiGateWay } from './apigateway';
import { SwnEventBus } from './event-bus';
import { SwnQueue } from './queue';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwsMicroservicesStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const database = new SwnDatabase(this, "database");

    const microservices = new SwnMicroservices(this,"microservices",{
      productTable: database.productTable,
      basketTable: database.basketTable,
      orderTable: database.orderTable
    });

    const apigateway = new SwnApiGateWay(this,"ApiGateway",{
      productMicroservice: microservices.productMicroservice,
      basketMicroservice: microservices.basketMicroservice,
      orderMicroservice: microservices.orderMicroservice
    });

    const sqsQueue = new SwnQueue(this, "SQS",{
      consumer: microservices.orderMicroservice
    });

    const eventBus = new SwnEventBus(this, "EventBus",{
      //targetFunction: microservices.orderMicroservice,
      targetQueue: sqsQueue.orderQueue,
      publisherFunction:microservices.basketMicroservice 
    });

    
  }
}
