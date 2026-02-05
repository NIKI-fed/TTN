import React from "react";
import "./DataTable.css";
import { formatDate, groupBy, totalVolume, safeToFixed} from "../utils/utils";

const DataTable = ({ data }) => {

    const groupData = (data) => {

        // Группировка по клиентам и их сортировка по алфавиту
        const groupedByClient = groupBy(data, "client", "Без клиента");
        const sortedClients = Object.keys(groupedByClient).sort();

        const result = [];

        sortedClients.forEach((client) => {
            const clientItems = groupedByClient[client];

            // Считаем общий объём для каждого клиента
            const totalVolumeClient = totalVolume(clientItems)

            result.push({
                type: "client",
                name: client,
                totalVolumeClient: totalVolumeClient
            });

            // Группировка по адресам и их сортировка по алфавиту
            const groupedByAddress = groupBy(clientItems, "address", "Без адреса");
            const sortedAddresses = Object.keys(groupedByAddress).sort();

            sortedAddresses.forEach((address) => {
                const addressItems = groupedByAddress[address];

                // Считаем общий объём для каждого адреса
                const totalVolumeAddress = totalVolume(addressItems)

                result.push({
                    type: "address",
                    name: address,
                    totalVolumeAddress: totalVolumeAddress
                });

                // Группировка по продуктам и их сортировка по алфавиту
                const groupedByProduct = groupBy(addressItems, "product", "Без продукции");
                const sortedProducts = Object.keys(groupedByProduct).sort();
                
                sortedProducts.forEach((product) => {
                    const productItems = groupedByProduct[product];

                    // Считаем общий объём для каждого продукта
                    const totalVolumeProduct = totalVolume(productItems)

                    result.push({
                        type: "product",
                        name: product,
                        totalVolume: totalVolumeProduct
                    });

                    productItems.forEach((item) => {
                        result.push({
                            type: "item",
                            data: item
                        });
                    });
                });
            });
        });

        return result;
    };

    // Получаем итоговый массив с данными, который будем отрисовывать в таблицу
    const flattenedData = groupData(data);

    // console.log(flattenedData)

    const renderRow = (row, rowIndex) => {
        switch (row.type) {
            case "client":
                return (
                    <tr key={`client-${row.name}-${rowIndex}`} className="group-row client-row">
                        <td className="group-title" colSpan="4">{row.name}</td>
                        <td className="total-volume">{safeToFixed(row.totalVolumeClient)}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                );

            case "address":
                return (
                    <tr key={`address-${row.name}-${rowIndex}`} className="group-row address-row">
                        <td></td>
                        <td className="group-title" colSpan="3">{row.name}</td>
                        <td className="total-volume">{safeToFixed(row.totalVolumeAddress)}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                );

            case "product":
                return (
                    <tr key={`product-${row.name}-${rowIndex}`} className="group-row product-row">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className="group-title">{row.name}</td>
                        <td className="total-volume">{safeToFixed(row.totalVolume)}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                );

            case "item":
                const item = row.data;
                const uniqueKey = `item-${item.id || 'no-id'}-${item.date_waybill_issue || 'no-date'}-${rowIndex}`;
                return (
                    <tr
                        key={uniqueKey}
                        className="detail-row"
                        onClick={() => (window.location.href = item.url)}
                        style={{ cursor: "pointer" }}
                    >
                        <td className="product-row">{formatDate(item.date_waybill_issue)}</td>
                        <td className="product-row">{item.id}</td>
                        <td className="product-row">{item.plant_name || "-"}</td>
                        <td className="text-align-left">{item.product || "-"}</td>
                        <td>{safeToFixed(item.volume)}</td>
                        <td>-</td>
                        <td className="text-align-left">{item.carrier || "-"}</td>
                        <td className="text-align-left">{item.license_plate || "-"}</td>
                        <td className="text-align-left">{item.driver_name || "-"}</td>
                    </tr>
                );

            default:
                return null;
        }
    };

    return (
        <div className="data-table-container">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Дата<br />ТТН</th>
                        <th>Номер<br />ТТН</th>
                        <th>П.<br />отгр</th>
                        <th>Заказчик/Объект/<br />Наименование продукции</th>
                        <th>Объём<br />м<sup>3</sup></th>
                        <th>Сумма<br />перевозки</th>
                        <th>Перевозчик</th>
                        <th>№ АБС<br />авто-<br />мобиля</th>
                        <th>Водитель,<br />ФИО</th>
                    </tr>
                    </thead>
                <tbody>
                    {flattenedData.map((row, index) => renderRow(row, index))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
