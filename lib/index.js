#!/usr/bin/env node
import axios from 'axios';
import { logError, logMessage } from './logger.js';
import MESSAGES from './messages.js';

const [, , ...args] = process.argv;

if (!args.length) {
    logError(MESSAGES.PROVIDE_ID);
} else {
    const id = args[0];

    try {
        const { data: trackingData } = await axios.get(
            `https://www.yurticikargo.com/service/shipmentstracking?id=${id}&language=tr`
        );

        if (trackingData.ErrorMessage) {
            logError(trackingData.ErrorMessage);
        } else {
            const { data: movementDatas } = await axios.get(
                `https://www.yurticikargo.com/service/shipmenttrackingmovement?id=${id}&language=tr`
            );

            if (movementDatas.ErrorMessage) {
                logError(movementDatas.ErrorMessage);
            } else {
                const {
                    ShipmentStatus,
                    Sender,
                    Receiver,
                    DepartureCityName,
                    DepartureCountyName,
                    DeliveryCityName,
                    DeliveryCountyName,
                    ShipmentDate,
                    EstimatedDeliveryDate,
                    DeliveryUnitName,
                    ProductName,
                    PaymentType,
                    DeliveryUnitTel
                } = trackingData;
                logMessage(MESSAGES.ID, id);
                logMessage(MESSAGES.STATUS, ShipmentStatus);
                logMessage(MESSAGES.SENDER, Sender);
                logMessage(MESSAGES.RECEIVER, Receiver);
                logMessage(
                    MESSAGES.FROM,
                    `${DepartureCityName}/${DepartureCountyName}`
                );
                logMessage(
                    MESSAGES.TO,
                    `${DeliveryCityName}/${DeliveryCountyName}`
                );
                logMessage(MESSAGES.SHIPMENT_DATE, ShipmentDate);
                logMessage(
                    MESSAGES.ESTIMATED_DELIVERY_DATE,
                    EstimatedDeliveryDate
                );
                logMessage(MESSAGES.DELIVERY_UNIT_NAME, DeliveryUnitName);
                logMessage(MESSAGES.PHONE_NUMBER, DeliveryUnitTel);

                const getPaymentType = type => {
                    switch (type) {
                        case 0:
                            return 'Alıcı Ödemeli';
                        case 1:
                            return 'Gönderici Ödemeli';
                        default:
                            return 'Bilinmiyor';
                    }
                };

                logMessage(
                    MESSAGES.DELIVERY_TYPE,
                    `${ProductName} - ${getPaymentType(PaymentType)}`
                );

                for (const {
                    EventDate,
                    Branch,
                    Description,
                    DetailDescription
                } of movementDatas) {
                    console.log('\n');
                    logMessage(MESSAGES.DATE, EventDate);
                    logMessage(MESSAGES.BRANCH, Branch || MESSAGES.NULL);
                    logMessage(MESSAGES.STATUS, Description);
                    logMessage(
                        MESSAGES.DESCRIPTION,
                        DetailDescription || MESSAGES.NULL
                    );
                }
            }
        }
    } catch (error) {
        logError(error);
    }
}
