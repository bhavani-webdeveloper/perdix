import { Type } from "class-transformer";

import AgentFeeDetails = require("./AgentFeeDetails");
import Customer = require("../customer/Customer");

class Agent {
    agentCompanyId: number;
    agentEmployees: Agent[];
    agentRegistrationNumber: string;
    agentType: string;
    companyName: string;
    currentStage: string;
    customerId: number;
    designation: string;
    id: number;
    isActive: boolean;
    subType: string;
    udf1: string;
    udf2: string;
    udf3: string;
    udf4: string;
    udf5: string;
    udfDate1: string;
    udfDate2: string;
    udfDate3: string;
    version: number;

    @Type(() => Customer)
    customer: Customer;

    @Type(() => AgentFeeDetails)
    agentFeeDetails: AgentFeeDetails[];

    public static createFromJSON(data:any) {

    }
}


export = Agent;
