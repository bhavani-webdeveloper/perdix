import { Type } from "class-transformer";
import VehicleAccessory = require("./VehicleAccessory");
import VehicleAssetCondition = require("./VehicleAssetCondition");
import VehicleLoanExpense = require("./VehicleLoanExpense");
import VehicleLoanIncome = require("./VehicleLoanIncome");
import VehiclePastValuation = require("./VehiclePastValuation");
import VehiclePhotoCapture = require("./VehiclePhotoCapture");
import VehicleRouteDetail = require("./VehicleRouteDetail");



class VehicleLoanDetails {
	accessories: string;
    accessoriesStatus: boolean;
    accident: boolean;
    accidentRemarks: string;
    airbag: boolean;
    bankReferenceNumber: string;
    batteryCondition: string;
    batteryRemarks: string;
    bodyCondition: string;
    bodyRemarks: string;
    bodyType: string;
    chasisCondition: string;
    chasisNo: string;
    chasisRemarks: string;
    colour: string;
    cubicCapacity: number;
    currentInvoiceValue: number;
    currentMarketValue: number;
    distressValue: number;
    electricalPartsCondition: string;
    electricalPartsRemarks: string;
    engineCondition: string;
    engineNo: string;
    engineRemarks: string;
    engineStarted: boolean;
    estimatedReading: number;
    fitnesscertifiedUpto: string;
    fogLampCondition: string;
    fogLampRemarks: string;
    fuelUsed: string;
    futureLife: number;
    gearBoxCondition: string;
    gearBoxremarks: string;
    hypothecatedTo: string;
    id: number;
    inspectedBy: string;
    inspectionAltitude: string;
    inspectionDate: string;
    inspectionLatitude: string;
    inspectionLongitude: string;
    insuranceCompany: string;
    insuranceIdv: number;
    insurancePolicyNumber: string;
    insurancePolicyType: string;
    insuranceValidTo: string;
    lhFrontCondition: string;
    lhFrontMake: string;
    lhRearCondition: string;
    lhRearMake: string;
    lightWiringCondition: string;
    lightWiringRemarks: string;
    loanId: number;
    majorRepair: boolean;
    make: string;
    makersClassification: string;
    modelUnderProduction: boolean;
    numberPlateCOlour: string;
    odometer: string;
    odometerReading: number;
    operationroute: string;
    originalInvoiceValue: number;
    ownerSerialNo: string;
    paintCondition: string;
    paintRemarks: string;
    permitStatus: string;
    permitValidUpto: string;
    photoFileId1: string;
    photoFileId10: string;
    photoFileId2: string;
    photoFileId3: string;
    photoFileId4: string;
    photoFileId5: string;
    photoFileId6: string;
    photoFileId7: string;
    photoFileId8: string;
    photoFileId9: string;
    photoRemarks1: string;
    photoRemarks10: string;
    photoRemarks2: string;
    photoRemarks3: string;
    photoRemarks4: string;
    photoRemarks5: string;
    photoRemarks6: string;
    photoRemarks7: string;
    photoRemarks8: string;
    photoRemarks9: string;
    photoType1: string;
    photoType10: string;
    photoType2: string;
    photoType3: string;
    photoType4: string;
    photoType5: string;
    photoType6: string;
    photoType7: string;
    photoType8: string;
    photoType9: string;
    powerSteering: boolean;
    powerWindowFont: boolean;
    powerWindowRear: boolean;
    previousRegistrationNumber: string;
    proposedOwnerName: string;
    rcbookStatus: boolean;
    reRegistered: boolean;
    recommendationDate: string;
    recommendationRemarks: string;
    recommendationStatus: string;
    registeredAddress: string;
    registeredOwnerName: string;
    registrationAsPerActual: string;
    registrationAsPerRcbook: string;
    registrationDate: string;
    registrationNumber: string;
    rhFrontCondition: string;
    rhFrontMake: string;
    rhRearMake: string;
    rhrearCondition: string;
    seatingCapacity: string;
    steeringCondiiton: string;
    steeringRemarks: string;
    suspensionCondition: string;
    suspensionRemarks: string;
    taxPaid: string;
    taxValidUpto: string;
    trailer: string;
    transimissionCondition: string;
    transmission: string;
    transmissionRemarks: string;
    tyreRemarks: string;
    tyreType: string;
    unladenWeight: number;
    upholsteryCondition: string;
    upholsteryRemarks: string;
    usedFor: string;
    valuationDate: string;
    valuationPlace: string;
    valuationPurpose: string;
    valuationRating: string;
    variant: string;
    vehicleClass: string;
    vehicleMoved: boolean;
    version: number;

    @Type(() => VehicleAccessory)
    vehicleAccessories: VehicleAccessory[];

    @Type(() => VehicleAssetCondition)
    vehicleAssetConditions: VehicleAssetCondition[];

    @Type(() => VehicleLoanExpense)
    vehicleLoanExpenses: VehicleLoanExpense[];

    @Type(() => VehicleLoanIncome)
    vehicleLoanIncomes: VehicleLoanIncome[];

    @Type(() => VehiclePastValuation)
    vehiclePastValuations: VehiclePastValuation[];

    @Type(() => VehiclePhotoCapture)
    vehiclePhotoCaptures: VehiclePhotoCapture[];

    @Type(() => VehicleRouteDetails)
    vehicleRouteDetails: VehicleRouteDetails[];

}

export = VehicleLoanDetails;