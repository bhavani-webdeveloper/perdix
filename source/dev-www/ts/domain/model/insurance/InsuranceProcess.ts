///<amd-dependency path="perdixConfig/InsuranceProcessConfig" name="insuranceProcessConfig"/>

import {RepositoryIdentifiers} from '../../shared/RepositoryIdentifiers';
import RepositoryFactory = require('../../shared/RepositoryFactory');
import {IInsuranceRepository} from "./IInsuranceRepository";
import {Observable} from "@reactivex/rxjs";

import {PolicyManager} from "../../shared/PolicyManager";
import {InsurancePolicyFactory} from "./policy/InsurancePolicyFactory";
import InsuranceProcessFactory = require("./InsuranceProcessFactory");
import InsurancePolicyDetails  from "./InsurancePolicyDetails";

import * as _ from 'lodash';



declare var insuranceProcessConfig: Object;

export class InsuranceProcess {
    
       
    insuranceRepo: IInsuranceRepository;
    insurancePolicyDetailsDTO: InsurancePolicyDetails;
  

    constructor() {
        this.insuranceRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Insurance);
    }

    
    save(): any {
        return this.insuranceRepo.create(this)
       
    }
    update(): any {
        return this.insuranceRepo.update(this)
       
    }
    getPremiumAmount():any{
        return this.insuranceRepo.getPremiumAmount(this)
    }
    getInsuranceRecommendation():any{
         return this.insuranceRepo.getInsuranceRecommendation(this)
    }

     static createNewProcess(): Observable<InsuranceProcess> {
        return InsuranceProcessFactory
            .createNew();
            // .flatMap((insuranceProcess) => {
            //     let pm: PolicyManager<LoanProcess> = new PolicyManager<LoanProcess>(loanProcess, LoanPolicyFactory.getInstance(), 'onNew', LoanProcess.getProcessConfig());
            //     return pm.applyPolicies();
            // });
        // let ep = new InsuranceProcess();  
        // ep.insurancePolicyDetailsDTO = new InsurancePolicyDetails();
        // return Observable.of(ep);       
        // let pm: PolicyManager<InsuranceProcess> = new PolicyManager<InsuranceProcess>(ep, InsurancePolicyFactory.getInstance(), 'onNew', InsuranceProcess.getProcessConfig());
        // return pm.applyPolicies();
    }

   
    static fromInsurancePolicyID(id: number): Observable<InsuranceProcess> {
        return InsuranceProcessFactory.createFromInsurancePolicyID(id);
    }

    static get(id: number): Observable<InsuranceProcess> {
        return this.insuranceRepo.getById(id)
            .map(
                (value) => {
                    this.insurancePolicyDetailsDTO = value;
                    // this.loanAccount.currentStage = "SHAHAL STGE";
                    return this;
                }
            )
    } 

    static getProcessConfig() {
        return insuranceProcessConfig;
    }

    
      static getWebHeader = function(opts) {
        var curTime = moment();
        var curTimeStr = curTime.local().format("DD-MM-YYYY HH:MM:SS");
        var printHtml=
        '<div style="border-style: dashed ; padding:27px">' + 
        '<div style="text-align : center">' + '<h4><b>' + "RECEIPT" + '</b></h4>' + '</div>' + 
        '<div style="text-align : center">' + '<h5><b>' + opts.entityName + '</b></h4>' + '</div>' + 
        '<div style="text-align : center">' + '<h6><b>' + opts.branchId + '</b></h6>' + '</div>' + 
        '<div style="text-align : center">' + '<p>' + "Date:" + curTimeStr + '</p>' + '</div>' + 
        '<div style="text-align : center">' + '<p><b>' + "Insurance Registration" + '</b></p>' + '</div>' + 
        '<div style="text-align : center">' + '<p>' + "" + '</p>' + '</div>' +
        '<div style="font-size:13px; width:95%; margin:auto">' + '<p>' + "Branch Id :" +'<span style="border-bottom: 1px solid black; width: 100%;">'+  opts.branchId+ '</span>' + '</p>' + '</div>' + 
        '<div style="font-size:13px;width:95%; margin:auto">' + '<p>' + "Centre Id:"  + '<span style="border-bottom: 1px solid black;">'+opts.centreId + '</span>'+'</p>' + '</div>' + 
        '<div style="font-size:13px;width:95%; margin:auto">' + '<p>' + "Customer Urn:"  + '<span style="border-bottom: 1px solid black;">'+opts.urnNo + '</span>'+'</p>' + '</div>' + 
        '<div style="font-size:13px;width:95%; margin:auto">' + '<p>' + "Beneficiary Name:"  + '<span style="border-bottom: 1px solid black;">'+opts.benificieryName + '</span>'+'</p>' + '</div>' + 
       
        '<div style="text-align : center">' + '<p>' + "" + '</p>' + '</div>' +
        '<div style="text-align : center">' + '<p>' + "" + '</p>' + '</div>' +
        '<br>'+
        '<div style="font-size:13px;width:95%; margin:auto">' + '<p>' + "Sum Insured:"  + '<span style="border-bottom: 1px solid black;">'+opts.sumInsured + '</span>'+'</p>' + '</div>' + 
        '<div style="font-size:13px;width:95%; margin:auto">' + '<p>' + "Total Premium Collected:"  + '<span style="border-bottom: 1px solid black;">'+opts.premiumCollected + '</span>'+'</p>' + '</div>' + 
       
        '<div style="text-align : center">' + '<p>' + "" + '</p>' + '</div>' +
        '<br>';
        return printHtml;
    }
     static getWebFooter = function(opts) {
        var printHtml=
        '<div style="text-align : center">' + '<p>' + "" + '</p>' + '</div>' +
        '<div style="font-size:12px;">' + '<p>' + opts.company_name + '</p>' + '</div>' + 
        '<div style="font-size:12px;">' + '<p>' + "CIN :"+ opts.cin + '</p>' + '</div>' + 
        '<div style="font-size:12px;">' + '<p>' + "Address :"+ opts.address1 + '</p>' + '</div>' + 
        '<div style="font-size:12px;">' + '<p>' + opts.address2 + '</p>' + '</div>' + 
        '<div style="font-size:12px;">' + '<p>' + opts.address3 + '</p>' + '</div>' + 
        '<div style="font-size:12px;">' + '<p>' + "Website :"+ '<a href='+ opts.website +' target="_blank">'+opts.website +'</a>'+ '</p>' + '</div>' + 
        '<div style="font-size:12px;">' + '<p>' + "HelpLine No"+ opts.helpline + '</p>' + '</div>' + 
        '<div style="font-size:12px;">' + '<p>'  + "" + '</p>' + '</div>' + 
        '<div style="font-size:12px;">' + '<p>'  + "" + '</p>' + '</div>' + 
        '<br>'+
        '<div style="font-size:12px;text-align : center">' + '<p>'  + "Signature not required as this is an" + '</p>' + '</div>' + 
        '<div style="font-size:12px;text-align : center">' + '<p>'  + "electronically generated receipt." + '</p>' + '</div>' + 
        '</div>';
        return printHtml;
    }

     static getThermalHeader = function(opts) {
        PrinterData.lines=[];
        var curTime = moment();
        var curTimeStr = curTime.local().format("DD-MM-YYYY HH:MM:SS");
        opts['duplicate'] = opts['duplicate'] || false;
        if (opts['duplicate']) {
            PrinterData.addLine('DUPLICATE', {
                'center': true,
                font: PrinterData.FONT_SMALL_BOLD
            });
        } else {
            PrinterData.addLine('RECEIPT', {
                'center': true,
                font: PrinterData.FONT_SMALL_BOLD
            });
        }

        PrinterData.addLine(opts['entityName'], {
                'center': true,
                font: PrinterData.FONT_SMALL_BOLD
            })
            .addLine(opts['branchId'], {
                'center': true,
                font: PrinterData.FONT_SMALL_NORMAL
            }).addLine("Date : " + curTimeStr, {
                'center': false,
                font: PrinterData.FONT_SMALL_NORMAL
            })
            .addLine("Insurance Registration", {
                'center': true,
                font: PrinterData.FONT_LARGE_BOLD
            })
            .addLine("", {
                'center': true,
                font: PrinterData.FONT_SMALL_NORMAL
            })
            .addKeyValueLine("Branch Id", opts['branchId'], {
                font: PrinterData.FONT_SMALL_NORMAL
            })
            .addKeyValueLine("Centre Id", opts['centreId'], {
                font: PrinterData.FONT_SMALL_NORMAL
            })
            .addKeyValueLine("Customer Urn", opts['urnNo'], {
                font: PrinterData.FONT_SMALL_NORMAL
            }).addKeyValueLine("Beneficiary", opts['benificieryName'], {
                font: PrinterData.FONT_SMALL_NORMAL
            })
            .addLine("", {
                'center': true,
                font: PrinterData.FONT_SMALL_NORMAL
            })
            .addKeyValueLine("Sum Insured:", opts['sumInsured'], {
                font: PrinterData.FONT_SMALL_NORMAL
            })
            .addKeyValueLine("Total Premium Collected", opts['premiumCollected'], {
                font: PrinterData.FONT_SMALL_NORMAL
            })
           
            .addLine("", {});
            return PrinterData;
    }

    static getThermalFooter = function(opts,PData) {
        PData
            .addStrRepeatingLine("-", {
                font: PrinterData.FONT_LARGE_BOLD
            })
            .addLine(opts['company_name'], {
                'center': true,
                font: PrinterData.FONT_SMALL_NORMAL
            })
            .addLine("CIN :" + opts['cin'], {
                'center': true,
                font: PrinterData.FONT_SMALL_NORMAL
            })
            .addLine(opts['address1'], {
                'center': true,
                font: PrinterData.FONT_SMALL_NORMAL
            })
            .addLine(opts['address2'], {
                'center': true,
                font: PrinterData.FONT_SMALL_NORMAL
            })
            .addLine(opts['address3'], {
                'center': true,
                font: PrinterData.FONT_SMALL_NORMAL
            })
            .addLine("Website :" + opts['website'], {
                'center': true,
                font: PrinterData.FONT_SMALL_NORMAL
            })
            .addLine("Helpline No :" + opts['helpline'], {
                'center': true,
                font: PrinterData.FONT_SMALL_NORMAL
            })
            .addLine("", {})
            .addLine("", {})
            .addLine("Signature not required as this is an", {
                'center': true,
                font: PrinterData.FONT_SMALL_NORMAL
            })
            .addLine("electronically generated receipt.", {
                'center': true,
                font: PrinterData.FONT_SMALL_NORMAL
            });
            return PData;
    }



    

   
}
